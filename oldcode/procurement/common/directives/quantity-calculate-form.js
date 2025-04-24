/**
 * Created by lja on 01/27/2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';

	// this directive is for showing the quantity form and normal data form in the same form ,
	// and it will be removed  after the form had optimized
	angular.module(moduleName).directive('prcCommonQuantityCalculate',
		['procurementCommonDeliveryScheduleDataService', 'procurementContextService',
			function (procurementCommonDeliveryScheduleDataService, moduleContext) {
				return {
					restrict: 'A',
					scope: true,
					controller:['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
						$scope.deliverySetting = {
							configs: $attrs.config ? $scope.$eval($attrs.config) : {},
							options: $attrs.options ? $scope.$eval($attrs.options) : {}
						};
						$scope.deliverySetting.configs.readonly = true;
					}],
					template: '<div class="platform-form-col">' +
					'<div data-domain-control data-domain="quantity" data-model="scheduled[modelField]" data-options="deliverySetting.options" data-config="deliverySetting.configs"></div></div>',
					link: function (scope, element, attrs) {

						scope.modelField = attrs.ngModel.replace('entity.', '');

						var service = procurementCommonDeliveryScheduleDataService.getService(moduleContext.getItemDataService());
						scope.scheduled = service.Scheduled;
					}
				};
			}]);

})(angular);
