import { useState, useEffect } from "react";
import axios from "axios";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";

import TableDataKetuaRT from "../../components/tables/BasicTables/TableDataKetuaRT";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import Alert from "../../components/ui/alert/Alert";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { EyeCloseIcon, EyeIcon } from "../../icons";

export default function TablesDataKetuaRT() {
  // ================= ALERT =================
type AlertType = {
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
};

  // ================= MODAL ADD =================
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  // ================= FORM ADD =================
  const [formAdd, setFormAdd] = useState({
    nama: "",
    email: "",
    password: "",
    nik: "",
    nip: "",
    no_rt: "",
    jabatan: "",
  });

    const [alertData, setAlertData] = useState<AlertType | null>(null);

  // ================= CLOSE MODAL =================
  const handleCloseAdd = () => {
    setIsOpenAdd(false);
    setFormAdd({
      nama: "",
      email: "",
      password: "",
      nik: "",
      nip: "",
      no_rt: "",
      jabatan: "",
    });
  };

  // Auto hide alert (5 detik)
  useEffect(() => {
    if (alertData) {
      const timer = setTimeout(() => {
        setAlertData(null);
      }, 5000);
  
      return () => clearTimeout(timer);
    }
  }, [alertData]);
  
  // Ambil alert dari localStorage setelah refresh
  useEffect(() => {
    const pending = localStorage.getItem("pending_alert");
    if (pending) {
      setAlertData(JSON.parse(pending));
      localStorage.removeItem("pending_alert");
    }
  }, []);

  // ================= ADD KETUA RT =================
const handleAddKetuaRT = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:8000/api/users/add-rt",
      formAdd,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    // ✅ SIMPAN ALERT BERHASIL
    localStorage.setItem(
      "pending_alert",
      JSON.stringify({
        variant: "success",
        title: "Berhasil",
        message: "Data Kepala Desa berhasil ditambahkan.",
      })
    );

    // ✅ TUTUP MODAL (NAMA SETTER BENAR)
    setIsOpenAdd(false);

    // ✅ REFRESH
    window.location.reload();

  } catch (err: any) {
    console.error("ADD ERROR:", err?.response?.data);

    // ❗️SIMPAN ALERT GAGAL
    localStorage.setItem(
      "pending_alert",
      JSON.stringify({
        variant: "error",
        title: "Gagal",
        message:
          err?.response?.data?.message ||
          "Gagal menambahkan data Kepala Desa.",
        })
    );

    // ✅ TUTUP MODAL MESKI GAGAL
    setIsOpenAdd(false);

    // ✅ REFRESH
    window.location.reload();
  }
};

  return (
    <>
      <PageMeta
        title="Data Ketua RT"
        description="Kelola data Ketua RT Desa"
      />
      <PageBreadcrumb pageTitle="Data Ketua RT" />

      {/* ================= ALERT ================= */}
      {alertData && (
        <div className="mb-4">
          <Alert
            variant={alertData.variant}
            title={alertData.title}
            message={alertData.message}
          />
        </div>
      )}

      <div className="space-y-6">
        <ComponentCard>
          {/* ================= HEADER ================= */}
          <div className="flex flex-col gap-5 mb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-medium text-gray-800 dark:text-white/90">
                Tabel Data Ketua RT
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Kelola data Ketua RT Desa.
              </p>
            </div>

            {/* ================= BUTTON ADD ================= */}
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsOpenAdd(true)}
            >
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
                className="text-white"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span className="font-medium">Tambah Ketua RT</span>
            </Button>
          </div>

          {/* ================= TABLE ================= */}
          <TableDataKetuaRT />
        </ComponentCard>
      </div>

      {/* ================= MODAL ADD ================= */}
      <Modal
        isOpen={isOpenAdd}
        onClose={handleCloseAdd}
        className="max-w-[800px] w-full m-4"
      >
        <div className="relative flex flex-col w-full max-h-[90vh] overflow-hidden rounded-3xl bg-white dark:bg-gray-900 shadow-xl">

          {/* HEADER */}
          <div className="px-6 pt-8 pb-4 lg:px-11 lg:pt-11">
            <h4 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white/90">
              Tambah Ketua RT
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Masukkan data Ketua RT.
            </p>
          </div>

          {/* FORM */}
        <form
          onSubmit={handleAddKetuaRT}
          className="flex flex-col overflow-hidden"
        >
          <div className="custom-scrollbar flex-grow overflow-y-auto px-6 pb-6 lg:px-11">
            <div className="space-y-5">

              {/* NAMA */}
              <div className="space-y-2">
                <Label>Nama <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="Masukkan nama Ketua RT"
                  value={formAdd.nama}
                  onChange={(e) =>
                    setFormAdd({ ...formAdd, nama: e.target.value })
                  }
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <Label>Email <span className="text-red-500">*</span></Label>
                <Input
                  type="email"
                  placeholder="contoh: rt06@gmail.com"
                  value={formAdd.email}
                  onChange={(e) =>
                    setFormAdd({ ...formAdd, email: e.target.value })
                  }
                  required
                />
              </div>

             {/* PASSWORD */}
<div className="space-y-2">
  <Label>
    Password <span className="text-red-500">*</span>
  </Label>

  <div className="relative">
    <Input
      type={showPassword ? "text" : "password"}
      placeholder="Minimal 8 karakter"
      value={formAdd.password}
      onChange={(e) =>
        setFormAdd({ ...formAdd, password: e.target.value })
      }
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


              {/* NIK */}
              <div className="space-y-2">
                <Label>NIK <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="Masukkan 16 digit NIK"
                  value={formAdd.nik}
                  onChange={(e) =>
                    setFormAdd({ ...formAdd, nik: e.target.value })
                  }
                  required
                />
              </div>

              {/* NIP (OPSIONAL) */}
              <div className="space-y-2">
                <Label>NIP <span className="text-gray-400">(Opsional)</span></Label>
                <Input
                  placeholder="Masukkan NIP jika ada"
                  value={formAdd.nip}
                  onChange={(e) =>
                    setFormAdd({ ...formAdd, nip: e.target.value })
                  }
                />
              </div>

              {/* NO RT */}
              <div className="space-y-2">
                <Label>No RT <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="Contoh: 06"
                  value={formAdd.no_rt}
                  onChange={(e) =>
                    setFormAdd({ ...formAdd, no_rt: e.target.value })
                  }
                  required
                />
              </div>

              {/* JABATAN */}
              <div className="space-y-2">
                <Label>Jabatan <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="Contoh: Ketua RT 06"
                  value={formAdd.jabatan}
                  onChange={(e) =>
                    setFormAdd({ ...formAdd, jabatan: e.target.value })
                  }
                  required
                />
              </div>

            </div>
          </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 px-6 py-5 border-t bg-gray-50 dark:bg-gray-800/50 lg:px-11">
              <Button variant="outline" onClick={handleCloseAdd}>
                Batal
              </Button>
              <Button
                type="submit"
                className="px-8 font-bold bg-blue-600 hover:bg-blue-700 text-white"
              >
                Simpan Data
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
