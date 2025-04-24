	/**
 * Created by Shankar on 28.09.2022
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('logistic.plantsupplier');

	/**
	 * @ngdoc service
	 * @name logisticPlantSupplyItemDataService
	 * @description pprovides methods to access, create and update settlement item entities
	 */
	myModule.service('logisticPlantSupplyItemDataService', LogisticPlantSupplyItemDataService);

	LogisticPlantSupplyItemDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticPlantSupplierConstantValues', 'logisticPlantSupplierDataService', 'logisticPlantSupplierItemReadonlyProcessor', 'platformRuntimeDataService'];

	function LogisticPlantSupplyItemDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, logisticPlantSupplierConstantValues, logisticPlantSupplierDataService, logisticPlantSupplierItemReadonlyProcessor, platformRuntimeDataService) {
		let self = this;
		let service;
		let logisticPlantSupplierItemServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticPlantSupplyItemDataService',
				entityNameTranslationID: 'logistic.plantsupplier.plantsupplierItemEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/plantsupplier/item/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = logisticPlantSupplierDataService.getSelected();
						readData.PKey1 = selected.Id;
					},
				},
				actions: {
					delete: true,
					create: 'flat',
					canDeleteCallBackFunc: canDeleteSelectedPlantItem
				},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = logisticPlantSupplierDataService.getSelected();
							creationData.PKey1 = selected.Id;
						},
					},
				},
				entityRole: {
					leaf: {
						itemName: 'PlantSupplierItems',
						parentService: logisticPlantSupplierDataService,
					},
				},
				dataProcessor: [
					platformDataServiceProcessDatesBySchemeExtension.createProcessor(logisticPlantSupplierConstantValues.schemes.plantSupplyItem),
					logisticPlantSupplierItemReadonlyProcessor
				],
			},
		};

		let serviceContainer = platformDataServiceFactory.createService(
			logisticPlantSupplierItemServiceOption,
			self
		);
		serviceContainer.data.Initialised = true;
		service = serviceContainer.service;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticPlantSupplyItemValidationService'
		}, logisticPlantSupplierConstantValues.schemes.plantSupplyItem));



		service.registerSelectionChanged (function (e, item){
			if(item){
				service.setEntityReadOnly(item.IsStatusReadOnly, item);
			}
		});

		service.setEntityReadOnly = function setEntityReadOnly (isreadonly, item) {

			if (isreadonly) {
				platformRuntimeDataService.readonly(item, true);
			}
		};

		function canDeleteSelectedPlantItem(selected) {
			let result = true;
			if(selected && selected.IsStatusReadOnly){
				result = false;
			}
			return result;
		}

	}
})(angular);
