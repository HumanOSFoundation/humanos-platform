"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";

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

export default function IncidentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const rawId = params?.id;
const id = Array.isArray(rawId) ? rawId[0] : rawId ?? "INC-UNKNOWN";
  const signal = searchParams.get("signal") ?? `SIG-${id.replace(/^INC-/, "")}`;
  const title = searchParams.get("title") ?? "HumanOS Incident Workspace";
  const severity = searchParams.get("severity") ?? "High";
  const location = searchParams.get("location") ?? "Unknown Location";
  const description =
    searchParams.get("description") ?? "No description available for this incident.";
  const status = "OPEN";
  const assignedTo = "Unassigned";
  const createdBy = "HumanOS";

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
      region: "Coastal Zone",
      availability: "Available",
      quantity: 5000,
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
      region: "Central",
      availability: "Reserved",
      quantity: 1200,
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
      region: "North",
      availability: "In Transit",
      quantity: 400,
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
      region: "Coastal Zone",
      availability: "Unavailable",
      quantity: 0,
      distanceKm: 80,
      etaHours: 18,
      suitability: 60,
      status: "Unavailable",
    },
  ];

  const [resources, setResources] = useState(initialResources);
  const [resourceFilters, setResourceFilters] = useState({ category: "", organization: "", region: "", availability: "" });
  const [resourceSearch, setResourceSearch] = useState("");
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [resourceAlert, setResourceAlert] = useState<string | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewResource, setReviewResource] = useState<any>(null);
  const [reviewProposedQty, setReviewProposedQty] = useState<number | "">("");
  const [reviewDecision, setReviewDecision] = useState<"Approve" | "Modify" | "Reject">("Approve");
  const [reviewNotes, setReviewNotes] = useState<string>("");
  const [reviewSelectedNeed, setReviewSelectedNeed] = useState<string | null>(needs.length ? needs[0].id : null);

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
          const newReserved = (((r as any).reservedQty) || 0) + proposedQtyNum;
          const total = (r as any).quantity || 0;
          const newAvailable = Math.max(0, total - newReserved);
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
    setResources((prev) => prev.map((r) => (r.id === id ? { ...r, availability: "Reserved", status: "Reserved" } : r)));
  };

  const filteredResources = resources.filter((r) => {
    if (resourceFilters.category && r.category !== resourceFilters.category) return false;
    if (resourceFilters.organization && r.organization !== resourceFilters.organization) return false;
    if (resourceFilters.region && r.region !== resourceFilters.region) return false;
    if (resourceFilters.availability && r.availability !== resourceFilters.availability) return false;
    if (resourceSearch && !(`${r.name} ${r.id} ${r.category} ${r.organization}`.toLowerCase().includes(resourceSearch.toLowerCase()))) return false;
    return true;
  });

  const availableCount = resources.filter((r) => r.availability === "Available").length;
  const reservedCount = resources.filter((r) => r.availability === "Reserved").length;
  const inTransitCount = resources.filter((r) => r.availability === "In Transit").length;
  const deliveredCount = resources.filter((r) => r.status === "Delivered").length;
  const unavailableCount = resources.filter((r) => r.availability === "Unavailable").length;

  const approvedCount = resources.filter((r) => (r.availability === "Reserved") || String(((r as any).operatorDecision || "")).toLowerCase().includes("approved")).length;

  const recommendedResources = resources
    .slice()
    .sort((a, b) => b.suitability - a.suitability)
    .slice(0, 4);

  const allRecommendedApproved = recommendedResources.length > 0 && recommendedResources.every((r) => (r.availability === "Reserved") || String(((r as any).operatorDecision || "")).toLowerCase().includes("approved"));

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
                  ["Resources Assigned", String(reservedCount)],
                  ["Organizations Assigned", "0"],
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
                          ["Available Resources", String(availableCount)],
                          ["Reserved", String(reservedCount)],
                          ["In Transit", String(inTransitCount)],
                          ["Delivered", String(deliveredCount)],
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
                            const availableLabel = rec.quantityAvailable ?? rec.quantity ?? rec.available ?? "—";
                            const approved = rec.availability === "Reserved" || (rec.operatorDecision && String(rec.operatorDecision).toLowerCase().includes("approved"));
                            const rejected = rec.operatorDecision === "Rejected" || rec.status === "Rejected";
                            const badge = approved ? "ALLOCATION APPROVED" : rejected ? "RECOMMENDATION REJECTED" : idx === 0 ? "BEST MATCH" : undefined;
                            return (
                              <div key={rec.id ?? idx} onClick={() => setSelectedResource(rec)} style={{ padding: "14px", borderRadius: "12px", background: idx === 0 ? "linear-gradient(180deg,#07232b,#0b2b2a)" : "#091d2c", border: approved ? "1px solid #10b981" : idx === 0 ? "1px solid #2dd4bf" : "1px solid #203b50", display: "grid", gap: "8px", cursor: "pointer" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <div style={{ fontWeight: 800, color: "#f8fafc" }}>{rec.name}</div>
                                  {badge ? <div style={{ fontSize: "11px", color: approved ? "#042f2e" : "#071827", background: approved ? "#86efac" : "#fef3c7", padding: "6px 10px", borderRadius: "999px", fontWeight: 800 }}>{approved ? "ALLOCATION APPROVED" : rejected ? "RECOMMENDATION REJECTED" : "AI RECOMMENDATION — NOT APPROVED"}</div> : null}
                                </div>
                                <div style={{ color: "#94a3b8", fontSize: "13px" }}>{rec.category}</div>
                                <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: "4px" }}>Organization: {rec.organization ?? "—"} • Location: {rec.region ?? rec.location ?? "—"}</div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <div style={{ color: "#cbd5e1" }}>{availableLabel}</div>
                                  <div style={{ fontWeight: 800, fontSize: "18px", color: "#f8fafc" }}>{rec.suitability ?? rec.aiSuitability ?? "—"}%</div>
                                </div>
                                <div style={{ display: "flex", gap: "12px", color: "#94a3b8", marginTop: "6px" }}>
                                  <div>Distance: {rec.distanceKm ?? rec.distance ?? "—"}</div>
                                  <div>ETA: {rec.etaHours ? `${rec.etaHours}h` : rec.eta ?? "—"}</div>
                                  <div>Status: {rec.availability ?? rec.status ?? "—"}</div>
                                </div>
                                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "8px" }}>
                                  {approved ? (
                                    <div style={{ display: "grid", gap: "8px", alignItems: "end" }}>
                                      <div style={{ display: "grid", gap: "4px", textAlign: "right" }}>
                                        <div style={{ fontSize: "13px", color: "#94a3b8" }}>Approved Quantity: <strong style={{ color: "#f8fafc" }}>{rec.finalApprovedQuantity ?? rec.proposedQuantity ?? "—"}</strong></div>
                                        <div style={{ fontSize: "13px", color: "#94a3b8" }}>Approved By: <strong style={{ color: "#f8fafc" }}>{rec.confirmedBy ?? "—"}</strong></div>
                                        <div style={{ fontSize: "13px", color: "#94a3b8" }}>Approved At: <strong style={{ color: "#f8fafc" }}>{rec.confirmedAt ? new Date(rec.confirmedAt).toLocaleString() : "Just now"}</strong></div>
                                      </div>
                                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                          {/* Compact workflow */}
                                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                            {[
                                              ["Reserved", "completed"],
                                              ["Dispatch Ordered", "current"],
                                              ["Loaded", "pending"],
                                              ["In Transit", "pending"],
                                              ["Delivered", "pending"],
                                              ["Verified", "pending"],
                                            ].map(([label, state]: any, i:number) => (
                                              <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 64 }}>
                                                <div style={{ width: 18, height: 18, borderRadius: 999, display: "grid", placeItems: "center", background: state === "completed" ? "#2dd4bf" : state === "current" ? "#60a5fa" : "#475569", color: "#071827", fontSize: 10, fontWeight: 800 }}>{state === "completed" ? "✓" : i+1}</div>
                                                <div style={{ marginTop: 4, fontSize: 10, color: state === "completed" || state === "current" ? "#cbd5e1" : "#64748b" }}>{label}</div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                      <button style={{ padding: "8px 12px", borderRadius: "8px", background: "#0b5e4a", border: "1px solid #064e3b", color: "#86efac", cursor: "pointer", fontWeight: 700 }}>Create Dispatch Order</button>
                                    </div>
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
                          <div style={headerLabelStyle}>AI Optimization Panel</div>
                          <div style={{ marginTop: "8px", display: "grid", gap: "8px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8" }}>
                              <div>Estimated savings</div>
                              <div style={{ fontWeight: 800, color: "#f8fafc" }}>$42,300</div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8" }}>
                              <div>Optimization score</div>
                              <div style={{ fontWeight: 800, color: "#f8fafc" }}>87</div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8" }}>
                              <div>Estimated time reduction</div>
                              <div style={{ fontWeight: 800, color: "#f8fafc" }}>2 hours</div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8" }}>
                              <div>Fuel reduction</div>
                              <div style={{ fontWeight: 800, color: "#f8fafc" }}>18%</div>
                            </div>
                            <div style={{ color: "#cbd5e1" }}>{allRecommendedApproved ? "All recommended resources have been approved. Proceed with dispatch planning and logistics coordination." : "Recommendation: Reallocate water containers from Central Depot to Coastal Zone using expedited transport."}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Inventory and map */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={headerLabelStyle}>Resource Inventory</div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <input placeholder="Search" style={{ padding: "8px", borderRadius: "8px", border: "1px solid #203b50", background: "#071827", color: "#f8fafc" }} />
                          <select style={{ padding: "8px", borderRadius: "8px", border: "1px solid #203b50", background: "#071827", color: "#f8fafc" }}>
                            <option>Category</option>
                          </select>
                          <select style={{ padding: "8px", borderRadius: "8px", border: "1px solid #203b50", background: "#071827", color: "#f8fafc" }}>
                            <option>Organization</option>
                          </select>
                          <select style={{ padding: "8px", borderRadius: "8px", border: "1px solid #203b50", background: "#071827", color: "#f8fafc" }}>
                            <option>Region</option>
                          </select>
                          <select style={{ padding: "8px", borderRadius: "8px", border: "1px solid #203b50", background: "#071827", color: "#f8fafc" }}>
                            <option>Availability</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ marginTop: "12px", overflowX: "auto" }}>
                        <div style={{ width: "100%", minWidth: "900px" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr", gap: "12px", padding: "12px 0", borderBottom: "1px solid #203b50", color: "#94a3b8", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>
                            <div>Resource</div>
                            <div>Category</div>
                            <div>Total Quantity</div>
                            <div>Available</div>
                            <div>Reserved</div>
                            <div>Status</div>
                            <div>Location</div>
                            <div>Organization</div>
                          </div>

                          {[
                            ["Water Bottles","Water",8000,4200,3800,"Available","Miami Warehouse","HumanOS Logistics"],
                            ["Emergency Medical Kits","Medical",1200,300,900,"Limited","Regional Medical Depot","Red Cross"],
                            ["Family Food Kits","Food",5000,2500,2500,"Available","Central Distribution Center","Regional Relief Network"],
                            ["Transport Trucks","Transport",18,4,14,"Critical","Coastal Operations Base","HumanOS Logistics"],
                            ["Temporary Shelter Units","Shelter",600,450,150,"Available","Southern Storage Facility","Civil Defense"],
                          ].map((r:any, i:number) => {
                            const status = r[5] as string;
                            const statusColor = status === "Available" ? "#2dd4bf" : status === "Limited" ? "#f59e0b" : status === "Critical" ? "#ef4444" : "#64748b";
                            return (
                              <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr", gap: "12px", padding: "12px 0", borderBottom: "1px solid #203b50", color: "#cbd5e1", fontSize: "13px", alignItems: "center" }}>
                                <div>{r[0]}</div>
                                <div>{r[1]}</div>
                                <div>{r[2]}</div>
                                <div>{r[3]}</div>
                                <div>{r[4]}</div>
                                <div><span style={{ padding: "6px 10px", borderRadius: "999px", background: "#0f172a", color: statusColor, fontWeight: 800 }}>{status}</span></div>
                                <div>{r[6]}</div>
                                <div>{r[7]}</div>
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
                              <div style={{ color: "#94a3b8", marginTop: "6px" }}>{selectedResource.category}</div>
                              <div style={{ marginTop: "8px" }}>Available: <strong>{selectedResource.available}</strong></div>
                              <div>Reserved: <strong>{selectedResource.reservedQty ?? selectedResource.reserved ?? selectedResource.finalApprovedQuantity ?? "—"}</strong></div>
                              <div>Location: <strong>{selectedResource.location ?? selectedResource.region ?? "—"}</strong></div>
                              <div>Organization: <strong>{selectedResource.organization ?? "—"}</strong></div>
                              <div>ETA: <strong>{selectedResource.etaHours ? `${selectedResource.etaHours}h` : selectedResource.eta ?? "—"}</strong></div>
                              <div>Suitability: <strong>{selectedResource.suitability ?? selectedResource.aiSuitability ?? "—"}%</strong></div>
                              <div>Status: <strong>{selectedResource.availability ?? selectedResource.status ?? "—"}</strong></div>
                              {selectedResource.finalApprovedQuantity ? (
                                <div style={{ marginTop: "8px", color: "#94a3b8" }}>
                                  <div>Approved Quantity: <strong style={{ color: "#f8fafc" }}>{selectedResource.finalApprovedQuantity}</strong></div>
                                  <div>Approved By: <strong style={{ color: "#f8fafc" }}>{selectedResource.confirmedBy ?? "—"}</strong></div>
                                  <div>Approved At: <strong style={{ color: "#f8fafc" }}>{selectedResource.confirmedAt ? new Date(selectedResource.confirmedAt).toLocaleString() : "—"}</strong></div>
                                </div>
                              ) : null}
                              <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                                <button style={{ padding: "8px 12px", borderRadius: "8px", background: "transparent", border: "1px solid #203b50", color: "#cbd5e1" }}>View Inventory</button>
                                {selectedResource.availability === "Reserved" ? (
                                  <button style={{ padding: "8px 12px", borderRadius: "8px", background: "#0b5e4a", border: "1px solid #064e3b", color: "#86efac", cursor: "pointer", fontWeight: 700 }}>Create Dispatch Order</button>
                                ) : (
                                  <button onClick={() => { if (selectedResource.id) allocateResource(selectedResource.id); }} style={{ padding: "8px 12px", borderRadius: "8px", background: "#12364b", border: "1px solid #203b50", color: "#4fd1c5" }}>Reserve Resource</button>
                                )}
                                <button style={{ padding: "8px 12px", borderRadius: "8px", background: "#12364b", border: "1px solid #203b50", color: "#4fd1c5" }}>Create Deployment</button>
                              </div>
                            </div>
                          ) : (
                            <div style={{ marginTop: "12px", color: "#94a3b8" }}>No resource selected.</div>
                          )}
                        </div>
                      </div>
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
