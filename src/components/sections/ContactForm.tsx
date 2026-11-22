"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { services } from "@/data/services";
import { siteConfig } from "@/data/site-config";

type Values = { name: string; email: string; business: string; service: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;
type Status = "idle" | "sending" | "sent" | "failed" | "unconfigured";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "اكتب اسمك (حرفين على الأقل).";
  if (!v.email.trim()) e.email = "البريد الإلكتروني مطلوب.";
  else if (!emailRe.test(v.email.trim())) e.email = "اكتب بريد إلكتروني صحيح، مثل name@example.com.";
  if (v.business.trim().length < 2) e.business = "اكتب اسم البيزنس.";
  if (!v.service) e.service = "اختار الخدمة المطلوبة.";
  if (v.message.trim().length < 10) e.message = "اكتب تفاصيل المشروع (10 حروف على الأقل).";
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

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
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

    // No endpoint configured: never pretend the message was sent.
    if (!siteConfig.contact.formEndpoint) {
      setStatus("unconfigured");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(siteConfig.contact.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...values, plan: plan || undefined, period: period || undefined }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      setValues({ name: "", email: "", business: "", service: "", message: "" });
    } catch {
      setStatus("failed");
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
      <div role="status" className="glass chrome-ring rounded-[2rem] p-10 text-center">
        <h2 className="text-2xl font-bold text-navy">وصلتنا رسالتك.</h2>
        <p className="mt-3 text-ink-soft">هنراجع التفاصيل ونتواصل معاك.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="glass chrome-ring grid gap-6 rounded-[2rem] p-6 md:p-10">
      <div>
        <label htmlFor="cf-name" className="mb-2 block font-display font-semibold text-navy">
          الاسم
        </label>
        <input {...a11y("name")} type="text" autoComplete="name" value={values.name} onChange={set("name")} />
        {err("name")}
      </div>

      <div>
        <label htmlFor="cf-email" className="mb-2 block font-display font-semibold text-navy">
          البريد الإلكتروني
        </label>
        <input
          {...a11y("email")}
          type="email"
          dir="ltr"
          autoComplete="email"
          inputMode="email"
          value={values.email}
          onChange={set("email")}
          style={{ textAlign: "start" }}
        />
        {err("email")}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="cf-business" className="mb-2 block font-display font-semibold text-navy">
            اسم البيزنس
          </label>
          <input {...a11y("business")} type="text" autoComplete="organization" value={values.business} onChange={set("business")} />
          {err("business")}
        </div>
        <div>
          <label htmlFor="cf-service" className="mb-2 block font-display font-semibold text-navy">
            الخدمة المطلوبة
          </label>
          <select {...a11y("service")} value={values.service} onChange={set("service")}>
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
        <label htmlFor="cf-message" className="mb-2 block font-display font-semibold text-navy">
          تفاصيل المشروع
        </label>
        <textarea {...a11y("message")} rows={5} value={values.message} onChange={set("message")} />
        {err("message")}
      </div>

      {(plan || period) && (
        <p className="rounded-2xl bg-navy/5 px-4 py-3 text-sm text-navy">
          طلب خطة{plan ? `: ${plan}` : ""}
          {period ? ` (${period === "yearly" ? "سنوي" : "شهري"})` : ""} سيتم إرفاقه مع رسالتك.
        </p>
      )}

      {status === "unconfigured" && (
        <div role="alert" className="rounded-2xl border border-[#c0264b]/40 bg-[#fff1f4] px-5 py-4 text-[#7d1530]">
          <p className="font-semibold">لم يتم إرسال رسالتك.</p>
          <p className="mt-1 text-sm">
            نموذج التواصل لسه مش مربوط بخدمة استقبال. بيانات الموقع محتاجة إعداد
            <code className="mx-1 rounded bg-white px-1.5" dir="ltr">contact.formEndpoint</code>
            في ملف <code className="rounded bg-white px-1.5" dir="ltr">src/data/site-config.ts</code>.
          </p>
        </div>
      )}
      {status === "failed" && (
        <p role="alert" className="rounded-2xl border border-[#c0264b]/40 bg-[#fff1f4] px-5 py-4 text-[#7d1530]">
          حصلت مشكلة أثناء الإرسال. جرّب مرة تانية بعد شوية.
        </p>
      )}

      <Button type="submit" size="lg" disabled={status === "sending"} className="w-full md:w-auto md:justify-self-start">
        {status === "sending" ? "جاري الإرسال..." : "أرسل طلبك"}
      </Button>
    </form>
  );
}
