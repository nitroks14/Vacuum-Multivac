import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const primaryPumpModels = {
  "Busch R5 RA 0025": (p) => (p > 100 ? 0.0069 : p > 10 ? 0.005 : 0.0035),
  "Busch R5 RA 0040": (p) => (p > 100 ? 0.011 : p > 10 ? 0.008 : 0.005),
  "Busch R5 RA 0063": (p) => (p > 100 ? 0.0175 : p > 10 ? 0.013 : 0.008),
  "Busch R5 RA 0100": (p) => (p > 100 ? 0.028 : p > 10 ? 0.020 : 0.013),
  "Busch R5 RA 0160": (p) => (p > 100 ? 0.044 : p > 10 ? 0.032 : 0.020),
  "Busch R5 RA 0250": (p) => (p > 100 ? 0.069 : p > 10 ? 0.050 : 0.035),
  "Busch R5 RA 0300": (p) => (p > 100 ? 0.083 : p > 10 ? 0.055 : 0.035),
  "Busch R5 RA 0400": (p) => (p > 100 ? 0.11 : p > 10 ? 0.07 : 0.04),
  "Busch R5 RA 0630": (p) => (p > 100 ? 0.175 : p > 10 ? 0.12 : 0.07),
  "Busch R5 RA 0700": (p) => (p > 100 ? 0.195 : p > 10 ? 0.14 : 0.08)
};

const rootsModels = {
  "Aucune": { threshold: 0, gain: 1 },
  "Atlas Copco DRT1000": { threshold: 80, gain: 2.5 },
  "Atlas Copco DRT2000": { threshold: 80, gain: 3.5 },
  "Busch PANDA WV 1000": { threshold: 80, gain: 2.7 },
  "Busch PANDA WV 2000": { threshold: 80, gain: 3.8 }
};

const fixedValveVolume = () => {
  return Math.PI * Math.pow(0.025 / 2, 2) * 0.6;
};

export default function VacuumTimeCalculator() {
  const [inputs, setInputs] = useState({
    laize: "",
    pas: "",
    longueurTuyau: "",
    diametreTuyau: "",
    consigneVide: "",
    vacuumSource: "local",
    reseauVide: 35,
    primaryPump: "Busch R5 RA 0250",
    roots: "Aucune",
    valveLayout: "proche",
    nbLignes: 4,
    diametreLigne: 25
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const calculate = () => {
    const volumeOutillage = (Number(inputs.laize) / 1000) * (Number(inputs.pas) / 1000) * 0.02;
    const longueur = Number(inputs.longueurTuyau);
    const diametre = Number(inputs.diametreTuyau) / 1000;
    const volumeTuyaux = Math.PI * Math.pow(diametre / 2, 2) * longueur;
    const volumeVannes = inputs.valveLayout === "proche"
      ? fixedValveVolume()
      : inputs.nbLignes * Math.PI * Math.pow((inputs.diametreLigne / 1000) / 2, 2) * longueur;
    const volumeRoots = inputs.roots !== "Aucune" ? Math.PI * Math.pow(0.065 / 2, 2) * 1 : 0;
    const volumeTotal = volumeOutillage + volumeTuyaux + volumeVannes + volumeRoots;

    let time = 0;
    const pFinal = Number(inputs.consigneVide);

    if (inputs.vacuumSource === "reseau") {
      const pReseau = Number(inputs.reseauVide);
      if (pReseau <= pFinal) time = 0;
      else time = (volumeTotal / 0.4) * ((pReseau - pFinal) / pReseau);
    } else {
      const pumpCurve = primaryPumpModels[inputs.primaryPump];
      const roots = rootsModels[inputs.roots];
      let p = 1013;
      while (p > pFinal) {
        let debit = pumpCurve(p);
        if (roots.gain > 1 && p < roots.threshold) debit *= roots.gain;
        time += (volumeTotal / debit) * 0.025;
        p -= 25;
      }
    }

    setResult({ time: time.toFixed(2), volume: volumeTotal.toExponential(2) });
  };

  return (
    <div className="p-4 max-w-xl mx-auto grid gap-4">
      <h1 className="text-xl font-semibold">Temps de mise sous vide – Multivac</h1>
      <Card><CardContent className="grid gap-2 pt-4">
        <Input name="laize" onChange={handleChange} placeholder="Laize (mm)" />
        <Input name="pas" onChange={handleChange} placeholder="Pas (mm)" />
        <Input name="longueurTuyau" onChange={handleChange} placeholder="Longueur tuyaux (m)" />
        <Input name="diametreTuyau" onChange={handleChange} placeholder="Diamètre tuyaux (mm)" />
        <Input name="consigneVide" onChange={handleChange} placeholder="Consigne vide (mbar)" />
        <select name="vacuumSource" onChange={handleChange} className="border p-2 rounded">
          <option value="local">Pompes machine</option>
          <option value="reseau">Réseau vide (idéal)</option>
        </select>
        {inputs.vacuumSource === "reseau" && (
          <>
            <div className="text-xs text-muted-foreground">⚠️ Vide réseau considéré comme idéal. Seule la valeur indiquée est prise en compte.</div>
            <Input name="reseauVide" onChange={handleChange} placeholder="Vide réseau (mbar)" />
          </>
        )}
      </CardContent></Card>
      <Button onClick={calculate}>Calculer</Button>
      {result && <Card><CardContent className="pt-4"><p>Temps estimé : {result.time} s</p></CardContent></Card>}
    </div>
  );
}
