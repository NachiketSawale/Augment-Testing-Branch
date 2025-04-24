/**
 * Created by cakiral on 31.07.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('resource.project');

	/**
	 * @ngdoc service
	 * @name resourceProjectPlantCostCodeDataService
	 * @description pprovides methods to access, create and update resource project plantCostCode entities
	 */
	myModule.service('resourceProjectPlantCostCodeDataService', ResourceProjectPlantCostCodeDataService);

	ResourceProjectPlantCostCodeDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'platformDataServiceEntityReadonlyProcessor', 'basicsCommonMandatoryProcessor', 'resourceProjectConstantValues', 'resourceProjectEstimateHeaderDataService'];

	function ResourceProjectPlantCostCodeDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		platformDataServiceEntityReadonlyProcessor, basicsCommonMandatoryProcessor, resourceProjectConstantValues, resourceProjectEstimateHeaderDataService) {
		var self = this;
		var resourceProjectPlantCostCodeServiceOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'resourceProjectPlantCostCodeDataService',
				entityNameTranslationID: 'resource.project.plantCostCodeEntity',
				// httpCreate: {route: globals.webApiBaseUrl + 'resource/project/plantCostCode/'},
				httpRead: {
					route: globals.webApiBaseUrl + 'resource/project/plantcostcode/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourceProjectEstimateHeaderDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: false, create: false},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceProjectConstantValues.schemes.plantCostCode),
				platformDataServiceEntityReadonlyProcessor],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = resourceProjectEstimateHeaderDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					node: {itemName: 'PlantCostCodes', parentService: resourceProjectEstimateHeaderDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceProjectPlantCostCodeServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceProjectPlantCostCodeValidationService'
		}, resourceProjectConstantValues.schemes.plantCostCode));
	}
})(angular);
