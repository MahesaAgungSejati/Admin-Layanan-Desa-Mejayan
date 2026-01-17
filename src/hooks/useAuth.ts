import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: number;
  nama: string;
  email: string;
  nik?: string;
  role?: string;
}

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("user_type"); // kita tambahkan ini saat login

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    // tentukan endpoint berdasarkan tipe user
    const endpoint =
      userType === "masyarakat"
        ? "http://127.0.0.1:8000/api/masyarakat/me"
        : "http://127.0.0.1:8000/api/me";

    axios
      .get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        console.error("Gagal mengambil profil:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user_type");
      })
      .finally(() => setLoading(false));
  }, [token, userType]);

  return { user, setUser, loading };
}
