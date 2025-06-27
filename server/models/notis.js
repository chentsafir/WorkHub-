import mongoose, { Schema } from "mongoose";


/**
 * Defines the schema for a Notification in the database.
 * Each notice is intended for a team, can be linked to a task,
 * and tracks which users have read it.
 */
const noticeSchema = new Schema(
  {
    team: [{ type: Schema.Types.ObjectId, ref: "User" }],
    text: { type: String },
    task: { type: Schema.Types.ObjectId, ref: "Task" },
    notiType: { type: String, default: "alert", enum: ["alert", "message"] },
    isRead: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Notice = mongoose.model("Notice", noticeSchema);

export default Notice;
