import { Link } from "react-router-dom";

export default function DashboardMasyarakat() {
  const user = localStorage.getItem("user");
  const nama = user ? JSON.parse(user)?.nama : "Masyarakat";

  return (
    <div className="p-4 md:p-6 space-y-8">
      
      {/* ======================== HERO SECTION (SOFT BLUE THEME) ======================== */}
      {/* Background menggunakan #ECF3FF dan teks menggunakan #465FFF */}
      <div className="relative overflow-hidden rounded-[32px] bg-[#ECF3FF] p-8 md:p-12 dark:bg-white/[0.03] border border-white/50">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left space-y-4 max-w-lg">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#465FFF] leading-tight">
              Selamat Datang, <br />
              <span className="text-gray-800 dark:text-white">{nama}</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              Nikmati kemudahan layanan administrasi desa yang lebih modern, cepat, dan transparan langsung dari perangkat Anda.
            </p>
            <div className="pt-2">
              <Link
                to="/tables-sktm"
                className="inline-flex items-center px-8 py-3.5 bg-[#465FFF] text-white font-bold rounded-2xl hover:bg-[#3549d1] transition-all active:scale-95 shadow-lg shadow-[#465FFF]/20"
              >
                Mulai Ajukan Layanan
              </Link>
            </div>
          </div>

          {/* GAMBAR ANIMASI 3D OPSI 1 */}
          <div className="w-full max-w-[300px] md:max-w-[380px] drop-shadow-2xl animate-float">
            <img 
              src="/images/grid-image/hero_masyarakat.png" 
              alt="Digital Village Illustration" 
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Dekorasi halus */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#465FFF]/5 rounded-full blur-3xl"></div>
      </div>

      {/* ======================== QUICK ACTION CARDS (SVG INLINE) ======================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* CARD 1: AJUKAN SURAT */}
        <div className="group rounded-3xl border border-gray-100 bg-white p-7 dark:border-gray-800 dark:bg-white/[0.03] transition-all hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-none hover:-translate-y-1">
          <div className="flex items-center justify-center w-14 h-14 bg-[#ECF3FF] rounded-2xl mb-6 group-hover:scale-110 transition-transform">
            {/* SVG Plus / Document */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#465FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
          </div>
          <h4 className="text-xl font-bold text-gray-800 dark:text-white">Ajukan Surat</h4>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Buat permohonan SKTM, SKU, SKBM, dan surat keterangan lainnya secara mandiri dan cepat.
          </p>
        </div>

        {/* CARD 2: STATUS PERMOHONAN */}
        <div className="group rounded-3xl border border-gray-100 bg-white p-7 dark:border-gray-800 dark:bg-white/[0.03] transition-all hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-none hover:-translate-y-1">
          <div className="flex items-center justify-center w-14 h-14 bg-amber-50 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
            {/* SVG Search / File */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <h4 className="text-xl font-bold text-gray-800 dark:text-white">Status Layanan</h4>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Pantau progres verifikasi dan tanda tangan elektronik permohonan surat Anda secara real-time.
          </p>
        </div>

        {/* CARD 3: DATA PRIBADI */}
        <div className="group rounded-3xl border border-gray-100 bg-white p-7 dark:border-gray-800 dark:bg-white/[0.03] transition-all hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-none hover:-translate-y-1">
          <div className="flex items-center justify-center w-14 h-14 bg-green-50 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
            {/* SVG User */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h4 className="text-xl font-bold text-gray-800 dark:text-white">Data Profil</h4>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Lengkapi profil dan dokumen kependudukan (KTP/KK) untuk mempermudah verifikasi data.
          </p>
        </div>

      </div>

      {/* ======================== FOOTER HELP ======================== */}
     <div className="rounded-3xl bg-white p-6 border border-gray-100 dark:bg-white/[0.02] dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
  <div className="flex items-center gap-4 text-center sm:text-left">
    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400">
      Ada kendala? Hubungi petugas desa melalui layanan pengaduan atau datang ke Balai Desa.
    </p>
  </div>

  {/* PERUBAHAN DISINI: Button diubah menjadi tag <a> */}
  <a 
    href="https://wa.me/6281234567890?text=Halo%20Admin%20Desa%2C%20saya%20(Nama Anda).%20Saya%20butuh%20bantuan%20terkait%20layanan%20digital%20desa." 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-sm font-bold text-[#465FFF] hover:underline whitespace-nowrap px-4 py-2 rounded-lg hover:bg-[#ECF3FF] transition-colors"
  >
    Pusat Bantuan & Panduan
  </a>
</div>

    </div>
  );
}