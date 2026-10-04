export type BlockType = 'study' | 'break' | 'revision';

export interface TimelineItem {
  id: string;
  type: BlockType;
  title: string;
  timeRange: string;
  durationMinutes: number;
  taskDescription: string;
  tip?: string;
  completed?: boolean;
}

export interface StudyPlan {
  modelUsed: string;
  situationSummary: string;
  studentDiagnosis: string;
  totalDurationMinutes: number;
  timeline: TimelineItem[];
  motivationalMessage: string;
  antiProcrastinationTip: string;
}
