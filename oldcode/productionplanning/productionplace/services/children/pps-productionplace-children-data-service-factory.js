(function () {
	'use strict';
	/* global globals */

	const moduleName = 'productionplanning.productionplace';
	angular.module(moduleName).factory('ppsProductionPlaceChildrenDataServiceFactory', [
		'platformDataServiceFactory', '$injector',
		'ppsProductionPlaceChildrenValidationServiceFactory', 'basicsCommonMandatoryProcessor',
		'basicsLookupdataSimpleLookupService', 'platformDataServiceProcessDatesBySchemeExtension',
		function (platformDataServiceFactory, $injector,
			ppsProductionPlaceChildrenValidationServiceFactory, basicsCommonMandatoryProcessor,
			basicsLookupdataSimpleLookupService, platformDataServiceProcessDatesBySchemeExtension) {
			const srvCache = {};

			function createNewComplete(parentService) {
				const serviceOption = {
					flatLeafItem: {
						module: moduleName,
						serviceName: parentService.getServiceName() + '_ProductionPlaceChildrenDataService',
						entityNameTranslationID: 'productionplanning.productionPlace.childrenEntityName',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'productionplanning/productionplace/children/',
							endRead: 'getchildren'
						},
						entityRole: {
							leaf: {
								itemName: 'ProductionPlaceChildren',
								parentService: parentService,
								parentFilter: 'prodPlaceId'
							}
						},
						dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
							{typeName: 'PpsProdPlaceToProdPlaceDto', moduleSubModule: 'ProductionPlanning.ProductionPlace'}
						)],
						presenter: {
							list: {
								initCreationData: function (creationData) {
									creationData.Id = parentService.getSelected().Id;
								},
								incorporateDataRead: function (result, data) {
									// order by Timestamp descendant
									result.sort(function (value1, value2) {
										return value1.Timestamp < value2.Timestamp ? 1 : (value1.Timestamp > value2.Timestamp ? -1 : 0);
									});
									const dataRead = data.handleReadSucceeded(result, data);
									return dataRead;
								}
							}
						},
						actions: {
							delete: {},
							create: 'flat',
							canCreateCallBackFunc: function () {
								const prodPlace = parentService.getSelected();
								const prodPlaceType = basicsLookupdataSimpleLookupService.getItemByIdSync(prodPlace.PpsProdPlaceTypeFk, {
									lookupModuleQualifier: 'basics.customize.ppsproductplacetype',
									valueMember: 'Id'
								});
								return prodPlaceType && prodPlaceType.Canhavechildren;
							}
						}
					}
				};
				const serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
				const service = serviceContainer.service;
				const validationService = ppsProductionPlaceChildrenValidationServiceFactory.getValidationService(service);
				serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					mustValidateFields: true,
					typeName: 'PpsProdPlaceToProdPlaceDto',
					moduleSubModule: 'ProductionPlanning.ProductionPlace',
					validationService: validationService
				});
				return service;
			}

			function getByParentService(parentService) {
				const parentSrvName = parentService.getServiceName();
				if(!srvCache[parentSrvName]){
					srvCache[parentSrvName] = createNewComplete(parentService);
				}
				return srvCache[parentSrvName];
			}

			return {
				getByParentService: getByParentService
			};
		}
	]);

})();