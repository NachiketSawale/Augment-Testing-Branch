(function () {
	'use strict';
	var moduleName = 'basics.site';
	var module = angular.module(moduleName);

	module.factory('basicsSite2ExternalDataService', Site2ExternalDataService);

	Site2ExternalDataService.$inject = ['$injector', 'platformDataServiceFactory', 'basicsCommonMandatoryProcessor', 'basicsSiteMainService'];

	function Site2ExternalDataService($injector, platformDataServiceFactory, basicsCommonMandatoryProcessor, siteMainService) {

		var serviceInfo = {
			flatLeafItem: {
				module: module,
				serviceName: 'basicsSite2ExternalDataService',
				entityNameTranslationID: 'basics.site.entitySite2External',
				httpCRUD: {route: globals.webApiBaseUrl + 'basics/site/site2external/'},
				entityRole: {
					leaf: {
						itemName: 'Site2Externals',
						parentService: siteMainService
					}
				},
				presenter: {
					list: {
						initCreationData: function (creationData) {
							creationData.Id = siteMainService.getSelected().Id;
						}
					}
				}
			}
		};

		/* jshint -W003 */
		var container = platformDataServiceFactory.createNewComplete(serviceInfo);

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'Site2ExternalDto',
			moduleSubModule: 'Basics.Site',
			validationService: 'basicsSite2ExternalValidationService',
			mustValidateFields: ['BasExternalsourceFk', 'Code']
		});

		return container.service;
	}
})();