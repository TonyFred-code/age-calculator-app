import { useState } from "react";
import CountUp from "./components/countUp.jsx";
import calculateAge from "./helpers/calculateAge.js";

export default function App() {
  const [ageDetails, setAgeDetails] = useState({
    years: -1,
    months: -1,
    days: -1,
  });
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");

  const [formError, setFormError] = useState(null);
  const [dayError, setDayError] = useState(null);
  const [monthError, setMonthError] = useState(null);
  const [yearError, setYearError] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;

    const formData = new FormData(form);

    const day = Number(formData.get("day")),
      month = Number(formData.get("month")),
      year = Number(formData.get("year"));

    let DOB = { years: -1, months: -1, days: -1 };

    const isValidForm = validateForm(day, month, year, form);

    if (!isValidForm) {
      setAgeDetails(DOB);
      setFormError("Must be a valid date");
      setDayError(null);
      setMonthError(null);
      setYearError(null);
      return;
    }

    try {
      DOB = calculateAge(year, month, day);
    } catch (error) {
      if (error.message.match(/date/i)) {
        setAgeDetails(DOB);
        setFormError("Must be a valid date");
        setDayError(null);
        setMonthError(null);
        setYearError(null);
        return;
      }

      throw error;
    }

    setAgeDetails(DOB);
    setFormError(null);
    setDayError(null);
    setMonthError(null);
    setYearError(null);
  }

  function isLeapYear(year) {
    if (year % 100 === 0 && year % 400 !== 0) {
      return false;
    } else if (year % 4 !== 0) {
      return false;
    } else {
      return true;
    }
  }

  function validateDay(day, month, year, dayInput) {
    const errorMessages = {
      empty: "This field is required",
      outOfBounds: "Must be a valid day",
    };
    if (dayInput.value === "") {
      return {
        isValid: false,
        errorMessage: errorMessages.empty,
      };
    }

    let monthMaxDays;

    if (!month) monthMaxDays = 31;
    switch (month) {
      case 4:
      case 6:
      case 9:
      case 11:
        monthMaxDays = 30;
        break;
      case 2:
        monthMaxDays = isLeapYear(year) ? 29 : 28;
        break;
      default:
        monthMaxDays = 31;
        break;
    }

    if (day < 1 || day > monthMaxDays) {
      return {
        isValid: false,
        errorMessage: errorMessages.outOfBounds,
      };
    }

    return {
      isValid: true,
      errorMessages: "",
    };
  }

  function validateMonth(month, monthInput) {
    const errorMessages = {
      empty: "This field is required",
      outOfBounds: "Must be a valid month",
    };
    if (monthInput.value === "") {
      return {
        isValid: false,
        errorMessage: errorMessages.empty,
      };
    }

    if (month < 1 || month > 12) {
      return {
        isValid: false,
        errorMessage: errorMessages.outOfBounds,
      };
    }

    return {
      isValid: true,
      errorMessage: "",
    };
  }

  function validateYear(year, yearInput) {
    const errorMessages = {
      empty: "This field is required",
      outOfBounds: "Must be in the past",
    };

    if (yearInput.value === "") {
      return {
        isValid: false,
        errorMessage: errorMessages.empty,
      };
    }

    const currentYear = new Date().getFullYear();

    if (currentYear < year) {
      return {
        isValid: false,
        errorMessage: errorMessages.outOfBounds,
      };
    }

    return {
      isValid: true,
      errorMessage: "",
    };
  }

  function validateForm(day, month, year, form) {
    const dayValidity = validateDay(day, month, year, form.day);
    const monthValidity = validateMonth(month, form.month);
    const yearValidity = validateYear(year, form.year);

    return dayValidity.isValid && monthValidity.isValid && yearValidity.isValid;
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

    if (dayError || formError) {
      setDayError(null);
      setFormError(null);
    }
    setDay(updatedDay);
  }

  function updateMonth(event) {
    const updatedMonth = event.target.value.replace(/\D/g, "").slice(0, 2);

    if (monthError || formError) {
      setMonthError(null);
      setFormError(null);
    }
    setMonth(updatedMonth);
  }

  function updateYear(event) {
    const updatedYear = event.target.value.replace(/\D/g, "").slice(0, 4);

    if (yearError || formError) {
      setYearError(null);
      setFormError(null);
    }
    setYear(updatedYear);
  }

  function handleDayInputBlur(event) {
    normalizeDay();
    const isValidDay = validateDay(
      Number(day),
      Number(month),
      Number(year),
      event.target
    );

    if (formError) setFormError(null);

    if (isValidDay.isValid) {
      setDayError(null);
    } else {
      setDayError(isValidDay.errorMessage);
    }
  }

  function handleMonthInputBlur(event) {
    normalizeMonth();

    const isValidMonth = validateMonth(Number(month), event.target);

    if (isValidMonth.isValid) {
      setMonthError(null);
    } else {
      setMonthError(isValidMonth.errorMessage);
    }
  }

  function handleYearInputBlur(event) {
    normalizeYear();

    const isValidYear = validateYear(Number(year), event.target);

    if (isValidYear.isValid) {
      setYearError(null);
    } else {
      setYearError(isValidYear.errorMessage);
    }
  }

  return (
    <div className="min-h-screen bg-grey-100 flex items-center justify-center py-8 px-4">
      <div className="bg-white rounded-2xl md:rounded-br-lg-half-pill rounded-br-half-pill p-5 md:p-6 max-w-lg md:max-w-xl space-y-6">
        <form
          onSubmit={handleSubmit}
          id="age_form"
          noValidate
          className="grid grid-cols-3 gap-3 md:max-w-5/6"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="day"
              className={`uppercase text-[10px] md:text-xs tracking-[.2rem] ${formError || dayError ? "text-red-400" : "text-grey-500"}`}
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
              className={`peer p-2 border-2 focus:border-purple-500 outline-none text-xl rounded-md ${dayError || formError ? "border-red-400" : "border-grey-200"}`}
              onChange={updateDay}
              onBlur={handleDayInputBlur}
            />
            {formError && (
              <span className="text-[7px] md:text-xs italic text-red-400">
                {formError}
              </span>
            )}
            {dayError && (
              <span className="text-[7px] md:text-xs italic text-red-400">
                {dayError}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="month"
              className={`uppercase text-[10px] md:text-xs tracking-[.2rem] ${formError || monthError ? "text-red-400" : "text-grey-500"}`}
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
              onBlur={handleMonthInputBlur}
              className={`peer p-2 border-2 focus:border-purple-500 outline-none text-xl rounded-md ${monthError || formError ? "border-red-400" : "border-grey-200"}`}
            />
            {monthError && (
              <span className="text-[7px] md:text-xs italic text-red-400">
                {monthError}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="year"
              className={`uppercase text-[10px] md:text-xs tracking-[.2rem] ${formError || yearError ? "text-red-400" : "text-grey-500"}`}
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
              onBlur={handleYearInputBlur}
              className={`peer p-2 border-2 focus:border-purple-500 outline-none text-xl rounded-md ${yearError || formError ? "border-red-400" : "border-grey-200"}`}
            />
            {yearError && (
              <span className="text-[7px] md:text-xs italic text-red-400">
                {yearError}
              </span>
            )}
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
                to={ageDetails.days}
                from={0}
                duration={1.2}
                startWhen={ageDetails.days > 0}
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
