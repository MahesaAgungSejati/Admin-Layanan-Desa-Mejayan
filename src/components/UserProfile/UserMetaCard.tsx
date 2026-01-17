import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import axios from "axios";

export default function UserMetaCard() {
  const { user } = useAuth();
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Ambil role dari localStorage
  const userType = localStorage.getItem("user_type");

  // Tentukan apakah login adalah user (bukan masyarakat)
  const isUserRole = ["super_admin", "kepala_desa", "perangkat_desa", "rt"].includes(
    userType || ""
  );

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");

    const fetchDetail = async () => {
      try {
        let url = "";

        if (isUserRole) {
          // API untuk admin, kepala desa, perangkat, RT
          url = `http://127.0.0.1:8000/api/users/detail/${user.id}`;
        } else {
          // API untuk masyarakat
          url = `http://127.0.0.1:8000/api/masyarakat/profile/${user.id}`;
        }

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Data profil
        setDetail(res.data.data);
      } catch (err) {
        console.error("Gagal memuat profil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [user, isUserRole]);

  if (!user || loading) {
    return (
      <div className="p-5 border rounded-2xl">
        <p>Memuat profil...</p>
      </div>
    );
  }

   return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        
        {/* FOTO USER */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
            <img
              src={
                detail?.foto_profil
                  ? detail.foto_profil
                  : "/images/user/owner.jpg"
              }
              alt="user"
              className="object-cover w-full h-full"
            />
          </div>

          {/* NAMA USER */}
          <div>
            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
              Nama Pengguna
            </p>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              {detail?.nama || user?.nama}
            </h4>
          </div>
        </div>

      </div>
    </div>
  );
}