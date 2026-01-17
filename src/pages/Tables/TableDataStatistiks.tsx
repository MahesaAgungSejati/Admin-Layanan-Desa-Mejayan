import { useState } from "react";
import axios from "axios";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";

import TableDataStatistik from "../../components/tables/BasicTables/TableDataStatistik";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal/index";
import Alert from "../../components/ui/alert/Alert";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";


export default function TableDataStatistiks() {
  // ================= ALERT =================
  const [alertData, setAlertData] = useState<{
    variant: "success" | "error" | "warning";
    title: string;
    message: string;
  } | null>(null);

  // ================= MODAL ADD =================
  const [isOpenAdd, setIsOpenAdd] = useState(false);

  // ================= FORM ADD =================
  const [formAdd, setFormAdd] = useState<{
    nama_file: string;
    file_data: File | null;
  }>({
    nama_file: "",
    file_data: null,
  });

  // ================= CLOSE MODAL =================
  const handleCloseAdd = () => {
    setIsOpenAdd(false);
    setFormAdd({
      nama_file: "",
      file_data: null,
    });
  };

  // ================= ADD DATA STATISTIK =================
  const handleAddStatistik = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token") ?? "";

      const formData = new FormData();
      formData.append("nama_file", formAdd.nama_file);
      if (formAdd.file_data) {
        formData.append("file_data", formAdd.file_data);
      }

      await axios.post(
        "http://127.0.0.1:8000/api/data-statistik/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // ✅ SIMPAN ALERT
      localStorage.setItem(
        "pending_alert",
        JSON.stringify({
          variant: "success",
          title: "Berhasil",
          message: "Data statistik berhasil ditambahkan.",
        })
      );

      window.location.reload();
    } catch (err: any) {
      setAlertData({
        variant: "error",
        title: "Gagal",
        message:
          err?.response?.data?.message ||
          "Gagal menambahkan data statistik.",
      });
    }
  };

  return (
    <>
      <PageMeta
        title="Data Statistik Desa"
        description="Kelola data statistik desa"
      />
      <PageBreadcrumb pageTitle="Data Statistik" />

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
                Tabel Data Statistik
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Kelola dan unggah data statistik desa.
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
              <span className="font-medium">Tambah Data</span>
            </Button>
          </div>

          {/* ================= TABLE ================= */}
          <TableDataStatistik />
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
              Tambah Data Statistik
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Unggah file dan masukkan nama data statistik.
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleAddStatistik}
            className="flex flex-col overflow-hidden"
          >
            <div className="custom-scrollbar flex-grow overflow-y-auto px-6 pb-6 lg:px-11">
              <div className="space-y-5">
                {/* NAMA FILE */}
                <div className="space-y-2">
                  <Label>
                    Nama File <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formAdd.nama_file}
                    onChange={(e) =>
                      setFormAdd({
                        ...formAdd,
                        nama_file: e.target.value,
                      })
                    }
                    placeholder="Masukkan nama data statistik"
                    required
                  />
                </div>

                {/* FILE DATA */}
                <div className="space-y-2">
                  <Label>File Data Statistik</Label>

                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer border-gray-300 hover:border-blue-500 bg-gray-50 dark:bg-gray-800/50 transition">
                    <span className="text-xs text-gray-500">
                      Klik untuk upload file (Excel)
                    </span>
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      className="hidden"
                      onChange={(e) =>
                        setFormAdd({
                          ...formAdd,
                          file_data: e.target.files?.[0] || null,
                        })
                      }
                    />
                  </label>

                  {formAdd.file_data && (
                    <p className="text-xs text-gray-600 italic">
                      {formAdd.file_data.name}
                    </p>
                  )}
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
