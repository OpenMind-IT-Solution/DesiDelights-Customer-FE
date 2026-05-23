import { Suspense } from "react";
import MenuPageContent from "@/components/MenuPage/MenuPageContent";

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] w-full flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-gray-500 tracking-wider">
            Loading menu categories...
          </span>
        </div>
      }
    >
      <MenuPageContent />
    </Suspense>
  );
}
