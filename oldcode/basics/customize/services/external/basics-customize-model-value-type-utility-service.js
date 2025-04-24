/*
 * $Id: basics-customize-model-value-type-utility-service.js 589975 2020-06-08 07:40:34Z haagf $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeModelValueTypeUtilityService
	 * @function
	 *
	 * @description
	 * Contains helper routines for model value types.
	 */
	angular.module(moduleName).factory('basicsCustomizeModelValueTypeUtilityService', ['$http',
		function ($http) {
			var service = {};

			service.getValueTypeInfo = function (valueType) {
				function createResultObject(domain, typeSuffix) {
					return {
						domain: domain,
						typeSuffix: typeSuffix
					};
				}

				switch (valueType) {
					case 1:
						return createResultObject('remark', 'Text');
					case 2:
						return createResultObject('decimal', 'Number');
					case 3:
						return createResultObject('integer', 'Long');
					case 4:
						return createResultObject('boolean', 'Bool');
					case 5:
						return createResultObject('dateutc', 'Date');
					default:
						return null;
				}
			};

			service.getBasicValueTypeMapping = function () {
				return $http.get(globals.webApiBaseUrl + 'basics/customize/modelvaluetype/vtmapping').then(function (response) {
					var result = {
						valueTypeToId: {},
						idToValueType: {}
					};

					response.data.forEach(function (item) {
						result.valueTypeToId[item.ValueType] = item.Ids;
						item.Ids.forEach(function (id) {
							result.idToValueType[id] = item.ValueType;
						});
					});

					return result;
				});
			};

			return service;
		}]);
})();