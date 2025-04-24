/**
 * Created by baf on 31.08.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('logistic.job');

	/**
	 * @ngdoc service
	 * @name logisticJobPlantAllocationDataService
	 * @description pprovides methods to access, create and update logistic job plantAllocation entities
	 */
	myModule.service('logisticJobPlantAllocationDataService', LogisticJobPlantAllocationDataService);

	LogisticJobPlantAllocationDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticJobDataService', 'logisticJobConstantValues', 'logisticJobPlantAllocationProcessor'];

	function LogisticJobPlantAllocationDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, logisticJobDataService, constValues, logisticJobPlantAllocationProcessor) {
		var self = this;
		var logisticJobPlantAllocationServiceOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'logisticJobPlantAllocationDataService',
				entityNameTranslationID: 'logistic.job.plantAllocationEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/job/plantallocation/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticJobDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: { delete: false, create: false },
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(constValues.schemes.plantAllocation),
					logisticJobPlantAllocationProcessor],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticJobDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					node: {itemName: 'PlantAllocations', parentService: logisticJobDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticJobPlantAllocationServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticJobPlantAllocationValidationService'
		}, constValues.schemes.plantAllocation));
	}
})(angular);
