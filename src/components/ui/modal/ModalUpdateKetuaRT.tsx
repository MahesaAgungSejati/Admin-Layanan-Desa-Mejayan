import { Modal } from "../modal";
import Button from "../button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import Select from "../../form/Select";

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  formData: any;
  handleInputChange: any;
  handleSelect: any;
  handleFileChange: any;
  handleSave: () => void;
}

const user = JSON.parse(localStorage.getItem("user") || "{}");
const role = user?.role;

export default function ModalUpdateKetuaRT({
  isOpen,
  closeModal,
  formData,
  handleInputChange,
  handleSelect,
  handleFileChange,
  handleSave
}: Props) {
  // ✅ GUARD UTAMA
  if (!isOpen || !formData) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-[750px] w-full m-4"
    >
      <div className="relative flex flex-col w-full max-h-[90vh] overflow-hidden rounded-3xl bg-white dark:bg-gray-900 shadow-xl">
        
        {/* HEADER */}
        <div className="px-6 pt-8 pb-4 lg:px-11 lg:pt-11">
          <h4 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            Edit Data Ketua RT
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Perbarui informasi profil Anda agar tetap sesuai dan lengkap.
          </p>
        </div>

        {/* FORM BODY */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="flex flex-col overflow-hidden"
        >
          <div className="custom-scrollbar flex-grow overflow-y-auto px-6 pb-6 lg:px-11">
            
            {/* INFORMASI PRIBADI */}
            <h5 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 border-b border-gray-100 dark:border-gray-800 pb-2">
              Informasi Pribadi
            </h5>
            
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              {/* NAMA */}
              <div className="space-y-2">
                <Label>Nama <span className="text-red-500">*</span></Label>
                <Input name="nama" value={formData.nama || ""} onChange={handleInputChange} placeholder="Nama Lengkap" />
              </div>

                    <div className="space-y-2">
            <Label>
              Email <span className="text-red-500">*</span>
            </Label>

            <Input
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleInputChange}
              disabled={role !== "super_admin"}
              className={
                role !== "super_admin"
                  ? "bg-gray-50 opacity-70 cursor-not-allowed"
                  : ""
              }
            />

            {role !== "super_admin" && (
              <p className="text-xs text-gray-500 italic">
                Email hanya dapat diubah oleh Super Admin
              </p>
            )}
          </div>

              {/* NIK - DISABLED */}
              <div className="space-y-2">
                <Label>NIK <span className="text-red-500">*</span></Label>
                <Input name="nik" value={formData.nik || ""} className="bg-gray-50 opacity-70" />
              </div>

              {/* NIP - DISABLED */}
              <div className="space-y-2">
                <Label>NIP <span className="text-red-500">*</span></Label>
                <Input name="nip" value={formData.nip || ""} className="bg-gray-50 opacity-70" />
              </div>

              {/* JABATAN - DISABLED */}
              <div className="space-y-2">
                <Label>Jabatan <span className="text-red-500">*</span></Label>
                <Input name="jabatan" value={formData.jabatan || ""} className="bg-gray-50 opacity-70" />
              </div>
              
              {/* NO RT - DISABLED */}
              <div className="space-y-2">
                <Label>No. RT <span className="text-red-500">*</span></Label>
                <Input name="no_rt" value={formData.no_rt || ""} className="bg-gray-50 opacity-70" />
              </div>

              {/* TTL */}
              <div className="space-y-2">
                <Label>Tempat, Tanggal Lahir <span className="text-red-500">*</span></Label>
                <Input name="ttl" value={formData.ttl || ""} onChange={handleInputChange} placeholder="Madiun, 01-01-1990" />
              </div>

              {/* JENIS KELAMIN */}
              <div className="space-y-2">
                <Label>Jenis Kelamin <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.jenis_kelamin || ""}
                  options={[
                    { value: "Laki-laki", label: "Laki-laki" },
                    { value: "Perempuan", label: "Perempuan" }
                  ]}
                  onChange={(val) => handleSelect("jenis_kelamin", val)}
                  placeholder="Pilih jenis kelamin"
                />
              </div>

              {/* NO HP */}
              <div className="space-y-2">
                <Label>No. Telepon <span className="text-red-500">*</span></Label>
                <Input name="no_hp" value={formData.no_hp || ""} onChange={handleInputChange} placeholder="0812..." />
              </div>

              {/* AGAMA */}
              <div className="space-y-2">
                <Label>Agama <span className="text-red-500">*</span></Label>
                <Input name="agama" value={formData.agama || ""} onChange={handleInputChange} placeholder="Islam/Kristen/dll" />
              </div>

              {/* KEWARGANEGARAAN */}
              <div className="space-y-2">
                <Label>Kewarganegaraan <span className="text-red-500">*</span></Label>
                <Input name="kewarganegaraan" value={formData.kewarganegaraan || ""} onChange={handleInputChange} placeholder="Indonesia" />
              </div>

              {/* PENDIDIKAN */}
              <div className="space-y-2">
                <Label>Pendidikan <span className="text-red-500">*</span></Label>
                <Input name="pendidikan" value={formData.pendidikan || ""} onChange={handleInputChange} placeholder="S1/SMA/dll" />
              </div>

              {/* STATUS PERKAWINAN */}
              <div className="space-y-2">
                <Label>Status Perkawinan <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.status_perkawinan || ""}
                  options={[
                    { value: "Sudah Menikah", label: "Sudah Menikah" },
                    { value: "Belum Menikah", label: "Belum Menikah" },
                    { value: "Janda", label: "Janda" },
                    { value: "Duda", label: "Duda" }
                  ]}
                  onChange={(val) => handleSelect("status_perkawinan", val)}
                  placeholder="Pilih Status"
                />
              </div>

              {/* ALAMAT */}
              <div className="lg:col-span-2 space-y-2">
                <Label>Alamat <span className="text-red-500">*</span></Label>
                <Input name="alamat" value={formData.alamat || ""} onChange={handleInputChange} placeholder="Alamat lengkap" />
              </div>
            </div>

            {/* DOKUMEN IDENTITAS */}
            <h5 className="mt-8 mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 border-b border-gray-100 dark:border-gray-800 pb-2">
              Dokumen Identitas
            </h5>

            <div className="grid grid-cols-1 gap-x-6 gap-y-6 lg:grid-cols-2">
              
              {/* FOTO PROFIL */}
              <div className="space-y-2">
                <Label>Foto Profil</Label>
                <label htmlFor="foto_profil" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer border-gray-300 hover:border-blue-500 bg-gray-50 dark:bg-gray-800/50 transition p-4">
                  <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 16.5V9m0 0-3 3m3-3 3 3m5 4.5v2.25A2.25 2.25 0 0114.75 21h-5.5A2.25 2.25 0 017 18.75V16.5m12 0h.75a2.25 2.25 0 002.25-2.25v-6A2.25 2.25 0 0019.75 6h-.75" /></svg>
                  <span className="text-xs text-gray-500">Ganti Foto Profil</span>
                  <input id="foto_profil" type="file" name="foto_profil" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
                {formData.foto_profil instanceof File && (
                  <div className="mt-2 p-2 border rounded-lg bg-white dark:bg-gray-800 flex items-center gap-3">
                    <img src={URL.createObjectURL(formData.foto_profil)} className="h-10 w-10 rounded-full object-cover border" alt="Preview" />
                    <span className="text-xs truncate text-green-600 font-medium">{formData.foto_profil.name}</span>
                  </div>
                )}
              </div>

              {/* FILE KTP */}
              <div className="space-y-2">
                <Label>File KTP <span className="text-red-500">*</span></Label>
                <label htmlFor="file_ktp" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer border-gray-300 hover:border-blue-500 bg-gray-50 dark:bg-gray-800/50 transition p-4">
                    <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 16.5V9m0 0-3 3m3-3 3 3m5 4.5v2.25A2.25 2.25 0 0114.75 21h-5.5A2.25 2.25 0 017 18.75V16.5m12 0h.75a2.25 2.25 0 002.25-2.25v-6A2.25 2.25 0 0019.75 6h-.75" /></svg>
                    <span className="text-xs text-gray-500">Upload KTP (IMG/PDF)</span>
                    <input id="file_ktp" type="file" name="file_ktp" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
                </label>
                {formData.file_ktp instanceof File && (
                  <div className="mt-2 p-3 border rounded-xl bg-white dark:bg-gray-900 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {formData.file_ktp.type === "application/pdf" ? (
                        <span className="p-1.5 bg-red-100 text-red-600 rounded text-[10px] font-bold">PDF</span>
                      ) : (
                        <img src={URL.createObjectURL(formData.file_ktp)} className="h-8 w-12 rounded object-cover border" alt="Preview" />
                      )}
                      <span className="text-[11px] truncate max-w-[120px]">{formData.file_ktp.name}</span>
                    </div>
                    {formData.file_ktp.type === "application/pdf" && (
                      <a href={URL.createObjectURL(formData.file_ktp)} target="_blank" rel="noreferrer" className="text-[11px] font-bold text-blue-600 hover:underline">Lihat File</a>
                    )}
                  </div>
                )}
              </div>

              {/* FILE KK */}
              <div className="space-y-2">
                <Label>File KK <span className="text-red-500">*</span></Label>
                <label htmlFor="file_kk" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer border-gray-300 hover:border-blue-500 bg-gray-50 dark:bg-gray-800/50 transition p-4">
                    <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 16.5V9m0 0-3 3m3-3 3 3m5 4.5v2.25A2.25 2.25 0 0114.75 21h-5.5A2.25 2.25 0 017 18.75V16.5m12 0h.75a2.25 2.25 0 002.25-2.25v-6A2.25 2.25 0 0019.75 6h-.75" /></svg>
                    <span className="text-xs text-gray-500">Upload KK (IMG/PDF)</span>
                    <input id="file_kk" type="file" name="file_kk" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
                </label>
                {formData.file_kk instanceof File && (
                  <div className="mt-2 p-3 border rounded-xl bg-white dark:bg-gray-900 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {formData.file_kk.type === "application/pdf" ? (
                        <span className="p-1.5 bg-red-100 text-red-600 rounded text-[10px] font-bold">PDF</span>
                      ) : (
                        <img src={URL.createObjectURL(formData.file_kk)} className="h-8 w-12 rounded object-cover border" alt="Preview" />
                      )}
                      <span className="text-[11px] truncate max-w-[120px]">{formData.file_kk.name}</span>
                    </div>
                    {formData.file_kk.type === "application/pdf" && (
                      <a href={URL.createObjectURL(formData.file_kk)} target="_blank" rel="noreferrer" className="text-[11px] font-bold text-blue-600 hover:underline">Lihat File</a>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* FOOTER */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 px-6 py-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 lg:px-11">
            <Button variant="outline" onClick={closeModal} className="w-full sm:w-auto">
              Batal
            </Button>
            <Button type="submit" className="w-full sm:w-auto px-8 font-bold bg-blue-600 hover:bg-blue-700 text-white border-none shadow-md transition-all active:scale-95">
              Simpan Perubahan
            </Button>
          </div>

        </form>
      </div>
    </Modal>
  );
}