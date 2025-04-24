(function () {
	'use strict';
	/*global angular, _*/

	var moduleName = 'transportplanning.transport';
	var module = angular.module(moduleName);
	module.factory('trsRouteClerkDataService', [
		'platformDataServiceProcessDatesBySchemeExtension', 'productionplanningCommonClerkProcessor',
		'transportplanningTransportMainService', 'platformDataServiceFactory',
		'basicsCommonMandatoryProcessor',
		function (platformDataServiceProcessDatesBySchemeExtension, clerkProcessor,
		          parentService, platformDataServiceFactory,
		          basicsCommonMandatoryProcessor) {
			var service;
			var serviceName = 'trsRouteClerkDataService';
			var serviceInfo = {
				flatLeafItem: {
					module: module,
					serviceName: serviceName,
					entityNameTranslationID: 'transportplanning.transport.route2clerk.entityRoute2Clerk',
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'Route2ClerkDto',
						moduleSubModule: 'TransportPlanning.Transport'
					}), clerkProcessor],
					httpCRUD: {
						route: globals.webApiBaseUrl + 'transportplanning/transport/route2clerk/',
						endRead: 'list'
					},
					entityRole: {
						leaf: {
							itemName: 'Route2Clerk',
							parentService: parentService,
							parentFilter: 'routeId'
						}
					},
					actions: {
						create: 'flat',
						delete: true,
						canDeleteCallBackFunc: canDelete
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

			function canDelete(selectedItem) {
				return _.isNil(selectedItem.From);
			}

			var container = platformDataServiceFactory.createNewComplete(serviceInfo);
			service = container.service;
			container.data.usesCache = false;
			container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'Route2ClerkDto',
				moduleSubModule: 'TransportPlanning.Transport',
				validationService: 'trsRouteClerkValidationService'
			});

			return service;
		}
	]);
})();