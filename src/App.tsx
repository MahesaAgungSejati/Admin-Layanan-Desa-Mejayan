import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import SignInUsers from "./pages/AuthPages/SignInUsers";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTablesSKCK from "./pages/Tables/BasicTablesSKCK";
import BasicTablesSKITT from "./pages/Tables/BasicTablesSKITT";
import BasicTablesSKJ from "./pages/Tables/BasicTablesSKJ";
import BasicTablesSKU from "./pages/Tables/BasicTablesSKU";
import BasicTablesSKTM from "./pages/Tables/BasicTablesSKTM";
import BasicTablesSKBM from "./pages/Tables/BasicTablesSKBM";
import BasicTablesSKP from "./pages/Tables/BasicTablesSKP";
import TableDataMasyarakats from "./pages/Tables/TableDataMasyarakats";
import TableDataBeritas from "./pages/Tables/TableDataBeritas";
import TableDataStatistiks from "./pages/Tables/TableDataStatistiks";
import TableDataLaporans from "./pages/Tables/TableDataLaporans";
import TablesDataKetuaRT from "./pages/Tables/TablesDataKetuaRT";
import TablesDataPerangkatDesa from "./pages/Tables/TablesDataPerangkatDesa";
import TablesDataKepalaDesa from "./pages/Tables/TablesDataKepalaDesa";
import TablesDataSuperAdmin from "./pages/Tables/TablesDataSuperAdmin";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ProtectedRoute from "./components/auth/ProtectedRoute"; // ← tambahkan ini


import Unauthorized from "./pages/OtherPage/NotFound";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>

        {/* ===================== Protected Routes ===================== */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["masyarakat", "super_admin", "kepala_desa", "perangkat_desa", "rt"]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >

          <Route index element={<Home />} />
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/calendar" element={<Calendar />} />
         

          {/* ===== Layanan Desa (role: perangkat_desa, rt) ===== */}
          {/* <Route
            path="/form-sktm"
            element={
              <ProtectedRoute allowedRoles={["masyarakat", "super_admin", "kepala_desa", "perangkat_desa", "rt"]}>
                <FormElementsSKTM />
              </ProtectedRoute>
            }
          />

          <Route
            path="/form-skck"
            element={
              <ProtectedRoute allowedRoles={["masyarakat", "super_admin", "kepala_desa", "perangkat_desa", "rt"]}>
                <FormElementsSKCK />
              </ProtectedRoute>
            }
          />

          <Route
            path="/form-skbm"
            element={
              <ProtectedRoute allowedRoles={["masyarakat", "super_admin", "kepala_desa", "perangkat_desa", "rt"]}>
                <FormElementsSKBM />
              </ProtectedRoute>
            }
          />

          <Route
            path="/form-sku"
            element={
              <ProtectedRoute allowedRoles={["masyarakat", "super_admin", "kepala_desa", "perangkat_desa", "rt"]}>
                <FormElementsSKU />
              </ProtectedRoute>
            }
          /> */}

          <Route
            path="/tables-super-admin"
            element={
              <ProtectedRoute allowedRoles={["super_admin"]}>
                <TablesDataSuperAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tables-kepala-desa"
            element={
              <ProtectedRoute allowedRoles={["super_admin","perangkat_desa"]}>
                <TablesDataKepalaDesa />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tables-perangkat-desa"
            element={
              <ProtectedRoute allowedRoles={["super_admin","perangkat_desa"]}>
                <TablesDataPerangkatDesa />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tables-ketua-rt"
            element={
              <ProtectedRoute allowedRoles={["super_admin","perangkat_desa"]}>
                <TablesDataKetuaRT />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tables-sktm"
            element={
              <ProtectedRoute allowedRoles={["masyarakat", "super_admin", "kepala_desa", "perangkat_desa", "rt"]}>
                <BasicTablesSKTM />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tables-skck"
            element={
              <ProtectedRoute allowedRoles={["masyarakat", "super_admin", "kepala_desa", "perangkat_desa", "rt"]}>
                <BasicTablesSKCK />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tables-skbm"
            element={
              <ProtectedRoute allowedRoles={["masyarakat", "super_admin", "kepala_desa", "perangkat_desa", "rt"]}>
                <BasicTablesSKBM />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tables-skp"
            element={
              <ProtectedRoute allowedRoles={["masyarakat", "super_admin", "kepala_desa", "perangkat_desa", "rt"]}>
                <BasicTablesSKP />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tables-skj"
            element={
              <ProtectedRoute allowedRoles={["masyarakat", "super_admin", "kepala_desa", "perangkat_desa", "rt"]}>
                <BasicTablesSKJ />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tables-sku"
            element={
              <ProtectedRoute allowedRoles={["masyarakat", "super_admin", "kepala_desa", "perangkat_desa", "rt"]}>
                <BasicTablesSKU />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tables-skitt"
            element={
              <ProtectedRoute allowedRoles={["masyarakat", "super_admin", "kepala_desa", "perangkat_desa", "rt"]}>
                <BasicTablesSKITT />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tables-data-masyarakat"
            element={
              <ProtectedRoute allowedRoles={["super_admin", "perangkat_desa"]}>
                <TableDataMasyarakats />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tables-data-berita"
            element={
              <ProtectedRoute allowedRoles={["super_admin", "perangkat_desa"]}>
                <TableDataBeritas />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tables-data-statistik"
            element={
              <ProtectedRoute allowedRoles={["super_admin", "perangkat_desa"]}>
                <TableDataStatistiks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tables-data-laporan"
            element={
              <ProtectedRoute allowedRoles={["super_admin", "perangkat_desa"]}>
                <TableDataLaporans />
              </ProtectedRoute>
            }
          />

          <Route
            path="/blank"
            element={
              <ProtectedRoute allowedRoles={["super_admin", "perangkat_desa"]}>
                <Blank />
              </ProtectedRoute>
            }
          />
          

          {/* ===== Other Pages ===== */}
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />
        </Route>

        {/* ===================== Auth Routes ===================== */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin/users" element={<SignInUsers />} />

        {/* Unauthorized Page */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Fallback 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}