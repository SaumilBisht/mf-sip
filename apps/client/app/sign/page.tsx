"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function Sign() {
  const router = useRouter()
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/status`,
          { withCredentials: true }
        )
        const data = res.data
        if (data.currentStep < 6) router.push("/bankdetails")
        else if (data.currentStep>6)router.push("/dashboard")
      } catch (err) {
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }
    checkStatus()
  }, [router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!["image/jpeg", "image/png", "image/jpg"].includes(selected.type)) {
      alert("Only JPG, JPEG, or PNG allowed.");
      return;
    }
    if (selected.size > 50 * 1024) {
      alert("File must be under 50KB.");
      return;
    }
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) return alert("Select a signature image first.");
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("signature", file);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/signature/user`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.signatureKey) {
        alert("Signature uploaded successfully!");
        setSignatureUrl(res.data.signatureKey);
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleFetchSignature = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/signature/user`,
        { withCredentials: true }
      );
      setSignatureUrl(res.data.signatureUrl);
    } catch {
      alert("No signature found.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-64px)] pt-12 pb-12 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 border">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Upload Your Signature
        </h1>

        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
                     file:rounded-full file:border-0 file:text-sm file:font-semibold 
                     file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        {previewUrl && (
          <div className="mt-6 text-center">
            <p className="text-gray-700 text-sm mb-2">Preview:</p>
            <img
              src={previewUrl}
              alt="preview"
              className="rounded-lg shadow-md mx-auto border max-h-48"
            />
          </div>
        )}

        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
          >
            {uploading ? "Uploading..." : "Upload Signature"}
          </button>

          <button
            onClick={handleFetchSignature}
            className="bg-green-600 text-white font-medium py-2 rounded-md hover:bg-green-700 transition"
          >
            Fetch Saved Signature
          </button>
        </div>

        {signatureUrl && (
          <div className="mt-8 text-center">
            <p className="text-gray-700 text-sm mb-2">Your saved signature:</p>
            <img
              src={signatureUrl}
              alt="user signature"
              className="rounded-lg shadow-md mx-auto border max-h-48"
            />
          </div>
        )}
      </div>
    </div>
  )
}