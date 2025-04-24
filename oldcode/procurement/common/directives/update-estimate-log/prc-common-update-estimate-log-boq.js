/**
 * Created by wul on 8/9/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).directive('prcCommonUpdateEstimateLogBoq',
		[
			function () {
				return {
					restrict: 'EA',
					template: '<textarea class="form-control" data-ng-model="logInfo"  readonly="" style="height: 70px" ></textarea>',
					link: function (scope, element) {
						scope.logInfo = scope.$parent.$parent.entity.updatedBoqNo;
						if(scope.$parent.$parent.entity.descIsTurncated){
							element.children().first().css('height', '100px');
						}
					}
				};
			}]);

})(angular);