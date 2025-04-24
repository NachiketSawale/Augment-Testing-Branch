/**
 * Created by lid on 7/14/2017.
 */
(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name PpsEventDataServiceFactory
	 * @function
	 *
	 * @description
	 * PpsEventDataServiceFactory create difference data service for difference containner.
	 */
	var moduleName = 'transportplanning.transport';
	var masterModule = angular.module(moduleName);

	masterModule.factory('transportplanningTransportRequiredSkillDataService', TransportPlanningTransportRequiredSkillDataService);

	TransportPlanningTransportRequiredSkillDataService.$inject = [
		'$injector',
		'platformDataServiceFactory',
		'basicsLookupdataLookupDescriptorService',
		'platformDataServiceProcessDatesBySchemeExtension',
		'basicsLookupdataLookupFilterService',
		//'resourceRequisitionDataService',
		'resourceRequisitionConstantValues',
		'basicsCommonMandatoryProcessor'];
	function TransportPlanningTransportRequiredSkillDataService($injector,
																platformDataServiceFactory,
																basicsLookupdataLookupDescriptorService,
																platformDataServiceProcessDatesBySchemeExtension,
																basicsLookupdataLookupFilterService,
	//resourceRequisitionDataService,
																resourceRequisitionConstantValues,
																basicsCommonMandatoryProcessor) {
		var serviceFactroy = {};
		var serviceCache = {};
		//moduleId is used to handle the special service.
		serviceFactroy.createNewComplete = function createNewComplete(mainService) {
			// var servFactory = $injector.get('productionplanningCommonResRequisitionDataServiceFactory');
			// var parentService = servFactory.getServiceByName('transportplanningTransportResRequisitionDataService');

			// var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor({
			// 	typeName: 'EventDto',
			// 	moduleSubModule: 'ProductionPlanning.Common'
			// });
			var serviceOption = {
				flatLeafItem: {
					module: masterModule,
					serviceName: 'transportPlanningTransportRequiredSkillDataService',
					entityNameTranslationID: 'requiredSkillEntity',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'resource/requisition/requiredskill/',
						endRead: 'listByParent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = mainService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(resourceRequisitionConstantValues.schemes.requiredSkill)],
					actions: {delete: true, create: 'flat'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = mainService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					},
					entityRole: {
						leaf: {itemName: 'RequiredSkills', parentService: mainService}
					}
				}
			};

			initialize();
			/* jshint -W003 */
			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

			var service = serviceContainer.service;
			//serviceContainer.data.usesCache = false;
			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
				mustValidateFields: true,
				moduleSubModule: 'Resource.Requisition',
				validationService: 'resourceRequisitionRequiredSkillValidationService'
			}, resourceRequisitionConstantValues.schemes.requiredSkill ));

			return service;
		};

		//get service or create service by module name
		serviceFactroy.getService = function getService(uuid, mainService) {
			if (!serviceCache[uuid]) {
				serviceCache[uuid] = serviceFactroy.createNewComplete(mainService);
			}
			return serviceCache[uuid];
		};
		return serviceFactroy;

		function initialize() {
			var filters = [];
			basicsLookupdataLookupFilterService.registerFilter(filters);
		}
	}
})(angular);

