'use strict';

import angular from 'angular';
import SettingsController from './settings.controller';

export default angular.module('chatApp.settings', [])
  .controller('SettingsController', SettingsController)
  .name;
