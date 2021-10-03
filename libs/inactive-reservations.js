export function inactiveReservations(external, internal) {
  return internal.filter((id) => !external.includes(id));
}

export function clearInactiveReservations(inactive) {
  fetch("/api/i-reserve", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "unreserve",
      items: inactive,
    }),
  }).catch((error) =>
    console.log("libs/inactive-reservations.clearInactiveReservations", error)
  );
}
