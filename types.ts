
export enum RiskCategory {
  TECHNICAL = 'Technical',
  RESOURCE = 'Resource',
  TIMELINE = 'Timeline',
  BUDGET = 'Budget',
  OTHER = 'Other'
}

export enum RiskPriority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export interface RiskItem {
  id: string;
  summary: string;
  category: RiskCategory;
  mitigation: string;
  priority: RiskPriority;
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  results: RiskItem[];
}
