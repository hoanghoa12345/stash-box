const allowedOrigins = Deno.env.get("ALLOWED_ORIGINS");
const methods = ["GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS"];

export const corsOptions = {
  origin: allowedOrigins ? allowedOrigins.split(",") : [],
  methods: methods.join(","),
  preflightContinue: false,
  optionsSuccessStatus: 200,
  credentials: true,
};
