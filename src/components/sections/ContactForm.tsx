"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { services } from "@/data/services";
import { siteConfig } from "@/data/site-config";

type Values = {
  name: string;
  email: string;
  business: string;
  service: string;
  message: string;
};
type Errors = Partial<Record<keyof Values, string>>;
type Status = "idle" | "sending" | "sent" | "failed";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "اكتب اسمك (حرفين على الأقل).";
  if (!v.email.trim()) e.email = "البريد الإلكتروني مطلوب.";
  else if (!emailRe.test(v.email.trim()))
    e.email = "اكتب بريد إلكتروني صحيح، مثل name@example.com.";
  if (v.business.trim().length < 2) e.business = "اكتب اسم البيزنس.";
  if (!v.service) e.service = "اختار الخدمة المطلوبة.";
  if (v.message.trim().length < 10)
    e.message = "اكتب تفاصيل المشروع (10 حروف على الأقل).";
  return e;
}

const field =
  "w-full rounded-2xl border bg-white px-5 py-3.5 text-navy outline-none transition-shadow placeholder:text-ink-soft/60 focus:shadow-[0_0_0_4px_rgb(83_108_255/0.18)]";

export function ContactForm() {
  const params = useSearchParams();
  const presetService = params.get("service") ?? "";
  const plan = params.get("plan") ?? "";
  const period = params.get("period") ?? "";

  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    business: "",
    service: services.some((s) => s.slug === presetService) ? presetService : "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [whatsappLink, setWhatsappLink] = useState<string>("");

  const set =
    (k: keyof Values) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setValues((v) => ({ ...v, [k]: e.target.value }));
      if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
    };

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setStatus("idle");
      // move focus to the first invalid field
      const first = Object.keys(errs)[0];
      document.getElementById(`cf-${first}`)?.focus();
      return;
    }

    setStatus("sending");

    // Map service slug to Arabic title
    const targetService = services.find((s) => s.slug === values.service);
    const serviceTitle = targetService
      ? `${targetService.nameAr}${targetService.category === "hospitality" ? ` (${targetService.nameEn})` : ""}`
      : values.service === "other"
      ? "طلب مخصص / خدمة أخرى"
      : values.service;

    const planInfo = plan
      ? `\n📌 الخطة المطلوبة: ${plan} (${period === "yearly" ? "سنوي" : "شهري"})`
      : "";

    // Build structured WhatsApp message
    const text = `مرحباً BAREEQ، لدي استفسار جديد عبر الموقع:

👤 الاسم: ${values.name}
💼 اسم البيزنس: ${values.business}
📧 البريد الإلكتروني: ${values.email}
🎯 الخدمة المطلوبة: ${serviceTitle}${planInfo}

📝 تفاصيل المشروع:
${values.message}`;

    const phone =
      siteConfig.contact.whatsapp?.replace(/\D/g, "") || "201228040614";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

    setWhatsappLink(url);
    setStatus("sent");

    // Open WhatsApp in a new tab/window
    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
  }

  const err = (k: keyof Values) =>
    errors[k] ? (
      <p id={`cf-${k}-err`} className="mt-2 text-sm font-medium text-[#c0264b]">
        {errors[k]}
      </p>
    ) : null;
  const a11y = (k: keyof Values) => ({
    id: `cf-${k}`,
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `cf-${k}-err` : undefined,
    className: `${field} ${errors[k] ? "border-[#c0264b]" : "border-navy/15"}`,
  });

  if (status === "sent") {
    return (
      <div
        role="status"
        className="glass chrome-ring rounded-[2rem] p-8 text-center md:p-12"
      >
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/15 text-emerald-600">
          <svg
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-navy md:text-3xl">
          تم تجهيز بيانات طلبك!
        </h2>
        <p className="mt-3 text-base text-ink-soft">
          تم توجيهك إلى واتساب لإرسال رسالتك مباشرة لفريق{" "}
          <strong className="text-navy">BAREEQ</strong>.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-chrome inline-flex items-center gap-2"
            >
              <span>فتح المحادثة في واتساب</span>
              <span>💬</span>
            </a>
          )}
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setValues({
                name: "",
                email: "",
                business: "",
                service: "",
                message: "",
              });
            }}
            className="btn btn-outline"
          >
            إرسال طلب جديد
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="glass chrome-ring grid gap-6 rounded-[2rem] p-6 md:p-10"
    >
      <div>
        <label
          htmlFor="cf-name"
          className="mb-2 block font-display font-semibold text-navy"
        >
          الاسم
        </label>
        <input
          {...a11y("name")}
          type="text"
          autoComplete="name"
          placeholder="اكتب اسمك الكريم"
          value={values.name}
          onChange={set("name")}
        />
        {err("name")}
      </div>

      <div>
        <label
          htmlFor="cf-email"
          className="mb-2 block font-display font-semibold text-navy"
        >
          البريد الإلكتروني
        </label>
        <input
          {...a11y("email")}
          type="email"
          dir="ltr"
          autoComplete="email"
          inputMode="email"
          placeholder="name@example.com"
          value={values.email}
          onChange={set("email")}
          style={{ textAlign: "start" }}
        />
        {err("email")}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="cf-business"
            className="mb-2 block font-display font-semibold text-navy"
          >
            اسم البيزنس
          </label>
          <input
            {...a11y("business")}
            type="text"
            autoComplete="organization"
            placeholder="اسم شركتك أو مشروعك"
            value={values.business}
            onChange={set("business")}
          />
          {err("business")}
        </div>
        <div>
          <label
            htmlFor="cf-service"
            className="mb-2 block font-display font-semibold text-navy"
          >
            الخدمة المطلوبة
          </label>
          <select
            {...a11y("service")}
            value={values.service}
            onChange={set("service")}
          >
            <option value="">اختار الخدمة</option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.nameAr}
                {s.category === "hospitality" ? ` | ${s.nameEn}` : ""}
              </option>
            ))}
            <option value="other">مش متأكد / حاجة تانية</option>
          </select>
          {err("service")}
        </div>
      </div>

      <div>
        <label
          htmlFor="cf-message"
          className="mb-2 block font-display font-semibold text-navy"
        >
          تفاصيل المشروع
        </label>
        <textarea
          {...a11y("message")}
          rows={5}
          placeholder="احكيلنا باختصار عن أهدافك وما تحتاجه في هذا المشروع..."
          value={values.message}
          onChange={set("message")}
        />
        {err("message")}
      </div>

      {(plan || period) && (
        <p className="rounded-2xl bg-navy/5 px-4 py-3 text-sm text-navy">
          طلب خطة{plan ? `: ${plan}` : ""}
          {period ? ` (${period === "yearly" ? "سنوي" : "شهري"})` : ""} سيتم
          إرفاقه مع رسالتك على واتساب.
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          type="submit"
          size="lg"
          disabled={status === "sending"}
          className="w-full sm:w-auto"
        >
          {status === "sending" ? "جاري التجهيز..." : "إرسال عبر واتساب 💬"}
        </Button>
        <span className="text-xs text-ink-soft">
          سيتم فتح محادثة مباشرة مع رقمنا على واتساب بالتفاصيل المكتوبة.
        </span>
      </div>
    </form>
  );
}
