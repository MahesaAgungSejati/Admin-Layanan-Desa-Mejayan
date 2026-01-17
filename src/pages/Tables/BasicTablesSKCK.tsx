import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableSKCK from "../../components/tables/BasicTables/BasicTableSKCK";

import { Modal } from "../../components/ui/modal/index";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import Textarea from "../../components/form/input/TextArea";
import axios from "axios";


// ========================== ALERT TYPE ==========================
interface AlertType {
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}

export default function BasicTables() {
  const user_type = localStorage.getItem("user_type");
  const token = localStorage.getItem("token");

  // ===================== MODAL AJUKAN =====================
  const [modalAjukan, setModalAjukan] = useState(false);

  // ===================== MODAL EXPORT =====================
  const [modalExport, setModalExport] = useState(false);

  const [exportData, setExportData] = useState({
    filename: "",
    password: "",
  });

  const [exportErrors, setExportErrors] = useState<{ [key: string]: string }>({});
  const [showExportPassword, setShowExportPassword] = useState(false);

  // ===================== MODAL DELETE ALL =====================
  const [modalDelete, setModalDelete] = useState(false);

  const [deleteData, setDeleteData] = useState({
    password: "",
  });

  const [deleteErrors, setDeleteErrors] = useState<{ [key: string]: string }>({});
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  // ===================== MODAL TATA CARA =====================
  const [modalTataCara, setModalTataCara] = useState(false);


  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const masyarakat_id = userData.id;

  const [rtOptions, setRtOptions] = useState([]);

  const [formData, setFormData] = useState({
    nama: "",
    jenis_kelamin: "",
    pendidikan: "",
    keperluan: "",
    kewarganegaraan: "",
    ttl: "",
    agama: "",
    pekerjaan: "",
    nik: "",
    alamat: "",
    rt_id: "",
    status_perkawinan: "",
    alasan: "",
    file_ktp: null as File | null,
    file_kk: null as File | null,
    ttd_masyarakat: null as File | null,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});


  const [alertData, setAlertData] = useState<AlertType | null>(null);

  // ===================== FETCH RT =====================
  useEffect(() => {
    const fetchRT = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/masyarakat/getRT/my",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const formatted = (res.data.data || []).map((rt: any) => ({
        value: rt.id,
        label: `${rt.nama} | ${rt.jabatan.replace('_', ' ').toUpperCase()}`,
        jabatan: rt.jabatan,
      }));


        setRtOptions(formatted);
      } catch (err) {
        console.log("Gagal mengambil RT:", err);
      }
    };

    if (modalAjukan) fetchRT();
  }, [modalAjukan]);

  // ===================== HANDLE CHANGE =====================
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSelect = (name: string, val: any) => {
    const finalValue = typeof val === "object" ? val.value : val;
    setFormData({ ...formData, [name]: finalValue });
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleExportChange = (e: any) => {
    const { name, value } = e.target;
    setExportData({ ...exportData, [name]: value });
    setExportErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleDeleteChange = (e: any) => {
    const { name, value } = e.target;
    setDeleteData({ ...deleteData, [name]: value });
    setDeleteErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleFileKTP = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        file_ktp: e.target.files![0],
      }));
      setErrors(prev => ({ ...prev, file_ktp: "" }));
    }
  };

  const handleFileKK = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        file_kk: e.target.files![0],
      }));
      setErrors(prev => ({ ...prev, file_kk: "" }));
    }
  };

  const handleFileTTD = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        ttd_masyarakat: e.target.files![0],
      }));
      setErrors(prev => ({ ...prev, ttd_masyarakat: "" }));
    }
  };

  // ===================== SUBMIT AJUAN SURAT =====================
  const handleSubmitAjukan = async (e: any) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (!formData.nama) newErrors.nama = "Nama wajib diisi";
    if (!formData.nik) newErrors.nik = "NIK wajib diisi";
    if (!formData.jenis_kelamin) newErrors.jenis_kelamin = "Pilih jenis kelamin";
    if (!formData.ttl) newErrors.ttl = "Tempat & tanggal lahir wajib diisi";
    if (!formData.status_perkawinan) newErrors.status_perkawinan = "Pilih status perkawinan";
    if (!formData.agama) newErrors.agama = "Pilih agama";
    if (!formData.kewarganegaraan) newErrors.kewarganegaraan = "Kewarganegaraan wajib diisi";
    if (!formData.pendidikan) newErrors.pendidikan = "Pendidikan wajib diisi";
    if (!formData.pekerjaan) newErrors.pekerjaan = "Pekerjaan wajib diisi";
    if (!formData.alamat) newErrors.alamat = "Alamat wajib diisi";
    if (!formData.keperluan) newErrors.keperluan = "Keperluan wajib diisi";
    if (!formData.rt_id) newErrors.rt_id = "RT wajib dipilih";
    if (!formData.alasan) newErrors.alasan = "Alasan wajib diisi";
    if (!formData.file_ktp) newErrors.file_ktp = "KTP wajib diupload";
    if (!formData.file_kk) newErrors.file_kk = "KK wajib diupload";
    if (!formData.ttd_masyarakat) newErrors.ttd_masyarakat = "Tanda tangan wajib diupload";

    setErrors(newErrors);

    // ⛔ HENTIKAN SUBMIT JIKA ADA ERROR
    if (Object.keys(newErrors).length > 0) return;

    try {
      // ================== FORM DATA (INI YANG BARU) ==================
      const payload = new FormData();

    // ✅ kirim masyarakat_id dari token (AMAN)
    payload.append("masyarakat_id", String(masyarakat_id));

    // ✅ kirim SEMUA field KECUALI masyarakat_id
    Object.entries(formData).forEach(([key, val]) => {
      if (key === "masyarakat_id") return;
      if (val !== null && val !== "") {
        payload.append(key, val as any);
      }
    });

      // ================== POST ==================
      const res = await axios.post(
        "http://127.0.0.1:8000/api/masyarakat/skck/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // ================== CEK RESPON BACKEND ==================
      if (res.data?.success !== true) {
        setModalAjukan(false);

        setAlertData({
          variant: "error",
          title: "Gagal Mengajukan",
          message: res.data?.message || "Data tidak valid.",
        });

        return;
      }

      // ================== SUCCESS ==================
      setModalAjukan(false);

      setAlertData({
        variant: "success",
        title: "Berhasil",
        message: res.data?.message || "Pengajuan Surat Pengantar RT dan Permohonan SKCK berhasil dikirim!",
      });

      // Reset form
      setFormData({
      nama: "",
      jenis_kelamin: "",
      pendidikan: "",
      keperluan: "",
      kewarganegaraan: "",
      ttl: "",
      agama: "",
      pekerjaan: "",
      nik: "",
      alamat: "",
      rt_id: "",
      status_perkawinan: "",
      alasan: "",
      file_ktp: null as File | null,
      file_kk: null as File | null,
      ttd_masyarakat: null as File | null,
      });

      // Simpan alert untuk setelah reload
      setTimeout(() => {
        localStorage.setItem(
          "pending_alert",
          JSON.stringify({
            variant: "success",
            title: "Berhasil",
            message: res.data?.message || "Pengajuan Surat Permohonan Pengajuan SKCK berhasil dikirim!",
          })
        );

        window.location.reload();
      }, 1000);
    } catch (error: any) {
      setModalAjukan(false);

      let msg =
        error?.response?.data?.message ||
        error?.response?.data?.errors ||
        "Terjadi kesalahan.";

      if (typeof msg === "object") {
        msg = Object.values(msg).join("\n");
      }

      setAlertData({
        variant: "error",
        title: "Gagal Mengajukan",
        message: msg,
      });
    }
  };

  // ===================== EXPORT AJUAN SURAT =====================
  const handleExportSubmit = async (e: any) => {
    e.preventDefault();

    const newErrors: any = {};
    if (!exportData.filename) newErrors.filename = "Nama file wajib diisi";
    if (!exportData.password) newErrors.password = "Password wajib diisi";

    setExportErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/perangkat_desa/skck/export",
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

      // ================= DOWNLOAD =================
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${exportData.filename}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);

      setModalExport(false);
      setExportData({ filename: "", password: "" });
      setExportErrors({});

      const alertPayload: AlertType = {
      variant: "success",
      title: "Berhasil",
      message: "Data Pengajuan Permohonan SKCK berhasil diexport.",
    };

  setAlertData(alertPayload);

  setTimeout(() => {
    localStorage.setItem("pending_alert", JSON.stringify(alertPayload));
    window.location.reload();
  }, 800);


    } catch (err: any) {
      let message = "Password salah atau Anda tidak memiliki akses.";

      if (err?.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const json = JSON.parse(text);
          message = json.message || message;
        } catch {}
      }

      setExportErrors({
        password: message,
      });
    }
  };

  // ===================== DELETE AJUAN SURAT =====================
  const handleDeleteSubmit = async (e: any) => {
    e.preventDefault();

    const newErrors: any = {};
    if (!deleteData.password) newErrors.password = "Password wajib diisi";

    setDeleteErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await axios.delete(
        "http://127.0.0.1:8000/api/perangkat_desa/skck/delete-all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            password: deleteData.password,
          },
        }
      );

      setModalDelete(false);
      setDeleteData({ password: "" });
      setDeleteErrors({});

      const alertPayload: AlertType = {
      variant: "success",
      title: "Berhasil",
      message: res.data?.message || "Semua data Pengajuan Permohonan SKCK berhasil dihapus.",
    };

  setAlertData(alertPayload);

  setTimeout(() => {
    localStorage.setItem("pending_alert", JSON.stringify(alertPayload));
    window.location.reload();
  }, 800);


    } catch (err: any) {
      let message = "Password salah atau Anda tidak memiliki akses.";

      if (err?.response?.data?.message) {
        message = err.response.data.message;
      }

      setDeleteErrors({
        password: message,
      });
    }
  };


  return (
    <>
      <PageMeta title="Ajuan Surat Permohonan Pengajuan SKCK" description="Halaman riwayat ajuan Permohonan SKCK" />
      <PageBreadcrumb pageTitle="Layanan Ajuan Surat Permohonan Pengajuan SKCK" />

      <div className="space-y-6">
        <ComponentCard>
         <div className="flex flex-col gap-5 mb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-medium text-gray-800 dark:text-white/90">
          Tabel Pengajuan Surat
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Kelola dan pantau status pengajuan surat warga Desa Mejayan.
        </p>
      </div>

        <div className="flex flex-wrap items-center gap-3">
            {(user_type === "masyarakat" || user_type === "super_admin") && (
              <div className="flex items-center gap-2">

            {/* BUTTON TATA CARA + TOOLTIP */}
            <div className="relative group flex items-center">
              {/* TOOLTIP (Muncul di Samping Kiri) */}
              <div
                role="tooltip"
                className="
                  pointer-events-none 
                  absolute right-full top-1/2 z-[99999] mr-3 w-max
                  -translate-y-1/2 translate-x-2
                  opacity-0 group-hover:opacity-100 group-hover:translate-x-0
                  transition-all duration-200
                  
                  /* Styling sesuai contoh */
                  whitespace-nowrap rounded-lg px-3.5 py-2 
                  text-xs font-medium shadow-md 
                  bg-white text-gray-700 border border-gray-200
                  dark:bg-[#1E2634] dark:text-white dark:border-gray-700
                "
              >
                Petunjuk Ajuan

                {/* ARROW (Kotak Rotasi 45 Derajat di sisi Kanan Tooltip) */}
                <div 
                  className="
                    absolute top-1/2 -right-1.5 -translate-y-1/2 
                    w-3 h-3 rotate-45 
                    bg-white border-t border-r border-gray-200
                    dark:bg-[#1E2634] dark:border-gray-700
                  "
                />
              </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setModalTataCara(true)}
            >
              ?
            </Button>
          </div>

          {/* BUTTON AJUKAN */}
         <Button
  size="sm"
  variant="primary"
  onClick={() => setModalAjukan(true)}
>
  {/* Icon SVG Plus sesuai contoh */}
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
  
  <span className="font-medium">Ajukan Surat</span>
</Button>
        </div>

          )}
        {/* BUTTON EXPORT */}
        {(user_type === "perangkat_desa" || user_type === "super_admin") && (
          <div className="flex items-center gap-2">
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

          {/* WRAPPER TOMBOL + TOOLTIP */}
        <div className="relative group flex flex-col items-center">
          {/* TOOLTIP (Muncul di Atas) */}
          <div
            role="tooltip"
            className="
              pointer-events-none 
              absolute bottom-full left-1/2 z-[9999] mb-3 w-max
              -translate-x-1/2 translate-y-2
              opacity-0 group-hover:opacity-100 group-hover:translate-y-0
              transition-all duration-200
              
              /* Styling sesuai contoh Anda */
              whitespace-nowrap rounded-lg px-3.5 py-2 
              text-xs font-medium shadow-md 
              bg-white text-gray-700 border border-gray-200
              dark:bg-[#1E2634] dark:text-white dark:border-gray-700
            "
          >
            Hapus Seluruh Data

            {/* ARROW (Kotak Rotasi 45 Derajat) */}
            <div 
              className="
                absolute -bottom-1.5 left-1/2 -translate-x-1/2 
                w-3 h-3 rotate-45 
                bg-white border-r border-b border-gray-200
                dark:bg-[#1E2634] dark:border-gray-700
              "
            />
          </div>

          {/* TOMBOL */}
          <Button
            size="sm"
            variant="danger"
            onClick={() => setModalDelete(true)}
            className="flex items-center gap-2 hover:opacity-90 transition-all shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </Button>
        </div>
          </div>
            )}
      </div>
      </div>
          <BasicTableSKCK />
        </ComponentCard>
      </div>

     {/* ======================== MODAL AJUKAN SURAT ======================== */}
      <Modal
        isOpen={modalAjukan}
        onClose={() => setModalAjukan(false)}
        className="max-w-[750px] w-full m-4"
      >
        <div className="relative flex flex-col w-full max-h-[90vh] overflow-hidden rounded-3xl bg-white dark:bg-gray-900 shadow-xl">
          
          {/* HEADER - Tetap di atas */}
          <div className="px-6 pt-8 pb-4 lg:px-11 lg:pt-11">
            <h4 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white/90">
              Form Ajuan Surat Permohonan Pengajuan SKCK
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Isi data lengkap Pengajuan Permohonan SKCK sebelum dikirim.
            </p>
          </div>

          {/* FORM BODY - Area yang bisa di-scroll */}
          <form onSubmit={handleSubmitAjukan} className="flex flex-col overflow-hidden">
            <div className="custom-scrollbar flex-grow overflow-y-auto px-6 pb-6 lg:px-11">
              
              {/* GRID LOGIC: grid-cols-1 (Mobile) & lg:grid-cols-2 (Desktop) */}
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                {/* NAMA LENGKAP */}
                <div className="space-y-2">
                  <Label>Nama Lengkap <span className="text-red-500">*</span></Label>
                  <Input
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    placeholder="Masukkan nama"
                  />
                  {errors.nama && <p className="text-xs text-red-500">{errors.nama}</p>}
                </div>

                {/* NIK */}
                <div className="space-y-2">
                  <Label>NIK <span className="text-red-500">*</span></Label>
                  <Input
                    name="nik"
                    value={formData.nik}
                    onChange={handleChange}
                    placeholder="Masukkan NIK Anda"
                  />
                  {errors.nik && <p className="text-xs text-red-500">{errors.nik}</p>}
                </div>

                {/* JENIS KELAMIN */}
                <div className="space-y-2">
                  <Label>Jenis Kelamin <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.jenis_kelamin}
                    options={[
                      { value: "Laki-laki", label: "Laki-laki" },
                      { value: "Perempuan", label: "Perempuan" },
                    ]}
                    onChange={(val) => handleSelect("jenis_kelamin", val)}
                    placeholder="Pilih jenis kelamin"
                  />
                  {errors.jenis_kelamin && <p className="text-xs text-red-500">{errors.jenis_kelamin}</p>}
                </div>

                {/* TTL */}
                <div className="space-y-2">
                  <Label>Tempat, Tanggal Lahir <span className="text-red-500">*</span></Label>
                  <Input
                    name="ttl"
                    value={formData.ttl}
                    onChange={handleChange}
                    placeholder="Contoh: Madiun, 1 Januari 1999"
                  />
                  {errors.ttl && <p className="text-xs text-red-500">{errors.ttl}</p>}
                </div>

                {/* STATUS PERKAWINAN */}
                <div className="space-y-2">
                  <Label>Status Perkawinan <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.status_perkawinan}
                    options={[
                      { value: "Belum Menikah", label: "Belum Menikah" },
                      { value: "Sudah Menikah", label: "Sudah Menikah" },
                      { value: "Janda", label: "Janda" },
                      { value: "Duda", label: "Duda" },
                    ]}
                    onChange={(val) => handleSelect("status_perkawinan", val)}
                    placeholder="Pilih status perkawinan"
                  />
                  {errors.status_perkawinan && <p className="text-xs text-red-500">{errors.status_perkawinan}</p>}
                </div>

                   {/* AGAMA */}
                <div className="space-y-2">
                  <Label>Agama <span className="text-red-500">*</span></Label>
                  <Input
                    name="agama"
                    value={formData.agama}
                    onChange={handleChange}
                    placeholder="Contoh: Islam, Kristen, Katolik, dll"
                  />
                  {errors.agama && <p className="text-xs text-red-500">{errors.agama}</p>}
                </div>

                {/* KEWARGANEGARAAN */}
                <div className="space-y-2">
                  <Label>Kewarganegaraan <span className="text-red-500">*</span></Label>
                  <Input
                    name="kewarganegaraan"
                    value={formData.kewarganegaraan}
                    onChange={handleChange}
                    placeholder="Contoh: Indonesia"
                  />
                  {errors.kewarganegaraan && <p className="text-xs text-red-500">{errors.kewarganegaraan}</p>}
                </div>

                {/* PENDIDIKAN */}
                <div className="space-y-2">
                  <Label>Pendidikan <span className="text-red-500">*</span></Label>
                  <Input
                    name="pendidikan"
                    value={formData.pendidikan}
                    onChange={handleChange}
                    placeholder="Contoh: S1, D4/D3, SMA, dll"
                  />
                  {errors.pendidikan && <p className="text-xs text-red-500">{errors.pendidikan}</p>}
                </div>

                {/* PEKERJAAN */}
                <div className="lg:col-span-2 space-y-2">
                  <Label>Pekerjaan <span className="text-red-500">*</span></Label>
                  <Input
                    name="pekerjaan"
                    value={formData.pekerjaan}
                    onChange={handleChange}
                    placeholder="Masukkan pekerjaan"
                  />
                  {errors.pekerjaan && <p className="text-xs text-red-500">{errors.pekerjaan}</p>}
                </div>

                {/* ALAMAT */}
                <div className="lg:col-span-2 space-y-2">
                  <Label>Alamat <span className="text-red-500">*</span></Label>
                  <Input
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    placeholder="Masukkan alamat lengkap"
                  />
                  {errors.alamat && <p className="text-xs text-red-500">{errors.alamat}</p>}
                </div>

                {/* ALASAN PERMOHONAN */}
                <div className="lg:col-span-2 space-y-2">
                  <Label>Alasan Permohonan <span className="text-red-500 text-[10px]">*alasan anda mengajukan permohonan SKCK</span></Label>
                  <Textarea
                    name="alasan"
                    value={formData.alasan}
                    onChange={handleChange}
                    placeholder="Contoh: Mendaftar kerja, beasiswa, dll"
                  />
                  {errors.alasan && <p className="text-xs text-red-500">{errors.alasan}</p>}
                </div>

                {/* KEPERLUAN */}
                <div className="lg:col-span-2 space-y-2">
                  <Label>Keperluan <span className="text-red-500 text-[10px]">*untuk surat pengantar RT</span></Label>
                  <Textarea
                    name="keperluan"
                    value={formData.keperluan}
                    onChange={handleChange}
                    placeholder="Contoh: Untuk mengajukan Surat permohonan SKCK"
                  />
                  {errors.keperluan && <p className="text-xs text-red-500">{errors.keperluan}</p>}
                </div>

                {/* PILIH RT */}
                <div className="lg:col-span-2 space-y-2">
                  <Label>Pilih RT <span className="text-red-500">*</span></Label>
                  <Select
                    options={rtOptions}
                    value={formData.rt_id}
                    onChange={(val) => handleSelect("rt_id", val)}
                    placeholder="Pilih nama Ketua RT sesuai dengan tempat tinggal anda"
                    searchable
                  />{errors.agama && <p className="text-xs text-red-500">{errors.agama}</p>}
                </div>

              {/* --- BAGIAN UPLOAD DENGAN PREVIEW --- */}

          {/* UPLOAD KTP */}
          <div className="lg:col-span-2 space-y-2">
            <Label>File KTP pemohon <span className="text-red-500">*</span></Label>
            <label htmlFor="file_ktp" className="mt-2 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer border-gray-300 hover:border-blue-500 bg-gray-50 dark:bg-gray-800/50 transition p-4 text-center">
              <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9m0 0-3 3m3-3 3 3m5 4.5v2.25A2.25 2.25 0 0114.75 21h-5.5A2.25 2.25 0 017 18.75V16.5m12 0h.75a2.25 2.25 0 002.25-2.25v-6A2.25 2.25 0 0019.75 6h-.75" />
              </svg>
              <span className="text-xs text-gray-500">Klik untuk upload (PDF / JPG / PNG, max 5MB)</span>
              <input id="file_ktp" type="file" accept="image/*,application/pdf" onChange={handleFileKTP} className="hidden" />
            </label>
            {errors.file_ktp && <p className="text-xs text-red-500">{errors.file_ktp}</p>}
            
            {/* Logika Preview KTP */}
            {formData.file_ktp && (
              <div className="mt-3 p-3 border rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  {formData.file_ktp.type === "application/pdf" ? (
                    <div className="flex items-center gap-2">
                      <span className="p-2 bg-red-100 text-red-600 rounded">PDF</span>
                      <span className="text-xs truncate max-w-[150px]">{formData.file_ktp.name}</span>
                    </div>
                  ) : (
                    <img src={URL.createObjectURL(formData.file_ktp)} alt="Preview KTP" className="h-16 w-24 object-cover rounded-md border" />
                  )}
                </div>
                {formData.file_ktp.type === "application/pdf" ? (
                  <a href={URL.createObjectURL(formData.file_ktp)} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 hover:underline">Lihat File</a>
                ) : (
                  <span className="text-[10px] text-green-600 font-medium">✓ Gambar Terpilih</span>
                )}
              </div>
            )}
          </div>

          {/* UPLOAD KK */}
          <div className="lg:col-span-2 space-y-2">
            <Label>File KK Pemohon <span className="text-red-500">*</span></Label>
            <label htmlFor="file_kk" className="mt-2 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer border-gray-300 hover:border-blue-500 bg-gray-50 dark:bg-gray-800/50 transition p-4 text-center">
              <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9m0 0-3 3m3-3 3 3m5 4.5v2.25A2.25 2.25 0 0114.75 21h-5.5A2.25 2.25 0 017 18.75V16.5m12 0h.75a2.25 2.25 0 002.25-2.25v-6A2.25 2.25 0 0019.75 6h-.75" />
              </svg>
              <span className="text-xs text-gray-500">Klik untuk upload (PDF / JPG / PNG, max 5MB)</span>
              <input id="file_kk" type="file" accept="image/*,application/pdf" onChange={handleFileKK} className="hidden" />
            </label>
            {errors.file_kk && <p className="text-xs text-red-500">{errors.file_kk}</p>}

            {/* Logika Preview KK */}
            {formData.file_kk && (
              <div className="mt-3 p-3 border rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  {formData.file_kk.type === "application/pdf" ? (
                    <div className="flex items-center gap-2">
                      <span className="p-2 bg-red-100 text-red-600 rounded">PDF</span>
                      <span className="text-xs truncate max-w-[150px]">{formData.file_kk.name}</span>
                    </div>
                  ) : (
                    <img src={URL.createObjectURL(formData.file_kk)} alt="Preview KK" className="h-16 w-24 object-cover rounded-md border" />
                  )}
                </div>
                {formData.file_kk.type === "application/pdf" ? (
                  <a href={URL.createObjectURL(formData.file_kk)} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 hover:underline">Lihat File</a>
                ) : (
                  <span className="text-[10px] text-green-600 font-medium">✓ Gambar Terpilih</span>
                )}
              </div>
            )}
          </div>

                {/* UPLOAD TANDA TANGAN (Hanya Image) DENGAN PREVIEW CHECKERBOARD */}
<div className="lg:col-span-2 space-y-2">
  <Label>Tanda Tangan Pemohon <span className="text-red-500 text-[10px]">*pastikan tanda tangan sudah dihapus background</span></Label>
  <label 
    htmlFor="ttd_masyarakat" 
    className="mt-2 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer border-gray-300 hover:border-blue-500 bg-gray-50 dark:bg-gray-800/50 transition p-4 text-center"
  >
    <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9m0 0-3 3m3-3 3 3m5 4.5v2.25A2.25 2.25 0 0114.75 21h-5.5A2.25 2.25 0 017 18.75V16.5m12 0h.75a2.25 2.25 0 002.25-2.25v-6A2.25 2.25 0 0019.75 6h-.75" />
    </svg>
    <span className="text-xs text-gray-500">Klik untuk upload (PNG/JPG Tanpa Background)</span>
    <input id="ttd_masyarakat" type="file" accept="image/*" onChange={handleFileTTD} className="hidden" />
  </label>
  {errors.ttd_masyarakat && <p className="text-xs text-red-500">{errors.ttd_masyarakat}</p>}
  
  {/* Logika Preview TTD dengan Checkerboard Background */}
  {formData.ttd_masyarakat && (
    <div className="mt-3 p-3 border rounded-xl bg-gray-50 dark:bg-gray-800 flex flex-col items-center">
      <div className="flex justify-between w-full mb-2 px-1">
        <p className="text-[10px] text-gray-500 font-medium">Preview Tanda Tangan:</p>
        <p className="text-[10px] text-green-600 font-bold">✅ {formData.ttd_masyarakat.name}</p>
      </div>

      {/* Container Image dengan pola kotak-kotak (Checkerboard) */}
      <div 
        className="relative w-full flex justify-center p-4 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden"
        style={{
          backgroundColor: '#ffffff',
          backgroundImage: 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }}
      >
        <img 
          src={URL.createObjectURL(formData.ttd_masyarakat)} 
          alt="Preview TTD" 
          className="h-24 object-contain relative z-10" 
        />
      </div>
      <p className="mt-2 text-[9px] text-gray-400 italic text-center">
        *Background kotak-kotak membantu Anda melihat transparansi tanda tangan.
      </p>
    </div>
  )}
</div>
</div>
</div>

            {/* FOOTER - Tetap di bawah, tidak ikut scroll */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 px-6 py-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 lg:px-11">
              <Button variant="outline" onClick={() => setModalAjukan(false)} className="w-full sm:w-auto">
                Batal
              </Button>
              <Button type="submit" variant="primary" className="w-full sm:w-auto px-8 font-bold bg-blue-600 hover:bg-blue-700 text-white border-none shadow-md">
                Ajukan Surat
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* ======================== MODAL EXPORT DATA SKCK ======================== */}
      <Modal
        isOpen={modalExport}
        onClose={() => setModalExport(false)}
        className="max-w-[500px] m-4"
      >
        <div className="relative w-full rounded-3xl bg-white p-6 dark:bg-gray-900">

          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Export Data Pengajuan Permohonan SKCK
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
                placeholder="contoh: data-Mengajukan permohonan SKCK-januari"
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

      {/* ======================== MODAL TATA CARA ======================== */}
      <Modal
        isOpen={modalTataCara}
        onClose={() => setModalTataCara(false)}
        className="max-w-[700px] m-4"
      >
        <div className="relative w-full max-w-[700px] rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-10">

          {/* HEADER */}
          <div className="mb-4">
            <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
              Tata Cara Pengajuan Permohonan SKCK
            </h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Panduan singkat pengajuanSurat Permohonan Pengajuan SKCK
            </p>
          </div>

          {/* CONTENT */}
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <ol className="list-decimal pl-5 space-y-2">
              <li>Form pengajuan ini sudah sekaligus mengajukan surat pengantar RT, jadi anda tidak perlu mengajukan lagi ke RT</li>
              <li>Pastikan data pribadi Anda sudah benar dan sesuai KTP.</li>
              <li>Isi seluruh form pengajuan Permohonan SKCK dengan lengkap.</li>
              <li>Pilih Ketua RT sesuai dengan wilayah tempat tinggal Anda.</li>
              <li>Isi keperluan dan alasan pengajuan dengan jelas.</li>
              <li>Isi kolom keperluan untuk surat pengantar RT.</li>
              <li>Isi kolom alasan untuk surat alasan anda mengajukan surat Permohonan SKCK.</li>
              <li>Unggah KTP dan KK anda (JPG/PDF).</li>
              <li>Unggah tanda tangan anda (background harus transparan).</li>
              <li>Periksa kembali data sebelum mengajukan.</li>
              <li>Pengajuan akan diproses oleh RT → Perangkat Desa → Kepala Desa.</li>
            </ol>

            <p className="mt-3 text-xs text-gray-500">
              * Jika data tidak lengkap atau tidak valid, pengajuan dapat ditolak.
            </p>
          </div>

          {/* FOOTER */}
          <div className="mt-6 flex justify-end">
            <Button variant="primary" onClick={() => setModalTataCara(false)}>
              Tutup
            </Button>
          </div>
        </div>
      </Modal>

      {/* ======================== MODAL DELETE DATA SKCK ======================== */}
      <Modal
        isOpen={modalDelete}
        onClose={() => setModalDelete(false)}
        className="max-w-[500px] m-4"
      >
        <div className="relative w-full rounded-3xl bg-white p-6 dark:bg-gray-900">

          <h4 className="mb-4 text-2xl font-semibold text-red-600">
            Hapus Semua Data Pengajuan Permohonan SKCK
          </h4>

          <p className="mb-6 text-sm text-gray-500">
            Masukkan password akun Anda untuk menghapus <b>SEMUA</b> data Pengajuan Permohonan SKCK.
            Tindakan ini <b>tidak dapat dibatalkan</b>. Jangan lupa untuk melakukan <b>EXPORT DATA</b> ke excel terlebih dahulu.
          </p>

          <form onSubmit={handleDeleteSubmit} className="space-y-4">

            <div>
              <Label>Password Akun</Label>

              <div className="relative">
                <Input
                  type={showDeletePassword ? "text" : "password"}
                  name="password"
                  value={deleteData.password}
                  onChange={handleDeleteChange}
                  placeholder="Masukkan password akun"
                  className="pr-10"
                />

              <button
                type="button"
                onClick={() => setShowDeletePassword(prev => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showDeletePassword ? (
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

              {deleteErrors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {deleteErrors.password}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setModalDelete(false)}>
                Batal
              </Button>

              <Button type="submit" variant="danger">
                Hapus Semua
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
