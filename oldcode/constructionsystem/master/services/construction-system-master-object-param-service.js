/**
 * Created by xsi on 2017-03-01.
 */
(function (angular) {
	'use strict';
	/* global globals */

	var moduleName = 'constructionsystem.master';
	var constructionSystemModule = angular.module(moduleName);

	/* jshint -W072 */ // many parameters because of dependency injection
	constructionSystemModule.factory('constructionSystemMasterObjectParamService', [
		'constructionSystemMasterModelObjectDataService', 'platformDataServiceFactory', 'constructionSystemMasterParameterDataService',
		'constructionSystemMasterHeaderService', 'constructionSystemMainInstance2ObjectParamFormatterProcessor',
		'ConstructionSystemMainPropertyNameProcessor', 'basicsLookupdataLookupDescriptorService', '$http', 'basicsLookupdataLookupFilterService',
		function (parentService, platformDataServiceFactory, constructionSystemMasterParameterDataService, constructionSystemMasterHeaderService, formatterProcessor, ConstructionSystemMainPropertyNameProcessor, basicsLookupdataLookupDescriptorService, $http, basicsLookupdataLookupFilterService) {

			var serviceName = 'constructionsystem.main.instance2object.param';
			var serviceOptions = {
				flatLeafItem: {
					module: constructionSystemModule,
					serviceName: 'constructionSystemMasterObjectParamService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'constructionsystem/main/instance2objectparam/',
						endRead: 'createtemporaryobjectparam',
						usePostForRead: true,
						initReadData: initReadData
					},
					/* jshint -W055 */
					dataProcessor: [new formatterProcessor(serviceName), {processItem: addAdditionalProperties}, new ConstructionSystemMainPropertyNameProcessor(serviceName)],
					presenter: {
						list: {
							incorporateDataRead: function (itemList, data) {
								// var result = data.handleReadSucceeded(itemList.Main || itemList || [], data);
								// basicsLookupdataLookupDescriptorService.attachData(itemList.CosMainInstanceParameterValue || {});
								// return result;
								return data.handleReadSucceeded(itemList.Main || itemList || [], data);
							}
						}
					},
					entityRole: {
						leaf: {
							itemName: 'ObjectParameters',
							parentService: parentService
						}
					},
					actions: {
						'delete': false,
						'create': false
					}
				}
			};

			function initReadData(readData) {
				var object = parentService.getSelected() || {};
				if (object && object.IsChecked) {
					readData.modelObjectId = object.Id;
					readData.modelId = object.ModelFk;
					var masterHeaderItem = constructionSystemMasterHeaderService.getSelected();
					// constructionSystemMasterHeaderService.getSelected() may be null
					readData.cosHeaderId = masterHeaderItem !== null? masterHeaderItem.Id : -1;
				}
			}

			function addAdditionalProperties(item){
				var parentItem = parentService.getSelected();
				// for property name filter use
				item.InstanceFk = parentItem.InstanceFk || -1;
			}

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
			serviceContainer.service.getAsyncParameterValueByPropertyName = function getAsyncParameterValueByPropertyName(entity){
				return $http.get(globals.webApiBaseUrl + 'constructionsystem/master/objectparameter/getobjectpropertyvalue', {
					params: {
						modelId: parentService.getSelected().ModelFk,
						// instanceHeaderId: parentService.getSelected().InstanceHeaderFk,
						// instanceId: entity.InstanceFk,
						objectId: parentService.getSelected().Id,
						paramaterId: entity.ParameterFk,
						propertyName: entity.PropertyName
					}
				});
			};

			var filters = [
				{
					key: 'cos-master-object2parameter-property-name-filter',
					serverSide: true,
					fn: function(){

						var parentItem = parentService.getSelected();
						return {
							modelId: parentItem!== null? parentItem.ModelFk : null,
							modelObjectId: parentItem.Id
						};
					}
				}
			];

			basicsLookupdataLookupFilterService.registerFilter(filters);
			return serviceContainer.service;
		}
	]);
})(angular);

