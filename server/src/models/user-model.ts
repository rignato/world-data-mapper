const { model, Schema } = require('mongoose');

const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
    _id: { type: ObjectId, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    refresh_count: { type: Number, required: true }
});

const User = model('User', userSchema);
export default User;