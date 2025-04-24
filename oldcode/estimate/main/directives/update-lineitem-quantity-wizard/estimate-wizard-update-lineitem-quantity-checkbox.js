/**
 * $Id: estimate-main-update-lineitem-quantity-checkbox.js
 * Copyright (c) RIB Software SE
 */
(function (){

	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc directive
	 * @name estimateWizardUpdateLineitemQuantityCheckbox
	 * @description
	 */
	angular.module(moduleName).directive('estimateWizardUpdateLineitemQuantityCheckbox',[
		function () {
			return {
				restrict: 'A',
				templateUrl: window.location.pathname + '/estimate.main/templates/wizard/update-line-item-quantity/update-lineitem-quantity.html',
				link: function link(scope) {

					scope.onCheckIsScheduleChange = function () {
						this.entity.isSchedule = !this.entity.isSchedule;
					};

					scope.onCheckIsWipChange = function () {
						this.entity.isWip = !this.entity.isWip;
					};

					scope.onCheckIsPesChange = function () {
						this.entity.isPes = !this.entity.isPes;
					};
				}
			};

		}]);

})();