/**
 * Created by nitsche on 15.11.2021
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let myModule = angular.module('resource.equipmentgroup');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupPlantGroup2EstimatePriceListDataService
	 * @description provides methods to access, create and update Resource EquipmentGroup PlantGroup2EstimatePriceList entities
	 */
	myModule.service('resourceEquipmentGroupPlantGroup2EstimatePriceListDataService', ResourceEquipmentGroupPlantGroup2EstimatePriceListDataService);

	ResourceEquipmentGroupPlantGroup2EstimatePriceListDataService.$inject = [
		'$http', '$injector', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonMandatoryProcessor',
		'resourceEquipmentGroupDataService', 'resourceEquipmentGroupConstantValues'];

	function ResourceEquipmentGroupPlantGroup2EstimatePriceListDataService(
		$http, $injector, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor,
		resourceEquipmentGroupDataService, resourceEquipmentGroupConstantValues
	) {
		let self = this;
		let resourceEquipmentGroupServiceOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'resourceEquipmentGroupPlantGroup2EstimatePriceListDataService',
				entityNameTranslationID: 'resource.equipmentgroup.resourceEquipmentGroupEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/equipmentgroup/plantgroup2estimatepricelist/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = resourceEquipmentGroupDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceEquipmentGroupConstantValues.schemes.plantGroup2EstimatePriceList)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = resourceEquipmentGroupDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					node: {itemName: 'PlantGroup2EstimatePriceList', parentService: resourceEquipmentGroupDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(resourceEquipmentGroupServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceEquipmentGroupPlantGroup2EstimatePriceListValidationService'
		}, resourceEquipmentGroupConstantValues.schemes.plantGroup2EstimatePriceList));

		serviceContainer.service.calculatePricelist = function calculatePricelist() {
			var selectedPriceList = serviceContainer.service.getSelectedEntities();
			$http.post(globals.webApiBaseUrl + 'resource/equipmentgroup/plantgroup2estimatepricelist/calculatePricePortions', selectedPriceList
			).then(function (response) {
				serviceContainer.service.updateClientPriceList(response.data);
				serviceContainer.service.setSelectedEntities(response.data);
				let resourceEquipmentGroupEuroListDataService = $injector.get('resourceEquipmentGroupEuroListDataService');
				let selectedPlantEuroListEntities = resourceEquipmentGroupEuroListDataService.getSelectedEntities();
				resourceEquipmentGroupEuroListDataService.loadSubItemList();
				resourceEquipmentGroupEuroListDataService.setSelectedEntities(selectedPlantEuroListEntities);
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