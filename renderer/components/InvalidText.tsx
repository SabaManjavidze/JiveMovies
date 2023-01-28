export default function InvalidText({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <span className="absolute top-0 flex items-center whitespace-nowrap text-sm text-red-500">
      {message !== "" ? (
        <div className="mr-5 h-[5px] w-[5px] rounded-full bg-red-500"></div>
      ) : null}
      {message}
    </span>
  );
}
