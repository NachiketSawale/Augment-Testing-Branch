/**
 * Created by cakiral on 01.08.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('resource.project');

	/**
	 * @ngdoc service
	 * @name resourceProjectRequisitionsDataService
	 * @description pprovides methods to access, create and update resource project requisitions entities
	 */
	myModule.service('resourceProjectPlantCostCodeRequisitionsDataService', ResourceProjectPlantCostCodeRequisitionsDataService);

	ResourceProjectPlantCostCodeRequisitionsDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceProjectConstantValues', 'resourceProjectPlantCostCodeDataService','resourceProjectEstimateHeaderDataService','platformRuntimeDataService'];
	function ResourceProjectPlantCostCodeRequisitionsDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, resourceProjectConstantValues, resourceProjectPlantCostCodeDataService,resourceProjectEstimateHeaderDataService,platformRuntimeDataService) {
		var self = this;
		var resourceProjectPlantCostCodeRequisitionsServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceProjectPlantCostCodeRequisitionsDataService',
				entityNameTranslationID: 'resourceProjectPlantCostCodeRequisitionsEntity',
				httpCreate: {route: globals.webApiBaseUrl + 'resource/requisition/'},
				httpUpdate: {route: globals.webApiBaseUrl + 'resource/requisition/', endUpdate: 'update'},

				httpRead: {
					route: globals.webApiBaseUrl + 'resource/requisition/',
					endRead: 'lookuplistbyfilter',
					initReadData: function initReadData(readData) {
						readData.ResourceTypeFk = resourceProjectPlantCostCodeDataService.getSelected().ResId;
						readData.ProjectFk = resourceProjectEstimateHeaderDataService.getSelectedProjectId();
					},
					usePostForRead: true
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceProjectConstantValues.schemes.requisitions), {processItem:function (item) {
					platformRuntimeDataService.readonly(item, [{field:'ProjectFk', readonly :true}]);
				}}],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = resourceProjectPlantCostCodeDataService.getSelected();

							creationData.PKey2 = resourceProjectEstimateHeaderDataService.getSelectedProjectId();
							creationData.PKey3 = selected.ResId;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Requisitions', parentService: resourceProjectPlantCostCodeDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceProjectPlantCostCodeRequisitionsServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: '',
		}, resourceProjectConstantValues.schemes.requisitions));
	}
})(angular);
