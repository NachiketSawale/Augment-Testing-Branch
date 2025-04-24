/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name estimateMainStructureConfigDetail
	 * @requires
	 * @description
	 */
	angular.module('estimate.main').directive('estimateMainStructureConfigDetail',['$templateCache', function ($templateCache) {
		return {
			restrict: 'A',
			template : $templateCache.get('estimate-main-est-structure-config-detail.html')
		};
	}]);
})();
