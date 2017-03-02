/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Thing from '../api/thing/thing.model';
import User from '../api/user/user.model';
import Room from '../api/room/room.model';
var ObjectId = require('mongoose').Types.ObjectId;

// Room.find({}).remove()
//   .then(()=>{
//     Room.create({
//       members: ['Prateek', 'Pooja'],
//       messages: [{
//         message : "Hi Tikku Pikku",
//         to: ['Pooja'],
//         from: 'Prateek'
//       }]
//     });
//   });
Thing.find({}).remove()
    .then(() => {
        Thing.create({
            name: 'Development Tools',
            info: 'Integration with popular tools such as Webpack, Gulp, Babel, TypeScript, Karma, '
            + 'Mocha, ESLint, Node Inspector, Livereload, Protractor, Pug, '
            + 'Stylus, Sass, and Less.'
        }, {
            name: 'Server and Client integration',
            info: 'Built with a powerful and fun stack: MongoDB, Express, '
            + 'AngularJS, and Node.'
        }, {
            name: 'Smart Build System',
            info: 'Build system ignores `spec` files, allowing you to keep '
            + 'tests alongside code. Automatic injection of scripts and '
            + 'styles into your index.html'
        }, {
            name: 'Modular Structure',
            info: 'Best practice client and server structures allow for more '
            + 'code reusability and maximum scalability'
        }, {
            name: 'Optimized Build',
            info: 'Build process packs up your templates as a single JavaScript '
            + 'payload, minifies your scripts/css/images, and rewrites asset '
            + 'names for caching.'
        }, {
            name: 'Deployment Ready',
            info: 'Easily deploy your app to Heroku or Openshift with the heroku '
            + 'and openshift subgenerators'
        });
    });

User.find({}).remove()
    .then(() => {
        User.create({
            _id: ObjectId('58b82f65b955991ec8716aa5'),
            provider: 'local',
            name: 'Test User',
            email: 'test@example.com',
            password: 'test',
            contacts: [{
                contactName : 'Prateek'
            }],
            rooms: []
        }, {
          _id: ObjectId('58b82f65b955991ec8716aa4'),
            provider: 'local',
            role: 'admin',
            name: 'Admin',
            email: 'admin@example.com',
            password: 'admin'
        })
            .then(() => {
                console.log('finished populating users');
            });
    });
Room.find({}).remove()
  .then(() => {
    Room.create({
      "_id" : ObjectId("58b83a340e1b2124e078e31a"),
      "roomID" : "1",
      "messages" : [ ],
      "members" : [
        ObjectId("58b82f65b955991ec8716aa5"),
        ObjectId("58b82f65b955991ec8716aa4")
      ]
    })
  });

