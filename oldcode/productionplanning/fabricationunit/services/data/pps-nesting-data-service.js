(function () {
	'use strict';
	/*global angular, globals*/

	var moduleName = 'productionplanning.fabricationunit';
	var module = angular.module(moduleName);
	module.factory('ppsNestingDataService', [
		'platformDataServiceFactory', 'ppsFabricationunitDataService',
		'basicsLookupdataLookupDescriptorService', 'basicsCommonMandatoryProcessor',
		function (platformDataServiceFactory, parentService,
		          basicsLookupdataLookupDescriptorService, basicsCommonMandatoryProcessor) {
			var serviceInfo = {
				flatLeafItem: {
					module: module,
					serviceName: 'ppsNestingDataService',
					entityNameTranslationID: 'productionplanning.fabricationunit.nesting.entityName',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'productionplanning/fabricationunit/nesting/',
						endRead: 'getByFabricationUnit'
					},
					entityRole: {
						leaf: {
							itemName: 'Nesting',
							parentService: parentService,
							parentFilter: 'fabricationUnitId'
						}
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								basicsLookupdataLookupDescriptorService.attachData(readData);
								_.forEach(readData.Main, (nesting) => {
									const productForNesting = _.find(readData.CommonProduct, {Id: nesting.PpsProductFk});
									nesting.EngDrawingDefFk = productForNesting ? productForNesting.EngDrawingFk : undefined;
									nesting.ItemFk = productForNesting ? productForNesting.ItemFk : undefined;
								});
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

			var container = platformDataServiceFactory.createNewComplete(serviceInfo);

			container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'PpsNestingDto',
				moduleSubModule: 'Productionplanning.Fabricationunit',
				validationService: 'ppsNestingValidationService'
			});

			return container.service;
		}]);
})();