export const defaultSubjects = [
  { name: "Digital Logic Design", semester: "Semester 1" },
  { name: "Computer Architecture", semester: "Semester 2" },
  { name: "Microprocessors and Interfacing", semester: "Semester 3" },
  { name: "Operating Systems", semester: "Semester 4" },
  { name: "Computer Networks", semester: "Semester 5" },
  { name: "Embedded Systems", semester: "Semester 6" },
];

export const defaultGroups = [
  {
    id: "group-demo-1",
    name: "Embedded Systems Lab Team",
    admin: "Ayesha Fernando",
    members: ["Ayesha Fernando", "You", "Kavindu Silva", "Nimal Perera"],
  },
  {
    id: "group-demo-2",
    name: "Network Security Project Crew",
    admin: "Kavindu Silva",
    members: ["Kavindu Silva", "You", "Dinuka Jayasinghe", "Sahan Perera"],
  },
];

export const dummyUsers = [
  {
    id: "user-demo-1",
    registrationNo: "IN0-20250702-002",
    name: "P.S.P. Peiris Pitigalage Sarath Prasanna Peiris",
  },
  {
    id: "user-demo-2",
    registrationNo: "IN0-20250702-005",
    name: "K.H. Hashan Madumadawa Koku Hannadige Hashan Madumadawa",
  },
  {
    id: "user-demo-3",
    registrationNo: "IN0-20250702-017",
    name: "Ayesha Fernando",
  },
  {
    id: "user-demo-4",
    registrationNo: "IN0-20250702-024",
    name: "Kavindu Silva",
  },
  {
    id: "user-demo-5",
    registrationNo: "IN0-20250702-041",
    name: "Nimal Perera",
  },
];

export const demoSubjectCounts = {
  "Digital Logic Design": { notes: 4, documents: 5 },
  "Computer Architecture": { notes: 5, documents: 6 },
  "Microprocessors and Interfacing": { notes: 4, documents: 5 },
  "Operating Systems": { notes: 4, documents: 4 },
  "Computer Networks": { notes: 5, documents: 5 },
  "Embedded Systems": { notes: 6, documents: 7 },
};

export const dummyNotes = [
  {
    id: "ce-demo-1",
    title: "RISC-V Pipeline Hazard Notes",
    content: "Forwarding, stalls, and branch prediction summary for the five-stage CPU pipeline lab.",
    createdAt: "2026-05-22T00:00:00.000Z",
    userId: "demo",
    tags: ["Computer Architecture"],
    attachmentName: "riscv-pipeline-hazards.pdf",
  },
  {
    id: "ce-demo-2",
    title: "Verilog ALU Simulation Pack",
    content: "ALU opcode table, testbench traces, and waveform screenshots for Digital Logic Design.",
    createdAt: "2026-05-18T00:00:00.000Z",
    userId: "demo",
    tags: ["Digital Logic Design"],
    attachmentName: "verilog-alu-testbench.pdf",
  },
  {
    id: "ce-demo-3",
    title: "ARM Cortex-M Sensor Node Log",
    content: "GPIO setup, ADC sampling notes, interrupt timing, and UART debug captures.",
    createdAt: "2026-05-12T00:00:00.000Z",
    userId: "demo",
    tags: ["Embedded Systems"],
    attachmentName: "cortex-m-sensor-node.pdf",
  },
  {
    id: "ce-demo-4",
    title: "Round-Robin Scheduler Comparison",
    content: "CPU scheduling metrics comparing FCFS, SJF, priority, and round-robin workloads.",
    createdAt: "2026-04-30T00:00:00.000Z",
    userId: "demo",
    tags: ["Operating Systems"],
    attachmentName: "",
  },
  {
    id: "ce-demo-5",
    title: "TCP Congestion Control Lab",
    content: "Packet capture analysis for slow start, congestion avoidance, and retransmission behavior.",
    createdAt: "2026-04-21T00:00:00.000Z",
    userId: "demo",
    tags: ["Computer Networks"],
    attachmentName: "tcp-congestion-lab.pdf",
  },
  {
    id: "ce-demo-6",
    title: "PCB Bring-up Checklist",
    content: "Power rail checks, oscillator validation, SWD programming, and peripheral smoke tests.",
    createdAt: "2026-04-08T00:00:00.000Z",
    userId: "demo",
    tags: ["Microprocessors and Interfacing"],
    attachmentName: "",
  },
];

export const dummyNoteMeta = {
  "ce-demo-1": { subject: "Computer Architecture", semester: "Semester 2", category: "Lecture", visibility: "global", author: "Ayesha Fernando", attachmentName: "riscv-pipeline-hazards.pdf", documents: ["riscv-pipeline-hazards.pdf", "pipeline-datapath.png", "hazard-unit-truth-table.xlsx"] },
  "ce-demo-2": { subject: "Digital Logic Design", semester: "Semester 1", category: "Tutorial", visibility: "private", author: "You", attachmentName: "verilog-alu-testbench.pdf", documents: ["verilog-alu-testbench.pdf", "alu-waveform.png", "logic-gates-reference.docx"] },
  "ce-demo-3": { subject: "Embedded Systems", semester: "Semester 6", category: "Lecture", visibility: "group", groupId: "group-demo-1", author: "Nimal Perera", attachmentName: "cortex-m-sensor-node.pdf", documents: ["cortex-m-sensor-node.pdf", "adc-sampling-trace.png", "uart-debug-log.xlsx"] },
  "ce-demo-4": { subject: "Operating Systems", semester: "Semester 4", category: "Summary", visibility: "group", sharedByMe: true, sharedTo: "group", groupId: "group-demo-2", author: "You", attachmentName: "", documents: ["scheduler-gantt-chart.png", "os-scheduling-summary.docx"] },
  "ce-demo-5": { subject: "Computer Networks", semester: "Semester 5", category: "Assignment", visibility: "global", author: "Kavindu Silva", attachmentName: "tcp-congestion-lab.pdf", documents: ["tcp-congestion-lab.pdf", "wireshark-capture.png", "network-topology.pptx"] },
  "ce-demo-6": { subject: "Microprocessors and Interfacing", semester: "Semester 3", category: "Exam Notes", visibility: "private", author: "You", attachmentName: "", documents: ["pcb-bringup-checklist.docx", "power-rail-measurements.xlsx", "swd-programming-notes.png"] },
};
