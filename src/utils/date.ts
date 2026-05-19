export function getDaysInMonth(year: number, month: number): Date[] {
  const date = new Date(year, month, 1);
  const days: Date[] = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export function generateCalendarGrid(year: number, month: number): Date[] {
  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday, 1 is Monday...
  const prevMonthDaysCount = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // Assuming Monday as start of week
  
  const grid: Date[] = [];
  
  // Previous month days
  for (let i = prevMonthDaysCount; i > 0; i--) {
    grid.push(new Date(year, month, 1 - i));
  }
  
  // Current month days
  const currentMonthDays = getDaysInMonth(year, month);
  grid.push(...currentMonthDays);
  
  // Next month days to complete 42 cells (6 rows * 7 columns)
  const remainingDays = 42 - grid.length;
  for (let i = 1; i <= remainingDays; i++) {
    grid.push(new Date(year, month + 1, i));
  }
  
  return grid;
}

export function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getWeekDays(date: Date): Date[] {
  const currentDay = date.getDay();
  const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  
  const monday = new Date(date);
  monday.setDate(date.getDate() + distanceToMonday);
  monday.setHours(0, 0, 0, 0);
  
  const weekDays: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    weekDays.push(day);
  }
  return weekDays;
}

export const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};
