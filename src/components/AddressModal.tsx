"use client";

import {GoogleMap, useLoadScript, type Libraries} from "@react-google-maps/api";
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
  }) => void | Promise<void>;
};

const defaultCenter = {
  lat: 50.85,
  lng: 4.37,
};

type PlaceDetails = {
  displayName?: string;
  formattedAddress?: string;
  location?: google.maps.LatLng | google.maps.LatLngLiteral;
  fetchFields: (options: {fields: string[]}) => Promise<void>;
};

type PlacePrediction = {
  text: {
    toString: () => string;
  };
  toPlace: () => PlaceDetails;
};

type PlaceSuggestion = {
  placePrediction?: PlacePrediction;
};

type PlacesAutocompleteLibrary = {
  AutocompleteSessionToken: new () => unknown;
  AutocompleteSuggestion: {
    fetchAutocompleteSuggestions: (request: {
      input: string;
      sessionToken: unknown;
    }) => Promise<{suggestions: PlaceSuggestion[]}>;
  };
};

const libraries: Libraries = ["places"];
const AUTOCOMPLETE_DEBOUNCE_MS = 500;
const MIN_AUTOCOMPLETE_CHARS = 3;

const buildSelectedAddress = (displayName?: string, formattedAddress?: string) => {
  const name = displayName?.trim();
  const address = formattedAddress?.trim();

  if (!name) return address || "";
  if (!address) return name;
  if (address.toLowerCase().includes(name.toLowerCase())) return address;

  return `${name}, ${address}`;
};

const getLatLng = (location?: google.maps.LatLng | google.maps.LatLngLiteral) => {
  if (!location) return null;

  const lat = typeof location.lat === "function" ? location.lat() : location.lat;
  const lng = typeof location.lng === "function" ? location.lng() : location.lng;

  if (typeof lat !== "number" || typeof lng !== "number") {
    return null;
  }

  return {lat, lng};
};

export default function AddressModal({show, onClose, onSave}: Props) {
  const {isLoaded} = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const [center, setCenter] = useState(defaultCenter);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [label, setLabel] = useState("Home");
  const [address, setAddress] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [placesLibrary, setPlacesLibrary] =
    useState<PlacesAutocompleteLibrary | null>(null);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const sessionTokenRef = useRef<unknown>(null);
  const latestRequestIdRef = useRef(0);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    let isMounted = true;

    const loadPlacesLibrary = async () => {
      try {
        const library = (await google.maps.importLibrary(
          "places"
        )) as unknown as PlacesAutocompleteLibrary;

        if (isMounted) setPlacesLibrary(library);
      } catch (err) {
        console.error(
          "Google Maps Place Autocomplete failed to initialize. Ensure Places API (New) is enabled for this API key.",
          err
        );
      }
    };

    loadPlacesLibrary();

    return () => {
      isMounted = false;
    };
  }, [isLoaded]);

  useEffect(() => {
    const query = searchInput.trim();

    if (!show || !placesLibrary || query.length < MIN_AUTOCOMPLETE_CHARS) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    const requestId = latestRequestIdRef.current + 1;
    latestRequestIdRef.current = requestId;

    setIsSearching(true);

    const debounceTimer = window.setTimeout(async () => {
      try {
        if (!sessionTokenRef.current) {
          sessionTokenRef.current = new placesLibrary.AutocompleteSessionToken();
        }

        const response =
          await placesLibrary.AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: query,
            sessionToken: sessionTokenRef.current,
          });

        if (latestRequestIdRef.current === requestId) {
          setSuggestions(response.suggestions || []);
        }
      } catch (err) {
        if (latestRequestIdRef.current === requestId) {
          setSuggestions([]);
        }
        console.error("Failed to fetch place suggestions.", err);
      } finally {
        if (latestRequestIdRef.current === requestId) {
          setIsSearching(false);
        }
      }
    }, AUTOCOMPLETE_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(debounceTimer);
    };
  }, [placesLibrary, searchInput, show]);

  const handleSelectSuggestion = async (suggestion: PlaceSuggestion) => {
    const placePrediction = suggestion.placePrediction;
    if (!placePrediction) return;

    const place = placePrediction.toPlace();
    await place.fetchFields({
      fields: ["displayName", "formattedAddress", "location"],
    });

    const selectedAddress = buildSelectedAddress(
      place.displayName,
      place.formattedAddress
    );
    const newCenter = getLatLng(place.location);

    setSearchInput(placePrediction.text.toString());
    setAddress(selectedAddress);
    setSuggestions([]);
    sessionTokenRef.current = null;

    if (!newCenter) return;

    setCenter(newCenter);

    if (map) {
      map.panTo(newCenter);
      map.setZoom(17);
    }
  };

  // Reset when modal opens
  useEffect(() => {
    if (show) {
      setCenter(defaultCenter);
      setLabel("Home");
      setAddress("");
      setSearchInput("");
      setSuggestions([]);
      setIsSearching(false);
      setIsSaving(false);
      sessionTokenRef.current = null;

      if (map) {
        map.panTo(defaultCenter);
      }
    }
  }, [show, map]);

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
            <div className="relative">
              <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3">
                <FaSearch className="text-gray-400 mr-3" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter a location"
                  className="bg-transparent outline-none w-full text-sm text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {(suggestions.length > 0 || isSearching) && (
                <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
                  {isSearching ? (
                    <div className="px-4 py-3 text-sm text-gray-400">
                      Searching...
                    </div>
                  ) : (
                    suggestions.map((suggestion, index) => {
                      const placePrediction = suggestion.placePrediction;
                      if (!placePrediction) return null;

                      return (
                        <button
                          key={`${placePrediction.text.toString()}-${index}`}
                          type="button"
                          onClick={() => handleSelectSuggestion(suggestion)}
                          className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50"
                        >
                          {placePrediction.text.toString()}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
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

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-6 w-6 rounded-full border-4 border-[var(--primary-color)] bg-white shadow-md" />
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
              disabled={isSaving || !address.trim()}
              onClick={async () => {
                try {
                  setIsSaving(true);
                  await onSave({
                    lat: center.lat,
                    lng: center.lng,
                    label,
                    address: address.trim(),
                  });
                  onClose();
                } finally {
                  setIsSaving(false);
                }
              }}
              className="w-full bg-[var(--primary-color)] text-white py-4 rounded-full font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Confirm Location"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
