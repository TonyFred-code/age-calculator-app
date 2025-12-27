import { useState } from "react";
import CountUp from "./components/countUp.jsx";

export default function App() {
  const [ageDetails, setAgeDetails] = useState({
    years: -1,
    months: -1,
    days: -1,
  });
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");

  function calculateAge(dob, today = new Date()) {
    const birthDate = new Date(dob);

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

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;

    const formData = new FormData(form);

    const day = Number(formData.get("day")),
      month = Number(formData.get("month")),
      year = Number(formData.get("year"));

    const DOB = calculateAge(new Date(year, month - 1, day));
    setAgeDetails(DOB);
  }

  function normalizeMonth() {
    if (month === "") return;
    setMonth(month.padStart(2, "0"));
  }

  function normalizeDay() {
    if (day === "") return;

    setDay(day.padStart(2, "0"));
  }

  function normalizeYear() {
    if (year === "") return;

    setYear(year.padStart(4, "0"));
  }

  function updateDay(event) {
    const updatedDay = event.target.value.replace(/\D/g, "").slice(0, 2);

    setDay(updatedDay);
  }

  function updateMonth(event) {
    const updatedMonth = event.target.value.replace(/\D/g, "").slice(0, 2);

    setMonth(updatedMonth);
  }

  function updateYear(event) {
    const updatedYear = event.target.value.replace(/\D/g, "").slice(0, 4);

    setYear(updatedYear);
  }

  return (
    <div className="min-h-screen bg-grey-100 flex items-center justify-center py-8 px-4">
      <div className="bg-white rounded-2xl md:rounded-br-lg-half-pill rounded-br-half-pill p-6 max-w-lg md:max-w-xl space-y-6">
        <form
          onSubmit={handleSubmit}
          id="age_form"
          noValidate
          className="grid grid-cols-3 gap-3 md:max-w-5/6"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="day"
              className="uppercase text-[10px] md:text-xs tracking-[.2rem] peer-invalid:text-red-400 text-grey-500"
            >
              day
            </label>
            <input
              type="text"
              name="day"
              placeholder="DD"
              id="day"
              value={day}
              pattern="[0-9]*"
              inputMode="numeric"
              className="peer p-2 border-2 border-grey-200 focus:border-purple-500 outline-none text-xl rounded-md"
              onChange={updateDay}
              onBlur={normalizeDay}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="month"
              className="uppercase text-[10px] md:text-xs tracking-[.2rem] peer-invalid:text-red-400 text-grey-500"
            >
              Month
            </label>
            <input
              type="text"
              name="month"
              id="month"
              pattern="[0-9]*"
              inputMode="numeric"
              placeholder="MM"
              value={month}
              onChange={updateMonth}
              onBlur={normalizeMonth}
              className="peer p-2 border-2 border-grey-200 focus:border-purple-500 outline-none text-xl rounded-md"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="year"
              className="uppercase text-[10px] md:text-xs tracking-[.2rem] peer-invalid:text-red-400 text-grey-500"
            >
              year
            </label>
            <input
              type="text"
              name="year"
              id="year"
              pattern="[0-9]*"
              inputMode="numeric"
              placeholder="YYYY"
              value={year}
              onChange={updateYear}
              onBlur={normalizeYear}
              className="peer p-2 border-2 border-grey-200 focus:border-purple-500 outline-none text-xl rounded-md"
            />
          </div>
        </form>
        <div className="flex items-center justify-center">
          <hr className="w-full h-1 text-grey-200" />
          <button
            type="submit"
            className="rounded-full size-14 border-purple-500 hover:border- focus:bg-black active:border-black hover:bg-black active:bg-black bg-purple-500 flex items-center justify-center shrink-0 mx-auto md:order-last"
            form="age_form"
          >
            <span className="sr-only">Submit</span>
            <img src="/images/icon-arrow.svg" className="size-6.5" alt="" />
          </button>
          <hr className="w-full h-1 text-grey-200" />
        </div>
        <div className="text-4xl md:text-6xl italic font-bold space-y-1">
          <p>
            {ageDetails.years > -1 ? (
              <CountUp
                from={0}
                to={ageDetails.years}
                duration={1.2}
                startWhen={ageDetails.years > 0}
                className="text-purple-500"
              />
            ) : (
              <span className="tracking-widest text-purple-500">--</span>
            )}
            {ageDetails.years > 1 ? " years" : " year"}
          </p>
          <p>
            {ageDetails.months > -1 ? (
              <CountUp
                to={ageDetails.months}
                from={0}
                duration={1.2}
                startWhen={ageDetails.months > 0}
                className="text-purple-500"
              />
            ) : (
              <span className="tracking-widest text-purple-500">--</span>
            )}
            {ageDetails.months > 1 ? " months" : " month"}
          </p>

          <p>
            {ageDetails.days > -1 ? (
              <CountUp
                to={ageDetails.months}
                from={0}
                duration={1.2}
                startWhen={ageDetails.months > 0}
                className="text-purple-500"
              />
            ) : (
              <span className="tracking-widest text-purple-500">--</span>
            )}
            {ageDetails.days > 1 ? " days" : " day"}
          </p>
        </div>
      </div>
    </div>
  );
}
