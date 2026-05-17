"use client";

import {GoogleMap, useLoadScript} from "@react-google-maps/api";
import {useState, useEffect, useRef} from "react";
import {FaTimes, FaSearch, FaHome, FaBriefcase} from "react-icons/fa";
import {MdMoreHoriz} from "react-icons/md";

type Props = {
  show: boolean;
  onClose: () => void;
  onSave: (data: {
    lat: number;
    lng: number;
    label: string;
    address: string;
  }) => void;
};

const defaultCenter = {
  lat: 50.85,
  lng: 4.37,
};

const libraries: any = ["places"];

export default function AddressModal({show, onClose, onSave}: Props) {
  const {isLoaded} = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const [center, setCenter] = useState(defaultCenter);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [label, setLabel] = useState("Home");
  const [address, setAddress] = useState("");
  const autocompleteRef = useRef<HTMLInputElement>(null);

  // Initialize Autocomplete once loaded
  useEffect(() => {
    if (isLoaded && autocompleteRef.current) {
      try {
        const autocomplete = new google.maps.places.Autocomplete(autocompleteRef.current, {
          fields: ["formatted_address", "geometry", "name"],
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.geometry && place.geometry.location) {
            const location = place.geometry.location;
            const newCenter = {
              lat: location.lat(),
              lng: location.lng(),
            };
            setCenter(newCenter);
            setAddress(place.formatted_address || place.name || "");
            if (map) {
              map.panTo(newCenter);
              map.setZoom(17);
            }
          }
        });
      } catch (err) {
        console.error(
          "Google Maps Autocomplete failed to initialize. " +
          "Please ensure that the legacy 'Places API' is enabled in your Google Cloud Console " +
          "for this API Key (https://console.cloud.google.com/apis/library/places-backend.googleapis.com).",
          err
        );
      }
    }
  }, [isLoaded, map]);

  // 🔥 RESET WHEN MODAL OPENS
  useEffect(() => {
    if (show) {
      setCenter(defaultCenter);
      setLabel("Home");
      setAddress("");

      if (map) {
        map.panTo(defaultCenter);
      }
    }
  }, [show]);

  if (!show) return null;

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-[60] bg-black/40 text-white">
        Loading Map...
      </div>
    );
  }

  return (
    <>
      {/* OVERLAY */}
      <div className="fixed inset-0 bg-black/40 z-[55]" onClick={onClose}></div>

      {/* MODAL */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
        <div
          className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <div className="flex justify-between items-center p-5">
            <h2 className="font-semibold text-xl">Address</h2>
            <button onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          {/* SEARCH */}
          <div className="px-5 mb-4">
            <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3">
              <FaSearch className="text-gray-400 mr-3" />
              <input
                ref={autocompleteRef}
                type="text"
                placeholder="Enter a location"
                className="bg-transparent outline-none w-full text-sm"
              />
            </div>
          </div>

          {/* MAP */}
          <div className="h-[260px] relative">
            <GoogleMap
              zoom={15}
              center={center}
              mapContainerClassName="w-full h-full"
              onLoad={(mapInstance) => setMap(mapInstance)}
              onIdle={() => {
                if (!map) return;
                const c = map.getCenter();
                if (c) {
                  setCenter({lat: c.lat(), lng: c.lng()});
                }
              }}
            />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-3xl">
              📍
            </div>
          </div>

          {/* FORM */}
          <div className="p-5 space-y-4">
            {/* ADDRESS INPUT */}
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Apartment & Flat No"
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            />

            {/* LABEL */}
            <div className="flex gap-3">
              {["Home", "Work", "Other"].map((item) => (
                <button
                  key={item}
                  onClick={() => setLabel(item)}
                  className={`px-4 py-2 rounded-xl text-sm flex items-center gap-2 ${
                    label === item
                      ? "bg-[var(--primary-color)] text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {item === "Home" && <FaHome />}
                  {item === "Work" && <FaBriefcase />}
                  {item === "Other" && <MdMoreHoriz />}
                  {item}
                </button>
              ))}
            </div>

            {/* BUTTON */}
            <button
              onClick={() => {
                onSave({
                  lat: center.lat,
                  lng: center.lng,
                  label,
                  address,
                });
                onClose();
              }}
              className="w-full bg-[var(--primary-color)] text-white py-4 rounded-full font-semibold"
            >
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
