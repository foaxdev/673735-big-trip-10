export const capitalizeFirstLetter = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const formatDuration = (timeInMs) => {
  const days = Math.floor(timeInMs / (1000 * 60 * 60 * 24)).toString().padStart(2, `0`);
  const hours = (Math.floor(timeInMs / (1000 * 60 * 60)) % 24).toString().padStart(2, `0`);
  const minutes = (Math.floor(timeInMs / (1000 * 60)) % 60).toString().padStart(2, `0`);

  const modifiedDays = days > 0 ? `${days}D ` : ``;
  let modifiedHours = `${hours}H `;

  if (days <= 0) {
    modifiedHours = hours > 0 ? `${hours}H ` : ``;
  }

  return `${modifiedDays}${modifiedHours}${minutes}M`;
};

