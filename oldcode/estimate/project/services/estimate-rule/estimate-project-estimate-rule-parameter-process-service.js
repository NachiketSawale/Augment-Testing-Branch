/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name estimateProjectEstimateRuleParameterProcessor
	 * @function
	 *
	 * @description
	 * The estimateProjectEstimateRuleParameterProcessor process rules.
	 */
	angular.module('estimate.project').factory('estimateProjectEstimateRuleParameterProcessor', [
		function () {

			let service = {};

			service.processItem = function processItem() {

			};

			service.select = function (parameter) {
				if (parameter && parameter.Code !== null) {
					if (parameter.IsUnique !== undefined && !parameter.IsUnique) {  // the code is not unique,show the info pic
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
