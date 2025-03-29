"use client";

import { deleteLogin, getLogin } from "@/app/actions/cookies";
import Button from "@/components/Button";
import AuthService from "@/services/auth";
import React, { useEffect } from "react";
import styles from "./styles.module.css";
import { TUser } from "@/types/user";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [login, setLogin] = React.useState<TUser | null>(null);

  const onLogout = async () => {
    await AuthService.logout();
    setLogin(null);
    await deleteLogin();
    router.push("/login");
  };

  useEffect(() => {
    (async function () {
      const userdata = await getLogin();
      if (!userdata) router.push("/login");
      setLogin(userdata);
    })();
  }, [router]);

  return (
    <div className={styles.navbar}>
      <Link href={"/"} className={styles.logo} aria-label="Return to dashboard">
        <Logo multiplier={36} />
      </Link>
      <div className={styles.links}>
        <p>Hello, {login ? login.username || "-" : null}!</p>

        {pathname !== "/edit/users" && login?.role === "admin" ? (
          <Link
            className={"loClick"}
            href={"/edit/users"}
            aria-label="Manage users"
          >
            Users
          </Link>
        ) : null}

        <Button type="button" variant="hiClick" onClick={onLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
