import React, { useEffect, useState } from "react";
import axios from "axios";

const TeacherDashboard = () => {
  const [stats, setStats] = useState({
    classrooms: 0,
    students: 0,
    tests: 0,
    announcements: 0,
  });
  const [upcomingTests, setUpcomingTests] = useState([]);
  const [recentTests, setRecentTests] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [clsRes, testRes, annRes, noticeRes] = await Promise.all([
        axios.get("https://edutrack-qldm.onrender.com/api/teacher/classrooms", config),
        axios.get("https://edutrack-qldm.onrender.com/api/teacher/tests", config),
        axios.get("https://edutrack-qldm.onrender.com/api/teacher/announcements", config),
        axios.get("https://edutrack-qldm.onrender.com/api/teacher/notice", config),
      ]);

      setClassrooms(clsRes.data || []);
      setUpcomingTests(testRes.data || []);
      setRecentTests((testRes.data || []).slice(0, 2));
      setAnnouncements((annRes.data || []).slice(0, 2));
      setNotices((noticeRes.data || []).slice(0, 2));

      setStats({
        classrooms: clsRes.data.length,
        students: clsRes.data.reduce(
          (acc, cls) => acc + cls.students.length,
          0
        ),
        tests: testRes.data.length, 
        announcements: annRes.data.length,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-semibold mb-4">
        Welcome, <span className="text-orange-600">Teacher</span> 👋
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        <Card title="Classrooms" value={stats.classrooms} />
        <Card title="Students" value={stats.students} />
        <Card title="Tests Uploaded" value={stats.tests} />
        <Card title="Announcements" value={stats.announcements} />
      </div>

      {/* Classrooms Overview */}
      <Section title="🏫 Classrooms Overview">
        <div className="rounded-md border border-orange-300 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[200px] w-full">
              <div className="h-[140px] md:h-[220px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-orange-200 sticky top-0 z-10">
                    <tr>
                      <th className="p-1 md:p-2 lg:p-3">Classroom</th>
                      <th className="p-1 md:p-2 lg:p-3">Students</th>
                      <th className="p-1 md:p-2 lg:p-3">Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classrooms.map((cls) => (
                      <tr key={cls._id} className="border-t hover:bg-orange-50">
                        <td className="p-1 md:p-2 lg:p-3 text-center">{cls.name}</td>
                        <td className="p-1 md:p-2 lg:p-3 text-center">{cls.students.length}</td>
                        <td className="p-1 md:p-2 lg:p-3 text-center ">{cls.code}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Announcements and Tests */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Recent Announcements */}
        <div className="w-full md:w-1/2">
          <Section title="📢 Recent Announcements">
            <div className="space-y-3">
              {announcements.length > 0 ? (
                announcements.map((ann) => (
                  <div
                    key={ann._id}
                    className="bg-white p-2 md:p-4 rounded shadow text-sm"
                  >
                    <p className="font-semibold text-orange-600">{ann.title}</p>
                    <p className="text-gray-800">{ann.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {ann.classroom?.name} •{" "}
                      {new Date(ann.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))        
              ) : (
                <p className="text-gray-500 text-xs sm:text-md lg:text-lg">No announcements yet.</p>
              )}
            </div>
          </Section>
        </div>

        {/* Recent Tests */}
        <div className="w-full md:w-1/2">
          <Section title="📝 Recent Tests Uploaded">
            <div className="space-y-3">
              {recentTests.length > 0 ? (
                recentTests.map((test) => (
                  <div
                    key={test._id}
                    className="bg-white p-2 md:p-4 rounded shadow text-sm"
                  >
                    <p className="font-semibold text-orange-600">
                      {test.title}
                    </p>
                    <p className="text-xs md:text-sm text-gray-800 font-medium">{test.subject}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {test.classroom?.name} •{" "}
                      {new Date(test.testDate).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No tests uploaded yet.</p>
              )}
            </div>
          </Section>
        </div>
      </div>

      {/* Notices */}
      <Section title="📌 Notices / Recent Activities">
        <div className="space-y-3">
          {notices.length > 0 ? (
            notices.map((n) => (
              <div key={n._id} className="bg-white p-4 rounded shadow text-sm">
                <p className="text-gray-800">{n.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No recent activities yet.</p>
          )}
        </div>
      </Section>
    </div>
  );
};

// Reusable Card Component
const Card = ({ title, value }) => (
  <div className="bg-white p-2 md:p-4 rounded shadow text-center space-y-1">
    <p className="text-gray-500 text-xs md:text-sm">{title}</p>
    <p className="text-2xl font-bold text-orange-600">{value ?? 0}</p>
  </div>
);

// Reusable Section Component
const Section = ({ title, children }) => (
  <div className="mt-6">
    <h2 className="text-sm sm:text-lg font-semibold mb-2">{title}</h2>
    <div>{children}</div>
  </div>
);

export default TeacherDashboard;
