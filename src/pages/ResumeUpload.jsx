import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase-config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { createWorker } from 'tesseract.js';
import { uploadToCloudinary } from '../cloudinary-config';

// Test function to verify Tesseract.js functionality
const testTesseract = async () => {
  try {
    console.log('Testing Tesseract.js initialization...');
    const worker = await createWorker();
    console.log('Tesseract worker created successfully');
    await worker.load();
    console.log('Tesseract worker loaded successfully');
    await worker.loadLanguage('eng');
    console.log('Tesseract language loaded successfully');
    await worker.initialize('eng');
    console.log('Tesseract initialized successfully');
    await worker.terminate();
    console.log('Tesseract test completed successfully');
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
  
  // Using studentData state for storing fetched data
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [progress, setProgress] = useState(0);
  const [tesseractReady, setTesseractReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Test Tesseract.js on component mount
    const checkTesseract = async () => {
      const result = await testTesseract();
      setTesseractReady(result);
      if (!result) {
        setError("Warning: Text extraction library initialization failed. Resume text extraction may not work properly.");
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
          setExtractedData(prevData => ({
            ...prevData,
            email: user.email || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
        setError("Failed to load student data. Please try again.");
      }
    };

    fetchStudentData();
    // Only depend on navigate, not on extractedData to avoid infinite loops
  }, [navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === "application/pdf" || selectedFile.type.includes("image") || selectedFile.type.includes("document")) {
        setFile(selectedFile);
        setError("");
      } else {
        setFile(null);
        setError("Please upload a PDF, image, or document file.");
      }
    }
  };

  const extractTextFromResume = async (file) => {
    setExtracting(true);
    setProgress(0);
    
    try {
      console.log('Starting text extraction from file:', file.name, 'type:', file.type);
      
      // For image files, use Tesseract.js
      if (file.type.includes('image')) {
        console.log('Processing image file with Tesseract.js');
        const worker = await createWorker({
          logger: m => {
            console.log('Tesseract progress:', m);
            if (m.status === 'recognizing text') {
              setProgress(parseInt(m.progress * 100));
            }
          }
        });
        
        // Create a URL for the image file
        const imageUrl = URL.createObjectURL(file);
        console.log('Created image URL:', imageUrl);
        
        await worker.load();
        console.log('Tesseract worker loaded');
        await worker.loadLanguage('eng');
        console.log('Tesseract language loaded');
        await worker.initialize('eng');
        console.log('Tesseract initialized');
        
        const { data } = await worker.recognize(imageUrl);
        console.log('Tesseract recognition complete, extracted text:', data.text.substring(0, 100) + '...');
        await worker.terminate();
        
        // Revoke the URL to free up memory
        URL.revokeObjectURL(imageUrl);
        
        // Parse the extracted text
        const parsedData = parseExtractedText(data.text);
        console.log('Parsed data from image:', parsedData);
        return parsedData;
      } else {
        console.log('Processing non-image file, simulating extraction');
        // For non-image files, simulate extraction
        // In a real app, you would use a PDF parser or document parser
        return new Promise((resolve) => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            setProgress(progress);
            if (progress >= 100) {
              clearInterval(interval);
              // Simulate extraction with existing data or defaults
              const simulatedData = {
                name: extractedData.name || "John Doe",
                email: extractedData.email || "john.doe@example.com",
                cgpa: extractedData.cgpa || "8.5",
                skills: extractedData.skills || "JavaScript, React, Node.js",
                branch: extractedData.branch || "Computer Science",
              };
              console.log('Simulated data for non-image file:', simulatedData);
              resolve(simulatedData);
            }
          }, 200);
        });
      }
    } catch (error) {
      console.error("Error extracting text:", error);
      // Show a more user-friendly error message
      setError(`Failed to extract text from resume: ${error.message}`);
      throw error;
    } finally {
      setExtracting(false);
      setProgress(100);
    }
  };

  const parseExtractedText = (text) => {
    console.log('Starting to parse extracted text, length:', text.length);
    // Simple parsing logic - in a real app, this would be more sophisticated
    const lines = text.split('\n').filter(line => line.trim() !== '');
    console.log('Extracted lines count:', lines.length);
    
    // Try to extract email
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const emailMatch = text.match(emailRegex);
    const email = emailMatch ? emailMatch[0] : extractedData.email;
    console.log('Extracted email:', email, emailMatch ? '(found in text)' : '(using default)');
    
    // Try to extract CGPA
    const cgpaRegex = /CGPA[:\s]*([0-9]\.[0-9]{1,2})/i;
    const cgpaMatch = text.match(cgpaRegex);
    const cgpa = cgpaMatch ? cgpaMatch[1] : extractedData.cgpa;
    console.log('Extracted CGPA:', cgpa, cgpaMatch ? '(found in text)' : '(using default)');
    
    // Try to extract name (first line that's not email or contains specific keywords)
    let name = extractedData.name;
    for (const line of lines) {
      if (!line.includes('@') && !line.toLowerCase().includes('resume') && !line.toLowerCase().includes('cv')) {
        name = line.trim();
        console.log('Extracted name from line:', line);
        break;
      }
    }
    console.log('Final name value:', name);
    
    // Try to extract branch
    const branchKeywords = ['computer science', 'information technology', 'electronics', 'mechanical', 'civil', 'electrical'];
    let branch = extractedData.branch;
    for (const keyword of branchKeywords) {
      if (text.toLowerCase().includes(keyword)) {
        branch = keyword.charAt(0).toUpperCase() + keyword.slice(1);
        console.log('Found branch keyword:', keyword);
        break;
      }
    }
    console.log('Final branch value:', branch);
    
    // Try to extract skills
    const skillsKeywords = ['skills', 'technologies', 'programming languages', 'technical skills'];
    let skills = extractedData.skills;
    for (const keyword of skillsKeywords) {
      const index = text.toLowerCase().indexOf(keyword);
      if (index !== -1) {
        // Extract text after the keyword until the next section
        const startIndex = index + keyword.length;
        const nextSectionIndex = text.toLowerCase().indexOf('experience', startIndex);
        const endIndex = nextSectionIndex !== -1 ? nextSectionIndex : startIndex + 200;
        skills = text.substring(startIndex, endIndex).replace(/[:\n\r]/g, '').trim();
        console.log('Found skills section with keyword:', keyword, 'extracted:', skills.substring(0, 50) + '...');
        break;
      }
    }
    console.log('Final skills value:', skills);
    
    const result = {
      name,
      email,
      cgpa,
      skills,
      branch
    };
    
    console.log('Final parsed data:', result);
    return result;
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    // Check if Tesseract is ready for image files
    if (file.type.includes('image') && !tesseractReady) {
      setError("Text extraction library is not ready. Please try uploading a PDF file instead or try again later.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const user = auth.currentUser;
      if (!user) {
        console.error("No authenticated user found");
        setError("You must be logged in to upload a resume.");
        navigate("/");
        return;
      }

      console.log("Starting upload process for file:", file.name, "size:", file.size, "type:", file.type);

      // Upload file to Cloudinary instead of Firebase Storage
      console.log("Uploading to Cloudinary with folder path:", `resumes/${user.uid}`);
      const result = await uploadToCloudinary(file, `resumes/${user.uid}`);
      console.log("Cloudinary upload result:", result);
      const downloadURL = result.url;

      // Extract data from resume
      console.log("Starting text extraction from uploaded file");
      const extracted = await extractTextFromResume(file);
      console.log("Text extraction complete, setting extracted data:", extracted);
      setExtractedData(extracted);

      // Save to Firestore
      console.log("Saving extracted data to Firestore");
      const studentRef = doc(db, "students", user.uid);
      await setDoc(
        studentRef,
        {
          name: extracted.name,
          email: extracted.email,
          cgpa: extracted.cgpa,
          skills: extracted.skills.split(",").map((skill) => skill.trim()),
          branch: extracted.branch,
          resumeUrl: downloadURL,
          updatedAt: new Date(),
        },
        { merge: true }
      );
      console.log("Data successfully saved to Firestore");

      setSuccess("Resume uploaded and data extracted successfully!");
    } catch (error) {
      console.error("Error uploading resume:", error);
      // Provide more specific error messages based on the error type
      if (error.message && error.message.includes("Cloudinary")) {
        setError("Failed to upload resume to cloud storage. Please check your internet connection and try again.");
      } else if (error.message && error.message.includes("extract")) {
        setError("Failed to extract information from your resume. Please try a different file format or enter information manually.");
      } else if (error.message && error.message.includes("Firestore")) {
        setError("Failed to save your information. Please try again later.");
      } else {
        setError(`Failed to upload resume: ${error.message || "Unknown error"}. Please try again.`);
      }
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
      if (!user) {
        navigate("/");
        return;
      }

      // Save to Firestore
      const studentRef = doc(db, "students", user.uid);
      await setDoc(
        studentRef,
        {
          name: extractedData.name,
          email: extractedData.email,
          cgpa: extractedData.cgpa,
          skills: extractedData.skills.split(",").map((skill) => skill.trim()),
          branch: extractedData.branch,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      setSuccess("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      setError("Failed to save data. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExtractedData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold text-gray-800">Resume Upload</h1>
              <button
                onClick={handleBack}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Back to Dashboard
              </button>
            </div>

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

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
                className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ${(
                  !file || uploading || extracting
                )
                  ? "opacity-50 cursor-not-allowed"
                  : ""}`}
              >
                {uploading || extracting ? "Processing..." : "Upload & Extract Data"}
              </button>
              
              {(uploading || extracting) && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {extracting ? "Extracting data..." : "Uploading..."} {progress}%
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Extracted Information</h2>
              <p className="text-gray-600 mb-4">
                Review and edit the extracted information below.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={extractedData.name}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={extractedData.email}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    CGPA
                  </label>
                  <input
                    type="text"
                    name="cgpa"
                    value={extractedData.cgpa}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Branch
                  </label>
                  <input
                    type="text"
                    name="branch"
                    value={extractedData.branch}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Skills (comma separated)
                </label>
                <textarea
                  name="skills"
                  value={extractedData.skills}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                  placeholder="JavaScript, React, Node.js, etc."
                ></textarea>
              </div>

              <button
                onClick={handleSaveData}
                disabled={uploading}
                className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded ${
                  uploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {uploading ? "Saving..." : "Save Information"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResumeUpload;