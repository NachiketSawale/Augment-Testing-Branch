/**
 * Created by lnt on 8/17/2016.
 */
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
	 * @name estimateMainTotalsConfigTranslationGridview
	 * @requires none
	 * @description display a gridview to configure totals translations
	 */

	angular.module(moduleName).directive('estimateMainTotalsConfigTranslationGridview', [
		function () {

			return {
				restrict: 'A',
				scope : {
					entity:'=',
					ngModel:'=',
					options:'='
				},
				templateUrl: globals.appBaseUrl + 'estimate.main/templates/totals-config/estimate-main-totals-config-translation-gridview.html'
			};
		}
	]);

})(angular);
