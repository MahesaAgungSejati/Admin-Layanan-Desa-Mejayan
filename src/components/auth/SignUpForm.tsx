import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import AlertCustom from "../ui/alert/AlertCustom";

export default function SignUpForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    nik: "",
    password: "",
  });

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertData, setAlertData] = useState<{
    variant: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  }>({
    variant: "success",
    title: "",
    message: "",
  });

  useEffect(() => {
  if (alertOpen && alertData.variant === "success") {
    const timer = setTimeout(() => {
      setAlertOpen(false);
      navigate("/signin");
    }, 3000);

    return () => clearTimeout(timer);
  }
}, [alertOpen, alertData.variant, navigate]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!isChecked) {
    setAlertData({
      variant: "warning",
      title: "Peringatan",
      message: "Harap setujui Syarat & Ketentuan terlebih dahulu.",
    });
    setAlertOpen(true);
    return;
  }

  setLoading(true);

  try {
    const res = await axios.post(
      "http://localhost:8000/api/masyarakat/register",
      formData
    );

    setAlertData({
      variant: "success",
      title: "Registrasi Berhasil 🎉",
      message:
        res.data?.message ||
        "Akun berhasil dibuat. Silakan login untuk melanjutkan.",
    });

    setAlertOpen(true);
    setFormData({ nama: "", email: "", nik: "", password: "" });
    setIsChecked(false);
  } catch (err: any) {
    // ================= AMBIL PESAN VALIDASI LARAVEL =================
    let errorMessage = "Terjadi kesalahan saat registrasi.";

    if (err.response?.status === 422) {
      const errors = err.response.data?.errors;

      if (errors) {
        // Ambil error pertama (paling relevan)
        const firstKey = Object.keys(errors)[0];
        errorMessage = errors[firstKey][0];
      }
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    }

    setAlertData({
      variant: "error",
      title: "Registrasi Gagal ❌",
      message: errorMessage,
    });

    setAlertOpen(true);
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      {/* 🔔 ALERT */}
     <AlertCustom
      isOpen={alertOpen}
      variant={alertData.variant}
      title={alertData.title}
      message={alertData.message}
      onClose={() => setAlertOpen(false)}
    />


      <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Sign Up
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter your email and password to sign up!
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <Label>Nama Lengkap<span className="text-error-500">*</span></Label>
                  <Input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label>NIK<span className="text-error-500">*</span></Label>
                  <Input
                    type="text"
                    name="nik"
                    value={formData.nik}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label>Email<span className="text-error-500">*</span></Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label>Password<span className="text-error-500">*</span></Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <p className="text-sm text-gray-500">
                    Dengan membuat akun, Anda setuju dengan{" "}
                    <span className="text-brand-500">Syarat & Ketentuan</span>.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-white bg-brand-500 rounded-lg hover:bg-brand-600 disabled:opacity-60"
                >
                  {loading ? "Mendaftar..." : "Sign Up"}
                </button>
              </div>
            </form>

            <p className="mt-5 text-sm text-center text-gray-700">
              Already have an account?{" "}
              <Link to="/signin" className="text-brand-500">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
