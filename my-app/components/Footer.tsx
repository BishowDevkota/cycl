'use client';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#005b5c] text-gray-100">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-8 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Product and Services */}
          <div>
            <h3 className="mb-4 border-b border-gray-400 pb-3 text-base font-semibold text-white">
              Product and Services
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="transition-colors hover:text-[#f6921e]">
                  Loan Product
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-[#f6921e]">
                  Savings Product
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-[#f6921e]">
                  Micro insurance
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-[#f6921e]">
                  Remittance Service
                </a>
              </li>
            </ul>
          </div>

          {/* Grievance Hearing Officer */}
          <div>
            <h3 className="mb-4 border-b border-gray-400 pb-3 text-base font-semibold text-white">
              Grievance Hearing Officer
            </h3>
            <div className="space-y-3">
              {/* Officer Image */}
              <div className="mb-4">
                <div className="h-24 w-20 overflow-hidden rounded-sm bg-gradient-to-br from-pink-400 to-purple-500">
                  <img
                    src="/officer-placeholder.jpg"
                    alt="Esori Prasad Sharma"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120"%3E%3Crect fill="%23c084fc" width="100" height="120"/%3E%3C/svg%3E';
                    }}
                  />
                </div>
              </div>

              {/* Officer Details */}
              <div className="text-xs space-y-1">
                <p className="text-gray-100">Esori Prasad Sharma</p>
                <p className="text-gray-300">Asst. Officer</p>
                <p className="text-gray-300">Contact-9847621734</p>
                <p className="mt-2 text-gray-400">E-Mail</p>
                <p className="text-gray-300">esori.nesdo@gmail.com</p>
                <p className="text-gray-300">gunaso.nesdosmfi@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Important links */}
          <div>
            <h3 className="mb-4 border-b border-gray-400 pb-3 text-base font-semibold text-white">
              Important links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="transition-colors hover:text-[#f6921e]">
                  Nepal Rastra Bank
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-[#f6921e]">
                  NRB Grievence
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-[#f6921e]">
                  Inland Revenue Department
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-[#f6921e]">
                  Ministry of Finance
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-[#f6921e]">
                  Ministry of Home Affairs
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 border-b border-gray-400 pb-3 text-base font-semibold text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="transition-colors hover:text-[#f6921e]">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-[#f6921e]">
                  Career
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-[#f6921e]">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-[#f6921e]">
                  Departments
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Red Footer Bar */}
      <div className="bg-red-600 py-4">
        <div className="mx-auto max-w-7xl px-8">
          <p className="text-center text-sm font-semibold text-white">
            © {currentYear} NESDO Sambridha Laghubitta Sanstha Ltd.
          </p>
        </div>
      </div>
    </footer>
  );
}
