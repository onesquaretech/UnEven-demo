import type { BasicTransportViewModel } from "./basicTransportManagement.types";

export const basicTransportManagementTenant: BasicTransportViewModel["tenant"] = {
  tenantId: "tenant_scholr_transport",
  display: {
    displayName: "Scholr Demonstration School",
    shortName: "Scholr",
    legalName: "Scholr Demonstration School Trust"
  },
  locale: "en-IN",
  timezone: "Asia/Kolkata",
  currency: "INR",
  themePreference: "light",
  enabledModules: [
    "dashboard",
    "admissions",
    "students",
    "attendance",
    "fees",
    "notices",
    "transport",
    "reports",
    "settings"
  ],
  branding: {
    primaryColor: "#0ea5a4",
    accentColor: "#14b8a6"
  },
  contact: {
    email: "transport@scholr.school",
    phone: "+91 99888 44221",
    address: "Riverfront Campus, Jaipur"
  },
  documents: {
    headerTitle: "Scholr Demonstration School",
    footerText: "Transport assignment changes remain draft until saved."
  }
};

const navigation: BasicTransportViewModel["navigation"] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "admissions", label: "Admissions" },
  { id: "students", label: "Students" },
  { id: "attendance", label: "Attendance" },
  { id: "allocation", label: "Class Allocation" },
  { id: "transport", label: "Transport", active: true },
  { id: "reports", label: "Reports" }
];

const pickupPointOptions = [
  { label: "Stop 1", value: "Stop 1" },
  { label: "Stop 2", value: "Stop 2" },
  { label: "Stop 3", value: "Stop 3" },
  { label: "Stop 4", value: "Stop 4" },
  { label: "Stop 5", value: "Stop 5" },
  { label: "Not assigned", value: "Not assigned" }
];

export const basicTransportManagementViewModelFixture: BasicTransportViewModel = {
  tenant: basicTransportManagementTenant,
  title: "Transport Management",
  description: "Manage routes, pickup points, vehicle allocation, and student transport fees",
  navigation,
  primaryActionLabel: "Add Assignment",
  filters: {
    searchValue: "",
    searchPlaceholder: "Search route, class, or student",
    routeValue: "route-3",
    classValue: "all",
    pickupPointValue: "all",
    feeValue: "included",
    routeOptions: [
      { label: "All Routes", value: "all" },
      { label: "Route 3 · Lake View", value: "route-3" },
      { label: "Route 1 · City Center", value: "route-1" },
      { label: "Route 2 · Sector 14", value: "route-2" },
      { label: "Route 4 · East Residency", value: "route-4" }
    ],
    classOptions: [
      { label: "All Classes", value: "all" },
      { label: "Class 2", value: "2" },
      { label: "Class 5", value: "5" },
      { label: "Class 7", value: "7" }
    ],
    pickupPointOptions: [
      { label: "All Pickup Points", value: "all" },
      { label: "Stop 1", value: "Stop 1" },
      { label: "Stop 2", value: "Stop 2" },
      { label: "Stop 4", value: "Stop 4" },
      { label: "Stop 5", value: "Stop 5" }
    ],
    feeOptions: [
      { label: "Transport Fee Included", value: "included" },
      { label: "Custom Fee Applied", value: "custom" },
      { label: "Fee Pending", value: "pending" }
    ],
    summaryLabel: "12 routes · 418 assigned students · 27 unassigned"
  },
  routeRail: {
    title: "Routes",
    description: "Select a route to manage stops and assignments",
    statusCardTitle: "Route capacity status",
    statusCardValue: "3 routes healthy",
    statusCardNote: "1 route near capacity and may need reassignment",
    routes: [
      {
        id: "route-3",
        label: "Route 3 · Lake View",
        vehicleLabel: "Vehicle MH12 AB 4021",
        occupiedValue: 34,
        capacityValue: 40,
        tone: "accent"
      },
      {
        id: "route-1",
        label: "Route 1 · City Center",
        vehicleLabel: "Vehicle MH12 AB 2180",
        occupiedValue: 29,
        capacityValue: 40,
        tone: "accent"
      },
      {
        id: "route-2",
        label: "Route 2 · Sector 14",
        vehicleLabel: "Vehicle MH12 AB 3156",
        occupiedValue: 26,
        capacityValue: 40,
        tone: "accent"
      },
      {
        id: "route-4",
        label: "Route 4 · East Residency",
        vehicleLabel: "Vehicle MH12 AB 5102",
        occupiedValue: 38,
        capacityValue: 40,
        tone: "warning"
      }
    ]
  },
  assignmentTable: {
    title: "Student Transport Assignment",
    description: "Assign pickup points and map transport fees for the selected route",
    feeMappingTitle: "Transport fee mapping",
    feeMappingValue: "Selected route fee: ₹700 / month",
    feeMappingNote: "Applied to assigned students unless custom fee is configured",
    feeMappingActionLabel: "Update Fee"
  },
  detailsPanel: {
    title: "Route Details",
    description: "Operational summary for selected vehicle and stops",
    vehicleCardTitle: "Vehicle Details",
    capacityTitle: "Route Capacity",
    stopsTitle: "Stops",
    feeTitle: "Fee Mapping",
    editActionLabel: "Edit",
    saveActionLabel: "Save"
  },
  routeDetails: [
    {
      id: "route-3",
      label: "Route 3 · Lake View",
      vehicleNumber: "MH12 AB 4021",
      driverName: "S. Patil",
      capacityValue: 40,
      assignedValue: 34,
      seatsLeftLabel: "6 left",
      feeLabel: "₹700 for Route 3",
      vehicleMeta: "Driver: S. Patil",
      capacityTone: "accent",
      stops: [
        { id: "stop-1", label: "Stop 1 · River Park", timeLabel: "7:00 AM", studentCountLabel: "6 students" },
        { id: "stop-2", label: "Stop 2 · City Mall", timeLabel: "7:05 AM", studentCountLabel: "8 students" },
        { id: "stop-3", label: "Stop 3 · Central Park", timeLabel: "7:10 AM", studentCountLabel: "5 students" },
        { id: "stop-5", label: "Stop 5 · Lake View", timeLabel: "7:15 AM", studentCountLabel: "9 students", active: true }
      ],
      assignments: [
        {
          id: "riya-sharma",
          studentName: "Riya Sharma",
          studentCode: "ST-26-0142",
          classLabel: "5-A",
          initials: "RS",
          accent: "blue",
          pickupPoint: "Stop 5",
          pickupPointOptions,
          feeLabel: "₹700",
          feeMode: "included",
          action: "save"
        },
        {
          id: "fatima-khan",
          studentName: "Fatima Khan",
          studentCode: "ST-26-0121",
          classLabel: "2-C",
          initials: "FK",
          accent: "violet",
          pickupPoint: "Stop 2",
          pickupPointOptions,
          feeLabel: "₹700",
          feeMode: "included",
          action: "edit"
        },
        {
          id: "siya-nair",
          studentName: "Siya Nair",
          studentCode: "ST-26-0158",
          classLabel: "7-A",
          initials: "SN",
          accent: "amber",
          pickupPoint: "Stop 4",
          pickupPointOptions,
          feeLabel: "₹700",
          feeMode: "custom",
          action: "edit"
        },
        {
          id: "aarav-mehta",
          studentName: "Aarav Mehta",
          studentCode: "ST-26-0137",
          classLabel: "7-B",
          initials: "AM",
          accent: "rose",
          pickupPoint: "Not assigned",
          pickupPointOptions,
          feeLabel: "—",
          feeMode: "pending",
          action: "pending"
        },
        {
          id: "diya-patel",
          studentName: "Diya Patel",
          studentCode: "ST-26-0171",
          classLabel: "5-C",
          initials: "DP",
          accent: "sky",
          pickupPoint: "Stop 1",
          pickupPointOptions,
          feeLabel: "₹700",
          feeMode: "included",
          action: "edit"
        }
      ]
    },
    {
      id: "route-1",
      label: "Route 1 · City Center",
      vehicleNumber: "MH12 AB 2180",
      driverName: "A. Kulkarni",
      capacityValue: 40,
      assignedValue: 29,
      seatsLeftLabel: "11 left",
      feeLabel: "₹650 for Route 1",
      vehicleMeta: "Driver: A. Kulkarni",
      capacityTone: "accent",
      stops: [
        { id: "route1-stop1", label: "Stop 1 · Civil Lines", timeLabel: "6:50 AM", studentCountLabel: "7 students" },
        { id: "route1-stop2", label: "Stop 2 · Metro Square", timeLabel: "7:00 AM", studentCountLabel: "6 students", active: true },
        { id: "route1-stop3", label: "Stop 3 · City Center", timeLabel: "7:10 AM", studentCountLabel: "9 students" }
      ],
      assignments: [
        {
          id: "isha-reddy",
          studentName: "Isha Reddy",
          studentCode: "ST-26-0108",
          classLabel: "4-B",
          initials: "IR",
          accent: "emerald",
          pickupPoint: "Stop 2",
          pickupPointOptions,
          feeLabel: "₹650",
          feeMode: "included",
          action: "edit"
        },
        {
          id: "neel-shah",
          studentName: "Neel Shah",
          studentCode: "ST-26-0116",
          classLabel: "6-A",
          initials: "NS",
          accent: "blue",
          pickupPoint: "Stop 3",
          pickupPointOptions,
          feeLabel: "₹650",
          feeMode: "included",
          action: "edit"
        }
      ]
    },
    {
      id: "route-2",
      label: "Route 2 · Sector 14",
      vehicleNumber: "MH12 AB 3156",
      driverName: "R. Gill",
      capacityValue: 40,
      assignedValue: 26,
      seatsLeftLabel: "14 left",
      feeLabel: "₹680 for Route 2",
      vehicleMeta: "Driver: R. Gill",
      capacityTone: "accent",
      stops: [
        { id: "route2-stop1", label: "Stop 1 · Sector 14 Gate", timeLabel: "6:55 AM", studentCountLabel: "8 students", active: true },
        { id: "route2-stop2", label: "Stop 2 · Market Road", timeLabel: "7:04 AM", studentCountLabel: "6 students" },
        { id: "route2-stop3", label: "Stop 3 · Sunrise Block", timeLabel: "7:15 AM", studentCountLabel: "5 students" }
      ],
      assignments: [
        {
          id: "krish-roy",
          studentName: "Krish Roy",
          studentCode: "ST-26-0104",
          classLabel: "3-C",
          initials: "KR",
          accent: "violet",
          pickupPoint: "Stop 1",
          pickupPointOptions,
          feeLabel: "₹680",
          feeMode: "included",
          action: "edit"
        }
      ]
    },
    {
      id: "route-4",
      label: "Route 4 · East Residency",
      vehicleNumber: "MH12 AB 5102",
      driverName: "P. Gokhale",
      capacityValue: 40,
      assignedValue: 38,
      seatsLeftLabel: "2 left",
      feeLabel: "₹720 for Route 4",
      vehicleMeta: "Driver: P. Gokhale",
      capacityTone: "warning",
      stops: [
        { id: "route4-stop1", label: "Stop 1 · East Residency", timeLabel: "7:00 AM", studentCountLabel: "11 students", active: true },
        { id: "route4-stop2", label: "Stop 2 · Lake Corner", timeLabel: "7:09 AM", studentCountLabel: "10 students" },
        { id: "route4-stop3", label: "Stop 3 · Temple Road", timeLabel: "7:18 AM", studentCountLabel: "9 students" }
      ],
      assignments: [
        {
          id: "tanvi-arora",
          studentName: "Tanvi Arora",
          studentCode: "ST-26-0088",
          classLabel: "8-A",
          initials: "TA",
          accent: "rose",
          pickupPoint: "Stop 1",
          pickupPointOptions,
          feeLabel: "₹720",
          feeMode: "included",
          action: "edit"
        }
      ]
    }
  ],
  conflictNote: {
    label: "Assignment conflict",
    tone: "warning",
    message: "Students without a pickup point will stay pending until a stop is assigned."
  }
};
