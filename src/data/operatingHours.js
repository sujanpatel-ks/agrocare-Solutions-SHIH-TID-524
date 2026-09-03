/**
 * Mock Operating Hours Data & Status Evaluator for Fertilizer Suppliers
 */

export const DEFAULT_OPERATING_HOURS = {
  weekday: { open: '08:00', close: '20:00', label: '8:00 AM – 8:00 PM' },
  saturday: { open: '08:00', close: '20:00', label: '8:00 AM – 8:00 PM' },
  sunday: { open: '09:00', close: '14:00', label: '9:00 AM – 2:00 PM', isClosed: false }
};

export const CUSTOM_SHOP_HOURS = {
  1: {
    weekday: { open: '08:00', close: '20:30', label: '8:00 AM – 8:30 PM' },
    saturday: { open: '08:00', close: '20:30', label: '8:00 AM – 8:30 PM' },
    sunday: { open: '08:30', close: '15:00', label: '8:30 AM – 3:00 PM', isClosed: false }
  },
  2: {
    weekday: { open: '07:30', close: '20:00', label: '7:30 AM – 8:00 PM' },
    saturday: { open: '07:30', close: '20:00', label: '7:30 AM – 8:00 PM' },
    sunday: { open: '08:00', close: '14:00', label: '8:00 AM – 2:00 PM', isClosed: false }
  },
  3: {
    weekday: { open: '08:30', close: '19:30', label: '8:30 AM – 7:30 PM' },
    saturday: { open: '08:30', close: '19:30', label: '8:30 AM – 7:30 PM' },
    sunday: { open: '09:00', close: '13:00', label: '9:00 AM – 1:00 PM', isClosed: false }
  },
  4: {
    weekday: { open: '08:00', close: '20:00', label: '8:00 AM – 8:00 PM' },
    saturday: { open: '08:00', close: '20:00', label: '8:00 AM – 8:00 PM' },
    sunday: { open: '09:00', close: '14:00', label: '9:00 AM – 2:00 PM', isClosed: false }
  },
  5: {
    weekday: { open: '08:00', close: '19:00', label: '8:00 AM – 7:00 PM' },
    saturday: { open: '08:00', close: '19:00', label: '8:00 AM – 7:00 PM' },
    sunday: { open: '00:00', close: '00:00', label: 'Closed (Sahakari Weekly Off)', isClosed: true }
  },
  6: {
    weekday: { open: '08:00', close: '20:00', label: '8:00 AM – 8:00 PM' },
    saturday: { open: '08:00', close: '20:00', label: '8:00 AM – 8:00 PM' },
    sunday: { open: '08:30', close: '14:30', label: '8:30 AM – 2:30 PM', isClosed: false }
  },
  7: {
    weekday: { open: '09:00', close: '18:30', label: '9:00 AM – 6:30 PM' },
    saturday: { open: '09:00', close: '17:00', label: '9:00 AM – 5:00 PM' },
    sunday: { open: '00:00', close: '00:00', label: 'Closed', isClosed: true }
  },
  8: {
    weekday: { open: '08:00', close: '20:00', label: '8:00 AM – 8:00 PM' },
    saturday: { open: '08:00', close: '20:00', label: '8:00 AM – 8:00 PM' },
    sunday: { open: '09:00', close: '14:00', label: '9:00 AM – 2:00 PM', isClosed: false }
  },
  9: {
    weekday: { open: '07:30', close: '20:30', label: '7:30 AM – 8:30 PM' },
    saturday: { open: '07:30', close: '20:30', label: '7:30 AM – 8:30 PM' },
    sunday: { open: '08:00', close: '15:00', label: '8:00 AM – 3:00 PM', isClosed: false }
  },
  10: {
    weekday: { open: '08:30', close: '19:30', label: '8:30 AM – 7:30 PM' },
    saturday: { open: '08:30', close: '19:30', label: '8:30 AM – 7:30 PM' },
    sunday: { open: '09:00', close: '13:00', label: '9:00 AM – 1:00 PM', isClosed: false }
  },
  11: {
    weekday: { open: '08:00', close: '20:00', label: '8:00 AM – 8:00 PM' },
    saturday: { open: '08:00', close: '20:00', label: '8:00 AM – 8:00 PM' },
    sunday: { open: '08:30', close: '14:00', label: '8:30 AM – 2:00 PM', isClosed: false }
  },
  12: {
    weekday: { open: '09:00', close: '18:00', label: '9:00 AM – 6:00 PM' },
    saturday: { open: '09:00', close: '16:00', label: '9:00 AM – 4:00 PM' },
    sunday: { open: '00:00', close: '00:00', label: 'Closed (Weekly Off)', isClosed: true }
  },
  19: {
    weekday: { open: '09:00', close: '18:30', label: '9:00 AM – 6:30 PM' },
    saturday: { open: '09:00', close: '17:00', label: '9:00 AM – 5:00 PM' },
    sunday: { open: '00:00', close: '00:00', label: 'Closed', isClosed: true }
  }
};

/**
 * Format 24-hour time "08:00" to "8:00 AM"
 */
function formatTime12h(timeStr) {
  if (!timeStr) return '';
  const [hStr, mStr] = timeStr.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr || '0', 10);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  const displayM = m > 0 ? `:${m.toString().padStart(2, '0')}` : ':00';
  return `${displayH}${displayM} ${period}`;
}

/**
 * Parses time string "HH:mm" into minutes from midnight
 */
function toMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}

/**
 * Evaluates the real-time or mock operating status for a supplier
 * @param {Object} shop
 * @param {Date} [currentTime]
 * @returns {Object} operating status breakdown
 */
export function getShopOperatingStatus(shop, currentTime = new Date()) {
  const schedule = CUSTOM_SHOP_HOURS[shop.id] || shop.operatingHours || DEFAULT_OPERATING_HOURS;
  
  const dayOfWeek = currentTime.getDay(); // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  let todayRule;
  let dayName;

  if (dayOfWeek === 0) {
    todayRule = schedule.sunday || DEFAULT_OPERATING_HOURS.sunday;
    dayName = 'Sunday';
  } else if (dayOfWeek === 6) {
    todayRule = schedule.saturday || schedule.weekday || DEFAULT_OPERATING_HOURS.saturday;
    dayName = 'Saturday';
  } else {
    todayRule = schedule.weekday || DEFAULT_OPERATING_HOURS.weekday;
    dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
  }

  // Check if shop has explicit mock override (e.g. shop.isOpen === false from dataset)
  const isExplicitlyClosed = shop.isOpen === false;

  const openMinutes = toMinutes(todayRule.open);
  const closeMinutes = toMinutes(todayRule.close);
  const isSundayClosed = dayOfWeek === 0 && Boolean(todayRule.isClosed);

  let isOpen = false;
  let isClosingSoon = false;
  let minutesUntilClose = 0;
  let statusText = 'Closed';
  let badgeSubtext = '';
  let fullStatusDetail = '';
  let badgeVariant = 'closed'; // 'open' | 'closing_soon' | 'closed'

  if (isExplicitlyClosed) {
    isOpen = false;
    badgeVariant = 'closed';
    statusText = 'Closed';
    badgeSubtext = todayRule.open ? `Opens ${formatTime12h(todayRule.open)}` : 'Closed for the day';
    fullStatusDetail = `Closed for the day • Re-opens tomorrow at ${formatTime12h(schedule.weekday.open)}`;
  } else if (isSundayClosed) {
    isOpen = false;
    badgeVariant = 'closed';
    statusText = 'Closed Today';
    badgeSubtext = `Opens Mon ${formatTime12h(schedule.weekday.open)}`;
    fullStatusDetail = `Closed for Sunday weekly off • Opens Monday at ${formatTime12h(schedule.weekday.open)}`;
  } else if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    isOpen = true;
    minutesUntilClose = closeMinutes - currentMinutes;

    if (minutesUntilClose <= 45) {
      isClosingSoon = true;
      badgeVariant = 'closing_soon';
      statusText = 'Closing Soon';
      badgeSubtext = `Closes in ${minutesUntilClose}m (${formatTime12h(todayRule.close)})`;
      fullStatusDetail = `Open now • Closing soon at ${formatTime12h(todayRule.close)} (${minutesUntilClose} mins remaining)`;
    } else {
      badgeVariant = 'open';
      statusText = 'Open Now';
      badgeSubtext = `Until ${formatTime12h(todayRule.close)}`;
      fullStatusDetail = `Open today until ${formatTime12h(todayRule.close)}`;
    }
  } else if (currentMinutes < openMinutes) {
    isOpen = false;
    badgeVariant = 'closed';
    statusText = 'Closed';
    const minutesUntilOpen = openMinutes - currentMinutes;
    if (minutesUntilOpen <= 60) {
      badgeSubtext = `Opens in ${minutesUntilOpen}m`;
    } else {
      badgeSubtext = `Opens ${formatTime12h(todayRule.open)}`;
    }
    fullStatusDetail = `Closed right now • Opens today at ${formatTime12h(todayRule.open)}`;
  } else {
    // Past closing time today
    isOpen = false;
    badgeVariant = 'closed';
    statusText = 'Closed';
    const nextDay = (dayOfWeek + 1) % 7;
    const nextDayRule = nextDay === 0 ? schedule.sunday : schedule.weekday;
    const nextDayOpen = nextDayRule.isClosed ? 'Monday 8:00 AM' : `tomorrow ${formatTime12h(nextDayRule.open)}`;
    badgeSubtext = `Opens ${nextDayOpen}`;
    fullStatusDetail = `Closed for the evening • Opens ${nextDayOpen}`;
  }

  // Build weekly breakdown array
  const days = [
    { key: 'Mon', name: 'Monday', index: 1, rule: schedule.weekday },
    { key: 'Tue', name: 'Tuesday', index: 2, rule: schedule.weekday },
    { key: 'Wed', name: 'Wednesday', index: 3, rule: schedule.weekday },
    { key: 'Thu', name: 'Thursday', index: 4, rule: schedule.weekday },
    { key: 'Fri', name: 'Friday', index: 5, rule: schedule.weekday },
    { key: 'Sat', name: 'Saturday', index: 6, rule: schedule.saturday || schedule.weekday },
    { key: 'Sun', name: 'Sunday', index: 0, rule: schedule.sunday }
  ];

  const weeklySchedule = days.map((d) => ({
    dayKey: d.key,
    dayName: d.name,
    isToday: d.index === dayOfWeek,
    hoursLabel: d.rule.isClosed ? 'Closed' : (d.rule.label || `${formatTime12h(d.rule.open)} – ${formatTime12h(d.rule.close)}`),
    isClosed: Boolean(d.rule.isClosed)
  }));

  return {
    isOpen,
    isClosingSoon,
    statusText,
    badgeSubtext,
    fullStatusDetail,
    badgeVariant,
    todayHoursLabel: todayRule.label || `${formatTime12h(todayRule.open)} – ${formatTime12h(todayRule.close)}`,
    todayDayName: dayName,
    weeklySchedule,
    weekdaySummary: schedule.weekday.label,
    sundaySummary: schedule.sunday.isClosed ? 'Closed' : schedule.sunday.label
  };
}
