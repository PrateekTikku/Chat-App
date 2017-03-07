/**
 * Created by prausa on 3/2/2017.
 */
var ObjectId = require('mongoose').Types.ObjectId;
//Converts an array of string IDs values to MongoDB compatible ObjectIDs
export function toObjectIDs(ids) {
  ids = ids.map(id => {
    return new ObjectId(id);
  });
  return ids;
}
export function toArray(data) {
  var array = [];
  if (Array.isArray(data))
    return data;
  array.push(data);
  return array;
}

export function getSocketID(socket){
  return socket.id.substring(6, socket.id.length);
}
