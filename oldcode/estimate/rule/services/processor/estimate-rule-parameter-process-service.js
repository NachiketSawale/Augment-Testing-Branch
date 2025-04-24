(function (angular) {
	'use strict';
	/**
     * @ngdoc service
     * @name estimateRuleProcessor
     * @function
     *
     * @description
     * The estimateRuleProcessor process rules.
     */
	angular.module('estimate.rule').factory('estimateRuleParameterProcessor', [
		function () {

			let service = {};

			service.processItem = function processItem() {

			};
			service.processData = function processData() {

			};

			service.select = function (lineItem) {
				if (lineItem.Code !== null) {
					if (lineItem.IsUnique !== undefined && !lineItem.IsUnique) {  // the code is not unique,show the info pic
						return 'status-icons ico-status117';
					} else {
						return '';
					}
				}
			};

			service.isCss = function () {
				return true;
			};

			return service;
		}]);
})(angular);
