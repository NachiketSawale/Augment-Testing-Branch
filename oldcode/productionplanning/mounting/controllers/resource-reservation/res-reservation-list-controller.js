/**
 * Created by anl on 10/17/2017.
 */

(function () {

	'use strict';
	var moduleName = 'productionplanning.mounting';

	/**
	 * @ngdoc controller
	 * @name productionplanningMountingReservedForActivityListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource reservation of Activity
	 **/
	angular.module(moduleName).controller('productionplanningMountingReservedForActivityListController', ReservedForActivityListController);

	ReservedForActivityListController.$inject = ['$scope', 'platformContainerControllerService', 'platformPermissionService',
		'productionplanningMountingContainerInformationService',
		'productionplanningActivityReservedForActivityContainerService',
		'productionplanningMountingResRequisitionDataService',
		'platformRuntimeDataService',
		'productionplanningMountingResReservationClipBoardService',
		'basicsCommonToolbarExtensionService',
		'productionplanningCommonActivityDateshiftService'];

	function ReservedForActivityListController($scope, platformContainerControllerService, platformPermissionService,
											   mountingContainerInformationService,
											   reservedForActivityContainerService,
											   resRequisitionDataService,
											   platformRuntimeDataService,
											   resReservationClipBoardService,
											   basicsCommonToolbarExtensionService,
											             activityDateshiftService) {

		var containerUid = $scope.getContentValue('uuid');
		var activityGUID = '3a37c9d82f4e45c28ccd650f1fd2bc1f';
		var dynamicActivityService = mountingContainerInformationService.getContainerInfoByGuid(activityGUID).dataServiceName;

		if (!mountingContainerInformationService.hasDynamic(containerUid)) {
			reservedForActivityContainerService.prepareGridConfig(containerUid, $scope, mountingContainerInformationService,
				'ProductionPlanning.Mounting', dynamicActivityService);
		}

		var containerInfo = mountingContainerInformationService.getContainerInfoByGuid(containerUid);
		var dataService = platformContainerControllerService.getServiceByToken(containerInfo.dataServiceName);
		var resourceValidationService = platformContainerControllerService.getServiceByToken(containerInfo.validationServiceName);

		containerInfo.listConfig = {
			initCalled: false,
			columns: [],
			dragDropService: resReservationClipBoardService,
			type: 'activity-resReservation'
		};

		platformContainerControllerService.initController($scope, moduleName, containerUid);
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

		var initDateshiftConfig = { tools : [ { id: 'fullshift', value: false }, { id: 'dateshiftModes', value: 'self', hidden: true} ], configId: 'resource.reservation' };
		activityDateshiftService.initializeDateShiftController(moduleName, dataService, $scope, initDateshiftConfig, 'resource.reservation');

		resRequisitionDataService.registerFilter();
		// un-register on destroy
		$scope.$on('$destroy', function () {
			resRequisitionDataService.unregisterFilter();
		});
	}
})();
