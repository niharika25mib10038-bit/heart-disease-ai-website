import React, { useState } from "react";
import {
  Activity,
  BrainCircuit,
  ShieldCheck,
  BarChart3,
  Info,
  HeartPulse,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

const API_URL =
  "https://heart-disease-ai-backend-cu5q.onrender.com";

const initialForm = {
  age: 55,
  sex: 1,
  cp: 2,
  trestbps: 140,
  chol: 240,
  fbs: 0,
  restecg: 1,
  thalach: 150,
  exang: 0,
  oldpeak: 1.2,
  slope: 1,
  ca: 0,
  thal: 2,
};

/* ================= FIELD COMPONENT ================= */

function Field({
  label,
  name,
  value,
  onChange,
  type = "number",
  help,
}) {
  return (
    <label className="field">
      <span>{label}</span>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        step={name === "oldpeak" ? "0.1" : "1"}
      />

      {help && <small>{help}</small>}
    </label>
  );
}

/* ================= SELECT COMPONENT ================= */

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}) {
  return (
    <label className="field">
      <span>{label}</span>

      <select
        name={name}
        value={value}
        onChange={onChange}
      >
        {options.map(([v, text]) => (
          <option key={v} value={v}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ================= MAIN APP ================= */

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= HANDLE INPUT ================= */

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((old) => ({
      ...old,
      [name]: Number(value),
    }));
  }

  /* ================= PREDICTION ================= */

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        `${API_URL}/api/predict`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Prediction failed."
        );
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /* ================= RESET ================= */

  function reset() {
    setForm(initialForm);
    setResult(null);
    setError("");
  }

  /* ================= UI ================= */

  return (
    <div className="app-shell">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="topbar">

        <div className="brand">

          <div className="brand-icon">
            <HeartPulse size={22} />
          </div>

          <div>
            <strong>Heart Disease AI</strong>

            <small>
              Explainable ML Research Dashboard
            </small>
          </div>

        </div>

        <div className="research-pill">
          <ShieldCheck size={16} />
          Research Mode
        </div>

      </header>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main>

        {/* ==================================================
            HERO
        ================================================== */}

        <section className="hero">

          <div className="hero-content">

            <p className="eyebrow">
              MACHINE LEARNING • HEALTH INFORMATICS
            </p>

            <h1>
              Heart Disease Risk
              <br />
              <span>Prediction</span>
            </h1>

            <p className="hero-copy">
              A research-oriented prediction interface
              powered by a soft-voting ensemble of four
              machine-learning classifiers.
            </p>

            <div className="model-tags">

              <span>XGBoost</span>

              <span>Random Forest</span>

              <span>Logistic Regression</span>

              <span>SVC</span>

            </div>

          </div>

          <div className="hero-card">

            <div className="hero-card-icon">
              <Activity size={30} />
            </div>

            <strong>Explainable AI</strong>

            <p>
              Feature importance + SHAP analysis are
              included in the ML pipeline.
            </p>

          </div>

        </section>

        {/* ==================================================
            DASHBOARD
        ================================================== */}

        <section className="dashboard-grid">

          {/* ==================================================
              INPUT FORM
          ================================================== */}

          <form
            className="card form-card"
            onSubmit={handleSubmit}
          >

            <div className="card-heading">

              <div>

                <p className="eyebrow">
                  PATIENT PARAMETERS
                </p>

                <h2>Clinical inputs</h2>

              </div>

              <button
                type="button"
                className="icon-btn"
                onClick={reset}
                title="Reset"
              >
                <RotateCcw size={18} />
              </button>

            </div>

            <div className="form-grid">

              {/* AGE */}

              <Field
                label="Age"
                name="age"
                value={form.age}
                onChange={handleChange}
              />

              {/* SEX */}

              <SelectField
                label="Sex"
                name="sex"
                value={form.sex}
                onChange={handleChange}
                options={[
                  [0, "Female (0)"],
                  [1, "Male (1)"],
                ]}
              />

              {/* CHEST PAIN */}

              <SelectField
                label="Chest pain type"
                name="cp"
                value={form.cp}
                onChange={handleChange}
                options={[
                  [0, "Typical angina"],
                  [1, "Atypical angina"],
                  [2, "Non-anginal"],
                  [3, "Asymptomatic"],
                ]}
              />

              {/* BLOOD PRESSURE */}

              <Field
                label="Resting blood pressure"
                name="trestbps"
                value={form.trestbps}
                onChange={handleChange}
                help="mm Hg"
              />

              {/* CHOLESTEROL */}

              <Field
                label="Cholesterol"
                name="chol"
                value={form.chol}
                onChange={handleChange}
                help="mg/dL"
              />

              {/* FASTING BLOOD SUGAR */}

              <SelectField
                label="Fasting blood sugar"
                name="fbs"
                value={form.fbs}
                onChange={handleChange}
                options={[
                  [0, "≤ 120 mg/dL"],
                  [1, "> 120 mg/dL"],
                ]}
              />

              {/* RESTING ECG */}

              <SelectField
                label="Resting ECG"
                name="restecg"
                value={form.restecg}
                onChange={handleChange}
                options={[
                  [0, "Normal"],
                  [1, "ST-T abnormality"],
                  [2, "LV hypertrophy"],
                ]}
              />

              {/* MAX HEART RATE */}

              <Field
                label="Maximum heart rate"
                name="thalach"
                value={form.thalach}
                onChange={handleChange}
                help="bpm"
              />

              {/* EXERCISE ANGINA */}

              <SelectField
                label="Exercise-induced angina"
                name="exang"
                value={form.exang}
                onChange={handleChange}
                options={[
                  [0, "No"],
                  [1, "Yes"],
                ]}
              />

              {/* OLDPEAK */}

              <Field
                label="ST depression (oldpeak)"
                name="oldpeak"
                value={form.oldpeak}
                onChange={handleChange}
              />

              {/* SLOPE */}

              <SelectField
                label="Slope"
                name="slope"
                value={form.slope}
                onChange={handleChange}
                options={[
                  [0, "Upsloping"],
                  [1, "Flat"],
                  [2, "Downsloping"],
                ]}
              />

              {/* MAJOR VESSELS */}

              <Field
                label="Major vessels (ca)"
                name="ca"
                value={form.ca}
                onChange={handleChange}
              />

              {/* THAL */}

              <Field
                label="Thal"
                name="thal"
                value={form.thal}
                onChange={handleChange}
              />

            </div>

            {/* PREDICT BUTTON */}

            <button
              type="submit"
              className="predict-btn"
              disabled={loading}
            >

              <span>
                {loading
                  ? "Running model..."
                  : "Predict result"}
              </span>

              <ArrowRight size={18} />

            </button>

            <p className="form-note">
              Inputs are sent to the FastAPI backend and
              processed by the saved ML pipeline.
            </p>

          </form>

          {/* ==================================================
              RESULT SECTION
          ================================================== */}

          <aside className="result-column">

            <div
              className={`result-card ${
                result ? "has-result" : ""
              }`}
            >

              {/* ================= EMPTY STATE ================= */}

              {!result && !error && (
                <div className="empty-result">

                  <div className="result-icon">
                    <BrainCircuit size={34} />
                  </div>

                  <p className="eyebrow">
                    MODEL OUTPUT
                  </p>

                  <h2>
                    Awaiting prediction
                  </h2>

                  <p>
                    Enter the parameters and run the
                    ensemble model to see the result.
                  </p>

                </div>
              )}

              {/* ================= ERROR ================= */}

              {error && (
                <div className="error-box">

                  <Info size={24} />

                  <div>

                    <strong>
                      Backend connection / model error
                    </strong>

                    <p>{error}</p>

                    <small>
                      Make sure FastAPI is running and
                      the .pkl model is inside the backend
                      folder.
                    </small>

                  </div>

                </div>
              )}

              {/* ================= RESULT ================= */}

              {result && (
                <>

                  <p className="eyebrow">
                    MODEL OUTPUT
                  </p>

                  <h2>
                    {result.label}
                  </h2>

                  {/* PROBABILITY */}

                  <div className="probability">

                    <strong>
                      {result.heart_disease_percentage}%
                    </strong>

                    <span>
                      predicted probability of class 1
                    </span>

                  </div>

                  {/* PROBABILITY METER */}

                  <div className="meter">

                    <div
                      style={{
                        width: `${result.heart_disease_percentage}%`,
                      }}
                    />

                  </div>

                  {/* RESULT METADATA */}

                  <div className="result-meta">

                    <div>
                      <span>Model</span>

                      <strong>
                        {result.model}
                      </strong>
                    </div>

                    <div>
                      <span>Primary learner</span>

                      <strong>
                        {result.primary_model}
                      </strong>
                    </div>

                    <div>
                      <span>Validation</span>

                      <strong>
                        5-fold Stratified CV
                      </strong>
                    </div>

                  </div>

                  {/* DISCLAIMER */}

                  <p className="disclaimer">
                    {result.disclaimer}
                  </p>

                </>
              )}

            </div>

            {/* ==================================================
                MINI INFORMATION CARDS
            ================================================== */}

            <div className="mini-grid">

              <div className="mini-card">

                <BarChart3 size={20} />

                <strong>
                  4 models
                </strong>

                <span>
                  Compared + ensembled
                </span>

              </div>

              <div className="mini-card">

                <ShieldCheck size={20} />

                <strong>
                  Leakage-safe
                </strong>

                <span>
                  Pipeline preprocessing
                </span>

              </div>

            </div>

          </aside>

        </section>

        {/* ==================================================
            INFORMATION SECTION
        ================================================== */}

        <section className="info-grid">

          {/* PIPELINE */}

          <div className="info-card">

            <p className="eyebrow">
              PIPELINE
            </p>

            <h3>
              How it works
            </h3>

            <div className="steps">

              <span>
                01 Data input
              </span>

              <span>
                02 Preprocessing
              </span>

              <span>
                03 Four classifiers
              </span>

              <span>
                04 Soft voting
              </span>

              <span>
                05 Prediction
              </span>

            </div>

          </div>

          {/* EXPLAINABILITY */}

          <div className="info-card">

            <p className="eyebrow">
              EXPLAINABILITY
            </p>

            <h3>
              Why this model?
            </h3>

            <p>
              The ML project includes XGBoost feature
              importance and SHAP analysis so the model
              can be investigated beyond a single score.
            </p>

          </div>

        </section>

      </main>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer>

        <span>
          Heart Disease AI • Academic Research Project
        </span>

        <span>
          Not a clinical diagnostic system
        </span>

      </footer>

    </div>
  );
}