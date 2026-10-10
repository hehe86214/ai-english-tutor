import Image from "next/image";
import Link from "next/link";

// 照片卡：粗黃框 + 底部深色漸層 + 白色標題 + 彩色膠囊
export default function PhotoCard({
  href,
  image,
  title,
  subtitle,
  pill,
  pillClass,
  size = "md",
  className = "",
  priority = false,
}: {
  href: string;
  image: string;
  title: string;
  subtitle?: string;
  pill?: string;
  pillClass?: string;
  size?: "md" | "lg";
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group relative isolate block overflow-hidden rounded-[28px] border-[5px] border-sun bg-accent shadow-[0_18px_40px_-22px_rgb(30_31_85/0.55)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_50px_-20px_rgb(30_31_85/0.6)] ${className}`}
    >
      <Image
        src={image}
        alt=""
        fill
        priority={priority}
        sizes={size === "lg" ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
        className="-z-10 object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#14134a]/90 via-[#14134a]/35 to-[#14134a]/5" />
      <div className={`absolute inset-x-0 bottom-0 ${size === "lg" ? "p-6 sm:p-7" : "p-4 sm:p-5"}`}>
        <p
          className={`font-display font-black text-white drop-shadow-[0_2px_6px_rgb(0_0_0/0.45)] ${
            size === "lg" ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"
          }`}
        >
          {title}
        </p>
        {subtitle && (
          <p className="mt-1 text-sm font-semibold text-white/80">{subtitle}</p>
        )}
        {pill && (
          <span
            className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-black shadow-lg ${pillClass}`}
          >
            {pill}
            <svg viewBox="0 0 10 12" className="size-2.5 fill-current transition group-hover:translate-x-0.5" aria-hidden>
              <path d="M0 0l10 6-10 6z" />
            </svg>
          </span>
        )}
      </div>
    </Link>
  );
}
