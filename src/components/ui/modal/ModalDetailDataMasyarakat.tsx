import Badge from "../../ui/badge/Badge";
import { Modal } from "../../ui/modal/";

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


  foto_profil?: string | null;
  file_ktp?: string | null;
  file_kk?: string | null;
}


interface ModalDetailDataMasyarakatProps {
  isOpen: boolean;
  onClose: () => void;
  data: MasyarakatDetail | null;
}

export default function ModalDetailDataMasyarakat({
  isOpen,
  onClose,
  data,
}: ModalDetailDataMasyarakatProps) {
  
  // Jika tidak ada data, jangan render modal (hindari error)
  if (!data) return null;

  const capitalize = (val?: string) =>
    val ? val.charAt(0).toUpperCase() + val.slice(1) : "-";

  const formatStatusColor = (status: string) => {
    switch (status) {
      case "disetujui":
        return "success";
      case "pending":
        return "warning";
      default:
        return "error";
    }
  };

return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[800px] m-4">
      <div className="relative w-full p-6 bg-white rounded-2xl dark:bg-gray-900 shadow-2xl">

        {/* HEADER */}
        <div className="mb-4 border-b pb-3 dark:border-gray-700">
          <h4 className="text-2xl font-bold text-blue-700 dark:text-blue-400">
            Detail Data Masyarakat
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Informasi lengkap mengenai identitas dan status verifikasi akun warga.
          </p>
        </div>

        {/* WRAPPER SCROLL */}
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-3">
          <div className="space-y-8">
            
            {/* --- DATA PRIBADI --- */}
            <section>
              <h5 className="text-sm font-bold uppercase tracking-wider text-blue-600 mb-4 pl-2 border-l-4 border-blue-600">
                Identitas Pribadi
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                {[
                  { label: "Nama Lengkap", value: data.nama },
                  { label: "NIK", value: data.nik },
                  { label: "Tempat, Tanggal Lahir", value: data.ttl },
                  { label: "Jenis Kelamin", value: capitalize(data.jenis_kelamin) },
                  { label: "Agama", value: capitalize(data.agama) },
                  { label: "Kewarganegaraan", value: data.kewarganegaraan },
                  { label: "Pendidikan", value: data.pendidikan },
                  { label: "Status Perkawinan", value: capitalize(data.status_perkawinan) },
                  { label: "Alamat", value: data.alamat, full: true },
                ].map((item, idx) => (
                  <div key={idx} className={item.full ? "md:col-span-2" : ""}>
                    <p className="text-sm font-bold text-gray-400 uppercase">{item.label}</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{item.value || "-"}</p>
                  </div>
                ))}

                {/* WhatsApp Action */}
                <div className="md:col-span-2">
                  <p className="text-sm font-bold text-gray-400 uppercase">Nomor HP</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">{data.no_hp || "-"}</p>
                  {data.no_hp && (
                    <a
                      href={`https://wa.me/${data.no_hp.replace(/^0/, "62")}?text=${encodeURIComponent(
                        `*[VERIFIKASI AKUN BERHASIL]*\n\nHalo, Bapak/Ibu Warga Desa Mejayan.\n\nKami menginformasikan bahwa akun Anda pada sistem *Layanan Digital Desa Mejayan* telah berhasil diverifikasi.\n\n*Hormat kami,*\n*Kantor Desa Mejayan*`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-green-600 bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 text-xs font-bold hover:bg-green-100 transition-all shadow-sm"
                    >
                      <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.06 3.973l-1.127 4.115 4.217-1.107a7.957 7.957 0 0 0 3.844 1.015l.004-.001c4.368 0 7.926-3.559 7.93-7.93a7.854 7.854 0 0 0-2.325-5.607zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.17-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                      </svg>
                      Kirim Informasi Verifikasi (WhatsApp)
                    </a>
                  )}
                </div>
              </div>
            </section>

            {/* --- STATUS & LOG VALIDASI --- */}
            <section>
              <h5 className="text-sm font-bold uppercase tracking-wider text-amber-600 mb-4 pl-2 border-l-4 border-amber-600">
                Status & Log Validasi
              </h5>
              <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Status Verifikasi</p>
                    <div className="mt-1">
                      <Badge size="md" color={formatStatusColor(data.status_verifikasi)}>
                        {capitalize(data.status_verifikasi)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Keterangan</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 italic">
                      "{data.keterangan_verifikasi || "Tidak ada catatan"}"
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
  <p className="text-[10px] font-bold text-gray-400 uppercase">Diverifikasi Oleh</p>
  <p className="text-sm font-bold">
    {data.validator?.nama || "-"}
  </p>
  {data.validator?.role && (
    <p className="text-[11px] italic text-gray-500">
      ({data.validator.role.replace("_", " ")})
    </p>
  )}
</div>

<div>
  <p className="text-[10px] font-bold text-gray-400 uppercase">Waktu Verifikasi</p>
  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
    {data.users_validated_at || "-"}
  </p>
</div>

                </div>
              </div>
            </section>

            {/* --- DOKUMEN & FOTO --- */}
            <section>
              <h5 className="text-sm font-bold uppercase tracking-wider text-green-600 mb-4 pl-2 border-l-4 border-green-600">
                Dokumen & Foto
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Foto Profil */}
                <div className="p-3 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-center">
                  <p className="text-xs font-bold mb-3 uppercase text-gray-500">Foto Profil</p>
                  {data.foto_profil ? (
                    <div className="flex flex-col items-center">
                      <img src={data.foto_profil} className="h-28 w-28 rounded-full object-cover border-2 border-white shadow-sm mb-3" alt="Profil" />
                      <a href={data.foto_profil} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 font-bold hover:underline italic">LIHAT FOTO</a>
                    </div>
                  ) : <p className="text-gray-400 text-xs italic">Tidak ada foto</p>}
                </div>

                {/* KTP */}
                <div className="p-3 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-center">
                  <p className="text-xs font-bold mb-3 uppercase text-gray-500">File KTP</p>
                  {data.file_ktp ? (
                    <div className="flex flex-col items-center">
                      <img src={data.file_ktp} className="h-28 w-full object-cover rounded-lg shadow-sm mb-3" alt="KTP" />
                      <a href={data.file_ktp} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 font-bold hover:underline italic">LIHAT KTP</a>
                    </div>
                  ) : <p className="text-gray-400 text-xs italic">Tidak ada file</p>}
                </div>

                {/* KK */}
                <div className="p-3 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-center">
                  <p className="text-xs font-bold mb-3 uppercase text-gray-500">File KK</p>
                  {data.file_kk ? (
                    <div className="flex flex-col items-center">
                      <img src={data.file_kk} className="h-28 w-full object-cover rounded-lg shadow-sm mb-3" alt="KK" />
                      <a href={data.file_kk} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 font-bold hover:underline italic">LIHAT KK</a>
                    </div>
                  ) : <p className="text-gray-400 text-xs italic">Tidak ada file</p>}
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end pt-5 border-t mt-5 dark:border-gray-700">
          <button
            className="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition text-sm shadow-md"
            onClick={onClose}
          >
            Tutup Detail
          </button>
        </div>

      </div>
    </Modal>
  );
}
