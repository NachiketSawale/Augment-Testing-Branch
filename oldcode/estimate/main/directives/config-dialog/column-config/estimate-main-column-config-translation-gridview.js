/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global globals */
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc directive
	 * @name estimateMainColumnConfigTranslationGridview
	 * @requires none
	 * @description display a gridview to configure dynamic columns translations
	 */

	angular.module(moduleName).directive('estimateMainColumnConfigTranslationGridview', [
		function () {

			return {
				restrict: 'A',
				scope : {
					entity:'=',
					ngModel:'=',
					options:'='
				},
				templateUrl: globals.appBaseUrl + 'estimate.main/templates/column-config/estimate-main-column-config-translation-gridview.html'
			};
		}
	]);

})(angular);
