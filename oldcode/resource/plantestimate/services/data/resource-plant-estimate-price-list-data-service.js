/**
 * Created by nitsche on 25.11.2021
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let myModule = angular.module('resource.plantestimate');

	/**
	 * @ngdoc service
	 * @name resourcePlantEstimatePriceListDataService
	 * @description provides methods to access, create and update Resource Equipment Plant2EstimatePriceList entities
	 */
	myModule.service('resourcePlantEstimatePriceListDataService', ResourcePlantEstimatePriceListDataService);

	ResourcePlantEstimatePriceListDataService.$inject = [
		'_', '$http', '$injector', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonMandatoryProcessor',
		'resourcePlantEstimateEquipmentDataService', 'resourcePlantEstimateConstantValues', 'platformGridAPI'
	];

	function ResourcePlantEstimatePriceListDataService(
		_, $http, $injector, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor,
		resourcePlantEstimateEquipmentDataService, resourcePlantEstimateConstantValues, platformGridAPI
	) {
		let self = this;
		let naviOption = {
			isTrigger: false,
			plantEstimatePriceListFk: null
		};
		let resourceEquipmentServiceOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'resourcePlantEstimatePriceListDataService',
				entityNameTranslationID: 'resource.equipment.resourceEquipmentEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/equipment/plant2estimatepricelist/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = resourcePlantEstimateEquipmentDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourcePlantEstimateConstantValues.schemes.plantEstimatePriceList)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = resourcePlantEstimateEquipmentDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					node: {itemName: 'Plant2EstimatePriceList', parentService: resourcePlantEstimateEquipmentDataService}
				}
			}
		};

		const serviceContainer = platformDataServiceFactory.createService(resourceEquipmentServiceOption, self);
		let service = serviceContainer.service;
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourcePlantEstimatePriceListValidationService'
		}, resourcePlantEstimateConstantValues.schemes.plant2EstimatePriceList));

		this.calculatePricelist = function calculatePricelist() {
			var selectedPriceList = self.getSelectedEntities();
			$http.post(globals.webApiBaseUrl + 'resource/equipment/plant2estimatepricelist/calculatepriceportions', selectedPriceList
			).then(function (response) {
				self.updateClientPriceList(response.data);
				self.setSelectedEntities(response.data);
				let euroListDataService = $injector.get('resourcePlantEstimateEquipmentEurolistDataService');
				let selectedEuroListEntities = euroListDataService.getSelectedEntities();
				euroListDataService.loadSubItemList();
				euroListDataService.setSelectedEntities(selectedEuroListEntities);
			});
		};

		this.updateClientPriceList = function updateClientPriceList(pricelists) {
		};

		let onReadSucceeded = serviceContainer.data.onReadSucceeded;
		serviceContainer.data.onReadSucceeded = function incorporateDataRead(readData, data) {
			onReadSucceeded(readData, data);
			if(naviOption.isTrigger && naviOption.plantEstimatePriceListFk){
				const itemList = _.filter(readData, (data) => data.PlantEstimatePriceListFk === naviOption.plantEstimatePriceListFk);
				doMultiSelection(itemList);
				naviOption.isTrigger = false;
			}

			return readData;
		};

		service.navigateTo = function navigateTo(item, triggerfield) {
			if(triggerfield === 'EstAssemblyFk' && item.plantEstimatePriceListFk) {
				naviOption.isTrigger = true;
				naviOption.plantEstimatePriceListFk = item.plantEstimatePriceListFk;
			}
		}

		function doMultiSelection(itemList){

			if(itemList && itemList.length > 0){
				service.setSelectedEntities(itemList);

				// Set selected multiple rows in grid
				let grid = platformGridAPI.grids.element('id', resourcePlantEstimateConstantValues.uuid.container.plantEstimatePriceListList);

				if(grid){
					const rows = grid.dataView.getRows();
					const selectedIds = _.map(itemList, 'Id');
					const rowIndex = _.chain(rows)
						.map((item, index) => (selectedIds.includes(item.Id) ? index : -1)) // Map matching items to their index, others to -1
						.filter(index => index !== -1) // Remove the -1 placeholders
						.value();
					grid.instance.setSelectedRows(rowIndex);
				}
			}
		}

		return service;
	}
})(angular);