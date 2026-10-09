import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
export default function usePortfolioGSAP(callback) {
  const latest = useRef(callback); latest.current = callback;
  useGSAP(() => { const media = gsap.matchMedia(); media.add("(prefers-reduced-motion: no-preference)", () => latest.current()); return () => media.revert(); }, []);
}
