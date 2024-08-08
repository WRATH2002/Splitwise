import React, { useEffect, useRef, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PiSunHorizon } from "react-icons/pi";
import { db } from "../firebase";
import firebase from "../firebase";
import { arrayUnion, onSnapshot } from "firebase/firestore";
import { mirage } from "ldrs";

mirage.register();

// Default values shown

const data = {
  tripDetails: {
    location: "Kashmir, India",
    duration: "10 Days",
    groupSize: 3,
    budget: 200000,
  },
  hotels: [
    {
      hotelName: "The Lalit Grand Palace Srinagar",
      hotelAddress: "Gupkar Road, Srinagar, Jammu and Kashmir 190001",
      price: "₹15,000 per night (approx)",
      imageUrl:
        "https://www.thelalit.com/thelalitsrinagar/images/home/Lalit-Srinagar-Building.jpg",
      geoCoordinates: {
        latitude: 34.0789,
        longitude: 74.8222,
      },
      rating: 4.7,
      description:
        "A luxurious heritage hotel on the banks of Dal Lake offering stunning views and top-notch amenities.",
    },
    {
      hotelName: "Vivanta Dal View",
      hotelAddress: "Kralsangri, Brein, Srinagar, Jammu and Kashmir 191121",
      price: "₹8,000 per night (approx)",
      imageUrl:
        "https://www.vivantahotels.com/content/dam/vivanta/vivanta-srinagar/at-a-glance/Overview-vivanta-srinagar-overview.jpg",
      geoCoordinates: {
        latitude: 34.1064,
        longitude: 74.8608,
      },
      rating: 4.5,
      description:
        "Modern hotel with panoramic Dal Lake views, comfortable rooms, and a relaxing ambiance.",
    },
    {
      hotelName: "Hotel Grand Mumtaz Resorts",
      hotelAddress: "Sringar - Leh Highway, Sonamarg, Jammu and Kashmir 191202",
      price: "₹6,000 per night (approx)",
      imageUrl:
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/22/d8/73/hotel-grand-mumtaz.jpg?w=900&h=-1&s=1",
      geoCoordinates: {
        latitude: 34.3064,
        longitude: 75.3,
      },
      rating: 4.2,
      description:
        "A cozy hotel in Sonamarg offering stunning views of the Himalayas and easy access to nearby attractions.",
    },
    {
      hotelName: "The Khyber Himalayan Resort & Spa",
      hotelAddress:
        "Gulmarg Wildlife Sanctuary, Gulmarg, Jammu and Kashmir 193403",
      price: "₹12,000 per night (approx)",
      imageUrl:
        "https://www.khyberhotels.com/wp-content/uploads/2019/04/Homepage_Gulmarg_001.jpg",
      geoCoordinates: {
        latitude: 34.05,
        longitude: 74.3833,
      },
      rating: 4.8,
      description:
        "A luxurious resort in Gulmarg offering breathtaking views, world-class amenities, and access to skiing activities.",
    },
  ],
  itinerary: [
    {
      day: 1,
      plan: [
        {
          placeName: "Arrival in Srinagar - Explore Dal Lake",
          placeDetails:
            "Arrive at Srinagar Airport (SXR) and transfer to your hotel. Enjoy a relaxing Shikara ride on the serene Dal Lake, surrounded by picturesque views of the mountains and floating gardens.",
          imageUrl:
            "https://www.indianholiday.com/pictures/kashmir/tourist-attractions/large/dal-lake-srinagar-1.jpg",
          geoCoordinates: {
            latitude: 34.0833,
            longitude: 74.85,
          },
          ticketPricing: "Shikara Ride: ₹500 - ₹1000 (approx)",
          timeToTravel: "Afternoon",
          bestTimeToVisit: "All day",
        },
      ],
    },
    {
      day: 2,
      plan: [
        {
          placeName: "Mughal Gardens",
          placeDetails:
            "Visit the beautiful Mughal Gardens of Srinagar - Nishat Bagh, Shalimar Bagh, and Chashme Shahi. Immerse yourself in the Mughal architecture, lush greenery, and serene ambiance.",
          imageUrl:
            "https://www.indianholiday.com/pictures/kashmir/tourist-attractions/large/mughal-gardens-srinagar-1.jpg",
          geoCoordinates: {
            latitude: 34.09,
            longitude: 74.85,
          },
          ticketPricing: "Entry Fee (per garden): ₹24 (approx)",
          timeToTravel: "Morning",
          bestTimeToVisit: "Spring and Autumn",
        },
        {
          placeName: "Pari Mahal",
          placeDetails:
            "Visit the historical Pari Mahal, perched on the Zabarwan mountain range, offering panoramic views of Srinagar city and the Dal Lake.",
          imageUrl:
            "https://www.tourmyindia.com/states/jammu-kashmir/image/pari-mahal-srinagar.jpg",
          geoCoordinates: {
            latitude: 34.0967,
            longitude: 74.8283,
          },
          ticketPricing: "Entry Fee: ₹15 (approx)",
          timeToTravel: "Afternoon",
          bestTimeToVisit: "Sunset",
        },
      ],
    },
    {
      day: 3,
      plan: [
        {
          placeName: "Day Trip to Sonamarg",
          placeDetails:
            "Embark on a scenic day trip to Sonamarg (Meadow of Gold), known for its breathtaking glaciers, alpine meadows, and snow-capped peaks.",
          imageUrl:
            "https://www.tourmyindia.com/states/jammu-kashmir/image/sonamarg-srinagar-tourism.jpg",
          geoCoordinates: {
            latitude: 34.3,
            longitude: 75.3,
          },
          ticketPricing: "Pony Rides: ₹500 - ₹1000 (approx)",
          timeToTravel: "Full Day",
          bestTimeToVisit: "Summer",
        },
      ],
    },
    {
      day: 4,
      plan: [
        {
          placeName: "Gulmarg - Gondola Ride",
          placeDetails:
            "Explore the picturesque hill station of Gulmarg, famous for its scenic beauty and skiing opportunities. Experience the thrilling Gondola ride, offering breathtaking views of the Himalayas.",
          imageUrl:
            "https://www.indianholiday.com/pictures/kashmir/tourist-attractions/large/gulmarg-gondola-1.jpg",
          geoCoordinates: {
            latitude: 34.05,
            longitude: 74.3833,
          },
          ticketPricing: "Gondola Ride (Phase 1 & 2): ₹1400 (approx)",
          timeToTravel: "Full Day",
          bestTimeToVisit: "Winter (for skiing), Summer (for greenery)",
        },
      ],
    },
    {
      day: 5,
      plan: [
        {
          placeName: "Pahalgam - Aru Valley & Betaab Valley",
          placeDetails:
            "Explore the scenic valley of Pahalgam, surrounded by lush forests and snow-capped peaks. Visit the picturesque Aru Valley and the famous Betaab Valley, known for their stunning natural beauty.",
          imageUrl:
            "https://www.tourmyindia.com/states/jammu-kashmir/image/ar-valley.jpg",
          geoCoordinates: {
            latitude: 34.0167,
            longitude: 75.3333,
          },
          ticketPricing: "Pony Rides: ₹500 - ₹1000 (approx)",
          timeToTravel: "Full Day",
          bestTimeToVisit: "Summer and Autumn",
        },
      ],
    },
    {
      day: 6,
      plan: [
        {
          placeName: "Srinagar - Local Shopping",
          placeDetails:
            "Explore the bustling markets of Srinagar, known for their handicrafts, spices, and traditional Kashmiri products. Visit Lal Chowk, Badshah Chowk, and the floating vegetable market for a unique shopping experience.",
          imageUrl:
            "https://www.tourmyindia.com/blog/wp-content/uploads/2018/04/Shopping-in-Srinagar-Featured.jpg",
          geoCoordinates: {
            latitude: 34.0833,
            longitude: 74.8,
          },
          ticketPricing: "Varies depending on purchases",
          timeToTravel: "Afternoon",
          bestTimeToVisit: "Late Afternoon and Evening",
        },
      ],
    },
    {
      day: 7,
      plan: [
        {
          placeName: "Yusmarg",
          placeDetails:
            "Embark on a scenic day trip to Yusmarg, known for its lush meadows, dense forests, and the Doodh Ganga River.",
          imageUrl:
            "https://www.tourmyindia.com/states/jammu-kashmir/image/yusmarg.jpg",
          geoCoordinates: {
            latitude: 33.8333,
            longitude: 74.6667,
          },
          ticketPricing: "Pony Rides: ₹500 - ₹1000 (approx)",
          timeToTravel: "Full Day",
          bestTimeToVisit: "Summer and Autumn",
        },
      ],
    },
    {
      day: 8,
      plan: [
        {
          placeName: "Doodhpathri",
          placeDetails:
            "Visit the picturesque meadow of Doodhpathri, known for its lush green pastures, gushing streams, and stunning views of the Himalayas.",
          imageUrl:
            "https://www.tourmyindia.com/states/jammu-kashmir/image/doodhpatheri-srinagar.jpg",
          geoCoordinates: {
            latitude: 34.2167,
            longitude: 74.8167,
          },
          ticketPricing: "Pony Rides: ₹500 - ₹1000 (approx)",
          timeToTravel: "Full Day",
          bestTimeToVisit: "Summer",
        },
      ],
    },
    {
      day: 9,
      plan: [
        {
          placeName: "Relax in Srinagar",
          placeDetails:
            "Enjoy a leisurely day in Srinagar, exploring the local markets, enjoying traditional Kashmiri cuisine, or simply relaxing at your hotel.",
          imageUrl:
            "https://www.indianholiday.com/pictures/kashmir/tourist-attractions/large/dal-lake-srinagar-1.jpg",
          geoCoordinates: {
            latitude: 34.0833,
            longitude: 74.85,
          },
          ticketPricing: "Varies depending on activities",
          timeToTravel: "Full Day",
          bestTimeToVisit: "All day",
        },
      ],
    },
    {
      day: 10,
      plan: [
        {
          placeName: "Departure from Srinagar",
          placeDetails:
            "Enjoy a final breakfast in Srinagar before proceeding to the airport for your onward journey.",
          imageUrl:
            "https://www.indianholiday.com/pictures/kashmir/tourist-attractions/large/srinagar-airport-1.jpg",
          geoCoordinates: {
            latitude: 34.0881,
            longitude: 74.8048,
          },
          ticketPricing: "N/A",
          timeToTravel: "Morning",
          bestTimeToVisit: "N/A",
        },
      ],
    },
  ],
};

const AiTripPlanner = () => {
  const [destination, setDestination] = useState("");
  const [prevDestination, setPrevDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [crowd, setCrowd] = useState("");
  const [persons, setPersons] = useState("1");
  const [mood, setMood] = useState("");
  const [section, setSection] = useState("plan");
  const [dayNumber, setDayNumber] = useState(0);
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_KEY);
  const [loading, setLoading] = useState(false);
  const [planData, setPlanData] = useState({});
  const [photos, setPhotos] = useState([]);
  const [city, setCity] = useState("Kolkata");
  const [mode, setMode] = useState("Plan a Trip");
  const [imageIndex, setImageIndex] = useState(0);
  const [APIFlag, setAPIFlag] = useState(true);
  const [searchSuggestion, setSearchSuggestion] = useState([]);
  const [closeModal, setCloseModal] = useState(false);
  const [savedPlan, setSavedPlan] = useState(false);
  const [tripPLanDataHistory, setTripPlanDataHistory] = useState([]);
  const firstDivRef = useRef(null);
  const [firstDivHeight, setFirstDivHeight] = useState(0);

  useEffect(() => {
    console.log("photos");
    console.log(photos);
  }, [photos]);

  useEffect(() => {
    setTimeout(() => {
      if (imageIndex + 1 == 10) {
        setImageIndex(0);
      } else {
        setImageIndex(imageIndex + 1);
      }
    }, 5000);
  }, [imageIndex]);
  // Converts a File object to a GoogleGenerativeAI.Part object.
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
  });

  const generationConfig = {
    temperature: 1,
    top_p: 0.95,
    top_k: 64,
    max_output_tokens: 8192,
    response_mime_type: "text/plain",
  };
  function extractJsonFromString(inputString) {
    const jsonStartIndex = inputString.indexOf("{");
    const jsonEndIndex = inputString.lastIndexOf("}") + 1;
    if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
      const jsonString = inputString.substring(jsonStartIndex, jsonEndIndex);
      try {
        console.log(JSON.parse(jsonString));
      } catch (error) {
        console.error("Invalid JSON format:", error);
        console.log(null);
      }
    } else {
      console.error("No JSON content found in the string");
      console.log(null);
    }
  }
  // useEffect(() => {
  //   extractJsonFromString(data);
  // });
  useEffect(() => {
    setLoading(false);
  }, [planData]);

  async function run() {
    console.log("generating plan");
    const chatSession = model.startChat({
      generationConfig,
      // safetySettings: Adjust safety settings
      // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [],
    });

    const result = await chatSession.sendMessage(
      `Generate Travel Plan for Location:` +
        destination +
        `, for ` +
        duration +
        ` Days as a ` +
        crowd +
        ` trip of total ` +
        persons +
        ` members , with a ` +
        budget +
        ` budget , Give me a Hotels options list (as an array of objects) with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary (as an array of objects) with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing (in INR), place ratings if possible, Time to travel each of the location for ` +
        duration +
        ` days with each day plan with best time to visit in JSON format. just give the json data only and nothing more and the json format should be like below ->
        
        format --

        {
  tripDetails: {
    location: "Darjeeling, West Bengal",
    duration: "5 Days",
    groupSize: 3,
    budget: give an expected budget in INR,
  },
  hotels: [
    {
      hotelName: "Hotel Windamere",
      hotelAddress: "Observatory Hill, Darjeeling, West Bengal 734101",
      price: "₹7,000 per night (approx)",
      imageUrl: "https://example.com/images/windamere.jpg",
      geoCoordinates: {
        latitude: 27.0402,
        longitude: 88.2625,
      },
      rating: 4.8,
      description:
        "Historic hotel with stunning views, colonial charm, and excellent service.",
    },
    {
      hotelName: "The Elgin, Darjeeling",
      hotelAddress: "Richmond Hill, Darjeeling, West Bengal 734101",
      price: "₹6,000 per night (approx)",
      imageUrl: "https://example.com/images/elgin.jpg",
      geoCoordinates: {
        latitude: 27.0416,
        longitude: 88.2604,
      },
      rating: 4.5,
      description:
        "Another heritage property known for its cozy ambiance, gardens, and Himalayan views.",
    },
    ....
  ],
  itinerary: [
    {
      day: 1,
      plan: [
        {
          placeName: "Tiger Hill Sunrise",
          placeDetails:
            "Witness a breathtaking sunrise over Kanchenjunga and the Eastern Himalayas.",
          imageUrl: "https://example.com/images/tigerhill.jpg",
          geoCoordinates: {
            latitude: 27.0529,
            longitude: 88.2752,
          },
          ticketPricing: "₹30 (approx)",
          timeToTravel: "4:00 AM - 7:00 AM",
          bestTimeToVisit: "Early morning for sunrise",
        },
        {
          placeName: "Batasia Loop & War Memorial",
          placeDetails:
            "Enjoy a scenic train ride and pay homage at the war memorial.",
          imageUrl: "https://example.com/images/batasia.jpg",
          geoCoordinates: {
            latitude: 27.0477,
            longitude: 88.2663,
          },
          ticketPricing: "₹20 (approx)",
          timeToTravel: "8:00 AM - 9:30 AM",
          bestTimeToVisit: "Morning",
        },....
      ],
    },
    {
      day: 2,
      plan: [
        {
          placeName: "Peace Pagoda & Japanese Temple",
          placeDetails:
            "Experience serenity and peace at these religious sites.",
          imageUrl: "https://example.com/images/peace-pagoda.jpg",
          geoCoordinates: {
            latitude: 27.0477,
            longitude: 88.2718,
          },
          ticketPricing: "Free",
          timeToTravel: "9:00 AM - 11:00 AM",
          bestTimeToVisit: "Morning",
        },
        {
          placeName: "Padmaja Naidu Himalayan Zoological Park",
          placeDetails:
            "See endangered Himalayan animals, including snow leopards and red pandas.",
          imageUrl: "https://example.com/images/zoo.jpg",
          geoCoordinates: {
            latitude: 27.0464,
            longitude: 88.2695,
          },
          ticketPricing: "₹60 (approx)",
          timeToTravel: "11:30 AM - 2:00 PM",
          bestTimeToVisit: "Late morning & afternoon",
        },
        ...
      ],
    },
  ],
}`
    );
    console.log(result.response.text().slice(7).split("```")[0]);
    setPlanData(JSON.parse(result.response.text().slice(7).split("```")[0]));
  }

  useEffect(() => {
    console.log(planData);
  }, [planData]);

  const fetchPhotos = async () => {
    try {
      const response = await fetch(
        "https://api.unsplash.com/search/photos?query=" +
          destination?.split(",")[0] +
          "&client_id=" +
          process.ev.REACT_APP_UNSPLASH_API_KEY
      );
      const data = await response.json();
      console.log(data.results);
      setPhotos(data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSuggestions = async () => {
    const url =
      "https://us1.locationiq.com/v1/autocomplete.php?key=" +
      process.env.REACT_APP_LOCATION_API_KEY +
      "&q=" +
      destination +
      "&format=json";

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Search Suggestion");
      console.log(data);
      setSearchSuggestion(data);
    } catch (error) {
      console.error("Fetch error:", error);
      return [];
    }
  };

  useEffect(() => {
    if (
      destination.length != 0 &&
      APIFlag == true &&
      destination != prevDestination
    ) {
      const timer = setTimeout(() => {
        fetchSuggestions();
        setPrevDestination(destination);
      }, 200);
      return () => {
        clearTimeout(timer);
      };
    }

    setAPIFlag(true);
  }, [destination]);

  function addTripPlanToFirebase() {
    const user = firebase.auth().currentUser;
    db.collection("Expense")
      .doc(user.uid)
      .update({
        TripPlan: arrayUnion({ planData, photos }),
      });

    setPlanData({});
    setDestination("");
    setBudget("");
    setCrowd("");
    setPersons("");
    setMood("");
    setDuration("");
  }

  function FetchTripPlans() {
    const user = firebase.auth().currentUser;
    const userRef = db.collection("Expense").doc(user?.uid);
    onSnapshot(userRef, (snapshot) => {
      // setMonth(snapshot?.data()?.Photo);
      console.log("Firebase firestore data --------------");
      console.log(snapshot?.data()?.TripPlan);
      console.log(snapshot?.data()?.TripPlan[0]?.photos);
      setTripPlanDataHistory(snapshot?.data()?.TripPlan);
    });
  }

  useEffect(() => {
    FetchTripPlans();
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      if (firstDivRef.current) {
        const height = firstDivRef.current.clientHeight;
        setFirstDivHeight(height);
        console.log("heightttttttttt----------------------------");
        console.log(height);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <>
      {loading ? (
        <>
          {" "}
          <div className="w-full h-[100svh] top-0 left-0 fixed bg-[#70708628] backdrop-blur-md flex justify-center items-center p-[20px] z-50 font-[google] font-normal">
            <div className="w-full h-auto min-h-[180px] flex flex-col justify-center items-center p-[30px] py-[25px] bg-[white] rounded-3xl drop-shadow-sm">
              <l-mirage size="60" speed="2.5" color="#191A2C"></l-mirage>
              <div className="mt-[10px] text-center">
                Hold tight! We're working on your Trip.
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      {closeModal ? (
        <>
          {" "}
          <div className="w-full h-[100svh] top-0 left-0 fixed bg-[#70708628] backdrop-blur-md flex justify-center items-center p-[20px] z-50 font-[google] font-normal">
            <div className="w-full h-auto min-h-[150px] flex flex-col justify-center items-start p-[30px] py-[25px] bg-[white] rounded-3xl drop-shadow-sm">
              <span className="text-[22px] ">Close Trip Plan</span>
              <span className="text-[14.5px] mt-[5px] text-[#000000a9] flex flex-col justify-start items-start w-full h-auto">
                Do you want to save this Trip Plan for future reference ?
              </span>

              <div className="w-full h-auto mt-[10px] flex justify-end items-end">
                <div
                  className="w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] text-[14px] bg-[#F4F5F7]"
                  onClick={() => {
                    setCloseModal(false);
                  }}
                >
                  Cancel
                </div>
                <div
                  className="w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] text-[14px] bg-[#191A2C] ml-[10px] text-[white]"
                  onClick={() => {
                    setCloseModal(false);
                    setPlanData({});
                    setDestination("");
                    setBudget("");
                    setCrowd("");
                    setPersons("");
                    setMood("");
                    setDuration("");
                  }}
                >
                  No
                </div>
                <div
                  className="w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] text-[14px] bg-[#191A2C] ml-[10px] text-[white]"
                  onClick={() => {
                    setCloseModal(false);
                    addTripPlanToFirebase();
                  }}
                >
                  Yes
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      {Object.keys(planData).length != 0 ? (
        <>
          <div
            className="w-[35px] h-[35px] rounded-full bg-[#191A2C] text-white fixed top-[20px] right-[20px] z-40 flex justify-center items-center"
            onClick={() => {
              if (savedPlan) {
                setCloseModal(false);
                setPlanData({});
                setDestination("");
                setBudget("");
                setCrowd("");
                setPersons("");
                setMood("");
                setDuration("");
              } else {
                setCloseModal(true);
              }

              // setPlanData({});
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-x"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </div>
          <div className="w-full h-[calc(100svh-60px)] p-[20px] font-[google] font-normal flex justify-start items-start flex-col overflow-y-scroll">
            <div className="fixed w-full h-[115px] flex flex-col justify-start items-start p-[20px] top-0 left-0 bg-[#ffffffbf] backdrop-blur-xl z-30">
              <span className="text-[25px] flex justify-start items-center min-h-[40px] w-full overflow-hidden whitespace-nowrap text-ellipsis line-clamp-1  ">
                <div className="  mr-[10px] flex justify-center items-center  z-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-map-pin"
                  >
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>{" "}
                {planData?.tripDetails?.location}
              </span>
              <span className="text-[16px] flex justify-start items-center min-h-[35px] overflow-y-visible mt-[7px] w-full overflow-x-scroll">
                <div className="px-[15px] h-full rounded-lg bg-[#F5F6F9] flex justify-center items-center whitespace-nowrap">
                  <div className="mr-[8px] flex justify-center items-center  z-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-calendar-plus"
                    >
                      <path d="M8 2v4" />
                      <path d="M16 2v4" />
                      <path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" />
                      <path d="M3 10h18" />
                      <path d="M16 19h6" />
                      <path d="M19 16v6" />
                    </svg>
                  </div>{" "}
                  {planData?.tripDetails?.duration}
                </div>{" "}
                <div className="px-[15px] h-full rounded-lg bg-[#F5F6F9] flex justify-center items-center ml-[10px] whitespace-nowrap">
                  <div className="mr-[8px]  flex justify-center items-center  z-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-hand-coins"
                    >
                      <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
                      <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
                      <path d="m2 16 6 6" />
                      <circle cx="16" cy="9" r="2.9" />
                      <circle cx="6" cy="5" r="3" />
                    </svg>
                  </div>
                  {planData?.tripDetails?.budget}
                </div>{" "}
                <div className="px-[15px] h-full rounded-lg bg-[#F5F6F9] flex justify-center items-center ml-[10px] whitespace-nowrap">
                  <div className="mr-[8px] flex justify-center items-center  z-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-user"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>{" "}
                  {planData?.tripDetails?.groupSize}
                </div>
              </span>
            </div>
            <div className="min-h-[80px] w-full mb-[20px] "></div>
            <img
              className="w-full aspect-video object-cover  rounded-2xl"
              src={photos[imageIndex]?.urls?.regular}
            ></img>
            {/* <div className="h-[25px] flex justify-center items-center w-full">
              {Array(10)
                .fill("")
                .map((data, index) => {
                  return (
                    <div
                      className={
                        "w-[7px] h-[7px] rounded-full border-[1px] border-white mx-[2px] mt-[-25px] z-40" +
                        (imageIndex == index ? " bg-white" : " bg-transparent")
                      }
                    ></div>
                  );
                })}
            </div> */}

            {/* <span className="text-[20px] mt-[20px]">Detailed Trip Plans</span> */}
            <div className="w-full flex justify-start items-center mt-[20px]">
              <div
                className={
                  "px-[15px] h-[35px] flex justify-center items-center rounded-lg " +
                  (section == "plan"
                    ? " bg-[#191A2C] text-white"
                    : " bg-[#F5F6F9] text-black")
                }
                onClick={() => {
                  setSection("plan");
                }}
              >
                Trip Plan
              </div>
              <div
                className={
                  "px-[15px] h-[35px] flex justify-center items-center ml-[10px] rounded-lg " +
                  (section == "hotel"
                    ? " bg-[#191A2C] text-white"
                    : " bg-[#F5F6F9] text-black")
                }
                onClick={() => {
                  setSection("hotel");
                }}
              >
                Hotels
              </div>
            </div>
            {section == "hotel" ? (
              <>
                <div className="  h-auto ml-[10px] flex flex-col justify-start items-start mt-[15px] border-l border-dashed border-[#838383]">
                  {planData?.hotels?.map((data, index) => {
                    return (
                      <>
                        <div
                          className={
                            "flex justify-start items-start ml-[-10px] " +
                            (index == 0 ? " mt-[0px]" : " mt-[20px]")
                          }
                        >
                          <div className="flex justify-start items-center  mr-[15px]">
                            <div className=" mt-[-1px]  flex justify-center items-center  z-10 bg-white py-[5px]">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2.2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-bed-single"
                              >
                                <path d="M3 20v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8" />
                                <path d="M5 10V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" />
                                <path d="M3 18h18" />
                              </svg>
                            </div>
                          </div>
                          <div className="text-[18px] flex flex-col justify-start items-start">
                            <span>{data?.hotelName}</span>
                            <span className="text-[15px] text-[#00000085] leading-4 mt-[5px] pr-[10px]">
                              {data?.description}
                            </span>

                            <span className="text-[15px] text-[#00000085] leading-4 mt-[10px] pr-[10px] flex justify-start">
                              <div className="mr-[10px]">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  class="lucide lucide-map-pin-house"
                                >
                                  <path d="M15 22a1 1 0 0 1-1-1v-4a1 1 0 0 1 .445-.832l3-2a1 1 0 0 1 1.11 0l3 2A1 1 0 0 1 22 17v4a1 1 0 0 1-1 1z" />
                                  <path d="M18 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 .601.2" />
                                  <path d="M18 22v-3" />
                                  <circle cx="10" cy="10" r="3" />
                                </svg>
                              </div>{" "}
                              {data?.hotelAddress}
                            </span>
                            {/* <span>{data?.hotelAddress}</span> */}
                            {/* <span className="text-[15px] text-[#00000085] leading-4 mt-[5px] pr-[10px]">
                          {data?.hotelAddress}
                        </span> */}
                            <span className="flex justify-start items-center mt-[15px]">
                              <div className="px-[12px] h-[34px] bg-[#F5F6F9] text-[15px] rounded-lg flex justify-center items-center mr-[10px] mb-[5px]">
                                <div className="mr-[7px]">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2.2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="lucide lucide-star"
                                  >
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                  </svg>
                                </div>{" "}
                                {data?.rating}
                              </div>
                            </span>

                            <div className="px-[12px] h-[34px] bg-[#F5F6F9] text-[15px] rounded-lg flex justify-center items-center mr-[10px] mb-[5px]">
                              <div className="mr-[7px]">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2.2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  class="lucide lucide-ticket"
                                >
                                  <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                                  <path d="M13 5v2" />
                                  <path d="M13 17v2" />
                                  <path d="M13 11v2" />
                                </svg>
                              </div>{" "}
                              {data?.price}
                            </div>
                            {/* <div className="px-[12px] h-[34px] bg-[#F5F6F9] text-[15px] rounded-lg flex justify-center items-center mr-[10px] mb-[5px]">
                          <div className="mr-[7px]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2.2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="lucide lucide-footprints"
                            >
                              <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z" />
                              <path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z" />
                              <path d="M16 17h4" />
                              <path d="M4 13h4" />
                            </svg>
                          </div>{" "}
                          {data?.timeToTravel}
                        </div> */}
                          </div>
                        </div>
                      </>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                {" "}
                <div className="my-[10px] w-full flex justify-start items-center  overflow-x-scroll min-h-[35px]">
                  {planData?.itinerary?.map((data, index) => {
                    return (
                      <div
                        className={
                          "mr-[10px] px-[15px] h-full flex justify-center items-center rounded-lg whitespace-nowrap cursor-pointer" +
                          (index == dayNumber
                            ? " bg-[#191A2C] text-white"
                            : " bg-[#F5F6F9] text-black")
                        }
                        onClick={() => {
                          setDayNumber(index);
                        }}
                      >
                        Day {index + 1}
                      </div>
                    );
                  })}
                </div>
                <div className="  h-auto ml-[10px] flex flex-col justify-start items-start mt-[15px] border-l border-dashed border-[#838383]">
                  {planData?.itinerary[dayNumber]?.plan?.map((data, index) => {
                    return (
                      <>
                        <div
                          className={
                            "flex justify-start items-start ml-[-10px] " +
                            (index == 0 ? " mt-[0px]" : " mt-[20px]")
                          }
                        >
                          <div className="flex justify-start items-center  mr-[15px]">
                            <div className=" mt-[-1px]  flex justify-center items-center  z-10 bg-white py-[5px]">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2.2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-map-pin"
                              >
                                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                            </div>
                          </div>
                          <div className="text-[18px] flex flex-col justify-start items-start">
                            <span>{data?.placeName}</span>
                            <span className="text-[15px] text-[#00000085] leading-4 mt-[5px] pr-[10px]">
                              {data?.placeDetails}
                            </span>
                            {/* <span className="flex justify-start items-center mt-[15px]"> */}
                            <div className="px-[12px] min-h-[34px] h-auto leading-4 py-[8px] bg-[#F5F6F9] text-[15px] mt-[15px] rounded-lg flex justify-center items-start mr-[10px] mb-[5px]">
                              <div className="mr-[7px] ">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2.2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  class="lucide lucide-ticket"
                                >
                                  <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                                  <path d="M13 5v2" />
                                  <path d="M13 17v2" />
                                  <path d="M13 11v2" />
                                </svg>
                              </div>{" "}
                              {data?.ticketPricing}
                            </div>
                            {/* </span> */}

                            <div className="px-[12px] min-h-[34px] h-auto leading-4 py-[8px] bg-[#F5F6F9] text-[15px] rounded-lg flex justify-center items-start mr-[10px] mb-[5px]">
                              <div className="mr-[7px] ">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2.2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  class="lucide lucide-clock-2"
                                >
                                  <circle cx="12" cy="12" r="10" />
                                  <polyline points="12 6 12 12 16 10" />
                                </svg>
                              </div>{" "}
                              {data?.bestTimeToVisit}
                            </div>
                            <div className="px-[12px] min-h-[34px] h-auto leading-4 py-[8px] bg-[#F5F6F9] text-[15px] rounded-lg flex justify-center items-start mr-[10px] mb-[5px]">
                              <div className="mr-[7px]">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2.2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  class="lucide lucide-footprints"
                                >
                                  <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z" />
                                  <path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z" />
                                  <path d="M16 17h4" />
                                  <path d="M4 13h4" />
                                </svg>
                              </div>{" "}
                              {data?.timeToTravel}
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
                  {dayNumber == planData?.itinerary.length - 1 ? (
                    <></>
                  ) : (
                    <>
                      <div className="flex justify-start items-start ml-[-9px] mt-[20px]">
                        <div className="flex justify-start items-center  mr-[15px]">
                          <div className=" mt-[-1px]  flex justify-center items-center  z-10 bg-white py-[5px]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2.2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="lucide lucide-bed-single"
                            >
                              <path d="M3 20v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8" />
                              <path d="M5 10V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" />
                              <path d="M3 18h18" />
                            </svg>
                          </div>
                        </div>
                        <div className="text-[18px] flex flex-col justify-start items-start">
                          <span>Take Rest or go for a walk</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          {/* <button onClick={() => fetchPhotos()}>Kolkata</button> */}
          {/* <button onClick={() => addTripPlanToFirebase()}>Kolkata</button> */}
        </>
      ) : (
        <>
          <div className="w-full h-[calc(100svh-60px)] p-[20px] font-[google] font-normal flex justify-start items-start flex-col overflow-y-scroll">
            <div className="w-full flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="70"
                height="70"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-ship"
              >
                <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
                <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
                <path d="M12 10v4" />
                <path d="M12 2v3" />
              </svg>
            </div>
            <span className="text-[25px] text-center w-full">
              Plan Your Perfect Trip
            </span>
            <span className="text-[25px] text-center w-full flex justify-center items-center">
              with{" "}
              <div className="bg-clip-text text-transparent bg-gradient-to-l from-[#5082ED] to-[#D46679] ml-[5px] mr-[5px]">
                AI
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3d67c2"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-sparkles"
              >
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                <path d="M20 3v4" />
                <path d="M22 5h-4" />
                <path d="M4 17v2" />
                <path d="M5 18H3" />
              </svg>
            </span>
            <div className="w-full flex justify-center items-center mt-[20px]">
              <div
                className={
                  "px-[15px] h-[40px] flex justify-center items-center rounded-xl " +
                  (mode == "Plan a Trip"
                    ? " bg-[#191A2C] text-white"
                    : " bg-[#F5F6F9] text-black")
                }
                onClick={() => {
                  setMode("Plan a Trip");
                }}
              >
                Plan a Trip
              </div>
              <div
                className={
                  "px-[15px] h-[40px] flex justify-center items-center rounded-xl  ml-[15px]" +
                  (mode == "Saved Plans"
                    ? " bg-[#191A2C] text-white"
                    : " bg-[#F5F6F9] text-black")
                }
                onClick={() => {
                  setMode("Saved Plans");
                }}
              >
                Saved Plans
              </div>
            </div>
            {mode == "Plan a Trip" ? (
              <>
                <span className="text-[15px] mt-[20px] text-[#0000005d]">
                  Destination
                </span>
                <div className="w-full min-h-[45px] flex justify-start items-center mt-[5px]">
                  <div className="h-full aspect-square mr-[-45px] flex justify-center items-center  z-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-map-pin"
                    >
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <input
                    className="w-full text-[16px] pl-[42px] h-[45px] rounded-lg bg-[#F5F6F9] px-[15px] outline-none z-0 "
                    value={destination}
                    onChange={(e) => {
                      setDestination(e.target.value);
                    }}
                  ></input>
                </div>
                <div className="w-full h-0 flex justify-start items-start mt-[5px]">
                  {searchSuggestion.length != 0 ? (
                    <div className="w-[calc(100%-40px)] left-[20px] fixed h-auto rounded-lg bg-[#F5F6F9] flex flex-col justify-start items-start z-10 py-[10px]">
                      {searchSuggestion?.map((item) => {
                        return (
                          <div
                            className="h-[35px] px-[15px] flex justify-start items-center"
                            onClick={() => {
                              setAPIFlag(false);
                              setPrevDestination(
                                item?.address?.name +
                                  ", " +
                                  item?.address?.country
                              );
                              setDestination(
                                item?.address?.name +
                                  ", " +
                                  item?.address?.country
                              );
                              setSearchSuggestion([]);
                            }}
                          >
                            <div className="h-full mr-[10px] flex justify-center items-center  z-10">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2.2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-map-pin"
                              >
                                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                            </div>
                            {item?.address?.name}, {item?.address?.country}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>

                <span className="text-[15px] mt-[10px] text-[#0000005d]">
                  Choose your crowd
                </span>
                <div className="w-full min-h-[45px] flex justify-start items-center mt-[5px]">
                  <div
                    className={
                      "w-auto px-[13px] h-full rounded-lg  flex justify-center items-center" +
                      (crowd == "Kid's Friendly"
                        ? " bg-[#191A2C] text-white"
                        : " bg-[#F5F6F9] text-black")
                    }
                    onClick={() => {
                      setCrowd("Kid's Friendly");
                    }}
                  >
                    Kid's Friendly
                  </div>
                  <div
                    className={
                      "w-auto px-[13px] h-full rounded-lg  flex justify-center items-center ml-[8px]" +
                      (crowd == "Friends"
                        ? " bg-[#191A2C] text-white"
                        : " bg-[#F5F6F9] text-black")
                    }
                    onClick={() => {
                      setCrowd("Friends");
                    }}
                  >
                    Friends
                  </div>
                  <div
                    className={
                      "w-auto px-[13px] h-full rounded-lg  flex justify-center items-center ml-[8px]" +
                      (crowd == "Family"
                        ? " bg-[#191A2C] text-white"
                        : " bg-[#F5F6F9] text-black")
                    }
                    onClick={() => {
                      setCrowd("Family");
                    }}
                  >
                    Family
                  </div>
                  <div
                    className={
                      "w-auto px-[13px] h-full rounded-lg  flex justify-center items-center ml-[8px]" +
                      (crowd == "Solo"
                        ? " bg-[#191A2C] text-white"
                        : " bg-[#F5F6F9] text-black")
                    }
                    onClick={() => {
                      setCrowd("Solo");
                      setPersons(1);
                    }}
                  >
                    Solo
                  </div>

                  {/* <input className="w-full text-[16px] pl-[42px] h-[45px] rounded-lg bg-[#F5F6F9] px-[15px] outline-none z-0 "></input> */}
                </div>
                <div className="w-full mt-[10px] h-auto flex justify-start items-start ">
                  <div className="w-[calc((100%-20px)/2)] flex flex-col justify-center items-start">
                    <span className="text-[15px]  text-[#0000005d]">
                      Duration (In Days)
                    </span>
                    <div className="w-full min-h-[45px] flex justify-start items-center mt-[5px] ">
                      <div className="h-full w-[45px] mr-[-45px] flex justify-center items-center  z-[5]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-calendar-plus"
                        >
                          <path d="M8 2v4" />
                          <path d="M16 2v4" />
                          <path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" />
                          <path d="M3 10h18" />
                          <path d="M16 19h6" />
                          <path d="M19 16v6" />
                        </svg>
                      </div>
                      <input
                        className="w-full text-[16px] pl-[42px] h-[45px] rounded-lg bg-[#F5F6F9] px-[15px] outline-none z-0 "
                        value={duration}
                        onChange={(e) => {
                          setDuration(e.target.value);
                        }}
                      ></input>
                    </div>
                  </div>
                  {crowd !== "Solo" ? (
                    <>
                      <div className="w-[calc((100%-20px)/2)] flex flex-col justify-center items-start ml-[20px]">
                        <span className="text-[15px]  text-[#0000005d]">
                          Total Members
                        </span>
                        <div className="w-full min-h-[45px] flex justify-start items-center mt-[5px]">
                          <div className="h-full w-[45px] mr-[-45px] flex justify-center items-center  z-[5]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2.2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="lucide lucide-user"
                            >
                              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                          </div>
                          <input
                            className="w-full text-[16px] pl-[42px] h-[45px] rounded-lg bg-[#F5F6F9] px-[15px] outline-none z-0 "
                            value={persons}
                            onChange={(e) => {
                              setPersons(e.target.value);
                            }}
                          ></input>
                        </div>
                      </div>
                      {/* </div> */}
                    </>
                  ) : (
                    <></>
                  )}
                  {/* <div className="w-[calc((100%-20px)/2] ml-[20px] flex flex-col justify-center items-start">
                <span className="text-[15px]  text-[#0000005d]">Budget</span>
                <div className="w-full h-[45px] flex justify-start items-center mt-[5px]">
                  <div className="h-full aspect-square mr-[-45px] flex justify-center items-center  z-[5]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-hand-coins"
                    >
                      <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
                      <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
                      <path d="m2 16 6 6" />
                      <circle cx="16" cy="9" r="2.9" />
                      <circle cx="6" cy="5" r="3" />
                    </svg>
                  </div>
                  <input
                    className="w-full text-[16px] pl-[42px] h-[45px] rounded-lg bg-[#F5F6F9] px-[15px] outline-none z-0 "
                    value={budget}
                    onChange={(e) => {
                      setBudget(e.target.value);
                    }}
                  ></input>
                </div>
              </div> */}
                </div>
                <span className="text-[15px] mt-[10px] text-[#0000005d]">
                  Choose your budget
                </span>
                <div className="w-full min-h-[45px] flex justify-start items-center mt-[5px]">
                  <div
                    className={
                      "w-auto px-[13px] h-full rounded-lg flex justify-center items-center" +
                      (budget == "Cheap"
                        ? " bg-[#191A2C] text-white"
                        : " bg-[#F5F6F9] text-black")
                    }
                    onClick={() => {
                      setBudget("Cheap");
                    }}
                  >
                    <div className="h-full  mr-[10px] flex justify-center items-center  z-[5]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-hand-coins"
                      >
                        <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
                        <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
                        <path d="m2 16 6 6" />
                        <circle cx="16" cy="9" r="2.9" />
                        <circle cx="6" cy="5" r="3" />
                      </svg>
                    </div>{" "}
                    Cheap
                  </div>
                  <div
                    className={
                      "w-auto px-[13px] h-full rounded-lg flex justify-center items-center ml-[8px]" +
                      (budget == "Moderate"
                        ? " bg-[#191A2C] text-white"
                        : " bg-[#F5F6F9] text-black")
                    }
                    onClick={() => {
                      setBudget("Moderate");
                    }}
                  >
                    <div className="h-full  mr-[10px] flex justify-center items-center  z-[5]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-wallet-cards"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2" />
                        <path d="M3 11h3c.8 0 1.6.3 2.1.9l1.1.9c1.6 1.6 4.1 1.6 5.7 0l1.1-.9c.5-.5 1.3-.9 2.1-.9H21" />
                      </svg>
                    </div>{" "}
                    Moderate
                  </div>
                  <div
                    className={
                      "w-auto px-[13px] h-full rounded-lg flex justify-center items-center ml-[8px]" +
                      (budget == "Luxury"
                        ? " bg-[#191A2C] text-white"
                        : " bg-[#F5F6F9] text-black")
                    }
                    onClick={() => {
                      setBudget("Luxury");
                    }}
                  >
                    <div className="h-full  mr-[10px] flex justify-center items-center  z-[5]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-wine"
                      >
                        <path d="M8 22h8" />
                        <path d="M7 10h10" />
                        <path d="M12 15v7" />
                        <path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z" />
                      </svg>
                    </div>{" "}
                    Luxury
                  </div>

                  {/* <input className="w-full text-[16px] pl-[42px] h-[45px] rounded-lg bg-[#F5F6F9] px-[15px] outline-none z-0 "></input> */}
                </div>

                <span className="text-[15px] mt-[10px] text-[#0000005d]">
                  Choose your mood
                </span>
                <div className="w-full min-h-[45px] flex justify-start items-center mt-[5px]">
                  <div
                    className={
                      "w-auto px-[13px] h-full rounded-lg  flex justify-center items-center" +
                      (mood == "Nature"
                        ? " bg-[#191A2C] text-white"
                        : " bg-[#F5F6F9] text-black")
                    }
                    onClick={() => {
                      setMood("Nature");
                    }}
                  >
                    <div className="mr-[7px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-tree-palm"
                      >
                        <path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4" />
                        <path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3" />
                        <path d="M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35" />
                        <path d="M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14" />
                      </svg>
                    </div>{" "}
                    Nature
                  </div>
                  <div
                    className={
                      "w-auto px-[13px] h-full rounded-lg  flex justify-center items-center ml-[8px]" +
                      (mood == "Party"
                        ? " bg-[#191A2C] text-white"
                        : " bg-[#F5F6F9] text-black")
                    }
                    onClick={() => {
                      setMood("Party");
                    }}
                  >
                    <div className="mr-[7px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-party-popper"
                      >
                        <path d="M5.8 11.3 2 22l10.7-3.79" />
                        <path d="M4 3h.01" />
                        <path d="M22 8h.01" />
                        <path d="M15 2h.01" />
                        <path d="M22 20h.01" />
                        <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" />
                        <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17" />
                        <path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7" />
                        <path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z" />
                      </svg>
                    </div>{" "}
                    Party
                  </div>
                  <div
                    className={
                      "w-auto px-[13px] h-full rounded-lg  flex justify-center items-center ml-[8px]" +
                      (mood == "Beach"
                        ? " bg-[#191A2C] text-white"
                        : " bg-[#F5F6F9] text-black")
                    }
                    onClick={() => {
                      setMood("Beach");
                    }}
                  >
                    <div className="mr-[7px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-shell"
                      >
                        <path d="M14 11a2 2 0 1 1-4 0 4 4 0 0 1 8 0 6 6 0 0 1-12 0 8 8 0 0 1 16 0 10 10 0 1 1-20 0 11.93 11.93 0 0 1 2.42-7.22 2 2 0 1 1 3.16 2.44" />
                      </svg>
                    </div>{" "}
                    Beach
                  </div>
                  {/* <div className="w-auto px-[13px] h-full rounded-lg bg-[#F5F6F9] flex justify-center items-center ml-[8px]">
          Solo
        </div> */}

                  {/* <input className="w-full text-[16px] pl-[42px] h-[45px] rounded-lg bg-[#F5F6F9] px-[15px] outline-none z-0 "></input> */}
                </div>
                <div className="w-full h-auto flex justify-center items-center">
                  {" "}
                  <div
                    className={
                      "mt-[30px] min-h-[45px] rounded-lg px-[15px] flex justify-center items-center bg-gradient-to-l from-[#5082ED] to-[#D46679] text-[black]" +
                      (destination.length != 0 &&
                      crowd.length != 0 &&
                      duration.length != 0 &&
                      persons.length != 0 &&
                      budget.length != 0
                        ? " bg-[#191A2C] text-white"
                        : " bg-[#191a2c4a] text-black")
                    }
                    onClick={() => {
                      if (
                        destination.length != 0 &&
                        crowd.length != 0 &&
                        duration.length != 0 &&
                        persons.length != 0 &&
                        budget.length != 0
                      ) {
                        setLoading(true);
                        run();
                        fetchPhotos();
                      }
                    }}
                  >
                    <div className="mr-[10px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-sparkles"
                      >
                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                        <path d="M20 3v4" />
                        <path d="M22 5h-4" />
                        <path d="M4 17v2" />
                        <path d="M5 18H3" />
                      </svg>
                    </div>
                    Generate Trip Plan
                  </div>
                </div>
              </>
            ) : (
              <>
                {tripPLanDataHistory.length != 0 ? (
                  <>
                    {tripPLanDataHistory?.map((data, index) => {
                      return (
                        <div
                          key={index}
                          ref={firstDivRef}
                          className="mt-[20px] rounded-xl bg-[#F5F6F9] min-w-full max-w-full aspect-video  flex flex-col justify-start items-start"
                          onClick={() => {
                            setSavedPlan(true);
                            setPlanData(data?.planData);
                            setPhotos(data?.photos);
                          }}
                        >
                          <img
                            className="w-full aspect-video rounded-xl object-cover"
                            src={data?.photos[0]?.urls?.regular}
                          ></img>
                          <div
                            className={`w-full rounded-xl bg-gradient-to-t from-[#000000bd] h-[100px] mt-[-100px] to-transparent to-95% from-2% flex flex-col justify-end items-start p-[10px] z-[3] py-[10px]`}
                            style={
                              {
                                // minHeight: `${firstDivHeight}px`,
                                // marginTop: `-${firstDivHeight}px`,
                              }
                            }
                          >
                            {/* {firstDivHeight} */}
                            <div className="w-full overflow-hidden whitespace-nowrap text-ellipsis line-clamp-1  text-[18px] text-white">
                              {data?.planData?.tripDetails?.location}
                            </div>
                            <div className="w-full flex justify-start mt-[5px] items-center">
                              <span className="px-[8px] h-[27px] text-[13px] rounded-lg flex justify-center items-center bg-[#ffffff] text-black">
                                <div className="mr-[5px] flex justify-center items-center  z-[5]">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="lucide lucide-calendar-plus"
                                  >
                                    <path d="M8 2v4" />
                                    <path d="M16 2v4" />
                                    <path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" />
                                    <path d="M3 10h18" />
                                    <path d="M16 19h6" />
                                    <path d="M19 16v6" />
                                  </svg>
                                </div>
                                {data?.planData?.tripDetails?.duration}
                              </span>
                              <span className="px-[8px] h-[27px] text-[13px] rounded-lg flex justify-center items-center bg-[#ffffff] text-black ml-[10px]">
                                <div className="mr-[5px] flex justify-center items-center  z-[5]">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="lucide lucide-user"
                                  >
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                  </svg>
                                </div>
                                {data?.planData?.tripDetails?.groupSize}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <>No Saved Trip PLan</>
                )}
              </>
            )}

            {/* <button onClick={() => fetchPhotos()}>Kolkata</button> */}
          </div>
        </>
      )}
    </>
  );
};
export default AiTripPlanner;
