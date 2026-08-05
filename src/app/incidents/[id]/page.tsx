"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type StageStatus = "completed" | "current" | "pending";

type WorkflowStage = {
  title: string;
  status: StageStatus;
};

type TimelineEvent = {
  title: string;
  detail: string;
  time: string;
};

type OrganizationStatus = "Recommended" | "Awaiting Acceptance" | "Active" | "Rejected";

type OperatorAssignmentDecision = "Approve" | "Modify" | "Reject";

type IncidentOrganization = {
  id: string;
  name: string;
  type: string;
  specialties: string[];
  coverage: string;
  distanceKm: number;
  availability: string;
  operationalCapacity: string;
  responseCapacity: string;
  estimatedMobilization: string;
  compatibilityScore: number;
  primaryContact: string;
  contactRole: string;
  phone: string;
  email: string;
  relatedAssignment: string;
  relatedAssignmentDetail?: string;
  recommendationExplanation: string;
  status: OrganizationStatus;
  operatorDecision?: OperatorAssignmentDecision;
  operatorNotes?: string;
  rejectionReason?: string;
  requestedOperationalRole?: string;
  requestedAssignmentScope?: string;
  requestedStartDate?: string;
  requestedStartTime?: string;
  expectedDuration?: string;
  coordinationLead?: string;
  priority?: string;
  instructions?: string;
  assignmentRequestedBy?: string;
  assignmentRequestedAt?: string;
  acceptedBy?: string;
  acceptedAt?: string;
  organizationResponseReason?: string;
};

type LogisticsStage =
  | "Dispatch Ordered"
  | "Ready for Loading"
  | "Loaded"
  | "In Transit"
  | "Arrived"
  | "Delivered"
  | "Verified";

type LogisticsRiskStatus = "Normal" | "Moderate" | "At Risk";

type LogisticsOperationDecision = "Approve" | "Modify" | "Reject";

type LogisticsOperation = {
  id: string;
  incidentId: string;
  originSignal: string;
  resourceId?: string;
  resourceName: string;
  resourceCategory: string;
  approvedQuantity: number;
  relatedNeed: string;
  sourceOrganization: string;
  sourceLocation: string;
  destination: string;
  suitabilityScore: number | string;
  vehicleType: string;
  vehicleId: string;
  driver: string;
  contactNumber: string;
  transportOrganization: string;
  departureDate: string;
  departureTime: string;
  expectedArrivalDate: string;
  expectedArrivalTime: string;
  route: string;
  gpsTracking: "Enabled" | "Disabled";
  specialInstructions: string;
  packingListReference: string;
  supportingDocumentsReference?: string;
  loadingLocation?: string;
  receivingOrganization?: string;
  receivingOfficer?: string;
  receivingContact?: string;
  decision: string;
  operatorNotes: string;
  confirmedBy: string;
  confirmedAt: string;
  currentStage: LogisticsStage;
  currentLogisticsStatus: string;
  approvalStatus: "Pending Review" | "Approved" | "Rejected";
  aiRecommendedRoute: string;
  aiAlternativeRoute: string;
  aiRouteDistance: string;
  aiEstimatedTravelTime: string;
  aiRouteRisk: string;
  aiWeatherImpact: string;
  aiRoadAccessibility: string;
  aiFuelReadiness: string;
  aiVehicleCapacity: string;
  aiSecurityCoordination: string;
  aiConfidence: number;
  finalRoute: string;
  securityCoordination: "Confirmed" | "Pending";
  fuelStatus: "Confirmed" | "Pending";
  riskStatus: LogisticsRiskStatus;
  currentEta: string;
  distanceRemaining: string;
  lastGpsUpdate: string;
  currentSpeed: string;
  routeStatus: string;
  lastUpdate: string;
  departureActualAt?: string;
  arrivalAt?: string;
  deliveredAt?: string;
  verifiedAt?: string;
  deliveredQuantity?: number;
  proofOfDeliveryReference?: string;
  conditionOfShipment?: string;
  discrepancyNotes?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  delayReason?: string;
  estimatedDelayDuration?: string;
  operationalImpact?: string;
  correctiveAction?: string;
  dispatchWorkflow?: Record<string, StageStatus>;
};

export default function IncidentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId ?? "INC-UNKNOWN";
  const operatorName = "Ricardo Lara";
  const signal = searchParams.get("signal") ?? `SIG-${id.replace(/^INC-/, "")}`;
  const title = searchParams.get("title") ?? "HumanOS Incident Workspace";
  const severity = searchParams.get("severity") ?? "High";
  const location = searchParams.get("location") ?? "Unknown Location";
  const description =
    searchParams.get("description") ?? "No description available for this incident.";
  const status = "OPEN";
  const assignedTo = "Unassigned";
  const createdBy = "HumanOS";

  const formatDateTime = (value?: string) => {
    if (!value) {
      return "—";
    }

    return new Date(value).toLocaleString();
  };

  const initialWorkflowStages: WorkflowStage[] = [
    { title: "Signal Received", status: "completed" },
    { title: "Signal Verified", status: "completed" },
    { title: "Incident Created", status: "completed" },
    { title: "Initial Assessment", status: "current" },
    { title: "Needs Assessment", status: "pending" },
    { title: "Resource Allocation", status: "pending" },
    { title: "Organizations Assigned", status: "pending" },
    { title: "Logistics Activated", status: "pending" },
    { title: "Field Deployment", status: "pending" },
    { title: "Monitoring", status: "pending" },
    { title: "Closure", status: "pending" },
  ];

  const [workflowStages, setWorkflowStages] = useState<WorkflowStage[]>(
    initialWorkflowStages,
  );

  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([
    {
      title: "Signal received",
      detail: `Origin signal ${signal} was received and ingested into the workspace.`,
      time: "Just now",
    },
    {
      title: "Signal verified",
      detail: "Verification completed and the signal was approved for incident creation.",
      time: "Just now",
    },
    {
      title: "Incident created",
      detail: `Incident ${id} was created and assigned to the HumanOS operations team.`,
      time: "Just now",
    },
  ]);

  const completedCount = workflowStages.filter((stage) => stage.status === "completed").length;
  const totalStages = workflowStages.length;
  const progressPercentage = Math.round((completedCount / totalStages) * 100);
  const workflowCompleted = completedCount === totalStages;

  const completeCurrentStage = () => {
    const currentIndex = workflowStages.findIndex((stage) => stage.status === "current");
    if (currentIndex === -1) {
      return;
    }

    const currentStage = workflowStages[currentIndex];
    const nextPendingIndex = workflowStages.findIndex(
      (stage, index) => index > currentIndex && stage.status === "pending",
    );

    setWorkflowStages((existingStages) =>
      existingStages.map((stage, index) => {
        if (index === currentIndex) {
          return { ...stage, status: "completed" };
        }

        if (index === nextPendingIndex) {
          return { ...stage, status: "current" };
        }

        return stage;
      }),
    );

    setTimelineEvents((events) => [
      {
        title: `${currentStage.title} completed`,
        detail: `${currentStage.title} stage has been completed in the operational workflow.`,
        time: "Just now",
      },
      ...events,
    ]);
  };

  const headerLabelStyle = {
    color: "#94a3b8",
    fontSize: "10px",
    letterSpacing: "1.8px",
    textTransform: "uppercase" as const,
  };

  const cardStyle = {
    padding: "20px",
    borderRadius: "14px",
    border: "1px solid #203b50",
    background: "#0d2639",
    minHeight: "110px",
  };

  const recommendations: Record<
    string,
    { title: string; priority: string; description: string; action: string }[]
  > = {
    "Initial Assessment": [
      {
        title: "Assign Incident Commander",
        priority: "Immediate",
        description: "Designate the response commander to lead the assessment.",
        action: "Assign Incident Commander",
      },
      {
        title: "Begin Field Assessment",
        priority: "Immediate",
        description: "Start the first on-site evaluation of conditions and needs.",
        action: "Begin Field Assessment",
      },
      {
        title: "Notify Authorities",
        priority: "High",
        description: "Inform local authorities about the incident and response plan.",
        action: "Notify Authorities",
      },
      {
        title: "Estimate Population Impact",
        priority: "High",
        description: "Determine the size of the affected population for planning.",
        action: "Estimate Population Impact",
      },
    ],
    "Needs Assessment": [
      {
        title: "Register Food Needs",
        priority: "Immediate",
        description: "Log current food requirements for affected communities.",
        action: "Register Food Needs",
      },
      {
        title: "Register Water Needs",
        priority: "Immediate",
        description: "Capture water requirements for the incident zone.",
        action: "Register Water Needs",
      },
      {
        title: "Register Medical Needs",
        priority: "High",
        description: "Document medical and health needs for responders.",
        action: "Register Medical Needs",
      },
      {
        title: "Register Shelter Needs",
        priority: "High",
        description: "Record shelter gaps and accommodation requirements.",
        action: "Register Shelter Needs",
      },
    ],
    "Resource Allocation": [
      {
        title: "Allocate Medical Kits",
        priority: "Immediate",
        description: "Assign medical supplies to the most urgent locations.",
        action: "Allocate Medical Kits",
      },
      {
        title: "Allocate Vehicles",
        priority: "Immediate",
        description: "Deploy transport assets to support response teams.",
        action: "Allocate Vehicles",
      },
      {
        title: "Allocate Volunteers",
        priority: "High",
        description: "Mobilize volunteers where operational support is needed.",
        action: "Allocate Volunteers",
      },
      {
        title: "Allocate Warehouses",
        priority: "High",
        description: "Assign storage facilities for the incoming resources.",
        action: "Allocate Warehouses",
      },
    ],
    "Organizations Assigned": [
      {
        title: "Assign Red Cross",
        priority: "Immediate",
        description: "Engage Red Cross resources for emergency support.",
        action: "Assign Red Cross",
      },
      {
        title: "Assign Government",
        priority: "Immediate",
        description: "Coordinate with government partners for response.",
        action: "Assign Government",
      },
      {
        title: "Assign NGOs",
        priority: "High",
        description: "Bring key NGOs into the response network.",
        action: "Assign NGOs",
      },
      {
        title: "Notify UN Partners",
        priority: "High",
        description: "Alert UN agencies to provide additional support.",
        action: "Notify UN Partners",
      },
    ],
    "Logistics Activated": [
      {
        title: "Create Transport Orders",
        priority: "Immediate",
        description: "Generate orders for moving supplies and teams.",
        action: "Create Transport Orders",
      },
      {
        title: "Assign Distribution Routes",
        priority: "Immediate",
        description: "Plan the best routes for delivery and response.",
        action: "Assign Distribution Routes",
      },
      {
        title: "Reserve Fuel",
        priority: "High",
        description: "Secure fuel supplies to sustain the logistics chain.",
        action: "Reserve Fuel",
      },
      {
        title: "Dispatch Equipment",
        priority: "High",
        description: "Send essential equipment to the front-line operations.",
        action: "Dispatch Equipment",
      },
    ],
    "Field Deployment": [
      {
        title: "Deploy Medical Teams",
        priority: "Immediate",
        description: "Send medical response teams into affected areas.",
        action: "Deploy Medical Teams",
      },
      {
        title: "Deploy Food Distribution",
        priority: "Immediate",
        description: "Activate food distribution channels in the field.",
        action: "Deploy Food Distribution",
      },
      {
        title: "Activate Mobile Clinics",
        priority: "High",
        description: "Set up mobile clinics to serve impacted populations.",
        action: "Activate Mobile Clinics",
      },
      {
        title: "Begin Field Monitoring",
        priority: "High",
        description: "Start monitoring response progress on the ground.",
        action: "Begin Field Monitoring",
      },
    ],
    Monitoring: [
      {
        title: "Monitor KPIs",
        priority: "Immediate",
        description: "Track key performance indicators for the incident.",
        action: "Monitor KPIs",
      },
      {
        title: "Monitor New Signals",
        priority: "Immediate",
        description: "Keep watch for new signals and changes in the response.",
        action: "Monitor New Signals",
      },
      {
        title: "Generate Situation Report",
        priority: "High",
        description: "Compile the latest status for stakeholders.",
        action: "Generate Situation Report",
      },
      {
        title: "Update Operational Dashboard",
        priority: "High",
        description: "Refresh dashboard data for a current operational view.",
        action: "Update Operational Dashboard",
      },
    ],
    Closure: [
      {
        title: "Generate Final Report",
        priority: "Immediate",
        description: "Document the response outcomes and lessons learned.",
        action: "Generate Final Report",
      },
      {
        title: "Archive Incident",
        priority: "High",
        description: "Store the incident record for future reference.",
        action: "Archive Incident",
      },
      {
        title: "Notify Stakeholders",
        priority: "High",
        description: "Inform all partners about operational closure.",
        action: "Notify Stakeholders",
      },
      {
        title: "Close Operational Workspace",
        priority: "High",
        description: "Complete final closure tasks in the workspace.",
        action: "Close Operational Workspace",
      },
    ],
  };

  const currentStageTitle = workflowStages.find((stage) => stage.status === "current")?.title ?? "Initial Assessment";
  const currentRecommendations = recommendations[currentStageTitle] ?? recommendations["Initial Assessment"];

  const tabItems = [
    "Overview",
    "Needs",
    "Resources",
    "Organizations",
    "Logistics",
    "Tasks",
    "Documents",
    "Timeline",
  ] as const;

  const [activeTab, setActiveTab] = useState<(typeof tabItems)[number]>("Overview");

  const initialNeeds = [
    {
      id: "NEED-001",
      category: "Water",
      description: "Drinking water for affected coastal communities",
      quantity: "12000",
      unit: "Liters",
      priority: "Critical",
      status: "Pending",
      assigned: "Unassigned",
    },
    {
      id: "NEED-002",
      category: "Food",
      description: "Emergency food kits for displaced families",
      quantity: "2500",
      unit: "Kits",
      priority: "High",
      status: "Assigned",
      assigned: "Regional Relief Network",
    },
    {
      id: "NEED-003",
      category: "Medical",
      description: "Emergency medical supply kits",
      quantity: "800",
      unit: "Kits",
      priority: "Critical",
      status: "Pending",
      assigned: "Unassigned",
    },
    {
      id: "NEED-004",
      category: "Shelter",
      description: "Temporary shelter capacity",
      quantity: "450",
      unit: "Spaces",
      priority: "High",
      status: "Pending",
      assigned: "Unassigned",
    },
  ];

  const [needs, setNeeds] = useState(initialNeeds);

  // Mock resource intelligence data
  const initialResources = [
    {
      id: "RES-001",
      name: "Water Containers",
      category: "Water",
      organization: "Regional Relief Network",
      sourceType: "NGO",
      region: "Coastal Zone",
      availability: "Available",
      quantity: 5000,
      reservedQty: 0,
      inTransitQty: 0,
      deliveredQty: 0,
      quantityAvailable: 5000,
      distanceKm: 45,
      etaHours: 4,
      suitability: 92,
      status: "Available",
    },
    {
      id: "RES-002",
      name: "Emergency Food Kits",
      category: "Food",
      organization: "FoodAid Intl",
      sourceType: "Humanitarian Partner",
      region: "Central",
      availability: "Reserved",
      quantity: 1200,
      reservedQty: 1200,
      inTransitQty: 0,
      deliveredQty: 0,
      quantityAvailable: 0,
      distanceKm: 120,
      etaHours: 12,
      suitability: 78,
      status: "Reserved",
    },
    {
      id: "RES-003",
      name: "Medical Supply Kits",
      category: "Medical",
      organization: "Health Partners",
      sourceType: "UN Agency",
      region: "North",
      availability: "In Transit",
      quantity: 400,
      reservedQty: 0,
      inTransitQty: 400,
      deliveredQty: 0,
      quantityAvailable: 0,
      distanceKm: 220,
      etaHours: 36,
      suitability: 85,
      status: "In Transit",
    },
    {
      id: "RES-004",
      name: "Temporary Shelters",
      category: "Shelter",
      organization: "ShelterOrg",
      sourceType: "Government",
      region: "Coastal Zone",
      availability: "Unavailable",
      quantity: 0,
      reservedQty: 0,
      inTransitQty: 0,
      deliveredQty: 0,
      quantityAvailable: 0,
      distanceKm: 80,
      etaHours: 18,
      suitability: 60,
      status: "Unavailable",
    },
  ];

  const getResourceTotalQty = (resource: any) => Number(resource.quantity ?? 0);
  const getResourceReservedQty = (resource: any) => Number(resource.reservedQty ?? 0);
  const getResourceInTransitQty = (resource: any) => Number(resource.inTransitQty ?? 0);
  const getResourceDeliveredQty = (resource: any) => Number(resource.deliveredQty ?? 0);
  const getResourceAvailableQty = (resource: any) => {
    const total = getResourceTotalQty(resource);
    const reserved = getResourceReservedQty(resource);
    const inTransit = getResourceInTransitQty(resource);
    const delivered = getResourceDeliveredQty(resource);
    return Math.max(0, total - reserved - inTransit - delivered);
  };

  const [resources, setResources] = useState(initialResources);
  const [resourceFilters, setResourceFilters] = useState({ category: "", organization: "", region: "", availability: "" });
  const [resourceSearch, setResourceSearch] = useState("");
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [resourceAlert, setResourceAlert] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedResource) return;
    const latest = resources.find((r) => r.id === selectedResource.id);
    if (latest && latest !== selectedResource) {
      setSelectedResource(latest);
    }
  }, [resources, selectedResource]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewResource, setReviewResource] = useState<any>(null);
  const [reviewProposedQty, setReviewProposedQty] = useState<number | "">("");
  const [reviewDecision, setReviewDecision] = useState<"Approve" | "Modify" | "Reject">("Approve");
  const [reviewNotes, setReviewNotes] = useState<string>("");
  const [reviewSelectedNeed, setReviewSelectedNeed] = useState<string | null>(needs.length ? needs[0].id : null);

  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [dispatchSelectedResource, setDispatchSelectedResource] = useState<any>(null);
  const [dispatchIdCounter, setDispatchIdCounter] = useState(1);
  const [dispatchVehicleType, setDispatchVehicleType] = useState("");
  const [dispatchVehicleId, setDispatchVehicleId] = useState("");
  const [dispatchDriver, setDispatchDriver] = useState("");
  const [dispatchDepartureDate, setDispatchDepartureDate] = useState("");
  const [dispatchDepartureTime, setDispatchDepartureTime] = useState("");
  const [dispatchArrivalDate, setDispatchArrivalDate] = useState("");
  const [dispatchArrivalTime, setDispatchArrivalTime] = useState("");
  const [dispatchRoute, setDispatchRoute] = useState("");
  const [dispatchTransportOrg, setDispatchTransportOrg] = useState("");
  const [dispatchContactNumber, setDispatchContactNumber] = useState("");
  const [dispatchGpsTracking, setDispatchGpsTracking] = useState<"Enabled" | "Disabled">("Enabled");
  const [dispatchSpecialInstructions, setDispatchSpecialInstructions] = useState("");
  const [dispatchPackingListRef, setDispatchPackingListRef] = useState("");
  const [dispatchDecision, setDispatchDecision] = useState<"Approve" | "Modify" | "Reject">("Approve");
  const [dispatchOperatorNotes, setDispatchOperatorNotes] = useState("");
  const [dispatchRejectionReason, setDispatchRejectionReason] = useState("");
  const [dispatchOrders, setDispatchOrders] = useState<LogisticsOperation[]>([]);

  const resetDispatchModal = () => {
    setDispatchVehicleType("");
    setDispatchVehicleId("");
    setDispatchDriver("");
    setDispatchDepartureDate("");
    setDispatchDepartureTime("");
    setDispatchArrivalDate("");
    setDispatchArrivalTime("");
    setDispatchRoute("");
    setDispatchTransportOrg("");
    setDispatchContactNumber("");
    setDispatchGpsTracking("Enabled");
    setDispatchSpecialInstructions("");
    setDispatchPackingListRef("");
    setDispatchDecision("Approve");
    setDispatchOperatorNotes("");
    setDispatchRejectionReason("");
  };

  const openDispatchModal = (resource: any) => {
    setDispatchSelectedResource(resource);
    resetDispatchModal();
    setDispatchModalOpen(true);
  };

  const closeDispatchModal = () => {
    setDispatchModalOpen(false);
    setDispatchSelectedResource(null);
    resetDispatchModal();
  };

  const nextDispatchId = `DSP-${String(dispatchIdCounter).padStart(3, "0")}`;

  const isDispatchApprovalDisabled = () => {
    const requiredFieldsComplete = Boolean(
      dispatchVehicleType &&
      dispatchVehicleId &&
      dispatchDriver &&
      dispatchDepartureDate &&
      dispatchDepartureTime &&
      dispatchArrivalDate &&
      dispatchArrivalTime &&
      dispatchRoute &&
      dispatchTransportOrg &&
      dispatchContactNumber,
    );

    if (dispatchDecision === "Reject") {
      return dispatchRejectionReason.trim().length === 0;
    }

    if (dispatchDecision === "Modify") {
      return !requiredFieldsComplete || dispatchOperatorNotes.trim().length === 0;
    }

    return !requiredFieldsComplete;
  };

  const confirmCreateDispatchOrder = () => {
    if (!dispatchSelectedResource) {
      return;
    }

    const confirmedAt = new Date().toISOString();
    const confirmedBy = "Ricardo Lara";
    const dispatchId = nextDispatchId;

    if (dispatchDecision === "Reject") {
      setResources((prev) =>
        prev.map((r) => {
          if (r.id === dispatchSelectedResource.id || r.name === dispatchSelectedResource.name) {
            return {
              ...r,
              dispatchDecision: "Rejected",
              dispatchRejectionReason,
              dispatchConfirmedBy: confirmedBy,
              dispatchConfirmedAt: confirmedAt,
            };
          }
          return r;
        }),
      );

      setTimelineEvents((events) => {
        const detail = `Dispatch plan for ${dispatchSelectedResource.name} was rejected by the operator.`;
        const exists = events.some((event) => event.title === "Dispatch plan rejected" && event.detail === detail);
        if (exists) return events;
        return [
          { title: "Dispatch plan rejected", detail, time: "Just now" },
          ...events,
        ];
      });

      closeDispatchModal();
      return;
    }

    const approvedQuantity =
      dispatchSelectedResource.finalApprovedQuantity ?? dispatchSelectedResource.proposedQuantity ?? dispatchSelectedResource.quantity ?? 0;
    const relatedNeed = dispatchSelectedResource.assignedNeed ?? dispatchSelectedResource.relatedNeed ?? needs[0]?.id ?? "N/A";
    const sourceOrganization = dispatchSelectedResource.organization ?? "Unknown";
    const sourceLocation = dispatchSelectedResource.region ?? dispatchSelectedResource.location ?? "Unknown";
    const destinationLocation = location;
    const suitabilityScore = dispatchSelectedResource.suitability ?? dispatchSelectedResource.aiSuitability ?? "N/A";
    const aiRecommendedRoute = "Miami Warehouse → Coastal Operations Base → Coastal Zone";
    const aiAlternativeRoute = "Miami Warehouse → Southern Corridor → Coastal Zone";
    const plannedEta = `${dispatchArrivalDate} ${dispatchArrivalTime}`.trim();

    const order: LogisticsOperation = {
      id: dispatchId,
      incidentId: id,
      originSignal: signal,
      resourceId: dispatchSelectedResource.id,
      resourceName: dispatchSelectedResource.name,
      resourceCategory: dispatchSelectedResource.category ?? "Unknown",
      approvedQuantity: Number(approvedQuantity || 0),
      relatedNeed,
      sourceOrganization,
      sourceLocation,
      destination: destinationLocation,
      suitabilityScore,
      vehicleType: dispatchVehicleType,
      vehicleId: dispatchVehicleId,
      driver: dispatchDriver,
      departureDate: dispatchDepartureDate,
      departureTime: dispatchDepartureTime,
      expectedArrivalDate: dispatchArrivalDate,
      expectedArrivalTime: dispatchArrivalTime,
      route: dispatchRoute,
      transportOrganization: dispatchTransportOrg,
      contactNumber: dispatchContactNumber,
      gpsTracking: dispatchGpsTracking,
      specialInstructions: dispatchSpecialInstructions,
      packingListReference: dispatchPackingListRef,
      decision: dispatchDecision,
      operatorNotes: dispatchOperatorNotes,
      confirmedBy,
      confirmedAt,
      currentStage: "Dispatch Ordered",
      currentLogisticsStatus: "Awaiting Approval",
      approvalStatus: "Pending Review",
      aiRecommendedRoute,
      aiAlternativeRoute,
      aiRouteDistance: "45 km",
      aiEstimatedTravelTime: "4 hours",
      aiRouteRisk: "Moderate",
      aiWeatherImpact: "Moderate",
      aiRoadAccessibility: "Available with restrictions",
      aiFuelReadiness: "Confirmed",
      aiVehicleCapacity: "Adequate",
      aiSecurityCoordination: "Required",
      aiConfidence: 89,
      finalRoute: dispatchRoute,
      securityCoordination: "Pending",
      fuelStatus: "Confirmed",
      riskStatus: "Moderate",
      currentEta: plannedEta,
      distanceRemaining: "45 km",
      lastGpsUpdate: "Not started",
      currentSpeed: "0 km/h",
      routeStatus: "Awaiting operator approval",
      lastUpdate: confirmedAt,
      dispatchWorkflow: {
        Reserved: "completed",
        "Dispatch Ordered": "current",
        "Ready for Loading": "pending",
        Loaded: "pending",
        "In Transit": "pending",
        Arrived: "pending",
        Delivered: "pending",
        Verified: "pending",
      },
    };

    setDispatchOrders((prev) => [order, ...prev]);
    setResources((prev) =>
      prev.map((r) => {
        if (r.id === dispatchSelectedResource.id || r.name === dispatchSelectedResource.name) {
          return {
            ...r,
            availability: "Dispatch Ordered",
            status: "Dispatch Ordered",
            dispatchOrderId: dispatchId,
            dispatchOrder: order,
            dispatchWorkflow: order.dispatchWorkflow,
            dispatchConfirmedBy: confirmedBy,
            dispatchConfirmedAt: confirmedAt,
            dispatchVehicleType,
            dispatchVehicleId,
            dispatchDriver,
            dispatchDepartureDate,
            dispatchDepartureTime,
            dispatchArrivalDate,
            dispatchArrivalTime,
            dispatchRoute,
            dispatchTransportOrganization: dispatchTransportOrg,
            dispatchContactNumber,
            dispatchGpsTracking,
            dispatchSpecialInstructions,
            dispatchPackingListReference: dispatchPackingListRef,
            dispatchCurrentStage: order.currentStage,
            dispatchCurrentStatus: order.currentLogisticsStatus,
            dispatchDecision: dispatchDecision === "Modify" ? "Modified" : "Approved",
            dispatchOperatorNotes,
          };
        }
        return r;
      }),
    );

    setDispatchIdCounter((count) => count + 1);

    setTimelineEvents((events) => {
      const detail = `Dispatch order ${dispatchId} was created for ${approvedQuantity} of ${dispatchSelectedResource.name}.`;
      const exists = events.some((event) => event.title === "Dispatch order created" && event.detail === detail);
      if (exists) return events;
      return [
        { title: "Dispatch order created", detail, time: "Just now" },
        ...events,
      ];
    });

    closeDispatchModal();
  };

  const openReviewModal = (res: any) => {
    setReviewResource(res);
    // default proposed qty: try parsing available number if present
    const availableMatch = (res.available || res.quantity || "").toString().replace(/[^0-9]/g, "");
    setReviewProposedQty(availableMatch ? parseInt(availableMatch, 10) : "");
    setReviewDecision("Approve");
    setReviewNotes("");
    setReviewSelectedNeed(needs.length ? needs[0].id : null);
    setReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setReviewModalOpen(false);
    setReviewResource(null);
    setReviewProposedQty("");
    setReviewDecision("Approve");
    setReviewNotes("");
  };

  const confirmApproveAllocation = () => {
    const confirmedAt = new Date().toISOString();
    const confirmedBy = "Ricardo Lara";

    if (reviewDecision === "Reject") {
      // Add timeline event for rejection
      setTimelineEvents((ev) => [
        { title: "Resource recommendation rejected", detail: `${reviewResource.name} recommendation rejected by operator.`, time: "Just now" },
        ...ev,
      ]);

      // store rejection metadata on resource object and mark rejected
      setResources((prev) => prev.map((r) => {
        if (r.name === reviewResource.name || r.id === reviewResource.id) {
          return { ...r, operatorDecision: "Rejected", operatorNotes: reviewNotes, confirmedBy, confirmedAt, availability: "Rejected", status: "Rejected" } as any;
        }
        return r;
      }));

      // show rejection alert briefly
      setResourceAlert("Resource recommendation rejected.");
      window.setTimeout(() => setResourceAlert(null), 5000);

      closeReviewModal();
      return;
    }

    const proposedQtyNum = typeof reviewProposedQty === "number" ? reviewProposedQty : parseInt(String(reviewProposedQty || "0"), 10) || 0;

    // Find matching resource by name or id; if found, update; else create new reserved resource
    let updated = false;
    setResources((prev) => {
      const next = prev.map((r) => {
        if (r.name === reviewResource.name || r.id === reviewResource.id) {
          const currentReserved = getResourceReservedQty(r);
          const currentInTransit = getResourceInTransitQty(r);
          const currentDelivered = getResourceDeliveredQty(r);
          const total = getResourceTotalQty(r);
          const newReserved = currentReserved + proposedQtyNum;
          const newAvailable = Math.max(0, total - newReserved - currentInTransit - currentDelivered);
          updated = true;
          return {
            ...r,
            reservedQty: newReserved,
            quantityAvailable: newAvailable,
            availability: "Reserved",
            status: "Reserved",
            aiRecommendedResource: reviewResource.name,
            aiSuitability: reviewResource.suitability ?? reviewResource.suitability,
            proposedQuantity: proposedQtyNum,
            finalApprovedQuantity: proposedQtyNum,
            assignedNeed: reviewSelectedNeed,
            operatorDecision: reviewDecision === "Modify" ? "Modified" : "Approved",
            operatorNotes: reviewNotes,
            confirmedBy,
            confirmedAt,
          } as any;
        }
        return r;
      });

      if (!updated) {
        // create a new resource entry with Reserved status
        const newId = `RES-${Date.now()}`;
        next.unshift({
          id: newId,
          name: reviewResource.name,
          category: reviewResource.category || reviewResource.type || "Unknown",
          organization: reviewResource.organization || "Unknown",
          region: reviewResource.region || reviewResource.location || "Unknown",
          availability: "Reserved",
          quantity: reviewResource.quantity || proposedQtyNum,
          reservedQty: proposedQtyNum,
          quantityAvailable: Math.max(0, (reviewResource.quantity || proposedQtyNum) - proposedQtyNum),
          distanceKm: reviewResource.distance || 0,
          etaHours: reviewResource.etaHours || 0,
          suitability: reviewResource.suitability || 0,
          status: "Reserved",
          aiRecommendedResource: reviewResource.name,
          aiSuitability: reviewResource.suitability || 0,
          proposedQuantity: proposedQtyNum,
          finalApprovedQuantity: proposedQtyNum,
          assignedNeed: reviewSelectedNeed,
          operatorDecision: reviewDecision === "Modify" ? "Modified" : "Approved",
          operatorNotes: reviewNotes,
          confirmedBy,
          confirmedAt,
        } as any);
      }

      return next;
    });

    // Add timeline event for approval (human-readable) if not already present
    const approvalDetail = `${proposedQtyNum} from ${reviewResource.name} was reserved for this incident.`;
    setTimelineEvents((ev) => {
      const exists = ev.some((e) => e.title === "Resource allocation approved" && e.detail === approvalDetail);
      if (exists) return ev;
      return [ { title: "Resource allocation approved", detail: approvalDetail, time: "Just now" }, ...ev ];
    });

    // show confirmation alert
    setResourceAlert("Resource allocation approved successfully.");
    window.setTimeout(() => setResourceAlert(null), 5000);

    closeReviewModal();
  };

  const allocateResource = (id: string) => {
    setResources((prev) => prev.map((r) => {
      if (r.id !== id) return r;
      const total = getResourceTotalQty(r);
      const reserved = getResourceReservedQty(r);
      const inTransit = getResourceInTransitQty(r);
      const delivered = getResourceDeliveredQty(r);
      const remaining = Math.max(0, total - reserved - inTransit - delivered);
      const newReserved = reserved + remaining;
      const newAvailable = Math.max(0, total - newReserved - inTransit - delivered);
      return {
        ...r,
        reservedQty: newReserved,
        quantityAvailable: newAvailable,
        availability: "Reserved",
        status: "Reserved",
      };
    }));
  };

  const filteredResources = resources.filter((r) => {
    if (resourceFilters.category && r.category !== resourceFilters.category) return false;
    if (resourceFilters.organization && r.organization !== resourceFilters.organization) return false;
    if (resourceFilters.region && r.region !== resourceFilters.region) return false;
    if (resourceFilters.availability && r.availability !== resourceFilters.availability) return false;
    if (resourceSearch && !(`${r.name} ${r.id} ${r.category} ${r.organization}`.toLowerCase().includes(resourceSearch.toLowerCase()))) return false;
    return true;
  });

  const totalAvailableQty = resources.reduce((sum, r) => sum + getResourceAvailableQty(r), 0);
  const totalReservedQty = resources.reduce((sum, r) => sum + getResourceReservedQty(r), 0);
  const totalInTransitQty = resources.reduce((sum, r) => sum + getResourceInTransitQty(r), 0);
  const totalDeliveredQty = resources.reduce((sum, r) => sum + getResourceDeliveredQty(r), 0);
  const unavailableCount = resources.filter((r) => r.availability === "Unavailable").length;
  const resourcesAssignedCount = resources.filter((r) => r.availability === "Reserved" || r.availability === "Dispatch Ordered").length;

  const approvedCount = resources.filter((r) => r.availability === "Reserved" || String(((r as any).operatorDecision || "")).toLowerCase().includes("approved")).length;

  const recommendedResources = resources
    .slice()
    .sort((a, b) => (b.suitability ?? 0) - (a.suitability ?? 0))
    .slice(0, 4);

  const allRecommendedApproved = recommendedResources.length > 0 && recommendedResources.every((r) => r.availability === "Reserved" || String(((r as any).operatorDecision || "")).toLowerCase().includes("approved"));

  const totalInventoryQty = totalAvailableQty + totalReservedQty + totalInTransitQty + totalDeliveredQty;
  const aiAssessmentConfidence = Math.round(recommendedResources.reduce((sum, r) => sum + Number(r.suitability ?? 0), 0) / Math.max(1, recommendedResources.length));
  const aiOperationalImpact = totalInventoryQty > 0 ? `${Math.min(100, Math.round(((totalReservedQty + totalInTransitQty) / totalInventoryQty) * 100))}%` : "0%";
  const aiEstimatedArrival = recommendedResources.length
    ? `${Math.min(...recommendedResources.map((r: any) => Number(r.etaHours ?? r.eta ?? Infinity)))}h`
    : "N/A";
  const aiExpectedSavings = `$${Math.round((totalReservedQty + totalInTransitQty + totalDeliveredQty) * 5 + aiAssessmentConfidence * 150)}`;
  const aiRecommendedAction = recommendedResources.length
    ? `Recommend focusing ${recommendedResources[0].category ?? "resources"} from ${(recommendedResources[0] as any).region ?? (recommendedResources[0] as any).location ?? "source"} to ${location}.`
    : "No action recommended at this time.";
  const aiDecisionSummary = allRecommendedApproved
    ? "All recommended allocations have operator approval. Monitor logistics and verify deliveries."
    : "HumanOS AI recommends prioritized allocations; operator approval is required before execution.";

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newNeed, setNewNeed] = useState({
    category: "",
    description: "",
    quantity: "",
    unit: "",
    priority: "High",
    location: "",
    requestedBy: "",
    dueDate: "",
  });

  const resetNewNeed = () =>
    setNewNeed({
      category: "",
      description: "",
      quantity: "",
      unit: "",
      priority: "High",
      location: "",
      requestedBy: "",
      dueDate: "",
    });

  const openAddNeed = () => {
    resetNewNeed();
    setIsAddModalOpen(true);
  };

  const closeAddNeed = () => {
    setIsAddModalOpen(false);
  };

  const createNeed = () => {
    // generate next ID like NEED-005
    const max = needs.reduce((acc, n) => {
      const num = parseInt(n.id.replace(/^NEED-/, ""), 10) || 0;
      return Math.max(acc, num);
    }, 0);
    const next = (max || 4) + 1; // fallback if parsing fails
    const idStr = `NEED-${String(next).padStart(3, "0")}`;

    const newRow = {
      id: idStr,
      category: newNeed.category || "Other",
      description: newNeed.description || "",
      quantity: newNeed.quantity || "",
      unit: newNeed.unit || "",
      priority: newNeed.priority || "Medium",
      status: "Pending",
      assigned: "Unassigned",
      location: newNeed.location || "",
      requestedBy: newNeed.requestedBy || "",
      dueDate: newNeed.dueDate || "",
    };

    setNeeds((prev) => [newRow, ...prev]);
    setIsAddModalOpen(false);
    resetNewNeed();
  };

  // Operational Intelligence Assessment modal state
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const aiSuggestedPriority = "High";
  const aiConfidence = 92; // percent
  const riskScore = 81; // out of 100
  const operationalFactors = [
    { name: "Population affected", risk: "High" },
    { name: "Current inventory", risk: "High" },
    { name: "Active weather alerts", risk: "Moderate" },
    { name: "Medical capacity", risk: "Moderate" },
    { name: "Existing requests", risk: "Low" },
    { name: "Logistics accessibility", risk: "Moderate" },
  ];

  const [operatorDecision, setOperatorDecision] = useState<"AI" | "Override">("AI");
  const [overridePriority, setOverridePriority] = useState<string>("High");
  const [overrideReason, setOverrideReason] = useState<string>("");

  const openAssessment = () => {
    // default operator decision
    setOperatorDecision("AI");
    setOverridePriority(newNeed.priority || "High");
    setOverrideReason("");
    setIsAssessmentOpen(true);
  };

  const approveAndCreate = () => {
    const finalPriority = operatorDecision === "AI" ? aiSuggestedPriority : overridePriority || "Medium";

    // generate next ID like NEED-005
    const max = needs.reduce((acc, n) => {
      const num = parseInt(n.id.replace(/^NEED-/, ""), 10) || 0;
      return Math.max(acc, num);
    }, 0);
    const next = (max || 4) + 1; // fallback if parsing fails
    const idStr = `NEED-${String(next).padStart(3, "0")}`;

    const newRow = {
      id: idStr,
      category: newNeed.category || "Other",
      description: newNeed.description || "",
      quantity: newNeed.quantity || "",
      unit: newNeed.unit || "",
      priority: finalPriority,
      status: "Pending",
      assigned: "Unassigned",
      location: newNeed.location || "",
      requestedBy: newNeed.requestedBy || "",
      dueDate: newNeed.dueDate || "",
      // assessment metadata
      aiSuggestedPriority,
      aiConfidence,
      riskScore,
      operatorDecision: operatorDecision === "AI" ? "Use AI Recommendation" : "Override Recommendation",
      finalPriority,
      overrideReason: operatorDecision === "Override" ? overrideReason : "",
      confirmedBy: "Ricardo Lara",
      confirmedAt: new Date().toISOString(),
    } as any;

    setNeeds((prev) => [newRow, ...prev]);
    setIsAssessmentOpen(false);
    setIsAddModalOpen(false);
    resetNewNeed();
  };

  const priorityStyle = (priority: string) => {
    if (priority === "Critical") {
      return { background: "#881a1a", color: "#fecaca" };
    }
    if (priority === "High") {
      return { background: "#78350f", color: "#fbbf24" };
    }
    if (priority === "Medium") {
      return { background: "#0f172a", color: "#93c5fd" };
    }
    return { background: "#334155", color: "#cbd5e1" };
  };

  const statusStyle = (status: string) => {
    if (status === "Assigned") {
      return { background: "#0f172a", color: "#60a5fa" };
    }
    if (status === "Fulfilled") {
      return { background: "#0f172a", color: "#2dd4bf" };
    }
    return { background: "#0f172a", color: "#94a3b8" };
  };

  const totalNeeds = needs.length;
  const criticalCount = needs.filter((n) => n.priority === "Critical").length;
  const assignedCount = needs.filter((n) => n.status === "Assigned").length;
  const fulfilledCount = needs.filter((n) => n.status === "Fulfilled").length;

  const initialOrganizations: IncidentOrganization[] = [
    {
      id: "ORG-001",
      name: "Regional Relief Network",
      type: "NGO",
      specialties: ["Water", "Food Distribution", "Emergency Logistics"],
      coverage: "Caribbean Region",
      distanceKm: 28,
      availability: "Available",
      operationalCapacity: "High",
      responseCapacity: "High",
      estimatedMobilization: "2 hours",
      compatibilityScore: 97,
      primaryContact: "Maria Perez",
      contactRole: "Logistics Director",
      phone: "+1 305 555 0142",
      email: "maria.perez@rrn.example",
      relatedAssignment: "Water Containers",
      relatedAssignmentDetail: "5000 Bottles",
      recommendationExplanation: "Strong regional logistics reach and immediate water distribution capacity make this the best fit for rapid hydration support.",
      status: "Recommended",
    },
    {
      id: "ORG-002",
      name: "Red Cross Regional Office",
      type: "Humanitarian Partner",
      specialties: ["Medical Response", "Shelter", "Emergency Relief"],
      coverage: "Central America and Caribbean",
      distanceKm: 42,
      availability: "Available",
      operationalCapacity: "High",
      responseCapacity: "High",
      estimatedMobilization: "3 hours",
      compatibilityScore: 94,
      primaryContact: "Daniel Ruiz",
      contactRole: "Emergency Response Coordinator",
      phone: "+1 305 555 0197",
      email: "daniel.ruiz@redcross.example",
      relatedAssignment: "Emergency Medical Kits",
      relatedAssignmentDetail: "800 Kits",
      recommendationExplanation: "Best specialized medical surge option with strong shelter support and high response capacity for clinical operations.",
      status: "Recommended",
    },
    {
      id: "ORG-003",
      name: "UNICEF Regional Supply Hub",
      type: "UN Agency",
      specialties: ["Water", "Nutrition", "Child Protection"],
      coverage: "Caribbean",
      distanceKm: 65,
      availability: "Limited",
      operationalCapacity: "Medium",
      responseCapacity: "Medium",
      estimatedMobilization: "5 hours",
      compatibilityScore: 91,
      primaryContact: "Sofia Mendes",
      contactRole: "Supply Officer",
      phone: "+1 305 555 0174",
      email: "sofia.mendes@unicef.example",
      relatedAssignment: "Water and Family Supply Support",
      recommendationExplanation: "Useful for sustained family support and child-focused supply operations where immediate lift is less critical.",
      status: "Recommended",
    },
    {
      id: "ORG-004",
      name: "Civil Defense Coastal Command",
      type: "Government",
      specialties: ["Transportation", "Security", "Field Deployment"],
      coverage: "Coastal Zone",
      distanceKm: 12,
      availability: "Available",
      operationalCapacity: "High",
      responseCapacity: "High",
      estimatedMobilization: "1 hour",
      compatibilityScore: 89,
      primaryContact: "Carlos Medina",
      contactRole: "Operations Commander",
      phone: "+1 305 555 0128",
      email: "carlos.medina@civildefense.example",
      relatedAssignment: "Transport and Security Support",
      recommendationExplanation: "Fastest mobilization for secure movement, route control, and field deployment support in the incident zone.",
      status: "Recommended",
    },
  ];

  const [organizations, setOrganizations] = useState<IncidentOrganization[]>(initialOrganizations);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string>(initialOrganizations[0]?.id ?? "");
  const [organizationSearch, setOrganizationSearch] = useState("");
  const [organizationReviewModalOpen, setOrganizationReviewModalOpen] = useState(false);
  const [organizationReviewId, setOrganizationReviewId] = useState<string | null>(null);
  const [organizationDecision, setOrganizationDecision] = useState<OperatorAssignmentDecision>("Approve");
  const [organizationOperationalRole, setOrganizationOperationalRole] = useState("");
  const [organizationAssignmentScope, setOrganizationAssignmentScope] = useState("");
  const [organizationRequestedStartDate, setOrganizationRequestedStartDate] = useState("");
  const [organizationRequestedStartTime, setOrganizationRequestedStartTime] = useState("");
  const [organizationExpectedDuration, setOrganizationExpectedDuration] = useState("72 hours");
  const [organizationCoordinationLead, setOrganizationCoordinationLead] = useState(operatorName);
  const [organizationPriority, setOrganizationPriority] = useState("High");
  const [organizationInstructions, setOrganizationInstructions] = useState("");
  const [organizationDecisionNotes, setOrganizationDecisionNotes] = useState("");
  const [organizationRejectionReason, setOrganizationRejectionReason] = useState("");

  const selectedOrganization = organizations.find((organization) => organization.id === selectedOrganizationId) ?? null;
  const organizationReviewRecord = organizations.find((organization) => organization.id === organizationReviewId) ?? null;

  const filteredOrganizations = organizations.filter((organization) => {
    if (!organizationSearch.trim()) {
      return true;
    }

    const searchValue = organizationSearch.toLowerCase();

    return [
      organization.id,
      organization.name,
      organization.type,
      organization.coverage,
      organization.availability,
      organization.responseCapacity,
      organization.primaryContact,
      organization.specialties.join(" "),
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchValue);
  });

  const recommendedOrganizationsCount = organizations.filter((organization) => organization.status === "Recommended").length;
  const pendingApprovalCount = organizations.filter(
    (organization) => organization.status === "Recommended" && !organization.operatorDecision,
  ).length;
  const awaitingAcceptanceCount = organizations.filter(
    (organization) => organization.status === "Awaiting Acceptance",
  ).length;
  const activeOrganizations = organizations.filter((organization) => organization.status === "Active");
  const rejectedUnavailableCount = organizations.filter(
    (organization) => organization.status === "Rejected" || organization.availability !== "Available",
  ).length;

  const openOrganizationReviewModal = (organization: IncidentOrganization) => {
    const now = new Date();
    const suggestedRole = organization.relatedAssignment.toLowerCase().includes("medical")
      ? "Medical Response Lead"
      : organization.relatedAssignment.toLowerCase().includes("water")
      ? "Water Supply Coordination Lead"
      : organization.relatedAssignment.toLowerCase().includes("security")
      ? "Field Security Coordination Lead"
      : "Operational Support Lead";

    setOrganizationReviewId(organization.id);
    setOrganizationDecision("Approve");
    setOrganizationOperationalRole(suggestedRole);
    setOrganizationAssignmentScope(
      organization.relatedAssignmentDetail
        ? `${organization.relatedAssignment} - ${organization.relatedAssignmentDetail}`
        : organization.relatedAssignment,
    );
    setOrganizationRequestedStartDate(now.toISOString().slice(0, 10));
    setOrganizationRequestedStartTime(now.toTimeString().slice(0, 5));
    setOrganizationExpectedDuration("72 hours");
    setOrganizationCoordinationLead(operatorName);
    setOrganizationPriority(organization.compatibilityScore >= 94 ? "Critical" : "High");
    setOrganizationInstructions(
      `Coordinate ${organization.relatedAssignment.toLowerCase()} with incident command and confirm readiness before mobilization.`,
    );
    setOrganizationDecisionNotes("");
    setOrganizationRejectionReason("");
    setOrganizationReviewModalOpen(true);
  };

  const closeOrganizationReviewModal = () => {
    setOrganizationReviewModalOpen(false);
    setOrganizationReviewId(null);
    setOrganizationDecision("Approve");
    setOrganizationDecisionNotes("");
    setOrganizationRejectionReason("");
  };

  const isOrganizationDecisionDisabled = () => {
    const requestFieldsMissing = !organizationOperationalRole ||
      !organizationAssignmentScope ||
      !organizationRequestedStartDate ||
      !organizationRequestedStartTime ||
      !organizationExpectedDuration ||
      !organizationCoordinationLead ||
      !organizationPriority;

    if (organizationDecision === "Reject") {
      return organizationRejectionReason.trim().length === 0;
    }

    if (organizationDecision === "Modify") {
      return requestFieldsMissing || organizationDecisionNotes.trim().length === 0;
    }

    return requestFieldsMissing;
  };

  const confirmOrganizationDecision = () => {
    if (!organizationReviewRecord) {
      return;
    }

    const confirmedAt = new Date().toISOString();

    if (organizationDecision === "Reject") {
      setOrganizations((currentOrganizations) =>
        currentOrganizations.map((organization) => {
          if (organization.id !== organizationReviewRecord.id) {
            return organization;
          }

          return {
            ...organization,
            status: "Rejected",
            operatorDecision: "Reject",
            rejectionReason: organizationRejectionReason,
            assignmentRequestedBy: operatorName,
            assignmentRequestedAt: confirmedAt,
          };
        }),
      );

      setTimelineEvents((events) => [
        {
          title: "Organization recommendation rejected",
          detail: `${organizationReviewRecord.name} was rejected by the operator before any assignment request was sent.`,
          time: "Just now",
        },
        ...events,
      ]);

      setSelectedOrganizationId(organizationReviewRecord.id);
      closeOrganizationReviewModal();
      return;
    }

    setOrganizations((currentOrganizations) =>
      currentOrganizations.map((organization) => {
        if (organization.id !== organizationReviewRecord.id) {
          return organization;
        }

        return {
          ...organization,
          status: "Awaiting Acceptance",
          operatorDecision: organizationDecision,
          operatorNotes: organizationDecision === "Modify" ? organizationDecisionNotes : "",
          rejectionReason: undefined,
          requestedOperationalRole: organizationOperationalRole,
          requestedAssignmentScope: organizationAssignmentScope,
          requestedStartDate: organizationRequestedStartDate,
          requestedStartTime: organizationRequestedStartTime,
          expectedDuration: organizationExpectedDuration,
          coordinationLead: organizationCoordinationLead,
          priority: organizationPriority,
          instructions: organizationInstructions,
          assignmentRequestedBy: operatorName,
          assignmentRequestedAt: confirmedAt,
          organizationResponseReason: undefined,
        };
      }),
    );

    setTimelineEvents((events) => [
      {
        title: "Organization assignment requested",
        detail: `${organizationReviewRecord.name} received an assignment request for ${organizationAssignmentScope}.`,
        time: "Just now",
      },
      ...events,
    ]);

    setSelectedOrganizationId(organizationReviewRecord.id);
    closeOrganizationReviewModal();
  };

  const simulateOrganizationAcceptance = (organizationId: string) => {
    const acceptedAt = new Date().toISOString();
    const organizationRecord = organizations.find((organization) => organization.id === organizationId);

    if (!organizationRecord) {
      return;
    }

    setOrganizations((currentOrganizations) =>
      currentOrganizations.map((organization) => {
        if (organization.id !== organizationId) {
          return organization;
        }

        return {
          ...organization,
          status: "Active",
          acceptedBy: organization.primaryContact,
          acceptedAt,
          organizationResponseReason: undefined,
        };
      }),
    );

    setTimelineEvents((events) => [
      {
        title: "Organization accepted assignment",
        detail: `${organizationRecord.name} accepted the assignment request and is now active in the incident workspace.`,
        time: "Just now",
      },
      ...events,
    ]);

    setSelectedOrganizationId(organizationId);
  };

  const simulateOrganizationRejection = (organizationId: string) => {
    const rejectedAt = new Date().toISOString();
    const organizationRecord = organizations.find((organization) => organization.id === organizationId);

    if (!organizationRecord) {
      return;
    }

    setOrganizations((currentOrganizations) =>
      currentOrganizations.map((organization) => {
        if (organization.id !== organizationId) {
          return organization;
        }

        return {
          ...organization,
          status: "Rejected",
          organizationResponseReason: "Organization declined the assignment due to concurrent deployment commitments.",
          assignmentRequestedAt: organization.assignmentRequestedAt ?? rejectedAt,
        };
      }),
    );

    setTimelineEvents((events) => [
      {
        title: "Organization rejected assignment",
        detail: `${organizationRecord.name} rejected the assignment request after operator approval.`,
        time: "Just now",
      },
      ...events,
    ]);

    setSelectedOrganizationId(organizationId);
  };

  const logisticsWorkflowStages: LogisticsStage[] = [
    "Dispatch Ordered",
    "Ready for Loading",
    "Loaded",
    "In Transit",
    "Arrived",
    "Delivered",
    "Verified",
  ];

  const buildDispatchWorkflow = (stage: LogisticsStage): Record<string, StageStatus> => {
    const currentIndex = logisticsWorkflowStages.indexOf(stage);

    return {
      Reserved: currentIndex >= 0 ? "completed" : "current",
      "Dispatch Ordered": currentIndex === 0 ? "current" : currentIndex > 0 ? "completed" : "pending",
      "Ready for Loading": currentIndex === 1 ? "current" : currentIndex > 1 ? "completed" : "pending",
      Loaded: currentIndex === 2 ? "current" : currentIndex > 2 ? "completed" : "pending",
      "In Transit": currentIndex === 3 ? "current" : currentIndex > 3 ? "completed" : "pending",
      Arrived: currentIndex === 4 ? "current" : currentIndex > 4 ? "completed" : "pending",
      Delivered: currentIndex === 5 ? "current" : currentIndex > 5 ? "completed" : "pending",
      Verified: currentIndex === 6 ? "current" : "pending",
    };
  };

  const eligibleLogisticsResources = resources.filter((resource: any) => {
    const approvedByOperator = String(resource.operatorDecision ?? "").toLowerCase().includes("approved") || resource.availability === "Reserved";
    return approvedByOperator && !resource.dispatchOrderId;
  });

  const [selectedLogisticsOperationId, setSelectedLogisticsOperationId] = useState<string | null>(null);
  const [logisticsNotice, setLogisticsNotice] = useState<string | null>(null);
  const [logisticsPlanModalOpen, setLogisticsPlanModalOpen] = useState(false);
  const [logisticsPlanForm, setLogisticsPlanForm] = useState<any>(null);
  const [etaModalOpen, setEtaModalOpen] = useState(false);
  const [etaTargetDispatchId, setEtaTargetDispatchId] = useState<string | null>(null);
  const [etaNewValue, setEtaNewValue] = useState("");
  const [etaReason, setEtaReason] = useState("");
  const [etaUpdatedBy, setEtaUpdatedBy] = useState(operatorName);
  const [delayModalOpen, setDelayModalOpen] = useState(false);
  const [delayTargetDispatchId, setDelayTargetDispatchId] = useState<string | null>(null);
  const [delayReason, setDelayReason] = useState("");
  const [delayDuration, setDelayDuration] = useState("");
  const [delayImpact, setDelayImpact] = useState("");
  const [delayCorrectiveAction, setDelayCorrectiveAction] = useState("");
  const [delayReportedBy, setDelayReportedBy] = useState(operatorName);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [verificationTargetDispatchId, setVerificationTargetDispatchId] = useState<string | null>(null);
  const [verificationDeliveredQuantity, setVerificationDeliveredQuantity] = useState<number | "">("");
  const [verificationReceivingOrganization, setVerificationReceivingOrganization] = useState("");
  const [verificationReceivingOfficer, setVerificationReceivingOfficer] = useState("");
  const [verificationDeliveryDate, setVerificationDeliveryDate] = useState("");
  const [verificationDeliveryTime, setVerificationDeliveryTime] = useState("");
  const [verificationProofReference, setVerificationProofReference] = useState("");
  const [verificationCondition, setVerificationCondition] = useState("Good");
  const [verificationDiscrepancyNotes, setVerificationDiscrepancyNotes] = useState("");
  const [verificationVerifiedBy, setVerificationVerifiedBy] = useState(operatorName);

  useEffect(() => {
    if (!selectedLogisticsOperationId && dispatchOrders[0]) {
      setSelectedLogisticsOperationId(dispatchOrders[0].id);
      return;
    }

    if (!selectedLogisticsOperationId) {
      return;
    }

    const operationStillExists = dispatchOrders.some((order) => order.id === selectedLogisticsOperationId);
    if (!operationStillExists) {
      setSelectedLogisticsOperationId(dispatchOrders[0]?.id ?? null);
    }
  }, [dispatchOrders, selectedLogisticsOperationId]);

  const selectedLogisticsOperation = dispatchOrders.find((order) => order.id === selectedLogisticsOperationId) ?? null;

  const dispatchOrdersCount = dispatchOrders.length;
  const logisticsAwaitingApprovalCount = dispatchOrders.filter((order) => order.approvalStatus === "Pending Review").length;
  const readyForLoadingCount = dispatchOrders.filter((order) => order.approvalStatus === "Approved" && order.currentStage === "Ready for Loading").length;
  const logisticsInTransitCount = dispatchOrders.filter((order) => order.currentStage === "In Transit").length;
  const logisticsDeliveredCount = dispatchOrders.filter((order) => order.currentStage === "Delivered" || order.currentStage === "Verified").length;
  const delayedAtRiskCount = dispatchOrders.filter((order) => order.riskStatus === "At Risk").length;

  const logisticsAiSummary = {
    confidence: "89%",
    routeRisk: "Moderate",
    fastestRoute: "Primary Coastal Route",
    travelTime: "4 hours",
    fuelConsumption: "18%",
    securityRequirement: "Coordination Required",
    concern: "Weather deterioration near destination",
    action: "Confirm security coordination and activate GPS tracking before departure.",
  };

  const createLogisticsDraftFromResource = (resource: any) => ({
    mode: "new",
    dispatchId: nextDispatchId,
    resourceId: resource.id,
    resourceName: resource.name,
    approvedQuantity: Number(resource.finalApprovedQuantity ?? resource.proposedQuantity ?? resource.quantity ?? 0),
    relatedNeed: resource.assignedNeed ?? resource.relatedNeed ?? needs[0]?.id ?? "N/A",
    sourceOrganization: resource.organization ?? "Unknown",
    sourceLocation: resource.region ?? resource.location ?? "Unknown",
    destination: location,
    aiRecommendedRoute: "Miami Warehouse → Coastal Operations Base → Coastal Zone",
    aiRouteRisk: "Moderate",
    aiEstimatedTravelTime: "4 hours",
    aiConfidence: 89,
    finalRoute: "Miami Warehouse → Coastal Operations Base → Coastal Zone",
    vehicleType: resource.dispatchVehicleType ?? "Truck",
    vehicleId: resource.dispatchVehicleId ?? "",
    driver: resource.dispatchDriver ?? "",
    driverContact: resource.dispatchContactNumber ?? "",
    transportOrganization: resource.dispatchTransportOrganization ?? resource.organization ?? "",
    departureDate: new Date().toISOString().slice(0, 10),
    departureTime: new Date().toTimeString().slice(0, 5),
    expectedArrivalDate: new Date().toISOString().slice(0, 10),
    expectedArrivalTime: "16:00",
    gpsTracking: resource.dispatchGpsTracking ?? "Enabled",
    securityCoordination: "Pending",
    fuelStatus: "Confirmed",
    loadingLocation: resource.region ?? resource.location ?? "Origin Warehouse",
    receivingOrganization: resource.organization ?? "Receiving Organization",
    receivingOfficer: "",
    receivingContact: "",
    specialInstructions: resource.dispatchSpecialInstructions ?? "",
    packingListReference: resource.dispatchPackingListReference ?? "",
    supportingDocumentsReference: "",
    operatorDecision: "Approve",
    operatorNotes: "",
    rejectionReason: "",
  });

  const createLogisticsFormFromOperation = (operation: LogisticsOperation) => ({
    mode: "existing",
    dispatchId: operation.id,
    resourceId: operation.resourceId,
    resourceName: operation.resourceName,
    approvedQuantity: Number(operation.approvedQuantity ?? 0),
    relatedNeed: operation.relatedNeed,
    sourceOrganization: operation.sourceOrganization,
    sourceLocation: operation.sourceLocation,
    destination: operation.destination,
    aiRecommendedRoute: operation.aiRecommendedRoute,
    aiRouteRisk: operation.aiRouteRisk,
    aiEstimatedTravelTime: operation.aiEstimatedTravelTime,
    aiConfidence: operation.aiConfidence,
    finalRoute: operation.finalRoute || operation.route,
    vehicleType: operation.vehicleType,
    vehicleId: operation.vehicleId,
    driver: operation.driver,
    driverContact: operation.contactNumber,
    transportOrganization: operation.transportOrganization,
    departureDate: operation.departureDate,
    departureTime: operation.departureTime,
    expectedArrivalDate: operation.expectedArrivalDate,
    expectedArrivalTime: operation.expectedArrivalTime,
    gpsTracking: operation.gpsTracking,
    securityCoordination: operation.securityCoordination,
    fuelStatus: operation.fuelStatus,
    loadingLocation: operation.loadingLocation ?? operation.sourceLocation,
    receivingOrganization: operation.receivingOrganization ?? operation.destination,
    receivingOfficer: operation.receivingOfficer ?? "",
    receivingContact: operation.receivingContact ?? "",
    specialInstructions: operation.specialInstructions,
    packingListReference: operation.packingListReference,
    supportingDocumentsReference: operation.supportingDocumentsReference ?? "",
    operatorDecision: operation.approvalStatus === "Rejected" ? "Reject" : operation.decision === "Modify" ? "Modify" : "Approve",
    operatorNotes: operation.operatorNotes ?? "",
    rejectionReason: operation.rejectionReason ?? "",
  });

  const openCreateLogisticsPlanModal = () => {
    const candidate = eligibleLogisticsResources[0];

    if (!candidate) {
      setLogisticsNotice("No approved resource assignment is currently available to create a logistics plan.");
      window.setTimeout(() => setLogisticsNotice(null), 5000);
      return;
    }

    setLogisticsPlanForm(createLogisticsDraftFromResource(candidate));
    setLogisticsPlanModalOpen(true);
  };

  const openExistingLogisticsPlanModal = (operation: LogisticsOperation) => {
    setLogisticsPlanForm(createLogisticsFormFromOperation(operation));
    setLogisticsPlanModalOpen(true);
  };

  const closeLogisticsPlanModal = () => {
    setLogisticsPlanModalOpen(false);
    setLogisticsPlanForm(null);
  };

  const syncResourceFromOperation = (resource: any, operation: LogisticsOperation, revertToReserved = false) => {
    const matchesResource = resource.dispatchOrderId === operation.id || resource.id === operation.resourceId || resource.name === operation.resourceName;
    if (!matchesResource) {
      return resource;
    }

    const approvedQty = Number(operation.approvedQuantity || 0);
    const total = getResourceTotalQty(resource);
    let reservedQty = getResourceReservedQty(resource);
    let inTransitQty = getResourceInTransitQty(resource);
    let deliveredQty = getResourceDeliveredQty(resource);
    let availability: string = operation.currentStage;
    let statusValue: string = operation.currentStage;

    if (revertToReserved) {
      availability = "Reserved";
      statusValue = "Reserved";
    } else if (operation.currentStage === "In Transit" || operation.currentStage === "Arrived") {
      if (!["In Transit", "Arrived", "Delivered", "Verified"].includes(resource.availability ?? resource.status ?? "")) {
        reservedQty = Math.max(0, reservedQty - approvedQty);
        inTransitQty += approvedQty;
      }
    } else if (operation.currentStage === "Delivered" || operation.currentStage === "Verified") {
      if ((resource.availability ?? resource.status ?? "") !== "Delivered" && (resource.availability ?? resource.status ?? "") !== "Verified") {
        if ((resource.availability ?? resource.status ?? "") !== "In Transit" && (resource.availability ?? resource.status ?? "") !== "Arrived") {
          reservedQty = Math.max(0, reservedQty - approvedQty);
          inTransitQty += approvedQty;
        }
        inTransitQty = Math.max(0, inTransitQty - approvedQty);
        deliveredQty += approvedQty;
      }
    }

    const quantityAvailable = Math.max(0, total - reservedQty - inTransitQty - deliveredQty);

    return {
      ...resource,
      availability,
      status: statusValue,
      reservedQty,
      inTransitQty,
      deliveredQty,
      quantityAvailable,
      dispatchOrderId: operation.id,
      dispatchOrder: operation,
      dispatchWorkflow: buildDispatchWorkflow(operation.currentStage),
      dispatchCurrentStage: operation.currentStage,
      dispatchCurrentStatus: operation.currentLogisticsStatus,
      dispatchVehicleType: operation.vehicleType,
      dispatchVehicleId: operation.vehicleId,
      dispatchDriver: operation.driver,
      dispatchContactNumber: operation.contactNumber,
      dispatchTransportOrganization: operation.transportOrganization,
      dispatchRoute: operation.finalRoute,
      dispatchArrivalDate: operation.expectedArrivalDate,
      dispatchArrivalTime: operation.expectedArrivalTime,
      dispatchDepartureDate: operation.departureDate,
      dispatchDepartureTime: operation.departureTime,
      dispatchGpsTracking: operation.gpsTracking,
      dispatchSpecialInstructions: operation.specialInstructions,
      dispatchPackingListReference: operation.packingListReference,
    };
  };

  const applyLogisticsOperation = (nextOperation: LogisticsOperation, revertToReserved = false) => {
    setDispatchOrders((currentOrders) =>
      currentOrders.map((order) => (order.id === nextOperation.id ? nextOperation : order)),
    );
    setResources((currentResources) =>
      currentResources.map((resource) => syncResourceFromOperation(resource, nextOperation, revertToReserved)),
    );
    setSelectedLogisticsOperationId(nextOperation.id);
  };

  const isLogisticsPlanDecisionDisabled = () => {
    if (!logisticsPlanForm) {
      return true;
    }

    const requiredFieldsComplete = Boolean(
      logisticsPlanForm.finalRoute &&
      logisticsPlanForm.vehicleType &&
      logisticsPlanForm.vehicleId &&
      logisticsPlanForm.driver &&
      logisticsPlanForm.driverContact &&
      logisticsPlanForm.transportOrganization &&
      logisticsPlanForm.departureDate &&
      logisticsPlanForm.departureTime &&
      logisticsPlanForm.expectedArrivalDate &&
      logisticsPlanForm.expectedArrivalTime &&
      logisticsPlanForm.loadingLocation &&
      logisticsPlanForm.receivingOrganization &&
      logisticsPlanForm.receivingOfficer &&
      logisticsPlanForm.receivingContact &&
      logisticsPlanForm.packingListReference
    );

    if (logisticsPlanForm.operatorDecision === "Reject") {
      return logisticsPlanForm.rejectionReason.trim().length === 0;
    }

    if (logisticsPlanForm.operatorDecision === "Modify") {
      return !requiredFieldsComplete || logisticsPlanForm.operatorNotes.trim().length === 0;
    }

    return !requiredFieldsComplete;
  };

  const confirmLogisticsPlanDecision = () => {
    if (!logisticsPlanForm) {
      return;
    }

    const confirmedAt = new Date().toISOString();
    const existingOperation = dispatchOrders.find((order) => order.id === logisticsPlanForm.dispatchId) ?? null;

    if (logisticsPlanForm.operatorDecision === "Reject") {
      if (existingOperation) {
        const rejectedOperation: LogisticsOperation = {
          ...existingOperation,
          approvalStatus: "Rejected",
          decision: "Reject",
          rejectionReason: logisticsPlanForm.rejectionReason,
          operatorNotes: "",
          currentLogisticsStatus: "Rejected",
          routeStatus: "Rejected by operator",
          lastUpdate: confirmedAt,
        };
        applyLogisticsOperation(rejectedOperation, true);
      }

      setTimelineEvents((events) => [
        {
          title: "Logistics plan rejected",
          detail: `Logistics plan for dispatch ${logisticsPlanForm.dispatchId} was rejected by the operator and was not activated.`,
          time: "Just now",
        },
        ...events,
      ]);

      closeLogisticsPlanModal();
      return;
    }

    const approvedOperation: LogisticsOperation = {
      ...(existingOperation ?? {
        id: logisticsPlanForm.dispatchId,
        incidentId: id,
        originSignal: signal,
        resourceId: logisticsPlanForm.resourceId,
        resourceName: logisticsPlanForm.resourceName,
        resourceCategory: resources.find((resource: any) => resource.id === logisticsPlanForm.resourceId)?.category ?? "Unknown",
        approvedQuantity: Number(logisticsPlanForm.approvedQuantity || 0),
        relatedNeed: logisticsPlanForm.relatedNeed,
        sourceOrganization: logisticsPlanForm.sourceOrganization,
        sourceLocation: logisticsPlanForm.sourceLocation,
        destination: logisticsPlanForm.destination,
        suitabilityScore: resources.find((resource: any) => resource.id === logisticsPlanForm.resourceId)?.suitability ?? "N/A",
        specialInstructions: "",
        packingListReference: "",
        decision: "Approve",
        operatorNotes: "",
        confirmedBy: operatorName,
        confirmedAt,
        currentStage: "Ready for Loading",
        currentLogisticsStatus: "Ready for Loading",
        approvalStatus: "Approved",
        aiRecommendedRoute: logisticsPlanForm.aiRecommendedRoute,
        aiAlternativeRoute: "Miami Warehouse → Southern Corridor → Coastal Zone",
        aiRouteDistance: "45 km",
        aiEstimatedTravelTime: logisticsPlanForm.aiEstimatedTravelTime,
        aiRouteRisk: logisticsPlanForm.aiRouteRisk,
        aiWeatherImpact: "Moderate",
        aiRoadAccessibility: "Available with restrictions",
        aiFuelReadiness: "Confirmed",
        aiVehicleCapacity: "Adequate",
        aiSecurityCoordination: "Required",
        aiConfidence: Number(logisticsPlanForm.aiConfidence ?? 89),
        finalRoute: logisticsPlanForm.finalRoute,
        securityCoordination: logisticsPlanForm.securityCoordination,
        fuelStatus: logisticsPlanForm.fuelStatus,
        riskStatus: "Moderate",
        currentEta: `${logisticsPlanForm.expectedArrivalDate} ${logisticsPlanForm.expectedArrivalTime}`.trim(),
        distanceRemaining: "45 km",
        lastGpsUpdate: "Pending activation",
        currentSpeed: "0 km/h",
        routeStatus: "Approved - awaiting loading",
        lastUpdate: confirmedAt,
        dispatchWorkflow: buildDispatchWorkflow("Ready for Loading"),
      } as LogisticsOperation),
      resourceId: logisticsPlanForm.resourceId,
      resourceName: logisticsPlanForm.resourceName,
      approvedQuantity: Number(logisticsPlanForm.approvedQuantity || 0),
      relatedNeed: logisticsPlanForm.relatedNeed,
      sourceOrganization: logisticsPlanForm.sourceOrganization,
      sourceLocation: logisticsPlanForm.sourceLocation,
      destination: logisticsPlanForm.destination,
      vehicleType: logisticsPlanForm.vehicleType,
      vehicleId: logisticsPlanForm.vehicleId,
      driver: logisticsPlanForm.driver,
      contactNumber: logisticsPlanForm.driverContact,
      transportOrganization: logisticsPlanForm.transportOrganization,
      departureDate: logisticsPlanForm.departureDate,
      departureTime: logisticsPlanForm.departureTime,
      expectedArrivalDate: logisticsPlanForm.expectedArrivalDate,
      expectedArrivalTime: logisticsPlanForm.expectedArrivalTime,
      route: logisticsPlanForm.finalRoute,
      gpsTracking: logisticsPlanForm.gpsTracking,
      specialInstructions: logisticsPlanForm.specialInstructions,
      packingListReference: logisticsPlanForm.packingListReference,
      supportingDocumentsReference: logisticsPlanForm.supportingDocumentsReference,
      loadingLocation: logisticsPlanForm.loadingLocation,
      receivingOrganization: logisticsPlanForm.receivingOrganization,
      receivingOfficer: logisticsPlanForm.receivingOfficer,
      receivingContact: logisticsPlanForm.receivingContact,
      decision: logisticsPlanForm.operatorDecision,
      operatorNotes: logisticsPlanForm.operatorDecision === "Modify" ? logisticsPlanForm.operatorNotes : "",
      confirmedBy: operatorName,
      confirmedAt,
      currentStage: "Ready for Loading",
      currentLogisticsStatus: "Ready for Loading",
      approvalStatus: "Approved",
      aiRecommendedRoute: logisticsPlanForm.aiRecommendedRoute,
      aiAlternativeRoute: existingOperation?.aiAlternativeRoute ?? "Miami Warehouse → Southern Corridor → Coastal Zone",
      aiRouteDistance: existingOperation?.aiRouteDistance ?? "45 km",
      aiEstimatedTravelTime: logisticsPlanForm.aiEstimatedTravelTime,
      aiRouteRisk: logisticsPlanForm.aiRouteRisk,
      aiWeatherImpact: existingOperation?.aiWeatherImpact ?? "Moderate",
      aiRoadAccessibility: existingOperation?.aiRoadAccessibility ?? "Available with restrictions",
      aiFuelReadiness: existingOperation?.aiFuelReadiness ?? "Confirmed",
      aiVehicleCapacity: existingOperation?.aiVehicleCapacity ?? "Adequate",
      aiSecurityCoordination: existingOperation?.aiSecurityCoordination ?? "Required",
      aiConfidence: Number(logisticsPlanForm.aiConfidence ?? 89),
      finalRoute: logisticsPlanForm.finalRoute,
      securityCoordination: logisticsPlanForm.securityCoordination,
      fuelStatus: logisticsPlanForm.fuelStatus,
      riskStatus: existingOperation?.riskStatus ?? "Moderate",
      currentEta: `${logisticsPlanForm.expectedArrivalDate} ${logisticsPlanForm.expectedArrivalTime}`.trim(),
      distanceRemaining: existingOperation?.distanceRemaining ?? "45 km",
      lastGpsUpdate: existingOperation?.lastGpsUpdate ?? "Pending activation",
      currentSpeed: existingOperation?.currentSpeed ?? "0 km/h",
      routeStatus: "Approved - awaiting loading",
      lastUpdate: confirmedAt,
      rejectionReason: undefined,
      dispatchWorkflow: buildDispatchWorkflow("Ready for Loading"),
    };

    if (existingOperation) {
      applyLogisticsOperation(approvedOperation);
    } else {
      setDispatchOrders((currentOrders) => [approvedOperation, ...currentOrders]);
      setResources((currentResources) =>
        currentResources.map((resource) => syncResourceFromOperation(resource, approvedOperation)),
      );
      setSelectedLogisticsOperationId(approvedOperation.id);
      setDispatchIdCounter((count) => count + 1);
    }

    setTimelineEvents((events) => [
      {
        title: "Logistics plan approved",
        detail: `Logistics plan for dispatch ${approvedOperation.id} was approved and is ready for loading.`,
        time: "Just now",
      },
      ...events,
    ]);

    closeLogisticsPlanModal();
  };

  const updateLogisticsStage = (
    operationId: string,
    stage: LogisticsStage,
    statusDetail: string,
    timelineTitle: string,
    timelineDetail: string,
    extraUpdates: Partial<LogisticsOperation> = {},
  ) => {
    const currentOperation = dispatchOrders.find((order) => order.id === operationId);
    if (!currentOperation) {
      return;
    }

    const timestamp = new Date().toISOString();
    const nextOperation: LogisticsOperation = {
      ...currentOperation,
      ...extraUpdates,
      currentStage: stage,
      currentLogisticsStatus: statusDetail,
      lastUpdate: timestamp,
      dispatchWorkflow: buildDispatchWorkflow(stage),
    };

    applyLogisticsOperation(nextOperation);
    setTimelineEvents((events) => [
      { title: timelineTitle, detail: timelineDetail, time: "Just now" },
      ...events,
    ]);
  };

  const confirmLoadingStarted = (operationId: string) => {
    updateLogisticsStage(
      operationId,
      "Loaded",
      "Loaded",
      "Loading started",
      `Loading started for dispatch ${operationId}.`,
      { routeStatus: "Loading completed, awaiting departure", currentSpeed: "0 km/h" },
    );
  };

  const confirmDeparture = (operationId: string) => {
    const timestamp = new Date().toISOString();
    updateLogisticsStage(
      operationId,
      "In Transit",
      "In Transit",
      "Dispatch departed",
      `Dispatch ${operationId} departed and is now in transit.`,
      {
        departureActualAt: timestamp,
        routeStatus: "Vehicle departed",
        currentSpeed: "48 km/h",
        lastGpsUpdate: formatDateTime(timestamp),
        distanceRemaining: "32 km",
      },
    );
  };

  const openEtaUpdateModal = (operation: LogisticsOperation) => {
    setEtaTargetDispatchId(operation.id);
    setEtaNewValue(operation.currentEta);
    setEtaReason("");
    setEtaUpdatedBy(operatorName);
    setEtaModalOpen(true);
  };

  const closeEtaUpdateModal = () => {
    setEtaModalOpen(false);
    setEtaTargetDispatchId(null);
    setEtaNewValue("");
    setEtaReason("");
    setEtaUpdatedBy(operatorName);
  };

  const confirmEtaUpdate = () => {
    if (!etaTargetDispatchId || !etaNewValue || !etaReason.trim()) {
      return;
    }

    updateLogisticsStage(
      etaTargetDispatchId,
      "In Transit",
      "In Transit",
      "ETA updated",
      `ETA for dispatch ${etaTargetDispatchId} was updated to ${etaNewValue} by ${etaUpdatedBy}. Reason: ${etaReason}.`,
      {
        currentEta: etaNewValue,
        routeStatus: "ETA updated in transit",
        lastGpsUpdate: formatDateTime(new Date().toISOString()),
      },
    );

    closeEtaUpdateModal();
  };

  const openDelayModal = (operation: LogisticsOperation) => {
    setDelayTargetDispatchId(operation.id);
    setDelayReason("");
    setDelayDuration("");
    setDelayImpact("");
    setDelayCorrectiveAction("");
    setDelayReportedBy(operatorName);
    setDelayModalOpen(true);
  };

  const closeDelayModal = () => {
    setDelayModalOpen(false);
    setDelayTargetDispatchId(null);
    setDelayReason("");
    setDelayDuration("");
    setDelayImpact("");
    setDelayCorrectiveAction("");
    setDelayReportedBy(operatorName);
  };

  const confirmDelayReport = () => {
    if (!delayTargetDispatchId || !delayReason.trim() || !delayDuration.trim() || !delayImpact.trim() || !delayCorrectiveAction.trim()) {
      return;
    }

    updateLogisticsStage(
      delayTargetDispatchId,
      "In Transit",
      "In Transit",
      "Delay reported",
      `Dispatch ${delayTargetDispatchId} reported a delay. Reason: ${delayReason}. Impact: ${delayImpact}.`,
      {
        riskStatus: "At Risk",
        routeStatus: "Delay reported - corrective action in progress",
        delayReason,
        estimatedDelayDuration: delayDuration,
        operationalImpact: delayImpact,
        correctiveAction: delayCorrectiveAction,
        currentEta: `${etaNewValue || "Updated ETA pending"}`,
      },
    );

    closeDelayModal();
  };

  const confirmArrival = (operationId: string) => {
    const timestamp = new Date().toISOString();
    updateLogisticsStage(
      operationId,
      "Arrived",
      "Arrived",
      "Dispatch arrived",
      `Dispatch ${operationId} arrived at the destination and is awaiting delivery confirmation.`,
      {
        arrivalAt: timestamp,
        routeStatus: "Arrived at destination",
        currentSpeed: "0 km/h",
        distanceRemaining: "0 km",
        lastGpsUpdate: formatDateTime(timestamp),
      },
    );
  };

  const confirmDelivery = (operationId: string) => {
    const timestamp = new Date().toISOString();
    updateLogisticsStage(
      operationId,
      "Delivered",
      "Delivered",
      "Delivery confirmed",
      `Dispatch ${operationId} was delivered at the destination and is awaiting verification.`,
      {
        deliveredAt: timestamp,
        routeStatus: "Shipment delivered",
      },
    );
  };

  const openVerificationModal = (operation: LogisticsOperation) => {
    const now = new Date();
    setVerificationTargetDispatchId(operation.id);
    setVerificationDeliveredQuantity(Number(operation.approvedQuantity || 0));
    setVerificationReceivingOrganization(operation.receivingOrganization ?? operation.destination);
    setVerificationReceivingOfficer(operation.receivingOfficer ?? "");
    setVerificationDeliveryDate(now.toISOString().slice(0, 10));
    setVerificationDeliveryTime(now.toTimeString().slice(0, 5));
    setVerificationProofReference("");
    setVerificationCondition("Good");
    setVerificationDiscrepancyNotes("");
    setVerificationVerifiedBy(operatorName);
    setVerificationModalOpen(true);
  };

  const closeVerificationModal = () => {
    setVerificationModalOpen(false);
    setVerificationTargetDispatchId(null);
    setVerificationDeliveredQuantity("");
    setVerificationReceivingOrganization("");
    setVerificationReceivingOfficer("");
    setVerificationDeliveryDate("");
    setVerificationDeliveryTime("");
    setVerificationProofReference("");
    setVerificationCondition("Good");
    setVerificationDiscrepancyNotes("");
    setVerificationVerifiedBy(operatorName);
  };

  const confirmVerification = () => {
    if (!verificationTargetDispatchId || verificationDeliveredQuantity === "" || !verificationReceivingOrganization || !verificationReceivingOfficer || !verificationDeliveryDate || !verificationDeliveryTime || !verificationProofReference || !verificationVerifiedBy) {
      return;
    }

    updateLogisticsStage(
      verificationTargetDispatchId,
      "Verified",
      "Verified",
      "Delivery verified",
      `Dispatch ${verificationTargetDispatchId} was verified after delivery by ${verificationVerifiedBy}.`,
      {
        deliveredQuantity: Number(verificationDeliveredQuantity),
        receivingOrganization: verificationReceivingOrganization,
        receivingOfficer: verificationReceivingOfficer,
        deliveredAt: `${verificationDeliveryDate} ${verificationDeliveryTime}`,
        proofOfDeliveryReference: verificationProofReference,
        conditionOfShipment: verificationCondition,
        discrepancyNotes: verificationDiscrepancyNotes,
        verifiedBy: verificationVerifiedBy,
        verifiedAt: new Date().toISOString(),
        routeStatus: "Delivery verified",
      },
    );

    closeVerificationModal();
  };

  const renderLogisticsActionButtons = (operation: LogisticsOperation) => {
    if (operation.approvalStatus !== "Approved") {
      return (
        <button
          type="button"
          onClick={() => openExistingLogisticsPlanModal(operation)}
          style={{
            padding: "10px 14px",
            borderRadius: "999px",
            background: "#12364b",
            border: "1px solid #203b50",
            color: "#4fd1c5",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Review Logistics Plan
        </button>
      );
    }

    if (operation.currentStage === "Ready for Loading") {
      return (
        <button type="button" onClick={() => confirmLoadingStarted(operation.id)} style={{ padding: "10px 14px", borderRadius: "999px", background: "#12364b", border: "1px solid #203b50", color: "#4fd1c5", cursor: "pointer", fontWeight: 700 }}>
          Confirm Loading Started
        </button>
      );
    }

    if (operation.currentStage === "Loaded") {
      return (
        <button type="button" onClick={() => confirmDeparture(operation.id)} style={{ padding: "10px 14px", borderRadius: "999px", background: "#0b5e4a", border: "1px solid #064e3b", color: "#86efac", cursor: "pointer", fontWeight: 700 }}>
          Confirm Departure
        </button>
      );
    }

    if (operation.currentStage === "In Transit") {
      return (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button type="button" onClick={() => openEtaUpdateModal(operation)} style={{ padding: "10px 14px", borderRadius: "999px", background: "#12364b", border: "1px solid #203b50", color: "#4fd1c5", cursor: "pointer", fontWeight: 700 }}>Update ETA</button>
          <button type="button" onClick={() => openDelayModal(operation)} style={{ padding: "10px 14px", borderRadius: "999px", background: "#4c1d1d", border: "1px solid #7f1d1d", color: "#fca5a5", cursor: "pointer", fontWeight: 700 }}>Report Delay</button>
          <button type="button" onClick={() => confirmArrival(operation.id)} style={{ padding: "10px 14px", borderRadius: "999px", background: "#0b5e4a", border: "1px solid #064e3b", color: "#86efac", cursor: "pointer", fontWeight: 700 }}>Confirm Arrival</button>
        </div>
      );
    }

    if (operation.currentStage === "Arrived") {
      return (
        <button type="button" onClick={() => confirmDelivery(operation.id)} style={{ padding: "10px 14px", borderRadius: "999px", background: "#0b5e4a", border: "1px solid #064e3b", color: "#86efac", cursor: "pointer", fontWeight: 700 }}>
          Confirm Delivery
        </button>
      );
    }

    if (operation.currentStage === "Delivered") {
      return (
        <button type="button" onClick={() => openVerificationModal(operation)} style={{ padding: "10px 14px", borderRadius: "999px", background: "#12364b", border: "1px solid #203b50", color: "#4fd1c5", cursor: "pointer", fontWeight: 700 }}>
          Verify Delivery
        </button>
      );
    }

    return (
      <button type="button" disabled style={{ padding: "10px 14px", borderRadius: "999px", background: "#1e293b", border: "1px solid #334155", color: "#94a3b8", cursor: "default", fontWeight: 700 }}>
        Operation Verified
      </button>
    );
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px",
        background: "#071827",
        color: "#f8fafc",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <section
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          display: "grid",
          gap: "18px",
        }}
      >
        <header
          style={{
            padding: "24px",
            borderRadius: "18px",
            border: "1px solid #203b50",
            background: "#0b2031",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: "18px",
              alignItems: "center",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={headerLabelStyle}>Incident Management</div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <h1
                  style={{
                    fontSize: "28px",
                    margin: 0,
                    fontWeight: 600,
                    color: "#f8fafc",
                  }}
                >
                  {title}
                </h1>
                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: "999px",
                    background: "#12364b",
                    color: "#4fd1c5",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  {status}
                </span>
              </div>
              <div
                style={{
                  color: "#94a3b8",
                  marginTop: "10px",
                  fontSize: "13px",
                }}
              >
                Incident ID: {id}
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link
                href="/signals"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px 18px",
                  borderRadius: "999px",
                  background: "#12364b",
                  color: "#4fd1c5",
                  fontSize: "13px",
                  textDecoration: "none",
                  fontWeight: 600,
                  border: "1px solid transparent",
                }}
              >
                Back to Signals
              </Link>
            </div>
          </div>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
              gap: "16px",
            }}
          >
            <div
              style={{
                gridColumn: "span 12",
                display: "grid",
                gap: "16px",
              }}
            >
              <div
                style={{
                  padding: "20px",
                  borderRadius: "16px",
                  border: "1px solid #203b50",
                  background: "#0d2639",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "18px",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: "18px",
                    }}
                  >
                    <div>
                      <div style={headerLabelStyle}>Origin Signal</div>
                      <div style={{ marginTop: "8px", color: "#e2e8f0" }}>{signal}</div>
                    </div>
                    <div>
                      <div style={headerLabelStyle}>Severity</div>
                      <div style={{ marginTop: "8px", color: "#e2e8f0" }}>{severity}</div>
                    </div>
                    <div>
                      <div style={headerLabelStyle}>Location</div>
                      <div style={{ marginTop: "8px", color: "#e2e8f0" }}>{location}</div>
                    </div>
                    <div>
                      <div style={headerLabelStyle}>Assigned To</div>
                      <div style={{ marginTop: "8px", color: "#e2e8f0" }}>{assignedTo}</div>
                    </div>
                    <div>
                      <div style={headerLabelStyle}>Created By</div>
                      <div style={{ marginTop: "8px", color: "#e2e8f0" }}>{createdBy}</div>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "18px",
                      borderRadius: "14px",
                      border: "1px solid #203b50",
                      background: "#091d2c",
                    }}
                  >
                    <div style={headerLabelStyle}>Description</div>
                    <p
                      style={{
                        marginTop: "12px",
                        lineHeight: 1.8,
                        color: "#cbd5e1",
                        fontSize: "14px",
                      }}
                    >
                      {description}
                    </p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "16px",
                }}
              >
                {[
                  ["Needs Linked", String(totalNeeds)],
                  ["Resources Assigned", String(resourcesAssignedCount)],
                  ["Organizations Assigned", String(activeOrganizations.length)],
                  ["Open Tasks", "0"],
                ].map(([label, value]) => (
                  <div key={label} style={cardStyle}>
                    <div style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "12px" }}>{label}</div>
                    <div style={{ fontSize: "32px", fontWeight: 700, color: "#f8fafc" }}>{value}</div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  borderRadius: "14px",
                  border: "1px solid #203b50",
                  padding: "14px",
                  background: "#091d2c",
                }}
              >
                {tabItems.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    style={{
                      border: "none",
                      background: tab === activeTab ? "#12364b" : "transparent",
                      color: tab === activeTab ? "#4fd1c5" : "#cbd5e1",
                      padding: "10px 16px",
                      borderRadius: "999px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div
                style={{
                  padding: "20px",
                  borderRadius: "16px",
                  border: "1px solid #203b50",
                  background: "#0d2639",
                  display: "grid",
                  gap: "20px",
                }}
              >
                {activeTab === "Overview" ? (
                  <>
                    <div>
                      <div style={headerLabelStyle}>Operational Workflow</div>
                      <div
                        style={{
                          marginTop: "18px",
                          display: "grid",
                          gap: "14px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                            gap: "12px",
                          }}
                        >
                          <div style={{ color: "#cbd5e1", fontSize: "14px", fontWeight: 600 }}>
                            {progressPercentage}% complete
                          </div>
                          <div style={{ color: "#94a3b8", fontSize: "13px" }}>
                            {completedCount}/{totalStages} stages completed
                          </div>
                        </div>
                        <div
                          style={{
                            width: "100%",
                            height: "10px",
                            borderRadius: "999px",
                            background: "#12364b",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${progressPercentage}%`,
                              height: "100%",
                              background: "#2dd4bf",
                              transition: "width 180ms ease",
                            }}
                          />
                        </div>
                        {workflowCompleted ? (
                          <div style={{ color: "#4fd1c5", fontSize: "13px", fontWeight: 600 }}>
                            Operational workflow completed.
                          </div>
                        ) : null}
                      </div>
                      <div style={{ marginTop: "18px", display: "grid", gap: "12px" }}>
                        {workflowStages.map((stage, index) => {
                          const isCompleted = stage.status === "completed";
                          const isCurrent = stage.status === "current";
                          return (
                            <div
                              key={stage.title}
                              style={{
                                display: "grid",
                                gridTemplateColumns: "32px minmax(0, 1fr)",
                                gap: "14px",
                                padding: "16px",
                                borderRadius: "14px",
                                border: isCurrent ? "1px solid #3b82f6" : "1px solid #203b50",
                                background: isCurrent ? "#0f2c4d" : "#091d2c",
                                alignItems: "start",
                                position: "relative",
                              }}
                            >
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <div
                                  style={{
                                    width: "16px",
                                    height: "16px",
                                    borderRadius: "999px",
                                    display: "grid",
                                    placeItems: "center",
                                    background: isCompleted ? "#2dd4bf" : isCurrent ? "#60a5fa" : "#475569",
                                    color: "#0f172a",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                  }}
                                >
                                  {isCompleted ? "✓" : ""}
                                </div>
                                {index < workflowStages.length - 1 ? (
                                  <div
                                    style={{
                                      flexGrow: 1,
                                      width: "2px",
                                      background: "#203b50",
                                      marginTop: "8px",
                                    }}
                                  />
                                ) : null}
                              </div>

                              <div style={{ minWidth: 0 }}>
                                <div
                                  style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "10px",
                                    alignItems: "center",
                                  }}
                                >
                                  <div style={{ fontWeight: 700, color: "#f8fafc" }}>{stage.title}</div>
                                  {isCurrent ? (
                                    <span
                                      style={{
                                        padding: "4px 10px",
                                        borderRadius: "999px",
                                        background: "#12364b",
                                        color: "#4fd1c5",
                                        fontSize: "11px",
                                        fontWeight: 700,
                                      }}
                                    >
                                      CURRENT
                                    </span>
                                  ) : null}
                                </div>
                                <div
                                  style={{
                                    marginTop: "6px",
                                    color: isCompleted ? "#cbd5e1" : isCurrent ? "#cbd5e1" : "#64748b",
                                    fontSize: "13px",
                                  }}
                                >
                                  {isCompleted ? "Completed" : isCurrent ? "In progress" : "Pending"}
                                </div>
                                {isCurrent ? (
                                  <button
                                    type="button"
                                    onClick={completeCurrentStage}
                                    style={{
                                      marginTop: "14px",
                                      padding: "10px 14px",
                                      borderRadius: "999px",
                                      background: "#12364b",
                                      color: "#4fd1c5",
                                      fontSize: "13px",
                                      fontWeight: 700,
                                      border: "1px solid #203b50",
                                      cursor: "pointer",
                                    }}
                                  >
                                    Complete Current Step
                                  </button>
                                ) : null}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <div style={headerLabelStyle}>Next Recommended Actions</div>
                      <div
                        style={{
                          marginTop: "18px",
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                          gap: "16px",
                        }}
                      >
                        {currentRecommendations.map((action) => (
                          <div
                            key={action.title}
                            style={{
                              padding: "18px",
                              borderRadius: "14px",
                              border: "1px solid #203b50",
                              background: "#091d2c",
                              display: "grid",
                              gap: "12px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "start",
                                gap: "10px",
                              }}
                            >
                              <div style={{ fontWeight: 700, color: "#f8fafc" }}>{action.title}</div>
                              <span
                                style={{
                                  padding: "4px 10px",
                                  borderRadius: "999px",
                                  background: action.priority === "Immediate" ? "#1d4ed8" : "#0f172a",
                                  color: action.priority === "Immediate" ? "#93c5fd" : "#cbd5e1",
                                  fontSize: "11px",
                                  fontWeight: 700,
                                }}
                              >
                                {action.priority}
                              </span>
                            </div>
                            <div style={{ color: "#cbd5e1", fontSize: "14px", lineHeight: 1.7 }}>{action.description}</div>
                            <button
                              type="button"
                              style={{
                                marginTop: "8px",
                                border: "1px solid #203b50",
                                borderRadius: "999px",
                                background: "#12364b",
                                color: "#4fd1c5",
                                padding: "10px 16px",
                                cursor: "pointer",
                                fontWeight: 700,
                                alignSelf: "start",
                              }}
                            >
                              {action.action}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : activeTab === "Needs" ? (
                  <div
                    style={{
                      display: "grid",
                      gap: "18px",
                    }}
                  >
                    <div
                      style={{
                        padding: "20px",
                        borderRadius: "16px",
                        border: "1px solid #203b50",
                        background: "#0d2639",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        gap: "18px",
                        alignItems: "start",
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div style={{ color: "#94a3b8", fontSize: "10px", letterSpacing: "1.8px", textTransform: "uppercase" }}>
                          Incident Needs
                        </div>
                        <h2 style={{ color: "#f8fafc", fontSize: "24px", margin: "10px 0 0" }}>
                          Incident Needs
                        </h2>
                        <p style={{ color: "#cbd5e1", marginTop: "10px", maxWidth: "680px" }}>
                          Register and manage operational needs linked to this incident.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={openAddNeed}
                        style={{
                          minWidth: "150px",
                          padding: "12px 18px",
                          borderRadius: "999px",
                          border: "1px solid #203b50",
                          background: "#12364b",
                          color: "#4fd1c5",
                          cursor: "pointer",
                          fontWeight: 700,
                        }}
                      >
                        + Add Need
                      </button>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "16px",
                      }}
                    >
                      {[
                        ["Total Needs", String(totalNeeds)],
                        ["Critical", String(criticalCount)],
                        ["Assigned", String(assignedCount)],
                        ["Fulfilled", String(fulfilledCount)],
                      ].map(([label, value]) => (
                        <div key={label} style={cardStyle}>
                          <div style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "12px" }}>{label}</div>
                          <div style={{ fontSize: "32px", fontWeight: 700, color: "#f8fafc" }}>{value}</div>
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        padding: "18px",
                        borderRadius: "16px",
                        border: "1px solid #203b50",
                        background: "#091d2c",
                        overflowX: "auto",
                      }}
                    >
                      <div style={{ width: "100%", minWidth: "900px" }}>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "180px 140px minmax(0, 1fr) 120px 120px 120px 220px",
                            gap: "12px",
                            padding: "12px 0",
                            borderBottom: "1px solid #203b50",
                            color: "#94a3b8",
                            fontSize: "12px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                          }}
                        >
                          <div>Need ID</div>
                          <div>Category</div>
                          <div>Description</div>
                          <div>Quantity</div>
                          <div>Priority</div>
                          <div>Status</div>
                          <div>Assigned Organization</div>
                        </div>
                        {needs.map((row: any) => (
                          <div
                            key={row.id}
                            style={{
                              display: "grid",
                              gridTemplateColumns: "180px 140px minmax(0, 1fr) 120px 120px 120px 220px",
                              gap: "12px",
                              padding: "16px 0",
                              borderBottom: "1px solid #203b50",
                              color: "#cbd5e1",
                              fontSize: "13px",
                              alignItems: "center",
                            }}
                          >
                            <div>{row.id}</div>
                            <div>{row.category}</div>
                            <div>{row.description}</div>
                            <div>
                              {row.quantity} {row.unit}
                            </div>
                            <div>
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: "6px 10px",
                                  borderRadius: "999px",
                                  fontSize: "12px",
                                  fontWeight: 700,
                                  ...priorityStyle(row.priority),
                                }}
                              >
                                {row.priority}
                              </span>
                            </div>
                            <div>
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: "6px 10px",
                                  borderRadius: "999px",
                                  fontSize: "12px",
                                  fontWeight: 700,
                                  ...statusStyle(row.status),
                                }}
                              >
                                {row.status}
                              </span>
                            </div>
                            <div>{row.assigned}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : activeTab === "Resources" ? (
                  <div style={{ display: "grid", gap: "16px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
                        {[
                          ["Available Resources", String(totalAvailableQty)],
                          ["Reserved", String(totalReservedQty)],
                          ["In Transit", String(totalInTransitQty)],
                          ["Delivered", String(totalDeliveredQty)],
                          ["Unavailable", String(unavailableCount)],
                        ].map(([label, value]) => (
                          <div key={label} style={cardStyle}>
                            <div style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "8px" }}>{label}</div>
                            <div style={{ fontSize: "28px", fontWeight: 800, color: "#f8fafc" }}>{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 70/30 layout */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "16px" }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <div>
                            <div style={headerLabelStyle}>{approvedCount > 0 ? "Incident Resource Assignments" : "AI Recommended Resources"}</div>
                            <div style={{ color: "#cbd5e1", marginTop: "6px" }}>{approvedCount > 0 ? "Approved resources reserved for this incident and ready for operational deployment." : "Best available options based on distance, availability, ETA, and operational suitability."}</div>
                          </div>
                        </div>

                        {approvedCount > 0 ? (
                          <div style={{ marginTop: "8px", padding: "10px 12px", borderRadius: "8px", background: "#052e2a", border: "1px solid #0f766e", color: "#86efac", fontWeight: 700 }}>Resource allocations approved by the operator and reserved for this incident.</div>
                        ) : resourceAlert ? (
                          <div style={{ marginTop: "8px", padding: "10px 12px", borderRadius: "8px", background: "#052e2a", border: "1px solid #0f766e", color: "#86efac", fontWeight: 700 }}>{resourceAlert}</div>
                        ) : (
                          <div style={{ marginTop: "8px", color: "#f97316", fontWeight: 700 }}>No resource has been allocated. Operator approval is required.</div>
                        )}

                        <div style={{ marginTop: "12px", display: "grid", gap: "10px" }}>
                          {recommendedResources.map((rec: any, idx: number) => {
                            const availableLabel = rec.quantityAvailable ?? getResourceAvailableQty(rec) ?? rec.quantity ?? rec.available ?? "—";
                            const approved = rec.availability === "Reserved" || (rec.operatorDecision && String(rec.operatorDecision).toLowerCase().includes("approved"));
                            const rejected = rec.operatorDecision === "Rejected" || rec.status === "Rejected";
                            const badge = approved ? "ALLOCATION APPROVED" : rejected ? "RECOMMENDATION REJECTED" : idx === 0 ? "BEST MATCH" : undefined;
                            const workflowOrder = ["Reserved", "Dispatch Ordered", "Ready for Loading", "Loaded", "In Transit", "Arrived", "Delivered", "Verified"];
                            const currentWorkflow = rec.availability ?? rec.status ?? "";
                            const currentIndex = workflowOrder.indexOf(currentWorkflow);
                            const deploymentStages = workflowOrder.map((label, i) => [
                              label,
                              currentIndex === i ? "current" : currentIndex > i ? "completed" : "pending",
                            ] as const);
                            const workflowStage = currentIndex >= 0 ? currentWorkflow : "Pending";
                            return (
                              <div key={rec.id ?? idx} onClick={() => setSelectedResource(rec)} style={{ padding: "14px", borderRadius: "12px", background: idx === 0 ? "linear-gradient(180deg,#07232b,#0b2b2a)" : "#091d2c", border: approved ? "1px solid #10b981" : idx === 0 ? "1px solid #2dd4bf" : "1px solid #203b50", display: "grid", gap: "12px", cursor: "pointer" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
                                  <div style={{ minWidth: 0 }}>
                                    <div style={{ fontWeight: 800, color: "#f8fafc", fontSize: "16px" }}>{rec.name}</div>
                                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", color: "#94a3b8", fontSize: "12px", marginTop: "4px" }}>
                                      <div>ID: {rec.id ?? "—"}</div>
                                      <div>Organization: {rec.organization ?? "—"}</div>
                                    </div>
                                  </div>
                                  {badge ? <div style={{ fontSize: "11px", color: approved ? "#042f2e" : "#071827", background: approved ? "#86efac" : rejected ? "#fef3c7" : "#c7d2fe", padding: "6px 10px", borderRadius: "999px", fontWeight: 800 }}>{badge}</div> : null}
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                                  <div style={{ display: "grid", gap: "8px", padding: "12px", borderRadius: "12px", background: "#071827", border: "1px solid #203b50" }}>
                                    <div style={{ color: "#94a3b8", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px" }}>Resource</div>
                                    <div style={{ color: "#cbd5e1", fontSize: "13px" }}>Category</div>
                                    <div style={{ color: "#f8fafc", fontWeight: 700 }}>{rec.category ?? "—"}</div>
                                    <div style={{ color: "#cbd5e1", fontSize: "13px" }}>Approved quantity</div>
                                    <div style={{ color: "#f8fafc", fontWeight: 700 }}>{rec.finalApprovedQuantity ?? rec.proposedQuantity ?? rec.reservedQty ?? rec.quantity ?? "—"}</div>
                                  </div>

                                  <div style={{ display: "grid", gap: "8px", padding: "12px", borderRadius: "12px", background: "#071827", border: "1px solid #203b50" }}>
                                    <div style={{ color: "#94a3b8", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px" }}>Operation</div>
                                    <div style={{ color: "#cbd5e1", fontSize: "13px" }}>Source</div>
                                    <div style={{ color: "#f8fafc", fontWeight: 700 }}>{rec.sourceType ?? "—"}</div>
                                    <div style={{ color: "#cbd5e1", fontSize: "13px" }}>Destination</div>
                                    <div style={{ color: "#f8fafc", fontWeight: 700 }}>{location}</div>
                                    <div style={{ display: "grid", gap: "4px", color: "#94a3b8", fontSize: "13px" }}>
                                      <div>Distance</div>
                                      <div style={{ color: "#f8fafc", fontWeight: 700 }}>{rec.distanceKm ?? rec.distance ?? "—"} km</div>
                                    </div>
                                    <div style={{ display: "grid", gap: "4px", color: "#94a3b8", fontSize: "13px" }}>
                                      <div>ETA</div>
                                      <div style={{ color: "#f8fafc", fontWeight: 700 }}>{rec.etaHours ? `${rec.etaHours}h` : rec.eta ?? "—"}</div>
                                    </div>
                                  </div>

                                  <div style={{ display: "grid", gap: "8px", padding: "12px", borderRadius: "12px", background: "#071827", border: "1px solid #203b50" }}>
                                    <div style={{ color: "#94a3b8", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px" }}>Status</div>
                                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "6px 10px", borderRadius: "999px", background: "#0f172a", color: "#cbd5e1", fontSize: "11px", fontWeight: 700, width: "fit-content" }}>{workflowStage}</div>
                                    <div style={{ color: "#cbd5e1", fontSize: "13px" }}>Current operational status</div>
                                    <div style={{ color: "#f8fafc", fontWeight: 700 }}>{rec.availability ?? rec.status ?? "—"}</div>
                                    <div style={{ color: "#cbd5e1", fontSize: "13px" }}>Approved by</div>
                                    <div style={{ color: "#f8fafc", fontWeight: 700 }}>{rec.confirmedBy ?? "—"}</div>
                                    <div style={{ color: "#cbd5e1", fontSize: "13px" }}>Approved at</div>
                                    <div style={{ color: "#f8fafc", fontWeight: 700 }}>{rec.confirmedAt ? new Date(rec.confirmedAt).toLocaleString() : "—"}</div>
                                  </div>
                                </div>

                                <div style={{ display: "grid", gap: "10px", padding: "12px", borderRadius: "12px", background: "#071827", border: "1px solid #203b50" }}>
                                  <div style={{ color: "#94a3b8", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px" }}>Deployment progress</div>
                                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                    {deploymentStages.map(([label, state], i) => (
                                      <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <div style={{ width: 18, height: 18, borderRadius: 999, display: "grid", placeItems: "center", background: state === "completed" ? "#2dd4bf" : state === "current" ? "#60a5fa" : "#475569", color: "#071827", fontSize: 10, fontWeight: 800 }}>{state === "completed" ? "✓" : i + 1}</div>
                                        <div style={{ color: state === "completed" || state === "current" ? "#f8fafc" : "#94a3b8", fontSize: "11px" }}>{label}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                                  {approved ? (
                                    rec.availability === "Dispatch Ordered" || rec.dispatchOrderId ? (
                                      <button disabled style={{ padding: "8px 12px", borderRadius: "8px", background: "#3f3f46", border: "1px solid #374151", color: "#86efac", cursor: "default", fontWeight: 700 }}>Dispatch Order Created</button>
                                    ) : (
                                      <button onClick={(e) => { e.stopPropagation(); openDispatchModal(rec); }} style={{ padding: "8px 12px", borderRadius: "8px", background: "#0b5e4a", border: "1px solid #064e3b", color: "#86efac", cursor: "pointer", fontWeight: 700 }}>Create Dispatch Order</button>
                                    )
                                  ) : rejected ? (
                                    <button disabled style={{ padding: "8px 12px", borderRadius: "8px", background: "#3f3f46", border: "1px solid #374151", color: "#f97316", cursor: "default", fontWeight: 700 }}>Recommendation Rejected</button>
                                  ) : (
                                    <button onClick={(e) => { e.stopPropagation(); openReviewModal(rec); }} style={{ padding: "8px 12px", borderRadius: "8px", background: "#12364b", border: "1px solid #203b50", color: "#4fd1c5", cursor: "pointer", fontWeight: 700 }}>Review Allocation</button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <div style={cardStyle}>
                          <div style={headerLabelStyle}>AI Decision Support</div>
                          <div style={{ marginTop: "8px", display: "grid", gap: "10px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8" }}>
                              <div>Assessment confidence</div>
                              <div style={{ fontWeight: 800, color: "#f8fafc" }}>{aiAssessmentConfidence}%</div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8" }}>
                              <div>Operational impact</div>
                              <div style={{ fontWeight: 800, color: "#f8fafc" }}>{aiOperationalImpact}</div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8" }}>
                              <div>Estimated arrival</div>
                              <div style={{ fontWeight: 800, color: "#f8fafc" }}>{aiEstimatedArrival}</div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8" }}>
                              <div>Expected savings</div>
                              <div style={{ fontWeight: 800, color: "#f8fafc" }}>{aiExpectedSavings}</div>
                            </div>
                            <div style={{ color: "#cbd5e1" }}><strong>Recommended action:</strong> {aiRecommendedAction}</div>
                            <div style={{ color: "#cbd5e1" }}>{aiDecisionSummary}</div>
                            <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: "12px" }}>Decision generated by HumanOS AI. Execution requires operator approval.</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Inventory and map */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={headerLabelStyle}>Resource Inventory</div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <input
                            value={resourceSearch}
                            onChange={(e) => setResourceSearch(e.target.value)}
                            placeholder="Search resources"
                            style={{ padding: "8px", borderRadius: "8px", border: "1px solid #203b50", background: "#071827", color: "#f8fafc", minWidth: "200px" }}
                          />
                          <select
                            value={resourceFilters.category}
                            onChange={(e) => setResourceFilters((prev) => ({ ...prev, category: e.target.value }))}
                            style={{ padding: "8px", borderRadius: "8px", border: "1px solid #203b50", background: "#071827", color: "#f8fafc" }}
                          >
                            <option value="">Category</option>
                            <option value="Water">Water</option>
                            <option value="Food">Food</option>
                            <option value="Medical">Medical</option>
                            <option value="Shelter">Shelter</option>
                            <option value="Transport">Transport</option>
                          </select>
                          <select
                            value={resourceFilters.organization}
                            onChange={(e) => setResourceFilters((prev) => ({ ...prev, organization: e.target.value }))}
                            style={{ padding: "8px", borderRadius: "8px", border: "1px solid #203b50", background: "#071827", color: "#f8fafc" }}
                          >
                            <option value="">Organization</option>
                            <option value="Regional Relief Network">Regional Relief Network</option>
                            <option value="FoodAid Intl">FoodAid Intl</option>
                            <option value="Health Partners">Health Partners</option>
                            <option value="ShelterOrg">ShelterOrg</option>
                            <option value="HumanOS Logistics">HumanOS Logistics</option>
                          </select>
                          <select
                            value={resourceFilters.region}
                            onChange={(e) => setResourceFilters((prev) => ({ ...prev, region: e.target.value }))}
                            style={{ padding: "8px", borderRadius: "8px", border: "1px solid #203b50", background: "#071827", color: "#f8fafc" }}
                          >
                            <option value="">Region</option>
                            <option value="Coastal Zone">Coastal Zone</option>
                            <option value="Central">Central</option>
                            <option value="North">North</option>
                          </select>
                          <select
                            value={resourceFilters.availability}
                            onChange={(e) => setResourceFilters((prev) => ({ ...prev, availability: e.target.value }))}
                            style={{ padding: "8px", borderRadius: "8px", border: "1px solid #203b50", background: "#071827", color: "#f8fafc" }}
                          >
                            <option value="">Availability</option>
                            <option value="Available">Available</option>
                            <option value="Reserved">Reserved</option>
                            <option value="Dispatch Ordered">Dispatch Ordered</option>
                            <option value="In Transit">In Transit</option>
                            <option value="Unavailable">Unavailable</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ marginTop: "12px", overflowX: "auto" }}>
                        <div style={{ width: "100%", minWidth: "950px" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr", gap: "12px", padding: "12px 0", borderBottom: "1px solid #203b50", color: "#94a3b8", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>
                            <div>Resource</div>
                            <div>Category</div>
                            <div>Source Type</div>
                            <div>Total Qty</div>
                            <div>Available</div>
                            <div>Reserved</div>
                            <div>Status</div>
                            <div>Location</div>
                            <div>Organization</div>
                          </div>

                          {filteredResources.map((r: any, i: number) => {
                            const availableCount = getResourceAvailableQty(r);
                            const reservedCount = getResourceReservedQty(r);
                            const status = r.availability ?? r.status ?? "Unknown";
                            const statusColor = status === "Available" ? "#2dd4bf" : status === "Reserved" ? "#60a5fa" : status === "Dispatch Ordered" ? "#38bdf8" : status === "In Transit" ? "#fbbf24" : status === "Critical" ? "#ef4444" : status === "Unavailable" ? "#fb7185" : "#64748b";
                            return (
                              <div key={r.id ?? i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr", gap: "12px", padding: "12px 0", borderBottom: "1px solid #203b50", color: "#cbd5e1", fontSize: "13px", alignItems: "center" }}>
                                <div style={{ display: "grid", gap: "4px" }}>
                                  <div style={{ fontWeight: 700, color: "#f8fafc" }}>{r.name}</div>
                                  <div style={{ color: "#94a3b8", fontSize: "12px" }}>{r.id ?? "—"}</div>
                                </div>
                                <div>{r.category}</div>
                                <div>{r.sourceType ?? "—"}</div>
                                <div>{r.quantity ?? "—"}</div>
                                <div>{availableCount}</div>
                                <div>{reservedCount}</div>
                                <div><span style={{ padding: "6px 10px", borderRadius: "999px", background: "#0f172a", color: statusColor, fontWeight: 800 }}>{status}</span></div>
                                <div>{r.region ?? r.location ?? "—"}</div>
                                <div>{r.organization ?? "—"}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Resource Map */}
                    <div style={cardStyle}>
                      <div style={headerLabelStyle}>Resource Map</div>
                      <div style={{ marginTop: "10px", display: "grid", gridTemplateColumns: "1fr 260px", gap: "12px" }}>
                        <div style={{ height: "300px", borderRadius: "8px", background: "linear-gradient(180deg,#071827,#0b2031)", border: "1px dashed #203b50", display: "grid", gap: "8px", padding: "12px", color: "#94a3b8" }}>
                          <div style={{ fontWeight: 700, color: "#f8fafc" }}>Map placeholder</div>
                          <div style={{ display: "grid", gap: "6px" }}>
                            {["Miami Warehouse","UNICEF Warehouse","Red Cross Depot","Coastal Operations Base","Regional Medical Depot"].map((m) => (
                              <div key={m} style={{ padding: "8px", borderRadius: "8px", background: "#071827", border: "1px solid #203b50", color: "#cbd5e1" }}>{m}</div>
                            ))}
                          </div>
                        </div>
                        <div style={{ padding: "12px", borderRadius: "8px", background: "#071827", border: "1px solid #203b50", color: "#cbd5e1" }}>
                          <div style={{ fontWeight: 700 }}>Legend</div>
                          <div style={{ marginTop: "8px", display: "grid", gap: "6px" }}>
                            {['Warehouse','Vehicle','Hospital','Shelter','Airport','Port'].map(l => (
                              <div key={l} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#2dd4bf" }} />
                                <div>{l}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Deployment timeline, utilization, readiness, and detail panel */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "16px" }}>
                      <div style={{ display: "grid", gap: "12px" }}>
                        <div style={cardStyle}>
                          <div style={headerLabelStyle}>Resource Deployment Timeline</div>
                          <div style={{ marginTop: "10px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                            {[
                              ["Reserved", "completed"],
                              ["Assigned", "completed"],
                              ["Loaded", "current"],
                              ["In Transit", "pending"],
                              ["Delivered", "pending"],
                              ["Verified", "pending"],
                            ].map(([label, state], i) => (
                              <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 100 }}>
                                <div style={{ width: 56, height: 56, borderRadius: "999px", display: "grid", placeItems: "center", background: state === "completed" ? "#2dd4bf" : state === "current" ? "#60a5fa" : "#475569", color: "#071827", fontWeight: 800 }}>{i+1}</div>
                                <div style={{ marginTop: "8px", color: state === "completed" ? "#cbd5e1" : state === "current" ? "#cbd5e1" : "#64748b" }}>{label}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div style={cardStyle}>
                          <div style={headerLabelStyle}>Resource Utilization</div>
                          <div style={{ marginTop: "10px", display: "grid", gap: "10px" }}>
                            {[
                              ["Medical", 91],
                              ["Water", 68],
                              ["Food", 42],
                              ["Shelter", 60],
                              ["Transport", 78],
                            ].map(([label, pct]) => (
                              <div key={label}>
                                <div style={{ display: "flex", justifyContent: "space-between", color: "#cbd5e1" }}>
                                  <div>{label}</div>
                                  <div style={{ fontWeight: 800 }}>{pct}%</div>
                                </div>
                                <div style={{ marginTop: "6px", height: "8px", borderRadius: "999px", background: "#07232b", overflow: "hidden" }}>
                                  <div style={{ width: `${pct}%`, height: "100%", background: "#2dd4bf" }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div style={cardStyle}>
                          <div style={headerLabelStyle}>Overall Resource Readiness</div>
                          <div style={{ marginTop: "10px", color: "#cbd5e1" }}>
                            <div style={{ fontWeight: 800, fontSize: "22px", color: "#f8fafc" }}>Readiness Score: 82%</div>
                            <div style={{ marginTop: "8px" }}>Expected Shortage: Medical Supplies</div>
                            <div>Estimated Shortage Window: 18 hours</div>
                            <div style={{ marginTop: "8px", fontWeight: 700 }}>Recommended Action: Begin immediate medical procurement and reallocation.</div>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "grid", gap: "12px" }}>
                        <div style={cardStyle}>
                          <div style={headerLabelStyle}>Resource Workspace</div>
                          <div style={{ marginTop: "8px", color: "#cbd5e1" }}>Select a recommended resource to view details and quick actions.</div>
                          {selectedResource ? (
                            <div style={{ marginTop: "12px", padding: "12px", borderRadius: "8px", background: "#071827", border: "1px solid #203b50" }}>
                              <div style={{ fontWeight: 800, color: "#f8fafc" }}>{selectedResource.name}</div>
                              <div style={{ color: "#94a3b8", marginTop: "6px" }}>{selectedResource.category} • {selectedResource.sourceType ?? "Source type unknown"}</div>
                              <div style={{ display: "grid", gap: "8px", marginTop: "14px", color: "#cbd5e1" }}>
                                <div>Available: <strong style={{ color: "#f8fafc" }}>{selectedResource.available ?? selectedResource.quantityAvailable ?? selectedResource.quantity ?? "—"}</strong></div>
                                <div>Reserved: <strong style={{ color: "#f8fafc" }}>{selectedResource.reservedQty ?? selectedResource.reserved ?? selectedResource.finalApprovedQuantity ?? "—"}</strong></div>
                                <div>Location: <strong style={{ color: "#f8fafc" }}>{selectedResource.location ?? selectedResource.region ?? "—"}</strong></div>
                                <div>Organization: <strong style={{ color: "#f8fafc" }}>{selectedResource.organization ?? "—"}</strong></div>
                                <div>ETA: <strong style={{ color: "#f8fafc" }}>{selectedResource.etaHours ? `${selectedResource.etaHours}h` : selectedResource.eta ?? "—"}</strong></div>
                                <div>Suitability: <strong style={{ color: "#f8fafc" }}>{selectedResource.suitability ?? selectedResource.aiSuitability ?? "—"}%</strong></div>
                                <div>Status: <strong style={{ color: "#f8fafc" }}>{selectedResource.availability ?? selectedResource.status ?? "—"}</strong></div>
                              </div>

                              {selectedResource.finalApprovedQuantity ? (
                                <div style={{ marginTop: "12px", padding: "12px", borderRadius: "10px", background: "#0a1f2f", border: "1px solid #203b50", color: "#cbd5e1" }}>
                                  <div style={{ fontWeight: 700, color: "#f8fafc" }}>Approval details</div>
                                  <div style={{ marginTop: "10px", display: "grid", gap: "8px" }}>
                                    <div>Approved Quantity: <strong>{selectedResource.finalApprovedQuantity}</strong></div>
                                    <div>Approved By: <strong>{selectedResource.confirmedBy ?? "—"}</strong></div>
                                    <div>Approved At: <strong>{selectedResource.confirmedAt ? new Date(selectedResource.confirmedAt).toLocaleString() : "—"}</strong></div>
                                  </div>
                                </div>
                              ) : null}

                              {selectedResource.availability === "Dispatch Ordered" ? (
                                <div style={{ marginTop: "12px", padding: "12px", borderRadius: "10px", background: "#0a1f2f", border: "1px solid #203b50", color: "#cbd5e1" }}>
                                  <div style={{ fontWeight: 700, color: "#f8fafc" }}>Dispatch order details</div>
                                  <div style={{ marginTop: "10px", display: "grid", gap: "8px" }}>
                                    <div>Dispatch ID: <strong>{selectedResource.dispatchOrderId ?? selectedResource.dispatchOrder?.id}</strong></div>
                                    <div>Vehicle: <strong>{selectedResource.dispatchVehicleType ?? "—"} / {selectedResource.dispatchVehicleId ?? "—"}</strong></div>
                                    <div>Driver: <strong>{selectedResource.dispatchDriver ?? "—"}</strong></div>
                                    <div>Departure: <strong>{selectedResource.dispatchDepartureDate ?? "—"} {selectedResource.dispatchDepartureTime ?? ""}</strong></div>
                                    <div>Expected Arrival: <strong>{selectedResource.dispatchArrivalDate ?? "—"} {selectedResource.dispatchArrivalTime ?? ""}</strong></div>
                                    <div>GPS Tracking: <strong>{selectedResource.dispatchGpsTracking ?? selectedResource.gpsTracking ?? "—"}</strong></div>
                                    <div>Approved By: <strong>{selectedResource.dispatchConfirmedBy ?? selectedResource.confirmedBy ?? "—"}</strong></div>
                                    <div>Approved At: <strong>{selectedResource.dispatchConfirmedAt ? new Date(selectedResource.dispatchConfirmedAt).toLocaleString() : selectedResource.confirmedAt ? new Date(selectedResource.confirmedAt).toLocaleString() : "—"}</strong></div>
                                  </div>
                                </div>
                              ) : null}

                              <div style={{ display: "flex", gap: "8px", marginTop: "14px", flexWrap: "wrap" }}>
                                <button disabled style={{ padding: "8px 12px", borderRadius: "8px", background: "transparent", border: "1px solid #203b50", color: "#94a3b8" }}>View inventory</button>
                                {selectedResource.availability === "Reserved" ? (
                                  <button onClick={() => openDispatchModal(selectedResource)} style={{ padding: "8px 12px", borderRadius: "8px", background: "#0b5e4a", border: "1px solid #064e3b", color: "#86efac", cursor: "pointer", fontWeight: 700 }}>Create dispatch order</button>
                                ) : ["Dispatch Ordered", "Ready for Loading", "Loaded", "In Transit", "Arrived", "Delivered", "Verified"].includes(selectedResource.availability) ? (
                                  <button disabled style={{ padding: "8px 12px", borderRadius: "8px", background: "#3f3f46", border: "1px solid #374151", color: "#86efac", cursor: "default", fontWeight: 700 }}>Dispatch order created</button>
                                ) : (
                                  <button onClick={() => { if (selectedResource.id) allocateResource(selectedResource.id); }} style={{ padding: "8px 12px", borderRadius: "8px", background: "#12364b", border: "1px solid #203b50", color: "#4fd1c5" }}>Reserve resource</button>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div style={{ marginTop: "12px", color: "#94a3b8" }}>Select a resource to inspect its details and current operational state.</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : activeTab === "Organizations" ? (
                  <div
                    style={{
                      display: "grid",
                      gap: "18px",
                    }}
                  >
                    <div
                      style={{
                        padding: "20px",
                        borderRadius: "16px",
                        border: "1px solid #203b50",
                        background: "#0d2639",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        gap: "18px",
                        alignItems: "start",
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div style={headerLabelStyle}>Incident Organizations</div>
                        <h2 style={{ color: "#f8fafc", fontSize: "24px", margin: "10px 0 0" }}>
                          Incident Organizations
                        </h2>
                        <p style={{ color: "#cbd5e1", marginTop: "10px", maxWidth: "720px" }}>
                          Recommend, assign and coordinate organizations participating in this incident.
                        </p>
                      </div>
                      <button
                        type="button"
                        style={{
                          minWidth: "170px",
                          padding: "12px 18px",
                          borderRadius: "999px",
                          border: "1px solid #203b50",
                          background: "#12364b",
                          color: "#4fd1c5",
                          cursor: "pointer",
                          fontWeight: 700,
                        }}
                      >
                        + Add Organization
                      </button>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "16px",
                      }}
                    >
                      {[
                        ["Recommended Organizations", String(recommendedOrganizationsCount)],
                        ["Pending Approval", String(pendingApprovalCount)],
                        ["Awaiting Acceptance", String(awaitingAcceptanceCount)],
                        ["Active Organizations", String(activeOrganizations.length)],
                        ["Rejected / Unavailable", String(rejectedUnavailableCount)],
                      ].map(([label, value]) => (
                        <div key={label} style={cardStyle}>
                          <div style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "12px" }}>{label}</div>
                          <div style={{ fontSize: "32px", fontWeight: 700, color: "#f8fafc" }}>{value}</div>
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        padding: "14px 16px",
                        borderRadius: "14px",
                        border: "1px solid #1d4ed8",
                        background: "#0a2440",
                        color: "#bfdbfe",
                        fontSize: "14px",
                        lineHeight: 1.7,
                      }}
                    >
                      Organizations below are AI recommendations only.
                      <br />
                      Operator approval is required before an assignment request is sent.
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: "16px" }}>
                      <div style={{ display: "grid", gap: "14px" }}>
                        {organizations.map((organization) => {
                          const awaitingAcceptance = organization.status === "Awaiting Acceptance";
                          const isActive = organization.status === "Active";
                          const isRejected = organization.status === "Rejected";
                          const statusBadgeLabel = awaitingAcceptance
                            ? "ASSIGNMENT REQUEST SENT"
                            : isActive
                            ? "ORGANIZATION ACTIVE"
                            : isRejected
                            ? "ASSIGNMENT REJECTED"
                            : "NOT APPROVED";
                          const statusBadgeStyle = awaitingAcceptance
                            ? { background: "#0f3b56", color: "#7dd3fc" }
                            : isActive
                            ? { background: "#052e2a", color: "#86efac" }
                            : isRejected
                            ? { background: "#3f1d1d", color: "#fca5a5" }
                            : { background: "#172554", color: "#c7d2fe" };

                          return (
                            <div
                              key={organization.id}
                              style={{
                                padding: "18px",
                                borderRadius: "16px",
                                border: isActive ? "1px solid #0f766e" : awaitingAcceptance ? "1px solid #1d4ed8" : "1px solid #203b50",
                                background: "#091d2c",
                                display: "grid",
                                gap: "16px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  gap: "12px",
                                  alignItems: "start",
                                  flexWrap: "wrap",
                                }}
                              >
                                <div style={{ minWidth: 0 }}>
                                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                                    <div style={{ fontSize: "20px", fontWeight: 700, color: "#f8fafc" }}>{organization.name}</div>
                                    <span
                                      style={{
                                        padding: "6px 10px",
                                        borderRadius: "999px",
                                        background: "#12364b",
                                        color: "#4fd1c5",
                                        fontSize: "11px",
                                        fontWeight: 800,
                                      }}
                                    >
                                      AI RECOMMENDATION
                                    </span>
                                    <span
                                      style={{
                                        padding: "6px 10px",
                                        borderRadius: "999px",
                                        fontSize: "11px",
                                        fontWeight: 800,
                                        ...statusBadgeStyle,
                                      }}
                                    >
                                      {statusBadgeLabel}
                                    </span>
                                  </div>
                                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", color: "#94a3b8", fontSize: "12px", marginTop: "8px" }}>
                                    <div>ID: {organization.id}</div>
                                    <div>Type: {organization.type}</div>
                                    <div>Distance: {organization.distanceKm} km</div>
                                    <div>Status: {organization.status}</div>
                                  </div>
                                </div>
                              </div>

                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                                  gap: "14px",
                                }}
                              >
                                <div style={{ padding: "14px", borderRadius: "12px", background: "#071827", border: "1px solid #203b50", display: "grid", gap: "8px" }}>
                                  <div style={headerLabelStyle}>Organization</div>
                                  <div style={{ color: "#cbd5e1", fontSize: "13px" }}>Name</div>
                                  <div style={{ color: "#f8fafc", fontWeight: 700 }}>{organization.name}</div>
                                  <div style={{ color: "#cbd5e1", fontSize: "13px" }}>Type</div>
                                  <div style={{ color: "#f8fafc", fontWeight: 700 }}>{organization.type}</div>
                                  <div style={{ color: "#cbd5e1", fontSize: "13px" }}>Specialties</div>
                                  <div style={{ color: "#f8fafc", fontWeight: 700 }}>{organization.specialties.join(", ")}</div>
                                  <div style={{ color: "#cbd5e1", fontSize: "13px" }}>Coverage</div>
                                  <div style={{ color: "#f8fafc", fontWeight: 700 }}>{organization.coverage}</div>
                                </div>

                                <div style={{ padding: "14px", borderRadius: "12px", background: "#071827", border: "1px solid #203b50", display: "grid", gap: "8px" }}>
                                  <div style={headerLabelStyle}>Operational Capacity</div>
                                  <div style={{ color: "#cbd5e1", fontSize: "13px" }}>Availability</div>
                                  <div style={{ color: "#f8fafc", fontWeight: 700 }}>{organization.availability}</div>
                                  <div style={{ color: "#cbd5e1", fontSize: "13px" }}>Response Capacity</div>
                                  <div style={{ color: "#f8fafc", fontWeight: 700 }}>{organization.responseCapacity}</div>
                                  <div style={{ color: "#cbd5e1", fontSize: "13px" }}>Operational Capacity</div>
                                  <div style={{ color: "#f8fafc", fontWeight: 700 }}>{organization.operationalCapacity}</div>
                                  <div style={{ color: "#cbd5e1", fontSize: "13px" }}>Estimated Mobilization</div>
                                  <div style={{ color: "#f8fafc", fontWeight: 700 }}>{organization.estimatedMobilization}</div>
                                </div>

                                <div style={{ padding: "14px", borderRadius: "12px", background: "#071827", border: "1px solid #203b50", display: "grid", gap: "8px" }}>
                                  <div style={headerLabelStyle}>Coordination</div>
                                  <div style={{ color: "#cbd5e1", fontSize: "13px" }}>Related Assignment</div>
                                  <div style={{ color: "#f8fafc", fontWeight: 700 }}>
                                    {organization.relatedAssignment}
                                    {organization.relatedAssignmentDetail ? ` - ${organization.relatedAssignmentDetail}` : ""}
                                  </div>
                                  <div style={{ color: "#cbd5e1", fontSize: "13px" }}>Primary Contact</div>
                                  <div style={{ color: "#f8fafc", fontWeight: 700 }}>{organization.primaryContact}</div>
                                  <div style={{ color: "#cbd5e1", fontSize: "13px" }}>Role</div>
                                  <div style={{ color: "#f8fafc", fontWeight: 700 }}>{organization.contactRole}</div>
                                  <div style={{ color: "#cbd5e1", fontSize: "13px" }}>Phone</div>
                                  <div style={{ color: "#f8fafc", fontWeight: 700 }}>{organization.phone}</div>
                                  <div style={{ color: "#cbd5e1", fontSize: "13px" }}>Email</div>
                                  <div style={{ color: "#f8fafc", fontWeight: 700 }}>{organization.email}</div>
                                </div>

                                <div style={{ padding: "14px", borderRadius: "12px", background: "#071827", border: "1px solid #203b50", display: "grid", gap: "8px" }}>
                                  <div style={headerLabelStyle}>AI Assessment</div>
                                  <div style={{ color: "#cbd5e1", fontSize: "13px" }}>Compatibility Score</div>
                                  <div style={{ color: "#f8fafc", fontWeight: 700 }}>{organization.compatibilityScore}%</div>
                                  <div style={{ color: "#cbd5e1", fontSize: "13px" }}>Short recommendation explanation</div>
                                  <div style={{ color: "#cbd5e1", lineHeight: 1.7 }}>{organization.recommendationExplanation}</div>
                                  {organization.assignmentRequestedBy ? (
                                    <>
                                      <div style={{ color: "#cbd5e1", fontSize: "13px" }}>Operator</div>
                                      <div style={{ color: "#f8fafc", fontWeight: 700 }}>{organization.assignmentRequestedBy}</div>
                                      <div style={{ color: "#cbd5e1", fontSize: "13px" }}>Date / Time</div>
                                      <div style={{ color: "#f8fafc", fontWeight: 700 }}>{formatDateTime(organization.assignmentRequestedAt)}</div>
                                    </>
                                  ) : null}
                                  {organization.acceptedBy ? (
                                    <>
                                      <div style={{ color: "#cbd5e1", fontSize: "13px" }}>Accepted By</div>
                                      <div style={{ color: "#f8fafc", fontWeight: 700 }}>{organization.acceptedBy}</div>
                                      <div style={{ color: "#cbd5e1", fontSize: "13px" }}>Accepted At</div>
                                      <div style={{ color: "#f8fafc", fontWeight: 700 }}>{formatDateTime(organization.acceptedAt)}</div>
                                    </>
                                  ) : null}
                                  {organization.rejectionReason || organization.organizationResponseReason ? (
                                    <>
                                      <div style={{ color: "#cbd5e1", fontSize: "13px" }}>Rejection Reason</div>
                                      <div style={{ color: "#f8fafc", fontWeight: 700 }}>
                                        {organization.organizationResponseReason ?? organization.rejectionReason}
                                      </div>
                                    </>
                                  ) : null}
                                </div>
                              </div>

                              {(organization.requestedOperationalRole || organization.requestedAssignmentScope || organization.coordinationLead) ? (
                                <div style={{ padding: "14px", borderRadius: "12px", background: "#071827", border: "1px solid #203b50", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
                                  <div>
                                    <div style={{ color: "#94a3b8", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.4px" }}>Operational Role</div>
                                    <div style={{ marginTop: "6px", color: "#f8fafc", fontWeight: 700 }}>{organization.requestedOperationalRole ?? "—"}</div>
                                  </div>
                                  <div>
                                    <div style={{ color: "#94a3b8", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.4px" }}>Assignment Scope</div>
                                    <div style={{ marginTop: "6px", color: "#f8fafc", fontWeight: 700 }}>{organization.requestedAssignmentScope ?? "—"}</div>
                                  </div>
                                  <div>
                                    <div style={{ color: "#94a3b8", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.4px" }}>Coordination Lead</div>
                                    <div style={{ marginTop: "6px", color: "#f8fafc", fontWeight: 700 }}>{organization.coordinationLead ?? "—"}</div>
                                  </div>
                                  <div>
                                    <div style={{ color: "#94a3b8", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.4px" }}>Requested Start</div>
                                    <div style={{ marginTop: "6px", color: "#f8fafc", fontWeight: 700 }}>
                                      {organization.requestedStartDate ?? "—"} {organization.requestedStartTime ?? ""}
                                    </div>
                                  </div>
                                </div>
                              ) : null}

                              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                                {organization.status === "Recommended" ? (
                                  <button
                                    type="button"
                                    onClick={() => openOrganizationReviewModal(organization)}
                                    style={{
                                      padding: "10px 16px",
                                      borderRadius: "999px",
                                      background: "#12364b",
                                      border: "1px solid #203b50",
                                      color: "#4fd1c5",
                                      cursor: "pointer",
                                      fontWeight: 700,
                                    }}
                                  >
                                    Review Organization Assignment
                                  </button>
                                ) : null}
                                {awaitingAcceptance ? (
                                  <>
                                    <button
                                      type="button"
                                      disabled
                                      style={{
                                        padding: "10px 16px",
                                        borderRadius: "999px",
                                        background: "#0f3b56",
                                        border: "1px solid #1d4ed8",
                                        color: "#7dd3fc",
                                        cursor: "default",
                                        fontWeight: 700,
                                      }}
                                    >
                                      Awaiting Acceptance
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => simulateOrganizationAcceptance(organization.id)}
                                      style={{
                                        padding: "10px 16px",
                                        borderRadius: "999px",
                                        background: "#0b5e4a",
                                        border: "1px solid #064e3b",
                                        color: "#86efac",
                                        cursor: "pointer",
                                        fontWeight: 700,
                                      }}
                                    >
                                      Simulate Acceptance
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => simulateOrganizationRejection(organization.id)}
                                      style={{
                                        padding: "10px 16px",
                                        borderRadius: "999px",
                                        background: "#4c1d1d",
                                        border: "1px solid #7f1d1d",
                                        color: "#fca5a5",
                                        cursor: "pointer",
                                        fontWeight: 700,
                                      }}
                                    >
                                      Simulate Rejection
                                    </button>
                                  </>
                                ) : null}
                                {isActive ? (
                                  <div style={{ color: "#86efac", fontWeight: 700 }}>
                                    Organization active in incident coordination.
                                  </div>
                                ) : null}
                                {isRejected ? (
                                  <div style={{ color: "#fca5a5", fontWeight: 700 }}>
                                    {organization.organizationResponseReason ? "Organization rejected the assignment request." : "Recommendation rejected by operator."}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div style={{ display: "grid", gap: "16px" }}>
                        <div style={cardStyle}>
                          <div style={headerLabelStyle}>AI Organization Decision Support</div>
                          <div style={{ marginTop: "10px", display: "grid", gap: "10px" }}>
                            {[
                              ["Assessment Confidence", "93%"],
                              ["Primary Coordination Gap", "Medical Response"],
                              ["Best Overall Match", "Regional Relief Network"],
                              ["Fastest Mobilization", "Civil Defense Coastal Command"],
                              ["Highest Specialized Capacity", "Red Cross Regional Office"],
                            ].map(([label, value]) => (
                              <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: "12px", color: "#94a3b8" }}>
                                <div>{label}</div>
                                <div style={{ color: "#f8fafc", fontWeight: 700, textAlign: "right" }}>{value}</div>
                              </div>
                            ))}
                            <div style={{ padding: "12px", borderRadius: "12px", background: "#071827", border: "1px solid #203b50", color: "#cbd5e1", lineHeight: 1.7 }}>
                              <strong style={{ color: "#f8fafc" }}>Recommendation:</strong> Approve the strongest organization for each operational assignment while avoiding duplicated responsibilities.
                            </div>
                            <div style={{ color: "#94a3b8", fontSize: "12px" }}>
                              Decision generated by HumanOS AI.
                              <br />
                              Execution requires operator approval.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "grid", gap: "16px" }}>
                      <div
                        style={{
                          padding: "18px",
                          borderRadius: "16px",
                          border: "1px solid #203b50",
                          background: "#091d2c",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                          <div>
                            <div style={headerLabelStyle}>Organization Directory</div>
                            <div style={{ marginTop: "6px", color: "#cbd5e1" }}>
                              Select an organization to inspect details. Selecting never assigns the organization.
                            </div>
                          </div>
                          <input
                            value={organizationSearch}
                            onChange={(e) => setOrganizationSearch(e.target.value)}
                            placeholder="Search organizations"
                            style={{
                              minWidth: "220px",
                              padding: "10px 12px",
                              borderRadius: "10px",
                              border: "1px solid #203b50",
                              background: "#071827",
                              color: "#f8fafc",
                            }}
                          />
                        </div>

                        <div style={{ marginTop: "14px", display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: "16px" }}>
                          <div style={{ overflowX: "auto" }}>
                            <div style={{ width: "100%", minWidth: "1100px" }}>
                              <div style={{ display: "grid", gridTemplateColumns: "130px 1.6fr 1fr 1.6fr 1.3fr 1fr 1fr 1fr 1.2fr 1.2fr", gap: "12px", padding: "12px 0", borderBottom: "1px solid #203b50", color: "#94a3b8", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>
                                <div>Organization ID</div>
                                <div>Organization</div>
                                <div>Type</div>
                                <div>Specialties</div>
                                <div>Coverage</div>
                                <div>Availability</div>
                                <div>Response Capacity</div>
                                <div>Compatibility</div>
                                <div>Current Status</div>
                                <div>Primary Contact</div>
                              </div>
                              {filteredOrganizations.map((organization) => (
                                <button
                                  key={organization.id}
                                  type="button"
                                  onClick={() => setSelectedOrganizationId(organization.id)}
                                  style={{
                                    width: "100%",
                                    display: "grid",
                                    gridTemplateColumns: "130px 1.6fr 1fr 1.6fr 1.3fr 1fr 1fr 1fr 1.2fr 1.2fr",
                                    gap: "12px",
                                    padding: "14px 0",
                                    border: "none",
                                    borderBottom: "1px solid #203b50",
                                    background: selectedOrganizationId === organization.id ? "#0f2c4d" : "transparent",
                                    color: "#cbd5e1",
                                    fontSize: "13px",
                                    textAlign: "left",
                                    cursor: "pointer",
                                  }}
                                >
                                  <div>{organization.id}</div>
                                  <div style={{ color: "#f8fafc", fontWeight: 700 }}>{organization.name}</div>
                                  <div>{organization.type}</div>
                                  <div>{organization.specialties.join(", ")}</div>
                                  <div>{organization.coverage}</div>
                                  <div>{organization.availability}</div>
                                  <div>{organization.responseCapacity}</div>
                                  <div>{organization.compatibilityScore}%</div>
                                  <div>{organization.status}</div>
                                  <div>{organization.primaryContact}</div>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div style={{ padding: "16px", borderRadius: "14px", background: "#071827", border: "1px solid #203b50", display: "grid", gap: "12px" }}>
                            <div style={headerLabelStyle}>Organization Details</div>
                            {selectedOrganization ? (
                              <>
                                <div style={{ fontSize: "20px", fontWeight: 700, color: "#f8fafc" }}>{selectedOrganization.name}</div>
                                <div style={{ color: "#94a3b8" }}>{selectedOrganization.id} • {selectedOrganization.type}</div>
                                <div style={{ display: "grid", gap: "8px", color: "#cbd5e1" }}>
                                  <div>Coverage: <strong style={{ color: "#f8fafc" }}>{selectedOrganization.coverage}</strong></div>
                                  <div>Specialties: <strong style={{ color: "#f8fafc" }}>{selectedOrganization.specialties.join(", ")}</strong></div>
                                  <div>Availability: <strong style={{ color: "#f8fafc" }}>{selectedOrganization.availability}</strong></div>
                                  <div>Response Capacity: <strong style={{ color: "#f8fafc" }}>{selectedOrganization.responseCapacity}</strong></div>
                                  <div>Compatibility: <strong style={{ color: "#f8fafc" }}>{selectedOrganization.compatibilityScore}%</strong></div>
                                  <div>Current Status: <strong style={{ color: "#f8fafc" }}>{selectedOrganization.status}</strong></div>
                                  <div>Primary Contact: <strong style={{ color: "#f8fafc" }}>{selectedOrganization.primaryContact}</strong></div>
                                  <div>Contact Role: <strong style={{ color: "#f8fafc" }}>{selectedOrganization.contactRole}</strong></div>
                                  <div>Phone: <strong style={{ color: "#f8fafc" }}>{selectedOrganization.phone}</strong></div>
                                  <div>Email: <strong style={{ color: "#f8fafc" }}>{selectedOrganization.email}</strong></div>
                                  <div>Requested Scope: <strong style={{ color: "#f8fafc" }}>{selectedOrganization.requestedAssignmentScope ?? "Not requested"}</strong></div>
                                  <div>Coordination Lead: <strong style={{ color: "#f8fafc" }}>{selectedOrganization.coordinationLead ?? "Not assigned"}</strong></div>
                                </div>
                              </>
                            ) : (
                              <div style={{ color: "#94a3b8" }}>Select an organization from the directory.</div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "grid", gap: "14px" }}>
                        <div style={headerLabelStyle}>Incident Coordination Partners</div>
                        {activeOrganizations.length > 0 ? (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
                            {activeOrganizations.map((organization) => (
                              <div key={organization.id} style={{ padding: "16px", borderRadius: "14px", background: "#091d2c", border: "1px solid #0f766e", display: "grid", gap: "10px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "start" }}>
                                  <div>
                                    <div style={{ color: "#f8fafc", fontWeight: 700 }}>{organization.name}</div>
                                    <div style={{ color: "#94a3b8", marginTop: "4px" }}>{organization.id} • {organization.type}</div>
                                  </div>
                                  <span style={{ padding: "6px 10px", borderRadius: "999px", background: "#052e2a", color: "#86efac", fontSize: "11px", fontWeight: 800 }}>ACTIVE</span>
                                </div>
                                <div style={{ display: "grid", gap: "8px", color: "#cbd5e1", fontSize: "13px" }}>
                                  <div>Operational Role: <strong style={{ color: "#f8fafc" }}>{organization.requestedOperationalRole ?? "—"}</strong></div>
                                  <div>Assignment Scope: <strong style={{ color: "#f8fafc" }}>{organization.requestedAssignmentScope ?? "—"}</strong></div>
                                  <div>Primary Contact: <strong style={{ color: "#f8fafc" }}>{organization.primaryContact}</strong></div>
                                  <div>Coordination Lead: <strong style={{ color: "#f8fafc" }}>{organization.coordinationLead ?? "—"}</strong></div>
                                  <div>Mobilization Status: <strong style={{ color: "#f8fafc" }}>{organization.status}</strong></div>
                                  <div>Related Need: <strong style={{ color: "#f8fafc" }}>{organization.relatedAssignment}</strong></div>
                                  <div>Acceptance Date: <strong style={{ color: "#f8fafc" }}>{formatDateTime(organization.acceptedAt)}</strong></div>
                                </div>
                                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                  <button type="button" style={{ padding: "8px 12px", borderRadius: "8px", background: "transparent", border: "1px solid #203b50", color: "#cbd5e1", cursor: "pointer" }}>Open Organization Workspace</button>
                                  <button type="button" style={{ padding: "8px 12px", borderRadius: "8px", background: "transparent", border: "1px solid #203b50", color: "#cbd5e1", cursor: "pointer" }}>Create Coordination Task</button>
                                  <button type="button" style={{ padding: "8px 12px", borderRadius: "8px", background: "transparent", border: "1px solid #203b50", color: "#cbd5e1", cursor: "pointer" }}>Contact Organization</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ padding: "16px", borderRadius: "14px", border: "1px solid #203b50", background: "#091d2c", color: "#94a3b8" }}>
                            No organizations are active yet. Approve a request and simulate acceptance to activate an incident coordination partner.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : activeTab === "Timeline" ? (
                  <div style={{ display: "grid", gap: "16px" }}>
                    <div style={{ padding: "20px", borderRadius: "16px", border: "1px solid #203b50", background: "#0d2639" }}>
                      <div style={headerLabelStyle}>Incident Timeline</div>
                      <h2 style={{ color: "#f8fafc", fontSize: "24px", margin: "10px 0 0" }}>Operational Timeline</h2>
                      <p style={{ color: "#cbd5e1", marginTop: "10px", maxWidth: "680px" }}>
                        All operator actions, approvals, and organization workflow transitions are recorded here.
                      </p>
                    </div>

                    <div style={{ display: "grid", gap: "12px" }}>
                      {timelineEvents.map((event, index) => (
                        <div key={`${event.title}-${event.detail}-${index}`} style={{ display: "grid", gridTemplateColumns: "28px minmax(0, 1fr)", gap: "14px", padding: "16px", borderRadius: "14px", border: "1px solid #203b50", background: "#091d2c" }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div style={{ width: "14px", height: "14px", borderRadius: "999px", background: "#2dd4bf", marginTop: "4px" }} />
                            {index < timelineEvents.length - 1 ? <div style={{ flexGrow: 1, width: "2px", background: "#203b50", marginTop: "8px" }} /> : null}
                          </div>
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                              <div style={{ color: "#f8fafc", fontWeight: 700 }}>{event.title}</div>
                              <div style={{ color: "#94a3b8", fontSize: "12px" }}>{event.time}</div>
                            </div>
                            <div style={{ color: "#cbd5e1", marginTop: "8px", lineHeight: 1.7 }}>{event.detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : activeTab === "Logistics" ? (
                  <div style={{ display: "grid", gap: "18px" }}>
                    <div style={{ padding: "20px", borderRadius: "16px", border: "1px solid #203b50", background: "#0d2639", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "18px", alignItems: "start" }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={headerLabelStyle}>Incident Logistics</div>
                        <h2 style={{ color: "#f8fafc", fontSize: "24px", margin: "10px 0 0" }}>Incident Logistics</h2>
                        <p style={{ color: "#cbd5e1", marginTop: "10px", maxWidth: "720px" }}>Plan, approve, track, and verify the movement of resources assigned to this incident.</p>
                      </div>
                      <button type="button" onClick={openCreateLogisticsPlanModal} style={{ minWidth: "190px", padding: "12px 18px", borderRadius: "999px", border: "1px solid #203b50", background: "#12364b", color: "#4fd1c5", cursor: "pointer", fontWeight: 700 }}>+ Create Logistics Plan</button>
                    </div>

                    {logisticsNotice ? <div style={{ padding: "12px 14px", borderRadius: "12px", border: "1px solid #1d4ed8", background: "#0a2440", color: "#bfdbfe" }}>{logisticsNotice}</div> : null}

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px" }}>
                      {[["Dispatch Orders", String(dispatchOrdersCount)],["Awaiting Approval", String(logisticsAwaitingApprovalCount)],["Ready for Loading", String(readyForLoadingCount)],["In Transit", String(logisticsInTransitCount)],["Delivered", String(logisticsDeliveredCount)],["Delayed / At Risk", String(delayedAtRiskCount)]].map(([label, value]) => <div key={label} style={cardStyle}><div style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "12px" }}>{label}</div><div style={{ fontSize: "30px", fontWeight: 700, color: "#f8fafc" }}>{value}</div></div>)}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: "16px" }}>
                      <div style={{ display: "grid", gap: "14px" }}>
                        {dispatchOrders.length > 0 ? dispatchOrders.map((operation) => {
                          const currentStageIndex = logisticsWorkflowStages.indexOf(operation.currentStage);
                          const approvalBadge = operation.approvalStatus === "Approved" ? "LOGISTICS PLAN APPROVED" : operation.approvalStatus === "Rejected" ? "LOGISTICS PLAN REJECTED" : "AI LOGISTICS RECOMMENDATION — NOT APPROVED";
                          const approvalBadgeStyle = operation.approvalStatus === "Approved" ? { background: "#052e2a", color: "#86efac" } : operation.approvalStatus === "Rejected" ? { background: "#4c1d1d", color: "#fca5a5" } : { background: "#172554", color: "#c7d2fe" };

                          return (
                            <div key={operation.id} style={{ padding: "18px", borderRadius: "16px", border: operation.riskStatus === "At Risk" ? "1px solid #b45309" : "1px solid #203b50", background: "#091d2c", display: "grid", gap: "16px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", alignItems: "start" }}>
                                <div>
                                  <div style={{ fontSize: "20px", fontWeight: 700, color: "#f8fafc" }}>{operation.id}</div>
                                  <div style={{ marginTop: "6px", color: "#94a3b8", display: "flex", gap: "12px", flexWrap: "wrap" }}><div>Incident: {operation.incidentId}</div><div>Resource: {operation.resourceName}</div><div>Need: {operation.relatedNeed}</div></div>
                                </div>
                                <span style={{ padding: "6px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 800, ...approvalBadgeStyle }}>{approvalBadge}</span>
                              </div>

                              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
                                <div style={{ padding: "14px", borderRadius: "12px", background: "#071827", border: "1px solid #203b50", display: "grid", gap: "8px" }}><div style={headerLabelStyle}>Shipment</div><div style={{ color: "#cbd5e1", fontSize: "13px" }}>Dispatch ID</div><div style={{ color: "#f8fafc", fontWeight: 700 }}>{operation.id}</div><div style={{ color: "#cbd5e1", fontSize: "13px" }}>Resource</div><div style={{ color: "#f8fafc", fontWeight: 700 }}>{operation.resourceName}</div><div style={{ color: "#cbd5e1", fontSize: "13px" }}>Related Need</div><div style={{ color: "#f8fafc", fontWeight: 700 }}>{operation.relatedNeed}</div><div style={{ color: "#cbd5e1", fontSize: "13px" }}>Quantity</div><div style={{ color: "#f8fafc", fontWeight: 700 }}>{operation.approvedQuantity}</div><div style={{ color: "#cbd5e1", fontSize: "13px" }}>Source Organization</div><div style={{ color: "#f8fafc", fontWeight: 700 }}>{operation.sourceOrganization}</div></div>
                                <div style={{ padding: "14px", borderRadius: "12px", background: "#071827", border: "1px solid #203b50", display: "grid", gap: "8px" }}><div style={headerLabelStyle}>Transport</div><div style={{ color: "#cbd5e1", fontSize: "13px" }}>Vehicle Type</div><div style={{ color: "#f8fafc", fontWeight: 700 }}>{operation.vehicleType}</div><div style={{ color: "#cbd5e1", fontSize: "13px" }}>Vehicle ID</div><div style={{ color: "#f8fafc", fontWeight: 700 }}>{operation.vehicleId}</div><div style={{ color: "#cbd5e1", fontSize: "13px" }}>Driver / Responsible Person</div><div style={{ color: "#f8fafc", fontWeight: 700 }}>{operation.driver}</div><div style={{ color: "#cbd5e1", fontSize: "13px" }}>Contact Number</div><div style={{ color: "#f8fafc", fontWeight: 700 }}>{operation.contactNumber}</div><div style={{ color: "#cbd5e1", fontSize: "13px" }}>Transport Organization</div><div style={{ color: "#f8fafc", fontWeight: 700 }}>{operation.transportOrganization}</div><div style={{ color: "#cbd5e1", fontSize: "13px" }}>GPS Tracking</div><div style={{ color: "#f8fafc", fontWeight: 700 }}>{operation.gpsTracking}</div></div>
                                <div style={{ padding: "14px", borderRadius: "12px", background: "#071827", border: "1px solid #203b50", display: "grid", gap: "8px" }}><div style={headerLabelStyle}>Route</div><div style={{ color: "#cbd5e1", fontSize: "13px" }}>Origin</div><div style={{ color: "#f8fafc", fontWeight: 700 }}>{operation.sourceLocation}</div><div style={{ color: "#cbd5e1", fontSize: "13px" }}>Destination</div><div style={{ color: "#f8fafc", fontWeight: 700 }}>{operation.destination}</div><div style={{ color: "#cbd5e1", fontSize: "13px" }}>Distance</div><div style={{ color: "#f8fafc", fontWeight: 700 }}>{operation.aiRouteDistance}</div><div style={{ color: "#cbd5e1", fontSize: "13px" }}>Planned Departure</div><div style={{ color: "#f8fafc", fontWeight: 700 }}>{operation.departureDate} {operation.departureTime}</div><div style={{ color: "#cbd5e1", fontSize: "13px" }}>Expected Arrival</div><div style={{ color: "#f8fafc", fontWeight: 700 }}>{operation.expectedArrivalDate} {operation.expectedArrivalTime}</div><div style={{ color: "#cbd5e1", fontSize: "13px" }}>Current ETA</div><div style={{ color: "#f8fafc", fontWeight: 700 }}>{operation.currentEta}</div></div>
                                <div style={{ padding: "14px", borderRadius: "12px", background: "#071827", border: "1px solid #203b50", display: "grid", gap: "8px" }}><div style={headerLabelStyle}>Status</div><div style={{ color: "#cbd5e1", fontSize: "13px" }}>Current Logistics Status</div><div style={{ color: "#f8fafc", fontWeight: 700 }}>{operation.currentLogisticsStatus}</div><div style={{ color: "#cbd5e1", fontSize: "13px" }}>Current Stage</div><div style={{ color: "#f8fafc", fontWeight: 700 }}>{operation.currentStage}</div><div style={{ color: "#cbd5e1", fontSize: "13px" }}>Risk Level</div><div style={{ color: operation.riskStatus === "At Risk" ? "#f59e0b" : "#f8fafc", fontWeight: 700 }}>{operation.riskStatus}</div><div style={{ color: "#cbd5e1", fontSize: "13px" }}>Last Update</div><div style={{ color: "#f8fafc", fontWeight: 700 }}>{formatDateTime(operation.lastUpdate)}</div></div>
                              </div>

                              <div style={{ padding: "14px", borderRadius: "12px", background: "#071827", border: "1px solid #203b50", display: "grid", gap: "12px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", alignItems: "center" }}><div style={headerLabelStyle}>Workflow</div><div style={{ color: "#94a3b8", fontSize: "12px" }}>Approved By: {operation.confirmedBy} • {formatDateTime(operation.confirmedAt)}</div></div>
                                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>{logisticsWorkflowStages.map((stage, index) => { const isCurrent = index === currentStageIndex; const isCompleted = index < currentStageIndex; return <div key={stage} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", borderRadius: "999px", background: isCurrent ? "#12364b" : isCompleted ? "#052e2a" : "#0f172a", color: isCurrent ? "#4fd1c5" : isCompleted ? "#86efac" : "#94a3b8", border: "1px solid #203b50", fontSize: "12px", fontWeight: 700 }}><span style={{ width: "18px", height: "18px", borderRadius: "999px", display: "grid", placeItems: "center", background: isCurrent ? "#1d4ed8" : isCompleted ? "#10b981" : "#334155", color: "#f8fafc", fontSize: "11px" }}>{isCompleted ? "✓" : index + 1}</span><span>{stage}</span></div>; })}</div>
                              </div>

                              <div style={{ padding: "14px", borderRadius: "12px", background: "#071827", border: "1px solid #203b50", display: "grid", gap: "10px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", alignItems: "center" }}><div style={headerLabelStyle}>AI Logistics Recommendation</div><div style={{ color: "#94a3b8", fontSize: "12px" }}>Decision generated by HumanOS AI. Execution requires operator approval.</div></div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>{[["Recommended Route", operation.aiRecommendedRoute],["Route Distance", operation.aiRouteDistance],["Estimated Travel Time", operation.aiEstimatedTravelTime],["Route Risk", operation.aiRouteRisk],["Weather Impact", operation.aiWeatherImpact],["Road Accessibility", operation.aiRoadAccessibility],["Fuel Readiness", operation.aiFuelReadiness],["Vehicle Capacity", operation.aiVehicleCapacity],["Security Coordination", operation.aiSecurityCoordination],["Assessment Confidence", `${operation.aiConfidence}%`],["Alternative Route", operation.aiAlternativeRoute],["Alternative Travel Time", "5 hours 20 minutes"]].map(([label, value]) => <div key={label} style={{ display: "grid", gap: "6px" }}><div style={{ color: "#94a3b8", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.4px" }}>{label}</div><div style={{ color: "#f8fafc", fontWeight: 700 }}>{value}</div></div>)}</div>
                                <div style={{ color: "#cbd5e1", lineHeight: 1.7 }}>Recommendation: Use the primary route after confirming security coordination and driver readiness.</div>
                              </div>

                              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>{renderLogisticsActionButtons(operation)}<button type="button" onClick={() => setSelectedLogisticsOperationId(operation.id)} style={{ padding: "10px 14px", borderRadius: "999px", background: "transparent", border: "1px solid #203b50", color: "#cbd5e1", cursor: "pointer" }}>Select Operation</button></div>
                            </div>
                          );
                        }) : <div style={{ padding: "18px", borderRadius: "14px", border: "1px solid #203b50", background: "#091d2c", color: "#94a3b8" }}>No dispatch orders are available yet. Create a logistics plan from an approved resource assignment or from the Resources tab.</div>}
                      </div>

                      <div style={{ display: "grid", gap: "16px" }}>
                        <div style={cardStyle}>
                          <div style={headerLabelStyle}>AI Logistics Decision Support</div>
                          <div style={{ marginTop: "10px", display: "grid", gap: "10px" }}>{[["Assessment Confidence", logisticsAiSummary.confidence],["Primary Route Risk", logisticsAiSummary.routeRisk],["Fastest Route", logisticsAiSummary.fastestRoute],["Estimated Travel Time", logisticsAiSummary.travelTime],["Expected Fuel Consumption", logisticsAiSummary.fuelConsumption],["Security Requirement", logisticsAiSummary.securityRequirement],["Current Operational Concern", logisticsAiSummary.concern]].map(([label, value]) => <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: "12px", color: "#94a3b8" }}><div>{label}</div><div style={{ color: "#f8fafc", fontWeight: 700, textAlign: "right" }}>{value}</div></div>)}<div style={{ padding: "12px", borderRadius: "12px", background: "#071827", border: "1px solid #203b50", color: "#cbd5e1", lineHeight: 1.7 }}><strong style={{ color: "#f8fafc" }}>Recommended Action:</strong> {logisticsAiSummary.action}</div><div style={{ color: "#94a3b8", fontSize: "12px" }}>Decision generated by HumanOS AI.<br />Execution requires operator approval.</div></div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 340px", gap: "16px" }}>
                      <div style={cardStyle}>
                        <div style={headerLabelStyle}>Live Logistics Tracking</div>
                        <div style={{ marginTop: "12px", display: "grid", gridTemplateColumns: "minmax(0, 1fr) 260px", gap: "14px" }}>
                          <div style={{ minHeight: "300px", borderRadius: "12px", background: "linear-gradient(180deg, #071827 0%, #0b2031 100%)", border: "1px dashed #203b50", padding: "14px", display: "grid", gap: "10px" }}><div style={{ fontWeight: 700, color: "#f8fafc" }}>Dark map placeholder</div>{["Origin Warehouse","Current Vehicle Position","Destination","Alternative Route","Security Checkpoint"].map((marker, index) => <div key={marker} style={{ marginLeft: `${index * 18}px`, padding: "10px 12px", borderRadius: "10px", background: "#071827", border: "1px solid #203b50", color: "#cbd5e1", width: "fit-content" }}>{marker}</div>)}</div>
                          <div style={{ padding: "14px", borderRadius: "12px", background: "#071827", border: "1px solid #203b50", display: "grid", gap: "10px" }}><div style={{ fontWeight: 700, color: "#f8fafc" }}>Tracking Snapshot</div><div style={{ color: "#cbd5e1" }}>Current ETA: <strong style={{ color: "#f8fafc" }}>{selectedLogisticsOperation?.currentEta ?? "Not available"}</strong></div><div style={{ color: "#cbd5e1" }}>Distance Remaining: <strong style={{ color: "#f8fafc" }}>{selectedLogisticsOperation?.distanceRemaining ?? "Not available"}</strong></div><div style={{ color: "#cbd5e1" }}>Last GPS Update: <strong style={{ color: "#f8fafc" }}>{selectedLogisticsOperation?.lastGpsUpdate ?? "Not available"}</strong></div><div style={{ color: "#cbd5e1" }}>Current Speed: <strong style={{ color: "#f8fafc" }}>{selectedLogisticsOperation?.currentSpeed ?? "Not available"}</strong></div><div style={{ color: "#cbd5e1" }}>Route Status: <strong style={{ color: "#f8fafc" }}>{selectedLogisticsOperation?.routeStatus ?? "Not available"}</strong></div></div>
                        </div>
                      </div>

                      <div style={cardStyle}><div style={headerLabelStyle}>Selected Operation</div>{selectedLogisticsOperation ? <div style={{ marginTop: "10px", display: "grid", gap: "10px", color: "#cbd5e1" }}><div>Dispatch ID: <strong style={{ color: "#f8fafc" }}>{selectedLogisticsOperation.id}</strong></div><div>Current Stage: <strong style={{ color: "#f8fafc" }}>{selectedLogisticsOperation.currentStage}</strong></div><div>Risk Status: <strong style={{ color: selectedLogisticsOperation.riskStatus === "At Risk" ? "#f59e0b" : "#f8fafc" }}>{selectedLogisticsOperation.riskStatus}</strong></div><div>Last Update: <strong style={{ color: "#f8fafc" }}>{formatDateTime(selectedLogisticsOperation.lastUpdate)}</strong></div><div style={{ marginTop: "8px" }}>{renderLogisticsActionButtons(selectedLogisticsOperation)}</div></div> : <div style={{ marginTop: "10px", color: "#94a3b8" }}>Select an operation from the table below.</div>}</div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 340px", gap: "16px" }}>
                      <div style={{ padding: "18px", borderRadius: "16px", border: "1px solid #203b50", background: "#091d2c" }}>
                        <div><div style={headerLabelStyle}>Active Logistics Operations</div><div style={{ marginTop: "6px", color: "#cbd5e1" }}>Selecting a row updates the logistics detail panel without changing operation status.</div></div>
                        <div style={{ marginTop: "14px", overflowX: "auto" }}><div style={{ width: "100%", minWidth: "1250px" }}><div style={{ display: "grid", gridTemplateColumns: "120px 1.4fr 100px 1fr 1fr 120px 140px 130px 130px 90px 110px 110px 130px", gap: "12px", padding: "12px 0", borderBottom: "1px solid #203b50", color: "#94a3b8", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}><div>Dispatch ID</div><div>Resource</div><div>Quantity</div><div>Origin</div><div>Destination</div><div>Vehicle</div><div>Driver</div><div>Departure</div><div>ETA</div><div>GPS</div><div>Risk</div><div>Status</div><div>Last Update</div></div>{dispatchOrders.map((operation) => <button key={operation.id} type="button" onClick={() => setSelectedLogisticsOperationId(operation.id)} style={{ width: "100%", display: "grid", gridTemplateColumns: "120px 1.4fr 100px 1fr 1fr 120px 140px 130px 130px 90px 110px 110px 130px", gap: "12px", padding: "14px 0", border: "none", borderBottom: "1px solid #203b50", background: selectedLogisticsOperationId === operation.id ? "#0f2c4d" : "transparent", color: "#cbd5e1", fontSize: "13px", textAlign: "left", cursor: "pointer" }}><div>{operation.id}</div><div style={{ color: "#f8fafc", fontWeight: 700 }}>{operation.resourceName}</div><div>{operation.approvedQuantity}</div><div>{operation.sourceLocation}</div><div>{operation.destination}</div><div>{operation.vehicleId}</div><div>{operation.driver}</div><div>{operation.departureDate} {operation.departureTime}</div><div>{operation.currentEta}</div><div>{operation.gpsTracking}</div><div>{operation.riskStatus}</div><div>{operation.currentStage}</div><div>{formatDateTime(operation.lastUpdate)}</div></button>)}</div></div>
                      </div>

                      <div style={{ padding: "18px", borderRadius: "16px", border: "1px solid #203b50", background: "#091d2c", display: "grid", gap: "12px" }}><div style={headerLabelStyle}>Logistics Detail Panel</div>{selectedLogisticsOperation ? <><div style={{ fontSize: "20px", fontWeight: 700, color: "#f8fafc" }}>{selectedLogisticsOperation.id}</div><div style={{ display: "grid", gap: "8px", color: "#cbd5e1", fontSize: "13px" }}><div>Related Incident: <strong style={{ color: "#f8fafc" }}>{selectedLogisticsOperation.incidentId}</strong></div><div>Related Need: <strong style={{ color: "#f8fafc" }}>{selectedLogisticsOperation.relatedNeed}</strong></div><div>Resource: <strong style={{ color: "#f8fafc" }}>{selectedLogisticsOperation.resourceName}</strong></div><div>Quantity: <strong style={{ color: "#f8fafc" }}>{selectedLogisticsOperation.approvedQuantity}</strong></div><div>Organization: <strong style={{ color: "#f8fafc" }}>{selectedLogisticsOperation.sourceOrganization}</strong></div><div>Origin: <strong style={{ color: "#f8fafc" }}>{selectedLogisticsOperation.sourceLocation}</strong></div><div>Destination: <strong style={{ color: "#f8fafc" }}>{selectedLogisticsOperation.destination}</strong></div><div>Final Route: <strong style={{ color: "#f8fafc" }}>{selectedLogisticsOperation.finalRoute}</strong></div><div>Vehicle: <strong style={{ color: "#f8fafc" }}>{selectedLogisticsOperation.vehicleType} / {selectedLogisticsOperation.vehicleId}</strong></div><div>Driver: <strong style={{ color: "#f8fafc" }}>{selectedLogisticsOperation.driver}</strong></div><div>Driver Contact: <strong style={{ color: "#f8fafc" }}>{selectedLogisticsOperation.contactNumber}</strong></div><div>Transport Organization: <strong style={{ color: "#f8fafc" }}>{selectedLogisticsOperation.transportOrganization}</strong></div><div>Departure: <strong style={{ color: "#f8fafc" }}>{selectedLogisticsOperation.departureDate} {selectedLogisticsOperation.departureTime}</strong></div><div>Current ETA: <strong style={{ color: "#f8fafc" }}>{selectedLogisticsOperation.currentEta}</strong></div><div>GPS Status: <strong style={{ color: "#f8fafc" }}>{selectedLogisticsOperation.gpsTracking}</strong></div><div>Fuel Status: <strong style={{ color: "#f8fafc" }}>{selectedLogisticsOperation.fuelStatus}</strong></div><div>Security Coordination: <strong style={{ color: "#f8fafc" }}>{selectedLogisticsOperation.securityCoordination}</strong></div><div>Receiving Organization: <strong style={{ color: "#f8fafc" }}>{selectedLogisticsOperation.receivingOrganization ?? "—"}</strong></div><div>Receiving Officer: <strong style={{ color: "#f8fafc" }}>{selectedLogisticsOperation.receivingOfficer ?? "—"}</strong></div><div>Current Workflow Stage: <strong style={{ color: "#f8fafc" }}>{selectedLogisticsOperation.currentStage}</strong></div><div>Risk Status: <strong style={{ color: selectedLogisticsOperation.riskStatus === "At Risk" ? "#f59e0b" : "#f8fafc" }}>{selectedLogisticsOperation.riskStatus}</strong></div><div>Last Update: <strong style={{ color: "#f8fafc" }}>{formatDateTime(selectedLogisticsOperation.lastUpdate)}</strong></div></div><div style={{ marginTop: "8px" }}>{renderLogisticsActionButtons(selectedLogisticsOperation)}</div></> : <div style={{ color: "#94a3b8" }}>Select a logistics operation to inspect operational details.</div>}</div>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      padding: "20px",
                      borderRadius: "16px",
                      border: "1px solid #203b50",
                      background: "#0d2639",
                    }}
                  >
                    <div style={headerLabelStyle}>{activeTab}</div>
                    <p style={{ color: "#cbd5e1", marginTop: "14px" }}>
                      This section is not yet implemented but will preserve the HumanOS workspace design.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </section>
      {isAddModalOpen ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(2,6,23,0.6)",
            display: "grid",
            placeItems: "center",
            zIndex: 60,
            padding: "24px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "760px",
              borderRadius: "12px",
              background: "#071827",
              border: "1px solid #203b50",
              padding: "18px",
              color: "#f8fafc",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: "#94a3b8", fontSize: "10px", letterSpacing: "1.5px" }}>ADD NEED</div>
                <h3 style={{ margin: "8px 0 0" }}>Create New Need</h3>
              </div>
              <button
                onClick={closeAddNeed}
                style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "18px" }}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <div style={{ marginTop: "12px", display: "grid", gap: "10px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <input
                  value={newNeed.category}
                  onChange={(e) => setNewNeed((s) => ({ ...s, category: e.target.value }))}
                  placeholder="Category"
                  style={{ padding: "10px", borderRadius: "8px", border: "1px solid #203b50", background: "#0b1e2b", color: "#f8fafc" }}
                />
                <input
                  value={newNeed.quantity}
                  onChange={(e) => setNewNeed((s) => ({ ...s, quantity: e.target.value }))}
                  placeholder="Quantity"
                  style={{ padding: "10px", borderRadius: "8px", border: "1px solid #203b50", background: "#0b1e2b", color: "#f8fafc" }}
                />
              </div>

              <input
                value={newNeed.unit}
                onChange={(e) => setNewNeed((s) => ({ ...s, unit: e.target.value }))}
                placeholder="Unit (e.g., Kits, Liters)"
                style={{ padding: "10px", borderRadius: "8px", border: "1px solid #203b50", background: "#0b1e2b", color: "#f8fafc" }}
              />

              <textarea
                value={newNeed.description}
                onChange={(e) => setNewNeed((s) => ({ ...s, description: e.target.value }))}
                placeholder="Description"
                rows={3}
                style={{ padding: "10px", borderRadius: "8px", border: "1px solid #203b50", background: "#0b1e2b", color: "#f8fafc" }}
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <select
                  value={newNeed.priority}
                  onChange={(e) => setNewNeed((s) => ({ ...s, priority: e.target.value }))}
                  style={{ padding: "10px", borderRadius: "8px", border: "1px solid #203b50", background: "#0b1e2b", color: "#f8fafc" }}
                >
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>

                <input
                  value={newNeed.location}
                  onChange={(e) => setNewNeed((s) => ({ ...s, location: e.target.value }))}
                  placeholder="Location"
                  style={{ padding: "10px", borderRadius: "8px", border: "1px solid #203b50", background: "#0b1e2b", color: "#f8fafc" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <input
                  value={newNeed.requestedBy}
                  onChange={(e) => setNewNeed((s) => ({ ...s, requestedBy: e.target.value }))}
                  placeholder="Requested By"
                  style={{ padding: "10px", borderRadius: "8px", border: "1px solid #203b50", background: "#0b1e2b", color: "#f8fafc" }}
                />
                <input
                  value={newNeed.dueDate}
                  onChange={(e) => setNewNeed((s) => ({ ...s, dueDate: e.target.value }))}
                  placeholder="Due Date"
                  type="date"
                  style={{ padding: "10px", borderRadius: "8px", border: "1px solid #203b50", background: "#0b1e2b", color: "#f8fafc" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "6px" }}>
                <button
                  onClick={closeAddNeed}
                  style={{ padding: "8px 12px", borderRadius: "8px", background: "transparent", border: "1px solid #203b50", color: "#cbd5e1", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  onClick={openAssessment}
                  style={{ padding: "8px 12px", borderRadius: "8px", background: "#12364b", border: "1px solid #203b50", color: "#4fd1c5", cursor: "pointer", fontWeight: 700 }}
                >
                  Create Need
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {reviewModalOpen ? (
        <div style={{ position: "fixed", inset: 0, background: "rgba(2,6,23,0.7)", display: "grid", placeItems: "center", zIndex: 120, padding: "16px" }}>
          <div style={{ width: "min(760px, calc(100vw - 32px))", borderRadius: "12px", background: "#071827", border: "1px solid #203b50", padding: "18px", color: "#f8fafc" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={headerLabelStyle}>Review Allocation</div>
                <div style={{ marginTop: "6px", color: "#cbd5e1" }}>AI suggested resource allocation requires operator approval.</div>
              </div>
              <button onClick={closeReviewModal} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "18px" }} aria-label="Close review">×</button>
            </div>

            <div style={{ marginTop: "12px", display: "grid", gap: "10px" }}>
              <div style={{ display: "grid", gap: "6px" }}>
                <div style={{ fontWeight: 800, color: "#f8fafc" }}>{reviewResource?.name}</div>
                <div style={{ color: "#94a3b8" }}>{reviewResource?.category} • Suitability: {reviewResource?.suitability ?? "—"}%</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <div style={{ color: "#94a3b8", fontSize: "12px" }}>Proposed quantity</div>
                  <input type="number" value={reviewProposedQty as any} onChange={(e) => setReviewProposedQty(e.target.value === "" ? "" : parseInt(e.target.value, 10))} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #203b50", background: "#0b1e2b", color: "#f8fafc" }} />
                </div>

                <div>
                  <div style={{ color: "#94a3b8", fontSize: "12px" }}>Assign to need</div>
                  <select value={reviewSelectedNeed ?? ""} onChange={(e) => setReviewSelectedNeed(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #203b50", background: "#0b1e2b", color: "#f8fafc" }}>
                    {needs.map((n:any) => <option key={n.id} value={n.id}>{n.id} — {n.category}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <div style={{ color: "#94a3b8", fontSize: "12px" }}>Decision</div>
                <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                  {(["Approve","Modify","Reject"] as const).map((d) => (
                    <label key={d} style={{ display: "flex", gap: "8px", alignItems: "center", color: "#e2e8f0" }}>
                      <input type="radio" name="reviewDecision" checked={reviewDecision === d} onChange={() => setReviewDecision(d)} />
                      <div>{d}</div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ color: "#94a3b8", fontSize: "12px" }}>Operator notes</div>
                <textarea value={reviewNotes} onChange={(e) => setReviewNotes(e.target.value)} rows={3} placeholder="Notes (optional)" style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #203b50", background: "#0b1e2b", color: "#f8fafc" }} />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button onClick={closeReviewModal} style={{ padding: "8px 12px", borderRadius: "8px", background: "transparent", border: "1px solid #203b50", color: "#cbd5e1" }}>Cancel</button>
                <button onClick={confirmApproveAllocation} style={{ padding: "8px 12px", borderRadius: "8px", background: "#12364b", border: "1px solid #203b50", color: "#4fd1c5", fontWeight: 700 }}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {logisticsPlanModalOpen && logisticsPlanForm ? (
        <div style={{ position: "fixed", inset: 0, background: "rgba(2,6,23,0.82)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", zIndex: 123 }}>
          <div style={{ width: "min(980px, calc(100vw - 32px))", maxHeight: "calc(100vh - 32px)", overflowY: "auto", borderRadius: "14px", background: "#071827", border: "1px solid #203b50", padding: "22px", color: "#f8fafc" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", alignItems: "start" }}>
              <div>
                <div style={{ color: "#94a3b8", fontSize: "10px", letterSpacing: "1.8px", textTransform: "uppercase" }}>Review Logistics Plan</div>
                <h2 style={{ margin: "8px 0 0", fontSize: "24px", color: "#f8fafc" }}>Review Logistics Plan</h2>
                <div style={{ marginTop: "8px", color: "#cbd5e1", maxWidth: "680px" }}>HumanOS AI recommends the logistics plan. The operator approves or rejects activation.</div>
              </div>
              <button onClick={closeLogisticsPlanModal} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "22px", lineHeight: 1 }} aria-label="Close logistics plan modal">×</button>
            </div>

            <div style={{ marginTop: "18px", display: "grid", gap: "18px" }}>
              <div style={{ padding: "16px", borderRadius: "14px", background: "#0b1e2b", border: "1px solid #203b50" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px" }}>
                  {[["Incident ID", id],["Dispatch ID", logisticsPlanForm.dispatchId],["Resource", logisticsPlanForm.resourceName],["Quantity", String(logisticsPlanForm.approvedQuantity)],["Related Need", logisticsPlanForm.relatedNeed],["Organization", logisticsPlanForm.sourceOrganization],["Origin", logisticsPlanForm.sourceLocation],["Destination", logisticsPlanForm.destination],["AI Recommended Route", logisticsPlanForm.aiRecommendedRoute],["Route Risk", logisticsPlanForm.aiRouteRisk],["Estimated Travel Time", logisticsPlanForm.aiEstimatedTravelTime],["Assessment Confidence", `${logisticsPlanForm.aiConfidence}%`]].map(([label, value]) => <div key={label} style={{ display: "grid", gap: "6px" }}><div style={{ color: "#94a3b8", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px" }}>{label}</div><div style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: 700 }}>{value}</div></div>)}
                </div>
              </div>

              <div style={{ padding: "18px", borderRadius: "14px", background: "#0b1e2b", border: "1px solid #203b50", display: "grid", gap: "16px" }}>
                <div style={{ color: "#94a3b8", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1.5px" }}>Operational Fields</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
                  {[{ label: "Final Route", key: "finalRoute" },{ label: "Vehicle Type", key: "vehicleType" },{ label: "Vehicle ID", key: "vehicleId" },{ label: "Driver / Responsible Person", key: "driver" },{ label: "Driver Contact", key: "driverContact" },{ label: "Transport Organization", key: "transportOrganization" },{ label: "Departure Date", key: "departureDate", type: "date" },{ label: "Departure Time", key: "departureTime", type: "time" },{ label: "Expected Arrival Date", key: "expectedArrivalDate", type: "date" },{ label: "Expected Arrival Time", key: "expectedArrivalTime", type: "time" },{ label: "Loading Location", key: "loadingLocation" },{ label: "Receiving Organization", key: "receivingOrganization" },{ label: "Receiving Officer", key: "receivingOfficer" },{ label: "Receiving Contact", key: "receivingContact" },{ label: "Packing List Reference", key: "packingListReference" },{ label: "Supporting Documents Reference", key: "supportingDocumentsReference" }].map((field) => <div key={field.key} style={{ display: "grid", gap: "8px" }}><label style={{ color: "#94a3b8", fontSize: "11px" }}>{field.label}</label><input type={field.type ?? "text"} value={logisticsPlanForm[field.key]} onChange={(e) => setLogisticsPlanForm((current: any) => ({ ...current, [field.key]: e.target.value }))} style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#071827", color: "#f8fafc" }} /></div>)}
                  <div style={{ display: "grid", gap: "8px" }}><label style={{ color: "#94a3b8", fontSize: "11px" }}>GPS Tracking</label><select value={logisticsPlanForm.gpsTracking} onChange={(e) => setLogisticsPlanForm((current: any) => ({ ...current, gpsTracking: e.target.value }))} style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#071827", color: "#f8fafc" }}><option>Enabled</option><option>Disabled</option></select></div>
                  <div style={{ display: "grid", gap: "8px" }}><label style={{ color: "#94a3b8", fontSize: "11px" }}>Security Coordination</label><select value={logisticsPlanForm.securityCoordination} onChange={(e) => setLogisticsPlanForm((current: any) => ({ ...current, securityCoordination: e.target.value }))} style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#071827", color: "#f8fafc" }}><option>Confirmed</option><option>Pending</option></select></div>
                  <div style={{ display: "grid", gap: "8px" }}><label style={{ color: "#94a3b8", fontSize: "11px" }}>Fuel Status</label><select value={logisticsPlanForm.fuelStatus} onChange={(e) => setLogisticsPlanForm((current: any) => ({ ...current, fuelStatus: e.target.value }))} style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#071827", color: "#f8fafc" }}><option>Confirmed</option><option>Pending</option></select></div>
                </div>
                <div style={{ display: "grid", gap: "8px" }}><label style={{ color: "#94a3b8", fontSize: "11px" }}>Special Instructions</label><textarea value={logisticsPlanForm.specialInstructions} onChange={(e) => setLogisticsPlanForm((current: any) => ({ ...current, specialInstructions: e.target.value }))} rows={4} style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#071827", color: "#f8fafc", resize: "vertical" }} /></div>
              </div>

              <div style={{ padding: "18px", borderRadius: "14px", background: "#091d2c", border: "1px solid #203b50", display: "grid", gap: "12px" }}>
                <div style={{ color: "#94a3b8", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1.5px" }}>Operator Decision</div>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>{[["Approve", "Approve AI Logistics Plan"],["Modify", "Modify Logistics Plan"],["Reject", "Reject Logistics Plan"]].map(([value, label]) => <label key={value} style={{ display: "flex", gap: "8px", alignItems: "center", color: "#e2e8f0" }}><input type="radio" name="logisticsDecision" checked={logisticsPlanForm.operatorDecision === value} onChange={() => setLogisticsPlanForm((current: any) => ({ ...current, operatorDecision: value }))} /><span>{label}</span></label>)}</div>
                {logisticsPlanForm.operatorDecision === "Modify" ? <div style={{ display: "grid", gap: "8px" }}><label style={{ color: "#94a3b8", fontSize: "12px" }}>Operator notes</label><textarea value={logisticsPlanForm.operatorNotes} onChange={(e) => setLogisticsPlanForm((current: any) => ({ ...current, operatorNotes: e.target.value }))} rows={3} placeholder="Required when modifying the logistics plan" style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#071827", color: "#f8fafc" }} /></div> : null}
                {logisticsPlanForm.operatorDecision === "Reject" ? <div style={{ display: "grid", gap: "8px" }}><label style={{ color: "#94a3b8", fontSize: "12px" }}>Rejection reason</label><textarea value={logisticsPlanForm.rejectionReason} onChange={(e) => setLogisticsPlanForm((current: any) => ({ ...current, rejectionReason: e.target.value }))} rows={3} placeholder="Required when rejecting the logistics plan" style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#071827", color: "#f8fafc" }} /></div> : null}
              </div>

              <div style={{ padding: "16px", borderRadius: "12px", background: "#0b1e2b", border: "1px solid #203b50", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}><div style={{ display: "grid", gap: "4px", color: "#94a3b8", fontSize: "12px" }}><div>Confirmed By</div><div style={{ color: "#f8fafc", fontWeight: 700 }}>{operatorName}</div></div><div style={{ display: "grid", gap: "4px", color: "#94a3b8", fontSize: "12px" }}><div>Confirmed At</div><div style={{ color: "#f8fafc", fontWeight: 700 }}>{new Date().toLocaleString()}</div></div></div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", flexWrap: "wrap" }}><button onClick={closeLogisticsPlanModal} style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid #203b50", background: "transparent", color: "#cbd5e1", cursor: "pointer" }}>Cancel</button><button type="button" onClick={confirmLogisticsPlanDecision} disabled={isLogisticsPlanDecisionDisabled()} style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid #203b50", background: "#12364b", color: "#4fd1c5", cursor: isLogisticsPlanDecisionDisabled() ? "not-allowed" : "pointer", opacity: isLogisticsPlanDecisionDisabled() ? 0.55 : 1, fontWeight: 700 }}>Confirm Logistics Decision</button></div>
            </div>
          </div>
        </div>
      ) : null}
      {etaModalOpen ? (
        <div style={{ position: "fixed", inset: 0, background: "rgba(2,6,23,0.76)", display: "grid", placeItems: "center", zIndex: 124, padding: "16px" }}>
          <div style={{ width: "min(560px, calc(100vw - 32px))", borderRadius: "14px", background: "#071827", border: "1px solid #203b50", padding: "18px", color: "#f8fafc" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={headerLabelStyle}>Update ETA</div><div style={{ marginTop: "6px", color: "#cbd5e1" }}>Adjust the estimated arrival time for the active shipment.</div></div><button onClick={closeEtaUpdateModal} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "20px" }}>×</button></div>
            <div style={{ marginTop: "14px", display: "grid", gap: "10px" }}><div style={{ display: "grid", gap: "8px" }}><label style={{ color: "#94a3b8", fontSize: "12px" }}>New ETA</label><input value={etaNewValue} onChange={(e) => setEtaNewValue(e.target.value)} placeholder="YYYY-MM-DD HH:MM" style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#0b1e2b", color: "#f8fafc" }} /></div><div style={{ display: "grid", gap: "8px" }}><label style={{ color: "#94a3b8", fontSize: "12px" }}>Reason for update</label><textarea value={etaReason} onChange={(e) => setEtaReason(e.target.value)} rows={3} style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#0b1e2b", color: "#f8fafc" }} /></div><div style={{ display: "grid", gap: "8px" }}><label style={{ color: "#94a3b8", fontSize: "12px" }}>Updated By</label><input value={etaUpdatedBy} onChange={(e) => setEtaUpdatedBy(e.target.value)} style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#0b1e2b", color: "#f8fafc" }} /></div><div style={{ color: "#94a3b8", fontSize: "12px" }}>Timestamp: {new Date().toLocaleString()}</div><div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}><button onClick={closeEtaUpdateModal} style={{ padding: "8px 12px", borderRadius: "8px", background: "transparent", border: "1px solid #203b50", color: "#cbd5e1" }}>Cancel</button><button onClick={confirmEtaUpdate} disabled={!etaNewValue || !etaReason.trim() || !etaUpdatedBy.trim()} style={{ padding: "8px 12px", borderRadius: "8px", background: "#12364b", border: "1px solid #203b50", color: "#4fd1c5", opacity: !etaNewValue || !etaReason.trim() || !etaUpdatedBy.trim() ? 0.55 : 1 }}>Confirm ETA Update</button></div></div>
          </div>
        </div>
      ) : null}
      {delayModalOpen ? (
        <div style={{ position: "fixed", inset: 0, background: "rgba(2,6,23,0.76)", display: "grid", placeItems: "center", zIndex: 124, padding: "16px" }}>
          <div style={{ width: "min(640px, calc(100vw - 32px))", borderRadius: "14px", background: "#071827", border: "1px solid #203b50", padding: "18px", color: "#f8fafc" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={headerLabelStyle}>Report Delay</div><div style={{ marginTop: "6px", color: "#cbd5e1" }}>Capture delay details and corrective action for this logistics operation.</div></div><button onClick={closeDelayModal} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "20px" }}>×</button></div>
            <div style={{ marginTop: "14px", display: "grid", gap: "10px" }}><textarea value={delayReason} onChange={(e) => setDelayReason(e.target.value)} rows={2} placeholder="Delay reason" style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#0b1e2b", color: "#f8fafc" }} /><input value={delayDuration} onChange={(e) => setDelayDuration(e.target.value)} placeholder="Estimated delay duration" style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#0b1e2b", color: "#f8fafc" }} /><textarea value={delayImpact} onChange={(e) => setDelayImpact(e.target.value)} rows={2} placeholder="Operational impact" style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#0b1e2b", color: "#f8fafc" }} /><textarea value={delayCorrectiveAction} onChange={(e) => setDelayCorrectiveAction(e.target.value)} rows={2} placeholder="Corrective action" style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#0b1e2b", color: "#f8fafc" }} /><input value={delayReportedBy} onChange={(e) => setDelayReportedBy(e.target.value)} placeholder="Reported By" style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#0b1e2b", color: "#f8fafc" }} /><div style={{ color: "#94a3b8", fontSize: "12px" }}>Timestamp: {new Date().toLocaleString()}</div><div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}><button onClick={closeDelayModal} style={{ padding: "8px 12px", borderRadius: "8px", background: "transparent", border: "1px solid #203b50", color: "#cbd5e1" }}>Cancel</button><button onClick={confirmDelayReport} disabled={!delayReason.trim() || !delayDuration.trim() || !delayImpact.trim() || !delayCorrectiveAction.trim() || !delayReportedBy.trim()} style={{ padding: "8px 12px", borderRadius: "8px", background: "#4c1d1d", border: "1px solid #7f1d1d", color: "#fca5a5", opacity: !delayReason.trim() || !delayDuration.trim() || !delayImpact.trim() || !delayCorrectiveAction.trim() || !delayReportedBy.trim() ? 0.55 : 1 }}>Report Delay</button></div></div>
          </div>
        </div>
      ) : null}
      {verificationModalOpen ? (
        <div style={{ position: "fixed", inset: 0, background: "rgba(2,6,23,0.76)", display: "grid", placeItems: "center", zIndex: 124, padding: "16px" }}>
          <div style={{ width: "min(720px, calc(100vw - 32px))", maxHeight: "calc(100vh - 32px)", overflowY: "auto", borderRadius: "14px", background: "#071827", border: "1px solid #203b50", padding: "18px", color: "#f8fafc" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={headerLabelStyle}>Verify Delivery</div><div style={{ marginTop: "6px", color: "#cbd5e1" }}>Confirm final delivery details and proof of receipt.</div></div><button onClick={closeVerificationModal} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "20px" }}>×</button></div>
            <div style={{ marginTop: "14px", display: "grid", gap: "10px" }}><input type="number" value={verificationDeliveredQuantity} onChange={(e) => setVerificationDeliveredQuantity(e.target.value === "" ? "" : parseInt(e.target.value, 10))} placeholder="Delivered quantity" style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#0b1e2b", color: "#f8fafc" }} /><input value={verificationReceivingOrganization} onChange={(e) => setVerificationReceivingOrganization(e.target.value)} placeholder="Receiving organization" style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#0b1e2b", color: "#f8fafc" }} /><input value={verificationReceivingOfficer} onChange={(e) => setVerificationReceivingOfficer(e.target.value)} placeholder="Receiving officer" style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#0b1e2b", color: "#f8fafc" }} /><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}><input type="date" value={verificationDeliveryDate} onChange={(e) => setVerificationDeliveryDate(e.target.value)} style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#0b1e2b", color: "#f8fafc" }} /><input type="time" value={verificationDeliveryTime} onChange={(e) => setVerificationDeliveryTime(e.target.value)} style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#0b1e2b", color: "#f8fafc" }} /></div><input value={verificationProofReference} onChange={(e) => setVerificationProofReference(e.target.value)} placeholder="Proof of delivery reference" style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#0b1e2b", color: "#f8fafc" }} /><select value={verificationCondition} onChange={(e) => setVerificationCondition(e.target.value)} style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#0b1e2b", color: "#f8fafc" }}><option>Good</option><option>Damaged</option><option>Partial</option></select><textarea value={verificationDiscrepancyNotes} onChange={(e) => setVerificationDiscrepancyNotes(e.target.value)} rows={3} placeholder="Discrepancy notes" style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#0b1e2b", color: "#f8fafc" }} /><input value={verificationVerifiedBy} onChange={(e) => setVerificationVerifiedBy(e.target.value)} placeholder="Verified By" style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#0b1e2b", color: "#f8fafc" }} /><div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}><button onClick={closeVerificationModal} style={{ padding: "8px 12px", borderRadius: "8px", background: "transparent", border: "1px solid #203b50", color: "#cbd5e1" }}>Cancel</button><button onClick={confirmVerification} disabled={verificationDeliveredQuantity === "" || !verificationReceivingOrganization || !verificationReceivingOfficer || !verificationDeliveryDate || !verificationDeliveryTime || !verificationProofReference || !verificationVerifiedBy} style={{ padding: "8px 12px", borderRadius: "8px", background: "#12364b", border: "1px solid #203b50", color: "#4fd1c5", opacity: verificationDeliveredQuantity === "" || !verificationReceivingOrganization || !verificationReceivingOfficer || !verificationDeliveryDate || !verificationDeliveryTime || !verificationProofReference || !verificationVerifiedBy ? 0.55 : 1 }}>Verify Delivery</button></div></div>
          </div>
        </div>
      ) : null}
      {organizationReviewModalOpen && organizationReviewRecord ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(2,6,23,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            zIndex: 125,
          }}
        >
          <div
            style={{
              width: "min(980px, calc(100vw - 32px))",
              maxHeight: "calc(100vh - 32px)",
              overflowY: "auto",
              borderRadius: "14px",
              background: "#071827",
              border: "1px solid #203b50",
              padding: "22px",
              color: "#f8fafc",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", alignItems: "start" }}>
              <div>
                <div style={{ color: "#94a3b8", fontSize: "10px", letterSpacing: "1.8px", textTransform: "uppercase" }}>
                  Review Organization Assignment
                </div>
                <h2 style={{ margin: "8px 0 0", fontSize: "24px", color: "#f8fafc" }}>Review Organization Assignment</h2>
                <div style={{ marginTop: "8px", color: "#cbd5e1", maxWidth: "680px" }}>
                  Operator approval is required before an assignment request is sent to the organization.
                </div>
              </div>
              <button
                onClick={closeOrganizationReviewModal}
                style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "22px", lineHeight: 1 }}
                aria-label="Close organization review modal"
              >
                ×
              </button>
            </div>

            <div style={{ marginTop: "18px", display: "grid", gap: "18px" }}>
              <div style={{ padding: "16px", borderRadius: "14px", background: "#0b1e2b", border: "1px solid #203b50" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px" }}>
                  {[
                    ["Incident ID", id],
                    ["Organization ID", organizationReviewRecord.id],
                    ["Organization Name", organizationReviewRecord.name],
                    ["Organization Type", organizationReviewRecord.type],
                    ["Related Assignment", organizationReviewRecord.relatedAssignmentDetail ? `${organizationReviewRecord.relatedAssignment} - ${organizationReviewRecord.relatedAssignmentDetail}` : organizationReviewRecord.relatedAssignment],
                    ["Specialties", organizationReviewRecord.specialties.join(", ")],
                    ["Coverage", organizationReviewRecord.coverage],
                    ["Availability", organizationReviewRecord.availability],
                    ["Capacity", organizationReviewRecord.operationalCapacity],
                    ["Mobilization", organizationReviewRecord.estimatedMobilization],
                    ["Compatibility Score", `${organizationReviewRecord.compatibilityScore}%`],
                    ["Primary Contact", `${organizationReviewRecord.primaryContact} - ${organizationReviewRecord.contactRole}`],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: "grid", gap: "6px" }}>
                      <div style={{ color: "#94a3b8", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px" }}>{label}</div>
                      <div style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: 700 }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: "18px", borderRadius: "14px", background: "#0b1e2b", border: "1px solid #203b50", display: "grid", gap: "16px" }}>
                <div style={{ color: "#94a3b8", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1.5px" }}>Assignment Request Details</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
                  {[
                    { label: "Operational Role", value: organizationOperationalRole, setter: setOrganizationOperationalRole, placeholder: "Enter operational role" },
                    { label: "Assignment Scope", value: organizationAssignmentScope, setter: setOrganizationAssignmentScope, placeholder: "Enter assignment scope" },
                    { label: "Requested Start Date", value: organizationRequestedStartDate, setter: setOrganizationRequestedStartDate, type: "date" },
                    { label: "Requested Start Time", value: organizationRequestedStartTime, setter: setOrganizationRequestedStartTime, type: "time" },
                    { label: "Expected Duration", value: organizationExpectedDuration, setter: setOrganizationExpectedDuration, placeholder: "Enter expected duration" },
                    { label: "HumanOS Coordination Lead", value: organizationCoordinationLead, setter: setOrganizationCoordinationLead, placeholder: "Enter coordination lead" },
                  ].map((field) => (
                    <div key={field.label} style={{ display: "grid", gap: "8px" }}>
                      <label style={{ color: "#94a3b8", fontSize: "11px" }}>{field.label}</label>
                      <input
                        type={field.type ?? "text"}
                        value={field.value}
                        onChange={(e) => field.setter(e.target.value)}
                        placeholder={field.placeholder ?? ""}
                        style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#071827", color: "#f8fafc" }}
                      />
                    </div>
                  ))}
                  <div style={{ display: "grid", gap: "8px" }}>
                    <label style={{ color: "#94a3b8", fontSize: "11px" }}>Priority</label>
                    <select
                      value={organizationPriority}
                      onChange={(e) => setOrganizationPriority(e.target.value)}
                      style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#071827", color: "#f8fafc" }}
                    >
                      <option>Critical</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gap: "8px" }}>
                  <label style={{ color: "#94a3b8", fontSize: "11px" }}>Instructions</label>
                  <textarea
                    value={organizationInstructions}
                    onChange={(e) => setOrganizationInstructions(e.target.value)}
                    rows={4}
                    style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#071827", color: "#f8fafc", resize: "vertical" }}
                  />
                </div>
              </div>

              <div style={{ padding: "18px", borderRadius: "14px", background: "#091d2c", border: "1px solid #203b50", display: "grid", gap: "12px" }}>
                <div style={{ color: "#94a3b8", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1.5px" }}>Operator Decision</div>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {[
                    ["Approve", "Approve Assignment Request"],
                    ["Modify", "Modify Assignment Request"],
                    ["Reject", "Reject Recommendation"],
                  ].map(([value, label]) => (
                    <label key={value} style={{ display: "flex", gap: "8px", alignItems: "center", color: "#e2e8f0" }}>
                      <input
                        type="radio"
                        name="organizationDecision"
                        checked={organizationDecision === value}
                        onChange={() => setOrganizationDecision(value as OperatorAssignmentDecision)}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
                {organizationDecision === "Modify" ? (
                  <div style={{ display: "grid", gap: "8px" }}>
                    <label style={{ color: "#94a3b8", fontSize: "12px" }}>Modification notes</label>
                    <textarea
                      value={organizationDecisionNotes}
                      onChange={(e) => setOrganizationDecisionNotes(e.target.value)}
                      rows={3}
                      placeholder="Notes are required when modifying the assignment request"
                      style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#071827", color: "#f8fafc" }}
                    />
                  </div>
                ) : null}
                {organizationDecision === "Reject" ? (
                  <div style={{ display: "grid", gap: "8px" }}>
                    <label style={{ color: "#94a3b8", fontSize: "12px" }}>Rejection reason</label>
                    <textarea
                      value={organizationRejectionReason}
                      onChange={(e) => setOrganizationRejectionReason(e.target.value)}
                      rows={3}
                      placeholder="Reason is required when rejecting the recommendation"
                      style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#071827", color: "#f8fafc" }}
                    />
                  </div>
                ) : null}
              </div>

              <div style={{ padding: "16px", borderRadius: "12px", background: "#0b1e2b", border: "1px solid #203b50", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
                <div style={{ display: "grid", gap: "4px", color: "#94a3b8", fontSize: "12px" }}>
                  <div>Confirmed By</div>
                  <div style={{ color: "#f8fafc", fontWeight: 700 }}>{operatorName}</div>
                </div>
                <div style={{ display: "grid", gap: "4px", color: "#94a3b8", fontSize: "12px" }}>
                  <div>Confirmed At</div>
                  <div style={{ color: "#f8fafc", fontWeight: 700 }}>{new Date().toLocaleString()}</div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", flexWrap: "wrap" }}>
                <button onClick={closeOrganizationReviewModal} style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid #203b50", background: "transparent", color: "#cbd5e1", cursor: "pointer" }}>Cancel</button>
                <button
                  type="button"
                  onClick={confirmOrganizationDecision}
                  disabled={isOrganizationDecisionDisabled()}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid #203b50",
                    background: "#12364b",
                    color: "#4fd1c5",
                    cursor: isOrganizationDecisionDisabled() ? "not-allowed" : "pointer",
                    opacity: isOrganizationDecisionDisabled() ? 0.55 : 1,
                    fontWeight: 700,
                  }}
                >
                  Confirm Decision
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {dispatchModalOpen ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(2,6,23,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflowY: "auto",
            padding: "16px",
            zIndex: 130,
          }}
        >
          <div
            style={{
              width: "min(960px, calc(100vw - 32px))",
              maxHeight: "calc(100vh - 32px)",
              overflowY: "auto",
              borderRadius: "14px",
              background: "#071827",
              border: "1px solid #203b50",
              padding: "22px",
              color: "#f8fafc",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
              <div>
                <div style={{ color: "#94a3b8", fontSize: "10px", letterSpacing: "1.8px", textTransform: "uppercase" }}>Create Dispatch Order</div>
                <h2 style={{ margin: "8px 0 0", fontSize: "24px", color: "#f8fafc" }}>Create Dispatch Order</h2>
                <div style={{ marginTop: "8px", color: "#cbd5e1", maxWidth: "620px" }}>Prepare transportation and delivery instructions for the approved resource assignment.</div>
              </div>
              <button
                onClick={closeDispatchModal}
                style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "22px", lineHeight: 1 }}
                aria-label="Close dispatch modal"
              >
                ×
              </button>
            </div>

            <div style={{ marginTop: "18px", display: "grid", gap: "18px" }}>
              <div style={{ display: "grid", gap: "12px", padding: "16px", borderRadius: "14px", background: "#0b1e2b", border: "1px solid #203b50" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "14px" }}>
                  {[
                    ["Incident ID", id],
                    ["Origin Signal", signal],
                    ["Resource Name", dispatchSelectedResource?.name ?? "—"],
                    ["Resource Category", dispatchSelectedResource?.category ?? "—"],
                    ["Approved Quantity", String(dispatchSelectedResource?.finalApprovedQuantity ?? dispatchSelectedResource?.proposedQuantity ?? dispatchSelectedResource?.quantity ?? "—")],
                    ["Related Need", dispatchSelectedResource?.assignedNeed ?? dispatchSelectedResource?.relatedNeed ?? needs[0]?.id ?? "—"],
                    ["Source Organization", dispatchSelectedResource?.organization ?? "—"],
                    ["Source Location", dispatchSelectedResource?.region ?? dispatchSelectedResource?.location ?? "—"],
                    ["Destination", location],
                    ["Suitability Score", `${dispatchSelectedResource?.suitability ?? dispatchSelectedResource?.aiSuitability ?? "—"}%`],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: "grid", gap: "6px" }}>
                      <div style={{ color: "#94a3b8", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px" }}>{label}</div>
                      <div style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: 700 }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gap: "16px", padding: "18px", borderRadius: "14px", background: "#0b1e2b", border: "1px solid #203b50" }}>
                <div style={{ display: "grid", gap: "10px" }}>
                  <div style={{ color: "#94a3b8", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1.5px" }}>Dispatch Instructions</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <div style={{ color: "#94a3b8", fontSize: "11px" }}>Dispatch ID</div>
                      <div style={{ marginTop: "8px", padding: "12px", borderRadius: "10px", background: "#071827", border: "1px solid #203b50", color: "#f8fafc", fontWeight: 700 }}>{nextDispatchId}</div>
                    </div>
                    <div>
                      <div style={{ color: "#94a3b8", fontSize: "11px" }}>GPS Tracking</div>
                      <div style={{ marginTop: "8px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        {(["Enabled", "Disabled"] as const).map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setDispatchGpsTracking(option)}
                            style={{
                              padding: "10px 14px",
                              borderRadius: "999px",
                              border: `1px solid ${dispatchGpsTracking === option ? "#2dd4bf" : "#203b50"}`,
                              background: dispatchGpsTracking === option ? "#0f766e" : "#071827",
                              color: "#f8fafc",
                              cursor: "pointer",
                              fontWeight: 700,
                              minWidth: "124px",
                            }}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                  {[
                    { label: "Vehicle Type", value: dispatchVehicleType, setter: setDispatchVehicleType, placeholder: "Enter vehicle type" },
                    { label: "Vehicle ID", value: dispatchVehicleId, setter: setDispatchVehicleId, placeholder: "Enter vehicle ID" },
                    { label: "Driver / Responsible Person", value: dispatchDriver, setter: setDispatchDriver, placeholder: "Enter driver name" },
                    { label: "Departure Date", value: dispatchDepartureDate, setter: setDispatchDepartureDate, type: "date" },
                    { label: "Departure Time", value: dispatchDepartureTime, setter: setDispatchDepartureTime, type: "time" },
                    { label: "Expected Arrival Date", value: dispatchArrivalDate, setter: setDispatchArrivalDate, type: "date" },
                    { label: "Expected Arrival Time", value: dispatchArrivalTime, setter: setDispatchArrivalTime, type: "time" },
                    { label: "Route", value: dispatchRoute, setter: setDispatchRoute, placeholder: "Describe route" },
                    { label: "Transport Organization", value: dispatchTransportOrg, setter: setDispatchTransportOrg, placeholder: "Enter transport org" },
                    { label: "Contact Number", value: dispatchContactNumber, setter: setDispatchContactNumber, placeholder: "Enter contact number" },
                    { label: "Special Instructions", value: dispatchSpecialInstructions, setter: setDispatchSpecialInstructions, placeholder: "Enter any special instructions", multiline: true },
                    { label: "Packing List Reference", value: dispatchPackingListRef, setter: setDispatchPackingListRef, placeholder: "Enter reference" },
                  ].map((field) => (
                    <div key={field.label} style={{ display: "grid", gap: "8px" }}>
                      <label style={{ color: "#94a3b8", fontSize: "11px" }}>{field.label}</label>
                      {field.multiline ? (
                        <textarea
                          value={field.value}
                          onChange={(e) => field.setter(e.target.value)}
                          rows={3}
                          style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#071827", color: "#f8fafc", resize: "vertical" }}
                        />
                      ) : (
                        <input
                          type={field.type ?? "text"}
                          value={field.value}
                          onChange={(e) => field.setter(e.target.value)}
                          placeholder={field.placeholder ?? ""}
                          style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#071827", color: "#f8fafc" }}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ padding: "16px", borderRadius: "12px", background: "#091d2c", border: "1px solid #203b50" }}>
                  <div style={{ color: "#94a3b8", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1.5px" }}>Dispatch Intelligence Assessment</div>
                  <div style={{ marginTop: "14px", display: "grid", gap: "12px" }}>
                    {[
                      ["Route Risk", "Moderate"],
                      ["Estimated Travel Time", "4 hours"],
                      ["Weather Impact", "Moderate"],
                      ["Fuel Readiness", "Confirmed"],
                      ["Vehicle Capacity", "Adequate"],
                      ["Security Coordination", "Required"],
                      ["Dispatch Confidence", "89%"],
                    ].map(([label, value]) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", color: "#e2e8f0", fontSize: "14px" }}>
                        <div>{label}</div>
                        <div style={{ fontWeight: 700, color: "#f8fafc" }}>{value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: "16px", padding: "14px", borderRadius: "12px", background: "#071827", border: "1px solid #203b50", color: "#cbd5e1" }}>
                    Recommendation: Proceed with dispatch after confirming security coordination and driver availability.
                  </div>
                </div>

                <div style={{ padding: "16px", borderRadius: "12px", background: "#091d2c", border: "1px solid #203b50" }}>
                  <div style={{ color: "#94a3b8", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1.5px" }}>Human Decision</div>
                  <div style={{ marginTop: "12px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    {(["Approve", "Modify", "Reject"] as const).map((option) => (
                      <label key={option} style={{ display: "flex", gap: "8px", alignItems: "center", color: "#e2e8f0" }}>
                        <input type="radio" name="dispatchDecision" checked={dispatchDecision === option} onChange={() => setDispatchDecision(option)} />
                        <span>{option} Dispatch Plan</span>
                      </label>
                    ))}
                  </div>
                  {dispatchDecision === "Modify" ? (
                    <div style={{ marginTop: "12px", display: "grid", gap: "8px" }}>
                      <label style={{ color: "#94a3b8", fontSize: "12px" }}>Operator notes</label>
                      <textarea value={dispatchOperatorNotes} onChange={(e) => setDispatchOperatorNotes(e.target.value)} rows={3} placeholder="Required notes when modifying" style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#071827", color: "#f8fafc" }} />
                    </div>
                  ) : null}
                  {dispatchDecision === "Reject" ? (
                    <div style={{ marginTop: "12px", display: "grid", gap: "8px" }}>
                      <label style={{ color: "#94a3b8", fontSize: "12px" }}>Rejection reason</label>
                      <textarea value={dispatchRejectionReason} onChange={(e) => setDispatchRejectionReason(e.target.value)} rows={3} placeholder="Required reason for rejection" style={{ padding: "10px", borderRadius: "10px", border: "1px solid #203b50", background: "#071827", color: "#f8fafc" }} />
                    </div>
                  ) : null}
                </div>

                <div style={{ display: "grid", gap: "8px", padding: "16px", borderRadius: "12px", background: "#0b1e2b", border: "1px solid #203b50" }}>
                  <div style={{ display: "grid", gap: "4px", color: "#94a3b8", fontSize: "12px" }}>
                    <div>Confirmed By</div>
                    <div style={{ color: "#f8fafc", fontWeight: 700 }}>Ricardo Lara</div>
                  </div>
                  <div style={{ display: "grid", gap: "4px", color: "#94a3b8", fontSize: "12px" }}>
                    <div>Confirmed At</div>
                    <div style={{ color: "#f8fafc", fontWeight: 700 }}>{new Date().toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", flexWrap: "wrap" }}>
                <button onClick={closeDispatchModal} style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid #203b50", background: "transparent", color: "#cbd5e1", cursor: "pointer" }}>Cancel</button>
                <button
                  type="button"
                  onClick={confirmCreateDispatchOrder}
                  disabled={isDispatchApprovalDisabled()}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid #203b50",
                    background: "#0b5e4a",
                    color: "#86efac",
                    cursor: isDispatchApprovalDisabled() ? "not-allowed" : "pointer",
                    opacity: isDispatchApprovalDisabled() ? 0.55 : 1,
                    fontWeight: 700,
                  }}
                >
                  Approve & Create Dispatch Order
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {isAssessmentOpen ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(2,6,23,0.7)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            overflowY: "auto",
            padding: "16px",
            zIndex: 100,
          }}
        >
          <div
            style={{
              width: "min(880px, calc(100vw - 32px))",
              maxHeight: "calc(100vh - 32px)",
              overflowY: "auto",
              margin: "16px auto",
              boxSizing: "border-box",
              borderRadius: "12px",
              background: "#071827",
              border: "1px solid #203b50",
              padding: "18px",
              paddingBottom: "40px",
              color: "#f8fafc",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: "#94a3b8", fontSize: "10px", letterSpacing: "1.5px" }}>Operational Intelligence Assessment</div>
                <div style={{ marginTop: "6px", color: "#cbd5e1", fontSize: "14px" }}>HumanOS Operational Intelligence Engine</div>
              </div>
              <button
                onClick={() => setIsAssessmentOpen(false)}
                style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "18px", position: "sticky", top: 8, alignSelf: "flex-start", zIndex: 110 }}
                aria-label="Close assessment"
              >
                ×
              </button>
            </div>

            <div style={{ marginTop: "14px", display: "grid", gap: "14px" }}>
              {/* Section 1: Need Summary */}
              <div style={{ borderRadius: "10px", padding: "12px", background: "#0b1e2b", border: "1px solid #203b50" }}>
                <div style={headerLabelStyle}>Need Summary</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "10px" }}>
                  <div>
                    <div style={{ color: "#94a3b8", fontSize: "12px" }}>Category</div>
                    <div style={{ marginTop: "6px", color: "#e2e8f0" }}>{newNeed.category || "—"}</div>
                  </div>
                  <div>
                    <div style={{ color: "#94a3b8", fontSize: "12px" }}>Quantity</div>
                    <div style={{ marginTop: "6px", color: "#e2e8f0" }}>{newNeed.quantity || "—"} {newNeed.unit || ""}</div>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <div style={{ color: "#94a3b8", fontSize: "12px" }}>Description</div>
                    <div style={{ marginTop: "6px", color: "#e2e8f0" }}>{newNeed.description || "—"}</div>
                  </div>
                  <div>
                    <div style={{ color: "#94a3b8", fontSize: "12px" }}>Location</div>
                    <div style={{ marginTop: "6px", color: "#e2e8f0" }}>{newNeed.location || "—"}</div>
                  </div>
                </div>
              </div>

              {/* Section 2: Suggested Priority + Risk */}
              <div style={{ borderRadius: "10px", padding: "12px", background: "#0b1e2b", border: "1px solid #203b50", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: "#94a3b8", fontSize: "12px" }}>Suggested Priority</div>
                  <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <div style={{ padding: "10px 16px", borderRadius: "999px", fontWeight: 800, fontSize: "18px", ...priorityStyle(aiSuggestedPriority) }}>{aiSuggestedPriority.toUpperCase()}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ color: "#94a3b8", fontSize: "12px" }}>Assessment Confidence</div>
                      <div style={{ fontWeight: 700, fontSize: "16px", color: "#f8fafc" }}>{aiConfidence}%</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "6px" }}>
                      <div style={{ color: "#94a3b8", fontSize: "12px" }}>Risk Score</div>
                      <div style={{ padding: "6px 10px", borderRadius: "8px", background: "#112f2a", color: "#2dd4bf", fontWeight: 800, border: "1px solid #193a35" }}>{riskScore} / 100</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Operational Factors (with risk levels) */}
              <div style={{ borderRadius: "10px", padding: "12px", background: "#0b1e2b", border: "1px solid #203b50" }}>
                <div style={headerLabelStyle}>Operational Factors</div>
                <div style={{ marginTop: "8px", display: "grid", gap: "8px" }}>
                  {operationalFactors.map((f) => {
                    const risk = f.risk;
                    const indicatorStyle: any =
                      risk === "High"
                        ? { background: "#7f1d1d", color: "#fecaca" }
                        : risk === "Moderate"
                        ? { background: "#78350f", color: "#fef3c7" }
                        : { background: "#052e2a", color: "#99f6e4" };

                    return (
                      <div key={f.name} style={{ display: "flex", gap: "12px", alignItems: "center", color: "#e2e8f0", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <div style={{ width: "12px", height: "12px", borderRadius: "999px", ...indicatorStyle }} />
                          <div>{f.name}</div>
                        </div>
                        <div style={{ color: indicatorStyle.color, fontWeight: 700 }}>{risk}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: Operational Assessment Summary */}
              <div style={{ borderRadius: "10px", padding: "12px", background: "#0b1e2b", border: "1px solid #203b50" }}>
                <div style={headerLabelStyle}>Operational Assessment Summary</div>
                <div style={{ marginTop: "8px", color: "#e2e8f0" }}>
                  <p style={{ margin: 0, fontWeight: 700 }}>Executive summary: Inventory shortfalls and a large affected population increase risk; conditions are likely to worsen due to weather.</p>
                  <ul style={{ marginTop: "8px", paddingLeft: "18px", marginBottom: 0 }}>
                    <li>Current inventory is below minimum levels.</li>
                    <li>Population affected exceeds 15,000.</li>
                    <li>Weather forecast indicates worsening conditions.</li>
                  </ul>
                  <p style={{ marginTop: "8px", fontWeight: 700 }}>Recommended priority: {aiSuggestedPriority.toUpperCase()}.</p>
                </div>
              </div>

              {/* Section 4b: AI Impact Forecast */}
              <div style={{ borderRadius: "10px", padding: "12px", background: "#0b1e2b", border: "1px solid #203b50" }}>
                <div style={headerLabelStyle}>AI Impact Forecast</div>
                <div style={{ marginTop: "10px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px" }}>
                  <div style={{ padding: "10px", borderRadius: "8px", background: "#071827", border: "1px solid #203b50" }}>
                    <div style={{ color: "#94a3b8", fontSize: "12px" }}>Estimated people affected</div>
                    <div style={{ marginTop: "6px", fontWeight: 700, color: "#f8fafc" }}>18,400</div>
                  </div>
                  <div style={{ padding: "10px", borderRadius: "8px", background: "#071827", border: "1px solid #203b50" }}>
                    <div style={{ color: "#94a3b8", fontSize: "12px" }}>Estimated response window</div>
                    <div style={{ marginTop: "6px", fontWeight: 700, color: "#f8fafc" }}>12 hours</div>
                  </div>
                  <div style={{ padding: "10px", borderRadius: "8px", background: "#071827", border: "1px solid #203b50" }}>
                    <div style={{ color: "#94a3b8", fontSize: "12px" }}>Estimated resource demand</div>
                    <div style={{ marginTop: "6px", fontWeight: 700, color: "#f8fafc" }}>High</div>
                  </div>
                  <div style={{ padding: "10px", borderRadius: "8px", background: "#071827", border: "1px solid #203b50" }}>
                    <div style={{ color: "#94a3b8", fontSize: "12px" }}>Probability of escalation</div>
                    <div style={{ marginTop: "6px", fontWeight: 700, color: "#f8fafc" }}>68%</div>
                  </div>
                  <div style={{ padding: "10px", borderRadius: "8px", background: "#071827", border: "1px solid #203b50" }}>
                    <div style={{ color: "#94a3b8", fontSize: "12px" }}>Recommended operational level</div>
                    <div style={{ marginTop: "6px", fontWeight: 700, color: "#f8fafc" }}>Regional</div>
                  </div>
                </div>
              </div>

              {/* Section 5: Operator Decision */}
              <div style={{ borderRadius: "10px", padding: "12px", background: "#0b1e2b", border: "1px solid #203b50" }}>
                <div style={headerLabelStyle}>Operator Decision</div>
                <div style={{ marginTop: "8px", display: "grid", gap: "8px" }}>
                  <label style={{ display: "flex", gap: "8px", alignItems: "center", color: "#e2e8f0" }}>
                    <input type="radio" name="opDecision" checked={operatorDecision === "AI"} onChange={() => setOperatorDecision("AI")} />
                    <div>Use AI Recommendation</div>
                  </label>
                  <label style={{ display: "flex", gap: "8px", alignItems: "center", color: "#e2e8f0" }}>
                    <input type="radio" name="opDecision" checked={operatorDecision === "Override"} onChange={() => setOperatorDecision("Override")} />
                    <div>Override Recommendation</div>
                  </label>

                  {operatorDecision === "Override" ? (
                    <div style={{ display: "grid", gap: "8px" }}>
                      <select value={overridePriority} onChange={(e) => setOverridePriority(e.target.value)} style={{ padding: "8px", borderRadius: "8px", background: "#071827", border: "1px solid #203b50", color: "#f8fafc" }}>
                        <option value="">Select priority</option>
                        <option>Critical</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                      <textarea value={overrideReason} onChange={(e) => setOverrideReason(e.target.value)} placeholder="Reason for override (required)" rows={3} style={{ padding: "8px", borderRadius: "8px", background: "#071827", border: "1px solid #203b50", color: "#f8fafc" }} />
                    </div>
                  ) : null}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                <button onClick={() => setIsAssessmentOpen(false)} style={{ padding: "8px 12px", borderRadius: "8px", background: "transparent", border: "1px solid #203b50", color: "#cbd5e1", cursor: "pointer" }}>Back</button>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => { setIsAssessmentOpen(false); setIsAddModalOpen(false); }} style={{ padding: "8px 12px", borderRadius: "8px", background: "transparent", border: "1px solid #203b50", color: "#cbd5e1", cursor: "pointer" }}>Cancel</button>
                  {/** Disable approve when override selected but no priority/reason */}
                  {(() => {
                    const isDisabled = operatorDecision === "Override" && (!overridePriority || overridePriority === "" || overrideReason.trim().length === 0);
                    return (
                      <button
                        onClick={approveAndCreate}
                        disabled={isDisabled}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "8px",
                          background: "#12364b",
                          border: "1px solid #203b50",
                          color: "#4fd1c5",
                          cursor: isDisabled ? "not-allowed" : "pointer",
                          fontWeight: 700,
                          opacity: isDisabled ? 0.5 : 1,
                        }}
                      >
                        Approve & Create Need
                      </button>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
