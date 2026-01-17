import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import AlertCustom from "../components/ui/alert/AlertCustom";
import { useNavigate } from "react-router";


// Assume these icons are imported from an icon library
import {
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  LockIcon,
  UserCircleIcon,
  GroupIcon,
  UserIcon,
  ListIcon,
  ChatIcon,
  PageIcon,
  PieChartIcon,


  // UserCircleIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
// import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  roles?: string[];
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
  }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />, // Dashboard
    name: "Dashboard",
    roles: ["masyarakat", "super_admin", "kepala_desa", "perangkat_desa", "rt"],
    path: "/",
  },
  {
    name: "Data Akun Super Admin",
    icon: <LockIcon />, // Melambangkan keamanan (Tersedia di list kamu)
    roles: ["super_admin"],
    path: "/tables-super-admin",
  },
  {
    name: "Data Akun Kepala Desa",
    icon: <UserIcon />, // Melambangkan pimpinan (Tersedia di list kamu)
    roles: ["super_admin", "perangkat_desa"],
    path: "/tables-kepala-desa",
  },
  {
    name: "Data Akun Perangkat Desa",
    icon: <GroupIcon />, // Melambangkan kelompok kerja (Tersedia di list kamu)
    roles: ["super_admin", "perangkat_desa"],
    path: "/tables-perangkat-desa",
  },
  {
    name: "Data Akun Ketua RT",
    icon: <GroupIcon />, // Melambangkan akun individu (Tersedia di list kamu)
    roles: ["super_admin", "perangkat_desa"],
    path: "/tables-ketua-rt",
  },
  {
    name: "Data Akun Masyarakat",
    icon: <UserCircleIcon />, // Melambangkan warga (Tersedia di list kamu)
    roles: ["super_admin", "perangkat_desa"],
    path: "/tables-data-masyarakat",
  },
  {
    name: "Layanan Masyarakat",
    icon: <ListIcon />, // Melambangkan daftar layanan (Tersedia di list kamu)
    roles: ["masyarakat", "super_admin", "kepala_desa", "perangkat_desa", "rt"],
    subItems: [
      { name: "Surat Keterangan Tidak Mampu", path: "/tables-sktm", pro: false },
      { name: "Surat Keterangan Usaha", path: "/tables-sku", pro: false },
      { name: "Surat Keterangan SKCK", path: "/tables-skck", pro: false },
      { name: "Surat Keterangan Belum Menikah", path: "/tables-skbm", pro: false },
      { name: "Surat Keterangan Penduduk", path: "/tables-skp", pro: false },
      { name: "Surat Keterangan Janda", path: "/tables-skj", pro: false },
      { name: "Surat Keterangan Imunisasi TT", path: "/tables-skitt", pro: false },
    ],
  },
  {
    name: "Data Berita",
    icon: <PageIcon />, // Melambangkan dokumen/konten (Tersedia di list kamu)
    roles: ["super_admin", "perangkat_desa"],
    path: "/tables-data-berita",
  },
  {
    name: "Data Statistik",
    icon: <PieChartIcon />, // Melambangkan grafik (Tersedia di list kamu)
    roles: ["super_admin", "perangkat_desa"],
    path: "/tables-data-statistik",
  },
  {
    name: "Data Laporan Masyarakat",
    icon: <ChatIcon />, // Melambangkan aduan/obrolan (Tersedia di list kamu)
    roles: ["super_admin", "perangkat_desa"],
    path: "/tables-data-laporan",
  },
];

// const othersItems: NavItem[] = [
//   {
//     icon: <PieChartIcon />,
//     name: "Charts",
//     roles: ["super_admin"],
//     subItems: [
//       { name: "Line Chart", path: "/line-chart", pro: false },
//       { name: "Bar Chart", path: "/bar-chart", pro: false },
//     ],
//   },
//   {
//     icon: <BoxCubeIcon />,
//     name: "UI Elements",
//     roles: ["super_admin"],
//     subItems: [
//       { name: "Alerts", path: "/alerts", pro: false },
//       { name: "Avatar", path: "/avatars", pro: false },
//       { name: "Badge", path: "/badge", pro: false },
//       { name: "Buttons", path: "/buttons", pro: false },
//       { name: "Images", path: "/images", pro: false },
//       { name: "Videos", path: "/videos", pro: false },
//     ],
//   },
//   {
//     icon: <PlugInIcon />,
//     name: "Authentication",
//     roles: ["super_admin"],
//     subItems: [
//       { name: "Sign In", path: "/signin", pro: false },
//       { name: "Sign Up", path: "/signup", pro: false },
//     ],
//   },
// ];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const location = useLocation();

  const canAccessLayanan = () => {
  const userRaw = localStorage.getItem("user");
  const userType = localStorage.getItem("user_type");

  if (!userRaw) return false;

  const user = JSON.parse(userRaw);

  // hanya masyarakat yang dibatasi
  if (userType === "masyarakat") {
    return user.status_verifikasi === "disetujui";
  }

  return true;
};



  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  

  // useEffect(() => {
  //   let submenuMatched = false;
  //   ["main", "others"].forEach((menuType) => {
  //     const items = menuType === "main" ? navItems : othersItems;
  //     items.forEach((nav, index) => {
  //       if (nav.subItems) {
  //         nav.subItems.forEach((subItem) => {
  //           if (isActive(subItem.path)) {
  //             setOpenSubmenu({
  //               type: menuType as "main" | "others",
  //               index,
  //             });
  //             submenuMatched = true;
  //           }
  //         });
  //       }
  //     });
  //   });

  //   if (!submenuMatched) {
  //     setOpenSubmenu(null);
  //   }
  // }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };
  

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => {
  const userRole = localStorage.getItem("user_type");


  // 🔥 FILTER MENU berdasarkan role
  const filteredItems = items.filter(
    (nav) =>
      !nav.roles || // jika menu tidak punya roles → semua bisa lihat
      nav.roles.includes(userRole || "") // jika roles berisi role user
  );

  return (
    <ul className="flex flex-col gap-4">
      {filteredItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
          <button
  onClick={() => {
    if (nav.name === "Layanan Masyarakat" && !canAccessLayanan()) {
      setShowAlert(true);
      return;
    }
    handleSubmenuToggle(index, menuType);
  }}
  className={`menu-item group ${
    openSubmenu?.type === menuType && openSubmenu?.index === index
      ? "menu-item-active"
      : "menu-item-inactive"
  }`}
>


              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}

          {/* SUBMENU */}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType &&
                  openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
  <button
  onClick={() => {
    if (nav.name === "Layanan Masyarakat" && !canAccessLayanan()) {
      setShowAlert(true);
      return;
    }
    navigate(subItem.path);
  }}
  className={`menu-dropdown-item w-full text-left ${
    isActive(subItem.path)
      ? "menu-dropdown-item-active"
      : "menu-dropdown-item-inactive"
  }`}
>

    {subItem.name}
    <span className="flex items-center gap-1 ml-auto">
      {subItem.new && (
        <span
          className={`ml-auto ${
            isActive(subItem.path)
              ? "menu-dropdown-badge-active"
              : "menu-dropdown-badge-inactive"
          } menu-dropdown-badge`}
        >
          new
        </span>
      )}
      {subItem.pro && (
        <span
          className={`ml-auto ${
            isActive(subItem.path)
              ? "menu-dropdown-badge-active"
              : "menu-dropdown-badge-inactive"
          } menu-dropdown-badge`}
        >
          pro
        </span>
      )}
    </span>
  </button>
</li>

                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

  return (
      <>
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={200}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={200}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={35}
              height={35}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  ""
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {/* {renderMenuItems(othersItems, "others")} */}
            </div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen }
      </div>
    </aside>
      <AlertCustom
      isOpen={showAlert}
      onClose={() => {
        setShowAlert(false);
        navigate("/profile");
      }}
      variant="warning"
      title="Akses Dibatasi"
      message="Silakan lengkapi dan verifikasi data diri Anda terlebih dahulu sebelum mengakses layanan masyarakat."
      btnText="Baik, Saya Mengerti"
    />
  </>
);
  
};

export default AppSidebar;
