// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../Components/Navbar";
// import api from "../services/api";

// const AddUser = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     fatherName: "",
//     motherName: "",
//     phone: "",
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await api.post("/users", formData);

//       alert("User Added Successfully");

//       navigate("/");
//     } catch (error) {
//       console.log(error);

//       alert("Something Went Wrong");
//     }
//   };

//   return (
//     <>
//       <Navbar />

//       <div className="max-w-xl mx-auto mt-10 shadow-lg p-5 rounded">

//         <h2 className="text-3xl font-bold mb-5 text-center">
//           Add User
//         </h2>

//         <form onSubmit={handleSubmit}>

//           <input
//             type="text"
//             name="name"
//             placeholder="Name"
//             className="border w-full p-3 mb-4 rounded"
//             onChange={handleChange}
//             value={formData.name}
//           />

//           <input
//             type="text"
//             name="fatherName"
//             placeholder="Father Name"
//             className="border w-full p-3 mb-4 rounded"
//             onChange={handleChange}
//             value={formData.fatherName}
//           />

//           <input
//             type="text"
//             name="motherName"
//             placeholder="Mother Name"
//             className="border w-full p-3 mb-4 rounded"
//             onChange={handleChange}
//             value={formData.motherName}
//           />

//           <input
//             type="text"
//             name="phone"
//             placeholder="Phone"
//             className="border w-full p-3 mb-4 rounded"
//             onChange={handleChange}
//             value={formData.phone}
//           />

//           <button
//             className="bg-blue-600 text-white w-full p-3 rounded"
//           >
//             Save User
//           </button>

//         </form>

//       </div>
//     </>
//   );
// };

// export default AddUser;