/*
 * Created by wul at 7/17/2023
 *
 */
(function (angular) {
	'use strict';
	const moduleName = 'basics.common';
	angular.module(moduleName).directive('basicsCommonChartEmptyDirective',
		[function () {
			return {
				restrict: 'E',
				template: '<div>{{configErr}}</div>',
				replace: true,
				scope: {
					chartEntity: '=',
					configErr: '='
				},
				link: function (scope, element) {

					scope.$watch('configErr', function () {
						if(scope.configErr && scope.chartEntity && scope.chartEntity.containerTitle){
							let titleElement = element.parent().parent().parent().children('.subview-header').children('.title');
							if(titleElement && titleElement.html().indexOf(' - ' + scope.chartEntity.containerTitle) < 0){
								let titles = titleElement.html().split(' - ');
								titleElement.html(titles[0] +' - ' + scope.chartEntity.containerTitle);
							}
						}
					});
				}
			};
		}
		]);

})(angular);