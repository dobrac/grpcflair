"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSourceContext } from "@/contexts/SourceContext";

const HOSTNAME_PARAM = "hostname";

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
