(function () {
	'use strict';
	/*global angular*/
	const moduleName = 'productionplanning.product';

	angular.module(moduleName).factory('ppsProductRackassignmentDataService', [
		'platformDataServiceFactory', 'basicsCommonMandatoryProcessor', 'productionplanningProductMainService',
		function (platformDataServiceFactory, basicsCommonMandatoryProcessor, parentService) {
			let container;
			let serviceOptions = {
				flatLeafItem: {
					module: moduleName,
					serviceName: 'ppsProductRackassignmentDataService',
					entityNameTranslationID: 'productionplanning.product.rack.rackAssignListTitle',
					addValidationAutomatically: true,
					httpCRUD: {
						route: globals.webApiBaseUrl + 'productionplanning/product/rackassignment/',
						endDelete: 'multidelete',
						endRead: 'listbyproduct'
					},
					entityRole: {
						leaf: {
							itemName: 'RackAssignment',
							parentService: parentService,
							parentFilter: 'productId'
						}
					},
					entitySelection: { supportsMultiSelection: true },
					presenter: {
						list: {
							initCreationData: function (creationData) {
								var selected = parentService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					}
				}
			};
			container = platformDataServiceFactory.createNewComplete(serviceOptions);
			container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'PpsRackAssignDto',
				moduleSubModule: 'ProductionPlanning.Product',
				validationService: 'ppsProductRackassignmentValidationService'
			});

			return container.service;
		}
	]);
})();