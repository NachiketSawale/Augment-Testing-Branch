/**
 * Created by zwz on 6/30/2020.
 */
(function (angular) {

	'use strict';
	let ppsCommonModule = angular.module('productionplanning.common');

	/**
	 * @ngdoc service
	 * @name ppsCommonContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 *
	 */
	ppsCommonModule.service('ppsCommonContainerInformationService', PpsCommonContainerInformationService);

	PpsCommonContainerInformationService.$inject = ['$injector', '_', 'ppsEntityConstant', 'ppsCommonLogFilterRequestConstant'];

	function PpsCommonContainerInformationService($injector, _, ppsEntityConstant, ppsCommonLogFilterRequestConstant) {
		let self = this;

		let containerGuid2PpsEntityTable = {
			'65797b09a24947ffaf7c8b2e5a622994': ppsEntityConstant.PPSItem,
			'5e4945a1e53b4b48847c90634e32320a': ppsEntityConstant.TransportRequisition,
			'4b68c4ca25c348058a3a0682bbc53e0e': ppsEntityConstant.EngineeringTask,
			'3277952fc15d40ad8c46e8880fff4769': ppsEntityConstant.MountingRequisition,
			'1b729de461eb4d2cb806283f7d7c116d': ppsEntityConstant.PPSProductionSet
		};

		// method getPpsEntityByGuid will be referenced by ppsCommonLogSourceFilterService
		this.getPpsEntityByGuid = function getPpsEntityByGuid(guid) {
			return containerGuid2PpsEntityTable[guid];
		};

		let containerInfoTable = {
			'65797b09a24947ffaf7c8b2e5a622994': 'getPpsItemLogSourceWindowConfig',
			'5e4945a1e53b4b48847c90634e32320a': 'getTrsRequisitionLogSourceWindowConfig',
			'4b68c4ca25c348058a3a0682bbc53e0e': 'getEngTaskLogSourceWindowConfig',
			'3277952fc15d40ad8c46e8880fff4769': 'getMntRequisitionLogSourceWindowConfig',
			'1b729de461eb4d2cb806283f7d7c116d': 'getProdSetLogSourceWindowConfig',

		};

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = null;

			let methodName = containerInfoTable[guid];
			if (self[methodName]) {
				config = self[methodName]();
			}
			return config;
		};

		function getLogSourceWindowConfig(option) {
			let parentServ = $injector.get(option.parentServiceName);
			let templateInfo = {
				dto: 'PpsLogReportVDto',
				http: 'productionplanning/common/logreport',
				endRead: 'listbyfilter',
				filterFk: ppsCommonLogFilterRequestConstant.filterFields,
				usePostForRead: true,
				presenter: 'list',
				// sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
				// isInitialSorted: true, // Remark: If we need to set sortOptions in the future, then activate code of sortOptions and isInitialSorted
				parentService: parentServ,
				translationServiceName: option.translationServiceName,
				sourceDataService: 'ppsItemLogReportDataService',
				onHeaderSelectionChanged: function onHeaderSelectionChanged(data, parentItem) {
					// Update filters when selected item of parent container is changed.
					// 1. Update filter 'ParentItemType'. For logs of ProductionUnit, we always set filter ParentItemType with value 'PpsItem'.
					data.selectedObject.ParentItemType = option.parentItemType;

					// 2. Update filter 'RecordId'. Set filter RecordId by changed of selected item of parent container
					if (!_.isNil(parentItem) && parentItem.Version > 0) {
						if (data.selectedObject.RecordId !== parentItem.Id) {
							data.selectedObject.RecordId = parentItem.Id;
						}
					} else {
						data.selectedObject.RecordId = null; // empty filter RecordId if no parentItem selection.
						// Remark: When searching logs in the server side, no log items will be return if filter RecordId is null, according to the requirement.
					}
				},
				initFilters: function (filterObj) {
					if (_.isNil(filterObj)) {
						filterObj = {};
					}
					if (option.isInitializedPpsEntityFkFilter === true) {
						filterObj.PpsEntityFk = option.ppsEntityId;
					}
				}
			};

			return {
				ContainerType: 'Grid',
				standardConfigurationService: $injector.get('ppsCommonLogUIStandardService'),
				dataServiceName: $injector.get('ppsCommonLogSourceDataServiceFactory').createDataService(option.moduleName, templateInfo),
				listConfig: {
					initCalled: false,
					columns: [],
					type: option.listConfigType
				},
				templateInfo: templateInfo
			};

		}

		this.getPpsItemLogSourceWindowConfig = function getPpsItemLogSourceWindowConfig() {
			return getLogSourceWindowConfig({
				ppsEntityId: ppsEntityConstant.PPSItem,
				parentItemType: ppsCommonLogFilterRequestConstant.parentItemTypes.PPSItem,
				parentServiceName: 'productionplanningItemDataService',
				translationServiceName: 'productionplanningItemTranslationService',
				moduleName: 'productionplanning.item',
				listConfigType: 'ppsItemLogs',
			});
		};

		this.getProdSetLogSourceWindowConfig = function () {
			return getLogSourceWindowConfig({
				ppsEntityId: ppsEntityConstant.PPSProductionSet,
				parentItemType: ppsCommonLogFilterRequestConstant.parentItemTypes.PPSProductionSet,
				parentServiceName: 'productionplanningProductionsetMainService',
				translationServiceName: 'productionplanningProductionsetTranslationService',
				moduleName: 'productionplanning.productionset',
				listConfigType: 'ppsProductionSetLogs',
			});
		};

		this.getEngTaskLogSourceWindowConfig = function () {
			return getLogSourceWindowConfig({
				ppsEntityId: ppsEntityConstant.EngineeringTask,
				parentItemType: ppsCommonLogFilterRequestConstant.parentItemTypes.EngineeringTask,
				parentServiceName: 'productionplanningEngineeringMainService',
				translationServiceName: 'productionplanningEngineeringTranslationService',
				moduleName: 'productionplanning.engineering',
				listConfigType: 'engTaskLogs',
			});
		};


		this.getMntRequisitionLogSourceWindowConfig = function () {
			return getLogSourceWindowConfig({
				ppsEntityId: ppsEntityConstant.MountingRequisition,
				parentItemType: ppsCommonLogFilterRequestConstant.parentItemTypes.MountingRequisition,
				parentServiceName: 'productionplanningMountingRequisitionDataService',
				translationServiceName: 'productionplanningMountingTranslationService',
				moduleName: 'productionplanning.mounting',
				listConfigType: 'mntRequisitionLogs',
			});
		};

		this.getTrsRequisitionLogSourceWindowConfig = function () {
			return getLogSourceWindowConfig({
				ppsEntityId: ppsEntityConstant.TransportRequisition,
				parentItemType: ppsCommonLogFilterRequestConstant.parentItemTypes.TransportRequisition,
				parentServiceName: 'transportplanningRequisitionMainService',
				translationServiceName: 'transportplanningRequisitionTranslationService',
				moduleName: 'transportplanning.requisition',
				listConfigType: 'trsRequisitionLogs',
			});
		};

	}
})(angular);
