export default function NotFound() {
  return (
    <div className="flex min-h-full items-center justify-center bg-base-white-2">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-medium">404</h1>
        <div className="h-6 w-px bg-gray-300" />
        <p className="text-sm">This page could not be found.</p>
      </div>
    </div>
  );
}
