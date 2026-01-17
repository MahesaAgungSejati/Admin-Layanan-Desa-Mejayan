import { useModal } from "../../hooks/useModal";
import useAuth from "../../hooks/useAuth";
// import { Modal } from "../ui/modal";
// import Button from "../ui/button/Button";
// import Input from "../form/input/InputField";
// import Label from "../form/Label";
import ModalFormMasyarakat from "../ui/modal/ModalFormMasyarakat";
import ModalFormUser from "../ui/modal/ModalFormUser";
import { useEffect, useState } from "react";
import axios from "axios";
import AlertCustom from "../ui/alert/AlertCustom";
import TwoColumnImageGridDynamic from "../ui/images/TwoColumnImageGridDynamic";
// import Select from "../../components/form/Select";

export default function UserInfoCard() {
const { isOpen, openModal, closeModal } = useModal();
const { user } = useAuth(); 
const userFromLocal = JSON.parse(localStorage.getItem("user") || "{}");
const userType = localStorage.getItem("user_type"); 

// Role yang dianggap "USER"
const isUserRole = ["super_admin", "kepala_desa", "perangkat_desa", "rt"].includes(
  userFromLocal?.role
);

// Role masyarakat
const isMasyarakat = userType === "masyarakat";


  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [alertData, setAlertData] = useState({
  isOpen: false,
  variant: "info",
  title: "",
  message: "",
});

const closeAlert = () => {
  setAlertData((prev) => ({ ...prev, isOpen: false }));
};

  const [formData, setFormData] = useState<any>({
  nama: "",
  email: "",
  nik: "",
  ttl: "",
  jenis_kelamin: "",
  no_hp: "",
  agama: "",
  kewarganegaraan: "",
  pendidikan: "",
  status_perkawinan: "",
  alamat: "",
  foto_profil: null,
  file_ktp: null,
  file_kk: null,
});

const handleSelect = (name: string, value: any) => {
  setFormData((prev: any) => ({
    ...prev,
    [name]: value,
  }));
};

useEffect(() => {
  const fetchDetail = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!user || !token) return;

      const baseUrl = "http://127.0.0.1:8000/api";

      const url = isUserRole
        ? `${baseUrl}/users/detail/${user.id}`
        : `${baseUrl}/masyarakat/profile/${user.id}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedData = res.data.data;

      setDetail(fetchedData);

      // 🔥 INI KUNCI UTAMA — SINKRONKAN LOCAL STORAGE
      const localUser = localStorage.getItem("user");
      if (localUser) {
        const parsedUser = JSON.parse(localUser);

        // hanya update jika ini adalah user yang sama
        if (parsedUser.id === fetchedData.id) {
          const updatedUser = {
            ...parsedUser,
            status_verifikasi: fetchedData.status_verifikasi,
          };

          localStorage.setItem("user", JSON.stringify(updatedUser));
          localStorage.setItem(
            "status_verifikasi",
            fetchedData.status_verifikasi
          );
        }
      }

    } catch (err) {
      console.error("Error while fetching detail:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchDetail();
}, [user]);



  if (loading) {
    return (
      <div className="p-5 border rounded-2xl">
        <p>Memuat informasi pengguna...</p>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="p-5 border rounded-2xl">
        <p>Memuat informasi pengguna...</p>
      </div>
    );
  }

const openEditModal = () => {
  if (isUserRole) {
    setFormData({
      nama: detail.nama || "",
      email: detail.email || "",
      nik: detail.nik || "",
      nip: detail.nip || "",
      jabatan: detail.jabatan || "",
      ttl: detail.ttl || "",
      jenis_kelamin: detail.jenis_kelamin || "",
      no_hp: detail.no_hp || "",
      agama: detail.agama || "",
      kewarganegaraan: detail.kewarganegaraan || "",
      pendidikan: detail.pendidikan || "",
      status_perkawinan: detail.status_perkawinan || "",
      alamat: detail.alamat || "",
      foto_profil: null,
      file_ktp: null,
      file_kk: null,
    });
  } else {
    // masyarakat (form lengkap)
    setFormData({
      nama: detail.nama || "",
      email: detail.email || "",
      nik: detail.nik || "",
      ttl: detail.ttl || "",
      jenis_kelamin: detail.jenis_kelamin || "",
      no_hp: detail.no_hp || "",
      agama: detail.agama || "",
      kewarganegaraan: detail.kewarganegaraan || "",
      pendidikan: detail.pendidikan || "",
      status_perkawinan: detail.status_perkawinan || "",
      alamat: detail.alamat || "",
      foto_profil: null,
      file_ktp: null,
      file_kk: null,
    });
  }

  openModal();
};


const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;
    setFormData((prev: any) => ({ ...prev, [name]: files[0] }));
  };

const handleSave = async () => {
  // TUTUP MODAL DULU
  closeModal();

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return setAlertData({
        isOpen: true,
        variant: "error",
        title: "Gagal!",
        message: "Token tidak ditemukan, silakan login ulang."
      });
    }

   if (!userFromLocal?.id) {
  return setAlertData({
    isOpen: true,
    variant: "error",
    title: "Gagal!",
    message: "Data user tidak valid."
  });
}




    // ======================================================
    // VALIDASI HANYA UNTUK MASYARAKAT
    // ======================================================
    if (!isUserRole) {
      const requiredFields = [
        "nama",
        "ttl",
        "jenis_kelamin",
        "no_hp",
        "agama",
        "kewarganegaraan",
        "pendidikan",
        "status_perkawinan",
        "alamat",
      ];

      const empty = requiredFields.filter(
        (field) => !formData[field] || formData[field].trim() === ""
      );

      if (empty.length > 0) {
        return setAlertData({
          isOpen: true,
          variant: "warning",
          title: "Data Belum Lengkap",
          message: "Harap lengkapi semua kolom data diri anda."
        });
      }

      // if (!formData.file_ktp) {
      //   return setAlertData({
      //     isOpen: true,
      //     variant: "warning",
      //     title: "KTP Belum Diupload",
      //     message: "File KTP wajib diupload."
      //   });
      // }

      // if (!formData.file_kk) {
      //   return setAlertData({
      //     isOpen: true,
      //     variant: "warning",
      //     title: "KK Belum Diupload",
      //     message: "File KK wajib diupload."
      //   });
      // }
    }

    // ================================
    // SIAPKAN PAYLOAD
    // ================================
    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "") {
        payload.append(key, formData[key]);
      }
    });

    // ================================
    // PILIH URL UPDATE SESUAI ROLE
    // ================================
    const baseUrl = "http://127.0.0.1:8000/api";

    const updateUrl = isUserRole
      ? `${baseUrl}/users/update-profile/${user?.id}`
      : `${baseUrl}/masyarakat/update-profile/${user?.id}`;

    // ================================
    // KIRIM REQUEST UPDATE
    // ================================
    const res = await axios.post(updateUrl, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    setDetail(res.data.data);

    setAlertData({
      isOpen: true,
      variant: "success",
      title: "Berhasil!",
      message: isUserRole
        ? "Profile berhasil diperbarui."
        : "Data diri Anda berhasil diperbarui. Mohon menunggu proses verifikasi dari perangkat desa."
    });

    // reload untuk update tampilan
    setTimeout(() => window.location.reload(), 2500);

  } catch (err: any) {
    const msg = err.response?.data?.message || "Terjadi kesalahan.";

    setAlertData({
      isOpen: true,
      variant: "error",
      title: "Gagal!",
      message: msg
    });
  }
};


return (
  <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">

    <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
      <div>
        <AlertCustom
          isOpen={alertData.isOpen}
          onClose={closeAlert}
          variant={alertData.variant as any}
          title={alertData.title}
          message={alertData.message}
        />

        <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
          Informasi Pengguna
        </h4>

        <div className="space-y-8">

          {/* GRID INFORMASI */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            
            {/* EMAIL */}
            <div>
              <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-sm font-medium">{detail.email ?? "-"}</p>
            </div>

            {/* NIK */}
            <div>
              <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">NIK</p>
              <p className="text-sm font-medium">{detail.nik}</p>
            </div>

             {isUserRole && (
  <>
    {/* Jabatan */}
    <div>
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">Jabatan</p>
      <p className="text-sm font-medium">{detail.jabatan ?? "-"}</p>
    </div>

    {/* NIP */}
    <div>
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">NIP</p>
      <p className="text-sm font-medium">{detail.nip ?? "-"}</p>
    </div>
  </>
)}

            {/* TTL */}
            <div>
              <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">Tempat, Tanggal Lahir</p>
              <p className="text-sm font-medium">{detail.ttl ?? "-"}</p>
            </div>

            {/* Jenis Kelamin */}
            <div>
              <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">Jenis Kelamin</p>
              <p className="text-sm font-medium">{detail.jenis_kelamin ?? "-"}</p>
            </div>

            {/* No HP */}
            <div>
              <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">No. Telepon</p>
              <p className="text-sm font-medium">{detail.no_hp ?? "-"}</p>
            </div>

            {/* Agama */}
            <div>
              <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">Agama</p>
              <p className="text-sm font-medium">{detail.agama ?? "-"}</p>
            </div>

            {/* Kewarganegaraan */}
            <div>
              <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">Kewarganegaraan</p>
              <p className="text-sm font-medium">{detail.kewarganegaraan ?? "-"}</p>
            </div>

            {/* Pendidikan */}
            <div>
              <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">Pendidikan</p>
              <p className="text-sm font-medium">{detail.pendidikan ?? "-"}</p>
            </div>

            {/* Status Perkawinan */}
            <div>
              <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">Status Perkawinan</p>
              <p className="text-sm font-medium">{detail.status_perkawinan ?? "-"}</p>
            </div>

            {/* Alamat */}
            <div>
              <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">Alamat</p>
              <p className="text-sm font-medium">{detail.alamat ?? "-"}</p>
            </div>

            {/* ==== FIELD KHUSUS MASYARAKAT ==== */}
            {isMasyarakat && (
  <>
    {/* STATUS VERIFIKASI */}
    <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
      <p className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
        Status Verifikasi Akun
      </p>

      <span
        className={`
          px-3 py-1 rounded-md text-base font-semibold capitalize
          ${
            detail.status_verifikasi === "disetujui"
              ? "bg-green-100 text-green-700 border border-green-300"
              : detail.status_verifikasi === "ditolak"
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-blue-100 text-blue-700 border border-blue-300"
          }
        `}
      >
        {detail.status_verifikasi || "pending"}
      </span>
    </div>

    {/* Tanggal Validasi */}
    <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
      <p className="mb-1 text-sm font-semibold text-gray-500 dark:text-gray-400">
        Tanggal di Validasi
      </p>
     <p className="text-sm font-medium">
  {detail.users_validated_at ?? "-"}
</p>
    </div>
  </>
)}
          </div>

          {/* ==== KETERANGAN VERIFIKASI (khusus masyarakat) ==== */}
         {isMasyarakat && (
  <div className="mt-4 p-4 border rounded-lg bg-gray-50">
    <p className="mb-1 text-sm font-semibold text-gray-500">
      Keterangan Verifikasi
    </p>

    {detail?.keterangan_verifikasi?.trim() ? (
      <p className="text-sm font-medium">{detail.keterangan_verifikasi}</p>
    ) : (
      <p className="text-sm font-medium text-red-600">
        Harap lengkapi data diri Anda, kemudian tunggu persetujuan verifikasi dari perangkat desa.
      </p>
    )}
  </div>
)}


          {/* GAMBAR KTP & KK */}
    <div className="mt-8">
      <h4 className="mb-3 text-md font-semibold">Dokumen Identitas</h4>

      {detail.file_ktp || detail.file_kk ? (
        <TwoColumnImageGridDynamic
          image1={detail.file_ktp ?? ""}
          image2={detail.file_kk ?? ""}
        />
      ) : (
        <p className="text-gray-500 text-sm">
          Belum ada dokumen KTP / KK yang diupload.
        </p>
      )}
    </div>

  </div>
</div>

{/* BUTTON TETAP DI BAWAH */}
<div className="mt-6">
  <button
            onClick={openEditModal} // gunakan openEditModal agar form terisi
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              />
            </svg>
            Edit
          </button>
</div>
{isOpen && (
  isUserRole ? (
  <ModalFormUser
    isOpen={isOpen}
    closeModal={closeModal}
    formData={formData}
    handleInputChange={handleInputChange}
    handleSelect={handleSelect}
    handleFileChange={handleFileChange}
    handleSave={handleSave}
/>

  ) : (
    <ModalFormMasyarakat
      isOpen={isOpen}
      closeModal={closeModal}
      formData={formData}
      handleInputChange={handleInputChange}
      handleSelect={handleSelect}
      handleFileChange={handleFileChange}
      handleSave={handleSave}
    />
  )
)}

    </div>
    </div>
  );
}



