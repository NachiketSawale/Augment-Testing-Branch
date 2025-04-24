/*
 * $Id: timekeeping-recording-controller.js 558194 2019-09-10 09:19:36Z postic $
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	const moduleName = 'timekeeping.recording';

	angular.module(moduleName).controller('timekeepingRecordingController',
		['_', '$scope', 'platformMainControllerService', 'timekeepingRecordingDataService',
			'timekeepingRecordingTranslationService', 'basicsWorkflowSidebarRegisterService', '$injector',
			/* jshint -W072 */ // many parameters because of dependency injection
			function (_, $scope, platformMainControllerService, timekeepingRecordingDataService, timekeepingRecordingTranslationService,basicsWorkflowSidebarRegisterService,$injector) {
				$scope.path = globals.appBaseUrl;
				let opt = { search: true, reports: false };
				let mc = {};
				let sidebarReports = platformMainControllerService.registerCompletely($scope, timekeepingRecordingDataService, mc, timekeepingRecordingTranslationService, moduleName, opt);

				basicsWorkflowSidebarRegisterService.registerEntityForModule('C34BB070A83E4D47B0B6256087E41FEA', 'timekeeping.recording', false,
					function getSelectedModelId() {
						let timekeepingReportDataService = $injector.get('timekeepingRecordingReportDataService');
						let selModel = timekeepingReportDataService.getSelected();
						if (selModel) {
							return selModel.Id;
						}
						return undefined;
					}, function getModelIdList() {
						let timekeepingReportDataService = $injector.get('timekeepingRecordingReportDataService');
						let items = timekeepingReportDataService.getList();
						return _.map(_.isArray(items) ? items : [], function (modelEntity) {
							return modelEntity.Id;
						});
					}, angular.noop, angular.noop, angular.noop, true);

				basicsWorkflowSidebarRegisterService.registerEntityForModule('6bb03abdfe7c45d6915f132a7ead066c', 'timekeeping.recording', false,
					function getSelectedModelId() {
						let timekeepingRecordingDataService = $injector.get('timekeepingRecordingDataService');
						let selModel = timekeepingRecordingDataService.getSelected();
						if (selModel) {
							return selModel.Id;
						}
						return undefined;
					}, function getModelIdList() {
						let timekeepingRecordingDataService = $injector.get('timekeepingRecordingDataService');
						let items = timekeepingRecordingDataService.getList();
						return _.map(_.isArray(items) ? items : [], function (modelEntity) {
							return modelEntity.Id;
						});
					}, angular.noop, angular.noop, angular.noop, true);

				basicsWorkflowSidebarRegisterService.registerEntityForModule('e8650d4b1ea74a51b65192d9c735c271', 'timekeeping.recording', false,
					function getSelectedModelId() {
						let timekeepingRecordingSheetDataService = $injector.get('timekeepingRecordingSheetDataService');
						let selModel = timekeepingRecordingSheetDataService.getSelected();
						if (selModel) {
							return selModel.Id;
						}
						return undefined;
					}, function getModelIdList() {
						let timekeepingRecordingSheetDataService = $injector.get('timekeepingRecordingSheetDataService');
						let items = timekeepingRecordingSheetDataService.getList();
						return _.map(_.isArray(items) ? items : [], function (modelEntity) {
							return modelEntity.Id;
						});
					}, angular.noop, angular.noop, angular.noop, true);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(timekeepingRecordingDataService, sidebarReports, timekeepingRecordingTranslationService, opt);
				});
			}]);
})();
