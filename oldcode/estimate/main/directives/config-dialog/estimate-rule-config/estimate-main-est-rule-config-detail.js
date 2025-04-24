/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name estimateMainRuleConfigDetail
	 * @requires
	 * @description
	 */
	angular.module('estimate.main').directive('estimateMainRuleConfigDetail',['$templateCache', function ($templateCache) {
		return {
			restrict: 'A',
			template : $templateCache.get('estimate-main-est-rule-config-detail.html')
		};
	}]);
})();
