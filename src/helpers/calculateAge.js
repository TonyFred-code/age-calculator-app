function createDate(year, month, day) {
  const d = new Date(0);
  d.setFullYear(year, month - 1, day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function calculateAge(year, month, day, today = new Date()) {
  const birthDate = createDate(year, month, day);

  if (isNaN(birthDate)) {
    throw new Error("Invalid date of birth");
  }

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  // Borrow days from previous month
  if (days < 0) {
    months -= 1;

    const prevMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0 // last day of previous month
    );

    days += prevMonth.getDate();
  }

  // Borrow months from previous year
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}
