/**
 * $Id: $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name estimateMainRuleScriptDataService
	 * @description provides validation methods for estimate rule script data.
	 */
	angular.module('estimate.main').factory('estimateMainRuleScriptDataService',
		['$injector',
			function ($injector) {

				let options = {
					parentService: $injector.get('estimateMainRuleDataService'),
					entityItemName: 'PrjEstRuleScript'
				};

				return $injector.get('estimateProjectEstRuleScriptServiceFactory').createRuleScriptDataService(options);
			}
		]);
})();
