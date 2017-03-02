'use strict';

import angular from 'angular';
import SignupController from './signup.controller';

export default angular.module('chatApp.signup', [])
  .controller('SignupController', SignupController)
  .name;
