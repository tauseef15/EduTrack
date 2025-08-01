import React, { useState, useEffect } from "react";
import axios from "axios";

function Profile() {
  const [formData, setFormData] = useState({
    title: "",
    name: "",
    gender: "",
    dob: "",
    phone: "",
    email: "",
    placeOfBirth: "",
    bloodGroup: "",
    nationality: "",
    aadhaar: "",
    address: "",
    dpUrl: "", // Displaying the profile picture URL
  });

  const [dp, setDp] = useState(null); // File selected
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/student/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { profilePicture, ...rest } = res.data;
        setFormData({ ...rest, dpUrl: profilePicture });
      } catch (err) {
        console.error("❌ Error fetching profile:", err.message);
      }
    };

    fetchProfile();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDpChange = (e) => {
    const file = e.target.files[0];
    if (file) setDp(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();

      // Append text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "dpUrl") data.append(key, value);
      });

      // Append file if changed
      if (dp) data.append("dp", dp); // 👈 Make sure backend expects this field

      const res = await axios.put(
        "http://localhost:3000/api/student/profile",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { profilePicture } = res.data.student;
      setFormData((prev) => ({ ...prev, dpUrl: profilePicture }));
      setDp(null);
      alert("✅ Profile updated!");
    } catch (error) {
      console.error(
        "❌ Error updating profile:",
        error.response?.data || error.message
      );
      alert("Something went wrong while updating profile.");
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-orange-600">Profile</h2>

      {/* Profile Picture */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-24 h-24 rounded-full border-2 border-orange-400 overflow-hidden">
          {dp ? (
            <img
              src={URL.createObjectURL(dp)}
              alt="Preview"
              className="object-cover w-full h-full"
            />
          ) : formData.dpUrl ? (
            <img
              src={`http://localhost:3000/uploads/${formData.dpUrl}`}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-orange-400">
              No Image
            </div>
          )}
        </div>

        <label className="text-sm">
          <span className="block mb-1 font-medium text-orange-700">
            Upload Profile Picture
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleDpChange}
            className="text-sm text-orange-700 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200"
          />
        </label>
      </div>

      {/* Form */}
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={handleSubmit}
      >
        {[
          ["title", "Title", "select", ["MR", "MS", "MRS"]],
          ["name", "Full Name"],
          ["gender", "Gender", "select", ["MALE", "FEMALE", "OTHER"]],
          ["dob", "Date of Birth", "date"],
          ["phone", "Mobile", "tel"],
          ["email", "Email", "email"],
          ["placeOfBirth", "Place of Birth"],
          [
            "bloodGroup",
            "Blood Group",
            "select",
            ["O+", "A+", "B+", "AB+", "O-"],
          ],
          ["nationality", "Nationality", "select", ["INDIAN", "OTHER"]],
          ["aadhaar", "Aadhaar Number"],
        ].map(([name, label, type = "text", options]) => (
          <div key={name}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            {type === "select" ? (
              <select
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                className="w-full border border-orange-300 rounded p-2"
              >
                <option value="">Select</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                readOnly={name === "email"} // 👈 Make email read-only
                className={`w-full border border-orange-300 rounded p-2 ${
                  name === "email" ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            )}
          </div>
        ))}

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Address</label>
          <textarea
            name="address"
            rows="3"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full border border-orange-300 rounded p-2"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
          >
            Submit Profile
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
