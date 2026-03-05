import { useMutation } from "@tanstack/react-query";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export function useDiagnostic() {
  return useMutation({
    mutationFn: async (payload: any) => {
      const r = await fetch(`${API}/diagnostic/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!r.ok) {
        const text = await r.text().catch(() => "");
        throw new Error(text || "Erreur API diagnostic");
      }

      return r.json();
    },
  });
}