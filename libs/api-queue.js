import parseLinkHeader from "../libs/parse-link-header.js";

const queueFetcher = async (url) => {
  // console.log(`libs/api-queue.queueFetcher(${url})`)
  let links;
  let resData;
  return await fetch("/api/queue", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: url,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        const error = new Error(
          "Communication error between Canvasser client and Canvasser server."
        );
        error.info = res.json();
        error.status = res.status;
        throw error;
      } else {
        return res;
      }
    })
    .then((res) => {
      links = parseLinkHeader(res.headers.get("link"));
      return res.json();
    })
    .then((data) => {
      // console.log('api-queue data: ', data);
      resData = data;
      if (links["next"] != undefined) {
        resData.next = links["next"];
      }
      return resData;
    })
    .catch((error) => {
      console.log("/libs/api-queue.queueFetcher error");
      if (error.name) console.log("error.name", error.name);
      if (error.status) console.log("error.status", error.status);
      if (error.message) console.log("error.message", error.message);
      if (error.info) console.log("error.info", error.info);
      throw error;
    });
};
export default queueFetcher;
