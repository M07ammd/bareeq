import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="bg-night on-dark grid min-h-[80svh] place-items-center px-6 pt-32 text-center">
      <div>
        <h1 className="text-4xl font-bold text-white md:text-6xl">الصفحة دي مش موجودة.</h1>
        <p className="mt-4 text-lg text-white/75">الرابط ممكن يكون اتغيّر أو مكتوب غلط.</p>
        <Button href="/" size="lg" className="mt-8">
          ارجع للرئيسية
        </Button>
      </div>
    </section>
  );
}
