interface TwoColumnImageGridDynamicProps {
  image1: string;
  image2: string;
}

export default function TwoColumnImageGridDynamic({
  image1,
  image2,
}: TwoColumnImageGridDynamicProps) {
  const renderFile = (fileUrl: string, label: string) => {
    if (!fileUrl) return null;

    const isPDF = fileUrl.toLowerCase().endsWith(".pdf");

    return (
      <div className="border border-gray-200 rounded-xl dark:border-gray-800 p-3 flex flex-col items-center text-center">

        {/* Jika PDF */}
        {isPDF ? (
          <>
            <div className="w-full flex flex-col items-center py-6">
              {/* Icon PDF */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-14 w-14 text-blue-600"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM13 9V3.5L18.5 9H13z" />
              </svg>
              <p className="text-sm mt-2 font-medium">{label} (PDF)</p>

              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm"
              >
                Lihat Dokumen
              </a>
            </div>
          </>
        ) : (
          // Jika gambar
          <img
            src={fileUrl}
            alt={label}
            className="rounded-lg object-cover w-full"
          />
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {renderFile(image1, "File KTP")}
      {renderFile(image2, "File KK")}
    </div>
  );
}
