(function () {
	'use strict';
	/*global angular, _*/

	var moduleName = 'basics.site';
	var module = angular.module(moduleName);
	module.factory('basSiteClerkDataService', [
		'platformDataServiceProcessDatesBySchemeExtension', 'productionplanningCommonClerkProcessor',
		'basicsSiteMainService', 'platformDataServiceFactory',
		'basicsCommonMandatoryProcessor',
		function (platformDataServiceProcessDatesBySchemeExtension, clerkProcessor,
		          parentService, platformDataServiceFactory,
		          basicsCommonMandatoryProcessor) {
			var service;
			var serviceName = 'basSiteClerkDataService';
			var serviceInfo = {
				flatLeafItem: {
					module: module,
					serviceName: serviceName,
					entityNameTranslationID: 'basics.site.entitySite2Clerk',
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
						{typeName: 'Site2ClerkDto', moduleSubModule: 'Basics.Site'})],
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/site/site2clerk/',
						endRead: 'list'
					},
					entityRole: {
						leaf: {
							itemName: 'Site2Clerk',
							parentService: parentService,
							parentFilter: 'siteId'
						}
					},
					actions: {
						create: 'flat',
						delete: true,
					},
					presenter: {
						list: {

							initCreationData: function (creationData) {
								//set Id for creation
								var selected = parentService.getSelected();
								if (selected) {
									creationData.Id = selected.Id;
								}
							}
						}
					}
				}
			};

			var container = platformDataServiceFactory.createNewComplete(serviceInfo);
			service = container.service;
			container.data.usesCache = false;
			container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'Site2ClerkDto',
				moduleSubModule: 'Basics.Site',
				validationService: 'basSiteClerkValidationService'
			});

			return service;
		}
	]);
})();