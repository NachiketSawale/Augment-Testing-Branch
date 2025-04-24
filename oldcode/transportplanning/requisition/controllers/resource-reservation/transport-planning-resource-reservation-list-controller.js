/**
 * Created by zweig on 02/06/2018.
 */

(function (angular) {
    'use strict';

    var module = 'transportplanning.requisition';

    angular
        .module(module)
        .controller('transportplanningRequisitionResReservationListController', ListController);
    ListController.$inject = ['$scope', '$injector',
        'platformGridAPI', 'platformPermissionService','platformContainerControllerService',
        'platformRuntimeDataService',
        'transportplanningRequisitionContainerInformationService',
		'transportPlanningResourceReservationContainerService',
		'transportplanningRequisitionMainService',
		'basicsCommonToolbarExtensionService',
	    'productionplanningCommonActivityDateshiftService'];

    function ListController($scope, $injector,
                            platformGridAPI, platformPermissionService,platformContainerControllerService,
                            platformRuntimeDataService,
							transportplanningRequisitionContainerInformationService,
							transportPlanningResourceReservationContainerService,
							transportplanningRequisitionMainService,
							basicsCommonToolbarExtensionService,
							       activityDateshiftService) {

        // get environment variable from the module-container.json file
		var containerUid = $scope.getContentValue('uuid');

		if (!transportplanningRequisitionContainerInformationService.hasDynamic(containerUid)) {
			transportPlanningResourceReservationContainerService.prepareGridConfig(containerUid, $scope,
				transportplanningRequisitionContainerInformationService,'Transportplanning.Requisition', transportplanningRequisitionMainService);
		}
		var containerInfo = transportplanningRequisitionContainerInformationService.getContainerInfoByGuid(containerUid);
		var dataService = platformContainerControllerService.getServiceByToken(containerInfo.dataServiceName);
		var resourceValidationService = platformContainerControllerService.getServiceByToken(containerInfo.validationServiceName);

		platformContainerControllerService.initController($scope, module, containerUid);

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

		function createRequisitionForReservation(){
			if (dataService !== null) {
				dataService.createItem().then(function (newReservation) {
					// The requisition of newReservation will create at server side, so we just let the validation of RequisitionFk pass here.
					// The RequisitionFk of newReservation is remain 0, so we can skip the validation of Requested and Valid(From/To) of reservation too. See ALM #121505.
					resourceValidationService.validateRequisitionFk(newReservation, 'Force validation pass', 'RequisitionFk');
					dataService.gridRefresh();
				});

			}
		}

	    var initDateshiftConfig = { tools : [ { id: 'fullshift', value: true }, { id: 'dateshiftModes', value: 'self', hidden: true} ], configId: 'resource.reservation' };
	    activityDateshiftService.initializeDateShiftController(module, dataService, $scope, initDateshiftConfig, dataService.dateshiftId);
    }
})(angular);
