/**
 * Created by anl on 03/07/2018.
 */

(function (angular) {
	'use strict';

	var module = 'productionplanning.activity';

	angular
		.module(module)
		.controller('productionplanningActivityTrsReqResourceReservationListController', ResReservationListController);
	ResReservationListController.$inject = ['$scope', '$translate',
		'productionplanningActivityContainerInformationService',
		'transportPlanningResourceReservationContainerService',
		'platformContainerControllerService',
		'productionplanningActivityTrsRequisitionDataService',
		'platformRuntimeDataService',
		'productionplanningActivityResReservationClipBoardService'];

	function ResReservationListController($scope, $translate,
										  ppsActivityContainerInformationService,
										  transportPlanningResourceReservationContainerService,
										  platformContainerControllerService,
										  trsRequisitionDataService,
										  platformRuntimeDataService,
										  clipBoardService) {

		// get environment variable from the module-container.json file
		var containerUid = $scope.getContentValue('uuid');

		if (!ppsActivityContainerInformationService.hasDynamic(containerUid)) {
			transportPlanningResourceReservationContainerService.prepareGridConfig(containerUid, $scope,
				ppsActivityContainerInformationService, 'ProductionPlanning.Activity', trsRequisitionDataService);
		}
		var containerInfo = ppsActivityContainerInformationService.getContainerInfoByGuid(containerUid);
		var dataService = platformContainerControllerService.getServiceByToken(containerInfo.dataServiceName);
		var resourceValidationService = platformContainerControllerService.getServiceByToken(containerInfo.validationServiceName);

		containerInfo.listConfig = {
			initCalled: false,
			columns: [],
			dragDropService: clipBoardService,
			type: 'trsRequisition-resReservation'
		};
		platformContainerControllerService.initController($scope, module, containerUid);

		$scope.tools.items.unshift({
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

	}
})(angular);