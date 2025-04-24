/**
 * $Id: estimate-main-update-billing-quantity-checkbox.js
 * Copyright (c) RIB Software SE
 */
(function (){

	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc directive
	 * @name estimateWizardUpdateBillingQuantityCheckbox
	 * @description
	 */
	angular.module(moduleName).directive('estimateWizardUpdateBillingQuantityCheckbox',[
		function () {
			return {
				restrict: 'A',
				templateUrl: window.location.pathname + '/estimate.main/templates/wizard/update-line-item-quantity/update-billing-quantity.html',
				link: function link(scope) {

					scope.onCheckIsUpdateBillingQuantity = function () {
						this.entity.updateBillingQuantity = !this.entity.updateBillingQuantity;
					};

				}
			};

		}]);

})();