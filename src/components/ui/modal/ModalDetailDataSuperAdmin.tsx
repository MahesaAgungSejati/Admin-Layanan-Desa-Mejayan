import { Modal } from ".";


interface SuperAdminDetail {
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
  email: string;
  jabatan: string;

  foto_profil?: string | null;
  file_ktp?: string | null;
  file_kk?: string | null;
}

interface ModalDetailDataSuperAdminProps {
  isOpen: boolean;
  onClose: () => void;
  data: SuperAdminDetail | null;
}

export default function ModalDetailDataSuperAdmin({
  isOpen,
  onClose,
  data,
}: ModalDetailDataSuperAdminProps) {
  if (!data) return null;

  const capitalize = (val?: string) =>
    val ? val.charAt(0).toUpperCase() + val.slice(1) : "-";

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[800px] m-4">
      <div className="relative w-full p-6 bg-white rounded-2xl dark:bg-gray-900 shadow-2xl">

        {/* HEADER */}
        <div className="mb-4 border-b pb-3 dark:border-gray-700">
          <h4 className="text-2xl font-bold text-blue-700 dark:text-blue-400">
            Detail Super Admin
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Informasi lengkap data Super Admin
          </p>
        </div>

        {/* CONTENT */}
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-3">
          <div className="space-y-8">

            {/* IDENTITAS */}
            <section>
              <h5 className="text-sm font-bold uppercase tracking-wider text-blue-600 mb-4 pl-2 border-l-4 border-blue-600">
                Identitas Super Admin
              </h5>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                {[
                  { label: "Nama Lengkap", value: data.nama },
                  { label: "NIK", value: data.nik },
                  { label: "Email", value: data.email },
                  { label: "Jabatan", value: data.jabatan },
                  { label: "Tempat, Tanggal Lahir", value: data.ttl },
                  { label: "Jenis Kelamin", value: capitalize(data.jenis_kelamin) },
                  { label: "Agama", value: capitalize(data.agama) },
                  { label: "Kewarganegaraan", value: capitalize(data.kewarganegaraan) },
                  { label: "Pendidikan", value: data.pendidikan },
                  { label: "Status Perkawinan", value: capitalize(data.status_perkawinan) },
                  { label: "Alamat", value: data.alamat, full: true },
                ].map((item, idx) => (
                  <div key={idx} className={item.full ? "md:col-span-2" : ""}>
                    <p className="text-sm font-bold text-gray-400 uppercase">{item.label}</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {item.value || "-"}
                    </p>
                  </div>
                ))}

                {/* NO HP */}
                <div className="md:col-span-2">
                  <p className="text-sm font-bold text-gray-400 uppercase">Nomor HP</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {data.no_hp || "-"}
                  </p>
                </div>
              </div>
            </section>

            {/* DOKUMEN */}
            <section>
              <h5 className="text-sm font-bold uppercase tracking-wider text-green-600 mb-4 pl-2 border-l-4 border-green-600">
                Dokumen & Foto
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* FOTO PROFIL */}
                <div className="p-3 border rounded-xl bg-gray-50 dark:bg-gray-800 text-center">
                  <p className="text-xs font-bold mb-3 uppercase text-gray-500">Foto Profil</p>
                  {data.foto_profil ? (
                    <>
                      <img src={data.foto_profil} className="h-28 w-28 mx-auto rounded-full object-cover mb-3" />
                      <a href={data.foto_profil} target="_blank" className="text-[11px] text-blue-600 font-bold italic">
                        LIHAT FOTO
                      </a>
                    </>
                  ) : <p className="text-gray-400 text-xs italic">Tidak ada foto</p>}
                </div>

                {/* KTP */}
                <div className="p-3 border rounded-xl bg-gray-50 dark:bg-gray-800 text-center">
                  <p className="text-xs font-bold mb-3 uppercase text-gray-500">File KTP</p>
                  {data.file_ktp ? (
                    <>
                      <img src={data.file_ktp} className="h-28 w-full object-cover rounded mb-3" />
                      <a href={data.file_ktp} target="_blank" className="text-[11px] text-blue-600 font-bold italic">
                        LIHAT KTP
                      </a>
                    </>
                  ) : <p className="text-gray-400 text-xs italic">Tidak ada file</p>}
                </div>

                {/* KK */}
                <div className="p-3 border rounded-xl bg-gray-50 dark:bg-gray-800 text-center">
                  <p className="text-xs font-bold mb-3 uppercase text-gray-500">File KK</p>
                  {data.file_kk ? (
                    <>
                      <img src={data.file_kk} className="h-28 w-full object-cover rounded mb-3" />
                      <a href={data.file_kk} target="_blank" className="text-[11px] text-blue-600 font-bold italic">
                        LIHAT KK
                      </a>
                    </>
                  ) : <p className="text-gray-400 text-xs italic">Tidak ada file</p>}
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end pt-5 border-t mt-5 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
          >
            Tutup Detail
          </button>
        </div>

      </div>
    </Modal>
  );
}
