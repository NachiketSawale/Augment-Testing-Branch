/**
 * Created by waz on 9/15/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.mounting';

	angular.module(moduleName).controller('productionplanningMountingTrsRequisitionListController', MNTActTrsRequisitionListController);
	MNTActTrsRequisitionListController.$inject = ['$scope','$injector',
		'platformGridControllerService', 'platformToolbarService', 'transportplanningRequisitionUIStandardService','transportplanningRequisitionUIReadonlyService',
		'productionplanningMountingTrsRequisitionValidationService', 'platformGridAPI',
		'transportplanningRequisitionResourceRequisitionLookupDataService',
		'productionplanningActivityTrsRequisitionClipBoardService',
		'productionplanningMountingContainerInformationService',
		'basicsCommonReferenceControllerService',
		'productionplanningCommonActivityDateshiftService'];

	function MNTActTrsRequisitionListController($scope, $injector,
												gridControllerService, platformToolbarService, uiStandardService,readOnlyUIService,
												validationService, platformGridAPI,
												transportplanningRequisitionResourceRequisitionLookupDataService,
												trsRequisitionClipBoardService,
												mountingContainerInformationService,
												referenceControllerService,
												           activityDateshiftService) {

		// var activityGUID = '3a37c9d82f4e45c28ccd650f1fd2bc1f';
		// var dynamicActivityService = mountingContainerInformationService.getContainerInfoByGuid(activityGUID).dataServiceName;

		var gridConfig = {
			initCalled: false,
			columns: [],
			dragDropService: trsRequisitionClipBoardService,
			type: 'activity-trsRequisition'
		};

		var containerId = $scope.getContentValue('uuid');
		var isReadonly = $scope.getContentValue('isReadonly');

		var config = mountingContainerInformationService.getContainerInfoByGuid(containerId);
		var dataService = $injector.get(config.dataServiceName);

		gridControllerService.initListController($scope,
			isReadonly? readOnlyUIService : uiStandardService,
			dataService,
			validationService,
			gridConfig);

		initToolItems();


		var initDateshiftConfig = { tools : [ { id: 'fullshift', value: true } ], configId: 'transportplanning.requisition' };
		activityDateshiftService.initializeDateShiftController(moduleName, dataService, $scope, initDateshiftConfig, 'transportplanning.requisition');

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

		function initToolItems() {
			if(isReadonly){
				$scope.tools.items = filterToolItems(['create', 'delete']);
			}
			else{
				gridControllerService.addTools(dataService.getCopyButton());
				referenceControllerService.extendReferenceButtons($scope, dataService);
			}
		}

		function filterToolItems(filterItems) {
			var containerUUID = $scope.getContainerUUID();
			return _.filter(platformToolbarService.getTools(containerUUID), function (item) {
				return item && filterItems.indexOf(item.id) === -1;
			});
		}

		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);
		});

	}
})(angular);
