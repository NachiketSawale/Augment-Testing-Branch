/**
 * Created by baf on 04.07.2019
 */

(function (angular) {
	/* global globals, Platform */
	'use strict';
	var myModule = angular.module('project.main');

	/**
	 * @ngdoc service
	 * @name projectMainCostGroupDataService
	 * @description pprovides methods to access, create and update project main costGroup entities
	 */
	myModule.service('projectMainCostGroupDataService', ProjectMainCostGroupDataService);

	ProjectMainCostGroupDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'projectMainConstantValues', 'projectMainCostGroupCatalogDataService', 'cloudCommonGridService', 'boqMainCrbService'];

	function ProjectMainCostGroupDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, projectMainConstantValues, projectMainCostGroupCatalogDataService, cloudCommonGridService, boqMainCrbService) {
		var self = this;
		var projectMainCostGroupServiceOption = {
			hierarchicalLeafItem: {
				module: myModule,
				serviceName: 'projectMainCostGroupDataService',
				entityNameTranslationID: 'project.main.costGroupEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'project/main/costGroup/',
					endRead: 'tree',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = projectMainCostGroupCatalogDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {
					delete: true, create: 'hierarchical',
					canCreateChildCallBackFunc: function() {
						return boqMainCrbService.canCreateCostgroup ? boqMainCrbService.canCreateCostgroup(self) : true;
					}
				},
				dataProcessor: [{
					processItem: function(costGroup) {
						serviceContainer.service.processItem.fire(costGroup);
					}},
				platformDataServiceProcessDatesBySchemeExtension.createProcessor(projectMainConstantValues.schemes.costGroup)],
				presenter: {
					tree: {
						parentProp: 'CostGroupFk', childProp: 'CostGroupChildren',
						initCreationData: function initCreationData(creationData) {
							creationData.PKey1 = projectMainCostGroupCatalogDataService.getSelected().Id;
							var parentId = creationData.parentId;
							delete creationData.MainItemId;
							delete creationData.parentId;
							if(!_.isNull(parentId) && !_.isUndefined(parentId) && parentId > 0) {
								creationData.PKey2 = parentId;
							}
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'CostGroups', parentService: projectMainCostGroupCatalogDataService}
				},
				translation: {
					uid: 'projectMainCostGroupDataService',
					title: 'project.main.listCostGroupTitle',
					columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
					dtoScheme: projectMainConstantValues.schemes.costGroup
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(projectMainCostGroupServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.usesCache = false;
		serviceContainer.data.sendOnlyRootEntities = false;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'projectMainCostGroupValidationService'
		}, projectMainConstantValues.schemes.costGroup));

		serviceContainer.service.deleteEntities = function deleteEntities(entities) {
			var output =[];
			cloudCommonGridService.flatten(entities, output, 'CostGroupChildren');
			_.forEach(output,function(item){
				item.CostGroupChildren = null;
				item.CostGroupLevel1Fk = item.CostGroupLevel2Fk = item.CostGroupLevel3Fk = item.CostGroupLevel4Fk = item.CostGroupLevel5Fk = null;
			});
			return serviceContainer.data.deleteEntities(output, serviceContainer.data);
		};

		serviceContainer.service.processItem = new Platform.Messenger();
		serviceContainer.service.cellChanged = new Platform.Messenger();
		serviceContainer.service.handleCellChanged = function handleCellChanged(arg)
		{
			serviceContainer.service.cellChanged.fire(arg.item, arg.grid.getColumns()[arg.cell].field);
		};
	}
})(angular);
