/**
 * Created by lav on 1/11/2018.
 */

(function (angular) {
	'use strict';

	/**
	 * @name productionplanningActivityResRequisitionForTrsRequisitionListController
	 * @function
	 *
	 * */

	var moduleName = 'productionplanning.activity';

	angular.module(moduleName).controller('productionplanningActivityResRequisitionForTrsRequisitionListController', ResourceRequisitionForTrsRequisitionListController);
	ResourceRequisitionForTrsRequisitionListController.$inject = ['$scope',
		'platformGridControllerService', 'resourceRequisitionUIStandardService',
		'productionplanningResourceRequisitionValidationServiceBase',
		'productionplanningActivityTrsRequisitionResRequisitionDataService',
		'productionplanningMountingResRequisitionClipBoardService',
		'basicsCommonReferenceControllerService',
		'productionplanningActivityTrsRequisitionDataService'];

	function ResourceRequisitionForTrsRequisitionListController($scope, platformGridControllerService,
																uiStandardService,
																validationService,
																dataService,
																clipBoardService,
																referenceControllerService,
																parentService) {

		var gridConfig = {
			initCalled: false,
			columns: [],
			dragDropService: clipBoardService,
			type: 'resRequisition-trsRequisition'
		};

		function createUiService() {
			var columns = _.cloneDeep(uiStandardService.getStandardConfigForListView().columns);
			if (parentService) {
				_.forEach(columns, function (o) {
					if (o.id === 'resourcefk') {
						o.editorOptions.lookupOptions.additionalFilters = [{
							getAdditionalEntity: parentService.getSelected,
							siteFk: 'SiteFk'
						}];
					}
				});
			}
			return {
				getStandardConfigForListView: function () {
					return {
						addValidationAutomatically: true,
						columns: columns
					};
				},
				getStandardConfigForDetailView: function () {
					return uiStandardService.getStandardConfigForDetailView();
				}
			};
		}

		platformGridControllerService.initListController($scope, createUiService(), dataService, validationService.getRequisitionValidationService(dataService), gridConfig);

		referenceControllerService.extendReferenceButtons($scope, dataService);
	}
})(angular);