
(function () {

	'use strict';

	let moduleName = 'controlling.structure';

	angular.module(moduleName).directive('controllingStructureUpdateSalesRevenueCheckbox', [
		function () {
			return {
				restrict: 'A',
				templateUrl: window.location.pathname + '/controlling.structure/templates/controlling-structure-transfer-scheduler/controlling-structure-update-sales-revenue-checkbox.html',
				link: function link(scope) {
					// TODO:check the CreateNew to disable the Okbutton yes/no.
					scope.onCheckUpdateRevenue = function () {
						this.entity.updateRevenue = !this.entity.updateRevenue;
						if(!this.entity.updateRevenue){
							this.entity.revenueUpdateFrom = -1;
						}else {
							this.entity.revenueUpdateFrom = 1;
						}
					};
				}
			};
		}]);
})();
