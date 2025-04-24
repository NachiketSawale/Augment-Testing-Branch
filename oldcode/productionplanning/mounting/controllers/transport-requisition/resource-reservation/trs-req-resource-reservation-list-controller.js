/**
 * Created by zweig on 02/06/2018.
 */

(function (angular) {
	'use strict';

	var module = 'productionplanning.mounting';

	angular.module(module)
		.controller('productionplanningMountingTrsReqResourceReservationListController', MNTTrsReqResourceReservationListController);

	MNTTrsReqResourceReservationListController.$inject = ['$scope',
		'platformPermissionService',
		'productionplanningMountingContainerInformationService',
		'transportPlanningResourceReservationContainerService',
		'platformContainerControllerService',
		'productionplanningMountingTrsRequisitionDataService',
		'platformRuntimeDataService',
		'productionplanningMountingResReservationClipBoardService',
		'basicsCommonToolbarExtensionService',
		'productionplanningCommonActivityDateshiftService'];

	function MNTTrsReqResourceReservationListController($scope,
														platformPermissionService,
														productionplanningMountingContainerInformationService,
														transportPlanningResourceReservationContainerService,
														platformContainerControllerService,
														productionplanningMountingTrsRequisitionDataService,
														platformRuntimeDataService,
														resReservationClipBoardService,
														basicsCommonToolbarExtensionService,
														activityDateshiftService) {

		// UUID is defined at server-side
		var containerUid = $scope.getContentValue('uuid');

		if (!productionplanningMountingContainerInformationService.hasDynamic(containerUid)) {
			transportPlanningResourceReservationContainerService.prepareGridConfig(containerUid, $scope,
				productionplanningMountingContainerInformationService, 'ProductionPlanning.Mounting', productionplanningMountingTrsRequisitionDataService);
		}
		var containerInfo = productionplanningMountingContainerInformationService.getContainerInfoByGuid(containerUid);

		containerInfo.listConfig = {
			initCalled: false,
			columns: [],
			dragDropService: resReservationClipBoardService,
			type: 'trsRequisition-resReservation'
		};
		var dataService = platformContainerControllerService.getServiceByToken(containerInfo.dataServiceName);
		var resourceValidationService = platformContainerControllerService.getServiceByToken(containerInfo.validationServiceName);

		platformContainerControllerService.initController($scope, module, containerUid);
		//set custom tools(with permission)
		function setPermission(tool,permission) {
			if (_.isString(tool.permission)) {
				var split = tool.permission.split('#');
				tool.permission = {};
				tool.permission[permission] = platformPermissionService.permissionsFromString(split[1]);
			}
		}
		var tool = {
			id: 'createResWithoutReq',
			caption: 'productionplanning.common.event.addReservationWithRequisition',
			type: 'item',
			iconClass: 'tlb-icons ico-add-extend',
			permission: '#c',
			fn: createRequisitionForReservation,
			disabled: function () {
				return !dataService.canCreate();
			}
		};
		var permission = $scope.getContentValue('permission');
		setPermission(tool,permission);
		basicsCommonToolbarExtensionService.insertBefore($scope, tool);

		function createRequisitionForReservation() {
			if (dataService !== null) {
				dataService.createItem().then(function (newReservation) {
					resourceValidationService.validateRequisitionFk(newReservation, 'Force validation pass', 'RequisitionFk');
					dataService.gridRefresh();
				});

			}
		}

		var initDateshiftConfig = { tools : [ { id: 'fullshift', value: true }, { id: 'dateshiftModes', value: 'self', hidden: true} ], configId: dataService.dateshiftId };
		activityDateshiftService.initializeDateShiftController(module, dataService, $scope, initDateshiftConfig);
	}
})(angular);