export default function LoadingView() {
  return (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="w-16 h-16 border-8 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium">Loading...</p>
        </div>
  )
}
