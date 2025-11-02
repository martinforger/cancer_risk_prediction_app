import { useState } from 'react'
import api from '../api'

const defaultState = {
  age: '',
  gender: 'Male',
  bmi: '',
  alcohol_consumption: 'Never',
  smoking_status: 'Never',
  hepatitis_b: false,
  hepatitis_c: false,
  liver_function_score: '',
  alpha_fetoprotein_level: '',
  cirrhosis_history: false,
  family_history_cancer: false,
  physical_activity_level: 'Low',
  diabetes: false,
}

export default function PatientForm() {
  const [form, setForm] = useState(defaultState)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  function handleChange(e) {
    const { name, type, value, checked } = e.target
    setForm((s) => ({ ...s, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setResult(null)

    if (!form.age || !form.bmi || !form.liver_function_score || !form.alpha_fetoprotein_level) {
      setError('Por favor complete los campos requeridos: Edad, IMC, Puntuación función hepática y AFP.')
      return
    }

    const payload = {
      age: parseInt(form.age, 10),
      // preserve casing to match backend expectations (don't lowercase)
      gender: form.gender,
      bmi: parseFloat(form.bmi),
      alcohol_consumption: form.alcohol_consumption,
      smoking_status: form.smoking_status,
      hepatitis_b: !!form.hepatitis_b,
      hepatitis_c: !!form.hepatitis_c,
      liver_function_score: parseFloat(form.liver_function_score),
      alpha_fetoprotein_level: parseFloat(form.alpha_fetoprotein_level),
      cirrhosis_history: !!form.cirrhosis_history,
      family_history_cancer: !!form.family_history_cancer,
      physical_activity_level: form.physical_activity_level,
      diabetes: !!form.diabetes,
    }

    try {
      setLoading(true)
      console.log(payload);
      const resp = await api.post('/predict', payload)
      setResult(resp.data)
      console.log(resp.data);
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.detail || err.message || 'Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setForm(defaultState)
    setResult(null)
    setError(null)
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e5e7eb] dark:border-b-[#273340] px-6 sm:px-10 py-4 bg-white dark:bg-background-dark/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-4 text-slate-800 dark:text-white">
            <div className="size-6 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Cancer Risk Calculator</h2>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-10 py-8">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col gap-4 mb-8">
              <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Fill your data to the risk prediction</h1>
              <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">This tool gives an estimate of the risk based on the data given by the user. It is not a medical diagnosis</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white dark:bg-slate-900/50 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800">
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                  <section>
                    <h2 className="text-slate-900 dark:text-white text-xl font-bold pb-4 border-b border-slate-200 dark:border-slate-800">Demographic Data</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 pt-6">
                      <label className="flex flex-col">
                        <p className="text-slate-800 dark:text-slate-300 text-base font-medium pb-2">Age</p>
                        <input name="age" type="number" min="0" value={form.age} onChange={handleChange} placeholder="Ej: 45" className="form-input rounded-lg border border-slate-300 dark:border-slate-700 h-12 p-3" required />
                      </label>

                      <label className="flex flex-col">
                        <p className="text-slate-800 dark:text-slate-300 text-base font-medium pb-2">Gender</p>
                        <select name="gender" value={form.gender} onChange={handleChange} className="form-select rounded-lg border border-slate-300 dark:border-slate-700 h-12 p-3">
                          <option>Male</option>
                          <option>Female</option>
                        </select>
                      </label>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-slate-900 dark:text-white text-xl font-bold pb-4 border-b border-slate-200 dark:border-slate-800">Hábitos y Estilo de Vida</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 pt-6">
                      <label className="flex flex-col">
                        <p className="text-slate-800 dark:text-slate-300 text-base font-medium pb-2">BMI</p>
                        <input name="bmi" type="number" step="0.1" value={form.bmi} onChange={handleChange} placeholder="Ej: 24.5" className="form-input rounded-lg border border-slate-300 dark:border-slate-700 h-12 p-3" required />
                      </label>

                      <label className="flex flex-col">
                        <p className="text-slate-800 dark:text-slate-300 text-base font-medium pb-2">Smoking Status</p>
                        <select name="smoking_status" value={form.smoking_status} onChange={handleChange} className="form-select rounded-lg border border-slate-300 dark:border-slate-700 h-12 p-3">
                          <option>Current</option>
                          <option>Former</option>
                          <option>Never</option>
                        </select>
                      </label>

                      <label className="flex flex-col">
                        <p className="text-slate-800 dark:text-slate-300 text-base font-medium pb-2">Alcohol consumption</p>
                        <select name="alcohol_consumption" value={form.alcohol_consumption} onChange={handleChange} className="form-select rounded-lg border border-slate-300 dark:border-slate-700 h-12 p-3">
                          <option>Never</option>
                          <option>Occasional</option>
                          <option>Regular</option>
                        </select>
                      </label>

                      <label className="flex flex-col">
                        <p className="text-slate-800 dark:text-slate-300 text-base font-medium pb-2">Physical Activity Level</p>
                        <select name="physical_activity_level" value={form.physical_activity_level} onChange={handleChange} className="form-select rounded-lg border border-slate-300 dark:border-slate-700 h-12 p-3">
                          <option>High</option>
                          <option>Low</option>
                          <option>Moderate</option>
                        </select>
                      </label>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-slate-900 dark:text-white text-xl font-bold pb-4 border-b border-slate-200 dark:border-slate-800">Clinical History</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 pt-6">
                      <label className="flex flex-col">
                        <div className="flex items-center gap-2 pb-2">
                          <p className="text-slate-800 dark:text-slate-300 text-base font-medium">Liver Function Score</p>
                        </div>
                        <input name="liver_function_score" type="number" step="0.1" value={form.liver_function_score} onChange={handleChange} placeholder="Ej: 8" className="form-input rounded-lg border border-slate-300 dark:border-slate-700 h-12 p-3" required />
                      </label>

                      <label className="flex flex-col">
                        <div className="flex items-center gap-2 pb-2">
                          <p className="text-slate-800 dark:text-slate-300 text-base font-medium">Alpha Fetoprotein Level</p>
                        </div>
                        <input name="alpha_fetoprotein_level" type="number" step="0.1" value={form.alpha_fetoprotein_level} onChange={handleChange} placeholder="Ej: 15" className="form-input rounded-lg border border-slate-300 dark:border-slate-700 h-12 p-3" required />
                      </label>

                      {/* Hepatitis B */}
                      <div className="flex flex-col">
                        <p className="text-slate-800 dark:text-slate-300 text-base font-medium pb-2">Hepatitis B</p>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setForm(s => ({ ...s, hepatitis_b: true }))}
                            className={`w-24 h-11 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/30 ${form.hepatitis_b ? 'bg-primary/10 text-primary border-primary' : 'bg-white text-slate-700 border-slate-200'} hover:bg-slate-50`}
                          >Yes</button>
                          <button
                            type="button"
                            onClick={() => setForm(s => ({ ...s, hepatitis_b: false }))}
                            className={`w-24 h-11 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/30 ${form.hepatitis_b === false ? 'bg-slate-50 text-slate-700 border-slate-200' : 'bg-white text-slate-700 border-slate-200'} hover:bg-slate-50`}
                          >No</button>
                        </div>
                      </div>

                      {/* Hepatitis C */}
                      <div className="flex flex-col">
                        <p className="text-slate-800 dark:text-slate-300 text-base font-medium pb-2">Hepatitis C</p>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setForm(s => ({ ...s, hepatitis_c: true }))}
                            className={`w-24 h-11 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/30 ${form.hepatitis_c ? 'bg-primary/10 text-primary border-primary' : 'bg-white text-slate-700 border-slate-200'} hover:bg-slate-50`}
                          >Yes</button>
                          <button
                            type="button"
                            onClick={() => setForm(s => ({ ...s, hepatitis_c: false }))}
                            className={`w-24 h-11 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/30 ${form.hepatitis_c === false ? 'bg-slate-50 text-slate-700 border-slate-200' : 'bg-white text-slate-700 border-slate-200'} hover:bg-slate-50`}
                          >No</button>
                        </div>
                      </div>

                      {/* Cirrosis */}
                      <div className="flex flex-col">
                        <p className="text-slate-800 dark:text-slate-300 text-base font-medium pb-2">Cirrhosis History</p>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setForm(s => ({ ...s, cirrhosis_history: true }))}
                            className={`w-24 h-11 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/30 ${form.cirrhosis_history ? 'bg-primary/10 text-primary border-primary' : 'bg-white text-slate-700 border-slate-200'} hover:bg-slate-50`}
                          >Yes</button>
                          <button
                            type="button"
                            onClick={() => setForm(s => ({ ...s, cirrhosis_history: false }))}
                            className={`w-24 h-11 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/30 ${form.cirrhosis_history === false ? 'bg-slate-50 text-slate-700 border-slate-200' : 'bg-white text-slate-700 border-slate-200'} hover:bg-slate-50`}
                          >No</button>
                        </div>
                      </div>

                      {/* Historial familiar de cáncer */}
                      <div className="flex flex-col">
                        <p className="text-slate-800 dark:text-slate-300 text-base font-medium pb-2">Family History Cancer</p>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setForm(s => ({ ...s, family_history_cancer: true }))}
                            className={`w-24 h-11 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/30 ${form.family_history_cancer ? 'bg-primary/10 text-primary border-primary' : 'bg-white text-slate-700 border-slate-200'} hover:bg-slate-50`}
                          >Yes</button>
                          <button
                            type="button"
                            onClick={() => setForm(s => ({ ...s, family_history_cancer: false }))}
                            className={`w-24 h-11 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/30 ${form.family_history_cancer === false ? 'bg-slate-50 text-slate-700 border-slate-200' : 'bg-white text-slate-700 border-slate-200'} hover:bg-slate-50`}
                          >No</button>
                        </div>
                      </div>

                      {/* Diabetes */}
                      <div className="flex flex-col">
                        <p className="text-slate-800 dark:text-slate-300 text-base font-medium pb-2">Diabetes</p>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setForm(s => ({ ...s, diabetes: true }))}
                            className={`w-24 h-11 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/30 ${form.diabetes ? 'bg-primary/10 text-primary border-primary' : 'bg-white text-slate-700 border-slate-200'} hover:bg-slate-50`}
                          >Yes</button>
                          <button
                            type="button"
                            onClick={() => setForm(s => ({ ...s, diabetes: false }))}
                            className={`w-24 h-11 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/30 ${form.diabetes === false ? 'bg-slate-50 text-slate-700 border-slate-200' : 'bg-white text-slate-700 border-slate-200'} hover:bg-slate-50`}
                          >No</button>
                        </div>
                      </div>
                    </div>
                  </section>

                  <div className="flex flex-col items-start gap-4 pt-4">
                    <div className="flex gap-3 w-full">
                      <button type="submit" className="w-full sm:w-auto h-12 px-6 rounded-lg bg-primary text-white font-bold" disabled={loading}>{loading ? 'Calculating...' : 'Calculate Risk Now'}</button>
                      <button type="button" onClick={resetForm} className="w-full sm:w-auto h-12 px-6 rounded-lg border">Reset</button>
                    </div>
                    {error && <div className="text-danger">{error}</div>}
                  </div>
                </form>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-28 bg-white dark:bg-slate-900/50 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-4">Your Risk Result</h3>
                  <div className="flex flex-col items-center justify-center bg-background-light dark:bg-slate-800/50 rounded-lg p-6 text-center">
                    {result ? (
                      (() => {
                        // Backend now returns a full percentage (0..100). Treat value as percentage directly.
                        const raw = result['Risk percentage']
                        const numeric = typeof raw === 'number' ? raw : parseFloat(String(raw).replace('%', '').trim()) || 0
                        const pctRounded = Number.isFinite(numeric) ? Number(numeric.toFixed(0)) : null
                        const pctLabel = pctRounded !== null ? `${pctRounded}%` : String(result['Risk percentage'])
                        const pctNumber = pctRounded !== null ? pctRounded : 0
                        return (
                          <>
                            <p className="text-6xl font-black text-danger tracking-tighter">{pctLabel}</p>
                            <p className="text-lg font-bold text-danger mt-1">{pctNumber >= 50 ? 'Riesgo Elevado' : 'Riesgo'}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">{result['Action message']}</p>
                          </>
                        )
                      })()
                    ) : (
                      <>
                        <p className="text-lg text-slate-500">Without any results yet</p>
                        <p className="text-sm text-slate-400 mt-2">Complete the form and press "Calculate Risk Now"</p>
                      </>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
