import { useEffect, useState } from "react";
import axios from "axios";
import Alert from "../../ui/alert/Alert";
import Button from "../../ui/button/Button"
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import { Modal } from "../../ui/modal/";


import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import ModalDetailDataBerita from "../../ui/modal/ModalDetailDataBerita";
import ModalUpdateBerita from "../../ui/modal/ModalUpdateBerita";


interface Berita {
  id_berita: number;
  judul: string;
  isi: string;
  jenis_berita: string;
  image: string | null;
  author: string;
  tanggal_update: string;
}

type AlertType = {
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
};


export default function TableDataBerita() {
  const [data, setData] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
const [selectedBerita, setSelectedBerita] = useState<any>(null);

const [alertData, setAlertData] = useState<AlertType | null>(null);

// === STATE UPDATE (TAMBAHAN) ===
const [openUpdateModal, setOpenUpdateModal] = useState(false);

const [formData, setFormData] = useState({
  judul: "",
  isi: "",
  jenis_berita: "",
  image: null as File | string | null,
});

// === KONFIGURASI EDITOR UNTUK UPDATE ===
const editorUpdate = useEditor({
  extensions: [
    StarterKit,
    Underline,
    TextStyle,
    Color,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Placeholder.configure({ placeholder: "Tulis isi berita di sini..." }),
  ],
  content: formData.isi,
  onUpdate: ({ editor }) => {
    setFormData((prev) => ({ ...prev, isi: editor.getHTML() }));
  },
});

// === STATE DELETE ===
const [openDeleteModal, setOpenDeleteModal] = useState(false);
const [deleteId, setDeleteId] = useState<number | null>(null);

// ================= SEARCH & FILTER =================
const [search, setSearch] = useState("");
const [jenisFilter, setJenisFilter] = useState("");
const [isFilterOpen, setIsFilterOpen] = useState(false);

// ================= PAGINATION =================
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;


  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://127.0.0.1:8000/api/berita/get-admin",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(res.data.data || []);
      } catch (error) {
        console.error("Gagal mengambil data berita", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
  }, []);



  useEffect(() => {
  if (alertData) {
    const timer = setTimeout(() => {
      setAlertData(null);
    }, 5000); // ⏱ 5 detik

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

useEffect(() => {
  setCurrentPage(1);
}, [search, jenisFilter]);

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500 dark:text-gray-400">
        Memuat data berita...
      </div>
    );
  }

  const filteredData = data.filter((item) => {
  const matchSearch =
    item.judul.toLowerCase().includes(search.toLowerCase());

  const matchJenis =
    jenisFilter === "" ||
    item.jenis_berita === jenisFilter;

  return matchSearch && matchJenis;
});

const lastPage = Math.ceil(filteredData.length / itemsPerPage);

const paginatedData = filteredData.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);




  // === HANDLER UPDATE (TAMBAHAN) ===
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleSelect = (name: string, value: string) => {
  setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files![0],
    }));
  }
};

const handleSaveUpdate = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    const form = new FormData();
    form.append("judul", formData.judul);
    form.append("isi", formData.isi);
    form.append("jenis_berita", formData.jenis_berita);

    if (formData.image instanceof File) {
      form.append("image", formData.image);
    }

    await axios.post(
      `http://127.0.0.1:8000/api/berita/${selectedBerita.id_berita}`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // ✅ SIMPAN ALERT SUCCESS
    localStorage.setItem(
      "pending_alert",
      JSON.stringify({
        variant: "success",
        title: "Berhasil",
        message: "Berita berhasil diperbarui.",
      })
    );

    setOpenUpdateModal(false);
    window.location.reload();

  } catch (err: any) {
    setOpenUpdateModal(false);

    // ❌ JIKA ERROR BACKEND (TANPA RELOAD)
    setAlertData({
      variant: "error",
      title: "Gagal",
      message:
        err?.response?.data?.message ||
        "Gagal memperbarui berita.",
    });
  }
};


const handleDeleteBerita = async () => {
  if (!deleteId) return;

  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `http://127.0.0.1:8000/api/berita/${deleteId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // ✅ SIMPAN ALERT SUCCESS
    localStorage.setItem(
      "pending_alert",
      JSON.stringify({
        variant: "success",
        title: "Berhasil",
        message: "Berita berhasil dihapus.",
      })
    );

    setOpenDeleteModal(false);
    window.location.reload();

  } catch (err: any) {
    setOpenDeleteModal(false);

    setAlertData({
      variant: "error",
      title: "Gagal",
      message:
        err?.response?.data?.message ||
        "Gagal menghapus berita.",
    });
  }
};





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
            placeholder="Search Judul...."
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
            Jenis Berita
          </label>

          <select
            value={jenisFilter}
            onChange={(e) => setJenisFilter(e.target.value)}
            className="h-11 w-full rounded-lg border px-3 text-sm"
          >
            <option value="">Semua Jenis</option>
            <option value="Kesehatan">Kesehatan</option>
            <option value="Pengumuman">Pengumuman</option>
            <option value="Pariwisata">Pariwisata</option>
            <option value="Budaya">Budaya</option>
            <option value="Event">Event</option>
          </select>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                setSearch("");
                setJenisFilter("");
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

  {/* === KODE TABEL BERITA DI BAWAH === */}

    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>

          {/* ===== TABLE HEADER (TIDAK DIUBAH STYLE) ===== */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Judul Berita
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Jenis Berita
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Author
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Terakhir Update
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* ===== TABLE BODY ===== */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {data.length === 0 ? (
              <TableRow>
                <TableCell className="px-5 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Data berita tidak ditemukan
                </TableCell>
              </TableRow>
            ) : (
             paginatedData.map((item) => (
                <TableRow key={item.id_berita}>
                  {/* JUDUL */}
                 <TableCell className="px-5 py-4 sm:px-6 text-start max-w-[200px] sm:max-w-[300px]">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90 truncate" title={item.judul}>
                    {item.judul}
                  </span>
                </TableCell>

                  {/* JENIS BERITA */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge size="sm" color="info">
                      {item.jenis_berita}
                    </Badge>
                  </TableCell>

                  {/* AUTHOR */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {item.author}
                  </TableCell>

                  {/* TANGGAL UPDATE */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {item.tanggal_update}
                  </TableCell>

       {/* ACTION */}
<TableCell className="px-4 py-3 flex gap-2">
  {/* DETAIL (TIDAK DIUBAH) */}
  <button
    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 shadow-sm"
    onClick={() => {
      setSelectedBerita(item);
      setOpenModal(true);
    }}
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
    Detail
  </button>

  {/* UPDATE (EDIT) - Ikon SVG & Soft UI */}
 <button
    className="inline-flex items-center justify-center p-1.5 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all duration-200 shadow-sm"
  onClick={() => {
    setSelectedBerita(item);
    setFormData({
      judul: item.judul,
      isi: item.isi || "",
      jenis_berita: item.jenis_berita,
      image: item.image || null,
    });
    
    // ✅ Tambahkan baris ini untuk mengisi konten editor
    editorUpdate?.commands.setContent(item.isi || ""); 
    
    setOpenUpdateModal(true);
  }}
>
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  </button>

  {/* DELETE - Ikon SVG & Soft UI */}
  <button
    className="inline-flex items-center justify-center p-1.5 text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 shadow-sm"
    title="Hapus Berita"
    onClick={() => {
      setDeleteId(item.id_berita);
      setOpenDeleteModal(true);
    }}
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  </button>
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


               <ModalDetailDataBerita
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          data={selectedBerita}
        />

      <ModalUpdateBerita
  isOpen={openUpdateModal}
  closeModal={() => setOpenUpdateModal(false)}
  formData={formData}
  handleInputChange={handleInputChange}
  handleSelect={handleSelect}
  handleFileChange={handleFileChange}
  handleSave={handleSaveUpdate}
  editor={editorUpdate} // ✅ Sekarang prop editor sudah dikirim
/>
     {/* ======================== MODAL DELETE BERITA ======================== */}
<Modal
  isOpen={openDeleteModal} // Pastikan variabel state sesuai
  onClose={() => setOpenDeleteModal(false)}
  className="max-w-[500px] m-4"
>
  <div className="relative w-full rounded-3xl bg-white p-6 dark:bg-gray-900">
    
    {/* JUDUL - Menggunakan gaya red-600 sesuai referensi */}
    <h4 className="mb-4 text-2xl font-semibold text-red-600">
      Konfirmasi Hapus Berita
    </h4>

    {/* DESKRIPSI - Menggunakan teks abu-abu */}
    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
      Apakah Anda yakin ingin menghapus berita ini? 
      Tindakan ini <b>tidak dapat dibatalkan</b> dan data akan hilang secara permanen dari sistem.
    </p>

    {/* FOOTER ACTION - Menggunakan komponen Button sesuai referensi */}
    <div className="flex justify-end gap-3 pt-4">
      {/* Tombol Batal */}
      <Button 
        variant="outline" 
        onClick={() => setOpenDeleteModal(false)}
      >
        Batal
      </Button>

      {/* Tombol Hapus */}
      <Button 
        variant="danger" 
        onClick={handleDeleteBerita}
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
