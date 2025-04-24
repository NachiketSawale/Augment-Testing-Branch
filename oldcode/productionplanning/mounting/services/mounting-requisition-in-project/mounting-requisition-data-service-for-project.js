/**
 * Created by anl on 7/20/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.mounting';
	var masterModule = angular.module(moduleName);

	masterModule.factory('productionplanningMountingRequisitionForProjectDataService', RequisitionDataService);

	RequisitionDataService.$inject = ['$injector', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService',
		'basicsCommonMandatoryProcessor', 'projectMainService', 'productionplanningMountingRequisitionProcessor',
		'platformDataServiceProcessDatesBySchemeExtension',
		'basicsLookupdataLookupFilterService',
		'productionpalnningMountingRequisitionValidationFactory'];

	function RequisitionDataService($injector, platformDataServiceFactory, basicsLookupdataLookupDescriptorService,
									basicsCommonMandatoryProcessor, projectMainService, requisitionProcessor,
									platformDataServiceProcessDatesBySchemeExtension,
									basicsLookupdataLookupFilterService,
									mntRequisitionValidationFactory) {

		var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor({
			typeName: 'RequisitionDto',
			moduleSubModule: 'ProductionPlanning.Mounting'
		});
		var serviceOption = {
			flatLeafItem: {
				module: masterModule,
				serviceName: 'productionplanningMountingRequisitionForProjectDataService',
				entityNameTranslationID: 'productionplanning.mounting.entityRequisition',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/mounting/requisition/',
					endRead: 'list'
				},
				entityRole: {
					leaf: {
						itemName: 'MNTReq',
						parentService: projectMainService,
						parentFilter: 'ProjectFk'
					}
				},
				dataProcessor: [requisitionProcessor, dateProcessor],
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {

							basicsLookupdataLookupDescriptorService.attachData(readData);
							var result = {
								FilterResult: readData.FilterResult,
								dtos: readData.Main || []
							};

							return serviceContainer.data.handleReadSucceeded(result, data);
						},
						handleCreateSucceeded: function (item) {
							var selectedProject = projectMainService.getSelected();
							if(selectedProject){
								item.ProjectFk = selectedProject.Id;
							}
						}
					}
				},
				translation: {
					uid: 'productionplanning.mounting.requisition',
					title: 'productionplanning.mounting.requisitionlist',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: {
						typeName: 'RequisitionDto',
						moduleSubModule: 'ProductionPlanning.Mounting',
					},
				}
			}
		};

		/* jshint -W003 */
		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'RequisitionDto',
			moduleSubModule: 'ProductionPlanning.Mounting',
			validationService: mntRequisitionValidationFactory.createValidationService(serviceContainer.service)
		});

		var service = serviceContainer.service;

		var filters = [];

		service.registerFilter = function () {
			basicsLookupdataLookupFilterService.registerFilter(filters);
		};

		service.unregisterFilter = function () {
			basicsLookupdataLookupFilterService.unregisterFilter(filters);
		};

		return service;
	}
})(angular);

