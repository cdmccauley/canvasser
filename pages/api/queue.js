import { AbortController } from "node-abort-controller";

export default async function handler(req, res) {
  // console.log('/api/queue.handler()')
  // simulate random timeouts from canvas
  // const time = Math.floor(Math.random() * 300) + 400
  // console.log('time', time)
  const time = 5500;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), time);

  let resStatus = 504;

  // console.log('/api/queue.handler() fetch:', req.body.url.match(/(?<=\/)\d+(?=\/)/i)[0])
  // await fetch(req.body.url)
  await fetch(req.body.url, { signal: controller.signal })
    .then((canvasRes) => {
      if (!canvasRes.ok) {
        const error = new Error(
          "Communication error between Canvasser server and Canvas server."
        );
        error.info = canvasRes.json();
        error.status = canvasRes.status;
        throw error;
      } else {
        return canvasRes;
      }
    })
    .then((canvasRes) => {
      if (canvasRes.status) resStatus = canvasRes.status;
      if (canvasRes.headers.has("link")) {
        res.setHeader("link", canvasRes.headers.get("link"));
      }
      // log to see if this is the cause of any errors, if this hits 0 canvas should be sending a 403
      if (canvasRes.headers.has("x-rate-limit-remaining") && canvasRes.headers.get("x-rate-limit-remaining") < 70.0) console.log(req.body.url.match(/(?<=\/)\d+(?=\/)/i)[0], "x-rate-limit-remaining", canvasRes.headers.get("x-rate-limit-remaining"))
      return canvasRes.json();
    })
    .then((canvasData) => {
      res.status(resStatus).json(
        JSON.stringify({
          canvasData,
        })
      );
    })
    .catch((error) => {
      clearTimeout(timeoutId);

      console.log("/api/queue.handler error");
      if (error.name) console.log("error.name", error.name);
      if (error.status) console.log("error.status", error.status);
      if (error.message) console.log("error.message", error.message);
      if (error.info) console.log("error.info", error.info);

      res.status(resStatus).json(JSON.stringify({ canvasData: [] }));
    });
}
