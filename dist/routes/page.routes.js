"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const pageRouter = (0, express_1.Router)();
// In-memory user database
const users = [
    { id: 1, username: "admin", password: "admin12345" }
];
/**
 * Home route
 *
 * @route GET /
 */
pageRouter.get('/', (req, res) => {
    res.status(200).render('index', {
        pageTitle: "Home"
    });
});
/**
 * Register route
 *
 * @route GET /register
 */
pageRouter.get('/login', auth_middleware_1.isLoggedOut, (req, res) => {
    res.status(200).render('login');
});
/**
 * Login route
 *
 * @route POST /login
 */
pageRouter.post('/login', (req, res) => {
    const { username, password } = req.body;
    const foundUser = users.find(u => u.username === username && u.password === password);
    if (!foundUser) {
        res.status(301).redirect('/login');
        return;
    }
    res.cookie('isLoggedIn', true, {
        httpOnly: true,
        signed: true, // req.signedCookies
        maxAge: 3 * 60 * 1000 // 3 mins
    });
    res.cookie('username', username, {
        httpOnly: true,
        signed: true,
        maxAge: 3 * 60 * 1000 // 3 mins
    });
    res.status(301).redirect('/profile');
});
/**
 * Logout route
 *
 * @route GET /logout
 */
pageRouter.get('/logout', (req, res) => {
    res.clearCookie('isLoggedIn');
    res.clearCookie('username');
    res.status(301).redirect('/login');
});
/**
 * Profile page (Logged in users only)
 *
 * @route GET /profile
 */
pageRouter.get('/profile', auth_middleware_1.checkAuth, (req, res) => {
    const { username } = req.signedCookies;
    res.status(200).render('profile', {
        username
    });
});
exports.default = pageRouter;
