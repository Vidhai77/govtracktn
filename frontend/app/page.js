"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "../components/Navbar";

const Home = () => {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email || !password) {
      alert("Email and Password are required!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      const { token, role: backendRole } = response.data;

      if (token) {
        localStorage.setItem("authToken", token);
      }

      if (
        (role === "gov" &&
          backendRole !== "Collector" &&
          backendRole !== "Department_Head") ||
        (role === "tenderer" && backendRole !== "Tender_Group")
      ) {
        alert(
          "Selected role does not match your account role. Please select the correct role."
        );
        return;
      }

      if (backendRole === "Collector") {
        router.push("/collector");
      } else if (backendRole === "Department_Head") {
        router.push("/dhead");
      } else if (backendRole === "Tender_Group") {
        router.push("/tenderer");
      } else {
        alert("Unauthorized Role!");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div>
      <Navbar />
      <hr />
      <div className="flex flex-col w-[50%] mt-20 mx-auto items-center gap-4">
        <h1 className="text-4xl font-bold text-center">Select Your Role</h1>
        <select
          className="mt-2 p-2 rounded-md border border-gray-300 w-full text-center"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">-- Select Role --</option>
          <option value="gov">Government Officials</option>
          <option value="tenderer">Tenderer</option>
        </select>

        {role && (
          <div className="flex flex-col w-full gap-4">
            <input
              type="email"
              placeholder="Email"
              className="p-2 rounded-md border border-gray-300 text-center"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="p-2 rounded-md border border-gray-300 text-center"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}

        <button
          type="button"
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>

      {/* Project Concept Section */}
      <div className="mt-16 p-6 bg-gray-100 text-gray-800 w-[90%] mx-auto rounded-lg shadow-md text-justify">
        <h2 className="text-3xl font-bold text-center text-green-700">
          GovTrack TN - A Smarter Way to Manage Government Projects
        </h2>

        <p className="mt-4 text-lg">
          <strong>GovTrack TN</strong> is a cutting-edge digital platform
          developed to enhance efficiency in government project management
          across Tamil Nadu. It enables seamless coordination between various
          administrative levels, ensuring real-time visibility into ongoing
          projects. With a focus on transparency and streamlined operations, it
          helps in tracking progress, allocating resources, and preventing
          delays in public infrastructure development.
        </p>

        <h3 className="mt-6 text-2xl font-semibold text-gray-900">
          🚀 Key Features
        </h3>

        <ul className="list-disc list-inside mt-4 text-lg">
          <li>
            <strong>Role-Based Access Control:</strong> The platform ensures
            secure logins for different user roles such as Collectors,
            Department Heads, and Tender Groups. Each user has specific
            permissions and responsibilities, ensuring data security and
            structured delegation of tasks. This mechanism prevents unauthorized
            access and ensures smooth workflow management.
          </li>
          <li>
            <strong>Real-Time Project Tracking:</strong> Administrators can
            monitor the progress of multiple projects with up-to-date status
            reports. The system enables tracking of delays, project milestones,
            and funding utilization in a centralized manner. It allows
            authorities to take proactive measures for timely completion of
            public works.
          </li>
          <li>
            <strong>Integrated Dashboard:</strong> A comprehensive dashboard
            provides a visual representation of active projects, tenders, and
            departmental activities. Users can access detailed reports, charts,
            and status updates to assess project efficiency. This centralized
            information hub helps in informed decision-making and quick
            resolution of bottlenecks.
          </li>
          <li>
            <strong>Workflow Automation:</strong> The system automates key
            administrative tasks such as project approvals, tender processing,
            and progress documentation. By reducing paperwork and manual
            interventions, it speeds up decision-making and improves
            accountability. Automation minimizes human errors and enhances
            operational efficiency.
          </li>
        </ul>

        <h3 className="mt-6 text-2xl font-semibold text-gray-900">
          👥 User Roles & Responsibilities
        </h3>

        <div className="mt-4 text-lg">
          <h4 className="font-bold text-green-700">📌 Collector</h4>
          <p>
            ➡️ The Collector holds the highest authority within the system,
            overseeing all government projects. They have the ability to
            initiate new projects, allocate responsibilities to Department
            Heads, and review progress updates. Their role ensures strategic
            decision-making and overall project efficiency.
          </p>

          <h4 className="font-bold text-green-700 mt-4">📌 Department Head</h4>
          <p>
            ➡️ The Department Head is responsible for managing and supervising
            projects under their department. They play a crucial role in
            updating project tenders, assigning work to Tender Groups, and
            ensuring compliance with government regulations. Their timely
            intervention helps in resolving operational challenges.
          </p>

          <h4 className="font-bold text-green-700 mt-4">📌 Tender Group</h4>
          <p>
            ➡️ The Tender Group handles project execution by updating progress
            statuses and submitting periodic reports. They coordinate with
            contractors, track milestone completions, and ensure adherence to
            project timelines. Their role is essential in maintaining quality
            standards and delivering projects as per government guidelines.
          </p>
        </div>

        <h3 className="mt-6 text-2xl font-semibold text-gray-900">
          🔍 Why GovTrack TN?
        </h3>

        <ul className="list-disc list-inside mt-4 text-lg">
          <li>
            <strong>Boosts Transparency:</strong> The system eliminates
            traditional paperwork and manual records, reducing chances of
            discrepancies. Every project update is recorded in real-time, making
            it easier to track progress and detect irregularities. This ensures
            accountability at every level of administration.
          </li>
          <li>
            <strong>Enhances Efficiency:</strong> With an integrated workflow
            and automation, GovTrack TN significantly reduces administrative
            delays. Real-time tracking of tenders and projects helps prevent
            inefficiencies, allowing authorities to intervene whenever
            necessary. It streamlines operations and improves project turnaround
            time.
          </li>
          <li>
            <strong>Ensures Fair Tender Management:</strong> By digitizing the
            tendering process, the platform ensures fairness, transparency, and
            compliance with government procurement rules. It minimizes errors,
            prevents favoritism, and allows for competitive bidding among
            contractors. This leads to cost-effective and high-quality project
            execution.
          </li>
        </ul>

        <p className="mt-6 text-lg font-semibold text-gray-900">
          ✅ <strong>GovTrack TN</strong> is a revolutionary step towards
          digital governance, enabling better coordination, timely project
          execution, and improved public infrastructure development. With its
          structured approach and real-time insights, it ensures that government
          projects are completed efficiently and transparently.
        </p>
      </div>

      {/* Tamil Nadu Government Information Section */}
      <div className="mt-16 p-6 bg-gray-100 text-gray-800 w-[90%] mx-auto rounded-lg shadow-md text-justify">
        <h2 className="text-3xl font-bold text-center text-green-700">
          Tamil Nadu Government: Governance & Development
        </h2>

        <h3 className="mt-6 text-2xl font-semibold text-gray-900">
          🌐 Digital Initiatives & E-Governance
        </h3>
        <ul className="list-disc list-inside mt-4 text-lg">
          <li>
            <strong>Tamil Nadu e-Governance Agency (TNeGA):</strong> The TNeGA
            plays a crucial role in driving digital transformation across
            government departments. It ensures seamless online service delivery
            to citizens through various digital platforms. The agency focuses on
            enhancing accessibility, efficiency, and transparency in government
            processes.
          </li>
          <li>
            <strong>Digitized Land Records:</strong> Tamil Nadu has digitized
            essential land documents such as Patta, Chitta, and Encumbrance
            Certificates (EC). This initiative allows citizens to access
            land-related information online without visiting government offices.
            It significantly reduces fraud, enhances record security, and speeds
            up land transactions.
          </li>
          <li>
            <strong>Blockchain Initiative:</strong> The government is leveraging
            blockchain technology to secure crucial documents like land records
            and academic certificates. This ensures data integrity, prevents
            tampering, and provides verifiable proof of authenticity. Blockchain
            implementation enhances trust and efficiency in official
            transactions.
          </li>
          <li>
            <strong>e-Sevai Centers:</strong> These centers serve as one-stop
            solutions for citizens to access government services such as birth
            certificates, income certificates, and bill payments. They are
            strategically located across the state to improve digital inclusion.
            By reducing dependency on physical government offices, they make
            public services more accessible.
          </li>
        </ul>

        <h3 className="mt-6 text-2xl font-semibold text-gray-900">
          🏗 Infrastructure & Smart City Development
        </h3>
        <ul className="list-disc list-inside mt-4 text-lg">
          <li>
            <strong>Chennai Metro Phase II:</strong> The second phase of the
            Chennai Metro project aims to expand the city's public transport
            network. It will improve connectivity, ease traffic congestion, and
            encourage the use of eco-friendly transport. The project is expected
            to significantly reduce travel time across major city routes.
          </li>
          <li>
            <strong>Smart Cities Mission:</strong> Under this initiative, cities
            in Tamil Nadu are being transformed with modern infrastructure,
            smart traffic systems, and improved waste management. Advanced
            surveillance and digital monitoring ensure better urban security.
            The mission focuses on sustainable urban development through
            technology-driven solutions.
          </li>
          <li>
            <strong>Healthcare Infrastructure:</strong> The government is
            enhancing medical facilities with projects like AIIMS Madurai and
            upgraded hospitals. These initiatives aim to improve healthcare
            accessibility, especially in rural areas. Modern equipment, digital
            health records, and telemedicine services are also being introduced.
          </li>
        </ul>

        <h3 className="mt-6 text-2xl font-semibold text-gray-900">
          📜 Major Welfare Schemes
        </h3>
        <ul className="list-disc list-inside mt-4 text-lg">
          <li>
            <strong>Pudhumai Penn Scheme:</strong> This scheme provides ₹1000
            per month to girl students from government schools, encouraging
            higher education. The financial aid helps students from economically
            weaker backgrounds continue their studies. It aims to reduce dropout
            rates and empower young women through education.
          </li>
          <li>
            <strong>Kalaignar Insurance Scheme:</strong> The scheme offers free
            medical treatment for eligible families in both government and
            private hospitals. It covers a wide range of diseases, surgeries,
            and advanced medical treatments. This initiative ensures healthcare
            accessibility for the economically disadvantaged.
          </li>
          <li>
            <strong>Uzhavar Sandhai (Farmers’ Market):</strong> This initiative
            allows farmers to sell their produce directly to consumers without
            middlemen. It ensures farmers receive fair prices while consumers
            get fresh, high-quality products at reasonable rates. By eliminating
            intermediaries, the scheme benefits both farmers and urban buyers.
          </li>
        </ul>

        <h3 className="mt-6 text-2xl font-semibold text-gray-900">
          🌿 Leadership in Renewable Energy
        </h3>
        <ul className="list-disc list-inside mt-4 text-lg">
          <li>
            <strong>Kamal Solar Mission:</strong> This mission focuses on
            increasing solar energy adoption across residential, commercial, and
            industrial sectors. The government offers incentives for rooftop
            solar installations to promote clean energy. Large-scale solar farms
            are being developed to enhance Tamil Nadu’s renewable energy
            capacity.
          </li>
          <li>
            <strong>Wind Energy Leadership:</strong> Tamil Nadu contributes
            nearly 30% of India's total wind energy production, making it a
            leader in renewable energy. The state continuously invests in wind
            power projects to expand its energy capacity. These efforts align
            with the goal of achieving energy self-sufficiency and
            sustainability.
          </li>
          <li>
            <strong>Electric Vehicle (EV) Policy:</strong> The EV policy
            promotes the adoption of electric vehicles through incentives,
            subsidies, and charging infrastructure expansion. It supports local
            manufacturing of EV components, boosting employment and
            technological growth. The policy aims to reduce carbon emissions and
            dependency on fossil fuels.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
