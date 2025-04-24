
(function (angular) {
	'use strict';
	/* global angular */
	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('ppsCommonProductManuallyCreateOptionFactory', ['$injector',
		function ($injector) {
			return {
				getCreationOptionObj: (isFieldProdplaceReadonly = false) => {
					const uiStandardServiceName = isFieldProdplaceReadonly ? 'ppsCommonProductManuallyUICreateService2' : 'ppsCommonProductManuallyUICreateService';
					return {
						rootService: 'productionplanningCommonProductItemDataService',
						dataService: 'ppsCommonProductManuallyCreateService',
						uiStandardService: $injector.get(uiStandardServiceName),
						validationService: 'ppsCommonProductManuallyValidationForCreateService',
						fields: ['EndDate', 'ProdPlaceFk'],
						creationData: {},
						title: ('cloud.common.toolbarInsert'),
						fid: 'basic.lookup.newDialog',
						attributes: {}
					};
				}
			};
		}]);

	angular.module(moduleName).factory('ppsCommonProductManuallyCreateOption', ['ppsCommonProductManuallyCreateOptionFactory',
		function (ppsCommonProductManuallyCreateOptionFactory) {
			return ppsCommonProductManuallyCreateOptionFactory.getCreationOptionObj();
		}]);

	angular.module(moduleName).factory('ppsCommonProductManuallyCreateOption2', ['ppsCommonProductManuallyCreateOptionFactory',
		function (ppsCommonProductManuallyCreateOptionFactory) {
			return ppsCommonProductManuallyCreateOptionFactory.getCreationOptionObj(true);
		}]);


	angular.module(moduleName).factory('ppsCommonProductManuallyCreateService', [
		'moment', '$q', 'productionplanningCommonProductItemDataService',
		'platformDataValidationService','basicsLookupdataLookupFilterService','productionplanningItemDataService',
		function (moment, $q, productionplanningCommonProductItemDataService,
			platformDataValidationService,basicsLookupdataLookupFilterService,productionplanningItemDataService) {
			var service = {};
			var parentItem = productionplanningItemDataService.getSelected();
			service.createItem = function (creationOptions, customCreationData) {
				parentItem = productionplanningItemDataService.getSelected();
				return productionplanningCommonProductItemDataService.createItemSimple(creationOptions, customCreationData, function (data) {
					if(typeof data.EndDate === 'string'){
						data.EndDate = moment.utc(data.EndDate);
					}
					service.updateData = data;
					service.updateData.ProductionSetFk = parentItem.ProductionSetId;
					service.updateData.ItemFk = parentItem.Id;
					service.updateData.ProductDescriptionFk = parentItem.ProductDescriptionFk;
					service.updateData.LgmJobFk = parentItem.LgmJobFk;
					service.updateData.SiteFks = customCreationData.subPuSiteChildrenIds;
					service.updateData.Code = 'Is Generated'; // just for passing required validation of .net Core validator on ProductDto when posting data to the server, product's code will be auto-generated in server side
					productionplanningCommonProductItemDataService.validationDatashift(service.updateData,data.EndDate, true);
					return data;
				});
			};
			service.update = function () {
				service.updateData.ProductionSetFk = parentItem.ProductionSetId;
				service.updateData.ItemFk = parentItem.Id;
				service.updateData.ProductDescriptionFk = parentItem.ProductDescriptionFk;
				service.updateData.LgmJobFk = parentItem.LgmJobFk;
				return productionplanningCommonProductItemDataService.updateManually(service.updateData).then(function (result) {
					service.updateData = result;
					clearValidationErrors();
				});
			};
			service.deleteItem = function () {
				clearValidationErrors();
				service.updateData = null;
				return $q.when(true);
			};

			function clearValidationErrors() {
				platformDataValidationService.removeDeletedEntityFromErrorList(service.updateData, productionplanningCommonProductItemDataService);
			}

			return service;
		}]);

})(angular);
