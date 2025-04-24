/**
 * Created by anl on 9/14/2017.
 */

(function (angular) {
	'use strict';

	/**
	 * @name productionplanningActivityResRequisitionListController
	 * @function
	 *
	 * */

	var moduleName = 'productionplanning.activity';

	angular.module(moduleName).controller('productionplanningActivityResRequisitionListController', RequisitionListController);
	RequisitionListController.$inject = ['$scope',
		'platformGridControllerService', 'resourceRequisitionUIStandardService',
		'productionplanningResourceRequisitionValidationServiceBase',
		'productionplanningActivityResRequisitionDataService',
		'productionplanningMountingResRequisitionClipBoardService',
		'productionplanningActivityTrsRequisitionDataService',
		'platformGridAPI',
		'basicsCommonReferenceControllerService',
		'basicsCommonToolbarExtensionService'];

	function RequisitionListController(
		$scope, platformGridControllerService,
		uiStandardService,
		validationService,
		dataService,
		clipBoardService,
		trsRequisitionDataService,
		platformGridAPI,
		referenceControllerService,
		basicsCommonToolbarExtensionService) {

		var gridConfig = {
			initCalled: false,
			columns: [],
			dragDropService: clipBoardService,
			type: 'resRequisition-activity'
		};

		var fields = angular.copy(uiStandardService.getStandardConfigForListView().columns) || [];

		var field = _.find(fields, function (f) {
			return f.field === 'TrsRequisitionFk';
		});
		if (field !== null) {
			field.editorOptions.lookupOptions.filterKey = 'resource-requisition-trsrequisition-filter';
		}

		var uiService = {
			getStandardConfigForListView: () => {
				return {
					columns: fields,
					addValidationAutomatically: true
				};
			},
			getStandardConfigForDetailView: () => {
				return angular.copy(uiStandardService.getStandardConfigForDetailView());
			}
		};

		platformGridControllerService.initListController($scope, uiService, dataService, validationService.getRequisitionValidationService(dataService), gridConfig);

		referenceControllerService.extendReferenceButtons($scope, dataService);

		function onChangeGridContent() {
			var trsRequisitionList = trsRequisitionDataService.getTrsRequisitionList();
			if (!_.isArray(trsRequisitionList) || _.isEmpty(trsRequisitionList)) {
				trsRequisitionDataService.loadTrsRequisition();
			}
		}

		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);
		trsRequisitionDataService.registerFilter();
		// un-register on destroy
		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);
			trsRequisitionDataService.unregisterFilter();
		});
	}
})(angular);