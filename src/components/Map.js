import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { ring } from "ldrs";

ring.register();

// Default values shown

// import "./MapStyles.css";
const API_KEY = process.env.REACT_APP_MAP_API_KEY;
const latitude = 28.2015;
const longitude = 83.9833;
delete L.Icon.Default.prototype._getIconUrl;

const customIcon = new L.Icon({
  iconUrl:
    "https://firebasestorage.googleapis.com/v0/b/splitwise-23240.appspot.com/o/Group%207.png?alt=media&token=16773928-bfea-4b0e-9a13-5c2d3e562516", // Replace with your image URL
  iconSize: [40, 40], // Adjust the size of the icon
  iconAnchor: [20, 40], // Anchor the icon (center bottom)
  popupAnchor: [0, -40], // Anchor the popup
});

const Map = (props) => {
  const [loading, setLoading] = useState(true);
  const [cord, setCord] = useState([]);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  // useEffect(() => {
  //   if (cord != props?.cord) {
  //     setCord(props?.cord);
  //     console.log("props?.cord");
  //     console.log(props?.cord);
  //   }
  // }, [props?.cord]);

  return (
    <div
      className="w-full h-[100svh] flex justify-center items-end fixed left-0 top-0 z-50 bg-[#70708628] backdrop-blur-md p-[20px]"
      style={{ zIndex: "300" }}
    >
      {" "}
      <div className="w-full md:w-[400px] lg:w-[400px] flex flex-col justify-center items-start rounded-3xl bg-white p-[10px] drop-shadow-sm">
        <div className="font-[google] mb-[15px] w-full mt-[5px] text-[18px] flex justify-between items-center">
          <div className="flex justify-start items-center w-[calc(100%-50px)] text-ellipsis overflow-hidden line-clamp-1 whitespace-nowrap">
            <div className="mr-[7px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-map-pin"
              >
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            {props?.location}
          </div>
          <div
            className="cursor-pointer w-[30px] flex justify-center items-center h-[30px] text-white bg-[#191A2C] rounded-full"
            onClick={() => {
              props?.setShowMap(false);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.3"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-x"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </div>
        </div>
        <div
          className="bg-white w-full  aspect-video rounded-[14px]"
          style={{
            borderRadius: "14px",
            overflow: "hidden",
            // width: "400px",
            // height: "400px",
          }}
        >
          {loading ? (
            <div className="w-full aspect-video bg-white flex justify-center items-center">
              <l-ring
                size="35"
                stroke="4"
                bg-opacity="0"
                speed="2"
                color="black"
              ></l-ring>
            </div>
          ) : (
            <>
              {/* <div
                className="max-w-[35px] max-h-[35px] rounded-[6px] bg-white flex justify-center items-center mr-[-45px] ml-[10px] mt-[10px]"
                style={{ zIndex: "200" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-maximize"
                >
                  <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                  <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                  <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                  <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                </svg>
              </div> */}
              <MapContainer
                center={[props?.latitude, props?.longitude]}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false} // Disable default zoom controls
                attributionControl={false} // Disable attribution
              >
                <TileLayer
                  url={`https://maps.geoapify.com/v1/tile/klokantech-basic/{z}/{x}/{y}.png?apiKey=${API_KEY}`}
                />
                {/* {cord.map((data) => {
                  return (
                    <>
                      <Marker
                        position={[data?.latitude, data?.longitude]}
                        icon={customIcon}
                      >
                        <Popup>A marker at your location!</Popup>
                      </Marker>
                    </>
                  );
                })} */}
                <Marker
                  position={[props?.latitude, props?.longitude]}
                  icon={customIcon}
                >
                  <Popup>A marker at your location!</Popup>
                </Marker>
              </MapContainer>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Map);
