/**
 * Created by zwz on 9/29/2019.
 */
(function () {
	'use strict';

	var moduleName = 'productionplanning.header';
	var module = angular.module(moduleName);
	module.factory('productionplanningHeader2BpDataService', DataService);

	DataService.$inject = ['$injector',
		'basicsCommonMandatoryProcessor',
		//'basicsLookupdataLookupDescriptorService',
		'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		//'platformRuntimeDataService',
		'productionplanningHeaderDataService'];

	function DataService($injector,
						 basicsCommonMandatoryProcessor,
						 //basicsLookupdataLookupDescriptorService,
						 platformDataServiceFactory,
						 platformDataServiceProcessDatesBySchemeExtension,
						 //platformRuntimeDataService,
						 parentService) {

		var service;
		var serviceName = 'productionplanningHeader2BpDataService';
		var serviceInfo = {
			flatNodeItem: {
				module: module,
				serviceName: serviceName,
				entityNameTranslationID: 'productionplanning.header.entityHeader2Bp',
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'Header2BpDto',
					moduleSubModule: 'ProductionPlanning.Header'
				})],
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/header/header2bp/',
					usePostForRead: true,
					endRead: 'listbyheader',
					initReadData: function (readData) {
						var selected = parentService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				entityRole: {
					node: {
						itemName: 'Header2Bp',
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
		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'Header2BpDto',
			moduleSubModule: 'ProductionPlanning.Header',
			validationService: 'productionplanningHeader2BpValidationService'
		});

		service.onEntityPropertyChanged = function (entity, field) {
			$injector.get('productionplanningHeader2BpDataServiceEntityPropertychangedExtension').onPropertyChanged(entity,field,service);
		};

		service.getServiceForItem = function (parentService) {
			serviceInfo.flatNodeItem.httpCRUD.initReadData = function (readData) {
				var selected = parentService.getSelected();
				readData.PKey1 = selected.PPSHeaderFk;
			};
			serviceInfo.flatNodeItem.entityRole.node.parentService = parentService;
			serviceInfo.flatNodeItem.presenter.list.initCreationData = function (creationData) {
				var selected = parentService.getSelected();
				if (selected) {
					creationData.Id = selected.PPSHeaderFk;
				}
			};

			return platformDataServiceFactory.createNewComplete(serviceInfo).service;
		};

		return service;

	}
})();