import React, { useState, useEffect } from "react";
import { Product, Language, Category } from "../types";
import { translations } from "../translations";
import { db, auth, storage } from "../lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User 
} from "firebase/auth";
import { 
  ref as storageRef, 
  uploadString,
  uploadBytesResumable, 
  getDownloadURL 
} from "firebase/storage";
import { X, Lock, Key, Plus, Trash2, Edit2, Upload, AlertCircle, Save, LogIn } from "lucide-react";

// Convert and compress uploaded images locally using HTML5 canvas
const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Maintain aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        // Compress to JPEG with the specified quality (renders a small, high-quality base64 string)
        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedBase64);
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
};

// Firestore Error Handler according to security guidelines
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Helper function to handle image upload to Firebase Storage with strict timeout and fallback
const uploadToStorageWithTimeout = async (
  storageReference: any,
  base64DataUrl: string,
  timeoutMs = 5000
): Promise<string> => {
  console.log("Preparing to upload image to Firebase Storage path:", storageReference.fullPath);

  // Convert Base64 data URL to Blob
  const dataURLtoBlob = (dataurl: string): Blob => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const blob = dataURLtoBlob(base64DataUrl);
  const uploadTask = uploadBytesResumable(storageReference, blob, { contentType: blob.type });

  return new Promise((resolve, reject) => {
    let isSettled = false;

    const timer = setTimeout(() => {
      if (!isSettled) {
        isSettled = true;
        console.warn(`Firebase Storage upload timed out after ${timeoutMs / 1000}s. Canceling upload task.`);
        try {
          uploadTask.cancel();
        } catch (e) {
          console.error("Error canceling upload task:", e);
        }
        reject(new Error(`Storage upload timeout (${timeoutMs / 1000}s)`));
      }
    }, timeoutMs);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Firebase Storage Upload progress: ${progress.toFixed(1)}%`);
      },
      (error) => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timer);
          console.error("Firebase Storage Upload Error:", error);
          reject(error);
        }
      },
      async () => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timer);
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("Firebase Storage Upload Succeeded! Download URL:", downloadUrl);
            resolve(downloadUrl);
          } catch (err) {
            console.error("Error getting download URL from Firebase Storage:", err);
            reject(err);
          }
        }
      }
    );
  });
};

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currentLang: Language;
}

export default function AdminPanel({
  isOpen,
  onClose,
  products,
  currentLang,
}: AdminPanelProps) {
  const t = translations[currentLang];
  const isRtl = currentLang === "ar";

  // Auth gate state backed securely by Firebase Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Form management states
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);

  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [titleFr, setTitleFr] = useState("");
  
  const [descAr, setDescAr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descFr, setDescFr] = useState("");

  const [category, setCategory] = useState<Category>("honey");
  const [price, setPrice] = useState<number>(0);
  const [shippingCost, setShippingCost] = useState<number>(20);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFileError, setImageFileError] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);

  // Storage Upload state
  const [pendingImageBase64, setPendingImageBase64] = useState<string | null>(null);
  const [isUploadingToStorage, setIsUploadingToStorage] = useState(false);

  // Track product deletion state inline to avoid window.confirm blocking in iframe
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // SECURE AUTH PERSISTENCE: Listen to Firebase Auth state on load and preserve the session
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email) {
        const email = currentUser.email.toLowerCase();
        if (
          email === "isallahdin@gmail.com" ||
          email === "admin@arganoble.com" ||
          email === "ayoub@arganoble.com"
        ) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Auto-hide status message after 4 seconds
  const showStatus = (text: string, type: "success" | "error") => {
    setStatusMessage({ text, type });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  if (!isOpen) return null;

  // Handle Secure PIN Login mapping to Firebase Auth
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(false);

    if (pinInput === "1232026") {
      setIsLoggingIn(true);
      const email = "admin@arganoble.com";
      const password = "password_1232026";

      try {
        await signInWithEmailAndPassword(auth, email, password);
        showStatus(currentLang === "ar" ? "تم تسجيل الدخول كمدير بنجاح!" : "Logged in as Admin successfully!", "success");
      } catch (err: any) {
        console.log("Admin account not found or credentials invalid. Attempting auto-registration...", err);
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          showStatus(currentLang === "ar" ? "تم إنشاء وتأكيد حساب المدير بنجاح!" : "Admin account registered and authenticated!", "success");
        } catch (regErr: any) {
          console.error("Firebase Registration Error:", regErr);
          setPinError(true);
          showStatus(
            currentLang === "ar"
              ? "فشل تسجيل الدخول: " + regErr.message
              : "Authentication mapping failed: " + regErr.message,
            "error"
          );
        }
      } finally {
        setIsLoggingIn(false);
        setPinInput("");
      }
    } else {
      setPinError(true);
      setPinInput("");
    }
  };

  // Handle Secure Google Sign In for Admin `isallahdin@gmail.com`
  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    setPinError(false);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email?.toLowerCase();
      
      if (
        email === "isallahdin@gmail.com" ||
        email === "admin@arganoble.com" ||
        email === "ayoub@arganoble.com"
      ) {
        showStatus(currentLang === "ar" ? "تم تسجيل الدخول بجوجل بنجاح!" : "Signed in with Google successfully!", "success");
      } else {
        await signOut(auth);
        showStatus(
          currentLang === "ar" 
            ? "عذراً، هذا الحساب ليس مسجلاً كمدير." 
            : "Sorry, this account is not registered as an administrator.",
          "error"
        );
      }
    } catch (err: any) {
      console.error("Google Sign-In Error:", err);
      let friendlyMessage = "";
      if (err.code === "auth/popup-closed-by-user" || err.message?.includes("popup-closed-by-user")) {
        friendlyMessage = currentLang === "ar"
          ? "تم إغلاق نافذة تسجيل الدخول (أو حظرها من المتصفح بسبب تشغيل التطبيق في iframe). يرجى فتح التطبيق في نافذة/علامة تبويب جديدة لتسجيل الدخول بجوجل، أو تسجيل الدخول برمز PIN مباشرة."
          : "The sign-in popup was closed (or blocked by the browser due to the iframe context). Please open the app in a new tab to use Google Sign-In, or use the PIN code directly.";
      } else if (err.code === "auth/popup-blocked" || err.message?.includes("popup-blocked")) {
        friendlyMessage = currentLang === "ar"
          ? "تم حظر نافذة تسجيل الدخول المنبثقة من قبل متصفحك. يرجى تفعيل النوافذ المنبثقة أو استخدام رمز الـ PIN."
          : "The sign-in popup was blocked by your browser. Please allow popups or use the PIN code.";
      } else {
        friendlyMessage = currentLang === "ar"
          ? "فشل تسجيل الدخول بجوجل: " + err.message
          : "Google Sign-In failed: " + err.message;
      }
      showStatus(friendlyMessage, "error");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Secure Sign-Out Handlers
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      resetForm();
      showStatus(currentLang === "ar" ? "تم تسجيل الخروج بنجاح." : "Logged out successfully.", "success");
    } catch (err: any) {
      console.error("Logout Error:", err);
      showStatus("Logout failed: " + err.message, "error");
    }
  };

  // Convert uploaded image to compressed Base64 string and hold in pending state
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageFileError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setImageFileError(
        currentLang === "ar" 
          ? "حجم الصورة كبير جداً! يرجى اختيار صورة أقل من 10 ميغابايت."
          : currentLang === "fr"
            ? "Image trop grande! Veuillez choisir une image de moins de 10 Mo."
            : "Image too large! Please select an image under 10 MB."
      );
      return;
    }

    setIsCompressing(true);
    const reader = new FileReader();
    reader.onload = async () => {
      if (reader.result) {
        try {
          const compressed = await compressImage(reader.result as string, 800, 800, 0.7);
          setImageUrl(compressed);
          setPendingImageBase64(compressed);
        } catch (err) {
          setImageFileError(
            currentLang === "ar"
              ? "فشل في معالجة وضغط الصورة."
              : "Failed to compress the image."
          );
        } finally {
          setIsCompressing(false);
        }
      } else {
        setIsCompressing(false);
      }
    };
    reader.onerror = () => {
      setImageFileError("Error reading file.");
      setIsCompressing(false);
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditProductId(null);
    setTitleAr("");
    setTitleEn("");
    setTitleFr("");
    setDescAr("");
    setDescEn("");
    setDescFr("");
    setCategory("honey");
    setPrice(0);
    setShippingCost(20);
    setImageUrl("");
    setImageFileError("");
    setPendingImageBase64(null);
    setIsUploadingToStorage(false);
  };

  // Save (Add or Update) Product to Firestore
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const tAr = titleAr.trim();
    const tEn = titleEn.trim();
    const tFr = titleFr.trim();

    if (!tAr && !tEn && !tFr) {
      showStatus(
        currentLang === "ar" 
          ? "يرجى إدخال اسم المنتج بلغة واحدة على الأقل!" 
          : currentLang === "fr"
            ? "Veuillez saisir le titre du produit dans au moins une langue !"
            : "Please enter the product title in at least one language!",
        "error"
      );
      return;
    }

    const finalTitleAr = tAr || tEn || tFr;
    const finalTitleEn = tEn || tAr || tFr;
    const finalTitleFr = tFr || tAr || tEn;

    const dAr = descAr.trim();
    const dEn = descEn.trim();
    const dFr = descFr.trim();

    const finalDescAr = dAr || dEn || dFr || "";
    const finalDescEn = dEn || dAr || dFr || "";
    const finalDescFr = dFr || dAr || dEn || "";

    setIsUploadingToStorage(true);
    let finalImageUrl = (pendingImageBase64 && pendingImageBase64.startsWith("data:")) 
      ? pendingImageBase64 
      : imageUrl.trim();

    try {
      const productPayload = {
        titleAr: finalTitleAr,
        titleEn: finalTitleEn,
        titleFr: finalTitleFr,
        descriptionAr: finalDescAr,
        descriptionEn: finalDescEn,
        descriptionFr: finalDescFr,
        category,
        price: Number(price),
        shippingCost: Number(shippingCost),
        imageUrl: finalImageUrl,
        createdAt: isEditing ? (products.find(p => p.id === editProductId)?.createdAt || Date.now()) : Date.now(),
      };

      let savedDocId = editProductId;

      if (isEditing && editProductId) {
        const productRef = doc(db, "products", editProductId);
        try {
          await updateDoc(productRef, productPayload);
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `products/${editProductId}`);
        }
        showStatus(t.adminEditSuccess, "success");
      } else {
        const productsCol = collection(db, "products");
        try {
          const newDoc = await addDoc(productsCol, productPayload);
          savedDocId = newDoc.id;
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, "products");
        }
        showStatus(t.adminAddSuccess, "success");
      }

      // Non-blocking background upload to Firebase Storage if pending image exists
      if (pendingImageBase64 && pendingImageBase64.startsWith("data:") && savedDocId) {
        const base64ToUpload = pendingImageBase64;
        const targetDocId = savedDocId;
        (async () => {
          try {
            console.log("Background: Uploading image to Firebase Storage for product:", targetDocId);
            const fileName = `products/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.jpg`;
            const storageReference = storageRef(storage, fileName);
            const cloudUrl = await uploadToStorageWithTimeout(storageReference, base64ToUpload, 3000);
            if (cloudUrl) {
              await updateDoc(doc(db, "products", targetDocId), { imageUrl: cloudUrl });
              console.log("Background Storage upload succeeded, updated document imageUrl:", cloudUrl);
            }
          } catch (bgErr) {
            console.log("Background Storage upload skipped (using embedded compressed image):", bgErr);
          }
        })();
      }

      resetForm();
    } catch (error: any) {
      console.error("Firestore Save Error:", error);
      showStatus(
        currentLang === "ar" 
          ? "فشل في حفظ المنتج: " + error.message
          : "Error saving product: " + error.message,
        "error"
      );
    } finally {
      setIsUploadingToStorage(false);
    }
  };

  // Delete Product from Firestore with proper error routing
  const executeDeleteProduct = async (prodId: string) => {
    try {
      const productRef = doc(db, "products", prodId);
      try {
        await deleteDoc(productRef);
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `products/${prodId}`);
      }
      setDeletingProductId(null);
      showStatus(t.adminDeleteSuccess, "success");
    } catch (error: any) {
      console.error("Firestore Delete Error:", error);
      showStatus(
        currentLang === "ar"
          ? "فشل في حذف المنتج من قاعدة البيانات."
          : "Error deleting product from database.",
        "error"
      );
    }
  };

  // Set up form for Editing
  const startEditProduct = (prod: Product) => {
    setIsEditing(true);
    setEditProductId(prod.id);
    setTitleAr(prod.titleAr);
    setTitleEn(prod.titleEn);
    setTitleFr(prod.titleFr);
    setDescAr(prod.descriptionAr);
    setDescEn(prod.descriptionEn);
    setDescFr(prod.descriptionFr);
    setCategory(prod.category);
    setPrice(prod.price);
    setShippingCost(prod.shippingCost);
    setImageUrl(prod.imageUrl);
    setPendingImageBase64(null);
    setImageFileError("");
  };

  return (
    <div 
      id="admin-modal-overlay"
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div 
        id="admin-modal-content"
        className="bg-white border border-gray-100 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-slideUp p-6 sm:p-8 text-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          id="close-admin-btn"
          onClick={onClose}
          className={`absolute top-4 ${isRtl ? "left-4" : "right-4"} p-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 hover:text-brand-orange hover:bg-orange-50/80 transition-all cursor-pointer z-10`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* AUTH LOADING / PREPARATION SPIN */}
        {authLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-10 h-10 border-4 border-gray-100 border-t-brand-orange rounded-full animate-spin" />
            <p className="text-xs font-bold text-gray-400">Verifying administrator session status...</p>
          </div>
        ) : !isAuthenticated ? (
          
          /* AUTHENTICATION GATE: PIN CODE & GOOGLE SIGN-IN FORM */
          <div className="max-w-md mx-auto py-12 flex flex-col items-center text-center">
            <div className="p-4 bg-orange-50 text-brand-orange border border-orange-100 rounded-full mb-6">
              <Lock className="w-10 h-10 animate-bounce" />
            </div>
            
            <h2 className="text-2xl font-black text-gray-900 title-serif mb-2">
              {currentLang === "ar" ? "تسجيل دخول المشرف" : currentLang === "fr" ? "Connexion Administrateur" : "Admin Authentication"}
            </h2>
            <p className="text-xs font-semibold text-gray-400 mb-8 leading-relaxed">
              {currentLang === "ar" 
                ? "هذه المنطقة محمية برمز PIN مخصص للمشرف لإدارة محتوى المتجر، أو يمكنك تسجيل الدخول الآمن بحساب Google المعتمد."
                : "This area is restricted. Authenticate using your 7-digit security PIN, or secure sign-in with your approved Google account."}
            </p>

            <form onSubmit={handlePinSubmit} className="w-full space-y-4">
              <div className="relative">
                <Key className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400 w-5 h-5" />
                <input
                  id="admin-pin-input"
                  type="password"
                  maxLength={10}
                  placeholder={t.adminPinPlaceholder}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 hover:bg-gray-100/75 border border-gray-200 rounded-2xl text-center text-lg font-black tracking-widest text-gray-900 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all"
                  autoFocus
                  disabled={isLoggingIn}
                />
              </div>

              {pinError && (
                <div id="admin-pin-error" className="flex items-center gap-2 text-rose-600 text-xs font-bold justify-center bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{t.adminInvalidPin}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-bold rounded-xl cursor-pointer"
                  disabled={isLoggingIn}
                >
                  {t.adminCancel}
                </button>
                <button
                  id="admin-pin-submit"
                  type="submit"
                  className="py-3 glow-button-orange text-white text-sm font-black rounded-xl cursor-pointer flex items-center justify-center gap-2"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  <span>{t.adminSubmit}</span>
                </button>
              </div>
            </form>

            {/* Google Sign-In Divider and Button */}
            <div className="w-full my-6 flex items-center gap-3">
              <div className="flex-1 h-[1px] bg-gray-100" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {currentLang === "ar" ? "أو" : "OR"}
              </span>
              <div className="flex-1 h-[1px] bg-gray-100" />
            </div>

            <button
              id="google-signin-btn"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoggingIn}
              className="w-full py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2.5 shadow-xs"
            >
              <LogIn className="w-4 h-4 text-brand-orange" />
              <span>
                {currentLang === "ar" ? "تسجيل الدخول بواسطة Google" : "Sign in with Google"}
              </span>
            </button>
          </div>
        ) : (
          
          /* UNLOCKED PRODUCT MANAGEMENT VIEW */
          <div className="space-y-8 py-4">
            
            <div className={`border-b border-gray-100 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isRtl ? "sm:flex-row-reverse" : ""}`}>
              <div>
                <h2 className={`text-2xl font-black text-gray-900 title-serif ${isRtl ? "text-right" : "text-left"}`}>
                  {t.adminTitle}
                </h2>
                <p className={`text-xs text-gray-400 font-semibold mt-1 ${isRtl ? "text-right" : "text-left"}`}>
                  {currentLang === "ar" ? "أهلاً بك في لوحة تحكم المشرف! أضف وعدل منتجات العسل الحر والأركان والأملو بشكل آمن ودائم." : "Welcome to the Admin Panel! Safely and permanently manage your organic products list."}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-50 hover:bg-rose-50 hover:text-rose-600 text-gray-500 text-xs font-bold border border-gray-100 rounded-xl transition-all cursor-pointer self-start"
              >
                {currentLang === "ar" ? "تسجيل الخروج" : "Logout"}
              </button>
            </div>


            {statusMessage && (
              <div 
                id="admin-status-toast"
                className={`p-4 rounded-2xl flex items-center gap-3 border animate-fadeIn ${
                  statusMessage.type === "success" 
                    ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
                    : "bg-rose-50 border-rose-100 text-rose-800"
                } ${isRtl ? "flex-row-reverse text-right" : "flex-row text-left"}`}
              >
                <AlertCircle className={`w-5 h-5 shrink-0 ${statusMessage.type === "success" ? "text-emerald-600" : "text-rose-600"}`} />
                <span className="text-xs font-black leading-relaxed">{statusMessage.text}</span>
              </div>
            )}

            {/* TWO-COLUMN LAYOUT: Left is Form, Right is Products list */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Form: Add/Edit Product */}
              <div className="lg:col-span-7 bg-gray-50/50 border border-gray-100 rounded-3xl p-6">
                <div className={`flex items-center gap-2 mb-6 border-b border-gray-100 pb-3 ${isRtl ? "flex-row-reverse" : ""}`}>
                  <div className="p-2 bg-orange-50 text-brand-orange rounded-lg">
                    <Plus className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-gray-900 title-serif">
                    {isEditing ? t.adminEditProduct : t.adminAddProduct}
                  </h3>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-5">
                  
                  {/* Informational guide banner */}
                  <div className={`p-3.5 bg-amber-50/75 border border-amber-100/50 rounded-2xl flex items-start gap-2.5 ${isRtl ? "text-right flex-row-reverse" : "text-left"}`}>
                    <AlertCircle className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                    <p className="text-xs font-bold text-stone-700 leading-relaxed">
                      {isRtl 
                        ? "يكفي كتابة اسم المنتج بلغة واحدة فقط (ستظهر بباقي اللغات تلقائياً إن تركت فارغة). الوصف اختياري بالكامل ويمكن ملؤه بلغة واحدة أيضاً."
                        : "It is enough to enter the name in just one language (it will auto-populate others if left blank). The description is completely optional."}
                    </p>
                  </div>

                  {/* Titles in 3 languages */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5 text-right">
                      <label className="text-xs font-bold text-gray-700 block">{t.adminProductTitleAr} {isRtl ? "(مطلوب لغة واحدة على الأقل)" : ""}</label>
                      <input
                        id="form-title-ar"
                        type="text"
                        value={titleAr}
                        onChange={(e) => setTitleAr(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none focus:border-brand-orange"
                      />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-bold text-gray-700 block">{t.adminProductTitleEn}</label>
                      <input
                        id="form-title-en"
                        type="text"
                        value={titleEn}
                        onChange={(e) => setTitleEn(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none focus:border-brand-orange"
                      />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-bold text-gray-700 block">{t.adminProductTitleFr}</label>
                      <input
                        id="form-title-fr"
                        type="text"
                        value={titleFr}
                        onChange={(e) => setTitleFr(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none focus:border-brand-orange"
                      />
                    </div>
                  </div>

                  {/* Descriptions in 3 languages */}
                  <div className="space-y-4">
                    <div className="space-y-1.5 text-right">
                      <label className="text-xs font-bold text-gray-700 block">{t.adminProductDescAr} {isRtl ? "(اختياري)" : "(Optional)"}</label>
                      <textarea
                        id="form-desc-ar"
                        rows={3}
                        value={descAr}
                        onChange={(e) => setDescAr(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none focus:border-brand-orange resize-none"
                      />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-bold text-gray-700 block">{t.adminProductDescEn} {isRtl ? "" : "(Optional)"}</label>
                      <textarea
                        id="form-desc-en"
                        rows={3}
                        value={descEn}
                        onChange={(e) => setDescEn(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none focus:border-brand-orange resize-none"
                      />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-bold text-gray-700 block">{t.adminProductDescFr} {isRtl ? "" : "(Optional)"}</label>
                      <textarea
                        id="form-desc-fr"
                        rows={3}
                        value={descFr}
                        onChange={(e) => setDescFr(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none focus:border-brand-orange resize-none"
                      />
                    </div>
                  </div>

                  {/* Categories, Pricing, and Shipping */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 block">{t.adminProductCategory}</label>
                      <select
                        id="form-category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Category)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none focus:border-brand-orange cursor-pointer"
                      >
                        <option value="honey">{t.categoryHoney}</option>
                        <option value="amlou">{t.categoryAmlou}</option>
                        <option value="argan">{t.categoryArgan}</option>
                      </select>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 block">{t.adminProductPrice}</label>
                      <input
                        id="form-price"
                        type="number"
                        min={0}
                        required
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none focus:border-brand-orange"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 block">{t.adminProductShipping}</label>
                      <input
                        id="form-shipping"
                        type="number"
                        min={0}
                        required
                        value={shippingCost}
                        onChange={(e) => setShippingCost(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none focus:border-brand-orange"
                      />
                    </div>
                  </div>

                  {/* Image uploading or URL pasting */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 block">{t.adminProductImage}</label>
                      <div className="flex flex-col sm:flex-row items-stretch gap-3">
                        {/* File Upload Button */}
                        <div className="relative shrink-0 flex">
                          <label 
                            className={`px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                              isCompressing ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-gray-800"
                            }`}
                          >
                            {isCompressing ? (
                              <>
                                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>
                                  {currentLang === "ar" ? "جاري معالجة الصورة..." : currentLang === "fr" ? "Traitement..." : "Processing..."}
                                </span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4" />
                                <span>{t.adminProductImageUpload}</span>
                              </>
                            )}
                            <input
                              id="form-image-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              disabled={isCompressing}
                              className="hidden"
                            />
                          </label>
                        </div>
                        
                        {/* URL Paste field */}
                        <input
                          id="form-image-url"
                          type="text"
                          placeholder={t.adminProductImageOr}
                          value={imageUrl.startsWith("data:") ? "" : imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none focus:border-brand-orange"
                        />
                      </div>
                      
                      {imageFileError && (
                        <p className="text-[10px] text-rose-600 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{imageFileError}</span>
                        </p>
                      )}
                    </div>

                    {/* Image Preview Window */}
                    {imageUrl && (
                      <div className="w-24 h-24 bg-white border border-gray-200 rounded-2xl overflow-hidden relative shadow-sm">
                        <img
                          id="form-image-preview"
                          src={imageUrl}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageUrl("");
                            setPendingImageBase64(null);
                          }}
                          className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black/85 text-white rounded-full cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Submit Actions */}
                  <div className={`flex items-center gap-2 pt-4 justify-end ${isRtl ? "flex-row-reverse" : ""}`}>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        {t.adminCancel}
                      </button>
                    )}
                    <button
                      id="form-save-btn"
                      type="submit"
                      disabled={isUploadingToStorage || isCompressing}
                      className="px-6 py-2.5 bg-brand-orange hover:bg-orange-600 disabled:bg-stone-400 text-white text-xs font-black rounded-xl cursor-pointer shadow-sm flex items-center gap-1.5"
                    >
                      {isUploadingToStorage ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>
                            {currentLang === "ar" ? "جاري الحفظ والرفع..." : "Saving & Uploading..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>{t.adminSave}</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </div>

              {/* Right Products List (for editing/deleting) */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className={`text-sm font-black text-gray-500 uppercase tracking-widest ${isRtl ? "text-right" : "text-left"}`}>
                  {currentLang === "ar" ? "قائمة المنتجات الحالية" : "Current Products List"} ({products.length})
                </h3>
                
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {products.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-xs font-semibold text-gray-400">No products in catalog yet.</p>
                    </div>
                  ) : (
                    products.map((prod) => {
                      const title = 
                        currentLang === "ar" ? prod.titleAr : 
                        currentLang === "fr" ? prod.titleFr : 
                        prod.titleEn;

                      return (
                        <div 
                          id={`admin-product-item-${prod.id}`}
                          key={prod.id}
                          className={`flex items-center justify-between p-3 bg-white border border-gray-100 rounded-2xl shadow-xs gap-4 hover:border-orange-100 transition-colors ${
                            isRtl ? "flex-row-reverse" : "flex-row"
                          }`}
                        >
                          <div className={`flex items-center gap-3 ${isRtl ? "flex-row-reverse" : "flex-row"}`}>
                            {/* Thumbnail */}
                            <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                              {prod.imageUrl ? (
                                <img src={prod.imageUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-[10px] text-gray-300 font-bold w-full h-full flex items-center justify-center bg-gray-50 select-none">
                                  SVG
                                </span>
                              )}
                            </div>
                            
                            {/* Title & Price */}
                            <div className={`min-w-0 ${isRtl ? "text-right" : "text-left"}`}>
                              <h4 className="text-xs font-extrabold text-gray-900 title-serif line-clamp-1">{title}</h4>
                              <p className="text-[10px] font-black text-brand-orange mt-0.5">{prod.price} {t.mad}</p>
                            </div>
                          </div>

                          {/* Edit / Delete CTA Controls */}
                          <div className="flex items-center gap-2 shrink-0">
                            {deletingProductId === prod.id ? (
                              <div className="flex items-center gap-1.5 bg-rose-50/80 border border-rose-100 rounded-xl p-1 animate-fadeIn">
                                <span className="text-[10px] font-black text-rose-700 px-1.5">
                                  {currentLang === "ar" ? "تأكيد الحذف؟" : currentLang === "fr" ? "Supprimer ?" : "Confirm?"}
                                </span>
                                <button
                                  id={`admin-confirm-delete-${prod.id}`}
                                  onClick={() => executeDeleteProduct(prod.id)}
                                  className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-black transition-all cursor-pointer shadow-xs"
                                >
                                  {currentLang === "ar" ? "نعم" : currentLang === "fr" ? "Oui" : "Yes"}
                                </button>
                                <button
                                  id={`admin-cancel-delete-${prod.id}`}
                                  onClick={() => setDeletingProductId(null)}
                                  className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-[10px] font-black transition-all cursor-pointer"
                                >
                                  {currentLang === "ar" ? "لا" : currentLang === "fr" ? "Non" : "No"}
                                </button>
                              </div>
                            ) : (
                              <>
                                <button
                                  id={`admin-edit-prod-btn-${prod.id}`}
                                  onClick={() => startEditProduct(prod)}
                                  className="p-2.5 bg-amber-50/50 hover:bg-brand-orange border border-amber-100/40 text-brand-orange hover:text-white rounded-xl transition-all shadow-xs cursor-pointer"
                                  title={t.adminEditProduct}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  id={`admin-delete-prod-btn-${prod.id}`}
                                  onClick={() => setDeletingProductId(prod.id)}
                                  className="p-2.5 bg-rose-50/50 hover:bg-rose-600 border border-rose-100/40 text-rose-600 hover:text-white rounded-xl transition-all shadow-xs cursor-pointer"
                                  title={t.adminDeleteProduct}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
