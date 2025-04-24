(function () {
	'use strict';
	/*globals angular*/

	var moduleName = 'productionplanning.productionset';
	var module = angular.module(moduleName);
	module.factory('ppsProductionSubsetDataService', [
		'platformDataServiceFactory', 'productionplanningProductionsetMainService',
		'basicsLookupdataLookupDescriptorService', 'basicsCommonMandatoryProcessor',
		function (platformDataServiceFactory, parentService,
		          basicsLookupdataLookupDescriptorService, basicsCommonMandatoryProcessor) {
			var serviceInfo = {
				flatLeafItem: {
					module: module,
					serviceName: 'ppsProductionSubsetDataService',
					entityNameTranslationID: 'productionplanning.productionset.subset.entityNameTranslationID',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'productionplanning/fabricationunit/productionsubset/',
						endRead: 'getByProductionSet'
					},
					entityRole: {
						leaf: {
							itemName: 'ProductionSubset',
							parentService: parentService,
							parentFilter: 'productionSetId'
						}
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								basicsLookupdataLookupDescriptorService.attachData(readData);
								var result = {
									FilterResult: readData.FilterResult,
									dtos: readData.Main || []
								};
								return data.handleReadSucceeded(result, data);
							},
							initCreationData: function (creationData) {
								var parent = parentService.getSelected();
								if (parent) {
									creationData.PKey1 = parent.Id;
								}
							}
						}
					},
					entitySelection: {supportsMultiSelection: true}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceInfo);

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'PpsProductionSubsetDto',
				moduleSubModule: 'Productionplanning.Fabricationunit',
				validationService: 'ppsProductionSubsetValidationService'
			});

			return serviceContainer.service;
		}
	]);
})();