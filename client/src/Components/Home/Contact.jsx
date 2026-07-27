import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";

const Contact = () => {
  return (
    <section id="contact" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-green-700 font-semibold uppercase tracking-wider text-sm">
            Contact Us
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
            Get in Touch with
            <span className="text-green-700"> M.R.K TRADERS</span>
          </h2>

          <p className="text-gray-600 mt-4 leading-relaxed">
            Contact us for business inquiries, product information,
            supply requirements or other business-related assistance.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-stretch">

          {/* Left - Contact Information */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-10 shadow-xl">

            <h3 className="text-2xl font-bold">
              Contact Information
            </h3>

            <p className="text-gray-400 mt-3 mb-8">
              We are available to assist with your business inquiries.
            </p>

            <div className="space-y-6">

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-green-600 flex items-center justify-center">
                  <FaPhoneAlt />
                </div>

                <div>
                  <p className="text-gray-400 text-sm">
                    Phone
                  </p>

                  <p className="font-semibold mt-1">
                    01749315693 
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-green-600 flex items-center justify-center">
                  <FaEnvelope />
                </div>

                <div>
                  <p className="text-gray-400 text-sm">
                    Email
                  </p>

                  <p className="font-semibold mt-1">
                    msmonir511@gmail.com
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-green-600 flex items-center justify-center">
                  <FaMapMarkerAlt />
                </div>

                <div>
                  <p className="text-gray-400 text-sm">
                    Business Address
                  </p>

                  <p className="font-semibold mt-1">
                    শহিদ মির্নারের পশ্চিম পাশ্বে, সরকাড়ি কলেজ রোড, রৌমারি,কুড়িগ্রাম
                  </p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-green-600 flex items-center justify-center">
                  <FaClock />
                </div>

                <div>
                  <p className="text-gray-400 text-sm">
                    Business Hours
                  </p>

                  <p className="font-semibold mt-1">
                    সকাল: ৯:০০ থেকে রাত:- ১০:০০ পর্যন্ত আপনাদের সেবা চালু থাকবে।
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right - Contact Form */}
          <div className="bg-slate-50 border border-gray-200 rounded-3xl p-8 md:p-10 shadow-sm">

            <h3 className="text-2xl font-bold text-slate-900">
              Send Us a Message
            </h3>

            <p className="text-gray-600 mt-2 mb-7">
              Fill in the form below and we will get back to you.
            </p>

            <form className="space-y-5">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone or Email
                </label>

                <input
                  type="text"
                  placeholder="Enter phone or email"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject
                </label>

                <input
                  type="text"
                  placeholder="Business inquiry"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message
                </label>

                <textarea
                  rows="5"
                  placeholder="Write your message..."
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                ></textarea>
              </div>

              <button
                type="button"
                className="w-full bg-green-700 hover:bg-green-800 text-white py-3.5 rounded-xl font-semibold transition duration-300"
              >
                Send Message
              </button>

            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;