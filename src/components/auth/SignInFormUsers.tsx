import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import axios from "axios";
import AlertCustom from "../ui/alert/AlertCustom";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loginData, setLoginData] = useState({
    nik: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

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


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMsg("");

  // =====================
  // VALIDASI FRONTEND (SESUAI CONTROLLER)
  // =====================
  if (!loginData.nik) {
    setErrorMsg("NIK wajib diisi");
    return;
  }

  if (!/^[0-9]+$/.test(loginData.nik)) {
    setErrorMsg("NIK hanya boleh berisi angka");
    return;
  }

  if (loginData.nik.length < 8 || loginData.nik.length > 20) {
    setErrorMsg("NIK harus 8–20 digit");
    return;
  }

  if (!loginData.email) {
    setErrorMsg("Email wajib diisi");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(loginData.email)) {
    setErrorMsg("Format email tidak valid");
    return;
  }

  if (!loginData.password) {
    setErrorMsg("Password wajib diisi");
    return;
  }

  if (loginData.password.length < 6) {
    setErrorMsg("Password minimal 6 karakter");
    return;
  }

  if (!/^[A-Za-z0-9@._-]+$/.test(loginData.password)) {
    setErrorMsg(
      "Password hanya boleh huruf, angka, dan simbol @ . _ -"
    );
    return;
  }

  setLoading(true);

  try {
    const res = await axios.post(
      "http://127.0.0.1:8000/api/login",
      loginData
    );

    if (res.data.success) {
      // =====================
      // SIMPAN DATA LOGIN
      // =====================
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("user_type", res.data.user.role);

      // 🔥 TAMBAHKAN INI
      localStorage.setItem("login_time", Date.now().toString());

      // =====================
      // ✅ ALERT CUSTOM BERDASARKAN ROLE
      // =====================
   setAlertData({
    variant: "success",
    title: "Login Berhasil 🎉",
    message: res.data.message, // dari controller (roleMessages)
  });
  setAlertOpen(true);

      // =====================
      // ⏱️ REDIRECT 3 DETIK
      // =====================
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  } catch (err: any) {
    const status = err.response?.status;

    setAlertData({
      variant: "error",
      title: "Login Gagal",
      message:
        status === 401
          ? "NIK, Email, atau Password salah"
          : status === 403
          ? "Akses ditolak"
          : "Terjadi kesalahan, silakan coba lagi",
    });
    setAlertOpen(true);
  } finally {
    setLoading(false);
  }
};


  return (
    
    <div className="flex flex-col flex-1">
      {/* ✅ ALERT CUSTOM DI SINI */}
    <AlertCustom
      isOpen={alertOpen}
      onClose={() => setAlertOpen(false)}
      variant={alertData.variant}
      title={alertData.title}
      message={alertData.message}
    />

    <div className="w-full max-w-md pt-10 mx-auto">
      {/* header / back button */}
    </div>
      <div className="w-full max-w-md pt-10 mx-auto">
        {/* <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link> */}
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Login Pegawai Kantor Desa Mejayan
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
             Masukkan email, NIK dan password untuk masuk.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {errorMsg && (
                <div className="p-3 text-sm text-red-600 bg-red-100 rounded-md">
                  {errorMsg}
                </div>
              )}

              <div>
                <Label>
                  NIK <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="nik"
                  placeholder="Masukkan NIK"
                  value={loginData.nik}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="email"
                  placeholder="Masukkan Email"
                  value={loginData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Masukkan Password"
                    value={loginData.password}
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

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                    Keep me logged in
                  </span>
                </div>
                {/* <Link
                  to="/reset-password"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Forgot password?
                </Link> */}
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full"
                  size="sm"
                  disabled={loading}
                >
                  {loading ? "Sedang masuk..." : "Masuk"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
    </div>
  );
}
