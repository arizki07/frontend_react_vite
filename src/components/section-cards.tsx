import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Selamat Datang 🚀
          </CardTitle>
          <CardDescription className="text-base leading-relaxed">
            Halo, ini adalah dashboard aplikasi kamu. Di sini kamu bisa memantau
            aktivitas pengguna, melihat data terbaru, serta mengelola sistem
            dengan lebih mudah. Semoga hari kamu menyenangkan dan penuh semangat
            untuk produktivitas! ✨
          </CardDescription>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Terima kasih sudah menggunakan aplikasi ini.
        </CardFooter>
      </Card>
    </div>
  );
}
