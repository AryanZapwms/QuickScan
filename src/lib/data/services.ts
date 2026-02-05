export interface ServiceItem {
  id: string;
  name: string;
  price?: number;
  discountedPrice?: number;
  features?: string[];
  image?: string;
  isPopular?: boolean;
}

export interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  services: ServiceItem[];
}

export const PATHOLOGY_SERVICES: ServiceItem[] = [
  {
    id: "blood-tests",
    name: "Blood tests & panels",
    features: ["CBC", "Hemoglobin", "Blood Sugar", "Platelet Count"],
    price: 999,
    discountedPrice: 499,
    isPopular: true,
  },
  {
    id: "urine-stool",
    name: "Urine & stool tests",
    features: ["Routine Analysis", "Culture & Sensitivity", "Microscopy"],
    price: 500,
    discountedPrice: 299,
  },
  {
    id: "thyroid-lipid-diabetes",
    name: "Thyroid, Lipid, Diabetes tests",
    features: ["TSH, T3, T4", "Cholesterol Profile", "HbA1c"],
    price: 1500,
    discountedPrice: 899,
    isPopular: true,
  },
  {
    id: "health-packages",
    name: "Health checkup packages",
    features: ["Full Body Checkup", "Senior Drug Package", "Women's Health"],
    price: 4999,
    discountedPrice: 2499,
    isPopular: true,
  },
  {
    id: "home-collection",
    name: "Home sample collection",
    features: ["Safe & Hygienic", "On-time Collection", "Expert Phlebotomists"],
    price: 200,
    discountedPrice: 0,
  },
  {
    id: "lab-visit",
    name: "Lab visit booking",
    features: ["Zero Waiting Time", "NABL Accredited Labs", "Digital Reports"],
    price: 0,
    discountedPrice: 0,
  },
];

export const RADIOLOGY_SERVICES: ServiceItem[] = [
  {
    id: "ct-scan",
    name: "CT Scan",
    features: ["High Resolution", "Contrast/Non-Contrast", "Brain/Chest/Abdomen"],
    price: 3500,
    discountedPrice: 2500,
    isPopular: true,
    image: "/images/ct-scan.jpg"
  },
  {
    id: "mri",
    name: "MRI",
    features: ["1.5T & 3T MRI", "Brain/Spine/Joints", "Claustrophobia Friendly"],
    price: 6500,
    discountedPrice: 3500,
    isPopular: true,
     image: "/images/mri.jpg"
  },
  {
    id: "pet-ct",
    name: "PET-CT",
    features: ["Whole Body Scan", "Oncology/Cancer Screening", "Advanced Technology"],
    price: 15000,
    discountedPrice: 11999,
  },
  {
    id: "x-ray",
    name: "X-Ray",
    features: ["Digital X-Ray", "Chest/Bones/Joints", "Instant Prints"],
    price: 800,
    discountedPrice: 400,
     image: "/images/xray.jpg"
  },
  {
    id: "ultrasound",
    name: "Ultrasound (Sono)",
    features: ["Abdomen/Pelvis", "Pregnancy Scans", "Doppler Studies"],
    price: 1800,
    discountedPrice: 1200,
  },
  {
    id: "mammography",
    name: "Mammography",
    features: ["Digital Mammography", "Breast Cancer Screening", "Female Technicians"],
    price: 2500,
    discountedPrice: 1800,
  },
  {
    id: "ecg-echo",
    name: "ECG / Echo",
    features: ["Cardiac Screening", "Detailed Heart Function", "Cardiologist Report"],
    price: 2000,
    discountedPrice: 1500,
  },
];

export const ALL_SERVICES_DATA = {
  pathology: {
    title: "Pathology / Lab Services",
    description: "Comprehensive range of diagnostic blood tests and health packages.",
    items: PATHOLOGY_SERVICES
  },
  radiology: {
    title: "Radiology / Imaging Services",
    description: "Advanced imaging technology including MRI, CT, X-Ray and more.",
    items: RADIOLOGY_SERVICES
  }
};

export const servicesData: Record<string, any> = {
  "mri": {
    id: "mri",
    title: "MRI Scan Services",
    description: "High-field 1.5T & 3T MRI scans for precise diagnosis of brain, spine, joints, and soft tissues.",
    price: 3500,
    originalPrice: 6500,
    discountedPrice: 3500,
    reportTime: "24 Hours",
    sampleRequired: "None",
    homeService: "Not Available",
    preparation: "Remove all metal objects (jewelry, watches, keys). Inform doctor if you have pacemakers or implants. 4-6 hours fasting for abdominal scans.",
    features: ["1.5T & 3T MRI Available", "Claustrophobia Friendly Tunnel", "Expert Radiologist Reporting", "Same Day Digital Reports"],
    testDetails: ["MRI Brain / Head", "MRI Cerivcal / Lumbar Spine", "MRI Knee / Shoulder / Joint", "MRI Abdomen / Pelvis", "MRI Angiography"],
    faqs: [
      {
        question: "Is MRI safe?",
        answer: "Yes, MRI uses magnetic fields and radio waves, not ionizing radiation. It is generally safe, but please inform us if you have any metal implants."
      },
      {
        question: "How long does an MRI scan take?",
        answer: "Most scans take between 15 to 45 minutes, depending on the body part being scanned."
      },
      {
        question: "Do I need contrast dye?",
        answer: "Contrast is used only for specific cases to get clearer images. Your doctor will advise if it is needed."
      }
    ]
  },
  "ct-scan": {
    id: "ct-scan",
    title: "CT Scan Services",
    description: "Advanced multi-slice CT Scan for detailed imaging of bones, blood vessels, and internal organs.",
    price: 2500,
    originalPrice: 3500,
    discountedPrice: 2500,
    reportTime: "Same Day",
    sampleRequired: "None",
    homeService: "Not Available",
    preparation: "Wear loose clothing. Remove metal objects. 4-6 hours fasting required for contrast CT scans. Drink plenty of water before and after.",
    features: ["128 Slice CT Scanner", "Low Radiation Dose", "High Resolution Imaging", "3D Reconstruction Available"],
    testDetails: ["CT Brain / Head", "CT Chest / Thorax / HRCT", "CT Abdomen / Pelvis", "CT KUB (Kidney, Ureter, Bladder)", "CT Angiography"],
    faqs: [
      {
        question: "How is CT different from MRI?",
        answer: "CT uses X-rays and is faster, better for bones and chest. MRI uses magnets and is better for soft tissues and brain."
      },
      {
        question: "Is the radiation harmful?",
        answer: "We use low-dose protocols to minimize radiation exposure while maintaining image quality. The benefit of accurate diagnosis outweighs the small risk."
      },
      {
        question: "Can I eat before a CT scan?",
        answer: "For non-contrast scans, you can eat. For contrast scans, 4 hours fasting is required."
      }
    ]
  },
  "health-packages": {
    id: "health-packages",
    title: "Full Body Health Checkup",
    description: "Comprehensive health assessment packages to monitor your well-being and detect potential issues early.",
    price: 1499,
    originalPrice: 3999,
    discountedPrice: 1499,
    reportTime: "24-48 Hours",
    sampleRequired: "Blood & Urine",
    homeService: "Available (Free in Metro Areas)",
    preparation: "10-12 hours overnight fasting is mandatory (water is allowed). Avoid alcohol for 24 hours. Wear loose sleeves for blood draw.",
    features: ["80+ Parameters Covered", "Free Home Sample Collection", "Doctor Consultation Included", "Digital & Hard Copy Reports"],
    packages: [
      {
        name: "Basic Health Check",
        price: 999,
        tests: ["CBC", "Diabetes Screen (Random Sugar)", "Cholesterol (Total)", "Kidney Screen (Creatinine)"]
      },
      {
        name: "Standard Full Body Check",
        price: 1499,
        tests: ["CBC + ESR", "Diabetes (Fasting + HbA1c)", "Lipid Profile", "Liver Function Test", "Kidney Function Test", "Thyroid (TSH)"]
      },
      {
        name: "Premium Senior Citizen Package",
        price: 2499,
        tests: ["Complete Hemogram", "Advanced Diabetes", "Cardiac Risk Markers", "Vitamin D & B12", "Bone Health", "Iron Profile"]
      }
    ],
    faqs: [
      {
        question: "Why is fasting required?",
        answer: "Fasting ensures accurate results for blood sugar, cholesterol, and other metabolic tests which are affected by food intake."
      },
      {
        question: "Can I take my medicines?",
        answer: "Yes, you can take regular medicines with water, unless specifically advised otherwise by your doctor."
      },
      {
        question: "Will a doctor review my report?",
        answer: "Yes, all our health packages include a complimentary consultation with a doctor to explain your reports."
      }
    ]
  },
  "blood-tests": {
    id: "blood-tests",
    title: "Blood Tests & Panels",
    description: "Wide range of blood tests for accurate diagnosis of various conditions.",
    price: 499,
    originalPrice: 999,
    discountedPrice: 499,
    reportTime: "12-24 Hours",
    sampleRequired: "Blood",
    homeService: "Available",
    preparation: "Fasting may be required depending on the specific test. Generally 8-10 hours fasting for sugar and lipid profiles.",
    features: ["NABL Accredited Labs", "Painless Sample Collection", "Digital Reports via Email/WhatsApp", "Home Collection Available"],
    testDetails: ["Complete Blood Count (CBC)", "Diabetes Screening (HbA1c)", "Thyroid Profile", "Lipid Profile", "Liver Function Test"],
    faqs: [
      {
        question: "Is home collection safe?",
        answer: "Yes, our phlebotomists follow strict hygiene protocols and use sterile, single-use kits."
      },
      {
        question: "When will I get my report?",
        answer: "Most routine blood test reports are available within 24 hours."
      }
    ]
  },
  "urine-stool": {
    id: "urine-stool",
    title: "Urine & Stool Tests",
    description: "Routine and specialized analysis for infection and metabolic disorders.",
    price: 299,
    originalPrice: 500,
    discountedPrice: 299,
    reportTime: "24 Hours",
    sampleRequired: "Urine / Stool",
    homeService: "Available",
    preparation: "Collect the mid-stream urine sample in the provided sterile container. For stool tests, follow specific instructions.",
    features: ["Sterile Containers Provided", "Microscopic Analysis", "Culture & Sensitivity Options", "Quick Reporting"],
    testDetails: ["Urine Routine & Microscopy", "Urine Culture", "Stool Routine", "Stool Occult Blood"],
    faqs: [
      {
        question: "How do I collect the sample?",
        answer: "We provide sterile containers. For urine, collect the mid-stream sample. For stool, a small quantity is sufficient."
      }
    ]
  },
  "thyroid-lipid-diabetes": {
    id: "thyroid-lipid-diabetes",
    title: "Thyroid, Lipid & Diabetes",
    description: "Specialized monitoring for chronic lifestyle conditions.",
    price: 899,
    originalPrice: 1500,
    discountedPrice: 899,
    reportTime: "24 Hours",
    sampleRequired: "Blood",
    homeService: "Available",
    preparation: "10-12 hours fasting is mandatory for Lipid Profile and Fasting Blood Sugar.",
    features: ["Comprehensive Metabolic Review", "Cardiac Risk Assessment", "Thyroid Function Monitoring", "Trend Analysis"],
    testDetails: ["TSH, T3, T4", "Total Cholesterol, HDL, LDL", "Fasting & PP Blood Sugar", "HbA1c"],
    faqs: [
      {
        question: "Can I drink water during fasting?",
        answer: "Yes, plain water is allowed. Avoid tea, coffee, or any other beverages."
      }
    ]
  },
  "home-collection": {
    id: "home-collection",
    title: "Home Sample Collection",
    description: "Convenient lab testing from the comfort of your home.",
    price: 0,
    originalPrice: 200,
    discountedPrice: 0,
    reportTime: "Varies by Test",
    sampleRequired: "Varies",
    homeService: "Yes",
    preparation: "As per the specific test requirements.",
    features: ["Certified Phlebotomists", "On-time Arrival", "Hygienic Procedures", "No Visiting Charges"],
    testDetails: ["Book any blood/urine test", "Select time slot", "Get reports online"],
    faqs: [
      {
        question: "Is there a visiting charge?",
        answer: "Home collection is currently free for orders above ₹500."
      }
    ]
  },
  "lab-visit": {
    id: "lab-visit",
    title: "Lab Visit Booking",
    description: "Book an appointment at our nearest diagnostic center to skip the queue.",
    price: 0,
    originalPrice: 0,
    discountedPrice: 0,
    reportTime: "Varies",
    sampleRequired: "N/A",
    homeService: "N/A",
    preparation: "Reach 10 minutes before your slot.",
    features: ["Zero Waiting Time", "Premium Lounge Access", "Consultation support", "Wheelchair Access"],
    testDetails: ["Priority Service", "Meet Specialists", "Instant Processing"],
    faqs: [
      {
        question: "Do I need an appointment?",
        answer: "Walking-ins are welcome, but booking ensures zero waiting time."
      }
    ]
  },
  "pet-ct": {
    id: "pet-ct",
    title: "PET-CT Scan",
    description: "Advanced whole-body imaging for oncology and cancer screening.",
    price: 11999,
    originalPrice: 15000,
    discountedPrice: 11999,
    reportTime: "24-48 Hours",
    sampleRequired: "None",
    homeService: "Not Available",
    preparation: "6 hours fasting. Avoid strenuous activity 24 hours prior. Low carb diet a day before.",
    features: ["Whole Body Scan", "FDG Contrast", "Cancer Staging", "Monitor Treatment Response"],
    testDetails: ["Whole Body PET-CT", "PSMA PET (Prostate)", "DOTA PET (Neuroendocrine)"],
    faqs: [
      {
        question: "How long does it take?",
        answer: "The entire process including preparation uptake time takes about 3-4 hours."
      }
    ]
  },
  "x-ray": {
    id: "x-ray",
    title: "Digital X-Ray",
    description: "Quick and high-quality digital radiography for bones and chest.",
    price: 400,
    originalPrice: 800,
    discountedPrice: 400,
    reportTime: "1 Hour",
    sampleRequired: "None",
    homeService: "Portable X-Ray Available (Selected Areas)",
    preparation: "Remove metal objects/jewelry around the area to be scanned.",
    features: ["Low Radiation", "Instant Digital Image", "High Clarity", "Bone Fracture Detection"],
    testDetails: ["Chest PA View", "Knee/Joint X-Ray", "Spine X-Ray", "PNS / Skull"],
    faqs: [
      {
        question: "Is X-Ray safe for pregnancy?",
        answer: "X-Rays are generally avoided during pregnancy unless absolutely necessary. Please inform the technician."
      }
    ]
  },
  "ultrasound": {
    id: "ultrasound",
    title: "Ultrasound (Sonography)",
    description: "Safe, non-invasive imaging using sound waves.",
    price: 1200,
    originalPrice: 1800,
    discountedPrice: 1200,
    reportTime: "Same Day",
    sampleRequired: "None",
    homeService: "Not Available",
    preparation: "Full bladder required for pelvic scans. Fasting required for upper abdomen scans.",
    features: ["Abdomen & Pelvis", "Pregnancy Scans (TIFFA/Growth)", "Doppler Studies", "High Frequency Probes"],
    testDetails: ["USG Whole Abdomen", "USG KUB", "Obstetric Scan", "Carotid Doppler"],
    faqs: [
      {
        question: "Is it painful?",
        answer: "No, ultrasound is completely painless and non-invasive."
      }
    ]
  },
  "mammography": {
    id: "mammography",
    title: "Digital Mammography",
    description: "Specialized imaging for breast health and cancer screening.",
    price: 1800,
    originalPrice: 2500,
    discountedPrice: 1800,
    reportTime: "24 Hours",
    sampleRequired: "None",
    homeService: "Not Available",
    preparation: "Do not use deodorant, powder, or lotions on the breast/underarm area on the day of the exam.",
    features: ["Early Cancer Detection", "Digital Mammography", "Female Technicians", "Privacy Assured"],
    testDetails: ["Bilateral Mammography", "Screening Mammography", "Diagnostic Mammography"],
    faqs: [
      {
        question: "How often should I get checked?",
        answer: "Women over 40 are recommended to have an annual mammogram."
      }
    ]
  },
  "ecg-echo": {
    id: "ecg-echo",
    title: "ECG & 2D Echo",
    description: "Cardiac investigations to monitor heart health.",
    price: 1500,
    originalPrice: 2000,
    discountedPrice: 1500,
    reportTime: "Same Day",
    sampleRequired: "None",
    homeService: "ECG Available at Home",
    preparation: "No specific preparation required. Wear loose clothing.",
    features: ["12 Lead ECG", "Color Doppler Echo", "Cardiologist Reviewed", "Heart Function Assessment"],
    testDetails: ["Resting ECG", "2D Echocardiogram", "Stress Test (TMT)"],
    faqs: [
      {
        question: "What does Echo show?",
        answer: "It shows the pumping action of the heart and check the valves."
      }
    ]
  }
};