import churchBuildingImage from "./images/church-building.png";
import youthMinistryImage from "./images/youth-ministry.jpeg";
import choirImage from "./images/choir.jpeg";
import sanitationImage from "./images/sanitation.jpeg";
import usheringImage from "./images/ushering.jpeg";
import evangelismImage from "./images/evangelism.jpeg";
import mediaImage from "./images/media.jpeg";
import welfareImage from "./images/welfare.jpeg";

export const churchInfo = {
  name: "The Pavilion of His Majesty",
  denomination: "The Redeemed Christian Church of God",
  denominationShort: "RCCG",
  type: "Pentecostal Church",

  address: {
    street: "Lane 4 Oko Oba, Alapini Street",
    city: "Akinmoorin",
    state: "Oyo State",
    country: "Nigeria",
    full: "Lane 4 Oko Oba, Alapini Street, Akinmoorin, Oyo, Oyo State, Nigeria",
  },

  contact: {
    email: "thepavilionofhismajesty@gmail.com",
    pastorPhone: "+234 703 802 1881",
  },

  social: {
    instagram: {
      name: "The Pavilion of His Majesty",
      url: "https://www.instagram.com/thepavilionofhismajesty/",
    },
    tiktok: {
      name: "The Pavilion of His Majesty",
      url: "https://www.tiktok.com/@the_pavilion0",
    },
  },

  tagline: "A Place of His Presence. A People of His Purpose.",

  anniversary: {
    years: 20,
    year: 2026,
    title: "20 Years of God's Faithfulness",
  },
};

export const weeklyProgrammes = [
  {
    day: "Tuesday",
    title: "Digging Deep",
    time: "5:30 PM – 6:30 PM",
    description: "A time of deeper study of God's Word and spiritual growth.",
  },

  {
    day: "Thursday",
    title: "Faith Clinic",
    time: "5:30 PM – 6:30 PM",
    description:
      "A time of prayer, faith-building and spiritual strengthening.",
  },

  {
    day: "Sunday",
    title: "Sunday Service",
    time: "8:00 AM – 12:00 PM",
    description:
      "Our main weekly worship gathering for fellowship, worship and the Word.",
  },
];

export const ministries = [
  {
    id: "youth",
    name: "Youth Ministry",
    shortName: "Youth",
    description:
      "A Christ-centred community where young people grow in faith, purpose and service.",
    image: youthMinistryImage,
    highlight: "Ministry Sunday: Every third Sunday of the month.",
  },
  {
    id: "sanitation",
    name: "Sanitation",
    shortName: "Sanitation",
    description:
      "Helping maintain a clean, orderly and welcoming environment for worship and fellowship.",
    image: sanitationImage,
  },
  {
    id: "ushering",
    name: "Ushering",
    shortName: "Ushering",
    description:
      "Welcoming, guiding and assisting worshippers while helping create a warm church experience.",
    image: usheringImage,
  },
  {
    id: "choir",
    name: "Choir",
    shortName: "Choir",
    description:
      "Leading the church in worship and praise through music, song and a heart of service.",
    image: choirImage,
  },
  {
    id: "evangelism",
    name: "Evangelism",
    shortName: "Evangelism",
    description:
      "Taking the message of Christ beyond the church walls and reaching people with the Gospel.",
    image: evangelismImage,
  },
  {
    id: "media",
    name: "Media",
    shortName: "Media",
    description:
      "Supporting the church through communication, digital media, photography and content.",
    image: mediaImage,
  },
  {
    id: "welfare",
    name: "Welfare",
    shortName: "Welfare",
    description:
      "Extending care and practical support to members while strengthening our community of love.",
    image: welfareImage,
  },
];

export const events = [
  {
    id: "20th-anniversary-2026",
    slug: "20th-anniversary",
    title: "20 Years of God's Faithfulness",
    category: "Anniversary",
    date: "December 2026",
    dateLabel: "DECEMBER 2026",
    description:
      "The Pavilion of His Majesty celebrates 20 years of God's faithfulness, grace and presence. Join us as we celebrate the journey and look forward to what God is doing ahead.",
    image: churchBuildingImage,
    featured: true,
    status: "upcoming",
  },
];

export const cooperativeInfo = {
  title: "Pavilion Cooperative",
  description:
    "A cooperative initiative designed to encourage members to save, support one another and participate in opportunities that promote financial growth and collective wellbeing.",
  benefits: [
    "Encourages disciplined saving",
    "Promotes mutual support among members",
    "Creates opportunities for collective financial growth",
  ],
};

export const givingInfo = {
  bankName: "Access Bank",
  accountNumber: "0049441974",
  accountName: "RCCG The Pavilion",
  note: "Thank you for supporting the work of God through your giving. Please ensure you confirm the account details before making a transfer.",
};
