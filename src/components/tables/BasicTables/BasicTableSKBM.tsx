// BasicTableSKBM.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import TextArea from "../../form/input/TextArea";
import Button from "../../ui/button/Button"
import Alert from "../../ui/alert/Alert";
import DatePicker from "../../form/date-picker";


import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import { Modal } from "../../ui/modal";

// =============== Interface Data dari API =================
interface RT {
  id: number;
  nama: string;
  role: string;
}

interface SKBM {
  id_skbm: number;
  nama: string;
  created_at: string;
  updated_at: string;
  status: string;
  keterangan: string | null;
  rt: RT;
  rt_id?: number;
  file_pdf: string | null;
  file_pengantar_rt: string | null;
  file_ktp: string | null;
  file_kk: string | null;
  alasan: string;
  keperluan: string;
  nik: string;
  alamat: string;
  ttl: string;
  pekerjaan: string;
  status_perkawinan: string;
  pendidikan: string;
  kewarganegaraan: string;
  jenis_kelamin: string;
  agama: string;
  rejected_by?: 'rt' | 'perangkat_desa' | 'kepala_desa' | null; // <<< tambahkan
  nomor_surat?: string | null;
  no_surat_pengantar?: string | null;
  poin_ii?: string | null;
  foto_profil: string | null;
  ttd_masyarakat: string | null;
  ttd_rt: string | null;
  ttd_kades: string | null;

  
  perangkat?: {
    id: number;
    nama: string;
    role: string;
  };

  kepala_desa?: {
    id: number;
    nama: string;
    role: string;
  };

  masyarakat?: {
    id: number;
    nama: string;
    nik: string;
    email: string;
  };

  // === VALIDASI RT ===
  rt_validated_at?: string | null;
  rt_validator?: string | null;

  // === VALIDASI PERANGKAT DESA ===
  perangkat_validated_at?: string | null;
  perangkat_validator?: string | null;

  // === VALIDASI KEPALA DESA ===
  kepala_desa_validated_at?: string | null;
  kepala_desa_validator?: string | null;
}


export default function BasicTableSKBM() {
  const [data, setData] = useState<SKBM[]>([]);
  const [loading, setLoading] = useState(true);

  // ===== SEARCH & FILTER =====
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [bulan, setBulan] = useState("");
  const [tahun, setTahun] = useState("");
  const [statusInput, setStatusInput] = useState("");
  const [tanggal, setTanggal] = useState("");
  // const [bulanInput, setBulanInput] = useState("");
  // const [tahunInput, setTahunInput] = useState("");
  const [dateInput, setDateInput] = useState("");

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // === STATE UNTUK KETUA RT ===
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<SKBM | null>(null);
  const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [updateNomorSuratPengantar, setUpdateNomorSuratPengantar] = useState("");
  const [updateStatus, setUpdateStatus] = useState("");
  const [updateKeterangan, setUpdateKeterangan] = useState("");
  const [updateTtdRT, setUpdateTtdRT] = useState<File | null>(null);


  // === STATE UNTUK PERANGKAT DESA ===
  const [modalUpdatePerangkatOpen, setModalUpdatePerangkatOpen] = useState(false);
  const [updateNomorSurat, setUpdateNomorSurat] = useState("");
  const [updateStatusPerangkat, setUpdateStatusPerangkat] = useState<string>("");
  const [updateKeteranganPerangkat, setUpdateKeteranganPerangkat] = useState("");
  const [updatePoinII, setUpdatePoinII] = useState("");

  // === STATE UNTUK KEPALA DESA ===
  const [modalUpdateKepalaOpen, setModalUpdateKepalaOpen] = useState(false);
  const [updateStatusKepala, setUpdateStatusKepala] = useState("");
  const [updateKeteranganKepala, setUpdateKeteranganKepala] = useState("");
  const [updateTtdKepala, setUpdateTtdKepala] = useState<File | null>(null);


  // === STATE UNTUK AJUKAN KEMBALI ===
  const [modalAjukanKembali, setModalAjukanKembali] = useState(false);
  const [formUpdate, setFormUpdate] = useState({
    nama: "",
    jenis_kelamin: "",
    pendidikan: "",
    keperluan: "",
    kewarganegaraan: "",
    ttl: "",
    agama: "",
    pekerjaan: "",
    nik: "",
    alamat: "",
    rt_id: "",
    status_perkawinan: "",
    alasan: "",
    keterangan: "",
    file_ktp: null as File | null,
    file_kk: null as File | null,
    ttd_masyarakat: null as File | null,
    file: null as File | null,
  });

  // Format tanggal
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const [alertData, setAlertData] = useState<{
    variant: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  } | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [errorsUpdate, setErrorsUpdate] = useState<{
  status?: string;
  no_surat_pengantar?: string;
  ttd_rt?: string;
  }>({});

  const [errorsPerangkat, setErrorsPerangkat] = useState<{
    nomor_surat?: string;
    status?: string;
    poin_ii?: string;
  }>({});

  const [errorsKepala, setErrorsKepala] = useState<{
    status?: string;
    ttd_kades?: string;
  }>({});

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // State untuk membuka/menutup dropdown filter
  const [isFilterOpen, setIsFilterOpen] = useState(false);

const BASE_URL = "http://127.0.0.1:8000";

const getFileUrl = (path?: string): string | undefined => {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${BASE_URL}/${path}`;
};



  // === AUTO HIDE ALERT SETELAH 3 DETIK ===
  useEffect(() => {
    if (alertData) {
      const timer = setTimeout(() => {
        setAlertData(null); // sembunyikan alert
      }, 7000); // 7 detik

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
  if (updateStatus === "ditolak") {
    setUpdateNomorSuratPengantar("");
  }
  }, [updateStatus]);

  useEffect(() => {
    if (updateStatusPerangkat === "ditolak") {
      setUpdateNomorSurat("");
      setUpdatePoinII("");
    }
  }, [updateStatusPerangkat]);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://127.0.0.1:8000/api/skbm/filter",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            search: debouncedSearch || undefined,
            status: status || undefined,
            tanggal: tanggal !== "" ? tanggal : undefined,
            bulan: bulan !== "" ? bulan : undefined,
            tahun: tahun !== "" ? tahun : undefined,
            page: currentPage,
          },
        }
      );

      const paginator = res.data.data;

      setData(paginator.data || []);
      setLastPage(Number(paginator.last_page) || 1);

      console.log(
        "API PAGE:",
        paginator.current_page,
        "API LAST:",
        paginator.last_page
      );

    } catch (error) {
      console.error("Gagal mengambil data:", error);
      setData([]);
      setLastPage(1);
    } finally {
      setLoading(false);
      setIsInitialLoad(false); // 🔥 INI YANG SEBELUMNYA HILANG
    }
  };

  fetchData();
}, [debouncedSearch, status, tanggal, bulan, tahun, currentPage]);


console.log("STATE PAGE:", currentPage, "STATE LAST:", lastPage);

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search);
    setCurrentPage(1); // reset page hanya saat filter/search berubah
  }, 800);

  return () => clearTimeout(timer);
}, [search, status, tanggal, bulan, tahun]);








  // === HANDLE UNTUK GET DATA SKBM SETIAP ROLE ===
  const fetchData = async () => {
    try {
       setLoading(true);
    setData([]); // ⛔ cegah render data lama

      const token = localStorage.getItem("token");
      const user_type = localStorage.getItem("user_type");

      let apiURL = "";

      switch (user_type) {
        case "rt":
          apiURL = "http://127.0.0.1:8000/api/rt/skbm/";
          break;
        case "perangkat_desa":
          apiURL = "http://127.0.0.1:8000/api/perangkat_desa/skbm/";
          break;
        case "kepala_desa":
          apiURL = "http://127.0.0.1:8000/api/kepala_desa/skbm/";
          break;
        case "super_admin":
          apiURL = "http://127.0.0.1:8000/api/super_admin/skbm/";
          break;
        default:
          apiURL = "http://127.0.0.1:8000/api/masyarakat/skbm/my";
          break;
      }

      const res = await axios.get(apiURL, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const responseData = res.data.data || [];

      setData(responseData);

    } catch (error) {
      console.error("Gagal mengambil data Surat Keterangan Belum Menikah:", error);

      // 🔥 TAMBAHKAN ALERT ERROR DI SINI (AMAN, TIDAK GANGGU FUNGSI LAIN)
      setAlertData({
        variant: "error",
        title: "Gagal Memuat Data",
        message:
          "Tidak dapat mengambil data Surat Keterangan Belum Menikah. Periksa koneksi Anda atau coba beberapa saat lagi.",
      });

    } finally {
      setLoading(false);
      setIsInitialLoad(false); // 🔑 PENTING
    }
  };
      useEffect(() => {
        fetchData();
      }, []);

  // === HANDLE UNTUK AJUKAN KEMBALI ===
 const handleAjukanKembali = async () => {
  if (!selectedData) {
    setAlertData({
      variant: "error",
      title: "Gagal",
      message: "Pilih pengajuan yang akan diajukan kembali."
    });
    return;
  }

  const newErrors: { [key: string]: string } = {};

  // ===============================
  // VALIDASI WAJIB (SAMA SEPERTI AJUKAN BARU)
  // ===============================
  if (!formUpdate.nama) newErrors.nama = "Nama wajib diisi";
  if (!formUpdate.nik) newErrors.nik = "NIK wajib diisi";
  if (!formUpdate.jenis_kelamin) newErrors.jenis_kelamin = "Pilih jenis kelamin";
  if (!formUpdate.ttl) newErrors.ttl = "Tempat & tanggal lahir wajib diisi";
  if (!formUpdate.status_perkawinan) newErrors.status_perkawinan = "Pilih status perkawinan";
  if (!formUpdate.agama) newErrors.agama = "Agama Wajib diisi";
  if (!formUpdate.kewarganegaraan) newErrors.kewarganegaraan = "Kewarganegaraan wajib diisi";
  if (!formUpdate.pendidikan) newErrors.pendidikan = "Pendidikan wajib diisi";
  if (!formUpdate.pekerjaan) newErrors.pekerjaan = "Pekerjaan wajib diisi";
  if (!formUpdate.alamat) newErrors.alamat = "Alamat wajib diisi";
  if (!formUpdate.keperluan) newErrors.keperluan = "Keperluan wajib diisi";
  if (!formUpdate.alasan) newErrors.alasan = "Alasan wajib diisi";

  // ===============================
  // RT ID (KHUSUS JIKA DITOLAK RT)
  // ===============================
  if (selectedData.rejected_by === "rt" && !formUpdate.rt_id) {
    newErrors.rt_id = "RT wajib dipilih";
  }

  // ===============================
  // KTP WAJIB
  // ===============================
  if (!formUpdate.file_ktp) {
    newErrors.file_ktp = "KTP wajib diupload";
  }

  // ===============================
  // KK WAJIB
  // ===============================
  if (!formUpdate.file_kk) {
    newErrors.file_kk = "KK wajib diupload";
  }

  // ===============================
  // TTD WAJIB
  // ===============================
  if (!formUpdate.ttd_masyarakat) {
    newErrors.ttd_masyarakat = "Tanda tangan masyarakat wajib diupload";
  }

  // SIMPAN ERROR KE STATE
  setErrors(newErrors);

  // ⛔ STOP JIKA ADA ERROR
  if (Object.keys(newErrors).length > 0) return;

  // ===============================
  // FORM DATA
  // ===============================
  const token = localStorage.getItem("token");
  const fd = new FormData();

  fd.append("nama", formUpdate.nama);
  fd.append("jenis_kelamin", formUpdate.jenis_kelamin);
  fd.append("pendidikan", formUpdate.pendidikan);
  fd.append("keperluan", formUpdate.keperluan);
  fd.append("kewarganegaraan", formUpdate.kewarganegaraan);
  fd.append("ttl", formUpdate.ttl);
  fd.append("agama", formUpdate.agama);
  fd.append("pekerjaan", formUpdate.pekerjaan);
  fd.append("nik", formUpdate.nik);
  fd.append("alamat", formUpdate.alamat);
  fd.append("status_perkawinan", formUpdate.status_perkawinan);
  fd.append("alasan", formUpdate.alasan);

  if (formUpdate.keterangan?.trim()) {
    fd.append("keterangan", formUpdate.keterangan);
  }

  // RT ID
  if (selectedData.rejected_by === "rt") {
    fd.append("rt_id", formUpdate.rt_id);
  } else if (selectedData.rt_id) {
    fd.append("rt_id", String(selectedData.rt_id));
  }

  fd.append("file_ktp", formUpdate.file_ktp as File);
  fd.append("file_kk", formUpdate.file_kk as File);
  fd.append("ttd_masyarakat", formUpdate.ttd_masyarakat as File);

  // File tambahan (opsional)
  if (formUpdate.file) {
    fd.append("file", formUpdate.file);
  }

  try {
    const res = await axios.post(
      `http://127.0.0.1:8000/api/masyarakat/skbm/${selectedData.id_skbm}`,
      fd,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setAlertData({
      variant: "success",
      title: "Berhasil",
      message: res.data.message || "Pengajuan berhasil dikirim ulang."
    });

    setModalAjukanKembali(false);
    await fetchData();

  } catch (err: any) {
    let msg =
      err?.response?.data?.message ||
      err?.response?.data?.errors ||
      "Gagal mengajukan kembali.";

    if (typeof msg === "object") {
      msg = Object.values(msg).join("\n");
    }

    setAlertData({
      variant: "error",
      title: "Error",
      message: msg
    });
  }
  };

  const openModalDetail = (item: SKBM) => {
    setSelectedData(item);
    setModalOpen(true);
  };

  const openModalUpdate = (item: SKBM) => {
  setSelectedData(item);
  setUpdateStatus("");
  setUpdateKeterangan(item.keterangan ?? "");
  setUpdateNomorSuratPengantar(item.no_surat_pengantar ?? "");
  setUpdateTtdRT(null);

  setErrorsUpdate({}); // ⬅️ TAMBAHKAN
  setModalUpdateOpen(true);
  };

  const openModalAjukanKembali = (item: SKBM) => {
    setSelectedData(item);

  setFormUpdate({
    nama: item.nama ?? "",
    jenis_kelamin: item.jenis_kelamin ?? "",
    pendidikan: item.pendidikan ?? "",
    keperluan: item.keperluan ?? "",
    kewarganegaraan: item.kewarganegaraan ?? "",
    ttl: item.ttl ?? "",
    agama: item.agama ?? "",
    pekerjaan: item.pekerjaan ?? "",
    nik: item.nik ?? "",
    alamat: item.alamat ?? "",
    status_perkawinan: item.status_perkawinan ?? "",
    alasan: item.alasan ?? "",
    keterangan: "",
    rt_id: item.rt_id ? String(item.rt_id) : (item.rt?.id ? String(item.rt.id) : ""),
    file_ktp: null,
    file_kk: null,
    ttd_masyarakat: null,
    file: null
  });

  setModalAjukanKembali(true);
  };


  const DEFAULT_POIN_II = `Orang tersebut di atas benar-benar penduduk Desa Mejayan Kecamatan Mejayan Kabupaten Madiun dan orang tersebut diatas benar-benar belum menikah`;

  const openModalUpdatePerangkat = (data: any) => {
    setSelectedData(data);

    setUpdateNomorSurat(data.nomor_surat || "");
    setUpdateStatusPerangkat(data.status || "");
    setUpdateKeteranganPerangkat(data.keterangan || "");

    setUpdatePoinII(
      data.poin_ii && data.poin_ii.trim() !== ""
        ? data.poin_ii
        : DEFAULT_POIN_II
    );

    setErrorsPerangkat({}); // 🔥 reset error
    setModalUpdatePerangkatOpen(true);
  };

  const openModalUpdateKepala = (item: SKBM) => {
    setSelectedData(item);
    setUpdateStatusKepala("");
    setUpdateKeteranganKepala(item.keterangan ?? "");
    setUpdateTtdKepala(null);
    setErrorsKepala({}); // ⬅️ RESET ERROR
    setModalUpdateKepalaOpen(true);
    
  };

  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatStatus = (status: string): string => {
    if (!status) return "-";
    const s = status.toLowerCase();

    if (s === "selesai") return "Selesai";
    if (s === "ditolak") return "Ditolak";
    if (s === "diproses rt") return "Diproses Ketua RT";
    if (s === "diproses perangkat desa") return "Diproses Perangkat Desa";
    if (s === "diproses kepala desa") return "Diproses Kepala Desa";

    // default: kapitalisasi otomatis
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const getStatusColor = (status: string): "success" | "warning" | "error" => {
    const s = status.toLowerCase();

    if (s.includes("diproses")) return "warning";
    if (s.includes("ditolak")) return "error";
    return "success"; // selesai
  };

  const formatRejectedStatus = (status: string, rejectedBy?: string | null) => {
    if (!status.includes("ditolak")) return formatStatus(status);

    if (!rejectedBy) return "Ditolak";

    switch (rejectedBy) {
      case "rt":
        return "Ditolak oleh RT";
      case "perangkat_desa":
        return "Ditolak oleh Perangkat Desa";
      case "kepala_desa":
        return "Ditolak oleh Kepala Desa";
      default:
        return "Ditolak";
    }
  };


  // === HANDLE UNTUK VALIDASI RT ===
  const handleUpdateStatus = async () => {
  if (!selectedData) {
    return;
  }
    try {
      const token = localStorage.getItem("token");
      if (!selectedData) return;
      const rt_id = selectedData.rt_id;
      if (!rt_id) { alert("RT tidak ditemukan"); return; }

      const id_skbm = selectedData.id_skbm;

      if (!rt_id) {
      setModalUpdateOpen(false); // tutup modal walau error
      setAlertData({
        variant: "error",
        title: "Gagal",
        message: "ID Ketua RT tidak ditemukan. Silakan login ulang."
      });
      return;
    }

      // ==== VALIDASI STATUS ====
     const newErrors: any = {};

      if (!updateStatus) {
        newErrors.status = "Status wajib dipilih.";
      }

      if (updateStatus !== "ditolak" && !updateNomorSuratPengantar.trim()) {
        newErrors.no_surat_pengantar = "Nomor surat pengantar wajib diisi.";
      }

      if (updateStatus !== "ditolak" && !updateTtdRT) {
        newErrors.ttd_rt = "Tanda tangan RT wajib diupload.";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrorsUpdate(newErrors);
        return;
      }


      // Nomor surat wajib jika status bukan 'ditolak'
    if (updateStatus !== "ditolak" && !updateNomorSuratPengantar.trim()) {
      setAlertData({
        variant: "warning",
        title: "Peringatan",
        message: "Nomor surat wajib diisi untuk status selain ditolak."
      });
      return;
    }

    if (updateStatus !== "ditolak" && !updateTtdRT) {
      setAlertData({
        variant: "warning",
        title: "Peringatan",
        message: "Tanda tangan RT wajib diupload."
      });
      return;
    }

    const payload = new FormData();
    payload.append("status", updateStatus);
    payload.append("keterangan", updateKeterangan || "");

    if (updateStatus !== "ditolak") {
      payload.append("no_surat_pengantar", updateNomorSuratPengantar);
      payload.append("ttd_rt", updateTtdRT as File);
    }

    const res = await axios.post(
      `http://127.0.0.1:8000/api/rt/${rt_id}/skbm/${id_skbm}/proses`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      }
    );

    localStorage.setItem(
      "pending_alert",
      JSON.stringify({
        variant: "success",
        title: "Berhasil",
        message: "Status berhasil diperbarui!"
      })
    );

    setModalUpdateOpen(false);

    window.location.reload();

      // refresh data table
      setData((prev) =>
        prev.map((d) => (d.id_skbm === id_skbm ? res.data.data : d))
      );

  } catch (err: any) {
    let errorMsg =
      err?.response?.data?.message ||
      err?.response?.data?.errors ||
      "Gagal memperbarui status.";

    if (typeof errorMsg === "object") {
      errorMsg = Object.values(errorMsg).join("\n");
    }

    setModalUpdateOpen(false);

    setAlertData({
      variant: "error",
      title: "Gagal",
      message: errorMsg
    });
  }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedData(null);
  };

  if (loading) {
    return <div className="p-5">Loading...</div>;
  }
  const user_type = localStorage.getItem("user_type");


  // === HANDLE UNTUK VALIDASI PERANGKAT DESA ===
  const handleUpdatePerangkat = async () => {
    if (!selectedData) return;

    // 🔴 reset error lama dulu (PENTING)
    setErrorsPerangkat({});

    const newErrors: any = {};

    // ================= VALIDASI STATUS =================
    if (!updateStatusPerangkat || updateStatusPerangkat.trim() === "") {
      newErrors.status = "Status wajib dipilih.";
    }

    // ================= VALIDASI FIELD TAMBAHAN =================
    if (updateStatusPerangkat && updateStatusPerangkat !== "ditolak") {
      if (!updateNomorSurat || !updateNomorSurat.trim()) {
        newErrors.nomor_surat = "Nomor surat wajib diisi.";
      }

      if (!updatePoinII || !updatePoinII.trim()) {
        newErrors.poin_ii = "Poin II wajib diisi.";
      }
    }

    // ================= JIKA ADA ERROR → TAMPILKAN =================
    if (Object.keys(newErrors).length > 0) {
      setErrorsPerangkat(newErrors);
      return; // ⛔ STOP, jangan lanjut API
    }

    // ================= PROSES API =================
    try {
      const token = localStorage.getItem("token") ?? "";

      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : {};
      const perangkat_id = user.id;

      if (!perangkat_id) {
        setModalUpdatePerangkatOpen(false);
        setAlertData({
          variant: "error",
          title: "Gagal",
          message: "ID perangkat desa tidak ditemukan. Silakan login ulang."
        });
        return;
      }

      const id_skbm = selectedData.id_skbm;

      const payload: any = {
        status: updateStatusPerangkat,
        keterangan: updateKeteranganPerangkat || "",
      };

      if (updateStatusPerangkat !== "ditolak") {
        payload.nomor_surat = updateNomorSurat;
        payload.poin_ii = updatePoinII;
      }

      await axios.put(
        `http://127.0.0.1:8000/api/perangkat-desa/${perangkat_id}/skbm/${id_skbm}/proses`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      localStorage.setItem(
        "pending_alert",
        JSON.stringify({
          variant: "success",
          title: "Berhasil",
          message: "Status berhasil diperbarui!"
        })
      );

      setModalUpdatePerangkatOpen(false);
      window.location.reload();

    } catch (err: any) {
      setModalUpdatePerangkatOpen(false);

      // 🔴 jika backend kirim error validasi
      const backendErrors = err?.response?.data?.errors;

      if (backendErrors) {
        setErrorsPerangkat(backendErrors);
        return;
      }

      setAlertData({
        variant: "error",
        title: "Gagal",
        message:
          err?.response?.data?.message ||
          "Gagal memperbarui status."
      });
    }
  };

   // === HANDLE UNTUK VALIDASI KEPALA DESA ===
  const handleUpdateKepala = async () => {
    if (!selectedData) return;

      setErrorsKepala({});

    const newErrors: {
      status?: string;
      ttd_kades?: string;
    } = {};

  // VALIDASI STATUS
  if (!updateStatusKepala || updateStatusKepala.trim() === "") {
    newErrors.status = "Status wajib dipilih.";
  }

  // VALIDASI TTD → HANYA JIKA SELESAI
  if (updateStatusKepala === "selesai" && !updateTtdKepala) {
    newErrors.ttd_kades = "Tanda tangan Kepala Desa wajib diupload.";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrorsKepala(newErrors);
    return;
  }


    try {
      const token = localStorage.getItem("token") ?? "";
      const id_skbm = selectedData.id_skbm;
      const kepalaDesaId = 1;

    const payload = new FormData();
  payload.append("status", updateStatusKepala);
  payload.append("keterangan", updateKeteranganKepala || "");

  // ⬇️ HANYA KIRIM TTD JIKA STATUS SELESAI
  if (updateStatusKepala === "selesai" && updateTtdKepala) {
    payload.append("ttd_kades", updateTtdKepala);
  }

      await axios.post(
        `http://127.0.0.1:8000/api/kepala_desa/${kepalaDesaId}/skbm/${id_skbm}/validasi`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );

      localStorage.setItem(
        "pending_alert",
        JSON.stringify({
          variant: "success",
          title: "Berhasil",
          message: "Status berhasil diperbarui!"
        })
      );

      setModalUpdateKepalaOpen(false);
      window.location.reload();

    } catch (err: any) {
      setModalUpdateKepalaOpen(false);
      setAlertData({
        variant: "error",
        title: "Gagal",
        message:
          err?.response?.data?.message ||
          "Gagal memperbarui status."
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

      {/* ===================== SEARCH & FILTER WRAPPER ===================== */}

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
            placeholder="Search Nama / NIK..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="shadow-sm focus:border-brand-300 focus:ring-brand-500/10 h-11 w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
        </div>

        {/* --- FILTER DROPDOWN (Kanan) --- */}
        {/* Whitespace-nowrap agar teks "Filter" tidak patah jadi 2 baris */}
        <div className="relative">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="h-11 flex items-center gap-2 px-4 whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M14.6537 5.90414C14.6537 4.48433 13.5027 3.33331 12.0829 3.33331C10.6631 3.33331 9.51206 4.48433 9.51204 5.90415M14.6537 5.90414C14.6537 7.32398 13.5027 8.47498 12.0829 8.47498C10.663 8.47498 9.51204 7.32398 9.51204 5.90415M14.6537 5.90414L17.7087 5.90411M9.51204 5.90415L2.29199 5.90411M5.34694 14.0958C5.34694 12.676 6.49794 11.525 7.91777 11.525C9.33761 11.525 10.4886 12.676 10.4886 14.0958M5.34694 14.0958C5.34694 15.5156 6.49794 16.6666 7.91778 16.6666C9.33761 16.6666 10.4886 15.5156 10.4886 14.0958M5.34694 14.0958L2.29199 14.0958M10.4886 14.0958L17.7087 14.0958" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden sm:inline">Filter</span>
          </Button>

          {isFilterOpen && (
            /* z-[999] agar dropdown dan kalender tidak tertutup tabel */
            <div className="absolute right-0 z-[999] mt-2 w-72 rounded-lg border border-gray-200 bg-white p-5 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 text-start">
                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 focus:outline-none dark:border-gray-700 dark:text-white"
                >
                  <option value="">Semua Status</option>
                  <option value="diproses rt">Diproses RT</option>
                  <option value="diproses perangkat desa">Diproses Perangkat Desa</option>
                  <option value="diproses kepala desa">Diproses Kepala Desa</option>
                  <option value="selesai">Selesai</option>
                  <option value="ditolak">Ditolak</option>
                </select>
              </div>

              <div className="mb-5 text-start">
                  <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">Pilih Tanggal</label>
                  <DatePicker value={dateInput} onChange={(val: string) => setDateInput(val)} placeholder="Pilih Tanggal" />
              </div>

              {/* Action Buttons */}
      <div className="flex gap-2 mt-2">
        {/* Tombol Reset */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // 1. Kosongkan semua state filter (untuk API)
            setSearch("");
            setStatus("");
            setBulan("");
            setTahun("");
            setTanggal("");
            
            // 2. Kosongkan state input (untuk tampilan UI)
            setStatusInput(""); 
            setDateInput(""); 
            
            // 3. Kembalikan ke halaman pertama dan tutup dropdown
            setCurrentPage(1);
            setIsFilterOpen(false);
          }}
          className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Reset
        </Button>

        {/* Tombol Apply */}
        <Button
          size="sm"
          onClick={() => {
            setStatus(statusInput);
            if (dateInput) {
              // dateInput dari Flatpickr adalah "YYYY-MM-DD"
              const [y, m, d] = dateInput.split("-");
              
              // Normalisasi angka (menghilangkan nol di depan agar cocok dengan Laravel)
              setTahun(parseInt(y, 10).toString()); 
              setBulan(parseInt(m, 10).toString()); 
              setTanggal(parseInt(d, 10).toString());
            } else {
              setTahun(""); 
              setBulan(""); 
              setTanggal("");
            }
            setCurrentPage(1);
            setIsFilterOpen(false);
          }}
          className="flex-1 bg-blue-600 text-white hover:bg-blue-700 border-none"
        >
          Apply
        </Button>
      </div>

              {/* Arrow */}
              <div className="absolute -top-1.5 right-10 h-3 w-3 rotate-45 border-l border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800" />
            </div>
          )}
        </div>
      </div>
      </div>

      {/* ===================== TABLE ===================== */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Nama
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Tanggal Mengajukan
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Keterangan
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">

            {loading && (
  <TableRow>
    <td colSpan={6} className="px-5 py-6 text-center text-gray-500">
      Memuat data...
    </td>
  </TableRow>
)}


  {/* ====== SAAT DATA KOSONG ====== */}
{!loading && data.length === 0 && (
  <TableRow>
    <td colSpan={6} className="px-5 py-4 text-theme-sm text-center text-gray-500">
      Belum ada ajuan surat
    </td>
  </TableRow>
)}


  {/* ====== SAAT ADA DATA ====== */}
  {data.length > 0 &&
    data.map((item) => (
      <TableRow key={item.id_skbm}>
        {/* NAMA */}
        <TableCell className="px-5 py-4 sm:px-6 text-start">
          <div className="flex items-center gap-3">
            <div>
              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                {item.nama}
              </span>
              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                Pemohon Surat Keterangan Belum Menikah
              </span>
            </div>
          </div>
        </TableCell>

        {/* TANGGAL */}
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {formatDate(item.created_at)}
        </TableCell>

        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          <Badge
            size="sm"
            color={
              item.status.includes("diproses")
                ? "warning"
                : item.status.includes("ditolak")
                ? "error"
                : "success"
            }
          >
            {formatRejectedStatus(item.status, item.rejected_by)}
          </Badge>
        </TableCell>

     {/* KETERANGAN */}
<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
  {/* Membungkus teks dengan div agar bisa dikontrol lebarnya */}
  <div className="max-w-[350px] whitespace-normal break-words leading-relaxed">
    {item.keterangan ?? "Mohon ditunggu"}
  </div>
</TableCell>

      {/* ACTION */}
       <TableCell className="px-4 py-3 align-middle">
  <div className="flex flex-wrap items-center gap-2">
    {/* BUTTON DETAIL */}
    <button
      onClick={() => openModalDetail(item)}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 shadow-sm"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      Detail
    </button>

    {/* BUTTON AJUKAN KEMBALI (MASYARAKAT) */}
    {item.status === "ditolak" && user_type === "masyarakat" && (
      <button
        onClick={() => openModalAjukanKembali(item)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 rounded-lg hover:bg-blue-700 hover:shadow-md active:transform active:scale-95 transition-all duration-200 shadow-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Ajukan Kembali
      </button>
    )}

    {/* BUTTON VALIDASI RT */}
    {user_type === "rt" && (
      <button
        onClick={() => openModalUpdate(item)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all duration-200 shadow-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        Validasi
      </button>
    )}

    {/* BUTTON VALIDASI PERANGKAT DESA */}
    {user_type === "perangkat_desa" && (
      <button
        onClick={() => openModalUpdatePerangkat(item)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-200 shadow-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        Validasi
      </button>
    )}

    {/* BUTTON VALIDASI KEPALA DESA */}
    {user_type === "kepala_desa" && (
      <button
        onClick={() => openModalUpdateKepala(item)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-200 shadow-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        Validasi
      </button>
    )}
  </div>
</TableCell>
      </TableRow>
    ))
  }

</TableBody>


          </Table>
     <div className="flex items-center flex-col sm:flex-row justify-between border-t border-gray-200 px-5 py-4 dark:border-gray-800">
      
    
      {/* Kanan: Navigasi (Selalu Muncul) */}
      <div className="flex items-center gap-2 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end bg-gray-50 dark:bg-gray-900 p-2 rounded-xl sm:bg-transparent sm:p-0 dark:sm:bg-transparent">
        
        {/* Tombol Prev */}
        <button 
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
        >
          <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M2.58203 9.99868C2.58174 10.1909 2.6549 10.3833 2.80152 10.53L7.79818 15.5301C8.09097 15.8231 8.56584 15.8233 8.85883 15.5305C9.15183 15.2377 9.152 14.7629 8.85921 14.4699L5.13911 10.7472L16.6665 10.7472C17.0807 10.7472 17.4165 10.4114 17.4165 9.99715C17.4165 9.58294 17.0807 9.24715 16.6665 9.24715L5.14456 9.24715L8.85919 5.53016C9.15199 5.23717 9.15184 4.7623 8.85885 4.4695C8.56587 4.1767 8.09099 4.17685 7.79819 4.46984L2.84069 9.43049C2.68224 9.568 2.58203 9.77087 2.58203 9.99715C2.58203 9.99766 2.58203 9.99817 2.58203 9.99868Z"></path>
          </svg>
        </button>

        {/* Info Page Mobile (Muncul saat layar kecil) */}
        <span className="block text-sm font-medium text-gray-700 sm:hidden dark:text-gray-400">
          Page <span className="font-bold text-blue-600">{currentPage}</span> of {lastPage}
        </span>

        {/* List Angka (Hanya Muncul di Desktop) */}
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

        {/* Tombol Next */}
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
  </div>
      </div>

      {/* ===================== MODAL DETAIL AJUAN SURAT ===================== */}
<Modal 
  isOpen={modalOpen} 
  onClose={closeModal} 
  className="max-w-[800px] m-4"
>
  <div className="relative w-full p-6 bg-white rounded-2xl dark:bg-gray-900 shadow-2xl">
    
    {/* HEADER */}
    <div className="mb-4 border-b pb-3 dark:border-gray-700">
      <h4 className="text-2xl font-bold text-blue-700 dark:text-blue-400">
        Detail Pengajuan Surat Keterangan Tidak Mampu
      </h4>
    </div>

    {/* WRAPPER SCROLL - max-h 55vh agar tidak terlalu tinggi */}
    <div className="max-h-[55vh] overflow-y-auto custom-scrollbar pr-3">
      {selectedData && (
        <div className="space-y-6">
          
          {/* --- DATA DIRI PEMOHON --- */}
          <section>
            <h5 className="text-sm font-bold uppercase tracking-wider text-blue-600 mb-3 pl-2 border-l-4 border-blue-600">
              Data Diri Pemohon
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
              {[
                { label: "Nama Lengkap", value: selectedData.nama },
                { label: "NIK", value: selectedData.nik },
                { label: "Jenis Kelamin", value: selectedData.jenis_kelamin },
                { label: "Tempat, Tanggal Lahir", value: selectedData.ttl },
                { label: "Status Perkawinan", value: selectedData.status_perkawinan },
                { label: "Agama", value: selectedData.agama },
                { label: "Kewarganegaraan", value: selectedData.kewarganegaraan },
                { label: "Pendidikan", value: selectedData.pendidikan },
                { label: "Pekerjaan", value: selectedData.pekerjaan },
                { label: "Alamat", value: selectedData.alamat, full: true },
                { label: "Keperluan", value: selectedData.keperluan, full: true },
                { label: "Alasan", value: selectedData.alasan, full: true },
              ].map((item, idx) => (
                <div key={idx} className={item.full ? "md:col-span-2" : ""}>
                  <p className="text-sm font-bold text-gray-400 uppercase">{item.label}</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{item.value || "-"}</p>
                </div>
              ))}
            </div>
          </section>

          {/* --- LAMPIRAN & TANDA TANGAN --- */}
<section>
  <h5 className="text-sm font-bold uppercase tracking-wider text-green-600 mb-3 pl-2 border-l-4 border-green-600">
    Lampiran & Tanda Tangan
  </h5>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {/* KTP */}
    <div className="p-3 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-center">
      <p className="text-xs font-bold mb-3 uppercase text-gray-500">KTP</p>
      {selectedData.file_ktp ? (
        <div className="flex flex-col items-center">
          {!selectedData.file_ktp.endsWith(".pdf") && (
            // PERBAIKAN: Menggunakan h-28, w-full, dan rounded-lg
            <img 
              src={getFileUrl(selectedData.file_ktp)} 
              className="h-28 w-full rounded-lg shadow-sm mb-3 object-cover border dark:border-gray-600" 
              alt="KTP" 
            />
          )}
          <a href={getFileUrl(selectedData.file_ktp)} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 font-bold hover:underline italic">LIHAT BERKAS</a>
        </div>
      ) : <p className="text-gray-400 text-xs italic">-</p>}
    </div>

    {/* KK */}
    <div className="p-3 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-center">
      <p className="text-xs font-bold mb-3 uppercase text-gray-500">KK</p>
      {selectedData.file_kk ? (
        <div className="flex flex-col items-center">
          {!selectedData.file_kk.endsWith(".pdf") && (
            // PERBAIKAN: Menggunakan h-28, w-full, dan rounded-lg
            <img 
              src={getFileUrl(selectedData.file_kk)} 
              className="h-28 w-full rounded-lg shadow-sm mb-3 object-cover border dark:border-gray-600" 
              alt="KK" 
            />
          )}
          <a href={getFileUrl(selectedData.file_kk)} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 font-bold hover:underline italic">LIHAT BERKAS</a>
        </div>
      ) : <p className="text-gray-400 text-xs italic">-</p>}
    </div>

    {/* TANDA TANGAN MASYARAKAT */}
    <div className="p-3 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-center">
      <p className="text-xs font-bold mb-3 uppercase text-gray-500">TTD Pemohon</p>
      {selectedData.ttd_masyarakat ? (
        <div className="flex flex-col items-center">
          {/* PERBAIKAN: Diperbesar jadi h-28, w-full, bg-white agar jelas, dan object-contain agar tidak terpotong */}
          <img 
            src={getFileUrl(selectedData.ttd_masyarakat)} 
            className="h-28 w-full rounded-lg bg-white p-2 shadow-sm mb-3 object-contain border dark:border-gray-600" 
            alt="TTD" 
          />
          <a href={getFileUrl(selectedData.ttd_masyarakat)} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 font-bold hover:underline italic">LIHAT TTD</a>
        </div>
      ) : <p className="text-gray-400 text-xs italic">-</p>}
    </div>
  </div>
</section>

          {/* --- LOG VALIDASI --- */}
          <section>
            <h5 className="text-sm font-bold uppercase tracking-wider text-amber-600 mb-3 pl-2 border-l-4 border-amber-600">
              Status & Log Validasi
            </h5>
            <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Ketua RT</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{selectedData.rt?.nama || "-"}</p>
                  <p className="text-[10px] text-gray-500 mt-1 italic">
                    {selectedData.rt_validated_at ? formatDateTime(selectedData.rt_validated_at) : "Belum divalidasi"}
                  </p>
                </div>
                <div className="border-x dark:border-gray-700 px-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Perangkat Desa</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{selectedData.perangkat?.nama || "-"}</p>
                  <p className="text-[10px] text-gray-500 mt-1 italic">
                    {selectedData.perangkat_validated_at ? formatDateTime(selectedData.perangkat_validated_at) : "Belum divalidasi"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Kepala Desa</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{selectedData.kepala_desa?.nama || "-"}</p>
                  <p className="text-[10px] text-gray-500 mt-1 italic">
                    {selectedData.kepala_desa_validated_at ? formatDateTime(selectedData.kepala_desa_validated_at) : "Belum divalidasi"}
                  </p>
                </div>
              </div>

              {/* DOWNLOAD SURAT JIKA SUDAH SELESAI */}
              {(selectedData.file_pengantar_rt || selectedData.file_pdf) && (
                <div className="mt-5 pt-4 border-t border-dashed border-gray-300 dark:border-gray-600 flex flex-col gap-4">
  
  {/* Kotak Informasi/Peringatan */}
  <div className="flex gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
    <div className="shrink-0">
      <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    </div>
    <div>
      <p className="text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-tight">
        Perhatian untuk Pemohon
      </p>
      <p className="text-[11px] leading-relaxed text-amber-700 dark:text-amber-500/90 mt-0.5">
        Segera unduh dan simpan dokumen di bawah ini sebagai arsip pribadi. 
        <span className="font-bold"> Data pengajuan dapat dihapus oleh admin perangkat desa sewaktu-waktu </span> 
        untuk pemeliharaan sistem.
      </p>
    </div>
  </div>

  {/* Tombol Unduh */}
  <div className="flex flex-col gap-2.5 pl-1">
    {selectedData.file_pengantar_rt && (
      <a 
        href={selectedData.file_pengantar_rt} 
        target="_blank" 
        rel="noreferrer"
        className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-2 transition-colors"
      >
        <span className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">📄</span>
        Download Surat Pengantar RT (PDF)
      </a>
    )}
    
    {selectedData.file_pdf && (
      <a 
        href={selectedData.file_pdf} 
        target="_blank" 
        rel="noreferrer"
        className="text-xs font-bold text-green-600 hover:text-green-700 hover:underline flex items-center gap-2 transition-colors"
      >
        <span className="p-1 bg-green-100 dark:bg-green-900/30 rounded">📄</span>
        Download Surat Keterangan Belum Menikah Resmi Terverifikasi (PDF)
      </a>
    )}
  </div>
</div>
              )}
            </div>
          </section>

        </div>
      )}
    </div>

    {/* FOOTER */}
    <div className="flex justify-end pt-4 border-t mt-4 dark:border-gray-700">
      <button
        className="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition text-sm shadow-md"
        onClick={closeModal}
      >
        Tutup
      </button>
    </div>
  </div>
</Modal>

      {/* ===================== MODAL AJUKAN KEMBALI SETELAH DITOLAK ===================== */}
      <Modal
        isOpen={modalAjukanKembali}
        onClose={() => setModalAjukanKembali(false)}
        className="max-w-[750px] w-full m-4"
      >
        <div className="relative flex flex-col w-full max-h-[90vh] overflow-hidden rounded-3xl bg-white dark:bg-gray-900 shadow-xl">
          
          {/* HEADER - Tetap di atas, tidak ikut scroll */}
          <div className="px-6 pt-8 pb-4 lg:px-11 lg:pt-11">
            <h4 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white/90">
              Ajukan Kembali Surat Keterangan Belum Menikah
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Perbarui data pengajuan sebelum dikirim kembali untuk diproses.
            </p>
          </div>

          {/* FORM BODY - Area yang bisa di-scroll */}
          <form className="flex flex-col overflow-hidden">
            <div className="custom-scrollbar flex-grow overflow-y-auto px-6 pb-6 lg:px-11">
              
              <h5 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6 border-b border-gray-100 dark:border-gray-800 pb-2">
                Data Pemohon
              </h5>

              {/* GRID LOGIC: grid-cols-1 (Mobile) & lg:grid-cols-2 (Desktop) */}
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                {/* NAMA */}
                <div className="space-y-2">
                  <Label>Nama</Label>
                  <Input
                    type="text"
                    value={formUpdate.nama}
                    onChange={(e) => setFormUpdate({ ...formUpdate, nama: e.target.value })}
                  />
                  {errors.nama && <p className="mt-1 text-xs text-red-500">{errors.nama}</p>}
                </div>

                {/* NIK */}
                <div className="space-y-2">
                  <Label>NIK</Label>
                  <Input
                    type="text"
                    value={formUpdate.nik}
                    onChange={(e) => setFormUpdate({ ...formUpdate, nik: e.target.value })}
                  />
                  {errors.nik && <p className="mt-1 text-xs text-red-500">{errors.nik}</p>}
                </div>

                {/* JENIS KELAMIN */}
                <div className="space-y-2">
                  <Label>Jenis Kelamin</Label>
                  <select
                    className="h-12 w-full rounded-xl border text-sm border-gray-300 bg-white px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    value={formUpdate.jenis_kelamin}
                    onChange={(e) => setFormUpdate({ ...formUpdate, jenis_kelamin: e.target.value })}
                  >
                    <option value="">-- Pilih --</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                {/* TTL */}
                <div className="space-y-2">
                  <Label>Tempat Tanggal Lahir</Label>
                  <Input
                    type="text"
                    value={formUpdate.ttl}
                    onChange={(e) => setFormUpdate({ ...formUpdate, ttl: e.target.value })}
                  />
                  {errors.ttl && <p className="mt-1 text-xs text-red-500">{errors.ttl}</p>}
                </div>

                {/* STATUS PERKAWINAN */}
                <div className="space-y-2">
                  <Label>Status Perkawinan</Label>
                  <Input
                    type="text"
                    value={formUpdate.status_perkawinan}
                    onChange={(e) => setFormUpdate({ ...formUpdate, status_perkawinan: e.target.value })}
                  />
                  {errors.status_perkawinan && <p className="mt-1 text-xs text-red-500">{errors.status_perkawinan}</p>}
                </div>

                {/* AGAMA */}
                <div className="space-y-2">
                  <Label>Agama</Label>
                  <Input
                    type="text"
                    value={formUpdate.agama}
                    onChange={(e) => setFormUpdate({ ...formUpdate, agama: e.target.value })}
                  />
                  {errors.agama && <p className="mt-1 text-xs text-red-500">{errors.agama}</p>}
                </div>

                  {/* KEWARGANEGARAAN */}
                <div className="space-y-2">
                  <Label>Kewarganegaraan</Label>
                  <Input
                    type="text"
                    value={formUpdate.kewarganegaraan}
                    onChange={(e) => setFormUpdate({ ...formUpdate, kewarganegaraan: e.target.value })}
                  />
                  {errors.kewarganegaraan && <p className="mt-1 text-xs text-red-500">{errors.kewarganegaraan}</p>}
                </div>

                {/* PENDIDIKAN */}
                <div className="space-y-2">
                  <Label>Pendidikan</Label>
                  <Input
                    type="text"
                    value={formUpdate.pendidikan}
                    onChange={(e) => setFormUpdate({ ...formUpdate, pendidikan: e.target.value })}
                  />
                  {errors.pendidikan && <p className="mt-1 text-xs text-red-500">{errors.pendidikan}</p>}
                </div>

                {/* PEKERJAAN */}
                <div className="space-y-2">
                  <Label>Pekerjaan</Label>
                  <Input
                    type="text"
                    value={formUpdate.pekerjaan}
                    onChange={(e) => setFormUpdate({ ...formUpdate, pekerjaan: e.target.value })}
                  />
                  {errors.pekerjaan && <p className="mt-1 text-xs text-red-500">{errors.pekerjaan}</p>}
                </div>

                {/* ALAMAT */}
                <div className="lg:col-span-2 space-y-2">
                  <Label>Alamat</Label>
                  <Input
                    type="text"
                    value={formUpdate.alamat}
                    onChange={(e) => setFormUpdate({ ...formUpdate, alamat: e.target.value })}
                  />
                  {errors.alamat && <p className="mt-1 text-xs text-red-500">{errors.alamat}</p>}
                </div>

                {/* KEPERLUAN */}
                <div className="lg:col-span-2 space-y-2">
                  <Label>Keperluan</Label>
                  <Input
                    type="text"
                    value={formUpdate.keperluan}
                    onChange={(e) => setFormUpdate({ ...formUpdate, keperluan: e.target.value })}
                  />
                  {errors.keperluan && <p className="mt-1 text-xs text-red-500">{errors.keperluan}</p>}
                </div>

                {/* ALASAN */}
                <div className="lg:col-span-2 space-y-2">
                  <Label>Alasan</Label>
                  <TextArea
                    value={formUpdate.alasan}
                    onChange={(e) => setFormUpdate({ ...formUpdate, alasan: e.target.value })}
                    placeholder="Berikan alasan anda......"
                  />
                  {errors.alasan && <p className="mt-1 text-xs text-red-500">{errors.alasan}</p>}
                </div>

                {/* UPLOAD KTP */}
                <div className="lg:col-span-2 space-y-2">
                  <Label>Upload KTP <span className="text-red-500">*</span></Label>
                  <label
                    htmlFor="file_ktp_update"
                    className="mt-2 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer border-gray-300 hover:border-blue-500 bg-gray-50 dark:bg-gray-800/50 transition p-4 text-center"
                  >
                    <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9m0 0-3 3m3-3 3 3m5 4.5v2.25A2.25 2.25 0 0114.75 21h-5.5A2.25 2.25 0 017 18.75V16.5" />
                    </svg>
                    <span className="text-xs text-gray-500">Klik untuk upload (PDF / JPG / PNG, max 5MB)</span>
                    <input
                      id="file_ktp_update"
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => setFormUpdate({ ...formUpdate, file_ktp: e.target.files?.[0] || null })}
                    />
                  </label>
                  {formUpdate.file_ktp && <p className="mt-1 text-xs text-green-600 font-medium">✓ {formUpdate.file_ktp.name}</p>}
                  {errors.file_ktp && <p className="mt-1 text-xs text-red-500">{errors.file_ktp}</p>}
                </div>

                {/* UPLOAD KK */}
                <div className="lg:col-span-2 space-y-2">
                  <Label>Upload Kartu keluarga (KK) <span className="text-red-500">*</span></Label>
                  <label
                    htmlFor="file_kk_update"
                    className="mt-2 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer border-gray-300 hover:border-blue-500 bg-gray-50 dark:bg-gray-800/50 transition p-4 text-center"
                  >
                    <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9m0 0-3 3m3-3 3 3m5 4.5v2.25A2.25 2.25 0 0114.75 21h-5.5A2.25 2.25 0 017 18.75V16.5" />
                    </svg>
                    <span className="text-xs text-gray-500">Klik untuk upload (PDF / JPG / PNG, max 5MB)</span>
                    <input
                      id="file_kk_update"
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => setFormUpdate({ ...formUpdate, file_kk: e.target.files?.[0] || null })}
                    />
                  </label>
                  {formUpdate.file_kk && <p className="mt-1 text-xs text-green-600 font-medium">✓ {formUpdate.file_kk.name}</p>}
                  {errors.file_kk && <p className="mt-1 text-xs text-red-500">{errors.file_kk}</p>}
                </div>

                {/* UPLOAD TTD */}
<div className="lg:col-span-2 space-y-2">
  <Label>Upload Tanda Tangan Anda <span className="text-red-500">*</span></Label>
  <label
    htmlFor="ttd_masyarakat_update"
    className="mt-2 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer border-gray-300 hover:border-blue-500 bg-gray-50 dark:bg-gray-800/50 transition p-4 text-center"
  >
    <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9m0 0-3 3m3-3 3 3m5 4.5v2.25A2.25 2.25 0 0114.75 21h-5.5A2.25 2.25 0 017 18.75V16.5" />
    </svg>
    <span className="text-xs text-gray-500">Upload gambar tanda tangan (JPG / PNG)</span>
    <input
      id="ttd_masyarakat_update"
      type="file"
      accept="image/png,image/jpeg"
      className="hidden"
      onChange={(e) => setFormUpdate({ ...formUpdate, ttd_masyarakat: e.target.files?.[0] || null })}
    />
  </label>
  {errors.ttd_masyarakat && <p className="mt-1 text-xs text-red-500">{errors.ttd_masyarakat}</p>}

  {/* Logika Preview TTD dengan Checkerboard */}
  {formUpdate.ttd_masyarakat && (
    <div className="mt-3 p-3 border rounded-xl bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center">
      <div className="flex justify-between w-full mb-2 px-1">
        <p className="text-[10px] text-gray-500 font-medium">Preview Tanda Tangan:</p>
        <p className="text-[10px] text-green-600 font-bold">✅ {formUpdate.ttd_masyarakat.name}</p>
      </div>

      {/* Container dengan pola kotak-kotak (Checkerboard) */}
      <div 
        className="relative w-full flex justify-center p-4 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden"
        style={{
          backgroundColor: '#ffffff',
          backgroundImage: 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }}
      >
        <img 
          src={URL.createObjectURL(formUpdate.ttd_masyarakat)} 
          alt="Preview TTD" 
          className="h-24 object-contain relative z-10" 
        />
      </div>
      <p className="mt-2 text-[9px] text-gray-400 italic text-center">
        *Pastikan pola kotak-kotak terlihat di sela tanda tangan agar hasil cetak surat lebih rapi.
      </p>
    </div>
  )}
</div>
</div>
</div>

            {/* FOOTER - Tetap di bawah, tidak ikut scroll */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 px-6 py-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 lg:px-11">
              <Button variant="outline" onClick={() => setModalAjukanKembali(false)} className="w-full sm:w-auto">
                Batal
              </Button>
              <Button onClick={handleAjukanKembali} className="w-full sm:w-auto px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold border-none shadow-md">
                Ajukan Kembali
              </Button>
            </div>
          </form>
        </div>
      </Modal>

   {/* ===================== MODAL VALIDASI KETUA RT ===================== */}
<Modal
  isOpen={modalUpdateOpen}
  onClose={() => setModalUpdateOpen(false)}
  className="max-w-xl w-full m-4"
>
  {/* Tambahkan flex flex-col dan max-h agar modal memiliki struktur yang jelas */}
  <div className="relative flex flex-col w-full max-h-[90vh] overflow-hidden bg-white rounded-2xl dark:bg-gray-900 shadow-xl">
    
    {/* HEADER MODAL - Tetap di atas (Fixed) */}
    <div className="p-6 pb-0">
      <div className="mb-5">
        <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400">
          Validasi Ketua RT
        </h3>
        <p className="text-sm text-gray-500 mt-2">
          Lengkapi nomor surat pengantar dan pastikan tanda tangan digital sudah sesuai sebelum meneruskan permohonan ke Perangkat Desa.
        </p>
      </div>
    </div>

    {/* CONTENT BODY - Area yang bisa di-scroll */}
    <div className="flex-grow overflow-y-auto px-6 custom-scrollbar">
      
      {/* ================= NOMOR SURAT PENGANTAR ================= */}
      {updateStatus !== "ditolak" && (
        <div className="mb-4">
          <label className="block mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Nomor Surat Pengantar RT <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={updateNomorSuratPengantar}
            onChange={(e) => {
              setUpdateNomorSuratPengantar(e.target.value);
              setErrorsUpdate((prev) => ({ ...prev, no_surat_pengantar: undefined }));
            }}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
            placeholder="Contoh: 001/RT-03/2025"
          />
          {errorsUpdate.no_surat_pengantar && (
            <p className="text-xs text-red-600 mt-1">
              {errorsUpdate.no_surat_pengantar}
            </p>
          )}
        </div>
      )}

      {/* ================= STATUS VALIDASI ================= */}
      <div className="mb-4">
        <label className="block mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Status Validasi <span className="text-red-500">*</span>
        </label>
        <select
          value={updateStatus}
          onChange={(e) => {
            setUpdateStatus(e.target.value);
            setErrorsUpdate((prev) => ({ ...prev, status: undefined }));
          }}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition text-sm"
        >
          <option value="">-- Pilih Status --</option>
          <option value="diproses perangkat desa">
            Disetujui dan Diteruskan ke Perangkat Desa
          </option>
          <option value="ditolak">Ditolak</option>
        </select>
        {errorsUpdate.status && (
          <p className="text-xs text-red-600 mt-1">
            {errorsUpdate.status}
          </p>
        )}
      </div>

      {/* ================= KETERANGAN ================= */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Keterangan
          </label>
          <span className="text-[10px] text-gray-400 italic">Klik opsi di bawah untuk isi cepat</span>
        </div>

        {/* Tombol Opsi Cepat (Chips) */}
        <div className="flex flex-wrap gap-2 mb-2">
          <button 
            onClick={() => setUpdateKeterangan("Data sesuai dan proses pengajuan dilanjutkan ke Perangkat Desa.")}
            className="px-2 py-1 text-[11px] bg-green-50 text-green-600 border border-green-200 rounded-md hover:bg-green-100 transition"
          >
            + Data Sesuai
          </button>
          <button 
            onClick={() => setUpdateKeterangan("Tanda tangan belum dihapus backgroundnya dan kurang jelas, mohon upload ulang.")}
            className="px-2 py-1 text-[11px] bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 transition"
          >
            + Tanda Tangan Salah
          </button>
          <button 
            onClick={() => setUpdateKeterangan("Data diri pada bagian ........ tidak cocok/kurang lengkap, mohon upload ulang.")}
            className="px-2 py-1 text-[11px] bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 transition"
          >
            + Data Tidak Lengkap
          </button>
        </div>

        <textarea
          value={updateKeterangan}
          onChange={(e) => setUpdateKeterangan(e.target.value)}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
          rows={3}
          placeholder="Isi keterangan atau klik opsi di atas..."
        />
      </div>

    {/* ================= UPLOAD TTD RT ================= */}
<div className="mb-6">
  <label className="block mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
    Upload Tanda Tangan Ketua RT <span className="text-red-500">*</span>
  </label>
  <label
    htmlFor="ttd_rt"
    className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer border-gray-300 bg-gray-50 hover:border-blue-500 transition p-2 dark:bg-gray-800 dark:border-gray-600"
  >
    <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9m0 0-3 3m3-3 3 3m5 4.5v2.25A2.25 2.25 0 0114.75 21h-5.5A2.25 2.25 0 017 18.75V16.5" />
    </svg>
    <span className="text-xs text-gray-500">Upload PNG/JPG TTD Ketua RT</span>
    <input
      id="ttd_rt"
      type="file"
      accept="image/png,image/jpeg"
      className="hidden"
      onChange={(e) => {
        setUpdateTtdRT(e.target.files?.[0] || null);
        setErrorsUpdate((prev) => ({ ...prev, ttd_rt: undefined }));
      }}
    />
  </label>

  {/* Preview Tanda Tangan dengan Checkerboard Background */}
  {updateTtdRT && (
    <div className="mt-3 p-3 border rounded-xl bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center">
      <div className="flex justify-between w-full mb-2 px-1">
        <p className="text-[10px] text-gray-500 font-medium">Preview Tanda Tangan:</p>
        <p className="text-[10px] text-green-600 font-bold">✅ {updateTtdRT.name}</p>
      </div>
      
      {/* Container Image dengan pola kotak-kotak (Checkerboard) */}
      <div 
        className="relative w-full flex justify-center p-4 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden"
        style={{
          backgroundColor: '#ffffff',
          backgroundImage: 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }}
      >
        <img 
          src={URL.createObjectURL(updateTtdRT)} 
          alt="Preview TTD RT" 
          className="h-24 object-contain relative z-10" 
        />
      </div>
      <p className="mt-2 text-[9px] text-gray-400 italic text-center">
        *Jika kotak-kotak terlihat di sela tanda tangan, berarti background sudah transparan.
      </p>
    </div>
  )}

  {errorsUpdate.ttd_rt && (
    <p className="text-xs text-red-600 mt-1">
      {errorsUpdate.ttd_rt}
    </p>
  )}
</div>
</div>

    {/* ACTION BUTTONS / FOOTER - Tetap di bawah (Fixed) */}
    <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 dark:bg-gray-800/50">
      <button
        type="button"
        className="px-5 py-2 text-sm border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
        onClick={() => setModalUpdateOpen(false)}
      >
        Kembali
      </button>
      <button
        type="button"
        onClick={handleUpdateStatus}
        className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-sm transition"
      >
        Validasi
      </button>
    </div>
  </div>
</Modal>

      {/* ===================== MODAL VALIDASI PERANGKAT DESA ===================== */}
<Modal
  isOpen={modalUpdatePerangkatOpen}
  onClose={() => setModalUpdatePerangkatOpen(false)}
  className="max-w-xl w-full m-4"
>
  <div className="relative w-full p-6 bg-white rounded-2xl dark:bg-gray-900 shadow-xl">
    
    {/* HEADER MODAL */}
    <div className="mb-5">
      <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400">
        Validasi Perangkat Desa
      </h3>
      <p className="text-sm text-gray-500 mt-4">
        Periksa surat pengantar dan pastikan tanda tangan digital sudah sesuai sebelum meneruskan permohonan ke Perangkat Desa.
      </p>
    </div>

    {/* ================= NOMOR SURAT ================= */}
    <div className="mb-4">
      <label className="block mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
        Nomor Surat <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={updateNomorSurat}
        onChange={(e) => {
          setUpdateNomorSurat(e.target.value);
          setErrorsPerangkat((p) => ({ ...p, nomor_surat: undefined }));
        }}
        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
        placeholder="Masukkan nomor surat resmi"
      />
      {errorsPerangkat.nomor_surat && (
        <p className="text-xs text-red-600 mt-1">
          {errorsPerangkat.nomor_surat}
        </p>
      )}
    </div>

    {/* ================= POIN II ================= */}
    {updateStatusPerangkat !== "ditolak" && (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Poin II <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => setUpdatePoinII(DEFAULT_POIN_II)}
            className="text-[11px] font-medium text-blue-600 hover:underline flex items-center gap-1"
          >
            🔄 Reset ke Default
          </button>
        </div>
        <textarea
          value={updatePoinII}
          onChange={(e) => {
            setUpdatePoinII(e.target.value);
            setErrorsPerangkat((p) => ({ ...p, poin_ii: undefined }));
          }}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm font-serif italic bg-gray-50 dark:bg-gray-800"
          rows={3}
          placeholder="Isi poin II sesuai format surat"
        />
        {errorsPerangkat.poin_ii && (
          <p className="text-xs text-red-600 mt-1">
            {errorsPerangkat.poin_ii}
          </p>
        )}
      </div>
    )}

    {/* ================= STATUS ================= */}
    <div className="mb-4">
      <label className="block mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
        Status <span className="text-red-500">*</span>
      </label>
      <select
        value={updateStatusPerangkat}
        onChange={(e) => {
          const val = e.target.value;
          setUpdateStatusPerangkat(val);
          // Auto-fill teks default saat status dipilih
          if (val === "diproses kepala desa") {
            setUpdateKeteranganPerangkat("Berkas sudah divalidasi dan siap untuk ditandatangani Kepala Desa.");
          } else if (val === "ditolak") {
            setUpdateKeteranganPerangkat("Berkas dikembalikan karena ada ketidaksesuaian data.");
          }
          setErrorsPerangkat((p) => ({ ...p, status: undefined }));
        }}
        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition text-sm"
      >
        <option value="">-- Pilih Status --</option>
        <option value="diproses kepala desa">Disetujui dan Diteruskan</option>
        <option value="ditolak">Ditolak</option>
      </select>
       {errorsPerangkat.status && (
            <p className="text-sm text-red-600 mb-4">
              {errorsPerangkat.status}
           </p>
      )}
    </div>


    {/* ================= KETERANGAN (DENGAN CHIPS) ================= */}
    <div className="mb-6">
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Keterangan
        </label>
        <span className="text-[10px] text-gray-400 italic">Opsi Cepat</span>
      </div>

      {/* Tombol Opsi Cepat (Chips) */}
      <div className="flex flex-wrap gap-2 mb-2">
        {/* <button 
          type="button"
          onClick={() => setUpdateKeteranganPerangkat("Persyaratan administrasi sudah lengkap dan valid.")}
          className="px-2 py-1 text-[11px] bg-blue-50 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-100 transition"
        >
          + Berkas Lengkap
        </button> */}
        <button 
          type="button"
          onClick={() => setUpdateKeteranganPerangkat("Data sesuai dan dilanjutkan proses tanda tangan Kepala Desa.")}
          className="px-2 py-1 text-[11px] bg-green-50 text-green-600 border border-green-200 rounded-md hover:bg-green-100 transition"
        >
          + Siap TTD Kades
        </button>
        <button 
          type="button"
          onClick={() => setUpdateKeteranganPerangkat("Data lampiran tidak sesuai dengan formulir, mohon periksa kembali.")}
          className="px-2 py-1 text-[11px] bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 transition"
        >
          + Cek Lampiran
        </button>
      </div>

      <textarea
        value={updateKeteranganPerangkat}
        onChange={(e) => setUpdateKeteranganPerangkat(e.target.value)}
        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
        rows={3}
        placeholder="Tambahkan catatan atau pilih opsi di atas..."
      />
    </div>

    {/* ================= ACTION BUTTONS ================= */}
    <div className="flex justify-end gap-3 border-t pt-5">
      <button
        type="button"
        className="px-5 py-2 text-sm border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
        onClick={() => setModalUpdatePerangkatOpen(false)}
      >
        Kembali
      </button>
      <button
        type="button"
        onClick={handleUpdatePerangkat}
        className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-sm transition"
      >
        Validasi
      </button>
    </div>
  </div>
</Modal>

      {/* ===================== MODAL VALIDASI KEPALA DESA ===================== */}
<Modal
  isOpen={modalUpdateKepalaOpen}
  onClose={() => setModalUpdateKepalaOpen(false)}
  className="max-w-xl w-full m-4"
>
  <div className="relative w-full p-6 bg-white rounded-2xl dark:bg-gray-900 shadow-xl">
    
    {/* HEADER MODAL */}
    <div className="mb-5">
      <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400">
        Validasi Kepala Desa
      </h3>
      <p className="text-sm text-gray-500 mt-5">
        Tahap akhir validasi. Pastikan semua data sudah benar sebelum menandatangani.
      </p>
    </div>

    {/* ================= STATUS VALIDASI ================= */}
    <div className="mb-4">
      <label className="block mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
        Status Validasi <span className="text-red-500">*</span>
      </label>
      <select
        value={updateStatusKepala}
        onChange={(e) => {
          const val = e.target.value;
          setUpdateStatusKepala(val);
          // Auto-fill teks default saat status dipilih
          if (val === "selesai") {
            setUpdateKeteranganKepala("Permohonan telah disetujui dan ditandatangani oleh Kepala Desa.");
          } else if (val === "ditolak") {
            setUpdateKeteranganKepala("Permohonan tidak dapat disetujui oleh Kepala Desa.");
          }
          setErrorsKepala((p: any) => ({ ...p, status: undefined }));
        }}
        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition text-sm"
      >
        <option value="">-- Pilih Status --</option>
        <option value="selesai">Selesai (Disetujui)</option>
        <option value="ditolak">Ditolak</option>
      </select>
      {errorsKepala.status && (
        <p className="text-xs text-red-600 mt-1">
          {errorsKepala.status}
        </p>
      )}
    </div>

    {/* ================= KETERANGAN (DENGAN CHIPS) ================= */}
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Keterangan
        </label>
        <span className="text-[10px] text-gray-400 italic">Opsi Cepat</span>
      </div>

      {/* Tombol Opsi Cepat (Chips) */}
      <div className="flex flex-wrap gap-2 mb-2">
        {/* <button 
          type="button"
          onClick={() => setUpdateKeteranganKepala("Dokumen telah diperiksa dan disahkan.")}
          className="px-2 py-1 text-[11px] bg-blue-50 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-100 transition"
        >
          + Sahkan Dokumen
        </button> */}
        <button 
          type="button"
          onClick={() => setUpdateKeteranganKepala("Seluruh persyaratan telah terpenuhi dengan benar, dan Surat Keterangan Belum menikah sudah disahkan. Periksa di detail pengajuan surat untuk mengunduh file.")}
          className="px-2 py-1 text-[11px] bg-green-50 text-green-600 border border-green-200 rounded-md hover:bg-green-100 transition"
        >
          + Data Valid
        </button>
        <button 
          type="button"
          onClick={() => setUpdateKeteranganKepala("Mohon perbaiki data sebelum diajukan kembali ke Kepala Desa.")}
          className="px-2 py-1 text-[11px] bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 transition"
        >
          + Perlu Revisi
        </button>
      </div>

      <textarea
        value={updateKeteranganKepala}
        onChange={(e) => setUpdateKeteranganKepala(e.target.value)}
        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
        rows={3}
        placeholder="Tambahkan catatan atau pilih opsi di atas..."
      />
    </div>

{/* ================= UPLOAD TTD KEPALA DESA ================= */}
<div className="mb-6">
  <label className="block mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
    Upload Tanda Tangan Kepala Desa <span className="text-red-500">*</span>
  </label>
  <label
    htmlFor="ttd_kades"
    className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-blue-500 transition p-4 dark:bg-gray-800 dark:border-gray-600"
  >
    <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 16.5V9m0 0-3 3m3-3 3 3m5 4.5v2.25A2.25 2.25 0 0114.75 21h-5.5A2.25 2.25 0 017 18.75V16.5" />
    </svg>
    <span className="text-xs text-gray-500 text-center">Upload PNG/JPG TTD Kepala Desa</span>
    <input
      id="ttd_kades"
      type="file"
      accept="image/png,image/jpeg"
      className="hidden"
      onChange={(e) => {
        setUpdateTtdKepala(e.target.files?.[0] || null);
        setErrorsKepala((p: any) => ({ ...p, ttd_kades: undefined }));
      }}
    />
  </label>

  {/* Preview Tanda Tangan dengan Checkerboard Background */}
  {updateTtdKepala && (
    <div className="mt-3 p-3 border rounded-xl bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center">
      <div className="flex justify-between w-full mb-2 px-1">
        <p className="text-[10px] text-gray-500 font-medium">Preview Tanda Tangan:</p>
        <p className="text-[10px] text-green-600 font-bold">✅ {updateTtdKepala.name}</p>
      </div>

      {/* Container dengan pola kotak-kotak (Checkerboard) */}
      <div 
        className="relative w-full flex justify-center p-4 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden"
        style={{
          backgroundColor: '#ffffff',
          backgroundImage: 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }}
      >
        <img 
          src={URL.createObjectURL(updateTtdKepala)} 
          alt="Preview TTD Kades" 
          className="h-24 object-contain relative z-10" 
        />
      </div>
      <p className="mt-2 text-[9px] text-gray-400 italic text-center">
        *Pastikan pola kotak-kotak terlihat di sela tanda tangan (artinya transparan).
      </p>
    </div>
  )}

  {errorsKepala.ttd_kades && (
    <p className="text-xs text-red-600 mt-1">
      {errorsKepala.ttd_kades}
    </p>
  )}
</div>

    {/* ================= ACTION BUTTONS ================= */}
    <div className="flex justify-end gap-3 border-t pt-5">
      <button
        type="button"
        className="px-5 py-2 text-sm border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
        onClick={() => setModalUpdateKepalaOpen(false)}
      >
        Kembali
      </button>
      <button
        type="button"
        onClick={handleUpdateKepala}
        className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-sm transition"
      >
        Validasi Selesai
      </button>
    </div>
  </div>
</Modal>
    </>
  );
}
