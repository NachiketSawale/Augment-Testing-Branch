/**
 * Created by anl on 2/5/2018.
 */

(function () {

	'use strict';
	var moduleName = 'productionplanning.activity';

	angular.module(moduleName).controller('productionplanningActivityReservedForActivityListController', ReservedForActivityListController);

	ReservedForActivityListController.$inject = ['$scope', 'platformContainerControllerService', '$translate',
		'productionplanningActivityContainerInformationService',
		'productionplanningActivityReservedForActivityContainerService',
		'productionplanningActivityResRequisitionDataService',
		'productionplanningActivityActivityDataService',
		'platformRuntimeDataService',
		'productionplanningActivityResReservationClipBoardService',
		'basicsCommonToolbarExtensionService'];

	function ReservedForActivityListController($scope, platformContainerControllerService, $translate,
											   activityContainerInformationService,
											   reservedForActivityContainerService,
											   resRequisitionDataService,
											   activityDataService,
											   platformRuntimeDataService,
											   clipBoardService,
											   basicsCommonToolbarExtensionService) {
		var containerUid = $scope.getContentValue('uuid');

		if (!activityContainerInformationService.hasDynamic(containerUid)) {
			reservedForActivityContainerService.prepareGridConfig(containerUid, $scope, activityContainerInformationService,
				'ProductionPlanning.Activity', activityDataService);
		}
		var dataService = activityContainerInformationService.getContainerInfoByGuid(containerUid).dataServiceName;
		var resourceValidationService = activityContainerInformationService.getContainerInfoByGuid(containerUid).validationServiceName;

		activityContainerInformationService.getContainerInfoByGuid(containerUid).listConfig = {
			initCalled: false,
			columns: [],
			dragDropService: clipBoardService,
			type: 'activity-resReservation'
		};

		platformContainerControllerService.initController($scope, moduleName, containerUid);

		basicsCommonToolbarExtensionService.insertBefore($scope, {
			id: 'createResWithoutReq',
			caption: $translate.instant('productionplanning.common.event.addReservationWithRequisition'),
			type: 'item',
			iconClass: 'tlb-icons ico-add-extend',
			fn: createRequisitionForReservation,
			disabled: function () {
				return !dataService.canCreate();
			}
		});

		function createRequisitionForReservation() {
			if (dataService !== null) {
				dataService.createItem().then(function (newReservation) {
					resourceValidationService.validateRequisitionFk(newReservation, 'Force validation pass', 'RequisitionFk');
					dataService.gridRefresh();
				});

			}
		}
		resRequisitionDataService.registerFilter();
		// un-register on destroy
		$scope.$on('$destroy', function () {
			resRequisitionDataService.unregisterFilter();
		});
	}
})();