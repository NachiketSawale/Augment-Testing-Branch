/**
 * Created by Rolf Eisenhut on 08.08.2014
 */
/* global Platform:false */

(function () {
	'use strict';
	var moduleName = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name cloudCommonLastObjectsService
	 * @function
	 *
	 * @description
	 * uomService is the data service for all uom data functions.
	 */
	// jshint -W072
	angular.module(moduleName).factory('cloudCommonLastObjectsService', ['$rootScope', '$http', '$q', '$timeout', 'moment', '_',
		function ($rootScope, $http, $q, $timeout, moment, _) {

			var defaultMaxDisplayItems = 150;

			// LastObject constructor
			var LastObject = function LastObject() {
				this.proxy = {};
			};

			/* initializes lastObject depending on type
			 * if  _isDtoOrModuleName is a string we init each item individually,
			 * otherwise we expecting a dto object, and use this as proxy
			 */
			LastObject.prototype.init = function (_moduleName, _lastChanged, _summary, _objectId /* , _details */) {
				this.moduleName = _moduleName;
				this.lastChanged = _lastChanged || moment();
				this.summary = _summary;
				this.objectId = _objectId;
				// this.details = _details;
				return this;
			};


			// function toDateTime(isoDateString) {
			//	//moment.locale('de', {longDateFormat : {LT : 'HH:mm',L : 'DD.MM.YYYY'}});
			//	return moment(isoDateString).format('L LT'); // we display date plus time
			// }

			LastObject.prototype.initProxy = function (_dto) {
				this.proxy = _dto;
				this.lastChangedNative = moment(_dto.Lastchanged);

				return this;
			};

			/* define proxy methods for the prototype */
			Object.defineProperties(LastObject.prototype, {
				'moduleName': {
					get: function () {
						return this.proxy.ModuleName;
					},
					set: function (p) {
						this.proxy.ModuleName = p;
					},
					enumerable: true
				},
				'lastChanged': {
					get: function () {
						return this.lastChangedNative.format('L LT');
					},
					set: function (p) {
						this.lastChangedNative = p;
						this.proxy.Lastchanged = moment(p, moment.ISO_8601);
					}
				},
				'summary': {
					get: function () {
						return this.proxy.Summary;
					},
					set: function (p) {
						this.proxy.Summary = p;
					}
				},
				'details': {
					get: function () {
						return this.proxy.Details;
					},
					set: function (p) {
						this.proxy.Details = p;
					}

				},
				'objectId': {
					get: function () {
						return this.proxy.ObjectId;
					},
					set: function (p) {
						this.proxy.ObjectId = p;
					}
				}
			});

			let lastObjectsToSave = [];
			var lastObjects = [];
			var service = {};

			// sidebar messengers
			service.onLastObjectsAdded = new Platform.Messenger();

			/* service property currentMaxDisplayItems */
			Object.defineProperties(service, {
				'currentMaxDisplayItems': {
					value: defaultMaxDisplayItems,
					writable: true,
					enumerable: true
				}
			});

			/*
			 this method return the lastobject list
			 */
			service.getLastObjects = function () {
				return lastObjects;
			};

			/**
			 * This method reads the lastobject from service, it will return a maximum of
			 * maxDisplayItems.
			 * @method loadLastObjects
			 * @param {int}   maxDisplayItems
			 **/
			service.loadLastObjects = function loadLastObjects(maxDisplayItems) {
				if (!maxDisplayItems) {
					maxDisplayItems = service.currentMaxDisplayItems;
				}

				return $http({
					method: 'GET',
					url: globals.webApiBaseUrl + 'cloud/common/getlastObjects',
					params: {'maxDisplayValues': maxDisplayItems}
				}).then(function (response) {
					lastObjects = [];
					_.forEach(response.data, function (lo) {
						var nlo = new LastObject().initProxy(lo);
						lastObjects.push(nlo);
					});
					return lastObjects;
				});

			};

			/**
			 * This method reads the lastobject from service, it will return a maximum of
			 * maxDisplayItems.
			 * @method loadLastObjects
			 * @param {object}   lastObjectList
			 * {
			 * ObjectId: int,
			 * ModuleName: string,
			 * Summary: string,
			 * Lastchanged: dateTime,
			 *
			 **/
			service.saveLastObjects = function saveLastObjects() {
				var theLastObjects = [];

				_.forEach(lastObjectsToSave, function (lo) {
					theLastObjects.push(lo.proxy);
				});

				return $http.post(
					globals.webApiBaseUrl + 'cloud/common/savelastObjects',
					theLastObjects
				).then(function (response) {
					lastObjectsToSave = [];
					return response.data;
				});
			};

			/*
			 this method creates an new LastObject and intializes t with supplied parameters
			 */
			service.createLastObject = function (_moduleName, _lastChanged, _summary, _objectId) {
				var newLo = new LastObject();
				newLo.init(_moduleName, _lastChanged, _summary, _objectId);
				return newLo;
			};

			/*
			 this method add one or multiple lastObjects to LastObjectView and save it to service
			 */
			service.addLastObjects = function (_lastObjects) {
				_.forEach(_lastObjects, function (item) {
					var itemIdx = _.findIndex(lastObjects, {objectId: item.objectId});
					if (itemIdx >= 0) {
						lastObjects.splice(itemIdx, 1);
					}
					lastObjects.unshift(item); // add new objects at the top of the array
					lastObjectsToSave.unshift(item);
					if (lastObjects.length > service.currentMaxDisplayItems) {
						lastObjects.pop(); // remove the last one
					}
				});
				lastObjects = _.compact(lastObjects);

				service.onLastObjectsAdded.fire();
				return $q.when('');
			};

			return service;
		}]);
})();
