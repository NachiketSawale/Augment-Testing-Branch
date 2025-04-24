/**
 * Created by chk on 12/16/2015.
 */
(function (angular) {
	'use strict';
	/* global globals,_ */

	var moduleName = 'constructionsystem.master';
	/* jshint -W072 */
	angular.module(moduleName).factory('constructionSystemMasterParameterGroupDataService',
		['platformDataServiceFactory', 'constructionSystemMasterHeaderService', 'constructionSystemMasterParameterDataService',
			'constructionSystemMasterHeaderService','basicsCommonReadDataInterceptor',
			function (dataServiceFactory, parentService, constructionSystemMasterParameterDataService, cosHeaderService,readDataInterceptor) {

				var service = {};
				var serviceContainer;
				var serviceOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'constructionSystemMasterParameterGroupDataService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'constructionsystem/master/parametergroup/'
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									creationData.mainItemId = parentService.getSelected().Id;
								},
								incorporateDataRead: function (readData, data) {
									// basicsLookupdataLookupDescriptorService.attachData([{'CosParameterGroupLookup':readData}]);
									// basicsLookupdataLookupDescriptorService.updateData('CosParameterGroupLookup', readData || []);
									var items = serviceContainer.data.handleReadSucceeded(readData, data);
									constructionSystemMasterParameterDataService.gridRefresh();
									return items;

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
								itemName: 'CosParameterGroup',
								parentService: parentService,
								doesRequireLoadAlways: false
							}
						},
						actions: {
							delete: {},
							create: 'flat',
							canCreateCallBackFunc: function () {
								return angular.isDefined((parentService.getSelected() || {}).Code);
							},
							canDeleteCallBackFunc: function () {
								return angular.isDefined((parentService.getSelected() || {}).Code);
							}
						},
						translation: {
							uid: 'constructionSystemMasterParameterGroupDataService',
							title: 'constructionsystem.master.parameterGroupGridContainerTitle',
							columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
							dtoScheme: {
								typeName: 'CosParameterGroupDto', moduleSubModule: 'ConstructionSystem.Master'
							}
						}
					}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
				service = serviceContainer.service;
				readDataInterceptor.init(service, serviceContainer.data);

				// noinspection JSUnusedLocalSymbols
				function onCompleteEntityCreated(e,completeData) {
					/** @namespace completeData.CosParameterGroupDto */
					if(completeData.CosParameterGroupDto)
					{
						completeData.CosParameterGroupDto.Sorting = 1;
						service.setCreatedItems([completeData.CosParameterGroupDto]);
					}
				}

				cosHeaderService.completeEntityCreateed.register(onCompleteEntityCreated);
				return service;
			}]);

})(angular);