
(function () {

	'use strict';

	let moduleName = 'controlling.structure';

	angular.module(moduleName).directive('controllingStructureUpdateLineItemQuantityCheckbox', [
		function () {
			return {
				restrict: 'A',
				templateUrl: window.location.pathname + '/controlling.structure/templates/controlling-structure-transfer-scheduler/controlling-structure-update-line-item-quantity-checkbox.html',
				link: function link(scope) {
					// TODO:check the CreateNew to disable the Okbutton yes/no.
					scope.onCheckUpdateInstalledQty = function () {
						this.entity.updateInstalledQty = !this.entity.updateInstalledQty;
						if(!this.entity.updateInstalledQty){
							this.entity.insQtyUpdateFrom = -1;
						}else{
							this.entity.insQtyUpdateFrom = 1;
						}
					};
				}
			};
		}]);
})();
