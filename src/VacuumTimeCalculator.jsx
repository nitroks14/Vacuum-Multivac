import { useState } from "react";

export default function VacuumTimeCalculator() {
  const [inputs, setInputs] = useState({
    laize: "",
    pas: "",
    longueurTuyau: "",
    diametreTuyau: "",
    consigneVide: "",
    vacuumSource: "local",
    reseauVide: 35,
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const calculate = () => {
    const laize = Number(inputs.laize) / 1000;
    const pas = Number(inputs.pas) / 1000;
    const longueur = Number(inputs.longueurTuyau);
    const diametre = Number(inputs.diametreTuyau) / 1000;
    const consigne = Number(inputs.consigneVide);

    if (!laize || !pas || !longueur || !diametre || !consigne) {
      alert("Merci de renseigner tous les champs.");
      return;
    }

    // Volume outillage (hypothèse simple)
    const volumeOutillage = laize * pas * 0.02;

    // Volume tuyaux
    const volumeTuyaux =
      Math.PI * Math.pow(diametre / 2, 2) * longueur;

    const volumeTotal = volumeOutillage + volumeTuyaux;

    let time = 0;

    if (inputs.vacuumSource === "reseau") {
      const pReseau = Number(inputs.reseauVide);
      if (pReseau <= consigne) {
        time = 0;
      } else {
        const debitIdeal = 0.4; // hypothèse volontairement favorable
        time =
          (volumeTotal / debitIdeal) *
          ((pReseau - consigne) / pReseau);
      }
    } else {
      // Cas pompes machine (modèle simplifié)
      const debitMoyen = 0.08; // m³/s
      time = volumeTotal / debitMoyen;
    }

    setResult({
      time: time.toFixed(2),
      volume: volumeTotal.toExponential(2),
    });
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <h2>Temps de mise sous vide – Multivac</h2>

      <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: 6 }}>
        <label>
          Laize (mm)
          <input name="laize" onChange={handleChange} style={inputStyle} />
        </label>

        <label>
          Pas (mm)
          <input name="pas" onChange={handleChange} style={inputStyle} />
        </label>

        <label>
          Longueur tuyaux (m)
          <input name="longueurTuyau" onChange={handleChange} style={inputStyle} />
        </label>

        <label>
          Diamètre tuyaux (mm)
          <input name="diametreTuyau" onChange={handleChange} style={inputStyle} />
        </label>

        <label>
          Consigne de vide (mbar)
          <input name="consigneVide" onChange={handleChange} style={inputStyle} />
        </label>

        <label>
          Source de vide
          <select
            name="vacuumSource"
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="local">Pompes machine</option>
            <option value="reseau">Réseau vide client (idéal)</option>
          </select>
        </label>

        {inputs.vacuumSource === "reseau" && (
          <>
            <p style={{ fontSize: 12, color: "#555" }}>
              ⚠️ Le vide réseau est considéré comme idéal.
              Seule la valeur de vide est prise en compte.
            </p>
            <label>
              Vide réseau (mbar)
              <input
                name="reseauVide"
                onChange={handleChange}
                style={inputStyle}
              />
            </label>
          </>
        )}

        <button onClick={calculate} style={buttonStyle}>
          Calculer
        </button>
      </div>

      {result && (
        <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #ccc" }}>
          <p><strong>Temps estimé :</strong> {result.time} s</p>
          <p><strong>Volume total :</strong> {result.volume} m³</p>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  margin: "0.25rem 0 0.75rem 0",
  padding: "0.4rem",
  boxSizing: "border-box",
};

const buttonStyle = {
  padding: "0.5rem 1rem",
  cursor: "pointer",
};
