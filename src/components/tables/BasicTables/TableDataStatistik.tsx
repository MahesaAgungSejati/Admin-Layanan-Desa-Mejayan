import { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "../../ui/modal/";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Button from "../../ui/button/Button"
import Alert from "../../ui/alert/Alert";


import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

/* ================================
   Interface Data Statistik
================================ */
interface DataStatistik {
  id_data_statistik: number;
  nama_file: string;
  file_data: string;
  tgl_buat: string;
  tgl_edit: string | null;
  uploader: {
    id: number;
    nama: string;
    role: string;
  };
}

type AlertType = {
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
};




/* ================================
   Component
================================ */
export default function TableDataStatistik() {
  const [tableData, setTableData] = useState<DataStatistik[]>([]);
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
const [selectedData, setSelectedData] = useState<DataStatistik | null>(null);


const [isEditOpen, setIsEditOpen] = useState(false);
const [selectedEditData, setSelectedEditData] = useState<DataStatistik | null>(null);

const [formEdit, setFormEdit] = useState({
  nama_file: "",
  file_data: null as File | string | null,
});

const [openDeleteModal, setOpenDeleteModal] = useState(false);
const [selectedDeleteData, setSelectedDeleteData] = useState<DataStatistik | null>(null);

// ================= SEARCH & FILTER =================
const [search, setSearch] = useState("");
const [dateFilter, setDateFilter] = useState<"" | "oldest" | "newest">("");
const [isFilterOpen, setIsFilterOpen] = useState(false);

// ================= PAGINATION =================
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10


const [alertData, setAlertData] = useState<AlertType | null>(null);

const handleOpenEdit = (data: DataStatistik) => {
  setSelectedEditData(data);
  setFormEdit({
    nama_file: data.nama_file,
    file_data: data.file_data, // file lama (string)
  });
  setIsEditOpen(true);
};

const handleCloseEdit = () => {
  setIsEditOpen(false);
  setSelectedEditData(null);
};


const handleOpenDelete = (data: DataStatistik) => {
  setSelectedDeleteData(data);
  setOpenDeleteModal(true);
};

const handleCloseDelete = () => {
  setOpenDeleteModal(false);
  setSelectedDeleteData(null);
};

const formatRole = (role: string) => {
  return role
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

useEffect(() => {
  setCurrentPage(1);
}, [search, dateFilter]);



const filteredData = tableData
  // 🔍 SEARCH NAMA FILE
  .filter((item) =>
    item.nama_file.toLowerCase().includes(search.toLowerCase())
  )
  // 📅 SORT BERDASARKAN TGL_BUAT
  .sort((a, b) => {
    if (dateFilter === "oldest") {
      return new Date(a.tgl_buat).getTime() - new Date(b.tgl_buat).getTime();
    }

    if (dateFilter === "newest") {
      return new Date(b.tgl_buat).getTime() - new Date(a.tgl_buat).getTime();
    }

    return 0;
  });

const lastPage = Math.ceil(filteredData.length / itemsPerPage);

const paginatedData = filteredData.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

useEffect(() => {
  setCurrentPage(1);
}, [search, dateFilter]);


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


const fetchData = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://127.0.0.1:8000/api/data-statistik/admin",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTableData(res.data.data);
  } catch (error) {
    console.error("Gagal mengambil data statistik", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchData();
}, []);

  /* ================================
     Action Handler
  ================================ */
const handleDetail = (item: DataStatistik) => {
  setSelectedData(item);
  setIsOpen(true);
};

const handleCloseModal = () => {
  setIsOpen(false);
  setSelectedData(null);
};

const handleUpdateStatistik = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!selectedEditData) return;

  try {
    const token = localStorage.getItem("token") ?? "";

    const payload = new FormData();
    payload.append("nama_file", formEdit.nama_file);

    if (formEdit.file_data instanceof File) {
      payload.append("file_data", formEdit.file_data);
    }

    await axios.post(
      `http://127.0.0.1:8000/api/data-statistik/${selectedEditData.id_data_statistik}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      }
    );

    localStorage.setItem(
      "pending_alert",
      JSON.stringify({
        variant: "success",
        title: "Berhasil",
        message: "Data statistik berhasil diperbarui.",
      })
    );

    window.location.reload();
  } catch (err: any) {
    setIsEditOpen(false);

    setAlertData({
      variant: "error",
      title: "Gagal",
      message:
        err?.response?.data?.message ||
        "Gagal memperbarui data statistik.",
    });
  }
};

const handleDeleteStatistik = async () => {
  if (!selectedDeleteData) return;

  try {
    const token = localStorage.getItem("token") ?? "";

    await axios.delete(
      `http://127.0.0.1:8000/api/data-statistik/delete/${selectedDeleteData.id_data_statistik}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    // ✅ SIMPAN ALERT KE LOCALSTORAGE
    localStorage.setItem(
      "pending_alert",
      JSON.stringify({
        variant: "success",
        title: "Berhasil",
        message: "Data statistik berhasil dihapus.",
      })
    );

    // 🔄 RELOAD HALAMAN
    window.location.reload();

  } catch (err: any) {
    setOpenDeleteModal(false);

    setAlertData({
      variant: "error",
      title: "Gagal",
      message:
        err?.response?.data?.message ||
        "Gagal menghapus data statistik.",
    });
  }
};

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500 dark:text-gray-400">
        Memuat data Statistik...
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

    {/* --- SEARCH --- */}
    <div className="relative flex-1 md:flex-none md:w-80">
      <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
        <svg className="fill-current" width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M3.04199 9.37336937363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z" />
            </svg>
      </span>
      <input
        type="text"
        placeholder="Search Nama File..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-11 w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-11 text-sm"
      />
    </div>

    {/* --- FILTER --- */}
    <div className="relative">
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="h-11 flex items-center gap-2 px-4"
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
            Urutan Tanggal Buat
          </label>

          <select
            value={dateFilter}
            onChange={(e) =>
              setDateFilter(e.target.value as "oldest" | "newest" | "")
            }
            className="h-11 w-full rounded-lg border px-3 text-sm"
          >
            <option value="">Default</option>
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlamat</option>
          </select>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                setSearch("");
                setDateFilter("");
                setIsFilterOpen(false);
              }}
              className="flex-1 border rounded-md py-2 text-sm"
            >
              Reset
            </button>

            <button
              onClick={() => setIsFilterOpen(false)}
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
          {/* ================= Table Header ================= */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Uploader
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Nama File
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Tanggal Buat
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Tanggal Diperbarui
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* ================= Table Body ================= */}
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
                <TableRow key={item.id_data_statistik}>
                  {/* UPLOADER */}
                  <TableCell className="px-5 py-4 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {item.uploader.nama}
                    </span>
                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                      {formatRole(item.uploader.role)}
                    </span>
                  </TableCell>

                  {/* NAMA FILE */}
                  <TableCell className="px-5 py-4 text-start text-gray-800 text-theme-sm dark:text-white/90">
                    {item.nama_file}
                  </TableCell>

                  {/* TANGGAL BUAT */}
                  <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                    {item.tgl_buat}
                  </TableCell>

                  {/* TANGGAL EDIT */}
                  <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                    {item.tgl_edit ?? "Belum pernah diperbarui"}
                  </TableCell>

                 <TableCell className="px-4 py-3 text-start">
  <div className="flex items-center gap-2">
    {/* DETAIL */}
    <button
      onClick={() => handleDetail(item)}
       className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 shadow-sm"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
      Detail
    </button>

    {/* EDIT */}
    <button
      onClick={() => handleOpenEdit(item)}
      className="inline-flex items-center justify-center p-1.5 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all duration-200 shadow-sm"
          title="Edit Data"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
    </button>
    {/* DELETE */}
<button
  onClick={() => handleOpenDelete(item)}
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
              ))
            )}
          </TableBody>
        </Table>
        {/* ================= PAGINATION ================= */}

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


        {isOpen && selectedData && (
  <Modal isOpen={isOpen} onClose={handleCloseModal} className="max-w-[800px] m-4">
    <div className="relative w-full p-6 bg-white rounded-2xl dark:bg-gray-900 shadow-2xl">

      {/* HEADER */}
      <div className="mb-4 border-b pb-3 dark:border-gray-700">
        <h4 className="text-2xl font-bold text-blue-700 dark:text-blue-400">
          Detail Data Statistik
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Informasi lengkap mengenai data statistik yang diunggah.
        </p>
      </div>

      {/* CONTENT */}
      <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-3">
        <div className="space-y-6">

          {/* INFORMASI FILE */}
          <section>
            <h5 className="text-sm font-bold uppercase tracking-wider text-blue-600 mb-4 pl-2 border-l-4 border-blue-600">
              Informasi File
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Nama File</p>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {selectedData.nama_file}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Uploader</p>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {selectedData.uploader.nama}
                </p>
                <p className="text-xs italic text-gray-500">
                  ({selectedData.uploader.role.replace("_", " ")})
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Tanggal Buat</p>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {selectedData.tgl_buat}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Tanggal Edit</p>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {selectedData.tgl_edit || "-"}
                </p>
              </div>
            </div>
          </section>

          {/* FILE DATA */}
          <section>
            <h5 className="text-sm font-bold uppercase tracking-wider text-green-600 mb-4 pl-2 border-l-4 border-green-600">
              File Data Statistik
            </h5>

            <div className="p-4 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                File Excel
              </p>

              <a
                href={`http://127.0.0.1:8000/${selectedData.file_data}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 text-xs font-bold hover:bg-blue-100 transition-all shadow-sm"
              >
                Lihat / Unduh File
              </a>
            </div>
          </section>

        </div>
      </div>

      {/* FOOTER */}
      <div className="flex justify-end pt-5 border-t mt-5 dark:border-gray-700">
        <button
          className="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition text-sm shadow-md"
          onClick={handleCloseModal}
        >
          Tutup Detail
        </button>
      </div>

    </div>
  </Modal>
)}
<Modal
  isOpen={isEditOpen}
  onClose={handleCloseEdit}
  className="max-w-[800px] w-full m-4"
>
  <div className="relative flex flex-col w-full max-h-[90vh] overflow-hidden rounded-3xl bg-white dark:bg-gray-900 shadow-xl">

    {/* HEADER */}
    <div className="px-6 pt-8 pb-4 lg:px-11 lg:pt-11">
      <h4 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white/90">
        Edit Data Statistik
      </h4>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Perbarui nama file atau unggah ulang file data statistik.
      </p>
    </div>

    {/* FORM */}
    <form onSubmit={handleUpdateStatistik} className="flex flex-col overflow-hidden">
      <div className="custom-scrollbar flex-grow overflow-y-auto px-6 pb-6 lg:px-11">

        <div className="space-y-5">
          {/* NAMA FILE */}
          <div className="space-y-2">
            <Label>Nama File <span className="text-red-500">*</span></Label>
            <Input
              value={formEdit.nama_file}
              onChange={(e) =>
                setFormEdit({ ...formEdit, nama_file: e.target.value })
              }
              placeholder="Masukkan nama data statistik"
            />
          </div>

          {/* FILE DATA */}
          <div className="space-y-2">
            <Label>File Data Statistik</Label>

            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer border-gray-300 hover:border-blue-500 bg-gray-50 dark:bg-gray-800/50 transition">
              <span className="text-xs text-gray-500">
                Klik untuk mengganti file (Excel)
              </span>
              <input
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) =>
                  setFormEdit({
                    ...formEdit,
                    file_data: e.target.files?.[0] || null,
                  })
                }
              />
            </label>

            {/* PREVIEW FILE */}
            {formEdit.file_data && (
              <p className="text-xs text-gray-600 italic">
                {typeof formEdit.file_data === "string"
                  ? "File lama masih digunakan"
                  : formEdit.file_data.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex justify-end gap-3 px-6 py-5 border-t bg-gray-50 dark:bg-gray-800/50 lg:px-11">
        <Button variant="outline" onClick={handleCloseEdit}>
          Batal
        </Button>
        <Button
          type="submit"
          className="px-8 font-bold bg-blue-600 hover:bg-blue-700 text-white"
        >
          Simpan Perubahan
        </Button>
      </div>
    </form>
  </div>
</Modal>
<Modal
  isOpen={openDeleteModal}
  onClose={handleCloseDelete}
  className="max-w-[500px] m-4"
>
  <div className="relative w-full rounded-3xl bg-white p-6 dark:bg-gray-900">
    
    <h4 className="mb-4 text-2xl font-semibold text-red-600">
      Konfirmasi Hapus Data Statistik
    </h4>

    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
      Apakah Anda yakin ingin menghapus data statistik ini?
      Tindakan ini <b>tidak dapat dibatalkan</b> dan data akan
      dihapus secara permanen dari sistem.
    </p>

    <div className="flex justify-end gap-3 pt-4">
      <Button
        variant="outline"
        onClick={handleCloseDelete}
      >
        Batal
      </Button>

      <Button
        variant="danger"
        onClick={handleDeleteStatistik}
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
