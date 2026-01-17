import { useState, useEffect } from "react";
import axios from "axios";
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color' // Named export
import { TextStyle } from '@tiptap/extension-text-style' // Named export (Perbaikan di sini)
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'


import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import TableDataBerita from "../../components/tables/BasicTables/TableDataBerita";
import Button from "../../components/ui/button/Button";

import { Modal } from "../../components/ui/modal/index";
import Alert from "../../components/ui/alert/Alert";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";

type AlertType = {
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
};


export default function TableDataBeritas() {
  const [isOpenAdd, setIsOpenAdd] = useState(false);


const [alertData, setAlertData] = useState<AlertType | null>(null);

  const [formData, setFormData] = useState({
    judul: "",
    jenis_berita: "",
    isi: "",
    image: null as File | null,
  });

const editor = useEditor({
  extensions: [
    StarterKit,
    Underline,
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Placeholder.configure({
      placeholder: 'Tulis isi berita di sini...',
    }),
  ],
  content: formData.isi,
  onUpdate: ({ editor }) => {
    setFormData({ ...formData, isi: editor.getHTML() });
  },
})



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


const handleAddBerita = async (e: React.FormEvent) => {
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
      "http://127.0.0.1:8000/api/berita/",
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // ✅ ALERT SUCCESS (SEBELUM RELOAD)
    localStorage.setItem(
      "pending_alert",
      JSON.stringify({
        variant: "success",
        title: "Berhasil",
        message: "Berita berhasil ditambahkan.",
      })
    );

    setIsOpenAdd(false);
    window.location.reload();

  } catch (err: any) {
    setIsOpenAdd(false);

    // ❌ ERROR TANPA RELOAD
    setAlertData({
      variant: "error",
      title: "Gagal",
      message:
        err?.response?.data?.message ||
        "Gagal menambahkan berita.",
    });
  }
};

  return (
    <>
      <PageMeta
        title="Data Berita Desa"
        description="Kelola data berita desa"
      />
      <PageBreadcrumb pageTitle="Data Berita Desa" />
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

      <div className="space-y-6">
        <ComponentCard>
          {/* HEADER */}
          <div className="flex flex-col gap-5 mb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-medium text-gray-800 dark:text-white/90">
                Tabel Data Berita Desa
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Kelola data berita dan informasi desa.
              </p>
            </div>

            {/* BUTTON ADD */}
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
              <span className="font-medium">Tambah Berita</span>
            </Button>
          </div>

          {/* TABLE */}
          <TableDataBerita />
        </ComponentCard>
      </div>

<Modal
  isOpen={isOpenAdd}
  onClose={() => setIsOpenAdd(false)}
  className="max-w-[800px] w-full m-4" // Sedikit diperlebar agar editor lebih leluasa
>
  <div className="relative flex flex-col w-full max-h-[90vh] overflow-hidden rounded-3xl bg-white dark:bg-gray-900 shadow-xl">
    
    {/* HEADER - Tetap di atas */}
    <div className="px-6 pt-8 pb-4 lg:px-11 lg:pt-11">
      <h4 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white/90">
        Tambah Data Berita
      </h4>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Tambahkan informasi berita secara lengkap sebelum dipublikasikan.
      </p>
    </div>

    {/* FORM BODY - Area yang bisa di-scroll */}
    <form onSubmit={handleAddBerita} className="flex flex-col overflow-hidden">
      <div className="custom-scrollbar flex-grow overflow-y-auto px-6 pb-6 lg:px-11">
        
        <h5 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 border-b border-gray-100 dark:border-gray-800 pb-2">
          Informasi Berita
        </h5>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
          {/* JUDUL */}
          <div className="space-y-2 lg:col-span-2">
            <Label>Judul Berita <span className="text-red-500">*</span></Label>
            <Input
              value={formData.judul}
              onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
              placeholder="Masukkan judul berita utama"
            />
          </div>

          {/* JENIS BERITA */}
          <div className="space-y-2">
            <Label>Jenis Berita <span className="text-red-500">*</span></Label>
            <Select
              value={formData.jenis_berita}
              options={[
                { value: "Pariwisata", label: "Pariwisata" },
                { value: "Budaya", label: "Budaya" },
                { value: "Event", label: "Event" },
                { value: "Kesehatan", label: "Kesehatan" },
                { value: "Pengumuman", label: "Pengumuman" },
              ]}
              onChange={(val) => setFormData({ ...formData, jenis_berita: val })}
              placeholder="Pilih jenis berita"
            />
          </div>

      {/* ISI BERITA (TEXT EDITOR LENGKAP) */}
<div className="space-y-2 lg:col-span-2">
  <Label>Isi Berita <span className="text-red-500">*</span></Label>
  
  <div 
    className="flex flex-col border rounded-2xl overflow-hidden border-gray-200 dark:border-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 cursor-text"
    onClick={() => editor?.chain().focus().run()}
  >
    {/* TOOLBAR LENGKAP */}
    <div className="flex flex-wrap items-center gap-1 bg-gray-50 dark:bg-gray-800 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
      
      {/* Group 1: Text Style */}
      <div className="flex items-center gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
        <button type="button" onClick={(e) => { e.stopPropagation(); editor?.chain().focus().toggleBold().run(); }} className={`p-1.5 rounded ${editor?.isActive('bold') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`} title="Bold"><b>B</b></button>
        <button type="button" onClick={(e) => { e.stopPropagation(); editor?.chain().focus().toggleItalic().run(); }} className={`p-1.5 rounded ${editor?.isActive('italic') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`} title="Italic"><i>I</i></button>
        <button type="button" onClick={(e) => { e.stopPropagation(); editor?.chain().focus().toggleUnderline().run(); }} className={`p-1.5 rounded ${editor?.isActive('underline') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`} title="Underline"><u>U</u></button>
        <button type="button" onClick={(e) => { e.stopPropagation(); editor?.chain().focus().toggleStrike().run(); }} className={`p-1.5 rounded ${editor?.isActive('strike') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`} title="Strike"><s>S</s></button>
      </div>

      {/* Group 2: Alignment */}
      <div className="flex items-center gap-1 px-2 border-r border-gray-300 dark:border-gray-600">
        <button type="button" onClick={(e) => { e.stopPropagation(); editor?.chain().focus().setTextAlign('left').run(); }} className={`p-1.5 rounded ${editor?.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}>
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/></svg>
        </button>
        <button type="button" onClick={(e) => { e.stopPropagation(); editor?.chain().focus().setTextAlign('center').run(); }} className={`p-1.5 rounded ${editor?.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}>
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/></svg>
        </button>
        <button type="button" onClick={(e) => { e.stopPropagation(); editor?.chain().focus().setTextAlign('right').run(); }} className={`p-1.5 rounded ${editor?.isActive({ textAlign: 'right' }) ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`}>
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/></svg>
        </button>
      </div>

      {/* Group 3: Lists */}
      <div className="flex items-center gap-1 px-2 border-r border-gray-300 dark:border-gray-600">
        <button type="button" onClick={(e) => { e.stopPropagation(); editor?.chain().focus().toggleBulletList().run(); }} className={`p-1.5 rounded text-xs font-medium ${editor?.isActive('bulletList') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`} title="Bullet List">• List</button>
        <button type="button" onClick={(e) => { e.stopPropagation(); editor?.chain().focus().toggleOrderedList().run(); }} className={`p-1.5 rounded text-xs font-medium ${editor?.isActive('orderedList') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'}`} title="Ordered List">1. List</button>
      </div>

      {/* Group 4: History */}
      <div className="flex items-center gap-1 px-2">
        <button type="button" onClick={(e) => { e.stopPropagation(); editor?.chain().focus().undo().run(); }} className="p-1.5 rounded hover:bg-gray-200" title="Undo">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966a.25.25 0 0 0 .41-.192z"/></svg>
        </button>
        <button type="button" onClick={(e) => { e.stopPropagation(); editor?.chain().focus().redo().run(); }} className="p-1.5 rounded hover:bg-gray-200" title="Redo">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966a.25.25 0 0 1 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192z"/></svg>
        </button>
      </div>
    </div>

    {/* EDITOR AREA - Tambahkan class list-disc dan list-decimal agar peluru terlihat */}
    <div className="bg-white dark:bg-gray-900 min-h-[150px] p-4">
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none dark:prose-invert focus:outline-none custom-tiptap-placeholder 
                   [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4"
      />
    </div>
  </div>
</div>
</div>

        {/* IMAGE UPLOAD SECTION */}
        <h5 className="mt-8 mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 border-b border-gray-100 dark:border-gray-800 pb-2">
          Gambar Berita
        </h5>

        <div className="space-y-2">
          <Label>Thumbnail Berita <span className="text-red-500">*</span></Label>
          <label
            htmlFor="image_upload"
            className="mt-2 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer border-gray-300 hover:border-blue-500 bg-gray-50 dark:bg-gray-800/50 transition p-4 text-center"
          >
            <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9m0 0-3 3m3-3 3 3m5 4.5v2.25A2.25 2.25 0 0114.75 21h-5.5A2.25 2.25 0 017 18.75V16.5m12 0h.75a2.25 2.25 0 002.25-2.25v-6A2.25 2.25 0 0019.75 6h-.75" />
            </svg>
            <span className="text-xs text-gray-500">Klik untuk upload (JPG / PNG, max 5MB)</span>
            <input
              id="image_upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  image: e.target.files?.[0] || null,
                })
              }
            />
          </label>

          {/* Logika Preview Gambar (Identik dengan contoh KTP) */}
          {formData.image && (
            <div className="mt-3 p-3 border rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Preview Thumbnail"
                  className="h-16 w-24 object-cover rounded-md border"
                />
                <div className="flex flex-col">
                  <span className="text-xs truncate max-w-[200px] font-medium text-gray-700 dark:text-gray-200">
                    {formData.image.name}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {(formData.image.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-green-600 font-medium">✓ Gambar Terpilih</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER - Tetap di bawah */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 px-6 py-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 lg:px-11">
        <Button 
          variant="outline" 
          onClick={() => setIsOpenAdd(false)}
          className="w-full sm:w-auto"
        >
          Batal
        </Button>
        <Button
          type="submit"
          className="w-full sm:w-auto px-8 font-bold bg-blue-600 hover:bg-blue-700 text-white border-none shadow-md transition-all active:scale-95"
        >
          Simpan Berita
        </Button>
      </div>
    </form>
  </div>
</Modal>
    </>
  );
}
