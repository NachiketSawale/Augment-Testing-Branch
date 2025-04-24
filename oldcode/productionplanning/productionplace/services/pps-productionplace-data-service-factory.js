(function () {
	'use strict';
	/* global globals */

	const moduleName = 'productionplanning.product';
	angular.module(moduleName).factory('ppsProductionPlaceDataServiceFactory', [
		'platformDataServiceFactory', '$injector',
		'ppsProductionPlaceValidationServiceFactory',
		'basicsCommonMandatoryProcessor',
		'ppsProductionPlaceProcessor', 'productionplanningCommonActivityDateshiftService',
		function (platformDataServiceFactory, $injector,
			ppsProductionPlaceValidationServiceFactory,
			basicsCommonMandatoryProcessor,
			dataProcessor, productionplanningCommonActivityDateshiftService) {
			const srvCache = {};

			function createNewComplete(options) {
				const parentService = $injector.get(options.parentService);
				const serviceOption = {
					flatNodeItem: {
						module: moduleName,
						serviceName: options.parentService + '_ProductionPlaceDataService',
						entityNameTranslationID: 'productionplanning.productionplace.entityProductionPlace',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'productionplanning/productionplace/',
							endRead: options.endRead,
							usePostForRead: options.usePostForRead,
							initReadData: options.usePostForRead ? function (readData) {
								const selected = parentService.getSelected();
								readData.Id = selected[options.parentFilterProperty];
							} : undefined
						},
						dataProcessor: [dataProcessor],
						entityRole: {
							node: {
								itemName: 'ProductionPlace',
								parentService: parentService,
								parentFilter: options.parentFilter
							}
						},
						presenter: {
							list: {
								initCreationData: function (creationData) {
									creationData.Id = parentService.getSelected().Id;
								},
								incorporateDataRead: options.onlyShowDetails ? function (result, data) {
									const dataRead = data.handleReadSucceeded(result, data);
									if (result.length > 0) {
										service.setSelected(result[0]);
									}
									return dataRead;
								} : undefined
							}
						},
					}
				};
				const container = platformDataServiceFactory.createNewComplete(serviceOption);
				const service = container.service;

				// make own VDS for productionplanning.phase or leave as it is - to be discussed with saa.hof
				productionplanningCommonActivityDateshiftService.registerToVirtualDateshiftService(moduleName, container, 'productionplanning.common');

				container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					mustValidateFields: true,
					typeName: 'PpsProductionPlaceDto',
					moduleSubModule: 'ProductionPlanning.ProductionPlace',
					validationService: $injector.get('ppsProductionPlaceValidationServiceFactory').getValidationService(service)
				});

				return service;
			}

			function getService(options) {
				if (!srvCache[options.parentService]) {
					srvCache[options.parentService] = createNewComplete(options);
				}
				return srvCache[options.parentService];
			}

			return {
				getService: getService
			};
		}
	]);

})();