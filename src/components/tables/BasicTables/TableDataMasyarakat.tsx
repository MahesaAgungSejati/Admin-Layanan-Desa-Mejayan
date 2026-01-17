import { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "../../ui/modal/";
import Alert from "../../ui/alert/Alert";
import Button from "../../ui/button/Button"

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import ModalDetailDataMasyarakat from "../../ui/modal/ModalDetailDataMasyarakat";




// ================= INTERFACE LIST RINGAN UNTUK TABEL =================
interface Masyarakat {
  id: number;
  nama: string;
  email: string;
  nik: string;
  foto_profil: string | null;
  status_verifikasi: string;
}

// =============== INTERFACE DETAIL UNTUK MODAL =================
interface MasyarakatDetail {
  nama: string;
  nik: string;
  ttl: string;
  jenis_kelamin: string;
  no_hp: string;
  agama: string;
  kewarganegaraan: string;
  pendidikan: string;
  status_perkawinan: string;
  alamat: string;
  status_verifikasi: string;
  keterangan_verifikasi?: string;
 validator?: {
    nama?: string;
    role?: string;
  };
  users_validated_at?: string;
}


type AlertType = {
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
};

export default function BasicTableOne() {
  const [data, setData] = useState<Masyarakat[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<MasyarakatDetail | null>(null);

  
// ================= SEARCH & FILTER =================
const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("");
const [isFilterOpen, setIsFilterOpen] = useState(false);


// ================= PAGINATION =================
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;


  // ===== MODAL VERIFIKASI =====
const [modalVerifikasiOpen, setModalVerifikasiOpen] = useState(false);
const [verifikasiId, setVerifikasiId] = useState<number | null>(null);

const [updateStatusVerifikasi, setUpdateStatusVerifikasi] = useState("");
const [updateKeteranganVerifikasi, setUpdateKeteranganVerifikasi] = useState("");

const [alertData, setAlertData] = useState<AlertType | null>(null);

// error validasi khusus verifikasi
const [errorsVerifikasi, setErrorsVerifikasi] = useState<any>({});


const filteredData = data.filter((item) => {
  const matchSearch =
    item.nama.toLowerCase().includes(search.toLowerCase()) ||
    item.nik.includes(search);

  const matchStatus =
    statusFilter === "" ||
    item.status_verifikasi === statusFilter;

  return matchSearch && matchStatus;
});

const lastPage = Math.ceil(filteredData.length / itemsPerPage);

const paginatedData = filteredData.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

useEffect(() => {
  setCurrentPage(1);
}, [search, statusFilter]);

useEffect(() => {
  if (alertData) {
    const timer = setTimeout(() => {
      setAlertData(null);
    }, 5000); // ⏱ 3 detik

    return () => clearTimeout(timer);
  }
}, [alertData]);

useEffect(() => {
  const pending = localStorage.getItem("pending_alert");
  if (pending) {
    setAlertData(JSON.parse(pending));
    localStorage.removeItem("pending_alert");
  }
}, []);



const openModalVerifikasi = (item: Masyarakat) => {
  setVerifikasiId(item.id);
  setUpdateStatusVerifikasi(item.status_verifikasi || "");
  setUpdateKeteranganVerifikasi("");
  setModalVerifikasiOpen(true);
};

const handleVerifikasiMasyarakat = async () => {
  if (!verifikasiId) return;

  // 🔴 reset error lama
  setErrorsVerifikasi({});

  const newErrors: any = {};

  // ================= VALIDASI =================
  if (!updateStatusVerifikasi || updateStatusVerifikasi.trim() === "") {
    newErrors.status_verifikasi = "Status verifikasi wajib dipilih.";
  }

  if (
    updateStatusVerifikasi === "ditolak" &&
    (!updateKeteranganVerifikasi || !updateKeteranganVerifikasi.trim())
  ) {
    newErrors.keterangan_verifikasi =
      "Keterangan wajib diisi jika status ditolak.";
  }

  // ⛔ STOP JIKA ADA ERROR
  if (Object.keys(newErrors).length > 0) {
    setErrorsVerifikasi(newErrors);
    return;
  }

  try {
    const token = localStorage.getItem("token") ?? "";

    await axios.put(
      `http://127.0.0.1:8000/api/perangkat_desa/verifikasi/${verifikasiId}`,
      {
        status_verifikasi: updateStatusVerifikasi,
        keterangan_verifikasi: updateKeteranganVerifikasi || "",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    // ✅ SIMPAN ALERT KE LOCALSTORAGE (PENTING)
    localStorage.setItem(
      "pending_alert",
      JSON.stringify({
        variant: "success",
        title: "Berhasil",
        message: "Status verifikasi masyarakat berhasil diperbarui.",
      })
    );

    setModalVerifikasiOpen(false);

    // 🔄 REFRESH HALAMAN
    window.location.reload();

  } catch (err: any) {
    setModalVerifikasiOpen(false);

    // 🔴 error validasi dari backend
    const backendErrors = err?.response?.data?.errors;
    if (backendErrors) {
      setErrorsVerifikasi(backendErrors);
      return;
    }

    // ❌ SIMPAN ALERT ERROR (TANPA RELOAD)
    setAlertData({
      variant: "error",
      title: "Gagal",
      message:
        err?.response?.data?.message ||
        "Gagal memverifikasi data masyarakat.",
    });
  }
};





const API_URL = "http://127.0.0.1:8000/api/perangkat_desa/masyarakat";

// ================= FETCH LIST =================
useEffect(() => {
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(res.data.data);
    } catch (err) {
      console.error("Gagal memuat data masyarakat:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);



// ================= FETCH DETAIL =================
const fetchDetail = async (id: number) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setSelectedData(res.data.data); 
    setModalOpen(true);
  } catch (err) {
    console.error("Gagal mengambil detail masyarakat:", err);
  }
};


  if (loading) {
    return (
      <div className="p-5">
        <p>Memuat data masyarakat...</p>
      </div>
    );
  }


  return (
    <>
    {/* ===================== ALERT ===================== */}
{alertData && (
  <div className="mb-4">
    <Alert
      variant={alertData.variant}
      title={alertData.title}
      message={alertData.message}
    />
  </div>
)}

    {/* ===================== SEARCH & FILTER ===================== */}
 <div className="border-t border-gray-200 dark:border-gray-800 -mx-4 sm:-mx-6 px-4 sm:px-6 pt-4 pb-2 mb-2">
        <div className="flex flex-row items-center justify-between gap-3">
        
        {/* --- SEARCH (Kiri) --- */}
        {/* flex-1 agar di mobile mengambil sisa ruang.
            md:flex-none md:w-80 agar di desktop lebarnya pendek (sekitar 320px) */}
        <div className="relative flex-1 md:flex-none md:w-80">
          <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
            <svg className="fill-current" width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M3.04199 9.37336937363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search Nama / NIK..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="shadow-sm focus:border-brand-300 focus:ring-brand-500/10 h-11 w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
        </div>

    {/* --- FILTER DROPDOWN --- */}
    <div className="relative">
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="h-11 flex items-center gap-2 px-4 whitespace-nowrap"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M14.6537 5.90414C14.6537 4.48433 13.5027 3.33331 12.0829 3.33331C10.6631 3.33331 9.51206 4.48433 9.51204 5.90415M14.6537 5.90414C14.6537 7.32398 13.5027 8.47498 12.0829 8.47498C10.663 8.47498 9.51204 7.32398 9.51204 5.90415M14.6537 5.90414L17.7087 5.90411M9.51204 5.90415L2.29199 5.90411M5.34694 14.0958C5.34694 12.676 6.49794 11.525 7.91777 11.525C9.33761 11.525 10.4886 12.676 10.4886 14.0958M5.34694 14.0958C5.34694 15.5156 6.49794 16.6666 7.91778 16.6666C9.33761 16.6666 10.4886 15.5156 10.4886 14.0958M5.34694 14.0958L2.29199 14.0958M10.4886 14.0958L17.7087 14.0958"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span className="hidden sm:inline">Filter</span>
      </Button>

      {isFilterOpen && (
        <div className="absolute right-0 z-[999] mt-2 w-64 rounded-lg border border-gray-200 bg-white p-5 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 text-start">
            <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Status Verifikasi
            </label>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 focus:outline-none dark:border-gray-700 dark:text-white"
            >
              <option value="">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="disetujui">Disetujui</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("");
                setIsFilterOpen(false);
              }}
              className="flex-1 rounded-md border py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={() => setIsFilterOpen(false)}
              className="flex-1 rounded-md bg-blue-600 py-2 text-sm text-white hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
</div>


      {/* WRAPPER TABEL */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  User
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  NIK
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status Verifikasi
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

      <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
  {paginatedData.length === 0 ? (
   <TableRow>
  <td
    colSpan={5}
    className="px-5 py-6 text-center text-gray-500 text-theme-sm dark:text-gray-400"
  >
    Data tidak ditemukan
  </td>
</TableRow>

  ) : (
    paginatedData.map((item) => (
      <TableRow key={item.id}>
        {/* FOTO & NAMA */}
        <TableCell className="px-5 py-4 sm:px-6 text-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 overflow-hidden rounded-full">
              <img
                width={40}
                height={40}
                src={item.foto_profil || "/images/user/owner.jpg"}
                alt={item.nama}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                {item.nama}
              </span>
              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                Masyarakat
              </span>
            </div>
          </div>
        </TableCell>

        {/* EMAIL */}
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {item.email}
        </TableCell>

        {/* NIK */}
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {item.nik}
        </TableCell>

        {/* STATUS VERIFIKASI */}
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          <Badge
            size="sm"
            color={
              item.status_verifikasi === "disetujui"
                ? "success"
                : item.status_verifikasi === "pending"
                ? "warning"
                : "error"
            }
          >
            {item.status_verifikasi
              ? item.status_verifikasi.charAt(0).toUpperCase() +
                item.status_verifikasi.slice(1)
              : ""}
          </Badge>
        </TableCell>

        {/* ACTION */}
        <TableCell className="px-4 py-3">
          <div className="flex gap-2">
            <button
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 shadow-sm"
              onClick={() => fetchDetail(item.id)}
            >
<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
              Detail
            </button>

            <button
              onClick={() => openModalVerifikasi(item)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-200 shadow-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
              Verifikasi
            </button>
          </div>
        </TableCell>
      </TableRow>
    ))
  )}
</TableBody>
          </Table>

          <div className="flex items-center flex-col sm:flex-row justify-between border-t border-gray-200 px-5 py-4 dark:border-gray-800">

  <div className="flex items-center gap-2 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end bg-gray-50 dark:bg-gray-900 p-2 rounded-xl sm:bg-transparent sm:p-0 dark:sm:bg-transparent">

    {/* PREV */}
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(currentPage - 1)}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
    >
       <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M2.58203 9.99868C2.58174 10.1909 2.6549 10.3833 2.80152 10.53L7.79818 15.5301C8.09097 15.8231 8.56584 15.8233 8.85883 15.5305C9.15183 15.2377 9.152 14.7629 8.85921 14.4699L5.13911 10.7472L16.6665 10.7472C17.0807 10.7472 17.4165 10.4114 17.4165 9.99715C17.4165 9.58294 17.0807 9.24715 16.6665 9.24715L5.14456 9.24715L8.85919 5.53016C9.15199 5.23717 9.15184 4.7623 8.85885 4.4695C8.56587 4.1767 8.09099 4.17685 7.79819 4.46984L2.84069 9.43049C2.68224 9.568 2.58203 9.77087 2.58203 9.99715C2.58203 9.99766 2.58203 9.99817 2.58203 9.99868Z"></path>
          </svg>
    </button>

    {/* INFO MOBILE */}
    <span className="block text-sm font-medium text-gray-700 sm:hidden dark:text-gray-400">
      Page <span className="font-bold text-blue-600">{currentPage}</span> of {lastPage}
    </span>

    {/* ANGKA DESKTOP */}
    <ul className="hidden items-center gap-1 sm:flex">
      {[...Array(lastPage)].map((_, i) => (
        <li key={i}>
          <button
            onClick={() => setCurrentPage(i + 1)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
            }`}
          >
            {i + 1}
          </button>
        </li>
      ))}
    </ul>

    {/* NEXT */}
    <button
      disabled={currentPage === lastPage}
      onClick={() => setCurrentPage(currentPage + 1)}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
    >
        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M17.4165 9.9986C17.4168 10.1909 17.3437 10.3832 17.197 10.53L12.2004 15.5301C11.9076 15.8231 11.4327 15.8233 11.1397 15.5305C10.8467 15.2377 10.8465 14.7629 11.1393 14.4699L14.8594 10.7472L3.33203 10.7472C2.91782 10.7472 2.58203 10.4114 2.58203 9.99715C2.58203 9.58294 2.91782 9.24715 3.33203 9.24715L14.854 9.24715L11.1393 5.53016C10.8465 5.23717 10.8467 4.7623 11.1397 4.4695C11.4327 4.1767 11.9075 4.17685 12.2003 4.46984L17.1578 9.43049C17.3163 9.568 17.4165 9.77087 17.4165 9.99715C17.4165 9.99763 17.4165 9.99812 17.4165 9.9986Z"></path>
          </svg>
    </button>

  </div>
</div>

        </div>
      </div>

      {/* ==================== MODAL ==================== */}
      <ModalDetailDataMasyarakat
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        data={selectedData}
      />
     <Modal
  isOpen={modalVerifikasiOpen}
  onClose={() => setModalVerifikasiOpen(false)}
  className="max-w-[600px] m-4"
>
  <div className="w-full p-8 bg-white rounded-3xl dark:bg-gray-900 relative">
    {/* Tombol Close (X) */}
    <button 
      onClick={() => setModalVerifikasiOpen(false)}
      className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 transition"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    {/* HEADER SEPERTI CONTOH GAMBAR */}
   <h3 className="text-3xl font-bold mb-4">
      Verifikasi Data Masyarakat
    </h3>
    
    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
      Pastikan Anda telah memeriksa dokumen masyarakat dengan teliti. Tindakan ini akan <strong>mengubah status akses</strong> akun tersebut ke sistem layanan desa.
    </p>

    <div className="space-y-5">
      {/* STATUS */}
      <div>
        <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Pilih Status Verifikasi
        </label>
        <select
          value={updateStatusVerifikasi}
          onChange={(e) => {
            const status = e.target.value;
            setUpdateStatusVerifikasi(status);
            
            // LOGIKA DEFAULT KETERANGAN
            if (status === "disetujui") {
              setUpdateKeteranganVerifikasi("Akun Anda telah berhasil diverifikasi. Silakan login kembali untuk menggunakan layanan kami. Terima kasih.");
            } else if (status === "ditolak") {
              setUpdateKeteranganVerifikasi("Mohon maaf, verifikasi akun Anda ditolak karena data/dokumen yang diunggah tidak sesuai. Silakan lengkapi kembali profil Anda.");
            } else {
              setUpdateKeteranganVerifikasi("");
            }
          }}
          className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
        >
          <option value="">-- Pilih Status --</option>
          <option value="pending">Pending</option>
          <option value="disetujui">Disetujui</option>
          <option value="ditolak">Ditolak</option>
        </select>
        {errorsVerifikasi.status_verifikasi && (
  <p className="mt-1 text-xs text-red-500">
    {errorsVerifikasi.status_verifikasi}
  </p>
)}

      </div>

      {/* KETERANGAN */}
      <div>
        <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Pesan Konfirmasi Ke Masyarakat
        </label>
        <textarea
          value={updateKeteranganVerifikasi}
          onChange={(e) => setUpdateKeteranganVerifikasi(e.target.value)}
          className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
          rows={4}
          placeholder="Tulis alasan atau pesan untuk warga di sini..."
        />
      </div>
      {errorsVerifikasi.keterangan_verifikasi && (
  <p className="mt-1 text-xs text-red-500">
    {errorsVerifikasi.keterangan_verifikasi}
  </p>
)}

    </div>

    {/* ACTION BUTTONS SEPERTI CONTOH GAMBAR */}
    <div className="flex justify-end gap-3 mt-8">
      <button
        className="px-8 py-3 font-semibold text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800"
        onClick={() => setModalVerifikasiOpen(false)}
      >
        Batal
      </button>

      <button
        onClick={handleVerifikasiMasyarakat}
        disabled={!updateStatusVerifikasi}
        className={`px-8 py-3 font-semibold text-white rounded-xl transition shadow-lg ${
          !updateStatusVerifikasi 
          ? "bg-gray-400 cursor-not-allowed" 
          : "bg-blue-600 hover:bg-blue-700 active:scale-95"
        }`}
      >
        Simpan Verifikasi
      </button>
    </div>
  </div>
</Modal>
    </>
    
  );
}
