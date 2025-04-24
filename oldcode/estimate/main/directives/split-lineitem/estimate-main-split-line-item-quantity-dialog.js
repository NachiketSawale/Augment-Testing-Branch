/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	/**
     * @ngdoc directive
     * @name estimateMainSplitLineItemQuantityDialog
     * @description
     */
	angular.module('estimate.main').directive('estimateMainSplitLineItemQuantityDialog',
		function () {
			return {
				restrict: 'A',
				templateUrl: window.location.pathname + '/estimate.main/templates/wizard/split-lineitem/estimate-main-split-line-item-quantity-dialog.html'
			};
		});
})();
