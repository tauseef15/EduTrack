import React, { useState, useEffect } from "react";
import axios from "axios";

function ProfileSummary() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    address: "",
    dpUrl: "",
  });

  const [dp, setDp] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/teacher/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { name, email, phone, description, address, dpUrl } = res.data;
        setFormData({ name, email, phone, description, address, dpUrl });
      } catch (err) {
        console.error("Error fetching profile:", err.message);
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
      const token = localStorage.getItem("token");
      const data = new FormData();
      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("email", formData.email);
      data.append("address", formData.address);
      data.append("description", formData.description);
      if (dp) data.append("dp", dp);

      const res = await axios.put("http://localhost:3000/api/teacher/profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const { dpUrl } = res.data.teacher;
      setFormData((prev) => ({ ...prev, dpUrl }));
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
    }
  };

  return (
    <div className="relative">
      <h1 className="text-2xl sm:text-3xl font-bold text-orange-600">Profile</h1>

      {/* Profile Picture */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-1 md:mt-10">
        <div className="w-24 h-24 rounded-full border-2 border-orange-400 overflow-hidden">
          {dp ? (
            <img src={URL.createObjectURL(dp)} alt="Preview" className="object-cover w-full h-full" />
          ) : formData.dpUrl ? (
            <img src={formData.dpUrl} alt="Profile" className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-orange-400">No Image</div>
          )}
        </div>

        <label className="text-sm">
          <span className="block mb-1 font-medium text-orange-700">Upload Profile Picture</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleDpChange}
            className="text-sm text-orange-700 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200"
          />
        </label>
      </div>

      {/* Form */}
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8" onSubmit={handleSubmit}>
        {[
          ["name", "Full Name"],
          ["email", "Email", "email"],
          ["phone", "Phone", "tel"],
          ["description", "Description"],
          ["address", "Address"],
        ].map(([name, label, type = "text"]) => (
          <div key={name} className={name === "address" ? "md:col-span-2" : ""}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            {name === "address" ? (
              <textarea
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full border border-orange-300 rounded p-2"
              />
            ) : (
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                readOnly={name === "email"}
                className={`w-full border border-orange-300 rounded p-2 ${
                  name === "email" ? "bg-orange-200 cursor-not-allowed" : ""
                }`}
              />
            )}
          </div>
        ))}

        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded w-full sm:w-auto"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileSummary;
