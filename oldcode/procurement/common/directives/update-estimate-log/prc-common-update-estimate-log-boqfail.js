/**
 * Created by wul on 8/9/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).directive('prcCommonUpdateEstimateLogBoqfail',
		[
			function () {
				return {
					restrict: 'EA',
					template: '<textarea class="form-control" data-ng-model="logInfo"  readonly="" style="height: 70px"></textarea>',
					link: function (scope/* , element */) {
						scope.logInfo = scope.$parent.$parent.entity.failBoqNo;

					}
				};
			}]);

})(angular);
