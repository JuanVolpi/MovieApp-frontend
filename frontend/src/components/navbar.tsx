import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import ThemeSwitch from "./switch/ThemeSwitch";

export const MovieLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function CustomNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Simples simulação — pode integrar com auth depois
    alert("Logout feito!");
    navigate("/login");
  };

  return (
    <Navbar shouldHideOnScroll isBordered maxWidth="xl">
      {/* Logo à esquerda */}
      <NavbarBrand as={Link} href="/filmes">
        <MovieLogo />
        <p className="font-bold text-inherit ml-2">MovieApp</p>
      </NavbarBrand>

      {/* Menu central */}
      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/comunidade">
            Comunidade
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/minha-lista">
            Minha Lista
          </Link>
        </NavbarItem>
      </NavbarContent>

      {/* Menu à direita */}
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="/perfil">Perfil</Link>
        </NavbarItem>
        <NavbarItem>
        <ThemeSwitch></ThemeSwitch>
        </NavbarItem>
        <NavbarItem>
          <Button color="danger" variant="flat" onClick={handleLogout}>
            Logout
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
