/**
 * Created by zwz on 9/29/2019.
 */
(function () {
	'use strict';

	var moduleName = 'productionplanning.header';
	var module = angular.module(moduleName);
	module.factory('productionplanningHeader2ContactDataService', DataService);

	DataService.$inject = ['$injector',
		'basicsCommonMandatoryProcessor',
		//'basicsLookupdataLookupDescriptorService',
		'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		//'platformRuntimeDataService',
		'productionplanningHeader2BpDataService'];

	function DataService($injector,
						 basicsCommonMandatoryProcessor,
						 //basicsLookupdataLookupDescriptorService,
						 platformDataServiceFactory,
						 platformDataServiceProcessDatesBySchemeExtension,
						 //platformRuntimeDataService,
						 parentService) {

		var service;
		var serviceName = 'productionplanningHeader2ContactDataService';
		var serviceInfo = {
			flatLeafItem: {
				module: module,
				serviceName: serviceName,
				entityNameTranslationID: 'productionplanning.header.entityHeader2Contact',
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'Header2ContactDto',
					moduleSubModule: 'ProductionPlanning.Header'
				})],
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/header/header2contact/',
					usePostForRead: true,
					endRead: 'listbypartner',
					initReadData: function (readData) {
						var selected = parentService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				entityRole: {
					leaf: {
						itemName: 'Header2Contact',
						parentService: parentService
					}
				},
				actions: {
					delete: {},
					create: 'flat'
				},
				presenter: {
					list: {

						initCreationData: function (creationData) {
							//set Id,PKey1,PKey2 for creation
							var selected = parentService.getSelected();
							if (selected) {
								creationData.Id = selected.Id;
								creationData.PKey1 = selected.HeaderFk;
								creationData.PKey2 = selected.BusinessPartnerFk;
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
			typeName: 'Header2ContactDto',
			moduleSubModule: 'ProductionPlanning.Header',
			validationService: 'productionplanningHeader2ContactValidationService'
		});

		service.getServiceForItem = function (parentService) {
			serviceInfo.flatLeafItem.httpCRUD.initReadData = function (readData) {
				var selected = parentService.getSelected();
				readData.PKey1 = selected.Id;
			};
			serviceInfo.flatLeafItem.entityRole.leaf.parentService = parentService;
			serviceInfo.flatLeafItem.presenter.list.initCreationData = function (creationData) {
				var selected = parentService.getSelected();
				if (selected) {
					creationData.Id = selected.Id;
					creationData.PKey1 = selected.HeaderFk;
					creationData.PKey2 = selected.BusinessPartnerFk;
				}
			};

			return platformDataServiceFactory.createNewComplete(serviceInfo).service;
		};

		return service;

	}
})();