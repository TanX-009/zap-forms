"use client";

import { deleteLogin } from "@/app/actions/cookies";
import Button from "@/components/Button";
import AuthService from "@/services/auth";
import React, { useContext } from "react";
import styles from "./styles.module.css";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { LoginContext } from "@/systems/LoginContext";
import { FaUser } from "react-icons/fa";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useContext(LoginContext);

  const onLogout = async () => {
    await AuthService.logout();
    setUser(null);
    await deleteLogin();
    router.push("/login");
  };

  return (
    <div className={styles.navbar}>
      <Link href={"/"} className={styles.logo} aria-label="Return to dashboard">
        <Logo multiplier={36} />
      </Link>
      <div className={styles.links}>
        <p>Hello, {user ? user.username || "-" : null}!</p>

        {pathname !== "/edit/users" && user?.role === "admin" ? (
          <Link
            className={"loClick"}
            href={"/edit/users"}
            aria-label="Manage users"
          >
            <FaUser />
          </Link>
        ) : null}

        <Button type="button" variant="hiClick" onClick={onLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
