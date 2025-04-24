(function (angular) {
	'use strict';

	angular.module('platform').controller('reportParametersListController', reportParametersListController);

	reportParametersListController.$inject = ['_', '$scope', '$injector', '$element'];

	function reportParametersListController(_, $scope, $injector, $element) {

		const containerId = $scope.$eval($element[0].attributes['container-id'].nodeValue);
		const genericWizardService = $injector.get('genericWizardService');
		const servicePrefix = genericWizardService.config.serviceInfos.servicePrefix;

		if (containerId === 'coverLetter') {
			$scope.coverLetterList = [];
			$scope.emailContext = {
				subject: ''
			};

			const coverLetterService = genericWizardService.getDataServiceByName(servicePrefix + 'CoverLetterService');
			coverLetterService.wizardFunctions.setSubject(); //TODO: needed?
			$scope.emailContext.subject = coverLetterService.wizardFunctions.emailContext.subject;
			$scope.subjectPlaceholder = _.cloneDeep(coverLetterService.wizardFunctions.emailContext).subject;

			$scope.$watch('emailContext.subject', function (newVal, oldVal) {
				if (newVal !== oldVal) {
					coverLetterService.wizardFunctions.emailContext.subject = newVal;
				}
			});

			const coverLetterUnwatch = $scope.$watch(function () {
				return coverLetterService.getList();
			}, function (coverLetterList) {
				if (_.isArray(coverLetterList) && !_.isEmpty(coverLetterList) && _.every(coverLetterList, function (coverLetter) {
					return !!coverLetter.parameters;
				})) {
					let defaultCoverLetter = _.find(coverLetterList, function (coverLetter) {
						return coverLetter.IsDefault;
					});

					if (!defaultCoverLetter) {
						defaultCoverLetter = coverLetterList[0];
					}
					defaultCoverLetter.IsIncluded = true;

					$scope.coverLetterList = coverLetterList;
					coverLetterUnwatch();
				}
			}, true);
		}

		if (containerId === 'report') {
			$scope.mandatoryList = [];
			$scope.optionalList = [];

			const reportService = genericWizardService.getDataServiceByName(servicePrefix + 'ReportService');

			const reportUnwatch = $scope.$watch(function () {
				return reportService.getList();
			}, function (reportList) {
				if (_.isArray(reportList) && !_.isEmpty(reportList) && _.every(reportList, function (report) {
					return !!report.parameters;
				})) {
					const groupedReports = _.groupBy(reportList, function (report) {
						return report.IsMandatory;
					});

					if (groupedReports.true) {
						_.forEach(groupedReports.true, function (mandatoryReport) {
							mandatoryReport.IsIncluded = true;
						});
						$scope.mandatoryList = groupedReports.true;
					}

					if (groupedReports.false) {
						_.forEach(groupedReports.false, function (optionalReport) {
							if (optionalReport.IsDefault) {
								optionalReport.IsIncluded = true;
							}
						});
						$scope.optionalList = groupedReports.false;
					}
					reportUnwatch();
				}
			}, true);
		}

		$scope.$on('$destroy', function () {
			const genericWizardService = $injector.get('genericWizardService');
			const coverLetterService = genericWizardService.getDataServiceByName(servicePrefix + 'CoverLetterService');
			const reportService = genericWizardService.getDataServiceByName(servicePrefix + 'ReportService');

			coverLetterService.clear();
			reportService.clear();
		});
	}
})(angular);
