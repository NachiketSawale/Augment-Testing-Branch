/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'sales.contract';
	var salesContractModule = angular.module(moduleName);

	salesContractModule.factory('salesContractBoqStructureService', ['_', 'boqMainServiceFactory', 'salesContractService', 'salesContractBoqService', 'salesCommonBoqStructureServiceDecorator', '$injector', function (_, boqMainServiceFactory, salesContractService, salesContractBoqService, salesCommonBoqStructureServiceDecorator, $injector) {

		var _calculationOfBudgetOnSalesBoQ = false;   // default
		function getCalculationOfBudgetOnSalesBoQSysOpt() {
			var basicCustomizeSystemoptionLookupDataService = $injector.get('basicCustomizeSystemoptionLookupDataService');
			basicCustomizeSystemoptionLookupDataService.getParameterValueAsync(10062).then(function (val) {
				_calculationOfBudgetOnSalesBoQ = (val === '1');
			});
		}

		var option = {
			maintainHeaderInfo: false,
			parent: salesContractService,
			moduleContext: {
				moduleName: moduleName
			},
			serviceName: 'salesContractBoqStructureService',
			filterByViewer: true,
			creationDataProcessor: function (creationData) {
				// Adjust the creation process of the boqItem, so we can take the given reference to the wic boq and use an already existing wic boq item as blueprint
				// for the call off contract boqItem that's about to be created.

				// Check if a call off contract is given
				let mainService = service.parentService();
				let selectedMainItem = mainService.getSelected();
				if (selectedMainItem === null) {
					return false;
				}
				let frameworkCallOffContract = !selectedMainItem.IsFramework && !_.isNil(selectedMainItem.BoqWicCatFk) && !_.isNil(selectedMainItem.BoqWicCatBoqFk);

				if (frameworkCallOffContract && selectedMainItem.IsFreeItemsAllowed) {
					// Only in case the free items are allowed we provide the reference to the wic boq that should serve as blueprint for new created boqItems.
					creationData.BoqWicCatBoqFk = selectedMainItem.BoqWicCatBoqFk;
				}
			}
		};

		var serviceContainer =  boqMainServiceFactory.createNewBoqMainService(option);
		var service = serviceContainer.service;

		getCalculationOfBudgetOnSalesBoQSysOpt();

		// Overwrite function in boqMainServiceFactory
		serviceContainer.data.getCurrentlyRelevantQuantityForBudget = function getCurrentlyRelevantQuantityForBudget(boqItem) {
			var relevantQuantity = 0;

			if (_.isObject(boqItem)) {
				if (_calculationOfBudgetOnSalesBoQ) {
					relevantQuantity = boqItem.ExWipQuantity > 0 ? boqItem.ExWipQuantity : boqItem.QuantityAdj;
				} else {
					relevantQuantity = boqItem.Quantity;
				}
			}

			return relevantQuantity;
		};

		// logic for Allow/Restrict Creation based on "New Items Allowed" Of a Framework Contract
		// Overwrite function in boqMainServiceFactory
		serviceContainer.data.canCreateBoqItemSpecific = function canCreateBoqItemSpecific(/* selectedBoqItem, boqLineType, level */) {
			let mainService = service.parentService();
			let selectedMainItem = mainService.getSelected();
			if (selectedMainItem === null) {
				return false;
			}
			let frameworkCallOffContract = !selectedMainItem.IsFramework && !_.isNil(selectedMainItem.BoqWicCatFk) && !_.isNil(selectedMainItem.BoqWicCatBoqFk);

			// framework contracts or call offs
			if (frameworkCallOffContract) {
				return selectedMainItem.IsFreeItemsAllowed;
			}

			// by default we allow creation
			return true;
		};

		service.addReadOnlyFields = function addReadOnlyFields(boqItem) {
			// ToDo: These variables can be used commonly as these variables are reused in the method above
			let mainService = service.parentService();
			let selectedMainItem = mainService.getSelected();
			let hasItemBeenSavedYet = service.hasItemBeenSavedYet(boqItem);
			let frameworkCallOffContract = !selectedMainItem.IsFramework && !_.isNil(selectedMainItem.BoqWicCatFk) && !_.isNil(selectedMainItem.BoqWicCatBoqFk);
			if (frameworkCallOffContract && hasItemBeenSavedYet) {
				return ['Reference','BriefInfo','BasUomFk','Price','BasBlobsSpecificationFk'];
			}
			return []; // returned empty array to maintain the existing base functionality from Boq Module as suggested by BoQ Team
		};

		service.getFrameworkBoqHeaderFk = function getFrameworkBoqHeaderFk(returnAdditionalInfo) {
			// Check if a call off contract is given
			let returnPromise = $injector.get('$q').when(null);
			let mainService = service.parentService();
			let selectedMainItem = mainService.getSelected();

			if(_.isObject(returnAdditionalInfo)) {
				returnAdditionalInfo.useWicToSyncVersionBoq = false;
			}

			if (selectedMainItem === null) {
				return returnPromise;
			}
			let frameworkCallOffContract = !selectedMainItem.IsFramework && !_.isNil(selectedMainItem.BoqWicCatFk) && !_.isNil(selectedMainItem.BoqWicCatBoqFk);

			if (frameworkCallOffContract && selectedMainItem.IsFreeItemsAllowed) {
				// Only in case the free items are allowed we provide the reference to the wic boq that should serve as blueprint for new created boqItems.

				// First return, that the conditions for syncing the contract boq based on the related WIC framework boq are met.
				if(_.isObject(returnAdditionalInfo)) {
					returnAdditionalInfo.useWicToSyncVersionBoq = true;
				}

				let http = $injector.get('$http');
				return http.get(globals.webApiBaseUrl + 'boq/wic/boq/list?wicGroupId=' + selectedMainItem.BoqWicCatFk).then(function (result) {
					if(_.isObject(result) && _.isArray(result.data) && result.data.length > 0) {
						let wicCatBoqComposite = _.find(result.data, function (compositeItem) {
							return compositeItem.Id === selectedMainItem.BoqWicCatBoqFk;
						});

						if(_.isObject(wicCatBoqComposite)) {
							return wicCatBoqComposite.WicBoq.BoqHeaderFk;
						}
					}

					return null;
				});

			}

			return returnPromise;
		};

		// Enhance sales boq structure service by general functionality placed in the decorator
		salesCommonBoqStructureServiceDecorator.decorate(serviceContainer, salesContractService, salesContractBoqService);

		return service;
	}]);
})();
