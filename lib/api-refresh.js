const refreshFetcher = async (token) => {
  // console.log("lib/api-refresh", token);
  const url = "/api/refresh";
  if (token) {
    return await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(token.refresh_token),
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
        console.log(data);
        return data;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
  }
};

export default refreshFetcher;
