/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function() {
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc directive
	 * @name estimateMainRoundingConfigDetailGrid
	 * @requires
	 * @description display a gridview to configure rounding
	 */

	angular.module(moduleName).directive('estimateMainRoundingConfigDetailGrid', ['$templateCache',
		function ($templateCache) {
			return {
				restrict: 'A',
				template : $templateCache.get('estimate-main-rounding-config-detail.html')
			};
		}
	]);

})();