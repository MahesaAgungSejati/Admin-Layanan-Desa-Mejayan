import Badge from "../badge/Badge";
import { Modal } from ".";

interface BeritaDetail {
  id_berita: number;
  judul: string;
  isi: string;
  image?: string | null;
  author?: string | null;
  jenis_berita?: string | null;
  tanggal_publikasi?: string | null;
  tanggal_update?: string | null;
  created_at?: string;
  updated_at?: string;
}



interface ModalDetailDataBeritaProps {
  isOpen: boolean;
  onClose: () => void;
  data: BeritaDetail | null;
}

export default function ModalDetailDataBerita({
  isOpen,
  onClose,
  data,
}: ModalDetailDataBeritaProps) {
  if (!data) return null;

  const capitalize = (val?: string) =>
    val ? val.charAt(0).toUpperCase() + val.slice(1) : "-";

const getBadgeColor = (jenis?: string) => {
  switch (jenis) {
    case "pengumuman":
      return "warning";
    case "informasi":
      return "info";
    case "berita":
      return "success";
    default:
      return "primary";
  }
};



return (
<Modal isOpen={isOpen} onClose={onClose} className="max-w-[900px] w-full m-4">
  <div className="relative flex flex-col w-full max-h-[90vh] overflow-hidden rounded-3xl bg-white dark:bg-gray-900 shadow-2xl">
    
    {/* HEADER - Tombol X manual telah dihapus karena sudah otomatis dari komponen Modal */}
    <div className="px-6 pt-8 pb-4 lg:px-10 lg:pt-10 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-2xl font-bold text-blue-700 dark:text-blue-400">
            Detail Data Berita
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Informasi lengkap konten berita yang dipublikasikan.
          </p>
        </div>
        {/* Tombol X manual di sini sudah dihapus agar tidak double */}
      </div>
    </div>

    {/* BODY SCROLL AREA */}
    <div className="flex-grow overflow-y-auto custom-scrollbar px-6 py-8 lg:px-10 space-y-10">

      {/* SECTION 1: INFORMASI UTAMA */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-1.5 bg-blue-600 rounded-full"></div>
          <h5 className="text-sm font-bold uppercase tracking-[0.1em] text-gray-800 dark:text-gray-200">
            Metadata Berita
          </h5>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
          <div className="md:col-span-12">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Judul Berita</label>
            <p className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
              {data.judul}
            </p>
          </div>

          <div className="md:col-span-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Penulis / Author</label>
            <p className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              {data.author || "Administrator"}
            </p>
          </div>

          <div className="md:col-span-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Kategori / Jenis</label>
            <div className="mt-1">
              <Badge size="md" color={getBadgeColor(data.jenis_berita ?? undefined)}>
                {data.jenis_berita || "Umum"}
              </Badge>
            </div>
          </div>

          <div className="md:col-span-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Publikasi</label>
            <p className="text-base font-semibold text-gray-700 dark:text-gray-300">
              {data.tanggal_publikasi || "-"}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: GAMBAR UTAMA */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-1.5 bg-green-600 rounded-full"></div>
          <h5 className="text-sm font-bold uppercase tracking-[0.1em] text-gray-800 dark:text-gray-200">
            Visual Berita
          </h5>
        </div>

        <div className="relative group overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 flex justify-center">
          {data.image ? (
            <div className="flex flex-col items-center w-full">
              <img
                src={data.image}
                alt="Thumbnail Berita"
                className="max-h-[400px] w-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="w-full p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
                <span className="text-xs text-gray-500 italic">Format: Image/Poster</span>
                <a
                  href={data.image}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs text-blue-600 font-bold hover:underline uppercase tracking-tighter"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Buka Gambar Asli
                </a>
              </div>
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center text-gray-400">
              <svg className="w-16 h-16 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm italic">Konten ini tidak menyertakan gambar pendukung</p>
            </div>
          )}
        </div>
      </section>

   {/* SECTION 3: ISI BERITA */}
<section>
  <div className="flex items-center gap-3 mb-6">
    <div className="h-8 w-1.5 bg-amber-500 rounded-full"></div>
    <h5 className="text-sm font-bold uppercase tracking-[0.1em] text-gray-800 dark:text-gray-200">
      Isi Konten Berita
    </h5>
  </div>

  <div className="prose prose-blue dark:prose-invert max-w-none bg-white dark:bg-gray-900/50 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm leading-relaxed">
    {/* Menambahkan class khusus agar ul dan ol memiliki gaya list */}
    <div
      className="text-gray-700 dark:text-gray-300 
                 [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:mb-4
                 [&_ol]:list-decimal [&_ol]:ml-5 [&_ol]:mb-4
                 [&_li]:mb-1"
      dangerouslySetInnerHTML={{ __html: data.isi }}
    />
  </div>
</section>
    </div>

    {/* FOOTER - Fixed at bottom */}
    <div className="px-6 py-6 lg:px-10 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex justify-end">
      <button
        onClick={onClose}
          className="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition text-sm shadow-md"
      >
        Tutup Detail
      </button>
    </div>
  </div>
</Modal>
  );
}