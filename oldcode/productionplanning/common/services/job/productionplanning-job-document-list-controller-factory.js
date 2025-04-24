(function (angular) {
	'use strict';
	var module = 'productionplanning.common';

	angular.module(module).factory('productionPlanningJobDocumentListControllerFactory', ProductionPlanningJobDocumentListControllerFactory);
	ProductionPlanningJobDocumentListControllerFactory.$inject = ['$translate', 'platformGridControllerService',
		'documentProjectHeaderUIStandardService',
		'documentProjectCommonConfigControllerService',
		'basicsLookupdataLookupDefinitionService'];

	function ProductionPlanningJobDocumentListControllerFactory($translate, platformGridControllerService,
	                                                           documentUIStandardService,
	                                                           documentProjectConfigControllerService,
	                                                           lookupdataLookupDefinitionService) {
		var service = {};

		service.initController = function ($scope, dataService, validationService) {
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