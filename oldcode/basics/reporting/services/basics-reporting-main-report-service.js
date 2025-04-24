/**
 * Created by sandu on 09.06.2015.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.reporting';
	var configModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name basicsReportingMainReportService
	 * @function
	 *
	 * @description
	 * main data service for all reporting related functionality.
	 */

	angular.module(moduleName).factory('basicsReportingMainReportService', basicsReportingMainReportService);

	basicsReportingMainReportService.$inject = ['platformDataServiceFactory', '$http', '$q', '$injector', 'ServiceDataProcessArraysExtension', 'basicsReportingReportReadonlyProcessor'];

	function basicsReportingMainReportService(platformDataServiceFactory, $http, $q, $injector, ServiceDataProcessArraysExtension, basicsReportingReportReadonlyProcessor) {

		var sidebarSearchOptions = {
			moduleName: moduleName,
			pattern: '',
			pageSize: 100,
			useCurrentClient: false,
			includeNonActiveItems: false,
			showOptions: false,
			showProjectContext: false, // TODO: rei remove it
			withExecutionHints: true
		};

		var serviceFactoryOptions = {
			flatRootItem: {
				module: configModule,
				serviceName: 'basicsReportingMainReportService',
				entityNameTranslationID: 'basics.reporting.reportListTitle',
				httpCRUD: {route: globals.webApiBaseUrl + 'basics/reporting/report/', usePostForRead: true},
				entityRole: {
					root: {
						codeField: 'FileName',
						descField: 'FilePath',
						itemName: 'Report',
						moduleName: 'basics.reporting.moduleInfoNameBasicsReporting'
					}
				},
				modification: {multi: true},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [new ServiceDataProcessArraysExtension(['Report']), basicsReportingReportReadonlyProcessor],
				translation: {
					uid: 'basicsReportingMainReportService',
					title: 'basics.reporting.reportListTitle',
					columns: [{
						header: 'basics.reporting.name',
						field: 'Name'
					}, {header: 'basics.reporting.description', field: 'Description'}],
					dtoScheme: { typeName: 'ReportDto', moduleSubModule: 'Basics.Reporting' }
				},
				sidebarSearch: {options: sidebarSearchOptions}
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);
		serviceContainer.service.getSelectedReportId = function () {

			var selectedReport = serviceContainer.service.getSelected();
			if (selectedReport && selectedReport.Id) {
				return selectedReport.Id;
			}
		};

		serviceContainer.service.getSelectedReportReportName = function () {

			var selectedReport = serviceContainer.service.getSelected();

			if (selectedReport && selectedReport.Name.Description) {
				return selectedReport.Name.Description;
			}
		};

		serviceContainer.service.getSelectedReportFileName = function () {

			var selectedReport = serviceContainer.service.getSelected();

			if (selectedReport && selectedReport.FileName) {
				return selectedReport.FileName;
			}
		};

		serviceContainer.service.getSelectedReportFilePath = function () {

			var selectedReport = serviceContainer.service.getSelected();

			if (selectedReport && selectedReport.FilePath) {
				return selectedReport.FilePath;
			}
		};

		serviceContainer.service.getPathStructure = function () {
			var deferred = $q.defer();

			$http.post(globals.webApiBaseUrl + 'basics/reporting/report/getPathStructure').then(function (response) {
				deferred.resolve(response.data);
			}, function () {
				deferred.reject();
			});

			return deferred.promise;
		};

		serviceContainer.service.uploadReport = function (report, selectedFolderPath) {
			const deferred = $q.defer();
			const data = {
				model: {
					selectedReportPath: selectedFolderPath,
					fileName: report.name
				},
				file: report
			};
			const fd = new FormData();

			fd.append('model', angular.toJson(data.model));

			if (data.file) {
				fd.append('file', data.file);
			}
			const config = {
				method: 'POST',
				url: globals.webApiBaseUrl + 'basics/reporting/report/upload',
				headers: {
					'Content-Type': undefined,
					errorDialog: false
				},
				transformRequest: angular.identity,
				data: fd
			};

			$http(config)
				.then((reportData) => {
					serviceContainer.service.getSelected().FilePath = reportData.data.filePath;
					serviceContainer.service.getSelected().FileName = reportData.data.fileName;
					serviceContainer.service.markCurrentItemAsModified();
					$injector.invoke(['basicsReportingReportParameterService', function (basicsReportingReportParameterService) {
						basicsReportingReportParameterService.callParameter();
						deferred.resolve();
					}]);
				})
				.catch(() => {
					deferred.reject();
				});

			return deferred.promise;
		};

		var reportFile;

		serviceContainer.service.getSelectedReport = function () {
			return reportFile;
		};

		serviceContainer.service.setSelectedReport = function (repFile) {
			reportFile = repFile;
		};

		return serviceContainer.service;
	}
})(angular);
