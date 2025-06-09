import Logo from "./Logo/Logo";
import Menu from "./Menu/Menu";
import Perfil from "./Perfil/Perfil";

export default function Header() {
  return (
    <header className="header">
      <div className="bg-[#132536] flex sm:flex-row justify-between items-center px-4 sm:px-16 py-5 sticky top-0 w-full z-[1001] border-solid border-b-2 border-b-amber-300 gap-4">
        <div>
          <Logo />
        </div>
        <div className="flex flex-row-reverse sm:flex-row gap-4 sm:gap-15 items-center w-full lg:justify-end">
          <Menu />
          <Perfil />
        </div>
      </div>
    </header>
  );
}