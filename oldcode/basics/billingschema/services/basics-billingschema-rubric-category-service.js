/**
 * Created by chm on 6/8/2015.
 */
(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'basics.billingschema';

	/**
	 * @ngdoc service
	 * @name basicsBillingSchemaService
	 * @function
	 *
	 * @description
	 * basicsBillingSchemaService is the main data service for all billing schema related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsBillingSchemaRubricCategoryService', ['platformDataServiceFactory', 'basicsBillingSchemaService', 'ServiceDataProcessArraysExtension', 'basicsBillingSchemaRubricCategoryImageProcessor', 'basicsCommonReadOnlyProcessorExtension',

		function (platformDataServiceFactory, basicsBillingSchemaService, serviceDataProcessArraysExtension, basicsBillingSchemaRubricCategoryImageProcessor, basicsCommonReadOnlyProcessorExtension) {

			//Fix warnings.
			var ServiceDataProcessArraysExtension = serviceDataProcessArraysExtension;
			var BasicsCommonReadOnlyProcessorExtension = basicsCommonReadOnlyProcessorExtension;
			var serviceContainer = null;

			var serviceOption = {
				hierarchicalNodeItem: {
					serviceName: 'basicsBillingSchemaRubricCategoryService',
					httpRead: {
						route: globals.webApiBaseUrl + 'basics/billingschema/rubriccategory/',
						endRead: 'tree'
					},
					dataProcessor: [
						new ServiceDataProcessArraysExtension(['RubricCategories']),
						basicsBillingSchemaRubricCategoryImageProcessor,
						new BasicsCommonReadOnlyProcessorExtension(['DescriptionInfo'])
					],
					presenter: {
						tree: {
							parentProp: 'ParentFk',
							childProp: 'RubricCategories',
							incorporateDataRead: function (readData, data) {
								var dataList = serviceContainer.service.getTree();
								//Have data, not reload.
								if (dataList.length === 0) {
									return serviceContainer.data.handleReadSucceeded(readData, data);
								}
								return dataList;
							}
						}
					},
					entitySelection: {},
					entityRole: {
						node: {
							itemName: 'RubricCategoryTreeItem',
							parentService: basicsBillingSchemaService
						}
					},
					modification: {
						multi: {}
					},
					actions: {
						delete: false,
						create: false
					}
				}
			};

			serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
			//Have data, not reload.
			serviceContainer.data.doReadData = function doReadData(data) {
				data.listLoadStarted.fire();
				var dataList = serviceContainer.data.itemTree;
				if (dataList && dataList.length === 0) {
					var readData = {};
					readData.filter = '';
					if (data.filter) {
						readData.filter = '?' + data.filter;
					}
					return  serviceContainer.data.doCallHTTPRead(readData, data, data.onReadSucceeded);
				}
			};
			return serviceContainer.service;
		}]);
})(angular);