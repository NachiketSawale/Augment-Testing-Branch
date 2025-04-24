/**
 * Created by joshi on 16.09.2014.
 */
(function (angular) {
	'use strict';
	/* global globals */
	
	let moduleName = 'basics.costcodes';

	/**
	 * @ngdoc service
	 * @name basicsCostCodesPriceVersionDataService
	 * @function
	 *
	 * @description
	 * basicsCostCodesPriceVersionDataService
	 */

	/* jshint -W072 */
	let costCodesModule = angular.module(moduleName);
	costCodesModule.factory('basicsCostCodesPriceVersionListRecordDataService',
		['platformDataServiceFactory', 'basicsCostCodesMainService', '$injector',
			function (platformDataServiceFactory, parentService, $injector) {

				let serviceOption = {
					flatLeafItem: {
						module: costCodesModule,
						serviceName: 'basicsCostCodesPriceVersionListRecordDataService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'basics/costcodes/version/list/'
						},
						entityRole: {
							leaf: {
								itemName: 'PriceVersionListRecord',
								parentService: parentService,
								doesRequireLoadAlways: true
							}

						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									creationData.CostCodeFk = parentService.getSelected().Id;
								},
								handleCreateSucceeded: function handleCreateSucceeded(entity){
									let basicsCostCodesPriceVersionListRecordDynamicUserDefinedColumnService = $injector.get('basicsCostCodesPriceVersionListRecordDynamicUserDefinedColumnService');
									basicsCostCodesPriceVersionListRecordDynamicUserDefinedColumnService.attachEmptyDataToColumn(entity);

									return entity;
								},
								incorporateDataRead: function incorporateDataRead(readItems, data){
									let result = serviceContainer.data.handleReadSucceeded(readItems, data);

									let basicsCostCodesPriceVersionListRecordDynamicUserDefinedColumnService = $injector.get('basicsCostCodesPriceVersionListRecordDynamicUserDefinedColumnService');
									basicsCostCodesPriceVersionListRecordDynamicUserDefinedColumnService.attachDataToColumn(data.getList());

									return result;
								}
							}
						},
						entitySelection: {supportsMultiSelection: false}
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

				let originalOnDeleteDone = serviceContainer.data.onDeleteDone;
				serviceContainer.data.onDeleteDone = function(deleteParams, data, response){
					// remove the user defined column value of deleted line item
					let basicsCostCodesPriceVersionListRecordDynamicUserDefinedColumnService = $injector.get('basicsCostCodesPriceVersionListRecordDynamicUserDefinedColumnService');
					basicsCostCodesPriceVersionListRecordDynamicUserDefinedColumnService.handleEntitiesDeleted(deleteParams.entities);

					return originalOnDeleteDone(deleteParams, data, response);
				};

				let service = serviceContainer.service;
				// let data = serviceContainer.data;

				service.fieldChanged = function(item, column){
					let basicsCostCodesPriceVersionListRecordDynamicUserDefinedColumnService = $injector.get('basicsCostCodesPriceVersionListRecordDynamicUserDefinedColumnService');
					basicsCostCodesPriceVersionListRecordDynamicUserDefinedColumnService.fieldChange(item, column, item[column]);
				};

				parentService.onUpdated.register(function () {
					let basicsCostCodesPriceVersionListRecordDynamicUserDefinedColumnService = $injector.get('basicsCostCodesPriceVersionListRecordDynamicUserDefinedColumnService');
					basicsCostCodesPriceVersionListRecordDynamicUserDefinedColumnService.update();

					service.gridRefresh();
				});

				return service;
			}
		]);
})(angular);
