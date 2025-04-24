/**
 * Created by baf on 04.07.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('project.main');

	/**
	 * @ngdoc service
	 * @name projectMainCostGroupCatalogDataService
	 * @description pprovides methods to access, create and update project main costGroupCatalog entities
	 */
	myModule.service('projectMainCostGroupCatalogDataService', ProjectMainCostGroupCatalogDataService);

	ProjectMainCostGroupCatalogDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'projectMainConstantValues', 'projectMainService'];

	function ProjectMainCostGroupCatalogDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, projectMainConstantValues, projectMainService) {
		var self = this;
		var projectMainCostGroupCatalogServiceOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'projectMainCostGroupCatalogDataService',
				entityNameTranslationID: 'project.main.costGroupCatalogEntity',
				httpCreate: {route: globals.webApiBaseUrl + 'project/main/costGroupCatalog/'},
				httpRead: {
					route: globals.webApiBaseUrl + 'project/main/costGroupCatalog/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = projectMainService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					projectMainConstantValues.schemes.costGroupCatalog)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = projectMainService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					node: {itemName: 'CostGroupCatalogs', parentService: projectMainService}
				},
				translation: {
					uid: 'projectMainCostGroupCatalogDataService',
					title: 'project.main.costGroupCatalogEntity',
					columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
					dtoScheme: projectMainConstantValues.schemes.costGroupCatalog
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(projectMainCostGroupCatalogServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'projectMainCostGroupCatalogValidationService'
		}, projectMainConstantValues.schemes.costGroupCatalog));
	}
})(angular);
