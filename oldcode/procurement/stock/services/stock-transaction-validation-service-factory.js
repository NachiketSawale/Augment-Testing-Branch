/**
 * Created by zov on 8/2/2019.
 */
(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	var moduleName = 'procurement.stock';
	angular.module(moduleName).factory('procurementStockTransactionValidationServiceFactory',  procurementStockTransactionValidationServiceFactory);
	procurementStockTransactionValidationServiceFactory.$inject = ['platformDataValidationService',
		'basicsLookupdataLookupDataService',
		'platformRuntimeDataService',
		'basicsLookupdataLookupDescriptorService',
		'procurementStockTransactionReadOnlyProcessor'];
	function procurementStockTransactionValidationServiceFactory(platformDataValidationService,
		lookupService,
		platformRuntimeDataService,
		lookupDescriptorService,
		procurementStockTransactionReadOnlyProcessor) {
		var factory = {};

		function createValidationSrv(dataService) {
			var service = {};

			service.validatePrjStocklocationFk = function validateValue(entity, value,model, isnotvalidate){
				var validateResult;
				if(isnotvalidate){
					validateResult = {apply: true, valid: true};
					platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
					platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
					return validateResult;
				}

				if(value===0)
				{
					value=null;

				}
				var Mandatory=lookupDescriptorService.getData('ProjectStock');
				var item=_.find(Mandatory, {Id: entity.PrjStockFk});
				if(item!==undefined&&item.IsLocationMandatory)
				{
					validateResult = platformDataValidationService.isMandatory(value, model);
					platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
					platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
					return validateResult;
				}
			};
			service.validateLotno = function validateValue(entity, value,model){
				var Materials=lookupDescriptorService.getData('ProjectStock2Material');
				var Material=_.find(Materials, {ProjectStockFk: entity.PrjStockFk,MaterialFk:entity.MdcMaterialFk});
				if(Material!==undefined&&Material.IsLotManagement)
				{
					var validateResult = platformDataValidationService.isMandatory(value, model);
					platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
					platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
					return validateResult;
				}
			};
			// service.validateBasUomFk = function validateValue(entity, value,model){
			//     var validateResult = platformDataValidationService.isMandatory(value, model);
			//     platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
			//     platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
			//     return validateResult;
			// };
			service.validatePrcStocktransactiontypeFk = function validateValue(entity, value,model){
				var transactionType=lookupDescriptorService.getData('StockTransactionType');
				var item=_.find(transactionType, {Id: value});
				if(item!==undefined)
				{
					procurementStockTransactionReadOnlyProcessor.setFieldsEnabled(item,entity);
					if(item.IsReceipt) {
						setProvisionPercent(entity);
					}
					else
					{
						entity.Total=0;
						entity.ProvisionPercent=0;
						entity.ProvisionTotal=0;
					}
					var fields = ['PrjStocklocationFk'];
					/** @namespace item.IsConsumed */
					procurementStockTransactionReadOnlyProcessor.setFieldReadOnly(entity, fields, item.IsConsumed);
					if (item.IsConsumed) {
						entity.PrjStocklocationFk = null;
						service.validatePrjStocklocationFk(entity,entity.PrjStocklocationFk,'PrjStocklocationFk',true);
					}
					else{
						service.validatePrjStocklocationFk(entity,entity.PrjStocklocationFk,'PrjStocklocationFk');
					}
				}
				if(value===0)
				{
					value=null;

				}
				else
				{
					entity.PrcStocktransactiontypeFk=value;
				}
				var validateResult = platformDataValidationService.isMandatory(value, model);
				platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
				return validateResult;
			};
			service.validateQuantity = function validateValue(entity, value,model) {
				var transactionType=lookupDescriptorService.getData('StockTransactionType');
				var item=_.find(transactionType, {Id: entity.PrcStocktransactiontypeFk});
				if(value===null)
				{
					value=0;
				}

				if(item!==undefined)
				{
					if(item.IsReceipt)
					{
						entity.Quantity=value;
						setProvisionPercent(entity);
						return true;
					}
				}
				var validateResult = platformDataValidationService.isMandatory(value, model);
				platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
				return validateResult;
			};
			service.validateTotal = function validateValue(entity, value,model) {
				var transactionType=lookupDescriptorService.getData('StockTransactionType');
				var item=_.find(transactionType, {Id: entity.PrcStocktransactiontypeFk});
				if(value===null)
				{
					value=0;
				}

				if(item!==undefined)
				{
					if(item.IsReceipt)
					{
						entity.Total=value;
						setProvisionPercent(entity);
						return true;
					}
				}
				var validateResult = platformDataValidationService.isMandatory(value, model);
				platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
				return validateResult;
			};
			service.validateProvisionPercent = function validateValue(entity, value,model) {
				var transactionType=lookupDescriptorService.getData('StockTransactionType');
				var item=_.find(transactionType, {Id: entity.PrcStocktransactiontypeFk});
				if(value===null)
				{
					value=0;
				}

				if(item!==undefined)
				{
					if(item.IsReceipt)
					{
						entity.ProvisionPercent=value;
						setProvisionPercent(entity);
						return true;
					}
				}
				var validateResult = platformDataValidationService.isMandatory(value, model);
				platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
				return validateResult;
			};

			function setProvisionPercent(entity)
			{
				var Materials=lookupDescriptorService.getData('ProjectStock2Material');
				var material=_.find(Materials, {ProjectStockFk: entity.PrjStockFk,MaterialFk:entity.MdcMaterialFk});
				if(material)
				{
					entity.ProvisionPercent=material.ProvisionPercent;
					entity.ProvisionTotal=(entity.Quantity*material.ProvisionPeruom)+entity.ProvisionPercent/100*entity.Total;
				}

			}
			return service;
		}

		var cache = {};
		factory.getValidationService = function (dataService) {
			if(!cache[dataService.getServiceName()]){
				cache[dataService.getServiceName()] = createValidationSrv(dataService);
			}

			return cache[dataService.getServiceName()];
		};

		return factory;
	}
})();