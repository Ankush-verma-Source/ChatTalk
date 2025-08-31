const corsOptions = {
  origin: ["http://localhost:5173", process.env.CLIENT_URL],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};


const CHATTALK_TOKEN = "Chattalk-token";
export { corsOptions, CHATTALK_TOKEN };
