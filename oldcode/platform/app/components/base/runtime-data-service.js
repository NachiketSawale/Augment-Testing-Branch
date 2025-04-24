/*
 * $Id: platform-grid-domain-service.js 291399 2015-02-25 11:12:27Z kh $
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	angular.module('platform').service('platformRuntimeDataService', platformRuntimeDataService);

	platformRuntimeDataService.$inject = ['_', 'platformTranslateService'];

	function platformRuntimeDataService(_, platformTranslateService) {
		var service = {};

		function changeReadonlyState(item, field) {
			var f = _.find(item.__rt$data.readonly, {'field': field.field});
			if (f) {
				f.readonly = field.readonly;
			} else {
				if (field.readonly) {
					item.__rt$data.readonly.push(field);
				}
			}
		}

		service.removeMarkAsBeingDeleted = function removeMarkAsBeingDeleted(item) {
			_.set(item, '__rt$data.isBeingDeleted', false);
		};

		service.removeMarkAsBeingDeletedFromList = function removeMarkAsBeingDeletedFromList(items) {
			_.forEach(items, service.removeMarkAsBeingDeleted);
		};

		service.markAsBeingDeleted = function markAsBeingDeleted(item) {
			_.set(item, '__rt$data.isBeingDeleted', true);
		};

		service.markListAsBeingDeleted = function markAsBeingDeleted(items) {
			_.forEach(items, service.markAsBeingDeleted);
		};

		service.isBeingDeleted = function isBeingDeleted(item) {
			return _.get(item, '__rt$data.isBeingDeleted', false);
		};

		service.readonly = function readonly(item, fields) {
			if (item) {
				if (_.isBoolean(fields)) {
					_.set(item, '__rt$data.entityReadonly', fields);
				} else {
					if (!item.__rt$data || !item.__rt$data.readonly) {
						item.__rt$data = item.__rt$data || {};
						item.__rt$data.readonly = [];
					}

					if (fields && _.isArray(fields)) {
						for (var i = 0; i < fields.length; i++) {
							changeReadonlyState(item, fields[i]);
						}
					} else {
						return _.get(item, '__rt$data.readonly', []);
					}
				}
			}

			return null;
		};

		service.isReadonly = function isReadOnly(item, field) {
			return _.get(item, '__rt$data.locked', false) || _.get(item || {}, '__rt$data.entityReadonly', false) || _.get(_.find(service.readonly(item), {field: field}), 'readonly', false);
		};

		/**
		 * @ngdoc function
		 * @name clear
		 * @function
		 * @methodOf platformRuntimeDataService
		 * @description removes property __rt$data from entity
		 * @param item {object|array} entit(y|ies)
		 */
		service.clear = function clear(item) {
			if (_.isArray(item)) {
				_.forEach(item, function (item) {
					_.unset(item, '__rt$data');
				});
			} else {
				_.unset(item, '__rt$data');
			}
		};

		/**
		 * @ngdoc function
		 * @name lock
		 * @function
		 * @methodOf platformRuntimeDataService
		 * @description lock the entity during async operations
		 * @param item {object|array} entit(y|ies)
		 * @param state {boolean} state (true/false)
		 * @returns {boolean} current state or nul
		 */
		service.lock = function lock(item, state) {
			if (_.isArray(item)) {
				_.forEach(item, function (item) {
					_.set(item, '__rt$data.locked', state);
				});
			} else {
				_.set(item, '__rt$data.locked', state);
			}
		};

		/**
		 * @ngdoc function
		 * @name isLocked
		 * @function
		 * @methodOf platformRuntimeDataService
		 * @description returns current lock state
		 * @param item {object} entity
		 * @param state {boolean} state (true/false)
		 * @returns {boolean} true if color is assigned, otherwise false
		 */
		service.isLocked = function isLocked(item) {
			return _.get(item, '__rt$data.locked', false);
		};

		function extractError(result) {
			var error = {};

			_.each(Object.getOwnPropertyNames(result), function (prop) {
				if (prop.indexOf('error') === 0) {
					error[prop] = result[prop];
				}
			});

			return error;
		}

		service.applyValidationResult = function (result, item, field) {
			if (result === undefined) {
				result = true;
			}

			if (_.isBoolean(result)) {
				result = {apply: true, valid: result, error: ''};
			} else if (_.isUndefined(result.apply)) {
				result.apply = true;
			}

			if (item) {
				if (result.valid) {
					if (item.__rt$data && item.__rt$data.errors && item.__rt$data.errors[field]) {
						item.__rt$data.errors[field] = null;
					}
				} else {
					if (!item.__rt$data) {
						item.__rt$data = {errors: {}};
					} else if (!item.__rt$data.errors) {
						item.__rt$data.errors = {};
					}

					item.__rt$data.errors[field] = extractError(result);
				}

				if (result.errors && _.isArray(result.errors)) {
					_.each(result.errors, function (error) {
						service.applyValidationResult(error, item, error.field);
					});
				}
			}

			return result;
		};

		service.hasError = function hasError(item, field) {
			var error = _.get(_.get(item, '__rt$data.errors', {}), field, false);

			return error && ((error.error$tr$ && error.error$tr$.length !== 0) || (error.error && error.error.length !== 0));
		};

		service.getErrorText = function getErrorText(item, field) {
			var error = item.__rt$data && item.__rt$data.errors && item.__rt$data.errors[field];

			if (error) {
				if (error.error$tr$) {
					platformTranslateService.translateObject(error, 'error');
				}

				return error.error;
			}

			return '';
		};

		service.createInvalidError = function createInvalidError(textKey) {
			return {
				apply: true,
				valid: false,
				error: platformTranslateService.instant(textKey, undefined, true)
			};
		};

		/**
		 * @ngdoc function
		 * @name hideZeroValue
		 * @function
		 * @methodOf platformRuntimeDataService
		 * @description
		 * @param item {Object} instance
		 * @param field {String|Array} property/properties to set
		 * @param hide {boolean} true to hide zero values
		 */
		service.hideZeroValue = function hideZeroValue(item, field, hide) {
			if (_.isNil(field)) {
				_.set(item, '__rt$data.hideZeroValue.$$hideAllFields', hide);
			} else {
				_.each(field, function (field) {
					_.set(item, '__rt$data.hideZeroValue.' + field, hide);
				});
			}
		};

		/**
		 * @ngdoc function
		 * @name isHideZeroValue
		 * @function
		 * @methodOf platformRuntimeDataService
		 * @description
		 * @param item {object} instance
		 * @param field {string} property to test
		 * @returns {boolean} true, if zero values should be hidden
		 */
		service.isHideZeroValue = function (item, field) {
			return _.get(item, '__rt$data.hideZeroValue.$$hideAllFields', _.get(item, '__rt$data.hideZeroValue.' + field, false));
		};

		/**
		 * @ngdoc function
		 * @name hideContent
		 * @function
		 * @methodOf platformRuntimeDataService
		 * @description
		 * @param item {Object} instance
		 * @param field {String|Array} property/properties to set
		 * @param hide {boolean} true to hide zero values
		 */
		service.hideContent = function hideContent(item, field, hide) {
			if (_.isNil(field)) {
				_.set(item, '__rt$data.hideContent.$$hideAllFields', hide);
			} else {
				_.each(field, function (field) {
					_.set(item, '__rt$data.hideContent.' + field, hide);
				});
			}
		};

		/**
		 * @ngdoc function
		 * @name isHideContent
		 * @function
		 * @methodOf platformRuntimeDataService
		 * @description
		 * @param item {object} instance
		 * @param field {string} property to test
		 * @returns {boolean} true, if zero values should be hidden
		 */
		service.isHideContent = function (item, field) {
			return _.get(item, '__rt$data.hideContent.$$hideAllFields', _.get(item, '__rt$data.hideContent.' + field, false));
		};

		/**
		 * @ngdoc function
		 * @name hideReadonly
		 * @function
		 * @methodOf platformRuntimeDataService
		 * @description
		 * @param item {Object} instance
		 * @param field {String|Array} property/properties to set
		 * @param hide {boolean} true to hide read only values
		 */
		service.hideReadonly = function hideReadonly(item, field, hide) {
			if (_.isNil(field)) {
				_.set(item, '__rt$data.hideReadonly.$$hideAllFields', hide);
			} else {
				_.each(field, function (field) {
					_.set(item, '__rt$data.hideReadonly.' + field, hide);
				});
			}
		};

		/**
		 * @ngdoc function
		 * @name isHideReadonly
		 * @function
		 * @methodOf platformRuntimeDataService
		 * @description
		 * @param item {object} instance
		 * @param field {string} property to test
		 * @returns {boolean} true, if read only values should be hidden
		 */
		service.isHideReadonly = function (item, field) {
			return _.get(item, '__rt$data.hideReadonly.$$hideAllFields', _.get(item, '__rt$data.hideReadonly.' + field, false));
		};

		/**
		 * @ngdoc function
		 * @name colorInfo
		 * @function
		 * @methodOf platformRuntimeDataService
		 * @description gets/sets a color assigned to the specified field/property of the entity
		 * @param item {object} entity
		 * @param fields {string|array|object}
		 * @param color {string} if fields is string, css background color (bg-xxx-1 .. bg-xxx-6)
		 * @returns {string|null} if fields == string and color == undefined, currently assigned value is returned (css class or null)
		 */
		service.colorInfo = function colorInfo(item, fields, color) {
			if (item && fields) {
				if (!item.__rt$data || !item.__rt$data.colorInfo) {
					item.__rt$data = item.__rt$data || {};
					item.__rt$data.colorInfo = {};
				}

				if (_.isString(fields)) {
					if (_.isUndefined(color)) {
						return _.get(item, '__rt$data.colorInfo.' + fields, null);
					}
					_.set(item.__rt$data.colorInfo, fields, color);
				} else if (_.isArray(fields)) { // [{field: 'field1', colorInfo: 'bg-blue-4'},{field: 'field2', colorInfo: 'bg-yellow-6'}
					_.each(fields, function (field) {
						_.set(item.__rt$data.colorInfo, field.field, field.colorInfo);
					});
				} else { // { field1: 'bg-blue-4', field2: 'bg-yellow-6', field3: null }
					_.assign(item.__rt$data.colorInfo, fields);
				}
			}
		};

		/**
		 * @ngdoc function
		 * @name hasColorInfo
		 * @function
		 * @methodOf platformRuntimeDataService
		 * @description check if entity has set a color for given field
		 * @param item {object} entity
		 * @param field {string} field/property to check
		 * @returns {boolean} true if color is assigned, otherwise false
		 */
		service.hasColorInfo = function hasColorInfo(item, field) {
			return !!_.get(item, '__rt$data.colorInfo.' + field, null);
		};

		/**
		 * @ngdoc function
		 * @name hasWarnings
		 * @function
		 * @methodOf platformRuntimeDataService
		 * @description check if entity has warnings attached
		 * @param item {object} entity
		 * @param field {string} field/property to check
		 * @returns {boolean} true if warning assigned, otherwise false
		 */
		service.hasWarnings = function hasWarnings(item, field) {
			var warning = item.__rt$data && item.__rt$data.warnings && item.__rt$data.warnings[field];

			return warning && ((warning.warning$tr$ && warning.warning$tr$.length) || (warning.warning && warning.error.length));
		};

		return service;
	}
})();
