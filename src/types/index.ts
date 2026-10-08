export type BlockId = 
  | 'main_block'
  | 'library'
  | 'lab_block'
  | 'hostel'
  | 'canteen'
  | 'admin_block'
  | 'sports_area';

export type IssueCategory = 
  | 'Electrical'
  | 'Plumbing'
  | 'HVAC'
  | 'Structural'
  | 'IT / AV'
  | 'Furniture'
  | 'Safety';

export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type IssueStatus = 
  | 'SUBMITTED'
  | 'VERIFIED'
  | 'ASSIGNED'
  | 'IN PROGRESS'
  | 'RESOLVED';

export interface TimelineEntry {
  id: string;
  stage: IssueStatus;
  timestamp: string;
  actor: string;
  role: string;
  note: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  blockId: BlockId;
  locationDetails: string;
  floor: string;
  category: IssueCategory;
  priority: IssuePriority;
  status: IssueStatus;
  submittedBy: {
    name: string;
    role: 'Student' | 'Faculty' | 'Staff' | 'Administrator';
    department: string;
    email: string;
    idNumber: string;
    roomOrOffice?: string;
  };
  submittedDate: string;
  assignedStaff?: {
    id: string;
    name: string;
    trade: string;
    phone: string;
  };
  equipmentTag?: string;
  history: TimelineEntry[];
  estimatedResolutionHours?: number;
  resolvedAt?: string;
  feedback?: {
    rating: number;
    comment: string;
    submittedAt: string;
    studentName: string;
  };
}

export interface CampusBlockInfo {
  id: BlockId;
  code: string;
  name: string;
  subTitle: string;
  floorsCount: number;
  supervisor: string;
  totalRooms: number;
  description: string;
  buildingType: string;
  dimensions: string;
  builtYear: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  trade: IssueCategory;
  phone: string;
  email: string;
  status: 'On Duty' | 'Dispatched' | 'Off Duty';
  currentAssignedCount: number;
  totalResolvedCount: number;
  department: string;
}

export interface DepartmentInfo {
  id: string;
  name: string;
  code: string;
  headOfDepartment: string;
  officeLocation: string;
  staffCount: number;
  openIssuesCount: number;
  slaCompliancePercent: number;
  avgResolutionHours: number;
}
