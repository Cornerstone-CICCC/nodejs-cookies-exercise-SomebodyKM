import { Router, Request, Response } from 'express'
import { checkAuth, isLoggedOut } from '../middleware/auth.middleware'
import { User } from '../types/user'

const pageRouter = Router()

// In-memory user database
const users: User[] = [
    { id: 1, username: "admin", password: "admin12345" }
]

/**
 * Home route
 * 
 * @route GET /
 */
pageRouter.get('/', (req: Request, res: Response) => {
    res.status(200).render('index', {
        pageTitle: "Home"
    })
})

/**
 * Register route
 * 
 * @route GET /register
 */
pageRouter.get('/login', isLoggedOut, (req: Request, res: Response) => {
    res.status(200).render('login')
})

/**
 * Login route
 * 
 * @route POST /login
 */
pageRouter.post('/login', (req: Request<{}, {}, Omit<User, 'id'>>, res: Response) => {
    const { username, password } = req.body
    const foundUser = users.find(
        u => u.username === username && u.password === password
    )
    if (!foundUser) {
        res.status(301).redirect('/login')
        return
    }
    res.cookie('isLoggedIn', true, {
        httpOnly: true,
        signed: true, // req.signedCookies
        maxAge: 3 * 60 * 1000 // 3 mins
    })
    res.cookie('username', username, {
        httpOnly: true,
        signed: true,
        maxAge: 3 * 60 * 1000 // 3 mins
    })
    res.status(301).redirect('/profile')
})

/**
 * Logout route
 * 
 * @route GET /logout
 */
pageRouter.get('/logout', (req: Request, res: Response) => {
    res.clearCookie('isLoggedIn')
    res.clearCookie('username')
    res.status(301).redirect('/login')
})

/**
 * Profile page (Logged in users only)
 * 
 * @route GET /profile
 */
pageRouter.get('/profile', checkAuth, (req: Request, res: Response) => {
    const { username } = req.signedCookies
    res.status(200).render('profile', {
        username
    })
})

export default pageRouter