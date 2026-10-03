const Event = require("../models/Event");

// GET ALL EVENTS
const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name email")
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while fetching events",
    });
  }
};

// CREATE EVENT
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      location,
      category,
    } = req.body;

    if (!title || !description || !date || !location) {
      return res.status(400).json({
        message: "Title, description, date and location are required",
      });
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      category,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while creating event",
    });
  }
};

// UPDATE EVENT
const updateEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      location,
      category,
    } = req.body;

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.category = category || event.category;

    await event.save();

    res.json({
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while updating event",
    });
  }
};

// DELETE EVENT
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    await event.deleteOne();

    res.json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while deleting event",
    });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};