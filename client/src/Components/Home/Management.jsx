import {
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

import monirImg from "../../assets/monir.png";
import rokibImg from "../../assets/rokib.png";
import kofilImg from "../../assets/kofil.png";

const Management = () => {
  const members = [
    {
      name: "Md.Mazarul Islam Monir",
      position: "Owner & Proprietor ",
      phone: "01749315693",
      email: "msmonir511@gmail.com",
      image: monirImg,
    },
    {
      name: "Md.Rakibul Islam Rokib",
      position: "Director",
      phone: "01918710990",
      email: "rokib@gmail.com",
      image: rokibImg,
    },
    {
      name: "Md.Kawser Hossen Kofil",
      position: "Managing Director",
      phone: "01964767311",
      email: "kofil@gmail.com",
      image: kofilImg,
    },
  ];

  return (
    <section id="management" className="bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-green-700 font-semibold uppercase tracking-wider text-sm">
            Our Leadership
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
            Owner &amp;
            <span className="text-green-700"> Directors</span>
          </h2>

          <p className="text-gray-600 mt-4">
            Meet the leadership team behind M.R.K TRADERS.
          </p>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {members.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >

              {/* Photo */}
              <div className="h-80 bg-gray-100 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Information */}
              <div className="p-7 text-center">


                <h3 className="text-2xl font-bold  text-slate-900">
                  {member.name}
                </h3>

                <p className="text-green-700 font-semibold mt-2">
                  {member.position}
                </p>

                <div className="-mt-2 pt-5 border-t border-gray-100 space-y-3">

                  <a
                    href={`tel:${member.phone}`}
                    className="flex justify-center items-center gap-2 text-gray-600 hover:text-green-700 transition"
                  >
                    <FaPhoneAlt className="text-green-700" />
                    <span>{member.phone}</span>
                  </a>

                  <a
                    href={`mailto:${member.email}`}
                    className="flex justify-center -mt-3 items-center gap-2 text-gray-600 hover:text-green-700 transition break-all"
                  >
                    <FaEnvelope className="text-green-700" />
                    <span>{member.email}</span>
                  </a>

                </div>
              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default Management;