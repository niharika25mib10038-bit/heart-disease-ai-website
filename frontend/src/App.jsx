import { useState } from "react";
import {
  Activity,
  ArrowRight,
  Heart,
  ShieldCheck,
  Brain,
  BarChart3,
  ChevronLeft,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import "./styles.css";

const API_URL = "https://heart-disease-ai-backend-cu5q.onrender.com";

const initialForm = {
  age: "",
  sex: "1",
  cp: "0",
  trestbps: "",
  chol: "",
  fbs: "0",
  restecg: "0",
  thalach: "",
  exang: "0",
  oldpeak: "",
  slope: "1",
  ca: "0",
  thal: "2",
};

function App() {
  const [page, setPage] = useState("home");
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const startAssessment = () => {
    setError("");
    setPage("assessment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetAssessment = () => {
    setForm(initialForm);
    setResult(null);
    setError("");
    setPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const predictRisk = async (e) => {
    e.preventDefault();
    setError("");

    const requiredFields = [
      "age",
      "trestbps",
      "chol",
      "thalach",
      "oldpeak",
    ];

    const missing = requiredFields.some(
      (field) => form[field] === "" || form[field] === null
    );

    if (missing) {
      setError("Please complete all required clinical measurements.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        age: Number(form.age),
        sex: Number(form.sex),
        cp: Number(form.cp),
        trestbps: Number(form.trestbps),
        chol: Number(form.chol),
        fbs: Number(form.fbs),
        restecg: Number(form.restecg),
        thalach: Number(form.thalach),
        exang: Number(form.exang),
        oldpeak: Number(form.oldpeak),
        slope: Number(form.slope),
        ca: Number(form.ca),
        thal: Number(form.thal),
      };

      const response = await fetch(`${API_URL}/api/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Prediction request failed.");
      }

      const data = await response.json();

      setResult(data);
      setPage("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setError(
        "Unable to connect to the prediction server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Background decoration */}
      <div className="bg-glow bg-glow-red"></div>
      <div className="bg-glow bg-glow-blue"></div>

      {/* NAVBAR */}
      <header className="navbar">
        <div className="brand" onClick={() => setPage("home")}>
          <div className="brand-icon">
            <Heart size={20} fill="currentColor" />
          </div>

          <div>
            <div className="brand-name">HEART<span>.AI</span></div>
            <div className="brand-subtitle">CARDIOVASCULAR INTELLIGENCE</div>
          </div>
        </div>

        <div className="nav-right">
          <div className="status">
            <span className="status-dot"></span>
            AI SYSTEM ONLINE
          </div>

          {page !== "home" && (
            <button className="nav-back" onClick={() => setPage("home")}>
              Home
            </button>
          )}
        </div>
      </header>

      {/* HOME */}
      {page === "home" && (
        <main>
          <section className="hero">
            <div className="hero-content">
              <div className="eyebrow">
                <Activity size={15} />
                AI-POWERED CARDIOVASCULAR ANALYSIS
              </div>

              <h1>
                Understand your
                <span> heart health.</span>
              </h1>

              <p className="hero-text">
                An intelligent machine-learning system that analyzes clinical
                parameters and estimates cardiovascular disease risk in
                seconds.
              </p>

              <div className="hero-buttons">
                <button className="primary-btn" onClick={startAssessment}>
                  Start Assessment
                  <ArrowRight size={19} />
                </button>

                <button
                  className="secondary-btn"
                  onClick={() =>
                    document
                      .getElementById("technology")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Explore Technology
                </button>
              </div>

              <div className="hero-trust">
                <ShieldCheck size={17} />
                <span>Research & educational use only</span>
              </div>
            </div>

            <div className="hero-visual">
              <div className="orbit orbit-one"></div>
              <div className="orbit orbit-two"></div>

              <div className="heart-container">
                <div className="heart-glow"></div>

                <div className="heart-core">
                  <Heart
                    className="main-heart"
                    size={175}
                    fill="currentColor"
                  />
                </div>

                <div className="ecg-line">
                  <svg viewBox="0 0 500 100">
                    <path
                      d="M0 55 H120 L145 55 L160 20 L180 85 L200 45 L215 55 H500"
                    />
                  </svg>
                </div>
              </div>

              <div className="floating-stat stat-top">
                <span>MODEL ACCURACY</span>
                <strong>ML ENSEMBLE</strong>
              </div>

              <div className="floating-stat stat-bottom">
                <div className="mini-heart">
                  <Heart size={16} fill="currentColor" />
                </div>
                <div>
                  <span>ANALYSIS</span>
                  <strong>&lt; 1 SECOND</strong>
                </div>
              </div>
            </div>
          </section>

          {/* STATS */}
          <section className="stats-section">
            <div className="stat-item">
              <strong>13</strong>
              <span>Clinical Features</span>
            </div>

            <div className="stat-line"></div>

            <div className="stat-item">
              <strong>4</strong>
              <span>ML Models</span>
            </div>

            <div className="stat-line"></div>

            <div className="stat-item">
              <strong>5-Fold</strong>
              <span>Cross Validation</span>
            </div>

            <div className="stat-line"></div>

            <div className="stat-item">
              <strong>&lt;1s</strong>
              <span>Prediction Time</span>
            </div>
          </section>

          {/* TECHNOLOGY */}
          <section className="technology" id="technology">
            <div className="section-heading">
              <div className="eyebrow">
                <Brain size={15} />
                THE TECHNOLOGY
              </div>

              <h2>Clinical data meets machine intelligence.</h2>

              <p>
                HEART.AI processes commonly available cardiovascular
                parameters through a machine-learning pipeline to generate a
                rapid risk estimate.
              </p>
            </div>

            <div className="tech-grid">
              <div className="tech-card">
                <div className="tech-number">01</div>
                <div className="tech-icon">
                  <Activity />
                </div>
                <h3>Clinical Input</h3>
                <p>
                  Age, blood pressure, cholesterol, heart rate and other
                  cardiovascular parameters.
                </p>
              </div>

              <div className="tech-card">
                <div className="tech-number">02</div>
                <div className="tech-icon">
                  <Brain />
                </div>
                <h3>ML Processing</h3>
                <p>
                  Clinical features are processed through trained machine
                  learning models.
                </p>
              </div>

              <div className="tech-card">
                <div className="tech-number">03</div>
                <div className="tech-icon">
                  <BarChart3 />
                </div>
                <h3>Risk Analysis</h3>
                <p>
                  The system returns a cardiovascular risk estimate with model
                  information.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="bottom-cta">
            <div>
              <div className="eyebrow">
                <Heart size={15} />
                READY TO BEGIN?
              </div>

              <h2>Run your cardiovascular assessment.</h2>
            </div>

            <button className="primary-btn" onClick={startAssessment}>
              Start Assessment
              <ArrowRight size={19} />
            </button>
          </section>
        </main>
      )}

      {/* ASSESSMENT */}
      {page === "assessment" && (
        <main className="assessment-page">
          <button className="back-button" onClick={() => setPage("home")}>
            <ChevronLeft size={18} />
            Back to Home
          </button>

          <div className="assessment-header">
            <div className="eyebrow">
              <Activity size={15} />
              STEP 01 — CLINICAL ASSESSMENT
            </div>

            <h1>Enter clinical parameters.</h1>

            <p>
              Provide the available patient parameters below. All fields are
              used by the machine-learning prediction pipeline.
            </p>
          </div>

          <form className="assessment-form" onSubmit={predictRisk}>
            {/* SECTION 1 */}
            <div className="form-section">
              <div className="form-section-title">
                <span>01</span>
                <div>
                  <h2>Patient Profile</h2>
                  <p>Basic demographic information</p>
                </div>
              </div>

              <div className="form-grid two">
                <InputField
                  label="Age"
                  unit="years"
                  type="number"
                  value={form.age}
                  onChange={(v) => updateField("age", v)}
                  placeholder="e.g. 52"
                  required
                />

                <SelectField
                  label="Sex"
                  value={form.sex}
                  onChange={(v) => updateField("sex", v)}
                  options={[
                    ["0", "Female"],
                    ["1", "Male"],
                  ]}
                />
              </div>
            </div>

            {/* SECTION 2 */}
            <div className="form-section">
              <div className="form-section-title">
                <span>02</span>
                <div>
                  <h2>Cardiovascular Measurements</h2>
                  <p>Core physiological measurements</p>
                </div>
              </div>

              <div className="form-grid">
                <InputField
                  label="Resting Blood Pressure"
                  unit="mmHg"
                  type="number"
                  value={form.trestbps}
                  onChange={(v) => updateField("trestbps", v)}
                  placeholder="e.g. 130"
                  required
                />

                <InputField
                  label="Cholesterol"
                  unit="mg/dL"
                  type="number"
                  value={form.chol}
                  onChange={(v) => updateField("chol", v)}
                  placeholder="e.g. 240"
                  required
                />

                <InputField
                  label="Maximum Heart Rate"
                  unit="bpm"
                  type="number"
                  value={form.thalach}
                  onChange={(v) => updateField("thalach", v)}
                  placeholder="e.g. 150"
                  required
                />

                <InputField
                  label="ST Depression"
                  unit=""
                  type="number"
                  step="0.1"
                  value={form.oldpeak}
                  onChange={(v) => updateField("oldpeak", v)}
                  placeholder="e.g. 1.2"
                  required
                />
              </div>
            </div>

            {/* SECTION 3 */}
            <div className="form-section">
              <div className="form-section-title">
                <span>03</span>
                <div>
                  <h2>Clinical Observations</h2>
                  <p>Additional diagnostic parameters</p>
                </div>
              </div>

              <div className="form-grid">
                <SelectField
                  label="Chest Pain Type"
                  value={form.cp}
                  onChange={(v) => updateField("cp", v)}
                  options={[
                    ["0", "Typical Angina"],
                    ["1", "Atypical Angina"],
                    ["2", "Non-anginal Pain"],
                    ["3", "Asymptomatic"],
                  ]}
                />

                <SelectField
                  label="Fasting Blood Sugar"
                  value={form.fbs}
                  onChange={(v) => updateField("fbs", v)}
                  options={[
                    ["0", "≤ 120 mg/dL"],
                    ["1", "> 120 mg/dL"],
                  ]}
                />

                <SelectField
                  label="Resting ECG"
                  value={form.restecg}
                  onChange={(v) => updateField("restecg", v)}
                  options={[
                    ["0", "Normal"],
                    ["1", "ST-T Wave Abnormality"],
                    ["2", "Left Ventricular Hypertrophy"],
                  ]}
                />

                <SelectField
                  label="Exercise-Induced Angina"
                  value={form.exang}
                  onChange={(v) => updateField("exang", v)}
                  options={[
                    ["0", "No"],
                    ["1", "Yes"],
                  ]}
                />

                <SelectField
                  label="ST Segment Slope"
                  value={form.slope}
                  onChange={(v) => updateField("slope", v)}
                  options={[
                    ["0", "Upsloping"],
                    ["1", "Flat"],
                    ["2", "Downsloping"],
                  ]}
                />

                <SelectField
                  label="Major Vessels"
                  value={form.ca}
                  onChange={(v) => updateField("ca", v)}
                  options={[
                    ["0", "0"],
                    ["1", "1"],
                    ["2", "2"],
                    ["3", "3"],
                  ]}
                />

                <SelectField
                  label="Thalassemia"
                  value={form.thal}
                  onChange={(v) => updateField("thal", v)}
                  options={[
                    ["0", "Normal"],
                    ["1", "Fixed Defect"],
                    ["2", "Reversible Defect"],
                  ]}
                />
              </div>
            </div>

            {error && (
              <div className="error-box">
                {error}
              </div>
            )}

            <div className="submit-area">
              <div>
                <ShieldCheck size={18} />
                <span>Your information is used only for this assessment.</span>
              </div>

              <button className="primary-btn submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  <>
                    Run AI Assessment
                    <ArrowRight size={19} />
                  </>
                )}
              </button>
            </div>
          </form>
        </main>
      )}

      {/* RESULT */}
      {page === "result" && result && (
        <main className="result-page">
          <div className="result-header">
            <div className="eyebrow">
              <CheckCircle2 size={15} />
              ASSESSMENT COMPLETE
            </div>

            <h1>Your cardiovascular assessment.</h1>

            <p>
              The machine-learning pipeline has analyzed the submitted
              clinical parameters.
            </p>
          </div>

          <div className="result-card">
            <div className="result-main">
              <div className="result-label">ESTIMATED RISK</div>

              <div className="risk-number">
                {Number(result.heart_disease_percentage || 0).toFixed(1)}
                <span>%</span>
              </div>

              <div className="risk-status">
                {result.label || "Assessment complete"}
              </div>

              <div className="risk-bar">
                <div
                  className="risk-bar-fill"
                  style={{
                    width: `${Math.min(
                      Number(result.heart_disease_percentage || 0),
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="result-side">
              <div className="result-info">
                <span>PRIMARY MODEL</span>
                <strong>
                  {result.primary_model || result.model || "ML Ensemble"}
                </strong>
              </div>

              <div className="result-info">
                <span>MODEL</span>
                <strong>{result.model || "Machine Learning"}</strong>
              </div>

              <div className="result-info">
                <span>ANALYSIS</span>
                <strong>Completed</strong>
              </div>
            </div>
          </div>

          <div className="interpretation">
            <div className="interpretation-title">
              <Brain size={19} />
              <div>
                <h2>AI Assessment Summary</h2>
                <p>Interpretation of the prediction result</p>
              </div>
            </div>

            <p>
              The estimated percentage represents the model's predicted
              cardiovascular disease risk based on the clinical parameters
              provided. This result is intended for research and educational
              demonstration and should not be used as a medical diagnosis.
            </p>
          </div>

          <div className="result-actions">
            <button
              className="secondary-btn"
              onClick={() => {
                setPage("assessment");
                setResult(null);
              }}
            >
              <RotateCcw size={17} />
              New Assessment
            </button>

            <button className="primary-btn" onClick={() => setPage("home")}>
              Return Home
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="disclaimer">
            <ShieldCheck size={17} />
            <span>
              {result.disclaimer ||
                "This tool is for research and educational purposes only and is not a substitute for professional medical advice."}
            </span>
          </div>
        </main>
      )}

      {/* FOOTER */}
      <footer>
        <div className="footer-brand">
          <Heart size={16} fill="currentColor" />
          HEART.AI
        </div>

        <span>AI-powered cardiovascular risk assessment</span>

        <span>Research Project • 2026</span>
      </footer>
    </div>
  );
}


/* ---------------- COMPONENTS ---------------- */

function InputField({
  label,
  unit,
  type,
  value,
  onChange,
  placeholder,
  required,
  step,
}) {
  return (
    <label className="input-field">
      <span className="input-label">
        {label}
        {required && <b>*</b>}
      </span>

      <div className="input-wrapper">
        <input
          type={type}
          step={step}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />

        {unit && <span>{unit}</span>}
      </div>
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="input-field">
      <span className="input-label">{label}</span>

      <div className="select-wrapper">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}

export default App;