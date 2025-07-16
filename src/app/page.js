"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import { authRoutes } from "@/constant";

export default function Home() {
  const router = useRouter();
  const { isLogged, user } = useSelector((state) => state.appReducer);
  const path = usePathname();
  if (!isLogged && !authRoutes?.includes(path)) {
    console.log("pushed to log");
    router.push("/login");
  } else {
    if (user?.role === "ngo") {
      router.push("/ngo/dashboard");
    } else if (user?.role === "admin") {
      router.push("/admin/ngos");
    } else if (user?.role === "company") {
      router.push("/company/dashboard");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
  );
}
