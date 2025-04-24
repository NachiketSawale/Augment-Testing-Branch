/**
 * Created by shen on 11/22/2021
 */

(function (angular) {
	'use strict';
	let myModule = angular.module('logistic.job');

	/**
	 * @ngdoc service
	 * @name logisticJobPoolJobPlantAllocationValidationService
	 * @description provides validation methods for logistic job pool job plant allocation entities
	 */

	/**
	 * @ngdoc service
	 * @name logisticPoolJobPlantAllocationDataService
	 * @description provides methods to access, create and update logistic pool job plantAllocation entities
	 */
	myModule.service('logisticPoolJobPlantAllocationDataService', LogisticPoolJobPlantAllocationDataService);

	LogisticPoolJobPlantAllocationDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticJobPlantAllocationDataService', 'logisticJobConstantValues', 'logisticJobPlantAllocationProcessor'];

	function LogisticPoolJobPlantAllocationDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, logisticJobPlantAllocationDataService, constValues, logisticJobPlantAllocationProcessor) {
		let self = this;
		let logisticPoolJobPlantAllocationServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticPoolJobPlantAllocationDataService',
				entityNameTranslationID: 'logistic.job.poolJobPlantAllocationEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/job/plantallocation/',
					endRead: 'listbyplantalloc',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = logisticJobPlantAllocationDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: false, create: false},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(constValues.schemes.plantAllocation),
					logisticJobPlantAllocationProcessor],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = logisticJobPlantAllocationDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'PlantAllocations', parentService: logisticJobPlantAllocationDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(logisticPoolJobPlantAllocationServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: ''
		}, constValues.schemes.plantAllocation));
	}
})(angular);
