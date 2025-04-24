(function (angular) {
	'use strict';
	/* global globals */
	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */
	angular.module(moduleName).factory('constructionSystemMasterActivityTemplateService',
		['platformDataServiceFactory',
			'constructionSystemMasterHeaderService',
			'basicsLookupdataLookupDescriptorService',

			function (platformDataServiceFactory,
				constructionSystemMasterHeaderService,
				basicsLookupdataLookupDescriptorService) {

				var serviceOption = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'constructionSystemMasterActivityTemplateService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'constructionsystem/master/activitytemplate/',
							endRead: 'list'
						},
						presenter: {
							list: {
								incorporateDataRead: incorporateDataRead
							}
						},
						entityRole: {
							leaf: {
								itemName: 'CosActivityTemplate',
								parentService: constructionSystemMasterHeaderService
							}
						},
						dataProcessor: [{ processItem: processData }]
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

				angular.extend(serviceContainer.service,
					{
					}
				);

				return serviceContainer.service;

				function incorporateDataRead(readItems, data) {
					basicsLookupdataLookupDescriptorService.attachData(readItems || {});
					serviceContainer.data.handleReadSucceeded(readItems.dtos, data);
				}

				function processData(newItem) {
					if (newItem.ActivityTemplateFk === 0) {
						newItem.ActivityTemplateFk = null;
					}
				}
			}
		]);
})(angular);