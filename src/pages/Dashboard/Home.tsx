import { useEffect, useState } from "react";
import DashboardAdmin from "../../components/ecommerce/DashboardAdmin";
import DashboardMasyarakat from "../../components/ecommerce/DashboardMasyarakat";
import PageMeta from "../../components/common/PageMeta";

type Role =
  | "super_admin"
  | "kepala_desa"
  | "perangkat_desa"
  | "rt"
  | "masyarakat"
  | null;

export default function Home() {
  const [role, setRole] = useState<Role>(null);

  useEffect(() => {
    // 🔹 PRIORITAS 1: user_type
    const userType = localStorage.getItem("user_type");

    if (userType) {
      setRole(userType as Role);
      return;
    }

    // 🔹 FALLBACK: dari object user
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setRole(parsed.role as Role);
      } catch (e) {
        console.error("Gagal parse user", e);
        setRole(null);
      }
    }
  }, []);

  const isAdmin =
    role === "super_admin" ||
    role === "kepala_desa" ||
    role === "perangkat_desa" ||
    role === "rt";

  const isMasyarakat = role === "masyarakat";

  // ⏳ loading state
  if (!role) {
    return <p>Memuat dashboard...</p>;
  }

  return (
    <>
      <PageMeta
        title={
          isAdmin
            ? "Dashboard Admin | Desa Digital"
            : "Dashboard Masyarakat | Desa Digital"
        }
        description="Halaman utama dashboard Desa Digital."
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6">
          {isAdmin && <DashboardAdmin />}
          {isMasyarakat && <DashboardMasyarakat />}
        </div>
      </div>
    </>
  );
}
