/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {
	'use strict';

	var moduleName = 'sales.common';

	angular.module(moduleName).factory('salesCommonGeneralsValidationService',
		['_', 'platformDataValidationService', 'basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService', 'platformTranslateService', 'salesCommonGeneralsService', 'SalesCommonGeneralsProcessor',
			function (_, platformDataValidationService, basicsLookupdataLookupDescriptorService, platformRuntimeDataService, platformTranslateService, salesCommonGeneralsService, salesCommonGeneralsProcessor) {

				return function (dataService) {
					var service = {};

					// load lookup items, and cache in front end.
					basicsLookupdataLookupDescriptorService.loadData(['PrcGeneralsType']);

					service.validateGeneralsTypeFk = function validateGeneralsTypeFk(entity, value) {
						var generalTypeColumnName = platformTranslateService.instant('sales.common.generals.entity.generalsTypeFk', null, true);
						var isValid = platformDataValidationService.isUniqueAndMandatory(dataService.getList(), 'GeneralsTypeFk', value, entity.Id, {'object': generalTypeColumnName});
						if (isValid.valid) {

							var generalType = _.find(basicsLookupdataLookupDescriptorService.getData('PrcGeneralsType'), {Id: value});

							if (angular.isObject(generalType)) {
								entity.IsCost = generalType.IsCost;
								entity.CrbPriceconditionTypeFk = generalType.CrbPriceconditionTypeFk;
								entity.ValueType = generalType.IsPercent ? 1 : 0;
								if (entity.IsCost) {
									if (entity.TaxCodeFk === null) {
										// var parentHeader = dataService.parentService().getSelected();
										// if(parentHeader != null){
										//  entity.TaxCodeFk = parentHeader.TaxCodeFk;
										//  dataService.fireItemModified(entity);
										// }
									}
								} else {
									entity.ControllingUnitFk = null;
									entity.TaxCodeFk = null;
									dataService.fireItemModified(entity);
								}
								salesCommonGeneralsService.fireGeneralsTypeUpdate(entity, entity.GeneralsTypeFk, value);
							}

							salesCommonGeneralsProcessor.updateReadonlyStates(entity);
						}
						platformRuntimeDataService.applyValidationResult(isValid, entity, 'GeneralsTypeFk');
						platformDataValidationService.finishValidation(isValid, entity, value, 'GeneralsTypeFk', service, dataService);
						return isValid;
					};
					service.validateValue = function validateValue(entity, value) {
						entity.Value = value;
						salesCommonGeneralsService.fireGeneralValueUpdate(entity);
						return true;
					};

					service.validateControllingUnitFk = function validateControllingUnitFk(entity, value, model) {
						if (value !== null) {
							salesCommonGeneralsService.fireControllingUnitOrTaxCodeChange({entity: entity, model: model, value: value});
						}
						return true;
					};

					service.validateTaxCodeFk = function validateTaxCodeFk(entity, value, model) {
						if (value !== null) {
							salesCommonGeneralsService.fireControllingUnitOrTaxCodeChange({entity: entity, model: model, value: value});
						}
						return true;
					};

					dataService.registerEntityCreated(onEntityCreated);

					function onEntityCreated(e, item) {
						/* var isValid = */service.validateGeneralsTypeFk(item, item.GeneralsTypeFk); // TODO: no-unused-vars
					}

					return service;
				};


			}]);
})(angular);
