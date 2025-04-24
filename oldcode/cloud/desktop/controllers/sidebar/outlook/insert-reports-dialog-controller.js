/**
 * Created by miu on 9/7/2023.
 */
(function (angular) {
	'use strict';

	angular.module('cloud.desktop').controller('insertReportsDialogController', [
		'_',
		'$q',
		'$http',
		'$scope',
		'globals',
		'$translate',
		'$compile',
		'platformContextService',
		'$state',
		'$templateCache',
		'$rootScope',
		'platformTranslateService',
		'cloudCommonInitUiLanguageItems',
		'basicsReportingSidebarService',
		function (
			_,
			$q,
			$http,
			$scope,
			globals,
			$translate,
			$compile,
			platformContextService,
			$state,
			$templateCache,
			$rootScope,
			platformTranslateService,
			cloudCommonInitUiLanguageItems,
			basicsReportingSidebarService
		) {
			$scope.reports = [];
			$scope.parameters = [];
			$scope.selectedReportId = 0;
			$scope.reportingSidebar = {};
			$scope.reportingSidebar.itemTemplate = $templateCache.get('basics.reporting/sidebar-item.html');
			$scope.reportingSidebar.errorTemplate = $templateCache.get('basics.reporting/sidebar-error.html');
			$scope.reportingSidebar.groupTemplate = $templateCache.get('basics.reporting/sidebar-group.html');
			$scope.reportingSidebar.validateAndExecuteTitle = '';
			$scope.reportingSidebar.validateAndExecuteText = '';
			$scope.reportingSidebar.report = null;
			$scope.reportingSidebar.infoHeader = '';
			$scope.reportingSidebar.backListTitle = platformTranslateService.instant('basics.reporting.sidebarBackTitle', null, true);
			$scope.reportingSidebar.reportToolbar = {};
			$scope.reportingSidebar.processDialogSection = processDialogSection;

			$scope.modalOptions = {
				headerText: $translate.instant('cloud.desktop.outlook.reportsTitle'),
				cancel: function () {
					$scope.$close({
						ok: false
					});
				},
				ok: function (result) {
					$scope.$close({
						ok: true,
						result
					});
				}
			};
			$scope.isLoading = false;
			$scope.hasParameters = false;
			$scope.isShowParameters = false;
			$scope.initialize = function () {
				let module = getModuleName($state.current);
				$scope.isDisableGenerate = true;
				$http({method: 'GET', url: globals.webApiBaseUrl + 'basics/reporting/sidebar/load?module=' + module})
					.then(function (response) {
						if (response.data) {
							let reports = [];
							_.forEach(response.data, group => {
								reports = _.concat(reports, group.reports);
							});
							$scope.reports = reports;
						}
					});
			};

			$scope.generate = function (type) {
				let report = $scope.reportingSidebar.report;
				basicsReportingSidebarService.resolveParameters(report);
				if (report) {
					let generateRequest = {
						ReportId: report.id,
						GenerateType: type
					};
					report.parameters = generateRequest.Parameters = _.concat(_.map(report.parameters, function (item) {
						return {
							Key: item.parameterName,
							Value: {
								Name: item.parameterName,
								ParamValue: _.isNull(item.value) ? null : angular.toJson(item.value),
								ParamValueType: item.dataType
							}
						};
					}), _.map(report.hiddenParameters, function (item) {
						return {
							Key: item.parameterName,
							Value: {
								Name: item.parameterName,
								ParamValue: _.has(item, 'value') ? (_.isNull(item.value) ? null : angular.toJson(item.value)) : item.defaultValue,
								ParamValueType: item.dataType
							}
						};
					}));
					$scope.modalOptions.ok({
						report: report,
						generateRequest: generateRequest,
						type: type === 1 ? 'html' : 'file'
					});
				}
			};

			$scope.onSelectReport = function (reportId) {
				if (reportId !== $scope.selectedReportId) {
					$scope.isShowParameters = false;
					$scope.hasParameters = false;
					$scope.selectedReportId = reportId;
					let selectedReport = _.find($scope.reports, report => report.id === reportId);
					$scope.reportingSidebar.report = selectedReport;
					loadReportParameters(selectedReport);
				}
			};

			function loadReportParameters(report) {
				$scope.isLoading = true;
				return $http({
					method: 'GET',
					url: globals.webApiBaseUrl + 'basics/reporting/sidebar/parameters?id=' + report.id + '&module=' + getModuleName($state.current)
				})
					.then(function (response) {
						report.parameters = _.filter(response.data, {isVisible: true});
						report.hiddenParameters = _.filter(response.data, {isVisible: false});
						report.dialogSection = _.filter(response.data, {context: 11});
						let map = {};
						let reportInfo = {
							reportName: report.name,
							fileName: report.filename,
							reportId: report.id
						};
						_.forEach(report.dialogSection, function (p) {
							let key = p.name;

							if (key in map) {
								map[key].parameter.push(p);
							} else {
								map[key] = {
									reportInfo: reportInfo,
									parameter: [p]
								};
							}
							p.dialogSection = map[key];
						});
						report.dialogSection = map;
						$scope.reportingSidebar.showList = false;
						$scope.isDisableGenerate = false;
						$scope.hasParameters = _.filter(report.parameters, item => item.context === 0 || item.context === 10).length > 0;
						$scope.isShowParameters = true;
						return report;
					}).finally(()=>{
						$scope.isLoading = false;
					});
			}

			function processDialogSection(value) {
				$rootScope.$emit('reporting:resolveCustomParameter', value);
			}

			function getModuleName(state) {
				let urlPath = state.url.split('/');
				if (urlPath[0] !== '^') {
					return urlPath[1];
				}
				return urlPath[1] + '.' + urlPath[2];
			}

			$scope.initialize();
		}
	]);
})(angular);