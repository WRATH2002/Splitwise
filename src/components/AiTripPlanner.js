import React, { useEffect, useRef, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PiSunHorizon } from "react-icons/pi";
import { db } from "../firebase";
import firebase from "../firebase";
import { arrayUnion, onSnapshot } from "firebase/firestore";
import map from "../assets/img/map.png";
import { mirage } from "ldrs";
import TourExpense from "./TourExpense";
import Map from "./Map";

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
          placeName: "Pahaxlam - Aru Valley & Betaab Valley",
          placeDetails:
            "Explore the scenic valley of Pahaxlam, surrounded by lush forests and snow-capped peaks. Visit the picturesque Aru Valley and the famous Betaab Valley, known for their stunning natural beauty.",
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
  const [subLoading, setSubLoading] = useState(false);
  const [planData, setPlanData] = useState({});
  const [photos, setPhotos] = useState([]);
  const [city, setCity] = useState("Kolkata");
  const [mode, setMode] = useState("Plan a Trip");
  const [pos, setPos] = useState("International");
  const [imageIndex, setImageIndex] = useState(0);
  const [APIFlag, setAPIFlag] = useState(true);
  const [searchSuggestion, setSearchSuggestion] = useState([]);
  const [closeModal, setCloseModal] = useState(false);
  const [savedPlan, setSavedPlan] = useState(false);
  const [tripPLanDataHistory, setTripPlanDataHistory] = useState([]);
  const [destinationSuggestion, setDestinationSuggestion] = useState([]);
  const firstDivRef = useRef(null);
  const [errorModal, setErrorModal] = useState(false);
  const [showDestSug, setShowDestSug] = useState(false);
  const [UIColor, setUIColor] = useState("");
  const [firstDivHeight, setFirstDivHeight] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [longg, setLongg] = useState("");
  const [latt, setLatt] = useState("");
  const [plname, setPlname] = useState("");

  function onlyURLsPart(data) {
    return data?.map((obj) => ({ regular: obj?.urls?.regular }));
  }

  useEffect(() => {
    console.log("photos");
    console.log(photos);
    console.log(onlyURLsPart());
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
    response_mime_type: "application/json",
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
        ` budget , Give me a Hotels options list (as an array of objects) with HotelName, Hotel address, Price, hotel image url, proper accurate geoCordinates in latitude and longitude, rating, descriptions and suggest itinerary (as an array of objects) with placeName, Place Details, Place Image Url, proper accurate geoCordinates in latitude and longitude, ticket Pricing (in INR), place ratings if possible, Time to travel each of the location for ` +
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
      hotelName: "The Exlin, Darjeeling",
      hotelAddress: "Richmond Hill, Darjeeling, West Bengal 734101",
      price: "₹6,000 per night (approx)",
      imageUrl: "https://example.com/images/exlin.jpg",
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
    // console.log(result.response.text().slice(7).split("```")[0]);
    // setPlanData(JSON.parse(result.response.text().slice(7).split("```")[0]));
    console.log(result.response?.candidates[0]?.content?.parts[0]?.text);
    console.log(
      JSON.parse(result.response?.candidates[0]?.content?.parts[0]?.text)
    );
    setPlanData(
      JSON.parse(result.response?.candidates[0]?.content?.parts[0]?.text)
    );
  }

  async function getDestSuggestion() {
    console.log("generating destination suggestion");
    const chatSession = model.startChat({
      generationConfig,
      // safetySettings: Adjust safety settings
      // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [],
    });

    const result = await chatSession.sendMessage(
      `Generate a list of the best travel destinations in JSON format, considering the following criteria: budget ` +
        budget +
        `, number of travelers ` +
        persons +
        `, travel group type ` +
        crowd +
        `, preferred setting ` +
        mood +
        `, and duration ` +
        duration +
        `. The response should be an array of objects where each object contains two attributes, first attribute name : the name of a place followed by its full country name, separated by a comma with no spaces before or after the comma , second attribute budget : approx budget in INR. Example format:


[{name : "Place Name,Country Name", budget : "approx budget"},{name : "Place Name,Country Name", budget : "approx budget"},...]`
    );
    console.log(result.response);
    // console.log(result.response?.text);
    console.log(result.response?.candidates[0]?.content?.parts[0]?.text);
    setDestinationSuggestion(
      JSON.parse(result.response?.candidates[0]?.content?.parts[0]?.text)
    );
    setShowDestSug(true);
    // console.log(result.response?.text()?.slice(7)?.split("```")[0]);
    // setPlanData(JSON.parse(result.response?.text()?.slice(7)?.split("```")[0]));
  }

  useEffect(() => {
    console.log(planData);
  }, [planData]);

  const fetchPhotos = async () => {
    try {
      const response = await fetch(
        "https://api.unsplash.com/search/photos?query=" +
          destination?.split(",")[0]?.split(" ")?.join("_") +
          "&client_id=" +
          process.env.REACT_APP_UNSPLASH_API_KEY
      );
      const data = await response.json();
      console.log(data.results);
      setPhotos(onlyURLsPart(data.results));
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
        TripPlan: arrayUnion({
          planData: planData,
          photos: photos,
          budget: budget,
          crowd: crowd,
          mood: mood,
          duration: duration,
        }),
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
      setUIColor(snapshot?.data()?.Theme);
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

  useEffect(() => {
    setSubLoading(false);
  }, [destinationSuggestion]);

  function getCoordinates() {
    return planData?.itinerary[3]?.plan?.map((item) => ({
      latitude: item.geoCoordinates.latitude,
      longitude: item.geoCoordinates.longitude,
    }));
  }

  // useEffect(() => {
  //   getCoordinates();
  // }, [dayNumber]);

  return (
    <>
      {loading ? (
        <>
          {" "}
          <div className="w-full h-[100svh] top-0 left-0 fixed bg-[#70708628] backdrop-blur-md flex flex-col justify-center items-center p-[20px] z-50 font-[google] font-normal">
            <div className="w-full h-[180px]  bi flex justify-center mb-[-180px] rounded-3xl items-center blur-sm">
              <div className="w-full h-full  bi flex justify-center rounded-3xl items-center p-[1.5px] blur-none">
                <div className="w-full h-full bg-white rounded-[21px]"></div>
              </div>
            </div>
            {/* <div className="w-full h-[180px]  bi flex justify-center mb-[-180px] rounded-3xl items-center z-[5] opacity-20 ">
              <div className="w-full h-full  bi flex justify-center rounded-3xl items-center p-[1.5px] blur-none">
                <div className="w-full h-full bg-white rounded-[21px]"></div>
              </div>
            </div> */}
            <div className="w-full h-[180px] flex flex-col justify-center items-center p-[2px] bg-transparent rounded-3xl z-10 backdrop-blur-none">
              <div className="w-full h-full flex flex-col justify-center items-center p-[30px] py-[25px] d b bg-[#ffffff55]  backdrop-blur-xl blur-none rounded-[20px] ">
                <l-mirage size="60" speed="2.5" color="#191A2C"></l-mirage>
                <div className="mt-[10px] text-center">
                  Hold tight! We're working on your Trip.
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}

      {subLoading ? (
        <>
          {" "}
          <div className="w-full h-[100svh] top-0 left-0 fixed bg-[#70708628] backdrop-blur-md flex flex-col justify-center items-center p-[20px] z-50 font-[google] font-normal">
            <div className="w-full h-[180px]  bi flex justify-center mb-[-180px] rounded-3xl items-center blur-sm">
              <div className="w-full h-full  bi flex justify-center rounded-3xl items-center p-[1.5px] blur-none">
                <div className="w-full h-full bg-white rounded-[21px]"></div>
              </div>
            </div>
            <div className="w-full h-[180px]  bi flex justify-center mb-[-180px] rounded-3xl items-center z-[5] opacity-20 blur-[1px]">
              <div className="w-full h-full  bi flex justify-center rounded-3xl items-center p-[1.5px] blur-none">
                <div className="w-full h-full bg-white rounded-[21px]"></div>
              </div>
            </div>
            <div className="w-full h-[180px] flex flex-col justify-center items-center p-[2px] bg-transparent rounded-3xl z-10 backdrop-blur-none">
              <div className="w-full h-full flex flex-col justify-center items-center p-[30px] py-[25px] d b bg-[#ffffff55]  backdrop-blur-xl blur-none rounded-[20px] ">
                <l-mirage size="60" speed="2.5" color="#191A2C"></l-mirage>
                <div className="mt-[10px] text-center">
                  Hold tight! We're mapping out the best places for your trip
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}

      {errorModal ? (
        <>
          {" "}
          <div className="w-full h-[100svh] top-0 left-0 fixed bg-[#70708628] backdrop-blur-md flex flex-col justify-end items-center p-[20px] z-50 font-[google] font-normal">
            {/* <div className="w-full h-[190px]  bi flex justify-center mb-[-190px] rounded-3xl items-center p-[2px] blur-sm">
              <div className="w-full h-full bg-white rounded-[22px] "></div>
            </div> */}

            <div className="w-full h-[190px] flex flex-col justify-center items-start p-[30px] py-[25px]  bg-[#ffffff] rounded-3xl drop-shadow-sm ">
              <span className="text-[22px] ">Action Required</span>
              <span className="text-[14.5px] mt-[5px] text-[#000000a9] flex flex-col justify-start items-start w-full h-auto">
                Fill Up all the below options to generate best results based on
                your requirements.
              </span>

              <div className="w-full h-auto mt-[10px] flex justify-end items-end">
                <div
                  className="w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] text-[14px] bg-[#191A2C] ml-[10px] text-[white]"
                  onClick={() => {
                    setErrorModal(false);
                  }}
                >
                  Ok
                </div>
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
                  style={{
                    backgroundColor: ` ${UIColor}`,
                  }}
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
                    setSection("plan");
                    setDayNumber(0);
                    setDestinationSuggestion([]);
                  }}
                >
                  No
                </div>
                <div
                  className="w-auto h-auto rounded-2xl cursor-pointer px-[15px] py-[8px] text-[14px] bg-[#191A2C] ml-[10px] text-[white]"
                  onClick={() => {
                    setCloseModal(false);
                    addTripPlanToFirebase();
                    setSection("plan");
                    setDayNumber(0);
                    setDestinationSuggestion([]);
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

      {showMap ? (
        <>
          <Map
            location={plname}
            latitude={latt}
            longitude={longg}
            setShowMap={setShowMap}
            // cord={getCoordinates()}
          />
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
                setSection("plan");
                setDayNumber(0);
                setSavedPlan(false);
                setDestinationSuggestion([]);
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
            <div className="fixed w-full h-[115px] flex flex-col justify-start items-start p-[20px] top-0 left-0 bg-gradient-to-b from-white to-[#ffffff8d] backdrop-blur-xl z-30">
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
              <span className="text-[15px] flex justify-start items-center min-h-[35px] overflow-y-visible mt-[7px] w-full overflow-x-scroll">
                <div
                  className={`px-[15px] h-full rounded-xl text-[14px] flex justify-center items-center whitespace-nowrap`}
                  style={{ backgroundColor: `${UIColor}` }}
                >
                  <div className="mr-[8px] flex justify-center items-center  z-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
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
                <div
                  className={`px-[15px] h-full rounded-xl text-[14px] flex justify-center items-center ml-[10px] whitespace-nowrap`}
                  style={{ backgroundColor: `${UIColor}` }}
                >
                  <div className="mr-[8px]  flex justify-center items-center  z-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
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
                <div
                  className={`px-[15px] h-full rounded-xl text-[14px] flex justify-center items-center ml-[10px] whitespace-nowrap`}
                  style={{ backgroundColor: `${UIColor}` }}
                >
                  <div className="mr-[8px] flex justify-center items-center  z-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
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
            {photos.length == 0 ? (
              <>
                <div
                  className={`w-full aspect-video rounded-2xl flex justify-center items-center bg-[${UIColor}]`}
                  style={{ backgroundColor: `${UIColor}` }}
                  // src={photos[imageIndex]?.urls?.regular}
                >
                  <div className="mr-[5px]">
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
                      class="lucide lucide-triangle-alert"
                    >
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                      <path d="M12 9v4" />
                      <path d="M12 17h.01" />
                    </svg>
                  </div>{" "}
                  Failed to Load Images
                </div>
              </>
            ) : (
              <>
                <img
                  className="w-full aspect-video object-cover  rounded-2xl"
                  src={photos[imageIndex]?.regular}
                ></img>
              </>
            )}

            <div className="w-full flex justify-start items-center mt-[20px]">
              <div
                className={
                  "px-[15px] h-[35px] flex justify-center border  items-center rounded-xl " +
                  (section == "plan"
                    ? " bg-[#191A2C] text-white border-[#191A2C]"
                    : ` bg-transparent text-black border-[#efefef]`)
                }
                // style={{
                //   backgroundColor:
                //     section == "plan" ? "#191A2C" : ` ${UIColor}`,
                // }}
                onClick={() => {
                  setSection("plan");
                }}
              >
                Trip Plan
              </div>
              <div
                className={
                  "px-[15px] h-[35px] flex justify-center border items-center ml-[10px] rounded-xl " +
                  (section == "hotel"
                    ? " bg-[#191A2C] text-white border-[#191A2C]"
                    : ` bg-transparent text-black border-[#efefef]`)
                }
                // style={{
                //   backgroundColor:
                //     section == "hotel" ? "#191A2C" : ` ${UIColor}`,
                // }}
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
                            <div
                              className=" mt-[-1px]  flex justify-center items-center  z-10 bg-white py-[5px]"
                              onClick={() => {
                                setShowMap(true);
                                setLatt(data?.geoCoordinates?.latitude);
                                setLongg(data?.geoCoordinates?.longitude);
                                setPlname(data?.hotelName);
                              }}
                            >
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
                            <span
                              onClick={() => {
                                setShowMap(true);
                                setLatt(data?.geoCoordinates?.latitude);
                                setLongg(data?.geoCoordinates?.longitude);
                                setPlname(data?.hotelName);
                              }}
                            >
                              {data?.hotelName}
                            </span>
                            <span
                              className="text-[15px] text-[#00000085] leading-[20px] mt-[5px] pr-[10px]"
                              onClick={() => {
                                setShowMap(true);
                                setLatt(data?.geoCoordinates?.latitude);
                                setLongg(data?.geoCoordinates?.longitude);
                                setPlname(data?.hotelName);
                              }}
                            >
                              {data?.description}
                            </span>

                            <span className="text-[15px] text-[#00000085] leading-[20px] mt-[10px] pr-[10px] flex justify-start">
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
                              <div
                                className={`px-[12px] h-[34px] bg-[${UIColor}] text-[14px] rounded-xl flex justify-center items-center mr-[10px] mb-[5px]`}
                                style={{ backgroundColor: `${UIColor}` }}
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
                                    class="lucide lucide-star"
                                  >
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                  </svg>
                                </div>{" "}
                                {data?.rating}
                              </div>
                            </span>

                            <div
                              className={`px-[12px] h-[34px] bg-[${UIColor}] text-[14px] rounded-xl flex justify-center items-center mr-[10px] mb-[5px]`}
                              style={{ backgroundColor: `${UIColor}` }}
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
                            {/* <div className="px-[12px] h-[34px] bg-[#F5F6F9] text-[15px] rounded-xl flex justify-center items-center mr-[10px] mb-[5px]">
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
                          "mr-[10px] px-[15px] h-full flex justify-center border items-center rounded-xl whitespace-nowrap cursor-pointer" +
                          (index == dayNumber
                            ? " bg-[#191A2C] text-white border-[#191A2C]"
                            : ` bg-transparent text-black border-[#efefef]`)
                        }
                        // style={{
                        //   backgroundColor:
                        //     index == dayNumber ? "#191A2C" : ` ${UIColor}`,
                        // }}
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
                            <div
                              className=" mt-[-1px]  flex justify-center items-center  z-10 bg-white py-[5px]"
                              onClick={() => {
                                setShowMap(true);
                                setLatt(data?.geoCoordinates?.latitude);
                                setLongg(data?.geoCoordinates?.longitude);
                                setPlname(data?.placeName);
                              }}
                            >
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
                            <span
                              onClick={() => {
                                setShowMap(true);
                                setLatt(data?.geoCoordinates?.latitude);
                                setLongg(data?.geoCoordinates?.longitude);
                                setPlname(data?.placeName);
                              }}
                            >
                              {data?.placeName}
                            </span>
                            <span
                              className="text-[15px] text-[#00000085] leading-[20px] mt-[5px] pr-[10px]"
                              onClick={() => {
                                setShowMap(true);
                                setLatt(data?.geoCoordinates?.latitude);
                                setLongg(data?.geoCoordinates?.longitude);
                                setPlname(data?.placeName);
                              }}
                            >
                              {data?.placeDetails}
                            </span>
                            {/* <span className="flex justify-start items-center mt-[15px]"> */}
                            <div
                              className={`px-[12px] min-h-[34px] h-auto leading-4 py-[8px] bg-[${UIColor}] text-[14px] mt-[15px] rounded-xl flex justify-center items-start mr-[10px] mb-[5px]`}
                              style={{ backgroundColor: `${UIColor}` }}
                            >
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

                            <div
                              className={`px-[12px] min-h-[34px] h-auto leading-4 py-[8px] bg-[${UIColor}] text-[14px] rounded-xl flex justify-center items-start mr-[10px] mb-[5px]`}
                              style={{ backgroundColor: `${UIColor}` }}
                            >
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
                            <div
                              className={`px-[12px] min-h-[34px] h-auto leading-4 py-[8px] bg-[${UIColor}] text-[14px] rounded-xl flex justify-center items-start mr-[10px] mb-[5px]`}
                              style={{ backgroundColor: `${UIColor}` }}
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
          <div className="w-full h-[calc(100svh-60px)] p-[20px] font-[google] font-normal flex justify-start items-start flex-col pb-[0px]">
            <div className="w-[calc(100%+40px)] min-h-[140px] flex flex-col justify-center items-center ml-[-20px] mt-[-20px] bg-[#ffffff] text-black ">
              <img
                src={map}
                className="h-[140px]  w-full left-0 top-0 opacity-40 object-contain fixed z-0"
              ></img>
              <div className="w-full h-full flex flex-col justify-center items-center z-10">
                <span className="text-[24px] text-center w-full mt-[5px]">
                  Plan Your Perfect Trip
                </span>
                <span className="text-[24px] text-center w-full mt-[-7px] flex justify-center items-center">
                  with{" "}
                  <div className="bg-clip-text text-transparent bg-gradient-to-tr from-[#ffb758] to-[#fc0394] ml-[5px] mr-[5px]">
                    AI
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fc0394"
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
              </div>
            </div>
            {/* <div className="w-[calc(100%+40px)] min-h-[140px] mt-[-140px] flex flex-col justify-center items-center ml-[-20px]  bg-[#191A2C] text-white ">
              <img src={map}></img>
            </div> */}
            <div className="w-full flex flex-col justify-start items-start h-[calc(100%-120px)] overflow-y-scroll">
              <div className="w-full flex justify-center items-center mt-[20px]">
                <div
                  className={
                    "px-[15px] h-[40px] flex justify-center border items-center rounded-xl " +
                    (mode == "Plan a Trip"
                      ? "  text-white border-[#191A2C]"
                      : `  text-black border-[#efefef]`)
                  }
                  style={{
                    backgroundColor:
                      mode == "Plan a Trip" ? "#191A2C" : `transparent`,
                  }}
                  onClick={() => {
                    setMode("Plan a Trip");
                  }}
                >
                  Plan a Trip
                </div>
                <div
                  className={
                    "px-[15px] h-[40px] flex justify-center border items-center rounded-xl  ml-[8px]" +
                    (mode == "Saved Plans"
                      ? "  text-white border-[#191A2C]"
                      : `  text-black border-[#efefef]`)
                  }
                  style={{
                    backgroundColor:
                      mode == "Saved Plans" ? "#191A2C" : `transparent`,
                  }}
                  onClick={() => {
                    setMode("Saved Plans");
                  }}
                >
                  Saved Plans
                  {/* <div className="w-[20px] h-[20px] rounded-full absolute" 
                  style={{backgroundColor : `${UIColor}`}}></div> */}
                </div>{" "}
                {/* <div
                  className={
                    "px-[15px] h-[40px] flex justify-center border items-center rounded-xl  ml-[8px]" +
                    (mode == "Ongoing"
                      ? "  text-white border-[#191A2C]"
                      : `  text-black border-[#efefef]`)
                  }
                  style={{
                    backgroundColor:
                      mode == "Ongoing" ? "#191A2C" : `transparent`,
                  }}
                  onClick={() => {
                    setMode("Ongoing");
                  }}
                >
                  Ongoing
                </div> */}
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
                      className={`w-full text-[16px] pl-[42px] h-[45px] rounded-xl border border-[#efefef] px-[15px] outline-none z-0 `}
                      // style={{ backgroundColor: `${UIColor}` }}
                      value={destination}
                      onChange={(e) => {
                        setDestination(e.target.value);
                      }}
                    ></input>
                    <div
                      className={
                        "h-[35px]  z-[2] rounded-xl  flex justify-end items-center text-[16px] p-[1.5px] bii mr-[5px] cursor-pointer" +
                        (destinationSuggestion.length > 0
                          ? " w-[80px] ml-[-85px]"
                          : " w-[60px] ml-[-65px]")
                      }
                      style={{ transition: ".3s" }}
                    >
                      {destinationSuggestion.length > 0 ? (
                        <div
                          className="w-[20px] h-full flex justify-center items-center text-white"
                          onClick={() => {
                            setShowDestSug(!showDestSug);
                          }}
                        >
                          {showDestSug ? (
                            <>
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
                                class="lucide lucide-chevron-up"
                              >
                                <path d="m18 15-6-6-6 6" />
                              </svg>
                            </>
                          ) : (
                            <>
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
                                class="lucide lucide-chevron-down"
                              >
                                <path d="m6 9 6 6 6-6" />
                              </svg>
                            </>
                          )}
                        </div>
                      ) : (
                        <></>
                      )}
                      <div
                        className={
                          `h-full w-[57px]  flex justify-center items-center text-[14px]  bg-[${UIColor}]` +
                          (destinationSuggestion.length > 0
                            ? " rounded-r-[10.5px] rounded-l-[10.5px]"
                            : " rounded-[10.5px]")
                        }
                        style={{ backgroundColor: `#ffffff` }}
                        onClick={() => {
                          if (
                            crowd.length != 0 &&
                            duration.length != 0 &&
                            persons.length != 0 &&
                            budget.length != 0 &&
                            mood.length != 0
                            //  && pos.length != 0
                          ) {
                            getDestSuggestion();
                            setSubLoading(true);
                          } else {
                            setErrorModal(true);
                          }
                        }}
                      >
                        Ask AI
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-0 flex justify-start items-start  z-20">
                    {searchSuggestion.length != 0 ? (
                      <div
                        className={`w-[calc(100%-40px)] left-[20px] mt-[5px] py-[7px] fixed h-auto rounded-xl bg-[${UIColor}] flex flex-col justify-start items-start z-10 `}
                        style={{ backgroundColor: `${UIColor}` }}
                      >
                        {searchSuggestion?.map((item, index) => {
                          return (
                            <>
                              <div
                                className={
                                  `min-h-[40px] h-auto w-full px-[15px] bg-[${UIColor}] flex justify-start items-start py-[5px]` +
                                  (index == 0
                                    ? " rounded-t-xl"
                                    : index == searchSuggestion.length - 1
                                    ? " rounded-b-xl"
                                    : " rounded-none")
                                }
                                style={{ backgroundColor: `${UIColor}` }}
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
                                <div className="h-full mr-[10px] flex justify-center items-start pt-[2px]  z-10">
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
                            </>
                          );
                        })}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="w-full flex flex-col justify-start items-start overflow-visible h-0 z-10">
                    {showDestSug ? (
                      <>
                        {destinationSuggestion.length != 0 ? (
                          <div className="w-full h-auto flex justify-start items-start flex-wrap mt-[10px] bg-white">
                            {destinationSuggestion?.map((data, index) => {
                              return (
                                <>
                                  <div
                                    className={
                                      `w-full h-[85px] p-[20px] bg-[${UIColor}] mb-[2px] flex justify-start items-center` +
                                      (index == 0
                                        ? " rounded-t-xl"
                                        : index ==
                                          destinationSuggestion.length - 1
                                        ? " rounded-b-xl"
                                        : " rounded-none")
                                    }
                                    style={{ backgroundColor: `${UIColor}` }}
                                    onClick={() => {
                                      setDestination(
                                        (data?.name).split(",")[0]
                                      );
                                      setShowDestSug(false);
                                    }}
                                  >
                                    <div className="h-full flex justify-start items-start ml-[-6px] mt-[2px]  z-10 ">
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
                                    <div className="flex flex-col justify-center items-start ml-[10px]">
                                      <div className="">
                                        {(data?.name).split(",")[0]},{" "}
                                        {(data?.name).split(",")[1]}
                                      </div>
                                      <div className="text-[14px] flex justify-start items-center mt-[3px]">
                                        <div className="mr-[3px]">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="1.7"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            class="lucide lucide-indian-rupee"
                                          >
                                            <path d="M6 3h12" />
                                            <path d="M6 8h12" />
                                            <path d="m6 13 8.5 8" />
                                            <path d="M6 13h3" />
                                            <path d="M9 13c6.667 0 6.667-10 0-10" />
                                          </svg>
                                        </div>{" "}
                                        {data?.budget} (approx)
                                      </div>
                                    </div>
                                  </div>
                                </>
                              );
                            })}
                          </div>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </div>

                  {/* <span className="text-[15px] mt-[10px] text-[#0000005d]">
                    Choose your preference
                  </span>
                  <div className="w-full h-auto flex justify-start items-center flex-wrap mt-[5px]">
                    <div
                      className={
                        "w-auto px-[13px] h-[45px] rounded-xl  flex justify-center items-center mr-[8px] mb-[8px]" +
                        (crowd == "Domestic"
                          ? " bg-[#191A2C] text-white"
                          : " bg-[#F5F6F9] text-black")
                      }
                      onClick={() => {
                        setCrowd("Domestic");
                      }}
                    >
                      Domestic
                    </div>
                    <div
                      className={
                        "w-auto px-[13px] h-[45px] rounded-xl  flex justify-center items-center mr-[8px] mb-[8px]" +
                        (crowd == "International"
                          ? " bg-[#191A2C] text-white"
                          : " bg-[#F5F6F9] text-black")
                      }
                      onClick={() => {
                        setCrowd("International");
                      }}
                    >
                      International
                    </div>
                  </div> */}

                  <span className="text-[15px] mt-[10px] text-[#0000005d]">
                    Choose your crowd
                  </span>
                  <div className="w-full h-auto flex justify-start items-center flex-wrap mt-[5px]">
                    <div
                      className={
                        "w-auto px-[13px] h-[45px] rounded-xl border  flex justify-center items-center mr-[8px] mb-[8px]" +
                        (crowd == "Kid's Friendly"
                          ? "  text-white border-[#191A2C]"
                          : `  text-black border-[#efefef]`)
                      }
                      style={{
                        backgroundColor:
                          crowd == "Kid's Friendly" ? "#191A2C" : ` white`,
                      }}
                      onClick={() => {
                        setCrowd("Kid's Friendly");
                      }}
                    >
                      Kids Friendly
                    </div>
                    <div
                      className={
                        "w-auto px-[13px] h-[45px] rounded-xl border  flex justify-center items-center mr-[8px] mb-[8px]" +
                        (crowd == "Friends"
                          ? "  text-white border-[#191A2C]"
                          : `  text-black border-[#efefef]`)
                      }
                      style={{
                        backgroundColor:
                          crowd == "Friends" ? "#191A2C" : ` white`,
                      }}
                      onClick={() => {
                        setCrowd("Friends");
                      }}
                    >
                      Friends
                    </div>
                    <div
                      className={
                        "w-auto px-[13px] h-[45px] rounded-xl border  flex justify-center items-center mr-[8px] mb-[8px] flex-grow" +
                        (crowd == "Family"
                          ? "  text-white border-[#191A2C]"
                          : `  text-black border-[#efefef]`)
                      }
                      style={{
                        backgroundColor:
                          crowd == "Family" ? "#191A2C" : ` white`,
                      }}
                      onClick={() => {
                        setCrowd("Family");
                      }}
                    >
                      Family
                    </div>
                    <div
                      className={
                        "w-auto px-[13px] h-[45px] rounded-xl border  flex justify-center items-center  mb-[8px] flex-grow" +
                        (crowd == "Solo"
                          ? "  text-white border-[#191A2C]"
                          : `  text-black border-[#efefef]`)
                      }
                      style={{
                        backgroundColor: crowd == "Solo" ? "#191A2C" : ` white`,
                      }}
                      onClick={() => {
                        setCrowd("Solo");
                        setPersons(1);
                      }}
                    >
                      Solo
                    </div>
                    <div
                      className={
                        "w-auto px-[13px] h-[45px] rounded-xl border  flex justify-center items-center mr-[8px] mb-[8px]" +
                        (crowd == "Couple"
                          ? "  text-white border-[#191A2C]"
                          : `  text-black border-[#efefef]`)
                      }
                      style={{
                        backgroundColor:
                          crowd == "Couple" ? "#191A2C" : ` white`,
                      }}
                      onClick={() => {
                        setCrowd("Couple");
                        setPersons(2);
                      }}
                    >
                      Couple
                    </div>

                    {/* <input className="w-full text-[16px] pl-[42px] h-[45px] rounded-xl bg-[#F5F6F9] px-[15px] outline-none z-0 "></input> */}
                  </div>
                  <div className="w-full mt-[10px] h-auto flex justify-start items-start ">
                    <div className="w-[calc((100%-10px)/2)] flex flex-col justify-center items-start">
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
                          className={`w-full text-[16px] pl-[42px] h-[45px] rounded-xl border border-[#efefef] px-[15px] outline-none z-0 `}
                          // style={{ backgroundColor: `${UIColor}` }}
                          value={duration}
                          onChange={(e) => {
                            setDuration(e.target.value);
                          }}
                        ></input>
                      </div>
                    </div>
                    {crowd !== "Solo" && crowd !== "Couple" ? (
                      <>
                        <div className="w-[calc((100%-10px)/2)] flex flex-col justify-center items-start ml-[10px]">
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
                              className={`w-full text-[16px] pl-[42px] h-[45px] rounded-xl border border-[#efefef] px-[15px] outline-none z-0 `}
                              // style={{ backgroundColor: `${UIColor}` }}
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
                    className="w-full text-[16px] pl-[42px] h-[45px] rounded-xl bg-[#F5F6F9] px-[15px] outline-none z-0 "
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
                  <div className="w-full  flex justify-start items-center mt-[5px] flex-wrap">
                    <div
                      className={
                        "w-auto px-[13px] h-[45px] rounded-xl border flex justify-center items-center mr-[8px] mb-[8px]" +
                        (budget == "Cheap"
                          ? "  text-white border-[#191A2C]"
                          : `  text-black border-[#efefef]`)
                      }
                      style={{
                        backgroundColor:
                          budget == "Cheap" ? "#191A2C" : ` transparent`,
                      }}
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
                          class="lucide lucide-piggy-bank"
                        >
                          <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z" />
                          <path d="M2 9v1c0 1.1.9 2 2 2h1" />
                          <path d="M16 11h.01" />
                        </svg>
                      </div>{" "}
                      Cheap
                    </div>
                    <div
                      className={
                        "w-auto px-[13px] h-[45px] rounded-xl border flex justify-center items-center mb-[8px]" +
                        (budget == "Economy"
                          ? "  text-white border-[#191A2C]"
                          : `  text-black border-[#efefef]`)
                      }
                      style={{
                        backgroundColor:
                          budget == "Economy" ? "#191A2C" : ` transparent`,
                      }}
                      onClick={() => {
                        setBudget("Economy");
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
                      Economy
                    </div>
                    <div
                      className={
                        "w-auto px-[13px] h-[45px] rounded-xl border flex justify-center items-center ml-[8px] mb-[8px] flex-grow" +
                        (budget == "Moderate"
                          ? "  text-white border-[#191A2C]"
                          : `  text-black border-[#efefef]`)
                      }
                      style={{
                        backgroundColor:
                          budget == "Moderate" ? "#191A2C" : ` transparent`,
                      }}
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
                        "w-auto px-[13px] h-[45px] rounded-xl border flex justify-center items-center " +
                        (budget == "Luxury"
                          ? "  text-white border-[#191A2C]"
                          : `  text-black border-[#efefef]`)
                      }
                      style={{
                        backgroundColor:
                          budget == "Luxury" ? "#191A2C" : ` transparent`,
                      }}
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

                    {/* <input className="w-full text-[16px] pl-[42px] h-[45px] rounded-xl bg-[#F5F6F9] px-[15px] outline-none z-0 "></input> */}
                  </div>

                  <span className="text-[15px] mt-[10px] text-[#0000005d]">
                    Choose your mood
                  </span>
                  <div className="w-full h-auto flex justify-start items-center mt-[5px] flex-wrap">
                    <div
                      className={
                        "w-auto px-[13px] h-[45px] rounded-xl border  flex justify-center items-center mb-[8px] mr-[8px]" +
                        (mood == "Nature"
                          ? "  text-white border-[#191A2C]"
                          : `  text-black border-[#efefef]`)
                      }
                      style={{
                        backgroundColor:
                          mood == "Nature" ? "#191A2C" : ` transparent`,
                      }}
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
                          class="lucide lucide-trees"
                        >
                          <path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z" />
                          <path d="M7 16v6" />
                          <path d="M13 19v3" />
                          <path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5" />
                        </svg>
                      </div>{" "}
                      Nature
                    </div>
                    <div
                      className={
                        "w-auto px-[13px] h-[45px] rounded-xl border  flex justify-center items-center mb-[8px] mr-[8px]" +
                        (mood == "Party"
                          ? "  text-white border-[#191A2C]"
                          : `  text-black border-[#efefef]`)
                      }
                      style={{
                        backgroundColor:
                          mood == "Party" ? "#191A2C" : ` transparent`,
                      }}
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
                        "w-auto px-[13px] h-[45px] rounded-xl border  flex justify-center items-center mb-[8px] flex-grow" +
                        (mood == "Beach"
                          ? "  text-white border-[#191A2C]"
                          : `  text-black border-[#efefef]`)
                      }
                      style={{
                        backgroundColor:
                          mood == "Beach" ? "#191A2C" : ` transparent`,
                      }}
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
                    <div
                      className={
                        "w-auto px-[13px] h-[45px] rounded-xl border  flex justify-center items-center mr-[8px] mb-[8px]" +
                        (mood == "Mountain"
                          ? "  text-white border-[#191A2C]"
                          : `  text-black border-[#efefef]`)
                      }
                      style={{
                        backgroundColor:
                          mood == "Mountain" ? "#191A2C" : ` transparent`,
                      }}
                      onClick={() => {
                        setMood("Mountain");
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
                          class="lucide lucide-cable-car"
                        >
                          <path d="M10 3h.01" />
                          <path d="M14 2h.01" />
                          <path d="m2 9 20-5" />
                          <path d="M12 12V6.5" />
                          <rect width="16" height="10" x="4" y="12" rx="3" />
                          <path d="M9 12v5" />
                          <path d="M15 12v5" />
                          <path d="M4 17h16" />
                        </svg>
                      </div>{" "}
                      Mountain
                    </div>{" "}
                    <div
                      className={
                        "w-auto px-[13px] h-[45px] rounded-xl border  flex justify-center items-center mb-[8px] flex-grow" +
                        (mood == "Amusement Park"
                          ? "  text-white border-[#191A2C]"
                          : `  text-black border-[#efefef]`)
                      }
                      style={{
                        backgroundColor:
                          mood == "Amusement Park" ? "#191A2C" : ` transparent`,
                      }}
                      onClick={() => {
                        setMood("Amusement Park");
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
                          class="lucide lucide-ferris-wheel"
                        >
                          <circle cx="12" cy="12" r="2" />
                          <path d="M12 2v4" />
                          <path d="m6.8 15-3.5 2" />
                          <path d="m20.7 7-3.5 2" />
                          <path d="M6.8 9 3.3 7" />
                          <path d="m20.7 17-3.5-2" />
                          <path d="m9 22 3-8 3 8" />
                          <path d="M8 22h8" />
                          <path d="M18 18.7a9 9 0 1 0-12 0" />
                        </svg>
                      </div>{" "}
                      Amusement Park
                    </div>
                    <div
                      className={
                        "w-auto px-[13px] h-[45px] rounded-xl border  flex justify-center items-center mr-[8px] mb-[8px]" +
                        (mood == "Island"
                          ? "  text-white border-[#191A2C]"
                          : `  text-black border-[#efefef]`)
                      }
                      style={{
                        backgroundColor:
                          mood == "Island" ? "#191A2C" : ` transparent`,
                      }}
                      onClick={() => {
                        setMood("Island");
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
                      Island
                    </div>
                    <div
                      className={
                        "w-auto px-[13px] h-[45px] rounded-xl border  flex justify-center items-center mr-[8px] mb-[8px]" +
                        (mood == "Adventure"
                          ? "  text-white border-[#191A2C]"
                          : `  text-black border-[#efefef]`)
                      }
                      style={{
                        backgroundColor:
                          mood == "Adventure" ? "#191A2C" : ` transparent`,
                      }}
                      onClick={() => {
                        setMood("Adventure");
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
                          class="lucide lucide-backpack"
                        >
                          <path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
                          <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                          <path d="M8 21v-5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5" />
                          <path d="M8 10h8" />
                          <path d="M8 18h8" />
                        </svg>
                      </div>{" "}
                      Adventure
                    </div>
                    <div
                      className={
                        "w-auto px-[13px] h-[45px] rounded-xl border  flex justify-center items-center mb-[8px] flex-grow" +
                        (mood == "Camping"
                          ? "  text-white border-[#191A2C]"
                          : `  text-black border-[#efefef]`)
                      }
                      style={{
                        backgroundColor:
                          mood == "Camping" ? `#191A2C` : ` transparent`,
                      }}
                      onClick={() => {
                        setMood("Camping");
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
                          class="lucide lucide-tent"
                        >
                          <path d="M3.5 21 14 3" />
                          <path d="M20.5 21 10 3" />
                          <path d="M15.5 21 12 15l-3.5 6" />
                          <path d="M2 21h20" />
                        </svg>
                      </div>{" "}
                      Camping
                    </div>
                    <div
                      className={
                        "w-auto px-[13px] h-[45px] rounded-xl border  flex justify-center items-center mr-[8px] mb-[8px]" +
                        (mood == "Historical"
                          ? "  text-white border-[#191A2C]"
                          : `  text-black border-[#efefef]`)
                      }
                      style={{
                        backgroundColor:
                          mood == "Historical" ? "#191A2C" : ` transparent`,
                      }}
                      onClick={() => {
                        setMood("Historical");
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
                          class="lucide lucide-amphora"
                        >
                          <path d="M10 2v5.632c0 .424-.272.795-.653.982A6 6 0 0 0 6 14c.006 4 3 7 5 8" />
                          <path d="M10 5H8a2 2 0 0 0 0 4h.68" />
                          <path d="M14 2v5.632c0 .424.272.795.652.982A6 6 0 0 1 18 14c0 4-3 7-5 8" />
                          <path d="M14 5h2a2 2 0 0 1 0 4h-.68" />
                          <path d="M18 22H6" />
                          <path d="M9 2h6" />
                        </svg>
                      </div>{" "}
                      Historical
                    </div>
                    {/* <div className="w-auto px-[13px] h-full rounded-xl bg-[#F5F6F9] flex justify-center items-center ml-[8px]">
          Solo
        </div> */}
                    {/* <input className="w-full text-[16px] pl-[42px] h-[45px] rounded-xl bg-[#F5F6F9] px-[15px] outline-none z-0 "></input> */}
                  </div>
                  <div className="w-full h-auto flex justify-center items-center">
                    {" "}
                    <div
                      className={
                        "mt-[20px] min-h-[45px] rounded-xl px-[15px] flex justify-center items-center  " +
                        (destination.length != 0 &&
                        crowd.length != 0 &&
                        duration.length != 0 &&
                        persons.length != 0 &&
                        budget.length != 0
                          ? " bg-gradient-to-l from-[#ff7b00] to-[#fc0394] text-white"
                          : " bg-gradient-to-br from-[#ff7b0034] to-[#fc039434] text-[#0000009d] ")
                      }
                      onClick={() => {
                        if (
                          destination.length != 0 &&
                          crowd.length != 0 &&
                          duration.length != 0 &&
                          persons.length != 0 &&
                          budget.length != 0
                          // && pos.length != 0
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
              ) : mode == "Saved Plans" ? (
                <>
                  {tripPLanDataHistory.length != 0 ? (
                    <>
                      {tripPLanDataHistory?.map((data, index) => {
                        return (
                          <div
                            key={index}
                            ref={firstDivRef}
                            className={`mt-[20px] rounded-xl bg-[${UIColor}] min-w-full max-w-full aspect-video  flex flex-col justify-start items-start`}
                            style={{ backgroundColor: `${UIColor}` }}
                            onClick={() => {
                              setSavedPlan(true);
                              setPlanData(data?.planData);
                              setPhotos(data?.photos);
                            }}
                          >
                            {data?.photos.length != 0 ? (
                              <img
                                className="w-full aspect-video rounded-xl object-cover"
                                src={data?.photos[0]?.regular}
                              ></img>
                            ) : (
                              <>
                                <div
                                  className={`w-full aspect-video rounded-xl object-cover bg-[${UIColor}] flex justify-center items-center`}
                                  style={{ backgroundColor: `${UIColor}` }}
                                >
                                  {/* Failed to Load Photos */}
                                </div>
                              </>
                            )}
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
                                <span className="px-[8px] h-[27px] text-[13px] rounded-xl flex justify-center items-center bg-[#ffffff] text-black">
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
                                <span className="px-[8px] h-[27px] text-[13px] rounded-xl flex justify-center items-center bg-[#ffffff] text-black ml-[10px]">
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
              ) : (
                <>
                  <div className="w-full h-full">
                    <TourExpense />
                  </div>
                </>
              )}
            </div>
            {/* <button onClick={() => fetchPhotos()}>Kolkata</button> */}
          </div>
        </>
      )}
    </>
  );
};
export default AiTripPlanner;
