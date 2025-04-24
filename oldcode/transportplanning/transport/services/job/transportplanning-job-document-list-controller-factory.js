(function (angular) {
	'use strict';
	var module = 'transportplanning.transport';

	angular.module(module).factory('transportPlanningJobDocumentListControllerFactory', TransportPlanningJobDocumentListControllerFactory);
	TransportPlanningJobDocumentListControllerFactory.$inject = ['$translate', 'platformGridControllerService',
		'documentProjectHeaderUIStandardService',
		'transportplanningTransportValidationService',
		'documentProjectCommonConfigControllerService',
		'basicsLookupdataLookupDefinitionService'];

	function TransportPlanningJobDocumentListControllerFactory($translate, platformGridControllerService,
	                                                           documentUIStandardService,
	                                                           validationService,
	                                                           documentProjectConfigControllerService,
	                                                           lookupdataLookupDefinitionService) {
		var service = {};

		service.initController = function ($scope, dataService) {
			lookupdataLookupDefinitionService.load(['documentsProjectHasDocumentRevisionCombobox']);

			var gridConfig = {
				initCalled: false,
				columns: []
			};

			var columns = _.cloneDeep(documentUIStandardService.getStandardConfigForListView().columns);
			_.forEach(columns, function (col) {
				col.editor = null;
			});

			var uiService = {
				getStandardConfigForListView: function () {
					return {
						columns: columns
					};
				}
			};

			$scope.containerHeaderInfo = {
				checkBoxChecked: false,
				extractZipFileTip: $translate.instant('documents.project.FileUpload.extractZipFileTip'),
				prefix: $translate.instant('cloud.common.Container'),
				currentModuleName: ' '
			};

			platformGridControllerService.initListController($scope, uiService, dataService, validationService, gridConfig);
			$scope.addTools(documentProjectConfigControllerService.initialUploadController($scope, dataService));

			var showToolItems = ['t12', 't108', 'gridSearchAll', 'gridSearchColumn', 't199', 'download', 'preview', 'previewprogram', 't200'];
			_.remove($scope.tools.items, function (item) {
				return _.indexOf(showToolItems, item.id) < 0 && item.type !== 'overflow-btn';
			});

			$scope.setTools = function () {};
		};

		return service;
	}
})(angular);