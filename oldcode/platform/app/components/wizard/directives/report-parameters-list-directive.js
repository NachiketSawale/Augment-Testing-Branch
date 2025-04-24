(function (angular) {
	'use strict';

	angular.module('platform').directive('reportParametersListDirective', reportParametersListDirective);

	reportParametersListDirective.$inject = ['_', 'globals', '$injector', 'reportingPlatformService', 'genericWizardContextHelperService', 'genericWizardUseCaseConfigService', 'genericWizardService', 'genericWizardErrorService'];

	function reportParametersListDirective(_, globals, $injector, reportingPlatformService, genericWizardContextHelperService, genericWizardUseCaseConfigService, genericWizardService, genericWizardErrorService) {
		return {
			restrict: 'E',
			templateUrl: globals.appBaseUrl + 'app/components/wizard/partials/report-parameters-list-template.html',
			scope: {
				list: '='
			},
			link: function ($scope) {
				$scope.openReport = function openReport(id) {
					var report = _.find($scope.list, {Id: id});
					if (report) {
						genericWizardContextHelperService.setReportParamValues([report]);

						var reportObj = {
							'Id': report.Id,
							'Name': report.Name.Description,
							'TemplateName': report.FileName,
							'Path': report.FilePath
						};
						// replace parameter variables
						reportingPlatformService.prepare(reportObj, report.Parameters, null).then(function (response) {
							reportingPlatformService.show(response);
						});
					}
				};

				$scope.coverLetterSelectionChanged = function (id) {
					excludeOtherCoverLetters(id);
					var containerUUID = genericWizardService.getWizardController().currentStep().headerInfos[0].uuid;
					var container = genericWizardUseCaseConfigService.getUseCaseContainer(genericWizardService.config.Id, containerUUID);
					if (_.isFunction(container.validFn)) {
						genericWizardErrorService.removeContainerMessages(container.uuid);
						var messageList = container.validFn(container.uuid);
						genericWizardErrorService.addMessageList(messageList);
					}
				};

				function excludeOtherCoverLetters(id) {
					_.forEach($scope.list, function (report) {
						if (report.Id !== id) {
							report.IsIncluded = false;
						}
					});
				}
			}
		};
	}
})(angular);
