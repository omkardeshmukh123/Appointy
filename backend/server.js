import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

// app config
const app = express()
const port = process.env.PORT || 4000

// Connect to database (CALL THE FUNCTION)
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())

// CORS configuration for Vercel
const allowedOrigins = [
  'https://appointy-frontend.vercel.app',
  'https://appointy-admin.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}))

// api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use("/api/user", userRouter)


app.get("/", (req, res) => {
  res.send("API Working")
});

app.get('/test-db', (req, res) => {
  const state = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (state === 1) {
    res.send('Database is connected');
  } else {
    res.status(500).send('Database is NOT connected');
  }
});


// For Vercel serverless
if (process.env.VERCEL) {
  // Don't call app.listen() on Vercel
  module.exports = app;
} else {
  // Local development
  app.listen(port, () => console.log(`Server started on PORT:${port}`))
}
