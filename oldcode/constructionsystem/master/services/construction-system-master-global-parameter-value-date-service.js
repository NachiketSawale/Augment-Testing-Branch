/**
 * Created by lvy on 4/12/2018.
 */
/* global $ */
(function (angular) {
	'use strict';
	/* global globals,_ */

	var moduleName = 'constructionsystem.master';
	var constructionSystemModule = angular.module(moduleName);
	constructionSystemModule.factory('constructionSystemMasterGlobalParameterValueDataService', [
		'$http',
		'platformDataServiceFactory',
		'constructionSystemMasterGlobalParameterDataService',
		'constructionSystemMasterGlobalParameterValueFormatterProcessor',
		'platformRuntimeDataService',
		'platformDataValidationService',
		'platformDataServiceModificationTrackingExtension',
		'$q',
		function (
			$http,
			dataServiceFactory,
			parentService,
			formatterProcessor,
			platformRuntimeDataService,
			platformDataValidationService,
			platformDataServiceModificationTrackingExtension,
			$q
		) {
			var route = globals.webApiBaseUrl + 'constructionsystem/master/globalparametervalue/';
			var service;
			var isLookup;
			var serviceContainer;
			var serviceOptions = {
				flatLeafItem: {
					module: constructionSystemModule,
					serviceName: 'constructionSystemMasterGlobalParameterValueDataService',
					httpCRUD: {
						route: route,
						endRead: 'list'
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								setCosParameterTypeFk(readData);
								return serviceContainer.data.handleReadSucceeded(readData, data);
							},
							initCreationData: function initCreationData(createData) {
								createData.mainItemId = parentService.getSelected().Id;
							},
							handleCreateSucceeded: function (newData) {
								var totalList = service.getList();
								if (totalList.length > 0) {
									newData.Sorting = _.max(_.map(totalList, 'Sorting')) + 1;
								} else {
									newData.Sorting = 1;
								}
							}
						}
					},
					entityRole: {
						leaf: {
							itemName: 'CosGlobalParamValue',
							parentService: parentService,
							doesRequireLoadAlways: true
						}
					},
					actions: {
						delete: {},
						create: 'flat',
						canCreateCallBackFunc: function () {
							return isLookup();
						},
						canDeleteCallBackFunc: function () {
							return isLookup();
						}
					},
					translation: {
						uid: 'constructionSystemMasterGlobalParameterValueDataService',
						title: 'constructionsystem.master.globalParameterValueGridContainerTitle',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'},
							{header: 'cloud.common.entityParameterValue', field: 'ParameterValue'}],
						dtoScheme: {
							typeName: 'CosParameterValueDto',
							moduleSubModule: 'ConstructionSystem.Master'
						}
					},
					dataProcessor: [formatterProcessor]
				}
			};

			serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
			service = serviceContainer.service;
			service.name = 'constructionsystem.master.globalparametervalue';

			isLookup = function () {
				var parentItem = parentService.getSelected();
				if (service.isSelection(parentItem)) {
					return parentItem.IsLookup;
				}
				return false;
			};

			service.getAllCaheData = function (itemId) {
				if (itemId) {
					return serviceContainer.data.provideCacheFor(itemId, serviceContainer.data);
				}
				else {
					return serviceContainer.data.cache;
				}
			};

			var deleteItem = function (entity) {
				return serviceContainer.data.deleteItem(entity, serviceContainer.data);
			};

			service.getListByParameterId = function (id) {
				return $http.get(route +'list?mainItemId='+id);
			};

			// delete all items
			service.deleteAll = function deleteAll() {
				service.deleteItem = service.deleteItem || deleteItem;
				angular.forEach(service.getList(), function (item) {
					service.deleteItem(item);
				});
			};

			parentService.parameterGetValueListComplete.register(getValueList);
			function getValueList(){
				if(service === null || service.getList().length === 0){
					return null;
				}
				return service.getList();
			}

			parentService.deleteValuesComplete.register(deleteValuesList);
			function deleteValuesList(parameterEntity, values){
				angular.forEach(values,function(item){
					deleteValues(parameterEntity, item, values, service, serviceContainer.data);
				});
			}
			// noinspection JSUnusedLocalSymbols
			function deleteValues(parameterEntity, entity, values, service, data){
				platformRuntimeDataService.markAsBeingDeleted(entity);
				var deleteParams = {};
				deleteParams.entity = entity;
				platformDataValidationService.removeDeletedEntityFromErrorList(entity, service);
				platformDataServiceModificationTrackingExtension.markAsDeleted(service, entity, data);

				data.doClearModifications(deleteParams.entity, data);

				if (data.usesCache && parameterEntity && parameterEntity.Id) {
					var cache = data.provideCacheFor(parameterEntity.Id, data);

					if (cache) {
						cache.loadedItems = _.filter(cache.loadedItems, function (item) {
							return item.Id !== entity.Id;
						});
					}
				}

				return $q.when(true);
			}

			parentService.parameterValueValidateComplete.register(updateConParameterValues);
			function updateConParameterValues(checkType, typeId){
				/* jshint -W074 */
				angular.forEach(service.getList(), function (item) {

					if(checkType){
						if(item.ParameterValue === undefined || isNaN(item.ParameterValue) ||
							item.ParameterValue === '' || item.ParameterValue === null){
							item.ParameterValue = 0;
						}
						var id = parseFloat(item.ParameterValue).toFixed(typeId);
						id = isNaN(parseFloat(id)) ? 0 : parseFloat(id);
						item.ParameterValue = id;
						serviceContainer.data.markItemAsModified(item, serviceContainer.data);
					}
				});

				serviceContainer.service.gridRefresh();
			}

			function setCosParameterTypeFk(readData) {
				var cosParameterTypeFk = parentService.getSelected().CosParameterTypeFk;
				$.each(readData, function(i, e) {
					e.CosParameterTypeFk = cosParameterTypeFk;
				});
			}

			return service;
		}]);

})(angular);
