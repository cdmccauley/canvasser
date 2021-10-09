export function inactiveReservations(queue, reserved) {
  return reserved.filter(
    (id) =>
      !Object.values(queue)
        .map((submission) => submission.submissionUrl)
        .includes(id)
  );
}

export function clearInactiveReservations(inactive) {
  fetch("/api/i-reserve", {
    method: "POST", // this operation might be a PUT instead https://restfulapi.net/ (idempotence)
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
