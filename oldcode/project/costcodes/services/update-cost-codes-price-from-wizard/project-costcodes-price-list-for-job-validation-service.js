/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'project.costcodes';
	angular.module(moduleName).factory('projectCostCodesPriceListForJobValidationService',
		['$injector', 'basicsLookupdataLookupDescriptorService', 'projectCostCodesPriceListForJobMessengerService',
			function ($injector, basicsLookupdataLookupDescriptorService, messengerService) {
				let service = {};
				service.validateIsChecked = function validateIsChecked(entity, value) {
					entity.IsChecked = value;
					setChecked(entity, value);
					if(entity.ProjectCostCodes && entity.ProjectCostCodes.length>0){
						let dataService = $injector.get('projectCostCodesPriceListForJobDataService');
						dataService.gridRefresh();
					}
				};

				function setChecked(entity, value){
					if(entity.ProjectCostCodes && entity.ProjectCostCodes.length>0){
						angular.forEach(entity.ProjectCostCodes,function (item) {
							item.IsChecked = value;
							setChecked(item, value);
						});
					}
				}

				service.validateJobCostCodePriceVersionFk = function validateJobCostCodePriceVersionFk(entity, value) {
					entity.JobCostCodePriceVersionFk = value;
					if (value) {
						let lookupItem = basicsLookupdataLookupDescriptorService.getItemByIdSync(value, {lookupType: 'CostCodePriceVersion'});
						entity.MdcPriceListFk = lookupItem.PriceListFk;
					} else {
						entity.MdcPriceListFk = null;
					}
					if (entity.isJob) {
						messengerService.JobPriceVersionSelectedChanged.fire(null, {
							job: entity,
							priceVersionFk: value
						});
					} else {
						messengerService.PrjCostCodesPriceVersionSelectedChanged.fire(null, {
							prjCostCodes: entity,
							priceVersionFk: value
						});
					}
				};

				service.validateNewRate = function validateNewRate(entity, value) {
					entity.NewRate = value;
					entity.MdcPriceListFk = null;
					entity.JobCostCodePriceVersionFk = null;
					messengerService.PrjCostCodesPriceVersionSelectedChanged.fire(null, {
						prjCostCodes: entity,
						priceVersionFk: null,
						needCompute: false
					});
				};

				service.validateNewDayWorkRate = function validateNewDayWorkRate(entity, value) {
					entity.NewDayWorkRate = value;
					entity.MdcPriceListFk = null;
					entity.JobCostCodePriceVersionFk = null;
					messengerService.PrjCostCodesPriceVersionSelectedChanged.fire(null, {
						prjCostCodes: entity,
						priceVersionFk: null,
						needCompute: false
					});
				};

				service.validateNewFactorCosts = function validateNewDayWorkRate(entity, value, model) {
					let dataService = $injector.get('projectCostCodesPriceListForJobDataService');
					dataService.calcRealFactors(entity, value, model);
				};

				service.validateNewFactorQuantity = function validateNewDayWorkRate(entity, value, model) {
					let dataService = $injector.get('projectCostCodesPriceListForJobDataService');
					dataService.calcRealFactors(entity, value, model);
				};

				service.validateNewCurrencyFk = function validateNewCurrencyFk(entity, value) {
					entity.NewCurrencyFk = value;
					let dataService = $injector.get('projectCostCodesPriceListForJobDataService');
					dataService.computePrjCostCodes(entity, true, value);
				};
				return service;
			}]);
})(angular);