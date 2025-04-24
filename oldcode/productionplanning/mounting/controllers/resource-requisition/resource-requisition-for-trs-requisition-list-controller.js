/**
 * Created by lav on 1/11/2018.
 */

(function (angular) {
	'use strict';

	/**
	 * @name productionplanningMountingResourceRequisitionForTrsRequisitionListController
	 * @function
	 *
	 * */

	var moduleName = 'productionplanning.mounting';

	angular.module(moduleName).controller('productionplanningMountingResourceRequisitionForTrsRequisitionListController', MountingTrsResourceRequisitionListController);
	MountingTrsResourceRequisitionListController.$inject = ['$scope',
		'platformGridControllerService', 'resourceRequisitionUIStandardService',
		'productionplanningResourceRequisitionValidationServiceBase',
		'productionplanningMountingTrsRequisitionResRequisitionDataService',
		'productionplanningMountingResRequisitionClipBoardService',
		'basicsCommonReferenceControllerService',
		'productionplanningMountingTrsRequisitionDataService',
		'productionplanningCommonActivityDateshiftService'];

	function MountingTrsResourceRequisitionListController($scope,
														  platformGridControllerService,
														  uiStandardService,
														  validationService,
														  dataService,
														  clipBoardService,
														  referenceControllerService,
														  parentService,
														  activityDateshiftService) {

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

		platformGridControllerService.initListController($scope, createUiService(), dataService,
			validationService.getRequisitionValidationService(dataService), gridConfig);

		referenceControllerService.extendReferenceButtons($scope, dataService);

		var initDateshiftConfig = { tools : [ { id: 'fullshift', value: true }, { id: 'dateshiftModes', value: 'self', hidden: true} ], configId: dataService.dateshiftId };
		activityDateshiftService.initializeDateShiftController(moduleName, dataService, $scope, initDateshiftConfig);
	}
})(angular);