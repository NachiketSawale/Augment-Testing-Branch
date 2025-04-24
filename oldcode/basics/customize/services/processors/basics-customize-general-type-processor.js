(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsCustomizeStringColumnConfigurationProcessor
	 * @function
	 *
	 * @description
	 * The basicsCustomizeStringColumnConfigurationProcessor set the StringColumnConfiguration property documentation readonly
	 */

	angular.module('basics.customize').factory('basicsCustomizeGeneralTypeProcessor', ['_', '$http', 'platformRuntimeDataService', function (_, $http, platformRuntimeDataService) {

		var service = {};

		$http.post(globals.webApiBaseUrl + 'basics/customize/crbpriceconditiontype/list').then(function (response) {
			if (response.data !== null) {
				service.crbPriceConditionTypes = response.data;
			}
		}, function () {
		});

		service.processItem = function processItem(item) {
			if (!_.isNil(item.CrbPriceConditionTypeFk)) {
				if (!_.isNil(service.crbPriceConditionTypes)) {
					var crbPriceConditionType = _.find(service.crbPriceConditionTypes, {Id: item.CrbPriceConditionTypeFk});
					if (!_.isNil(crbPriceConditionType)) {
						if (crbPriceConditionType.IsGeneralstype === true) {
							item.IsPercent = false;
							platformRuntimeDataService.readonly(item, [{field: 'IsPercent', readonly: true}]);
						} else {
							platformRuntimeDataService.readonly(item, [{field: 'IsPercent', readonly: false}]);
						}
					}
				}
			}
		};

		return service;

	}]);
})(angular);
