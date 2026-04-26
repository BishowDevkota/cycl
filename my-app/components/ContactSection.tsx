"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ContactDetails } from "@/lib/contact-service";

export function ContactSection() {
  const [contact, setContact] = useState<ContactDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await fetch("/api/home/contact");
        const data = await response.json();
        setContact(data);
      } catch (error) {
        console.error("Failed to fetch contact details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading contact information...</div>;
  }

  if (!contact) {
    return null;
  }

  // Handle both old data format (location as string) and new format (location as object)
  const locationLink = typeof contact.location === 'object' ? contact.location.link : '#';
  const locationText = typeof contact.location === 'object' ? contact.location.text : contact.location;

  return (
    <section className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-600">
            Reach out to us through any of these channels
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Phone */}
          <Link href={contact.phone.link}>
            <div className="h-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer hover:bg-blue-50">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773c.058.3.102.605.102.924v1.1c0 .995.89 1.854 1.954 1.854.064 0 .127-.001.19-.003.963-.129 1.738-.855 1.738-1.94v-1.1c0-.319.044-.624.102-.924l-1.548-.773a1 1 0 01-.54-1.06l.74-4.435A1 1 0 018.847 3h2.153a1 1 0 011 1v2a1 1 0 11-2 0V4h-.5v2a1 1 0 11-2 0V4h-.5v2a1 1 0 11-2 0V3z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Phone
              </h3>
              <p className="text-center text-gray-600 hover:text-blue-600 transition-colors font-medium">
                {contact.phone.text}
              </p>
            </div>
          </Link>

          {/* Email */}
          <Link href={contact.email.link}>
            <div className="h-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer hover:bg-green-50">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Email
              </h3>
              <p className="text-center text-gray-600 hover:text-green-600 transition-colors font-medium break-all">
                {contact.email.text}
              </p>
            </div>
          </Link>

          {/* Facebook */}
          <Link href={contact.facebook.link} target="_blank">
            <div className="h-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer hover:bg-blue-50">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Facebook
              </h3>
              <p className="text-center text-gray-600 hover:text-blue-600 transition-colors font-medium truncate">
                {contact.facebook.text}
              </p>
            </div>
          </Link>

          {/* WhatsApp */}
          <Link href={contact.whatsapp.link} target="_blank">
            <div className="h-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer hover:bg-green-50">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-1.559.896-2.783 2.24-3.606 3.605-1.566 2.84-1.718 6.153-.464 9.209.529 1.312 1.323 2.433 2.34 3.285.779.71 1.823 1.237 2.989 1.379 2.203.27 4.983-.212 7.537-1.526 1.206-.631 2.75-1.504 3.844-2.873.407-.524.763-1.122 1.047-1.749.793-1.596 1.294-3.656 1.293-5.912 0-1.321-.167-2.508-.55-3.677-.32-1.02-.784-1.905-1.375-2.652-.907-1.155-2.068-2.059-3.365-2.706-1.487-.779-3.199-1.238-5.073-1.238z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                WhatsApp
              </h3>
              <p className="text-center text-gray-600 hover:text-green-600 transition-colors font-medium">
                {contact.whatsapp.text}
              </p>
            </div>
          </Link>

          {/* Location */}
          <Link href={locationLink}>
            <div className="h-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer hover:bg-purple-50">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-purple-100 rounded-full p-3">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Location
              </h3>
              <p className="text-center text-gray-600 hover:text-purple-600 transition-colors font-medium">
                {locationText}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
