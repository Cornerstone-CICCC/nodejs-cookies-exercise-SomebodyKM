import express, { Request, Response, NextFunction } from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
dotenv.config()
import pageRouter from './routes/page.routes'

// Create server
const app = express()

// Set view engine to EJS
app.set('view engine', 'EJS')
app.set('views', path.join(__dirname, '../src/views'))

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.COOKIE_SECRET_KEY))

// Routes
app.use('/', pageRouter)

// Fallback
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send("Invalid route!")
})

// Start server
const PORT = process.env.PORT
if (!PORT) {
    throw new Error("Missing required port!")
}
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})