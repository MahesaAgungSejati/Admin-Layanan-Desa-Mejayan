import { Modal } from "../modal";
import Button from "../button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import Select from "../../form/Select";
import { EditorContent } from "@tiptap/react"; // Pastikan sudah diimpor

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  formData: any;
  handleInputChange: any;
  handleSelect: any;
  handleFileChange: any;
  handleSave: (e: React.FormEvent) => void;
  editor: any; // Tambahkan prop editor agar Tiptap berfungsi di modal update
}

export default function ModalUpdateBerita({
  isOpen,
  closeModal,
  formData,
  handleInputChange,
  handleSelect,
  handleFileChange,
  handleSave,
  editor,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-[800px] w-full m-4"
    >
      <div className="relative flex flex-col w-full max-h-[90vh] overflow-hidden rounded-3xl bg-white dark:bg-gray-900 shadow-xl">
        
        {/* HEADER - Tetap di atas */}
        <div className="px-6 pt-8 pb-4 lg:px-11 lg:pt-11">
          <h4 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            Edit Data Berita
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Perbarui informasi berita secara lengkap sebelum dipublikasikan ulang.
          </p>
        </div>

        {/* FORM BODY - Area yang bisa di-scroll */}
        <form onSubmit={handleSave} className="flex flex-col overflow-hidden">
          <div className="custom-scrollbar flex-grow overflow-y-auto px-6 pb-6 lg:px-11">
            
            <h5 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 border-b border-gray-100 dark:border-gray-800 pb-2">
              Informasi Berita
            </h5>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              {/* JUDUL */}
              <div className="space-y-2 lg:col-span-2">
                <Label>Judul Berita <span className="text-red-500">*</span></Label>
                <Input
                  name="judul"
                  value={formData.judul || ""}
                  onChange={handleInputChange}
                  placeholder="Masukkan judul berita utama"
                />
              </div>

              {/* JENIS BERITA */}
              <div className="space-y-2">
                <Label>Jenis Berita <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.jenis_berita || ""}
                  options={[
                    { value: "Pariwisata", label: "Pariwisata" },
                    { value: "Budaya", label: "Budaya" },
                    { value: "Event", label: "Event" },
                    { value: "Kesehatan", label: "Kesehatan" },
                    { value: "Pengumuman", label: "Pengumuman" },
                    { value: "Lainnya", label: "Lainnya" },
                  ]}
                  onChange={(val) => handleSelect("jenis_berita", val)}
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
        <button type="button" onClick={(e) => { e.stopPropagation(); editor?.chain().focus().toggleBold().run(); }} className={`p-1.5 rounded ${editor?.isActive('bold') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200 text-gray-600 dark:text-gray-400'}`} title="Bold"><b>B</b></button>
        <button type="button" onClick={(e) => { e.stopPropagation(); editor?.chain().focus().toggleItalic().run(); }} className={`p-1.5 rounded ${editor?.isActive('italic') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200 text-gray-600 dark:text-gray-400'}`} title="Italic"><i>I</i></button>
        <button type="button" onClick={(e) => { e.stopPropagation(); editor?.chain().focus().toggleUnderline().run(); }} className={`p-1.5 rounded ${editor?.isActive('underline') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200 text-gray-600 dark:text-gray-400'}`} title="Underline"><u>U</u></button>
        <button type="button" onClick={(e) => { e.stopPropagation(); editor?.chain().focus().toggleStrike().run(); }} className={`p-1.5 rounded ${editor?.isActive('strike') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200 text-gray-600 dark:text-gray-400'}`} title="Strike"><s>S</s></button>
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
        <button type="button" onClick={(e) => { e.stopPropagation(); editor?.chain().focus().toggleBulletList().run(); }} className={`p-1.5 rounded text-xs font-medium ${editor?.isActive('bulletList') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200 text-gray-600 dark:text-gray-400'}`} title="Bullet List">• List</button>
        <button type="button" onClick={(e) => { e.stopPropagation(); editor?.chain().focus().toggleOrderedList().run(); }} className={`p-1.5 rounded text-xs font-medium ${editor?.isActive('orderedList') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200 text-gray-600 dark:text-gray-400'}`} title="Ordered List">1. List</button>
      </div>

      {/* Group 4: History */}
      <div className="flex items-center gap-1 px-2">
        <button type="button" onClick={(e) => { e.stopPropagation(); editor?.chain().focus().undo().run(); }} className="p-1.5 rounded hover:bg-gray-200 text-gray-500" title="Undo">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966a.25.25 0 0 0 .41-.192z"/></svg>
        </button>
        <button type="button" onClick={(e) => { e.stopPropagation(); editor?.chain().focus().redo().run(); }} className="p-1.5 rounded hover:bg-gray-200 text-gray-500" title="Redo">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966a.25.25 0 0 1 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192z"/></svg>
        </button>
      </div>
    </div>

    {/* EDITOR AREA - Ditambahkan styling list manual untuk Tailwind */}
    <div className="bg-white dark:bg-gray-900 min-h-[150px] p-4">
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none dark:prose-invert focus:outline-none custom-tiptap-placeholder 
                   [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4"
      />
    </div>
  </div>
  <p className="text-[10px] text-gray-400 italic">
    *Klik area kotak di atas untuk mulai mengedit isi berita.
  </p>
</div>
</div>

            {/* IMAGE UPLOAD SECTION */}
            <h5 className="mt-8 mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 border-b border-gray-100 dark:border-gray-800 pb-2">
              Gambar Berita
            </h5>

            <div className="space-y-2">
              <Label>Thumbnail Berita <span className="text-red-500">*</span></Label>
              <label
                htmlFor="image_update"
                className="mt-2 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer border-gray-300 hover:border-blue-500 bg-gray-50 dark:bg-gray-800/50 transition p-4 text-center"
              >
                <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9m0 0-3 3m3-3 3 3m5 4.5v2.25A2.25 2.25 0 0114.75 21h-5.5A2.25 2.25 0 017 18.75V16.5m12 0h.75a2.25 2.25 0 002.25-2.25v-6A2.25 2.25 0 0019.75 6h-.75" />
                </svg>
                <span className="text-xs text-gray-500">Klik untuk mengganti gambar (JPG / PNG, max 5MB)</span>
                <input
                  id="image_update"
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* LOGIKA PREVIEW DUA KONDISI (Identik dengan Modal Add) */}
              {formData.image && (
                <div className="mt-3 p-3 border rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={typeof formData.image === "string" ? formData.image : URL.createObjectURL(formData.image)}
                      alt="Preview"
                      className="h-16 w-24 object-cover rounded-md border shadow-sm"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs truncate max-w-[200px] font-medium text-gray-700 dark:text-gray-200">
                        {typeof formData.image === "string" ? "Gambar Saat Ini" : formData.image.name}
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase font-bold">
                        {typeof formData.image === "string" ? "File Tersimpan" : "File Baru"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-green-600 font-medium flex items-center gap-1">
                      <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/></svg>
                      {typeof formData.image === "string" ? "Terload" : "Terpilih"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* FOOTER - Tetap di bawah */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 px-6 py-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 lg:px-11">
            <Button variant="outline" onClick={closeModal} className="w-full sm:w-auto">
              Batal
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto px-8 font-bold bg-blue-600 hover:bg-blue-700 text-white border-none shadow-md transition-all active:scale-95"
            >
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}