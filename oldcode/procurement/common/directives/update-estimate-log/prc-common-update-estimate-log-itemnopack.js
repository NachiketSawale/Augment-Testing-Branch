/**
 * Created by wul on 12/11/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).directive('prcCommonUpdateEstimateLogItemnopack',
		[
			function () {
				return {
					restrict: 'EA',
					template: '<textarea class="form-control" data-ng-model="logInfo"  readonly="" style="height: 70px" ></textarea>',
					link: function (scope/* , element */) {
						scope.logInfo = scope.$parent.$parent.entity.prcItemsNoPackage;

					}
				};
			}]);

})(angular);