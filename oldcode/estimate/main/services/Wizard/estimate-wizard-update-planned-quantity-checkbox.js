/**
 * $Id: estimate-main-update-planned-quantity-checkbox.js
 * Copyright (c) RIB Software SE
 */
(function (){

	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc directive
	 * @name estimateWizardUpdatePlannedQuantityCheckbox
	 * @description
	 */
	angular.module(moduleName).directive('estimateWizardUpdatePlannedQuantityCheckbox',[
		function () {
			return {
				restrict: 'A',
				templateUrl: window.location.pathname + '/estimate.main/templates/wizard/update-line-item-quantity/update-planned-quantity.html',
				link: function link(scope) {

					scope.onCheckIsUpdatePlannedQuantity = function () {
						this.entity.updatePlannedQuantity = !this.entity.updatePlannedQuantity;
					};

				}
			};

		}]);

})();