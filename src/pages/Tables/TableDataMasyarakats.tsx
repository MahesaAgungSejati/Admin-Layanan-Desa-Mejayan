import axios from "axios";
import { useState, useEffect } from "react";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import TableDataMasyarakat from "../../components/tables/BasicTables/TableDataMasyarakat";

import { Modal } from "../../components/ui/modal/index";
import Alert from "../../components/ui/alert/Alert";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";


export default function BasicTables() {
  // ===============================
  // STATE EXPORT
  // ===============================
  const [modalExport, setModalExport] = useState(false);
  const [showExportPassword, setShowExportPassword] = useState(false);

  const [exportData, setExportData] = useState({
    filename: "",
    password: "",
  });

  const [exportErrors, setExportErrors] = useState<any>({});
  const [alertData, setAlertData] = useState<any>(null);

useEffect(() => {
  const storedAlert = localStorage.getItem("alert");

  if (storedAlert) {
    const alert = JSON.parse(storedAlert);
    setAlertData(alert);

    setTimeout(() => {
      setAlertData(null);
      localStorage.removeItem("alert");
    }, 5000);
  }
}, []);
  // ===============================
  // HANDLER
  // ===============================
  const handleExportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExportData((prev) => ({ ...prev, [name]: value }));
  };

const handleExportSubmit = async (e: any) => {
  e.preventDefault();

  const newErrors: any = {};
  if (!exportData.filename) newErrors.filename = "Nama file wajib diisi";
  if (!exportData.password) newErrors.password = "Password wajib diisi";

  setExportErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return;

  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      "http://127.0.0.1:8000/api/perangkat_desa/masyarakat-export",
      {
        filename: exportData.filename,
        password: exportData.password,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );

    // ================= DOWNLOAD (KONSISTEN DENGAN SKTM) =================
    const blob = new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${exportData.filename}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);

    // ================= ALERT SUCCESS =================
    localStorage.setItem(
      "alert",
      JSON.stringify({
        variant: "success",
        title: "Berhasil",
        message: "Data masyarakat berhasil diexport.",
      })
    );

    // reset (tetap)
    setModalExport(false);
    setExportData({ filename: "", password: "" });
    setExportErrors({});

    // 🔄 refresh agar alert muncul
    window.location.reload();

  } catch (err: any) {
    let message = "Password salah atau Anda tidak memiliki akses.";

    if (err?.response?.data instanceof Blob) {
      try {
        const text = await err.response.data.text();
        const json = JSON.parse(text);
        message = json.message || message;
      } catch {}
    }

    // ================= ALERT ERROR =================
   setExportErrors({
  password: message,
});
  }
};




  return (
    <>
      <PageMeta title="Data Akun Masyarakat" description="Halaman data akun masyarakat" />
      <PageBreadcrumb pageTitle="Data Akun Masyarakat" />

      <div className="space-y-6">
        {alertData && (
  <Alert
    variant={alertData.variant}
    title={alertData.title}
    message={alertData.message}
  />
)}

        <ComponentCard>
       {/* HEADER AREA: Responsif (Kolom di HP, Baris di Laptop) */}
    <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-medium text-gray-800 dark:text-white/90">
          Tabel Data Masyarakat
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Kelola data akun dan informasi detail warga Desa Mejayan secara terstruktur.
        </p>
      </div>

           <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setModalExport(true)}
          className="flex items-center gap-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 transition-all"
        >
          {/* Icon SVG Unduh / Download */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          
          <span>Download Data</span>
        </Button>
          </div>

          {/* TABEL (TIDAK DIHAPUS) */}
          <TableDataMasyarakat />
        </ComponentCard>
      </div>

      {/* ================= MODAL EXPORT ================= */}
     <Modal
        isOpen={modalExport}
        onClose={() => setModalExport(false)}
        className="max-w-[500px] m-4"
      >
        <div className="relative w-full rounded-3xl bg-white p-6 dark:bg-gray-900">

          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Export Data Surat Keterangan Tidak Mampu
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Masukkan nama file dan password akun Anda
          </p>

          <form onSubmit={handleExportSubmit} className="space-y-4">

            <div>
              <Label>Nama File Excel</Label>
              <Input
                name="filename"
                value={exportData.filename}
                onChange={handleExportChange}
                placeholder="contoh: Data-Masyarakat-Januari"
              />
              {exportErrors.filename && (
                <p className="text-xs text-red-500 mt-1">{exportErrors.filename}</p>
              )}
            </div>

          <div>
        <Label>Password Akun</Label>

        <div className="relative">
          <Input
            type={showExportPassword ? "text" : "password"}
            name="password"
            value={exportData.password}
            onChange={handleExportChange}
            placeholder="Masukkan password akun"
            className="pr-10"
          />

          <button
            type="button"
            onClick={() => setShowExportPassword(prev => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            {showExportPassword ? (
              /* EYE OFF */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3.98 8.223A10.477 10.477 0 001.934 12
                    C3.226 16.338 7.244 19.5 12 19.5
                    c.993 0 1.953-.138 2.863-.395M6.228 6.228
                    A10.45 10.45 0 0112 4.5
                    c4.756 0 8.773 3.162 10.065 7.498
                    a10.522 10.522 0 01-4.293 5.774M6.228 6.228
                    L3 3m3.228 3.228l3.65 3.65m7.894 7.894
                    L21 21m-3.228-3.228l-3.65-3.65m0 0
                    a3 3 0 10-4.243-4.243"
                />
              </svg>
            ) : (
              /* EYE */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M2.036 12.322
                    a1.012 1.012 0 010-.639
                    C3.423 7.51 7.36 4.5 12 4.5
                    c4.638 0 8.573 3.007 9.963 7.178
                    .07.207.07.431 0 .639
                    C20.577 16.49 16.64 19.5 12 19.5
                    c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </button>
        </div>

        {exportErrors.password && (
          <p className="text-xs text-red-500 mt-1">{exportErrors.password}</p>
        )}
      </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => setModalExport(false)}>
            Batal
          </Button>
          <Button type="submit" variant="primary">
            Export
          </Button>
        </div>
      </form>
    </div>
      </Modal>
    </>
  );
}
