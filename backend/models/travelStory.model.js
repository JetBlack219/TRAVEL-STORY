import mongoose from "mongoose";
const {Schema} = mongoose;

const travelStorySchema = new Schema({
    title: {type: String, required: true},
    story: {type: String, require: true},
    visitedLocation: {type: [String], default: []},
    isFavourite: {type: Boolean, default: false},
    userId: {type: Schema.Types.ObjectId, ref:"User", required: true},
    createOn: {type: Date, default: Date.now},
    imageUrl: {type: String, required: true},
    visitedDate: {type: Date, required: true},
});

const TravelStory = mongoose.model("TravelStory", travelStorySchema);

export default TravelStory;