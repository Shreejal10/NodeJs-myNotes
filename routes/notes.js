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

//ROUTE 3: Edit a note using: PUT: "/api/notes/editnote/:id". Login required
router.put('/editnote/:id', FetchUser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        //Create a new note object
        const newNote = {}
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //Find the note to be edited and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        //Check if the user logged in is accessing the data or not
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        //update note
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router