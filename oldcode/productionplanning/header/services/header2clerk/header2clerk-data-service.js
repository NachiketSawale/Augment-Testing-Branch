/**
 * Created by zwz on 10/10/2019.
 */
(function () {
	'use strict';

	var moduleName = 'productionplanning.header';
	var module = angular.module(moduleName);
	module.factory('productionplanningHeader2ClerkDataService', DataService);

	DataService.$inject = ['$injector',
		'basicsCommonMandatoryProcessor',
		'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'productionplanningHeaderDataService',
		'productionplanningCommonClerkProcessor'];

	function DataService($injector,
						 basicsCommonMandatoryProcessor,
						 platformDataServiceFactory,
						 platformDataServiceProcessDatesBySchemeExtension,
						 parentService,
						 clerkProcessor) {

		var service;
		var serviceName = 'productionplanningHeader2ClerkDataService';
		var serviceInfo = {
			flatLeafItem: {
				module: module,
				serviceName: serviceName,
				entityNameTranslationID: 'productionplanning.header.entityHeader2Clerk',
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'Header2ClerkDto',
					moduleSubModule: 'ProductionPlanning.Header'
				}), clerkProcessor],
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/header/header2Clerk/',
					endRead: 'listallclerks'
				},
				entityRole: {
					leaf: {
						itemName: 'Header2Clerk',
						parentService: parentService,
						parentFilter: 'headerFk'
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
			typeName: 'Header2ClerkDto',
			moduleSubModule: 'ProductionPlanning.Header',
			validationService: 'productionplanningHeader2ClerkValidationService'
		});

		return service;

	}
})();