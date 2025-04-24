/**
 * Created by waz on 9/15/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.activity';

	angular.module(moduleName).controller('productionplanningActivityTrsRequisitionListController', RequisitionListController);
	RequisitionListController.$inject = ['$scope', 'platformGridControllerService',
		'transportplanningRequisitionUIStandardService',
		'productionplanningActivityTrsRequisitionValidationService',
		'productionplanningActivityTrsRequisitionDataService',
		'transportplanningRequisitionResourceRequisitionLookupDataService',
		'platformGridAPI',
		'productionplanningActivityTrsRequisitionClipBoardService',
		'basicsCommonReferenceControllerService'];

	function RequisitionListController($scope, gridControllerService,
									   uiStandardService,
									   validationService,
									   dataService,
									   transportplanningRequisitionResourceRequisitionLookupDataService,
									   platformGridAPI,
									   clipBoardService,
									   referenceControllerService) {

		var gridConfig = {
			initCalled: false,
			columns: [],
			dragDropService: clipBoardService,
			type: 'activity-trsRequisition'
		};

		gridControllerService.initListController($scope,
			uiStandardService,
			dataService,
			validationService,
			gridConfig);

		gridControllerService.addTools(dataService.getCopyButton());

		referenceControllerService.extendReferenceButtons($scope, dataService);

		function onChangeGridContent() {
			var selected = platformGridAPI.rows.selection({
				gridId: $scope.gridId
			});
			selected = _.isArray(selected) ? selected[0] : selected;
			if (_.isNil(selected)) {
				//transportplanningRequisitionResourceRequisitionLookupDataService.clearFilter();
				transportplanningRequisitionResourceRequisitionLookupDataService.setFilter(0);
			} else {
				transportplanningRequisitionResourceRequisitionLookupDataService.setFilter(selected.Id);
			}
		}

		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);

		});
	}
})(angular);