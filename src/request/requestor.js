/*
 * This file is part of IMS Caliper Analytics™ and is licensed to
 * IMS Global Learning Consortium, Inc. (http://www.imsglobal.org)
 * under one or more contributor license agreements.  See the NOTICE
 * file distributed with this work for additional information.
 *
 * IMS Caliper is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * IMS Caliper is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License along
 * with this program. If not, see http://www.gnu.org/licenses/.
 */

var _ = require('lodash');
var moment = require('moment');
var config = require('../config');
var envelope = require('./envelope');
var requestorUtils = require('./requestorUtils')

/**
 * Represents eventStoreRequestor self.
 * @constructor eventStoreRequestor
 */
var self = this;
var options = {};

/*
 * Check if self is properly initialized
 */
var initialized = function() {
    return true; //TODO
};

/**
 * Initializes the default self to use.
 * @function initialize
 * @param sensorOptions $options passed straight to the self
 */
self.initialize = function(sensorOptions) {
  if (!_.isUndefined(sensorOptions)) {
      options = sensorOptions;
  }
  // logger.log('info', "Initializing Requestor with options " + JSON.stringify(options));
};

/**
 * Return envelope.  Convert data object to array if necessary or copy data array to payload array using .slice().
 * @param sensor
 * @param data
 */
self.createEnvelope = function(id, sendTime, dataVersion, data) {
  id = id || config.sensorId;
  sendTime = sendTime || moment.utc().format("YYYY-MM-DDTHH:mm:ss.SSSZZ");
  dataVersion = dataVersion || config.dataVersion;

  var payload = [];
  if (Array.isArray(data)) {
    payload = data.slice();
  } else {
    payload.push(data);
  }

  return _.assign({}, envelope, { sensor: id, sendTime: sendTime, dataVersion: dataVersion, data: payload });
};

/**
 * Abstract describe method. Implement in a sub-module.
 * @param sensor
 * @param data
 */
self.describe = function(sensor, data) {
  throw new Error('Method `eventStoreRequestor::describe()` must be implemented in a sub-module.');
};

/**
 * Generate JSON. Private method that is not exported.
 * @param payload
 */
self.stringify = function stringify(payload) {
  return requestorUtils.stringify(payload);
};

/**
 * Abstract send method. Implement in a sub-module.
 * @param sensor
 * @param data
 */
self.send = function(sensor, data) {
  throw new Error('Method `eventStoreRequestor::send()` must be implemented in a sub-module.');
};

module.exports = {
  initialize: self.initialize,
  createEnvelope: self.createEnvelope,
  stringify: self.stringify,
  send: self.send
};