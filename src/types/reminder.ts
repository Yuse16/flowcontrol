export type ReminderStatus = 'pending' | 'active' | 'dismissed';
export type ReminderType = 'critical' | 'followup';

export interface Reminder {
  id: string;
  message: string;
  targetTime: number; // Timestamp
  status: ReminderStatus;
  type: ReminderType;
  createdAt: number;
}
