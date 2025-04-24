/**
 * Created by nitsche on 25.11.2021
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let myModule = angular.module('resource.equipment');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlant2EstimatePriceListDataService
	 * @description provides methods to access, create and update Resource Equipment Plant2EstimatePriceList entities
	 */
	myModule.service('resourceEquipmentPlant2EstimatePriceListDataService', ResourceEquipmentPlant2EstimatePriceListDataService);

	ResourceEquipmentPlant2EstimatePriceListDataService.$inject = [
		'$http', '$injector', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonMandatoryProcessor',
		'resourceEquipmentPlantDataService', 'resourceEquipmentConstantValues'
	];

	function ResourceEquipmentPlant2EstimatePriceListDataService(
		$http, $injector, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor,
		resourceEquipmentPlantDataService, resourceEquipmentConstantValues
	) {
		let self = this;
		let resourceEquipmentServiceOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'resourceEquipmentPlant2EstimatePriceListDataService',
				entityNameTranslationID: 'resource.equipment.resourceEquipmentEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/equipment/plant2estimatepricelist/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = resourceEquipmentPlantDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceEquipmentConstantValues.schemes.plant2EstimatePriceList)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = resourceEquipmentPlantDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					node: {itemName: 'Plant2EstimatePriceList', parentService: resourceEquipmentPlantDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(resourceEquipmentServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceEquipmentPlant2EstimatePriceListValidationService'
		}, resourceEquipmentConstantValues.schemes.plant2EstimatePriceList));

		serviceContainer.service.calculatePricelist = function calculatePricelist() {
			var selectedPriceList = serviceContainer.service.getSelectedEntities();
			$http.post(globals.webApiBaseUrl + 'resource/equipment/plant2estimatepricelist/calculatePricePortions', selectedPriceList
			).then(function (response) {
				serviceContainer.service.updateClientPriceList(response.data);
				serviceContainer.service.setSelectedEntities(response.data);
				let euroListDataService = $injector.get('resourceEquipmentPlantEurolistDataService');
				let selectedEuroListEntities = euroListDataService.getSelectedEntities();
				euroListDataService.loadSubItemList();
				euroListDataService.setSelectedEntities(selectedEuroListEntities);
			});
		};
		serviceContainer.service.updateClientPriceList = function updateClientPriceList(pricelists) {
			// var fireListLoaded = false;
			// _.forEach(pricelists, function(pricelist) {
			// 	var index = _.findIndex(serviceContainer.data.itemList, function (item) {
			// 		return item.Id === pricelist.Id;
			// 	});
			// 	serviceContainer.data.itemList[index] = pricelist;
			// 	if(pricelist.Version === 0) {
			// 		serviceContainer.service.markItemAsModified(pricelist);
			// 	}
			// 	fireListLoaded = true;
			// });
			// if(fireListLoaded) {
			// 	serviceContainer.data.onDataFilterChanged();
			// }
			// platformDataServiceDataProcessorExtension.doProcessData(pricelists, serviceContainer.data);
		};
	}
})(angular);