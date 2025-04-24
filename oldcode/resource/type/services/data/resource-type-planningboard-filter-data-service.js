(function (angular) {
	'use strict';
	var myModule = angular.module('resource.type');

	/**
	 * @ngdoc service
	 * @name resourceTypePlanningBoardFilterDataService
	 * @description pprovides methods to access, create and update resource type planning board filter entities
	 */
	myModule.service('resourceTypePlanningBoardFilterDataService', ResourceTypePlanningBoardFilterDataService);

	ResourceTypePlanningBoardFilterDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceTypeConstantValues', 'resourceTypeDataService'];

	function ResourceTypePlanningBoardFilterDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
	                                              basicsCommonMandatoryProcessor, resourceTypeConstantValues, resourceTypeDataService) {

		var self = this;
		var resourceTypePlanningBoardFilterServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceTypePlanningBoardFilterDataService',
				entityNameTranslationID: 'resource.type.planningBoardFilterEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/type/planningboardfilter/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourceTypeDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
						resourceTypeConstantValues.schemes.planningBoardFilter)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = resourceTypeDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'PlanningBoardFilters', parentService: resourceTypeDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceTypePlanningBoardFilterServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceTypePlanningBoardFilterValidationService'
		}, resourceTypeConstantValues.schemes.planningBoardFilter));
	}
})(angular);
