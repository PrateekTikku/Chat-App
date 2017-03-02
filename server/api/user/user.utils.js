/**
 * Created by prausa on 2/3/2017.
 */
import User from "./user.model";
import * as util from "../../components/utils/utils";


//Update Room's last message for a particular user
export function updateLastMessage(userId, roomID, message) {
  var query = {'_id': new ObjectId(userId), "roomID": roomID};
  var updation = {"$set": {"rooms.$.lastMessage": message}};
  var options = {new: true, upsert: false};
  User.findOneAndUpdate(query, updation, options).exec()
    .then(user => {
      if (user)
        return cb(null, user);
      return cb("User With Id = " + userId + " Not Found", null);
    })
    .catch(err => cb(err, null));
}


//create room for every user id : ids must be passed in Mongoose Object ID format
export function addRooms(ids, room, callback) {
  ids = util.toArray(ids);

  var query = {'_id': {'$in': ids}};
  var updation = {$push: {'rooms': room}};
  var options = {new: true, upsert: false, multi: true};

  User.update(query, updation, options).exec()
    .then(users=> {
      if (users)
        return callback(null, room);
    })
    .catch(err => callback(err, null));
}
