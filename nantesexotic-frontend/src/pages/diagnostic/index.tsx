import React from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AppLayout } from "../../components/AppLayout";
import { useDiagnostic } from "../../helpers/useDiagnostic";
import styles from "./diagnostic.module.css"
import { MapPicker } from "../../components/MapPicker";

import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "../../components/Form";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/Select";
import { RadioGroup, RadioGroupItem } from "../../components/RadioGroup";
import { Switch } from "../../components/Switch";

// ✅ Temporaire: on met un schema local pour compiler tout de suite.
// Quand tu me colles analyze_POST.schema de Floot, on le remet.
const formSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  surfaceHa: z.number().min(0),
  hasSerre: z.boolean(),
  irrigationType: z.enum(["aucune", "goutte_a_goutte", "aspersion"]),
  objectifProduction: z.enum(["marche_frais", "transformation", "test_pilote"]),
  toleranceRisque: z.enum(["faible", "moyen", "eleve"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function DiagnosticPage() {
  const navigate = useNavigate();
  const mutation = useDiagnostic();

  const form = useForm({
    defaultValues: {
      latitude: 47.2184,
      longitude: -1.5536,
      surfaceHa: 1,
      hasSerre: false,
      irrigationType: "aucune",
      objectifProduction: "marche_frais",
      toleranceRisque: "moyen",
    },
    schema: formSchema,
  });

  const onSubmit = (values: FormValues) => {
    toast.info("Analyse en cours...", {
      description: "Récupération des données climatiques et pédologiques.",
    });

    mutation.mutate(values, {
      onSuccess: (data) => {
        toast.success("Analyse terminée !");
        navigate("/resultats", { state: { results: data } });
      },
      onError: (error: any) => {
        toast.error("Erreur lors de l'analyse", {
          description: error?.message ?? "Erreur inconnue",
        });
      },
    });
  };

  return (
    <AppLayout>
      <>
        <Helmet>
          <title>Diagnostic | NantesExotic</title>
        </Helmet>

        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Diagnostic de votre exploitation</h1>
            <p className={styles.subtitle}>
              Renseignez les paramètres de votre terrain pour obtenir une analyse
              scientifique personnalisée.
            </p>
          </div>

          <div className={styles.formCard}>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={styles.form}
              >
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Localisation</h2>

                  <p className={styles.locationHint}>
                    Cliquez sur la carte pour sélectionner l’emplacement de votre exploitation.
                  </p>

                  <MapPicker
                    latitude={form.values.latitude}
                    longitude={form.values.longitude}
                    onChange={({ latitude, longitude }) =>
                      form.setValues((prev) => ({
                        ...prev,
                        latitude,
                        longitude,
                      }))
                    }
                  />

                  <div className={styles.row}>
                    <FormItem name="latitude" className={styles.col}>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.0001"
                          value={form.values.latitude}
                          onChange={(e) =>
                            form.setValues((prev) => ({
                              ...prev,
                              latitude: parseFloat(e.target.value),
                            }))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem name="longitude" className={styles.col}>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.0001"
                          value={form.values.longitude}
                          onChange={(e) =>
                            form.setValues((prev) => ({
                              ...prev,
                              longitude: parseFloat(e.target.value),
                            }))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                </div>

                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Caractéristiques</h2>

                  <FormItem name="surfaceHa">
                    <FormLabel>Surface disponible (hectares)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        value={form.values.surfaceHa}
                        onChange={(e) =>
                          form.setValues((prev) => ({
                            ...prev,
                            surfaceHa: parseFloat(e.target.value),
                          }))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem name="irrigationType">
                    <FormLabel>Type d'irrigation</FormLabel>
                    <FormControl>
                      <Select
                        value={form.values.irrigationType}
                        onValueChange={(val: any) =>
                          form.setValues((prev) => ({
                            ...prev,
                            irrigationType: val,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aucune">Aucune</SelectItem>
                          <SelectItem value="goutte_a_goutte">
                            Goutte-à-goutte
                          </SelectItem>
                          <SelectItem value="aspersion">Aspersion</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem name="hasSerre" className={styles.switchItem}>
                    <FormControl>
                      <Switch
                        checked={form.values.hasSerre}
                        onCheckedChange={(checked) =>
                          form.setValues((prev) => ({
                            ...prev,
                            hasSerre: checked,
                          }))
                        }
                      />
                    </FormControl>
                    <div className={styles.switchLabel}>
                      <FormLabel className={styles.noMargin}>
                        Présence de serre
                      </FormLabel>
                      <FormDescription>
                        Cochez si vous disposez déjà d'infrastructures sous abri.
                      </FormDescription>
                    </div>
                  </FormItem>
                </div>

                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Stratégie</h2>

                  <FormItem name="objectifProduction">
                    <FormLabel>Objectif de production</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={form.values.objectifProduction}
                        onValueChange={(val: any) =>
                          form.setValues((prev) => ({
                            ...prev,
                            objectifProduction: val,
                          }))
                        }
                        className={styles.radioGroup}
                      >
                        <div className={styles.radioItem}>
                          <RadioGroupItem value="marche_frais" id="r1" />
                          <label htmlFor="r1">Marché frais</label>
                        </div>
                        <div className={styles.radioItem}>
                          <RadioGroupItem value="transformation" id="r2" />
                          <label htmlFor="r2">Transformation</label>
                        </div>
                        <div className={styles.radioItem}>
                          <RadioGroupItem value="test_pilote" id="r3" />
                          <label htmlFor="r3">Test pilote</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem name="toleranceRisque">
                    <FormLabel>Niveau de tolérance au risque</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={form.values.toleranceRisque}
                        onValueChange={(val: any) =>
                          form.setValues((prev) => ({
                            ...prev,
                            toleranceRisque: val,
                          }))
                        }
                        className={styles.radioGroup}
                      >
                        <div className={styles.radioItem}>
                          <RadioGroupItem value="faible" id="rt1" />
                          <label htmlFor="rt1">
                            Faible (Sécurité avant tout)
                          </label>
                        </div>
                        <div className={styles.radioItem}>
                          <RadioGroupItem value="moyen" id="rt2" />
                          <label htmlFor="rt2">Moyen (Équilibré)</label>
                        </div>
                        <div className={styles.radioItem}>
                          <RadioGroupItem value="eleve" id="rt3" />
                          <label htmlFor="rt3">
                            Élevé (Innovation et potentiel)
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>

                <div className={styles.actions}>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={mutation.isPending}
                    className={styles.submitBtn}
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="animate-spin" size={20} /> Analyse en
                        cours...
                      </>
                    ) : (
                      "Analyser mon exploitation"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </>
    </AppLayout>
  );
}