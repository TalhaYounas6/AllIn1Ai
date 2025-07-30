import { assets } from "../assets/assets";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-around w-full py-16 text-sm bg-slate-50 text-gray-800/70">
      <img src={assets.logo} />
      <p className="mt-4 text-center">
        Your One Stop Solution To Everything AI.
      </p>
    </footer>
  );
}
