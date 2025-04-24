/**
 * Created by anl on 9/14/2017.
 */

(function (angular) {
	'use strict';

	/**
	 * @name resourceRequisitionForActivityListController
	 * @function
	 *
	 * */

	var moduleName = 'productionplanning.mounting';

	angular.module(moduleName).controller('resourceRequisitionForActivityListController', ResourceRequisitionForActivityListController);
	ResourceRequisitionForActivityListController.$inject = ['$scope',
		'platformGridControllerService',
		'resourceRequisitionUIStandardService',
		'productionplanningResourceRequisitionValidationServiceBase',
		'productionplanningMountingResRequisitionDataService',
		'productionplanningMountingResRequisitionClipBoardService',
		'productionplanningMountingTrsRequisitionDataService',
		'platformGridAPI',
		'basicsCommonReferenceControllerService',
		'productionplanningCommonActivityDateshiftService'];

	function ResourceRequisitionForActivityListController($scope,
														  platformGridControllerService,
														  uiStandardService,
														  resRequisitionValidationService,
														  dataService,
														  clipBoardService,
														  trsRequisitionDataService,
														  platformGridAPI,
														  referenceControllerService,
														               activityDateshiftService) {

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
					addValidationAutomatically: true,
					columns: fields
				};
			},
			getStandardConfigForDetailView: function () {
				return angular.copy(uiStandardService.getStandardConfigForDetailView());
			}
		};

		platformGridControllerService.initListController($scope, uiService, dataService,
			resRequisitionValidationService.getRequisitionValidationService(dataService), gridConfig);

		referenceControllerService.extendReferenceButtons($scope, dataService);

		function onChangeGridContent() {
			var trsRequisitionList = trsRequisitionDataService.getTrsRequisitionList();
			if (!_.isArray(trsRequisitionList) || _.isEmpty(trsRequisitionList)) {
				trsRequisitionDataService.loadTrsRequisition();
			}
		}

		var initDateshiftConfig = { tools : [ { id: 'fullshift', value: true }, { id: 'dateshiftModes', value: 'self', hidden: true} ], configId: 'resource.requisition' };
		activityDateshiftService.initializeDateShiftController(moduleName, dataService, $scope, initDateshiftConfig, 'resource.requisition');

		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);
		trsRequisitionDataService.registerFilter();
		// un-register on destroy
		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);
			trsRequisitionDataService.unregisterFilter();
		});
	}
})(angular);
