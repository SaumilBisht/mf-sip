"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function Finance() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    annualIncome: "",
    incomeSource: "",
    taxResidency: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/status`,
          { withCredentials: true }
        )
        const data = res.data
        if (data.currentStep < 4) router.push("/personal")
        else if (data.currentStep > 4) router.push("/bankdetails")
      } catch (err) {
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }
    checkStatus()
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/finance`,
        formData,
        { withCredentials: true }
      )
      router.push("/bankdetails")
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.error || "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-md p-6 rounded-xl">
      <h1 className="text-2xl font-bold mb-4 text-center">Financial Information</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block mb-2 font-medium">Annual Income</label>
          <select
            value={formData.annualIncome}
            onChange={(e) =>
              setFormData({ ...formData, annualIncome: e.target.value })
            }
            required
            className="w-full border rounded p-2"
          >
            <option value="">Select your annual income</option>
            <option value="BELOW_2_LAKH">Below ₹2 Lakh</option>
            <option value="TWO_TO_FIVE_LAKH">₹2 - ₹5 Lakh</option>
            <option value="FIVE_TO_TEN_LAKH">₹5 - ₹10 Lakh</option>
            <option value="TEN_TO_TWENTYFIVE_LAKH">₹10 - ₹25 Lakh</option>
            <option value="ABOVE_25_LAKH">Above ₹25 Lakh</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">Source of Income</label>
          <select
            value={formData.incomeSource}
            onChange={(e) =>
              setFormData({ ...formData, incomeSource: e.target.value })
            }
            required
            className="w-full border rounded p-2"
          >
            <option value="">Select source of income</option>
            <option value="SALARIED">Salaried</option>
            <option value="SELF_EMPLOYED">Self Employed</option>
            <option value="BUSINESS_OWNER">Business Owner</option>
            <option value="STUDENT">Student</option>
            <option value="RETIRED">Retired</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">Tax Residency</label>
          <select
            value={formData.taxResidency}
            onChange={(e) =>
              setFormData({ ...formData, taxResidency: e.target.value })
            }
            required
            className="w-full border rounded p-2"
          >
            <option value="">Select tax residency</option>
            <option value="INDIA">India</option>
            <option value="NRI">NRI</option>
            <option value="FOREIGN_NATIONAL">Foreign National</option>
          </select>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {submitting ? "Submitting..." : "Continue"}
        </button>
      </form>
    </div>
  )
}
