import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import TableDataLaporan from "../../components/tables/BasicTables/TableDataLaporan";

export default function BasicTables() {
  return (
    <>
       <PageMeta
        title="Data Laporan Masyarakat"
        description="Kelola data laporan masyarakat"
      />
      <PageBreadcrumb pageTitle="Data Laporan Masyarakat" />
      <div className="space-y-6">
        <ComponentCard>
           <div className="flex flex-col gap-5 mb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-medium text-gray-800 dark:text-white/90">
                Tabel Data Laporan Masyarakat
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Kelola dan beri tindakan pada laporan masyarakat desa mejayan.
              </p>
            </div>
            </div>

          <TableDataLaporan />
        </ComponentCard>
      </div>
    </>
  );
}
