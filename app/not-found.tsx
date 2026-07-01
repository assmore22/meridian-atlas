import Link from "next/link";
export const metadata = { title: "Off the map - Meridian Atlas" };
export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60svh] max-w-reading flex-col justify-center px-4 py-16 sm:px-5 md:px-8">
      <span className="label">Error 404</span>
      <h1 className="mt-2 font-head text-fluid-page font-bold">Off the map.</h1>
      <p className="mt-3 text-ink/80">No coordinate here. The observation may not exist, or the link drifted.</p>
      <Link href="/" className="mt-6 inline-flex min-h-[48px] w-fit items-center bg-meridian px-6 text-sm font-semibold text-white">Back to the atlas</Link>
    </div>
  );
}
