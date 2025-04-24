/*globals angular */
(function (angular) {
	'use strict';

	function basicsWorkflowReportButtonDirective(reportingPlatformService) {
		return {
			restrict: 'A',
			scope: {
				options: '='
			},
			replace: true,
			template: '<button type="button" class="btn btn-default fullwidth" data-ng-click="openReport()">{{options.displayText}}</button>',
			link: function (scope) {
				scope.openReport = function openReport() {

					if (angular.isString(scope.options.parameters)) {
						scope.options.parameters = angular.fromJson(scope.options.parameters);
					}
					if (angular.isString(scope.options.report)) {
						scope.options.report = angular.fromJson(scope.options.report);
					}

					var reportType;
					if (scope.options.hasOwnProperty('gearData') === false) {
						reportType = 'fpx';
					} else {
						reportType = (scope.options.gearData.name && !_.isString(scope.options.gearData)) ? scope.options.gearData.name : 'fpx';
					}

					reportingPlatformService.prepare(scope.options.report, scope.options.parameters, reportType).then(function (response) {
						reportingPlatformService.show(response);
					});
				};
			}
		};
	}

	basicsWorkflowReportButtonDirective.$inject = ['reportingPlatformService'];

	angular.module('basics.workflow').directive('basicsWorkflowReportButtonDirective', basicsWorkflowReportButtonDirective);
})(angular);