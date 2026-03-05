import { useQuery } from "@tanstack/react-query";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export type Crop = {
  id: string;
  name: string;
  scientificName: string;
  imageUrl?: string; // ahora viene del backend
};

export function useCrops() {
  return useQuery({
    queryKey: ["crops", "list"],
    queryFn: async (): Promise<{ crops: Crop[] }> => {
      const r = await fetch(`${API}/crops`);
      if (!r.ok) throw new Error("Erreur API /crops");
      return (await r.json()) as { crops: Crop[] };
    },
  });
}