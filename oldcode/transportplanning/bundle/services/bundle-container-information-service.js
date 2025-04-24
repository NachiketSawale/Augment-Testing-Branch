/**
 * Created by waz on 8/15/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.bundle';
	angular.module(moduleName).factory('transportplanningBundleContainerInformationService', BundleContainerInformationService);

	BundleContainerInformationService.$inject = ['$injector', 'ppsCommonClipboardService'];

	function BundleContainerInformationService($injector, ppsCommonClipboardService) {

		var service = {
			getContainerInfoByGuid: getContainerInfoByGuid
		};

		var containerIdTable = {
			'95a65610f91042a5bb8995be789c2f15': 'transportplanning.bundle.grid',
			'1145ec1dabcd41b79568c44afdb0f3e0': 'transportplanning.bundle.detail',
			'86d10992dc4e43fd8a3ccd1f395743bd': 'transportplanning.requisition.bundle.grid',
			'b41a9a62c6a14d21bd9207a34cba1c29': 'transportplanning.requisition.bundle.detail',
			'b93c7cda7e5a4fb3b10fc25eef9679a2': 'transportplanning.requisition.unassignedBundle.grid',
			'c6b1b36cd9ee4df3b1572b05fff8a5e9': 'productionplanning.activity.bundle.grid',
			'9bde56ae4eb14c75aef90c70da4603a7': 'productionplanning.activity.requisition.bundle.grid',
			'b70cb2a2923f4b34af82fbea35f8725d': 'productionplanning.activity.unassignedBundle.grid',
			'1470fadb6bc7458fba682135912e68fd': 'productionplanning.mounting.activity.bundle.grid',
			'4c1d4fc98d724a2981079ad175b58a10': 'productionplanning.mounting.activity.requisition.bundle.grid',
			'3ec330c208b04dc8818ef25aaf65a915': 'productionplanning.mounting.activity.unassignedBundle.grid',
			'd7a885b2bab4421caeba1e64acd902f4': 'productionplanning.item.bundle.grid',
			'c5026f94a1f548178496704af26a5cb9': 'productionplanning.drawing.stack.bundle.list',
			'd32f5cd5f73248d4af6da11ef94c96d2': 'productionplanning.item.job.bundle.grid',
		};

		var standardUiService = 'transportplanningBundleUIStandardService';
		var readonlyUiService = 'transportplanningBundleUIReadonlyService';

		function getStandardUiService4Trs() {
			return $injector.get('ppsUIUtilService').extendUIService(standardUiService, {
				editableColumns: [],
				combineUIConfigs: [{
					UIService: $injector.get('transportplanningRequisitionTrsGoodsUIStandardServiceFactory').createNewService({}),
					columns: [{
						id: 'ontime', overload: {grid: {editor: null}, detail: {gid: 'transport', readonly: true}}
					}, {
						id: 'planningstate',
						overload: {grid: {editor: null}, detail: {gid: 'transport', readonly: true}}
					}
					],
				}],
				deleteColumns: ['trsrequisitionfk', 'trsRequisitionStatus', 'trsrequisitionDesc'],
				readonlyColumns: ['trsrequisitiondate']
			});
		}

		function getContainerInfoTable(containerId) {
			switch (containerId) {
				case 'transportplanning.bundle.grid':
					return {
						ContainerType: 'Grid',
						standardConfigurationService: standardUiService,
						dataServiceName: 'transportplanningBundleMainService',
						validationServiceName: 'transportplanningBundleValidationService',
						listConfig: {initCalled: false, columns: [], type: 'transportplanning.bundle', dragDropService: ppsCommonClipboardService}
					};
				case 'transportplanning.bundle.detail':
					return {
						ContainerType: 'Detail',
						standardConfigurationService: standardUiService,
						dataServiceName: 'transportplanningBundleMainService',
						validationServiceName: 'transportplanningBundleValidationService',
						listConfig: {}
					};
				case 'transportplanning.requisition.bundle.grid':
					return {
						ContainerType: 'Grid',
						standardConfigurationService: getStandardUiService4Trs(),
						dataServiceName: 'transportplanningRequisitionBundleDataService',
						validationServiceName: 'transportplanningRequisitionBundleValidationService',
						listConfig: {
							initCalled: false,
							columns: [],
							dragDropService: 'transportplanningRequisitionBundleAssignClipboardService',
							type: 'trsRequisitionBundle'
						}
					};
				case 'transportplanning.requisition.bundle.detail':
					return {
						ContainerType: 'Detail',
						standardConfigurationService: getStandardUiService4Trs(),
						dataServiceName: 'transportplanningRequisitionBundleDataService',
						validationServiceName: 'transportplanningRequisitionBundleValidationService',
						listConfig: {}
					};
				case 'transportplanning.requisition.unassignedBundle.grid':
					return {
						ContainerType: 'Grid',
						standardConfigurationService: readonlyUiService,
						dataServiceName: 'transportplanningRequisitionUnassignedBundleDataService',
						validationServiceName: 'transportplanningBundleValidationService',
						listConfig: {
							initCalled: false,
							columns: [],
							dragDropService: 'transportplanningRequisitionBundleAssignClipboardService',
							type: 'trsRequisitionUnassignedBundle'
						}
					};
				case 'productionplanning.activity.bundle.grid':
					return {
						ContainerType: 'Grid',
						standardConfigurationService: readonlyUiService,
						dataServiceName: 'productionplanningActivityActivityBundleDataService',
						validationServiceName: 'transportplanningBundleValidationService',
						listConfig: {}
					};
				case 'productionplanning.activity.requisition.bundle.grid':
					return {
						ContainerType: 'Grid',
						standardConfigurationService: standardUiService,
						dataServiceName: 'productionplanningActivityTrsRequisitionBundleDataService',
						validationServiceName: 'productionplanningActivityTrsRequisitionBundleValidationService',
						listConfig: {
							initCalled: false,
							columns: [],
							dragDropService: 'productionplanningActivityBundleClipBoardService',
							type: 'trsRequisitionBundle'
						}
					};
				case 'productionplanning.activity.unassignedBundle.grid':
					return {
						ContainerType: 'Grid',
						standardConfigurationService: readonlyUiService,
						dataServiceName: 'productionplanningActivityUnassignedBundleDataService',
						validationServiceName: 'transportplanningBundleValidationService',
						listConfig: {
							initCalled: false,
							columns: [],
							dragDropService: 'productionplanningActivityBundleClipBoardService',
							type: 'unassignedBundle'
						}
					};
				case 'productionplanning.mounting.activity.bundle.grid':
					return {
						ContainerType: 'Grid',
						standardConfigurationService: readonlyUiService,
						dataServiceName: 'productionplanningMountingActivityBundleDataService',
						validationServiceName: 'transportplanningBundleValidationService',
						listConfig: {}
					};
				case 'productionplanning.mounting.activity.requisition.bundle.grid':
					return {
						ContainerType: 'Grid',
						standardConfigurationService: standardUiService,
						dataServiceName: 'productionplanningMountingTrsRequisitionBundleDataService',
						validationServiceName: 'productionplanningMountingTrsRequisitionBundleValidationService',
						listConfig: {
							initCalled: false,
							columns: [],
							dragDropService: 'productionplanningMountingBundleClipBoardService',
							type: 'trsRequisitionBundle'
						}
					};
				case 'productionplanning.mounting.activity.unassignedBundle.grid':
					return {
						ContainerType: 'Grid',
						standardConfigurationService: readonlyUiService,
						dataServiceName: 'productionplanningMountingUnassignedBundleDataService',
						validationServiceName: 'transportplanningBundleValidationService',
						listConfig: {
							initCalled: false,
							columns: [],
							dragDropService: 'productionplanningMountingBundleClipBoardService',
							type: 'unassignedBundle'
						}
					};
				case 'productionplanning.item.bundle.grid':
					return {
						ContainerType: 'Grid',
						standardConfigurationService: standardUiService,
						dataServiceName: 'productionplanningItemBundleDataService',
						validationServiceName: 'productionplanningItemBundleValidationService',
						listConfig: {
							dragDropService: 'transportplanningBundleItemClipboardService',
							type: 'ppsItemBundle'
						}
					};
				case 'productionplanning.drawing.stack.bundle.list':
					return {
						ContainerType: 'Grid',
						standardConfigurationService: readonlyUiService,
						dataServiceName: 'productionplanningDrawingStackBundleDataService',
						validationServiceName: 'transportplanningBundleValidationService',
						listConfig: {}
					};
				case 'productionplanning.item.job.bundle.grid':
					return {
						ContainerType: 'Grid',
						standardConfigurationService: standardUiService,
						dataServiceName: 'productionplanningItemJobBundleDataService',
						validationServiceName: 'productionplanningItemJobBundleValidationService',
						listConfig: {}
					};
			}
		}

		function getContainerInfoByGuid(guid) {
			var containerId = containerIdTable[guid];
			var containerInfo = getContainerInfoTable(containerId);
			containerInfo.standardConfigurationService = getService(containerInfo.standardConfigurationService);
			switch (containerInfo.ContainerType) {
				case 'Grid':
					containerInfo.layout = containerInfo.standardConfigurationService.getStandardConfigForListView();
					break;
				case 'Detail':
					containerInfo.layout = containerInfo.standardConfigurationService.getStandardConfigForDetailView();
					break;
			}

			if (containerInfo.listConfig.dragDropService) {
				containerInfo.listConfig.dragDropService = getService(containerInfo.listConfig.dragDropService);
			}
			return containerInfo;
		}

		function getService(service) {
			return _.isString(service) ? $injector.get(service) : service;
		}

		return service;
	}
})(angular);
