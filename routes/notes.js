const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const FetchUser = require('../middleware/FetchUser')
const Note = require('../models/Note')

//ROUTE 1: Add a new note using: POST "/api/notes/addnote". Login required
router.post('/addnote', FetchUser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),
    body('tag', 'Tag must not be blank').isLength({ min: 3 }),
], async (req, res) => {
    //If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, tag } = req.body;
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.json(savedNote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//ROUTE 2: Fetch all Notes of a user using: GET "/api/notes/fetchnotes". Login required
router.get('/fetchnotes', FetchUser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router