/**
 * Created by chk on 12/18/2015.
 */

(function (angular) {
	'use strict';
	/* global globals,_ */

	/* jshint -W072 */
	var moduleName = 'constructionsystem.master';
	var constructionSystemModule = angular.module(moduleName);
	constructionSystemModule.factory('constructionSystemMasterParameterValueDataService',
		['$http','platformDataServiceFactory', 'constructionSystemMasterParameterDataService',
			'constructionSystemMasterParameterValueFormatterProcessor', 'platformRuntimeDataService',
			'platformDataValidationService', 'platformDataServiceModificationTrackingExtension','$q',
			function ($http,dataServiceFactory, parentService,formatterProcessor,platformRuntimeDataService,
				platformDataValidationService, platformDataServiceModificationTrackingExtension, $q) {

				var route = globals.webApiBaseUrl + 'constructionsystem/master/parametervalue/';
				var service;
				var isLookup;
				var serviceOptions = {
					flatLeafItem: {
						module: constructionSystemModule,
						serviceName: 'constructionSystemMasterParameterValueDataService',
						httpCRUD: {
							route: route,
							endRead: 'list'
						},
						presenter: {
							list: {
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
								itemName: 'CosMasterParameterValue',
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
							uid: 'constructionSystemMasterParameterValueDataService',
							title: 'constructionsystem.master.parameterValueGridContainerTitle',
							columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
							dtoScheme: {
								typeName: 'CosParameterValueDto',
								moduleSubModule: 'ConstructionSystem.Master'
							}
						},
						dataProcessor: [formatterProcessor]
					}
				};

				var serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
				service = serviceContainer.service;
				service.name = 'constructionsystem.master.parametervalue';

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

				return service;
			}]);

})(angular);