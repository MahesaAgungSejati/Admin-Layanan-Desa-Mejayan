import { useEffect, useState } from "react";
import axios from "axios";
import Badge from "../ui/badge/Badge";

interface DashboardCount {
  users: {
    kepala_desa: number;
    perangkat_desa: number;
    rt: number;
  };
  masyarakat: number;
  sktm: number;
  sku: number;
  skbm: number;
  skj: number;
  skitt: number;
  skp: number;
  skck: number;
}

export default function DashboardAdmin() {
  const [data, setData] = useState<DashboardCount>({
    users: { kepala_desa: 0, perangkat_desa: 0, rt: 0 },
    masyarakat: 0,
    sktm: 0,
    sku: 0,
    skbm: 0,
    skj: 0,
    skitt: 0,
    skp: 0,
    skck: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const [
          users, masyarakat, sktm, sku, skbm, skj, skitt, skp, skck,
        ] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/dashboard/users/count", { headers }),
          axios.get("http://127.0.0.1:8000/api/dashboard/masyarakat/count", { headers }),
          axios.get("http://127.0.0.1:8000/api/dashboard/surat/sktm/count", { headers }),
          axios.get("http://127.0.0.1:8000/api/dashboard/surat/sku/count", { headers }),
          axios.get("http://127.0.0.1:8000/api/dashboard/surat/skbm/count", { headers }),
          axios.get("http://127.0.0.1:8000/api/dashboard/surat/skj/count", { headers }),
          axios.get("http://127.0.0.1:8000/api/dashboard/surat/skitt/count", { headers }),
          axios.get("http://127.0.0.1:8000/api/dashboard/surat/skp/count", { headers }),
          axios.get("http://127.0.0.1:8000/api/dashboard/surat/skck/count", { headers }),
        ]);

        // FUNGSI DATA TETAP (Sesuai script lama Anda)
        setData({
          users: users.data.data,
          masyarakat: masyarakat.data.data?.total_masyarakat ?? masyarakat.data.data?.total ?? masyarakat.data.total ?? 0,
          sktm: sktm.data.data?.total_sktm ?? sktm.data.data?.total ?? sktm.data.total ?? 0,
          sku: sku.data.data?.total_sku ?? sku.data.data?.total ?? sktm.data.total ?? 0,
          skbm: skbm.data.data?.total_skbm ?? skbm.data.data?.total ?? skbm.data.total ?? 0,
          skj: skj.data.data?.total_skj ?? skj.data.data?.total ?? skj.data.total ?? 0,
          skitt: skitt.data.data?.total_skitt ?? skitt.data.data?.total ?? skitt.data.total ?? 0,
          skp: skp.data.data?.total_skp ?? skp.data.data?.total ?? skp.data.total ?? 0,
          skck: skck.data.data?.total_skck ?? skck.data.data?.total ?? skck.data.total ?? 0,
        });
      } catch (e) {
        console.error("Dashboard error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="p-6 text-gray-500">Memuat dashboard...</p>;

  // ✅ Komponen Card dengan SVG Inline
  const CustomCard = ({ title, value, svgIcon, colorClass }: any) => (
    <div className="group rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 transition-all hover:shadow-lg">
      <div className={`flex items-center justify-center w-12 h-12 rounded-xl mb-5 transition-transform group-hover:scale-110 ${colorClass}`}>
        {svgIcon}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
          <h4 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            {value.toLocaleString()}
          </h4>
        </div>
        <Badge color="success">
          {/* SVG Arrow Up Inline */}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
          Live
        </Badge>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-10">
      {/* HEADER SECTION */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white/90">Statistik Data Desa</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Ringkasan jumlah akun dan layanan permohonan surat.</p>
      </div>

      {/* SECTION 1: MANAJEMEN AKUN */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-l-4 border-[#465FFF] pl-4">
          <h4 className="text-lg font-bold text-gray-700 dark:text-white/80">Manajemen Akun</h4>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          <CustomCard 
            title="Kepala Desa" 
            value={data.users.kepala_desa} 
            colorClass="bg-[#ECF3FF] text-[#465FFF]" 
            svgIcon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
          />
          <CustomCard 
            title="Perangkat Desa" 
            value={data.users.perangkat_desa} 
            colorClass="bg-indigo-50 text-indigo-600" 
            svgIcon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
          />
          <CustomCard 
            title="Ketua RT" 
            value={data.users.rt} 
            colorClass="bg-purple-50 text-purple-600" 
            svgIcon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>}
          />
          <CustomCard 
            title="Masyarakat" 
            value={data.masyarakat} 
            colorClass="bg-teal-50 text-teal-600" 
            svgIcon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
          />
        </div>
      </div>

      {/* SECTION 2: LAYANAN SURAT */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-l-4 border-amber-500 pl-4">
          <h4 className="text-lg font-bold text-gray-700 dark:text-white/80">Layanan Surat</h4>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {/* SKTM */}
          <CustomCard 
            title="Surat Keterangan Tidak Mampu" 
            value={data.sktm} 
            colorClass="bg-orange-50 text-orange-600" 
            svgIcon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>}
          />
          {/* SKU */}
          <CustomCard 
            title="Surat Keterangan Usaha" 
            value={data.sku} 
            colorClass="bg-amber-50 text-amber-600" 
            svgIcon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>}
          />
          {/* SKBM */}
          <CustomCard 
            title="Surat Keterangan Belum Menikah" 
            value={data.skbm} 
            colorClass="bg-rose-50 text-rose-600" 
            svgIcon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>}
          />
          {/* SKJ */}
          <CustomCard 
            title="Surat Keterangan Janda" 
            value={data.skj} 
            colorClass="bg-pink-50 text-pink-600" 
            svgIcon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>}
          />
          {/* SKITT */}
          <CustomCard 
            title="Surat Keterangan Imunisasi TT" 
            value={data.skitt} 
            colorClass="bg-cyan-50 text-cyan-600" 
            svgIcon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>}
          />
          {/* SKP */}
          <CustomCard 
            title="Surat Keterangan Penduduk" 
            value={data.skp} 
            colorClass="bg-emerald-50 text-emerald-600" 
            svgIcon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>}
          />
          {/* SKCK */}
          <CustomCard 
            title="Surat Permohonan Ajuan SKCK" 
            value={data.skck} 
            colorClass="bg-sky-50 text-sky-600" 
            svgIcon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>}
          />
        </div>
      </div>
    </div>
  );
}