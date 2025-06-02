import Logo from "./Logo/Logo";
import Menu from "./Menu/Menu";
import Perfil from "./Perfil/Perfil";

export default function Header() {
  return (
    <div className="bg-[#132536] flex justify-between items-center px-16 py-5 fixed w-full z-[1001]">
        <div>
            <Logo />
        </div>
        <div className="flex gap-15">
            <Menu />
            <Perfil />
        </div>
    </div>
  );
}