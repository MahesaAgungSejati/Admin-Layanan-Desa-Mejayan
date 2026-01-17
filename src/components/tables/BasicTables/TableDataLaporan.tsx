import { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "../../ui/modal/";
import Alert from "../../ui/alert/Alert";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import Button from "../../ui/button/Button";

interface Laporan {
  id_laporan: number;
  nama: string;
  isi_laporan: string;
  jawaban_laporan: string | null;
  status_laporan: "proses" | "ditinjau" | "sedang dikerjakan" | "ditolak" | "selesai";
  users_id: number | null;
  created_at: string;
  updated_at: string;
  petugas?: {
    id: number;
    nama: string;
    role: string;
    jabatan: string;
    foto_profil?: string | null;
  };
}

type AlertType = {
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
};

const truncateText = (text: string, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export default function TableDataLaporan() {
  const [data, setData] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
const [selectedData, setSelectedData] = useState<Laporan | null>(null);

const [modalValidasiOpen, setModalValidasiOpen] = useState(false);

const [updateStatus, setUpdateStatus] = useState("");
const [updateJawaban, setUpdateJawaban] = useState("");

const [loadingUpdate, setLoadingUpdate] = useState(false);
const [errorsUpdate, setErrorsUpdate] = useState<{
  status_laporan?: string;
  jawaban_laporan?: string;
}>({});

const [modalDelete, setModalDelete] = useState(false);
const [selectedDelete, setSelectedDelete] = useState<any>(null);

const [deleteData, setDeleteData] = useState({
  password: "",
});

const [deleteErrors, setDeleteErrors] = useState<{ password?: string }>({});
const [showDeletePassword, setShowDeletePassword] = useState(false);


// ================= SEARCH & FILTER =================
const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("");
const [sortDate, setSortDate] = useState<"terbaru" | "terlama">("terbaru");
const [isFilterOpen, setIsFilterOpen] = useState(false);

// ================= PAGINATION =================
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;

const [alertData, setAlertData] = useState<AlertType | null>(null);

const capitalizeFirst = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);


const handleOpenModal = (item: Laporan) => {
  setSelectedData(item);
  setIsOpen(true);
};

const handleCloseModal = () => {
  setIsOpen(false);
  setSelectedData(null);
};

const handleOpenValidasi = (item: Laporan) => {
  setSelectedData(item);
  setUpdateStatus(item.status_laporan);
  setUpdateJawaban(item.jawaban_laporan || "");
  setErrorsUpdate({});
  setModalValidasiOpen(true);
};

const handleOpenDelete = (item: any) => {
  setSelectedDelete(item);
  setDeleteData({ password: "" });
  setDeleteErrors({});
  setModalDelete(true);
};

const handleDeleteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setDeleteData({
    ...deleteData,
    [e.target.name]: e.target.value,
  });
};


useEffect(() => {
  if (alertData) {
    const timer = setTimeout(() => {
      setAlertData(null);
    }, 5000);

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

const filteredData = data
  .filter((item) => {
    const matchSearch = item.nama
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "" ||
      item.status_laporan === statusFilter;

    return matchSearch && matchStatus;
  })
  .sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();

    return sortDate === "terbaru"
      ? dateB - dateA
      : dateA - dateB;
  });

const lastPage = Math.ceil(filteredData.length / itemsPerPage);

const paginatedData = filteredData.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

useEffect(() => {
  setCurrentPage(1);
}, [search, statusFilter, sortDate]);


useEffect(() => {
  const fetchLaporan = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://127.0.0.1:8000/api/laporan/get-admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = res.data?.data;

      if (Array.isArray(responseData)) {
        setData(responseData);
      } else {
        setData([]);
        console.error("Response bukan array:", res.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data laporan", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  fetchLaporan();
}, []);


const handleUpdateLaporan = async () => {
  // ================= VALIDASI AWAL =================
  if (!selectedData?.id_laporan) {
    setAlertData({
      variant: "error",
      title: "Error",
      message: "Data laporan tidak valid.",
    });
    return;
  }

  if (!updateStatus) {
    setErrorsUpdate({
      status_laporan: "Status wajib dipilih",
    });
    return;
  }

  try {
    setLoadingUpdate(true);

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token tidak ditemukan");
    }

    await axios.put(
      `http://127.0.0.1:8000/api/laporan/${selectedData.id_laporan}`,
      {
        status_laporan: updateStatus,
        jawaban_laporan: updateJawaban || "",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    // ✅ SIMPAN ALERT (UNTUK SETELAH RELOAD)
    localStorage.setItem(
      "pending_alert",
      JSON.stringify({
        variant: "success",
        title: "Berhasil",
        message: "Laporan masyarakat berhasil diperbarui.",
      })
    );

    // tutup modal SEBELUM reload
    setModalValidasiOpen(false);

    // 🔄 reload halaman
    window.location.reload();

  } catch (err: any) {
    setModalValidasiOpen(false);

    setAlertData({
      variant: "error",
      title: "Gagal",
      message:
        err?.response?.data?.message ||
        "Gagal memperbarui laporan masyarakat.",
    });
  } finally {
    setLoadingUpdate(false);
  }
};


const handleDeleteSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // ================= VALIDASI AWAL =================
  if (!selectedDelete?.id_laporan) {
    setAlertData({
      variant: "error",
      title: "Error",
      message: "Data laporan tidak valid.",
    });
    return;
  }

  if (!deleteData.password) {
    setDeleteErrors({
      password: "Password wajib diisi",
    });
    return;
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token tidak ditemukan");
    }

    await axios.delete(
      `http://127.0.0.1:8000/api/laporan/${selectedDelete.id_laporan}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        data: {
          password: deleteData.password,
        },
      }
    );

    // ✅ SIMPAN ALERT (UNTUK SETELAH RELOAD)
    localStorage.setItem(
      "pending_alert",
      JSON.stringify({
        variant: "success",
        title: "Berhasil",
        message: "Laporan masyarakat berhasil dihapus.",
      })
    );

    // tutup modal SEBELUM reload
    setModalDelete(false);

    // 🔄 reload halaman
    window.location.reload();

  } catch (err: any) {
    setModalDelete(false);

    setAlertData({
      variant: "error",
      title: "Gagal",
      message:
        err?.response?.data?.message ||
        "Gagal menghapus laporan masyarakat.",
    });
  }
};


  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500 dark:text-gray-400">
        Memuat data laporan...
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
            placeholder="Search Nama"
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
  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm"
>
  <option value="">Semua Status</option>
  <option value="proses">Proses</option>
  <option value="ditinjau">Ditinjau</option>
  <option value="sedang dikerjakan">Sedang Dikerjakan</option>
  <option value="selesai">Selesai</option>
  <option value="ditolak">Ditolak</option>
</select>

          </div>
          <div className="mb-4">
  <label className="mb-2 block text-xs font-medium text-gray-700">
    Urutkan Tanggal
  </label>

  <select
    value={sortDate}
    onChange={(e) =>
      setSortDate(e.target.value as "terbaru" | "terlama")
    }
    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm"
  >
    <option value="terbaru">Terbaru</option>
    <option value="terlama">Terlama</option>
  </select>
</div>


          <div className="flex gap-2">
            <button
  type="button"
  onClick={() => {
    setSearch("");
    setStatusFilter("");
    setSortDate("terbaru");
    setIsFilterOpen(false);
  }}
  className="flex-1 rounded-md border py-2 text-sm"
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

  {/* ===================== TABEL & MODAL ===================== */}

    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
           <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Nama Pelapor
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Isi Laporan
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
             Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                  Tanggal Buat Laporan
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* ================= BODY ================= */}
<TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
  {paginatedData.length === 0 ? (
    <tr>
      <td
        colSpan={5}
        className="px-5 py-6 text-center text-gray-500 text-theme-sm dark:text-gray-400"
      >
        Tidak ada data
      </td>
    </tr>
  ) : (
    paginatedData.map((item) => (
      <TableRow key={item.id_laporan}>
        {/* NAMA */}
        <TableCell className="px-5 py-4 text-start">
          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
            {item.nama}
          </span>
          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
            masyarakat
          </span>
        </TableCell>

        {/* ISI LAPORAN */}
        <TableCell className="px-5 py-4 text-gray-500 text-theme-sm">
          {truncateText(item.isi_laporan, 60)}
        </TableCell>

        {/* STATUS */}
<TableCell className="px-5 py-4">
  <Badge
    size="sm"
    color={
      item.status_laporan === "selesai"
        ? "success"
        : item.status_laporan === "ditinjau"
        ? "warning"
        : item.status_laporan === "sedang dikerjakan"
        ? "info"
        : item.status_laporan === "ditolak"
        ? "error"
        : "primary"
    }
  >
    {capitalizeFirst(item.status_laporan)}
  </Badge>
</TableCell>


        {/* CREATED AT */}
        <TableCell className="px-5 py-4 text-gray-500 text-theme-sm">
          {new Date(item.created_at).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </TableCell>

       {/* ACTION */}
<TableCell className="px-5 py-4 text-start">
  <div className="flex items-center gap-2">
    
    {/* BUTTON DETAIL - Blue Theme */}
    <button
      onClick={() => handleOpenModal(item)}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 shadow-sm"
      title="Detail Laporan"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      Detail
    </button>

    {/* BUTTON VALIDASI - Emerald/Green Theme */}
    <button
      onClick={() => handleOpenValidasi(item)}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-200 shadow-sm"
      title="Validasi Laporan"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Validasi
    </button>

    {/* BUTTON HAPUS - Red Theme (Icon Only) */}
    <button
      onClick={() => handleOpenDelete(item)}
      className="inline-flex items-center justify-center p-1.5 text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 shadow-sm"
      title="Hapus Laporan"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
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

       {isOpen && selectedData && (
  <Modal isOpen={isOpen} onClose={handleCloseModal} className="max-w-[800px] m-4">
    <div className="relative w-full p-6 bg-white rounded-2xl dark:bg-gray-900 shadow-2xl overflow-hidden">
      
      {/* HEADER */}
      <div className="mb-6 border-b pb-4 dark:border-gray-700">
        <h4 className="text-2xl font-bold text-gray-800 dark:text-white">
          Detail Laporan Masyarakat
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Informasi lengkap laporan dan progres penanganan petugas.
        </p>
      </div>

      {/* CONTENT */}
      <div className="max-h-[65vh] overflow-y-auto custom-scrollbar pr-3">
        <div className="space-y-8">

          {/* SECTION 1: INFORMASI UTAMA */}
          <section>
            <h5 className="flex items-center text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-4">
              <span className="w-1 h-4 bg-blue-600 mr-2 rounded-full"></span>
              Informasi Laporan
            </h5>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 px-3">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">ID Laporan</p>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">#{selectedData?.id_laporan}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Status</p>
                <div className="mt-1">
                  <Badge
                    size="sm"
                    color={
                      selectedData?.status_laporan === "selesai" ? "success" :
                      selectedData?.status_laporan === "ditinjau" ? "warning" :
                      selectedData?.status_laporan === "sedang dikerjakan" ? "info" :
                      selectedData?.status_laporan === "ditolak" ? "error" : "primary"
                    }
                  >
                    {capitalizeFirst(selectedData.status_laporan)}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Nama Pelapor</p>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{selectedData?.nama}</p>
                <p className="text-[10px] italic text-gray-500">(Masyarakat)</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Waktu Masuk</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {selectedData?.created_at ? new Date(selectedData.created_at).toLocaleString("id-ID", { dateStyle: 'medium', timeStyle: 'short' }) : '-'}
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 2: ISI & JAWABAN */}
          <div className="grid grid-cols-1 gap-4">
            <section>
              <h5 className="flex items-center text-xs font-bold uppercase tracking-widest text-emerald-600 mb-3">
                <span className="w-1 h-4 bg-emerald-600 mr-2 rounded-full"></span>
                Isi Laporan
              </h5>
              <div className="p-4 border border-emerald-50 dark:border-gray-700 rounded-2xl bg-emerald-50/30 dark:bg-gray-800/50">
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {selectedData?.isi_laporan}
                </p>
              </div>
            </section>

            <section>
              <h5 className="flex items-center text-xs font-bold uppercase tracking-widest text-purple-600 mb-3">
                <span className="w-1 h-4 bg-purple-600 mr-2 rounded-full"></span>
                Respon Petugas
              </h5>
              <div className={`p-4 border rounded-2xl ${selectedData?.jawaban_laporan ? 'border-purple-100 bg-purple-50/30 dark:bg-purple-900/10' : 'border-gray-100 bg-gray-50 dark:bg-gray-800/50'}`}>
                {selectedData?.jawaban_laporan ? (
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {selectedData.jawaban_laporan}
                  </p>
                ) : (
                  <p className="text-sm italic text-gray-400 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Menunggu tanggapan dari petugas terkait...
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* SECTION 3: PETUGAS */}
          <section>
            <h5 className="flex items-center text-xs font-bold uppercase tracking-widest text-orange-600 mb-3">
              <span className="w-1 h-4 bg-orange-600 mr-2 rounded-full"></span>
              Petugas Penangan
            </h5>
            <div className="flex items-center p-4 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900">
              {selectedData?.petugas ? (
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-orange-100 bg-orange-50 flex-shrink-0">
                    {selectedData.petugas.foto_profil ? (
                      <img
                        src={selectedData.petugas.foto_profil}
                        alt={selectedData.petugas.nama}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-orange-600 font-bold uppercase text-lg">
                        {selectedData.petugas.nama.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">
                      {selectedData.petugas.nama}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {selectedData.petugas.jabatan} 
                    
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs italic text-gray-400 py-2">Belum ada petugas yang ditugaskan untuk laporan ini.</p>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center pt-6 border-t mt-6 dark:border-gray-700">
        <p className="text-[10px] text-gray-400 italic">
          Terakhir diperbarui: {selectedData?.updated_at ? new Date(selectedData.updated_at).toLocaleString("id-ID") : '-'}
        </p>
        <button
        className="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition text-sm shadow-md"
          onClick={handleCloseModal}
        >
          Tutup
        </button>
      </div>

    </div>
  </Modal>

)}
{modalValidasiOpen && selectedData && (
  <Modal
    isOpen={modalValidasiOpen}
    onClose={() => setModalValidasiOpen(false)}
    className="max-w-[600px] m-4"
  >
    <div className="w-full p-8 bg-white rounded-3xl dark:bg-gray-900 relative">

      {/* CLOSE */}
      <button
        onClick={() => setModalValidasiOpen(false)}
        className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 dark:bg-gray-800"
      >
        ✕
      </button>

      <h3 className="text-3xl font-bold mb-4">
        Validasi Laporan Masyarakat
      </h3>

      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Perbarui status dan berikan jawaban resmi kepada masyarakat.
      </p>

      {/* STATUS */}
      <div className="mb-5">
        <label className="block mb-2 text-sm font-semibold">
          Status Laporan
        </label>
       <select
  value={updateStatus}
  onChange={(e) => setUpdateStatus(e.target.value)}
  className="w-full p-3 rounded-xl border"
>
  <option value="">-- Pilih Status --</option>
  <option value="proses">Proses</option>
  <option value="ditinjau">Ditinjau</option>
  <option value="sedang dikerjakan">Sedang Dikerjakan</option>
  <option value="selesai">Selesai</option>
  <option value="ditolak">Ditolak</option>
</select>


        {errorsUpdate.status_laporan && (
          <p className="text-xs text-red-500 mt-1">
            {errorsUpdate.status_laporan}
          </p>
        )}
      </div>

      {/* JAWABAN */}
      <div>
        <label className="block mb-2 text-sm font-semibold">
          Jawaban / Keterangan
        </label>
        <textarea
          rows={4}
          value={updateJawaban}
          onChange={(e) => setUpdateJawaban(e.target.value)}
          className="w-full p-4 rounded-xl border"
          placeholder="Tulis jawaban untuk masyarakat..."
        />
      </div>

      {/* ACTION */}
      <div className="flex justify-end gap-3 mt-8">
        <button
          className="px-6 py-3 border rounded-xl"
          onClick={() => setModalValidasiOpen(false)}
        >
          Batal
        </button>

        <button
          onClick={handleUpdateLaporan}
          disabled={loadingUpdate}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl"
        >
          {loadingUpdate ? "Menyimpan..." : "Simpan Validasi"}
        </button>
      </div>
    </div>
  </Modal>
    )}

          <Modal
        isOpen={modalDelete}
        onClose={() => setModalDelete(false)}
        className="max-w-[500px] m-4"
      >
        <div className="relative w-full rounded-3xl bg-white p-6 dark:bg-gray-900">

          <h4 className="mb-4 text-2xl font-semibold text-red-600">
  Hapus Laporan
</h4>


          <p className="mb-6 text-sm text-gray-500">
  Masukkan password akun Anda untuk menghapus laporan ini.
  Tindakan ini <b>tidak dapat dibatalkan</b>.
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
  Hapus
</Button>

            </div>
          </form>
        </div>
      </Modal>
  </>
);
}