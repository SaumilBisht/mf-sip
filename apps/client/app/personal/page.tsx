"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function Personal() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  const [formData, setFormData] = useState({
    fatherName: "",
    motherName: "",
    maritalStatus: "",
    education: "",
    gender: "",
    residentialStatus: "",
    occupationType: "",
    countryOfBirth: "",
    nationality: "",
  })

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/status`,
          { withCredentials: true }
        )
        const data = res.data
        if (data.currentStep < 3) router.push("/kyc")
        else if (data.currentStep > 3) router.push("/finance")
      } catch (err) {
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }
    checkStatus()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.fatherName || !formData.motherName) {
      return setMessage("Father and Mother names are required")
    }

    try {
      setSubmitting(true)
      setMessage("")
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/personal`,
        formData,
        { withCredentials: true }
      )

      if (res.data.success) {
        setMessage("Personal details saved successfully!")
        setTimeout(() => router.push("/finance"), 1000)
      }
    } catch (err: any) {
      console.error(err)
      setMessage(err?.response?.data?.error || "Failed to save personal details")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Personal Information</h1>

      {message && <p className="text-sm text-red-600 mb-3">{message}</p>}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl bg-white p-6 rounded-lg shadow"
      >
        <div>
          <label className="block font-medium mb-1">Father’s Name</label>
          <input
            type="text"
            name="fatherName"
            placeholder="Father Name"
            value={formData.fatherName}
            onChange={handleChange}
            className="border w-full p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Mother’s Name</label>
          <input
            type="text"
            name="motherName"
            placeholder="Mother Name"
            value={formData.motherName}
            onChange={handleChange}
            className="border w-full p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="border w-full p-2 rounded"
            required
          >
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
            <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Marital Status</label>
          <select
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleChange}
            className="border w-full p-2 rounded"
            required
          >
            <option value="">Select Marital Status</option>
            <option value="SINGLE">Single</option>
            <option value="MARRIED">Married</option>
            <option value="DIVORCED">Divorced</option>
            <option value="WIDOWED">Widowed</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Education</label>
          <select
            name="education"
            value={formData.education}
            onChange={handleChange}
            className="border w-full p-2 rounded"
            required
          >
            <option value="">Select Education</option>
            <option value="UNDERGRADUATE">Undergraduate</option>
            <option value="GRADUATE">Graduate</option>
            <option value="POST_GRADUATE">Post Graduate</option>
            <option value="DOCTORATE">Doctorate</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Residential Status</label>
          <select
            name="residentialStatus"
            value={formData.residentialStatus}
            onChange={handleChange}
            className="border w-full p-2 rounded"
            required
          >
            <option value="">Select Residential Status</option>
            <option value="RESIDENT_INDIVIDUAL">Resident Individual</option>
            <option value="NRI">NRI</option>
            <option value="FOREIGN_NATIONAL">Foreign National</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Occupation Type</label>
          <select
            name="occupationType"
            value={formData.occupationType}
            onChange={handleChange}
            className="border w-full p-2 rounded"
            required
          >
            <option value="">Select Occupation Type</option>
            <option value="PRIVATE_SECTOR">Private Sector</option>
            <option value="PUBLIC_SECTOR">Public Sector</option>
            <option value="GOVERNMENT_SERVICE">Government Service</option>
            <option value="BUSINESS">Business</option>
            <option value="PROFESSIONAL">Professional</option>
            <option value="STUDENT">Student</option>
            <option value="RETIRED">Retired</option>
            <option value="HOUSEWIFE">Housewife</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Country of Birth</label>
          <input
            type="text"
            name="countryOfBirth"
            value={formData.countryOfBirth}
            onChange={handleChange}
            className="border w-full p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Nationality</label>
          <input
            type="text"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            className="border w-full p-2 rounded"
          />
        </div>

        <div className="col-span-1 md:col-span-2 flex justify-center mt-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save and Continue"}
          </button>
        </div>
      </form>
    </div>
  )
}
