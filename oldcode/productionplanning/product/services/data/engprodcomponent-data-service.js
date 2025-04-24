/**
 * Created by zwz on 12/16/2020.
 */
(function () {
	'use strict';

	var moduleName = 'productionplanning.product';
	var module = angular.module(moduleName);
	module.factory('productionplanningProductEngProdComponentDataService', DataService);

	DataService.$inject = ['$injector',
		'basicsCommonMandatoryProcessor',
		'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'productionplanningProductMainService',
		'ppsProductComponentProcessor'];

	function DataService($injector,
						 basicsCommonMandatoryProcessor,
						 platformDataServiceFactory,
						 platformDataServiceProcessDatesBySchemeExtension,
						 parentService,
						 ppsProductComponentProcessor) {

		var service;
		var serviceName = 'productionplanningProductEngProdComponentDataService';
		var serviceInfo = {
			flatLeafItem: {
				module: module,
				serviceName: serviceName,
				entityNameTranslationID: 'productionplanning.product.engProdComponent.entityEngProdComponent',
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'EngProdComponentDto',
					moduleSubModule: 'ProductionPlanning.Product'
				}), ppsProductComponentProcessor],
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/product/engprodcomponent/',
					usePostForRead: true,
					endRead: 'listbyproduct',
					initReadData: function (readData) {
					    var selected = parentService.getSelected();
					    readData.PKey1 = selected.Id;
					}
				},
				entityRole: {
					leaf: {
						itemName: 'EngProdComponent',
						parentService: parentService
					}
				},
				presenter: {
					list: {

						initCreationData: function (creationData) {
							//set Id for creation
							var selected = parentService.getSelected();
							if (selected) {
								creationData.PKey1 = selected.Id;
							}
						}
					}
				}
			}
		};


		var container = platformDataServiceFactory.createNewComplete(serviceInfo);
		service = container.service;
		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			mustValidateFields: true,
			typeName: 'EngProdComponentDto',
			moduleSubModule: 'ProductionPlanning.Product',
			validationService: 'productionplanningProductEngProdComponentValidationService'
		});

		return service;

	}
})();