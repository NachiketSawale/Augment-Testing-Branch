/*
 * $Id: reporting-sidebar-controller.js 598369 2020-08-04 08:46:21Z kh $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	var moduleName = 'basics.reporting';

	angular.module(moduleName).controller('basicsReportingSidebarController', BasicsReportingSidebarController);

	BasicsReportingSidebarController.$inject = ['$scope', '$rootScope', '$templateCache', '$log', '$q', '$timeout', '_', 'basicsReportingSidebarService', 'reportingPlatformService', 'platformTranslateService', 'cloudCommonInitUiLanguageItems', '$translate', 'platformModalService'];

	function BasicsReportingSidebarController($scope, $rootScope, $templateCache, $log, $q, $timeout, _, basicsReportingSidebarService, reportingPlatformService, platformTranslateService, cloudCommonInitUiLanguageItems, $translate, platformModalService) { // jshint ignore: line
		var ctrl = this;
		var unregister = [];

		ctrl.data = basicsReportingSidebarService.data;
		ctrl.data.showSelected = true;
		ctrl.itemTemplate = $templateCache.get('basics.reporting/sidebar-item.html');
		ctrl.errorTemplate = $templateCache.get('basics.reporting/sidebar-error.html');
		ctrl.groupTemplate = $templateCache.get('basics.reporting/sidebar-group.html');
		ctrl.showParametersOrExecute = showParametersOrExecute;
		ctrl.validateAndExecute = validateParametersAndExecute;
		ctrl.validateAndExecuteTitle = '';
		ctrl.validateAndExecuteText = '';
		ctrl.backListTitle = '';
		ctrl.pending = pending;
		ctrl.toggleView = toggleView;
		ctrl.showList = true;
		ctrl.report = null;
		ctrl.infoHeader = '';
		ctrl.reportToolbar = {};
		ctrl.processDialogSection = processDialogSection;

		unregister.push($rootScope.$on('permission-service:changed', function () {
			ctrl.toggleView(true);
			ctrl.data.groups = [];
			basicsReportingSidebarService.loadReports(ctrl.data.module.name)
				.then(function () {
					ctrl.data = basicsReportingSidebarService.data;
				});
		}));

		unregister.push($scope.$on('$destroy', function () {
			ctrl.toggleView(true);

			_.over(unregister)();
			unregister = null;
		}));

		function prepareInfoHeader(report) {
			var header = '';

			$timeout(validateParametersAndExecute, 2000);

			if (report.errors.length) {
				header += platformTranslateService.instant('basics.reporting.sidebarErrorTitle', null, true);
			}

			if (report.errors.length && report.showDetails) {
				header += ' | ';
			}

			if (report.showDetails) {
				header += platformTranslateService.instant('basics.reporting.sidebarParameterTitle', null, true);
			}

			ctrl.validateAndExecuteTitle = platformTranslateService.instant('basics.reporting.sidebarValidateAndExecuteTitle', null, true);
			ctrl.validateAndExecuteText = platformTranslateService.instant('basics.reporting.sidebarValidateAndExecuteText', null, true);
			ctrl.backListTitle = platformTranslateService.instant('basics.reporting.sidebarBackTitle', null, true);

			ctrl.infoHeader = header;
		}

		function getReportItem(reportId) {
			var report;
			for (var i = 0; i < ctrl.data.groups.length; i++) {
				report = _.find(ctrl.data.groups[i].reports, {id: reportId});
				if (report) {
					break;
				}
			}
			return report;
		}

		function showParametersOrExecute(dispatcherId, reportId) {
			// $log.info('showParametersOrExecute - click triggered');
			ctrl.data.selectedId = reportId;

			// first find group, then find report from this group
			var report = ctrl.report = getReportItem(reportId);

			report.pending = true;

			(!_.isArray(ctrl.report.parameters) ? basicsReportingSidebarService.loadReportParameters(report) : $q.when(report))
				.then((report) => {
					// which button is clicked in dropdown-list
					switch (dispatcherId) {
						case 'pdfPrint':
							// click on PDF Print
							report.exportType = 'pdf';
							showDetailView(report);
							break;

						case 'pfdDirectPrint':
							// click on PDF Direct Print
							// at the moment no function declared
							break;

						case 'preview':
							// click on Preview
							report.exportType = ctrl.data.options.pdfPreview ? 'pdf' : '';
							showDetailView(report);
							break;

						case 'previewViewer':
							// click on Preview Viewer
							report.exportType = '';
							showDetailView(report);
							break;

						case 'previewDirectPrint':
							// click on Preview Direct Print
							showPreviewPrint(report);
							break;
					}
					report.pending = false;
				}, () => {
					report.pending = false;
				});
		}

		function showDetailView(report) {
			if (basicsReportingSidebarService.resolveParameters(report)) {
				if (ctrl.report === report) {
					prepareInfoHeader(report);
					toggleView(); // toggle detail or list view
				}
			} else {
				prepareReport(report);
			}
		}

		function showPreviewPrint(report) {
			prepareReport(report);
		}

		function processDialogSection(value) {
			$rootScope.$emit('reporting:resolveCustomParameter', value);
			// console.log(value);
		}

		function validateParametersAndExecute(uiTriggered) {
			if (!ctrl.showList) {
				basicsReportingSidebarService.resolveParameters(ctrl.report);

				if (uiTriggered) {
					if (!ctrl.report.hasError && !ctrl.report.pending) {
						ctrl.report.pending = true;
						prepareReport(ctrl.report);
					}
					prepareInfoHeader(ctrl.report);
				} else if (!ctrl.report.hasError && !ctrl.report.showDetails && !ctrl.report.pending) {
					ctrl.report.pending = true;
					prepareReport(ctrl.report);
					toggleView(true);
				} else {
					prepareInfoHeader(ctrl.report);
				}
			}
		}

		function prePreparePrint(report) {
			const value = {
				report: report,
				cancel: false,             // cancel generate process
				promise: null              // return promise after processing async operations
			};
			$rootScope.$emit('reporting:prePreparePrint', value);
			if (value.promise === null) {
				value.promise = $q.when(value);
			}
			return value;
		}

		function postPreparePrint(report) {
			const value = {
				report: report,
				processed: false
			};
			$rootScope.$emit('reporting:postPreparePrint', value);
			return value.processed;
		}

		function prepareReport(report) {

			const prePrepareResult = prePreparePrint(report);

			if (prePrepareResult.cancel) {
				return;
			}

			function resetPending() {
				report.pending = false;
			}

			prePrepareResult.promise.then(
				data => {
					var reportData = {
						Name: report.name,
						TemplateName: report.filename,
						Path: report.path,
						Id: report.id
					};

					var parameters = _.concat(_.map(report.parameters, function (item) {
						return {
							Name: item.parameterName,
							ParamValue: _.isNull(item.value) ? null : angular.toJson(item.value),
							ParamValueType: item.dataType
						};
					}), _.map(report.hiddenParameters, function (item) {
						return {
							Name: item.parameterName,
							ParamValue: _.has(item, 'value') ? (_.isNull(item.value) ? null : angular.toJson(item.value)) : item.defaultValue,
							ParamValueType: item.dataType
						};
					})).concat({
						Name: 'PreviewUICulture',
						ParamValue: angular.toJson(cloudCommonInitUiLanguageItems.getCultureViaId($scope.reportingSidebar.reportToolbar)),
						ParamValueType: 'System.String'
					});

					$log.info(reportData);

					return reportingPlatformService.prepare(reportData, parameters, report.exportType)
						.then(data => {
							reportingPlatformService.show(data);
							return {
								result: data,
								report: report,
								reportData: reportData
							};
						}, resetPending)
						.then(data => {
							if (postPreparePrint(data) === false && report.storeInDocsState === true) {
								platformModalService.showMsgBox('basics.reporting.infoStoreInDocsText', 'basics.reporting.infoDialogHeader', 'info');
							}
						}, resetPending)
						.then(resetPending, resetPending);
				}, resetPending);
		}

		function pending(groupId, reportId) {
			var reports = _.result(_.find(ctrl.data.groups, {id: groupId}), 'reports', []);
			var result = _.result(_.find(reports, {id: reportId}), 'pending', false);

			return result;
		}

		function toggleView(forceList) {
			ctrl.showList = forceList || !ctrl.showList;
		}

		$scope.checkStoreInDocs = {
			ctrlId: 'checkStoreInDocs',
			labelText: $translate.instant('basics.reporting.storeInDocs'),
			labelText$tr$: 'basics.reporting.storeInDocs'
		};
	}
})();
