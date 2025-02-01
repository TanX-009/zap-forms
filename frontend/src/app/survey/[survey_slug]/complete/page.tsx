"use client";

import Logo from "@/components/Logo";
import React, { useContext, useEffect } from "react";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import styles from "./styles.module.css";
import { SurveyContext } from "../../components/SurveyContext";
import { usePathname, useRouter } from "next/navigation";
import getOneNestBack from "@/systems/getOneNestBack";

export default function Complete() {
  const router = useRouter();
  const pathname = usePathname();
  const { complete } = useContext(SurveyContext);
  useEffect(() => {
    if (!complete) {
      router.push(getOneNestBack(pathname));
    }
  }, [complete, pathname, router]);
  return (
    <div className={styles.complete}>
      <Logo multiplier={60} />
      <div className={styles.tick}>
        <TbRosetteDiscountCheckFilled />
        <h2>
          Survey complete!
          <br />
          Thank You.
        </h2>
      </div>
      <div></div>
    </div>
  );
}
