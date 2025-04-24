

(function (angular) {
	/* global angular,globals,_,$ */
	'use strict';
	var moduleName = 'constructionsystem.master';
	/**
	 * @ngdoc service
	 * @name constructionSystemMasterGlobalParamGroupDataService
	 * @function
	 * @requires Data service for instance header parameter
	 *
	 * @description
	 * #
	 *  data service for constuctionsystem master global parameter group grid controller.
	 */
	angular.module(moduleName).factory('constructionSystemMasterGlobalParamGroupDataService', constructionSystemMasterGlobalParamGroupDataService);

	constructionSystemMasterGlobalParamGroupDataService.$inject = ['$http', 'platformDataServiceFactory','constructionSystemMasterHeaderService', '$injector'];

	function constructionSystemMasterGlobalParamGroupDataService($http, platformDataServiceFactory, constructionSystemMasterHeaderService, $injector) {

		var serviceOption = {
			hierarchicalRootItem: {
				module: angular.module(moduleName),
				serviceName: 'constructionSystemMasterGlobalParamGroupDataService',
				entityNameTranslationID: 'constructionsystem.master.globalParamGroupTitle',
				httpRead: {
					route: globals.webApiBaseUrl + 'constructionsystem/master/globalparametergroup/', endRead: 'tree',
					usePostForRead: true
				},
				httpCreate: {
					route: globals.webApiBaseUrl + 'constructionsystem/master/globalparametergroup/',
					endCreate: 'createdto'
				},
				httpDelete: {
					route: globals.webApiBaseUrl + 'constructionsystem/master/globalparametergroup/',
					endDelete: 'deletedto'
				},
				httpUpdate: {
					route: globals.webApiBaseUrl + 'constructionsystem/master/globalparametergroup/',
					endUpdate: 'updatedto'
				},
				presenter: {
					tree: {
						parentProp: 'CosGlobalParamGroupFk',
						childProp: 'CosGlobalParamGroupChildren',
						incorporateDataRead: function (readData, data) {
							var dataRead = serviceContainer.data.handleReadSucceeded(readData.dtos, data);
							return dataRead;
						}
					}
				},
				entityRole: {
					root: {
						itemName: 'CosGlobalParamGroupToSave',
						moduleName: 'Construction System Global Parameter Group',
						addToLastObject: true,
						lastObjectModuleName: moduleName,
						descField: 'DescriptionInfo.Description',
						handleUpdateDone: function (updateData, response, data) {
							if (data.itemList) {
								//service.syncItemsAfterUpdate(response);
								data.handleOnUpdateSucceeded(updateData, response, data, true);
							}
						}
					}
				},
				translation: {
					uid: 'constructionSystemMasterGlobalParamGroupDataService',
					title: 'constructionsystem.master.globalParamGroupTitle',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: {
						typeName: 'CosParameterGroupDto',
						moduleSubModule: 'ConstructionSystem.Master'
					}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
		var service = serviceContainer.service;

		serviceContainer.data.newEntityValidator = {
			validate: function validate(newItem) {
				var validationService = $injector.get('constructionSystemMasterGlobalParamGroupValidationService');
				validationService.validateCode(newItem, newItem.Code, 'Code');
			}
		};

		var refreshCount = 1;
		service.dataRefresh = dataRefresh;
		constructionSystemMasterHeaderService.updatedDoneMessenger.register(parentUpdateDone);
		function parentUpdateDone(e, updateData) {
			var data = serviceContainer.data;
			data.doClearModifications(null, data);
			var selItem = service.getSelected();
			if(updateData.CosGlobalParamGroupToSave){
				selItem.Version = updateData.CosGlobalParamGroupToSave.Version;
				selItem.Id = updateData.CosGlobalParamGroupToSave.Id;
			}
			data.handleOnUpdateSucceeded(selItem, updateData, data, true);
			service.gridRefresh();
		}

		service.load();
		return service;

		function dataRefresh() {
			if (refreshCount === 1) {
				service.refresh();
				refreshCount++;
			}
		}
	}
})(angular);
