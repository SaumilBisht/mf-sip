"use client"

import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function MobilePage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [mobile, setMobile] = useState("")
  const [otp, setOtp] = useState("")
  const [message, setMessage] = useState("")
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/status`,
          { withCredentials: true }
        )
        const data = res.data
        if (data.currentStep < 1) router.push("/dashboard")
        else if (data.currentStep > 1) router.push("/kyc")
      } catch (err) {
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }
    checkStatus()
  }, [router])


  useEffect(() => {
    if (resendTimer === 0 && timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [resendTimer])

  const startResendTimer = () => {
    setResendTimer(30)
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => prev - 1)
    }, 1000)
  }

  const handleSendOtp = async () => {
    if (!mobile.match(/^\d{10}$/)) return alert("Enter a valid 10-digit number")
    try {
      setSendingOtp(true)
      setMessage("")
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/otp`,
        { mobile },
        { withCredentials: true }
      )
      if (res.data.success) {
        setMessage("OTP sent successfully!")
        setOtpSent(true)
        startResendTimer()
      }
    } catch (err: any) {
      console.error(err)
      setMessage(err?.response?.data?.message || "Failed to send OTP")
    } finally {
      setSendingOtp(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendTimer > 0) return
    handleSendOtp()
  }

  const handleVerifyOtp = async () => {
    if (!otp.match(/^\d{6}$/)) return alert("Enter a valid 6-digit OTP")
    try {
      setVerifyingOtp(true)
      setMessage("")
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/otp/verify`,
        { mobile, otp },
        { withCredentials: true }
      )
      if (res.data.success) {
        setMessage("OTP verified! Redirecting...")
        setTimeout(() => router.push("/kyc"), 1000)
      }
    } catch (err: any) {
      console.error(err)
      setMessage(err?.response?.data?.message || "OTP verification failed")
    } finally {
      setVerifyingOtp(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-4">
      <h1 className="text-2xl font-bold">Mobile Verification (OTP)</h1>
      {message && <p className="text-sm text-red-600">{message}</p>}

      <div className="flex flex-col gap-2 w-full max-w-xs">
        {!otpSent && (
          <input
            type="text"
            placeholder="Enter mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
          />
        )}

        {!otpSent && (
          <button
            onClick={handleSendOtp}
            disabled={sendingOtp || !mobile}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {sendingOtp ? "Sending OTP..." : "Send OTP"}
          </button>
        )}
        
        {otpSent && (
          <>
            <div className="flex gap-2 items-center">
              <button
                onClick={handleResendOtp}
                disabled={resendTimer > 0}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
              >
                Resend OTP
              </button>
              {resendTimer > 0 && (
                <span className="text-sm text-gray-600">
                  Retry in {resendTimer}s
                </span>
              )}
            </div>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
            />
            <button
              onClick={handleVerifyOtp}
              disabled={verifyingOtp}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {verifyingOtp ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
