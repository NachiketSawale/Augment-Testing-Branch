/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc directive
	 * @name estimateMainColumnConfigDetailGrid
	 * @requires
	 * @description display a gridview to configure dynamic columns
	 */

	angular.module(moduleName).directive('estimateMainColumnConfigDetailGrid', ['$templateCache',
		function ($templateCache) {
			return {
				restrict: 'A',
				template : $templateCache.get('estimate-main-column-config-details.html')
			};
		}
	]);

})(angular);
