const refreshFetcher = (url, token) => {
  // console.log("lib/api-refresh", url, token);
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: token.refresh_token }),
  })
    .then((canvas_res) => {
      if (!canvas_res.ok) {
        const error = new Error("refresh token request failed");
        error.info = canvas_res.json();
        error.status = canvas_res.status;
        throw error;
      } else {
        return canvas_res.json();
      }
    })
    .then((data) => {
      // console.log("lib/api-refresh", data);
      return data;
    })
    .catch((err) => {
      console.error(err);
      return err;
    });
};

export default refreshFetcher;
