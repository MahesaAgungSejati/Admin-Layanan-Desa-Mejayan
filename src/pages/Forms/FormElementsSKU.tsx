import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import InputSKU from "../../components/form/form-elements/form-layanan/InputSKU";
import DropzoneSKU from "../../components/form/form-elements/form-layanan/DropZoneSKU";
import PageMeta from "../../components/common/PageMeta";

export default function FormElements() {
  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Layanan Ajuan Surat Keterangan Usaha" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <InputSKU />
        </div>
        <div className="space-y-6">
          <DropzoneSKU />
        </div>
      </div>
    </div>
  );
}
