(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).directive('showDrawDownTextDirective', [
		function () {
			return {
				restrict: 'A',
				scope: {
					value: '=ngModel'
				},
				template:
						'<div class="input-group lookup-container form-control" style="box-sizing: border-box;border: none;top: 0;left: 0;outline: none;" >\n' +
							'<input data-ng-pattern-restrict="^[\\s\\S]{0,2000}$" data-ng-model="value" data-ng-value="value"  class="input-group-content"/>\n' +
							'<button class="block-image tlb-icons ico-menu " style="position: relative; width: 20px;height: 21px;" ng-click="openPopup($event)"></button>\n' +
						'</div>',
				controller: ['$scope',
					'remarkOpenPopupService',
					function (
						$scope,
						remarkOpenPopupService
					) {
						$scope.openPopup = function(e) {
							remarkOpenPopupService.openPopup(e, $scope);
						};
						$scope.textChange = function textChange(obj) {
							$scope.value = obj.value;
						};
					}]
			};
		}
	]);
})(angular);