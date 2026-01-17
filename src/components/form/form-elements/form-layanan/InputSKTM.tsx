import { useEffect, useState } from "react";
import axios from "axios";
import ComponentCard from "../../../common/ComponentCard.tsx";
import Label from "../../Label";
import Input from "../../input/InputField";
import Select from "../../Select";
import Textarea from "../../input/TextArea.tsx";
import Button from "../../../ui/button/Button.tsx";

export default function InputSKTM() {

  // ambil user dari localStorage
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const masyarakat_id = userData.id;
  const [rtOptions, setRtOptions] = useState([]);


  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    nama: "",
    jenis_kelamin: "",
    ttl: "",
    agama: "",
    pekerjaan: "",
    nik: "",
    alamat: "",
    rt_id: "",
    status_perkawinan: "",
    alasan: "",
  });

  // ----------------------
  // HANDLER
  // ----------------------

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelect = (name: string, value: any) => {
  // Jika value adalah object Select2 { label, value }
  const finalValue = typeof value === "object" ? value.value : value;

  setFormData({ ...formData, [name]: finalValue });
};


useEffect(() => {
  const fetchRT = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/masyarakat/getRT/my",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = res.data.data || [];

      // Mapping agar kompatibel dengan komponen Select
      const formatted = data.map((rt: any) => ({
        value: rt.id,
        label: rt.nama, // atau `rt.nama_rt` kalau beda field
      }));

      setRtOptions(formatted);

    } catch (error) {
      console.log("Gagal mengambil data RT:", error);
    }
  };

  fetchRT();
}, [token]);


  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/sktm/",
        {
          masyarakat_id: masyarakat_id,
          ...formData,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Pengajuan SKTM berhasil!");
      console.log(res.data);

    } catch (error: any) {
      console.log("FULL ERROR :", error.response?.data);
      alert("Gagal mengajukan SKTM");
    }
  };

  return (
    <ComponentCard>
      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <Label>Nama Lengkap</Label>
          <Input
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            placeholder="Masukkan nama"
          />
        </div>

        <div>
          <Label>Jenis Kelamin</Label>
          <Select
            options={[
              { value: "Laki-laki", label: "Laki-laki" },
              { value: "Perempuan", label: "Perempuan" },
            ]}
            onChange={(val) => handleSelect("jenis_kelamin", val)}
            placeholder="Pilih jenis kelamin"
          />
        </div>

        <div>
          <Label>Tempat, Tanggal Lahir</Label>
          <Input
            name="ttl"
            value={formData.ttl}
            onChange={handleChange}
            placeholder="Contoh: Madiun, 1 Januari 1999"
          />
        </div>

        <div>
          <Label>Agama</Label>
          <Select
            options={[
              { value: "Islam", label: "Islam" },
              { value: "Kristen", label: "Kristen" },
              { value: "Katolik", label: "Katolik" },
              { value: "Hindu", label: "Hindu" },
              { value: "Buddha", label: "Buddha" },
            ]}
            onChange={(val) => handleSelect("agama", val)}
            placeholder="Pilih agama"
          />
        </div>

        <div>
          <Label>Pekerjaan</Label>
          <Input
            name="pekerjaan"
            value={formData.pekerjaan}
            onChange={handleChange}
            placeholder="Masukkan pekerjaan"
          />
        </div>

        <div>
          <Label>NIK</Label>
          <Input
            name="nik"
            value={formData.nik}
            onChange={handleChange}
            placeholder="Masukkan NIK Anda"
          />
        </div>

        <div>
          <Label>Alamat</Label>
          <Input
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
            placeholder="Masukkan alamat lengkap"
          />
        </div>

        <div>
          <Label>Pilih RT</Label>
         <Select
          options={rtOptions}
          onChange={(val) => handleSelect("rt_id", val)}
          placeholder="Pilih RT"
        />
        </div>

        <div>
          <Label>Status Perkawinan</Label>
          <Select
            options={[
              { value: "Single", label: "Single" },
              { value: "Menikah", label: "Menikah" },
              { value: "Cerai", label: "Cerai" },
            ]}
            onChange={(val) => handleSelect("status_perkawinan", val)}
            placeholder="Pilih status perkawinan"
          />
        </div>

        <div>
          <Label>Alasan Permohonan</Label>
          <Textarea
            name="alasan"
            value={formData.alasan}
            onChange={handleChange}
            placeholder="Contoh: Untuk syarat sekolah, bantuan, dll."
          />
        </div>

        <Button type="submit" variant="primary">
          Ajukan Surat
        </Button>

      </form>
    </ComponentCard>
  );
}
