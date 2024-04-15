"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSourceContext } from "@/contexts/SourceContext";

export const HOSTNAME_PARAM = "server";

export default function HandleUrlHostnameParam() {
  const searchParams = useSearchParams();
  const { setHostname } = useSourceContext();

  const hostnameParam = searchParams?.get(HOSTNAME_PARAM);

  useEffect(() => {
    if (hostnameParam) {
      setHostname(hostnameParam);
    }
  }, [hostnameParam, setHostname]);
  return null;
}
