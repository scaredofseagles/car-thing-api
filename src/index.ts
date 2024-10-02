import { Hono } from "hono";
import { env } from "hono/adapter";
import { generateString, getUrlHost } from "./utils"
import scopes from "./scopes"

type Bindings = {
  FOO: string;
  SPOTIFY_CLIENT_ID: string;
  SPOTIFY_CLIENT_SECRET: string;
}

const app = new Hono<{Bindings: Bindings}>()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/test', (c) => {
  return c.text('this is a test')
})

app.get("/auth/login", (c) => {
  const { SPOTIFY_CLIENT_ID } = env<Bindings>(c)
  const urlHost = getUrlHost(c.req);
  const state = generateString(16);

  const authQueryParams = new URLSearchParams({
    response_type: "code",
    client_id: SPOTIFY_CLIENT_ID,
    scope: scopes,
    redirect_uri: `${urlHost}/auth/callback`,
    state
  })

  return c.redirect(`https://accounts.spotify.com/authorize/?${authQueryParams.toString()}`);
  // return c.text(`https://accounts.spotify.com/authorize/?${authQueryParams.toString()}`);
})

app.get("/auth/callback", async (c) => {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET} = env<Bindings>(c);
  console.log('reached callback')
  const code = c.req.query("code");
  const urlHost = getUrlHost(c.req);


  const bodyPayload = new URLSearchParams({
    code: code as string,
    redirect_uri: `${urlHost}/auth/callback`,
    grant_type: "authorization_code",
  })

  const authOptions = {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: bodyPayload.toString(),
    json: true
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", authOptions)
    const data = await response.json();
    // @ts-ignore
    return c.json(data, 200);
  } catch (error) {
    return c.text(`Error: ${error}`, 500)
  }
})


app.get("/auth/refresh_token", async (c) => {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET} = env<Bindings>(c);
  const refreshToken = c.req.query('refresh_token');

  const bodyPayload = new URLSearchParams({
    refresh_token: refreshToken as string,
    grant_type: "refresh_token",
  })

  const authOptions = {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: bodyPayload.toString(),
    json: true
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", authOptions)
    const data = await response.json();

    return c.json({ access_token: data.access_token, refresh_token: data?.refresh_token ?? refreshToken}, 200)
  } catch (error) {
    return c.text(`Error: ${error}`, 500)
  }
})

export default app
