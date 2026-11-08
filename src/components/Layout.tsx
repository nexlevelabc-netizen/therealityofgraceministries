import { useEffect } from "react";
import type { ReactNode } from "react";
import { useLocation } from "react-router";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();

  /* smooth scroll */
  useEffect(() => {
    if (reduceMotion()) return;
    const lenis = new Lenis({ lerp: 0.11 });
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  /* scroll to top on navigation */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  /* reveals, mask lines and parallax, re-scanned per route */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    document.querySelectorAll("[data-reveal], .mask-line").forEach((el) => {
      if (!el.classList.contains("is-in")) observer.observe(el);
    });

    let triggers: ScrollTrigger[] = [];
    if (!reduceMotion()) {
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((wrap) => {
        const img = wrap.querySelector("img");
        if (!img) return;
        const tween = gsap.fromTo(
          img,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: 1 },
          }
        );
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
      });
    }

    return () => {
      observer.disconnect();
      triggers.forEach((t) => t.kill());
    };
  }, [location.pathname]);

  return (
    <>
      <a
        href="#main"
        className="tlink"
        style={{
          position: "fixed",
          top: "0.5rem",
          left: "0.5rem",
          zIndex: 100,
          background: "var(--cream)",
          padding: "0.6rem 1rem",
          transform: "translateY(-300%)",
        }}
        onFocus={(e) => (e.currentTarget.style.transform = "none")}
        onBlur={(e) => (e.currentTarget.style.transform = "translateY(-300%)")}
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}
