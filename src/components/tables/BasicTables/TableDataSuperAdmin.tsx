import { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button"
import Alert from "../../ui/alert/Alert";


import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import ModalDetailDataSuperAdmin from "../../ui/modal/ModalDetailDataSuperAdmin";
import ModalUpdateSuperAdmin from "../../ui/modal/ModalUpdateSuperAdmin";

/* ===============================
   INTERFACE SESUAI API
================================ */
interface SuperAdmin {
  id: number;
  nama: string;
  email: string;
  nik: string;
  jabatan: string;
  no_hp: string;
  foto_profil: string;
}

type AlertType = {
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
};

/* ===============================
   COMPONENT
================================ */
export default function TableDataSuperAdmin() {
  const [data, setData] = useState<SuperAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  const [openDetail, setOpenDetail] = useState(false);
const [detailData, setDetailData] = useState<any>(null);

const [openUpdate, setOpenUpdate] = useState(false);
const [formData, setFormData] = useState<any>({
  nama: "",
  email: "",
  nik: "",
  jabatan: "",
  no_hp: "",
  foto_profil: null,
});

const user = JSON.parse(localStorage.getItem("user") || "{}");
const role = user?.role;

const [selectedId, setSelectedId] = useState<number | null>(null);

const [openDeleteModal, setOpenDeleteModal] = useState(false);
const [deleteId, setDeleteId] = useState<number | null>(null);

const [alertData, setAlertData] = useState<AlertType | null>(null);

// ================= SEARCH & FILTER =================
const [search, setSearch] = useState("");
const [sortOrder, setSortOrder] = useState<"terbaru" | "terlama">("terbaru");
const [isFilterOpen, setIsFilterOpen] = useState(false);

// ================= PAGINATION =================
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;




const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData((prev: any) => ({ ...prev, [name]: value }));
};

const handleSelect = (name: string, value: string) => {
  setFormData((prev: any) => ({ ...prev, [name]: value }));
};

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files) return;
  const { name, files } = e.target;

  setFormData((prev: any) => ({
    ...prev,
    [name]: files[0],
  }));
};




const fetchData = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("Token tidak ditemukan");
    setLoading(false);
    return;
  }

  try {
    const res = await axios.get(
      "http://127.0.0.1:8000/api/users/super-admin",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setData(res.data.data ?? []);
  } catch (err) {
    console.error("Gagal ambil Super Admin:", err);
    setData([]); // ⬅️ PENTING: reset data
  } finally {
    setLoading(false);
  }
};



useEffect(() => {
  fetchData();
}, []);

const normalize = (val: any) =>
  val === null || val === "null" ? "" : val;

// ================= FILTER DATA =================
const filteredData = data
  .filter((item) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      item.nama.toLowerCase().includes(keyword) ||
      item.jabatan?.toLowerCase().includes(keyword);

    return matchSearch;
  })
  .sort((a, b) => {
    return sortOrder === "terbaru"
      ? b.id - a.id // terbaru
      : a.id - b.id; // terlama
  });

// ================= PAGINATION =================
const lastPage = Math.ceil(filteredData.length / itemsPerPage);

const paginatedData = filteredData.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);


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



const handleDetail = async (id: number) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `http://127.0.0.1:8000/api/users/super-admin/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setDetailData(res.data.data);
    setOpenDetail(true);
  } catch (error) {
    console.error("Gagal mengambil detail Super Admin", error);
  }
};


const handleOpenUpdate = async (id: number) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `http://127.0.0.1:8000/api/users/super-admin/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = res.data.data;

    setSelectedId(id);
    setFormData({
      ...data,
      nama: normalize(data.nama),
      email: normalize(data.email),
      ttl: normalize(data.ttl),
      agama: normalize(data.agama),
      kewarganegaraan: normalize(data.kewarganegaraan),
      pendidikan: normalize(data.pendidikan),
      alamat: normalize(data.alamat),
      no_hp: normalize(data.no_hp),
      jenis_kelamin: normalize(data.jenis_kelamin),
      status_perkawinan: normalize(data.status_perkawinan),
    });

    setOpenUpdate(true);
  } catch (error) {
    console.error("Gagal mengambil data Super Admin", error);
  }
};




const handleSaveUpdate = async () => {
  if (!selectedId) return;

  try {
    const token = localStorage.getItem("token");
    const payload = new FormData();

    // ===============================
    // ⬇️ FIELD WAJIB (HARUS DIKIRIM)
    // ===============================
    payload.append("nama", formData.nama);
    payload.append("ttl", formData.ttl);
    payload.append("agama", formData.agama);
    payload.append("kewarganegaraan", formData.kewarganegaraan);
    payload.append("pendidikan", formData.pendidikan);
    payload.append("alamat", formData.alamat);

    // ===============================
    // ⬇️ FIELD OPTIONAL
    // ===============================
    if (formData.jabatan) payload.append("jabatan", formData.jabatan);
    if (formData.no_hp) payload.append("no_hp", formData.no_hp);
    if (formData.jenis_kelamin)
      payload.append("jenis_kelamin", formData.jenis_kelamin);
    if (formData.status_perkawinan)
      payload.append("status_perkawinan", formData.status_perkawinan);

    // ===============================
    // ⬇️ FILE (HANYA JIKA ADA)
    // ===============================
    if (role === "super_admin" && formData.email) {
  payload.append("email", formData.email);
}

    if (formData.foto_profil instanceof File)
      payload.append("foto_profil", formData.foto_profil);

    if (formData.file_ktp instanceof File)
      payload.append("file_ktp", formData.file_ktp);

    if (formData.file_kk instanceof File)
      payload.append("file_kk", formData.file_kk);

    await axios.post(
      `http://127.0.0.1:8000/api/users/super-admin/${selectedId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setOpenUpdate(false);
    setSelectedId(null);

    localStorage.setItem(
      "pending_alert",
      JSON.stringify({
        variant: "success",
        title: "Berhasil",
        message: "Data Super Admin berhasil diperbarui.",
      })
    );

    window.location.reload();

  } catch (error: any) {
    console.error("422 DETAIL:", error?.response?.data);

    localStorage.setItem(
      "pending_alert",
      JSON.stringify({
        variant: "error",
        title: "Gagal",
        message:
          error?.response?.data?.message ??
          "Validasi gagal, cek data wajib.",
      })
    );

    window.location.reload();
  }
};



const handleOpenDelete = (id: number) => {
  setDeleteId(id);
  setOpenDeleteModal(true);
};

const handleDeleteSuperAdmin = async () => {
  if (!deleteId) return;

  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `http://127.0.0.1:8000/api/users/super-admin/${deleteId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setOpenDeleteModal(false);
    setDeleteId(null);

    // ===============================
    // ✅ SIMPAN ALERT KE LOCAL STORAGE
    // ===============================
    localStorage.setItem(
      "pending_alert",
      JSON.stringify({
        variant: "success",
        title: "Berhasil",
        message: "Data Super Admin berhasil dihapus.",
      })
    );

    // 🔄 REFRESH AGAR ALERT MUNCUL
    window.location.reload();

  } catch (error: any) {
    console.error("Gagal menghapus Super Admin", error);

    // ===============================
    // ❌ ALERT GAGAL
    // ===============================
    localStorage.setItem(
      "pending_alert",
      JSON.stringify({
        variant: "error",
        title: "Gagal",
        message:
          error?.response?.data?.message ??
          "Gagal menghapus data Super Admin.",
      })
    );

    window.location.reload();
  }
};



if (loading) {
  return (
    <div className="p-6 text-sm text-gray-500 dark:text-gray-400">
      Memuat data Super Admin...
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
            placeholder="Search Nama/Jabatan...."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="shadow-sm focus:border-brand-300 focus:ring-brand-500/10 h-11 w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
        </div>

    {/* --- FILTER --- */}
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
  <div className="absolute right-0 z-[999] mt-2 w-64 rounded-lg border bg-white p-5 shadow-lg dark:bg-gray-800">
    
    <label className="mb-2 block text-xs font-medium">
      Urutan Data
    </label>

    <select
      value={sortOrder}
      onChange={(e) =>
        setSortOrder(e.target.value as "terbaru" | "terlama")
      }
      className="h-11 w-full rounded-lg border px-3 text-sm"
    >
      <option value="terbaru">Terbaru</option>
      <option value="terlama">Terlama</option>
    </select>

    <div className="mt-4 flex gap-2">
      {/* RESET */}
      <button
        onClick={() => {
          setSearch("");
          setSortOrder("terbaru");
          setCurrentPage(1);
          setIsFilterOpen(false);
        }}
        className="flex-1 border rounded-md py-2 text-sm"
      >
        Reset
      </button>

      {/* APPLY */}
      <button
        onClick={() => {
          setCurrentPage(1);
          setIsFilterOpen(false);
        }}
        className="flex-1 bg-blue-600 text-white rounded-md py-2 text-sm"
      >
        Apply
      </button>
    </div>

  </div>
)}
    </div>

  </div>
</div>

    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>

          {/* HEADER (DESAIN TETAP) */}
           <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Nama
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Jabatan
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
                No. HP
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {paginatedData.map((superAdmin) => (
              <TableRow key={superAdmin.id}>
                {/* FOTO + NAMA + EMAIL */}
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                     <img
                        src={superAdmin.foto_profil || "/images/user/owner.jpg"}
                        alt={superAdmin.nama}
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/images/user/owner.jpg";
                        }}
                        />
                    </div>
                    <div>
                      <div className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {superAdmin.nama}
                      </div>
                      <div className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {superAdmin.email}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* JABATAN */}
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {superAdmin.jabatan}
                </TableCell>

                {/* NIK */}
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {superAdmin.nik}
                </TableCell>

                {/* NO HP */}
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {superAdmin.no_hp || "-"}
                </TableCell>

                {/* ACTION */}
                <TableCell className="px-4 py-3">
          <div className="flex gap-2">
  {/* DETAIL */}
  <button
    onClick={() => handleDetail(superAdmin.id)}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 shadow-sm"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
    Detail
  </button>

  {/* UPDATE */}
  <button
    onClick={() => handleOpenUpdate(superAdmin.id)}
   className="inline-flex items-center justify-center p-1.5 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all duration-200 shadow-sm"
          title="Update Data"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  </button>

  {/* DELETE */}
<button
  onClick={() => handleOpenDelete(superAdmin.id)}
  className="inline-flex items-center justify-center p-1.5 text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 shadow-sm"
    title="Hapus Data"
>
   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
</button>
 </div>

</TableCell>

              </TableRow>
            ))}
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
      <svg
        className="fill-current"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.58203 9.99868C2.58174 10.1909 2.6549 10.3833 2.80152 10.53L7.79818 15.5301C8.09097 15.8231 8.56584 15.8233 8.85883 15.5305C9.15183 15.2377 9.152 14.7629 8.85921 14.4699L5.13911 10.7472L16.6665 10.7472C17.0807 10.7472 17.4165 10.4114 17.4165 9.99715C17.4165 9.58294 17.0807 9.24715 16.6665 9.24715L5.14456 9.24715L8.85919 5.53016C9.15199 5.23717 9.15184 4.7623 8.85885 4.4695C8.56587 4.1767 8.09099 4.17685 7.79819 4.46984L2.84069 9.43049C2.68224 9.568 2.58203 9.77087 2.58203 9.99715Z"
        />
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
      <svg
        className="fill-current"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.4165 9.9986C17.4168 10.1909 17.3437 10.3832 17.197 10.53L12.2004 15.5301C11.9076 15.8231 11.4327 15.8233 11.1397 15.5305C10.8467 15.2377 10.8465 14.7629 11.1393 14.4699L14.8594 10.7472L3.33203 10.7472C2.91782 10.7472 2.58203 10.4114 2.58203 9.99715C2.58203 9.58294 2.91782 9.24715 3.33203 9.24715L14.854 9.24715L11.1393 5.53016C10.8465 5.23717 10.8467 4.7623 11.1397 4.4695C11.4327 4.1767 11.9075 4.17685 12.2003 4.46984L17.1578 9.43049C17.3163 9.568 17.4165 9.77087 17.4165 9.99715Z"
        />
      </svg>
    </button>

  </div>
</div>

        <ModalDetailDataSuperAdmin
  isOpen={openDetail}
  onClose={() => setOpenDetail(false)}
  data={detailData}
/>


{openUpdate && formData && (
  <ModalUpdateSuperAdmin
    isOpen={openUpdate}
    closeModal={() => setOpenUpdate(false)}
    formData={formData}
    handleInputChange={handleInputChange}
    handleSelect={handleSelect}
    handleFileChange={handleFileChange}
    handleSave={handleSaveUpdate}
  />
)}

<Modal
  isOpen={openDeleteModal}
  onClose={() => setOpenDeleteModal(false)}
  className="max-w-[500px] m-4"
>
  <div className="relative w-full rounded-3xl bg-white p-6 dark:bg-gray-900">
    
    <h4 className="mb-4 text-2xl font-semibold text-red-600">
      Konfirmasi Hapus Super Admin
    </h4>

    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
      Apakah Anda yakin ingin menghapus data Super Admin ini?
      Tindakan ini <b>tidak dapat dibatalkan</b> dan data akan hilang secara permanen dari sistem.
    </p>

    <div className="flex justify-end gap-3 pt-4">
      <Button
        variant="outline"
        onClick={() => setOpenDeleteModal(false)}
      >
        Batal
      </Button>

      <Button
        variant="danger"
        onClick={handleDeleteSuperAdmin}
      >
        Hapus
      </Button>
    </div>
  </div>
</Modal>


      </div>
    </div>
    </>
  );
}
