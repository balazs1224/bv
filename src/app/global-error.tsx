"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="hu">
      <body className="flex min-h-screen items-center justify-center bg-[#111827] text-[#f4f2ec] font-sans">
        <div className="mx-4 max-w-md space-y-4 text-center">
          <h1 className="text-xl font-semibold">Váratlan hiba történt</h1>
          <p className="text-sm text-white/70">
            A Biztonsági Döntéstár betöltése közben hiba lépett fel. Próbáld meg újratölteni az oldalt.
          </p>
          <button
            onClick={() => reset()}
            className="rounded-md bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/15"
          >
            Újrapróbálkozás
          </button>
        </div>
      </body>
    </html>
  );
}
