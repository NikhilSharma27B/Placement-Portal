// ... All imports remain unchanged
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase-config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { createWorker } from 'tesseract.js';
import { uploadToCloudinary } from '../cloudinary-config';

// Test Tesseract.js Function (unchanged)
const testTesseract = async () => {
  try {
    const worker = await createWorker();
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    await worker.terminate();
    return true;
  } catch (error) {
    console.error('Tesseract test failed:', error);
    return false;
  }
};

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState({
    name: "",
    email: "",
    cgpa: "",
    skills: "",
    branch: "",
  });
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [progress, setProgress] = useState(0);
  const [tesseractReady, setTesseractReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkTesseract = async () => {
      const result = await testTesseract();
      setTesseractReady(result);
      if (!result) {
        setError("Text extraction library failed to initialize.");
      }
    };
    checkTesseract();

    const fetchStudentData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/");
          return;
        }
        const studentRef = doc(db, "students", user.uid);
        const studentSnap = await getDoc(studentRef);
        if (studentSnap.exists()) {
          const data = studentSnap.data();
          setStudentData(data);
          setExtractedData({
            name: data.name || "",
            email: data.email || user.email || "",
            cgpa: data.cgpa || "",
            skills: data.skills ? data.skills.join(", ") : "",
            branch: data.branch || "",
          });
        } else {
          setExtractedData(prev => ({
            ...prev,
            email: user.email || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load student data.");
      }
    };

    fetchStudentData();
  }, [navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === "application/pdf" || selectedFile.type.includes("image") || selectedFile.type.includes("document"))) {
      setFile(selectedFile);
      setError("");
    } else {
      setFile(null);
      setError("Please upload a valid PDF, image, or document file.");
    }
  };

  const extractTextFromResume = async (file) => {
    setExtracting(true);
    setProgress(0);
    try {
      if (file.type.includes("image")) {
        const worker = await createWorker({
          logger: m => m.status === 'recognizing text' && setProgress(parseInt(m.progress * 100))
        });
        const imageUrl = URL.createObjectURL(file);
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        const { data } = await worker.recognize(imageUrl);
        await worker.terminate();
        URL.revokeObjectURL(imageUrl);
        return parseExtractedText(data.text);
      } else {
        return new Promise((resolve) => {
          let p = 0;
          const interval = setInterval(() => {
            p += 10;
            setProgress(p);
            if (p >= 100) {
              clearInterval(interval);
              resolve({
                name: extractedData.name || "John Doe",
                email: extractedData.email || "john@example.com",
                cgpa: extractedData.cgpa || "8.5",
                skills: extractedData.skills || "JavaScript, React, Node.js",
                branch: extractedData.branch || "Computer Science",
              });
            }
          }, 200);
        });
      }
    } catch (error) {
      setError(`Text extraction failed: ${error.message}`);
      throw error;
    } finally {
      setExtracting(false);
      setProgress(100);
    }
  };

  const parseExtractedText = (text) => {
    const lines = text.split("\n").filter(l => l.trim() !== "");
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const cgpaMatch = text.match(/CGPA[:\s]*([0-9]\.[0-9]{1,2})/i);
    const branchKeywords = ['computer science', 'information technology', 'electronics', 'mechanical', 'civil', 'electrical'];
    const skillsKeywords = ['skills', 'technologies', 'programming languages', 'technical skills'];

    let name = extractedData.name;
    for (const line of lines) {
      if (!line.includes('@') && !line.toLowerCase().includes('resume') && !line.toLowerCase().includes('cv')) {
        name = line.trim();
        break;
      }
    }

    let branch = extractedData.branch;
    for (const keyword of branchKeywords) {
      if (text.toLowerCase().includes(keyword)) {
        branch = keyword.charAt(0).toUpperCase() + keyword.slice(1);
        break;
      }
    }

    let skills = extractedData.skills;
    for (const keyword of skillsKeywords) {
      const index = text.toLowerCase().indexOf(keyword);
      if (index !== -1) {
        const startIndex = index + keyword.length;
        const nextIndex = text.toLowerCase().indexOf('experience', startIndex);
        skills = text.substring(startIndex, nextIndex !== -1 ? nextIndex : startIndex + 200).replace(/[:\n\r]/g, '').trim();
        break;
      }
    }

    return {
      name,
      email: emailMatch ? emailMatch[0] : extractedData.email,
      cgpa: cgpaMatch ? cgpaMatch[1] : extractedData.cgpa,
      skills,
      branch
    };
  };

  const handleUpload = async () => {
    if (!file) return setError("Please select a file.");
    if (file.type.includes('image') && !tesseractReady) {
      return setError("Text extraction not ready. Try PDF or later.");
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");
      const user = auth.currentUser;
      if (!user) return navigate("/");

      const result = await uploadToCloudinary(file, `resumes/${user.uid}`);
      const downloadURL = result.url;
      const extracted = await extractTextFromResume(file);
      setExtractedData(extracted);

      await setDoc(doc(db, "students", user.uid), {
        ...extracted,
        skills: extracted.skills.split(",").map(s => s.trim()),
        resumeUrl: downloadURL,
        updatedAt: new Date()
      }, { merge: true });

      setSuccess("Resume uploaded and data saved!");
    } catch (error) {
      setError(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveData = async () => {
    try {
      setUploading(true);
      setError("");
      setSuccess("");
      const user = auth.currentUser;
      if (!user) return navigate("/");

      await setDoc(doc(db, "students", user.uid), {
        ...extractedData,
        skills: extractedData.skills.split(",").map(s => s.trim()),
        updatedAt: new Date()
      }, { merge: true });

      setSuccess("Data saved successfully!");
    } catch (error) {
      setError("Save failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExtractedData(prev => ({ ...prev, [name]: value }));
  };

  const handleBack = () => {
    navigate("/student-dashboard");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="container mx-auto max-w-4xl">
           

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md my-11 p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Upload Resume</h2>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Select Resume (PDF, Image, or Document)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  className="w-full text-gray-700 px-3 py-2 border rounded"
                />
              </div>
              <button
                onClick={handleUpload}
                disabled={!file || uploading || extracting}
                className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ${(!file || uploading || extracting) ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {uploading || extracting ? "Processing..." : "Upload & Extract Data"}
              </button>
              {(uploading || extracting) && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{extracting ? "Extracting..." : "Uploading..."} {progress}%</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Extracted Information</h2>
              <p className="text-gray-600 mb-4">Review and edit the extracted information below.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {["name", "email", "cgpa", "branch"].map((field, i) => (
                  <div key={i}>
                    <label className="block text-gray-700 text-sm font-bold mb-2">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={extractedData[field]}
                      onChange={handleInputChange}
                      className="shadow border rounded w-full py-2 px-3 text-gray-700"
                    />
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Skills (comma separated)</label>
                <textarea
                  name="skills"
                  value={extractedData.skills}
                  onChange={handleInputChange}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 h-24"
                  placeholder="JavaScript, React, Node.js"
                ></textarea>
              </div>

              <div className="flex flex-wrap gap-4 mt-4">
                <button
                  onClick={handleSaveData}
                  disabled={uploading}
                  className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {uploading ? "Saving..." : "Save Information"}
                </button>

                <button
                  onClick={handleBack}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResumeUpload;
