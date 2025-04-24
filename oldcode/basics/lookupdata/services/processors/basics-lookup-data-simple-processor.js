/**
 * Created by balkanci on 03.03.2015.
 */
(function (angular) {
	'use strict';

	angular.module('basics.lookupdata').factory('basicsLookupSimpleDataProcessor', ['_', '$log',

		function (_, $log) {

			var service = {};
			/** this processor is used by the simpleLookup to map the general format e.g.:
			 {
			   	valueMember:1,
			   	displayMember:'fooBar',
			   	customIntProperty:789,
			   	customIntProperty1:465,
			   	customBoolProperty:true,
			   	customBoolProperty1:false
			 }
			 to an desired
			 object representation:
			 {
			   	Id:1,
			   	Description:'fooBar',
			  	ScheduleFk:789,
			   	ProjectFk:465,
			  	IsBaseline:true,
			  	IsNiceValue:false
			 }
			 */

			service.getProcessor = function getProcessor() {

				return function (data, lookupOptions) {
					var items = data;
					if (items && angular.isArray(items) && lookupOptions) {
						items = _.map(items, function (item) {
							var mappedLookupItem = {};
							mappedLookupItem[lookupOptions.displayMember] = item.displayValue;
							mappedLookupItem[lookupOptions.valueMember] = item.itemValue;
							mappedLookupItem.sorting = !_.isNil(item.sorting) ? item.sorting : null;
							mappedLookupItem.isLive = !_.isNil(item.isLive) ? item.isLive : null;
							mappedLookupItem.isDefault = item.isDefault ? item.isDefault : null;
							mappedLookupItem.icon = item.icon ? item.icon : null;
							if (lookupOptions.filter) {
								var filter = lookupOptions.filter;
								if (_.isUndefined(filter.customIntegerProperty) && filter.field) {
									$log.warn('The parameter "field" ('+ filter.field + ', lookupModuleQualifier: ' + lookupOptions.lookupModuleQualifier + ') is only for usage with "customIntegerProperty". For all other like "customBoolProperty" or "customIntegerProperty1" field will be ignored!');
								}

								if (filter.customIntegerProperty) {
									mappedLookupItem[filter.field ? filter.field : createPascalPropertyName(filter.customIntegerProperty)] = _.isInteger(item.customIntProperty) ? item.customIntProperty : undefined;
								}
								if (filter.customIntegerProperty1) {
									mappedLookupItem[createPascalPropertyName(filter.customIntegerProperty1)] = _.isInteger(item.customIntProperty1) ? item.customIntProperty1 : undefined;
								}
								if (filter.customBoolProperty) {
									mappedLookupItem[createPascalPropertyName(filter.customBoolProperty)] = _.isBoolean(item.customBoolProperty) ? item.customBoolProperty : undefined;
								}
								if (filter.customBoolProperty1) {
									mappedLookupItem[createPascalPropertyName(filter.customBoolProperty1)] = _.isBoolean(item.customBoolProperty1) ? item.customBoolProperty1 : undefined;
								}
							}
							return mappedLookupItem;
						});
					}
					return items;
				};
			};

			function createPascalPropertyName(originName) {
				if (_.isString(originName)) {
					var camelCase = _.camelCase(originName);
					var firstLetter = originName.charAt(0).toUpperCase();
					return firstLetter + camelCase.slice(1);
				}
			}

			service.getFilterProcessor = function getFilterProcessor() {

				return function (data) {
					var items = data;
					if (items && angular.isArray(items)) {
						items = _.filter(items, function (item) {
							return item.sorting !== 0 && item.isLive !== false;
						});
					}
					return items;
				};
			};

			service.getSortProcessor = function getSortProcessor() {
				return function (list) {
					return _.sortBy(list, ['Code']);
				};
			};

			return service;

		}]);
})(angular);


