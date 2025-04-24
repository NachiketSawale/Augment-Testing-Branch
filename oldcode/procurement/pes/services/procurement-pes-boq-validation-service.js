(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	var moduleName = 'procurement.pes';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementPesBoqValidationService',
		['$http','$timeout','$translate','platformDataValidationService','basicsLookupdataLookupDescriptorService','platformRuntimeDataService','$q','$injector',
			function ($http,$timeout,$translate,platformDataValidationService,basicsLookupdataLookupDescriptorService,platformRuntimeDataService,$q,$injector) {

				var serviceCache = {};

				return getService;
				// ///////////////////
				function getService(name, dataService) {
					if (serviceCache[name]) {
						return serviceCache[name];
					}
					else {
						var newService = config(dataService);
						serviceCache[name] = newService;
						return newService;
					}
				}

				function config(dataService){
					var onPropertyChanged = getOnPropertyChanged();
					var service = {};
					// noinspection JSUnusedGlobalSymbols

					service.removeError = function (entity) {
						if (entity.__rt$data && entity.__rt$data.errors) {
							entity.__rt$data.errors = null;
						}
					};
					service.validateModel = function () {
						return true;
					};
					service.validateConHeaderFk = function (currentItem, value, field) {
						var result = true;
						if(value < 1){
							result = platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage',{fieldName : field.toLowerCase()},true);
						}
						if ( field && value !== currentItem[field]) {
							onPropertyChanged.conHeaderFkChanged(currentItem, value, field);
						}

						// dataService.parentService().setBaseNChangeOrderPrcHeaderIdsByConHeaderId(value, true);

						return result;
					};
					service.validatePrcBoqFk = function (currentItem, value, field) {
						var result = true;
						if(value < 1){
							result = platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage',{fieldName : $translate.instant('cloud.common.entityCode')},true);
						}
						if ( field && value !== currentItem[field]) {
							onPropertyChanged.PrcBoqFkChanged(currentItem, value, field);
						}
						return result;
					};
					service.validatePackageFk = function (entity, value, field) {
						if ( field && value !== entity[field]) {
							// when packageFk change, set the status for the prcBoqFk
							onPropertyChanged.packageFkChanged(entity, value, field);
						}
						return true;
					};
					service.validateControllingUnitFk = function (currentItem, value, field) {
						if ( field && value !== currentItem[field]) {
							onPropertyChanged.defaultChanged(currentItem, value, field);
						}
						return true;
					};
					service.asyncValidateControllingUnitFk = function (entity, value, model) {

						var defer = $q.defer();
						var result = {
							apply: true,
							valid: true
						};
						var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
						if (null === value) {
							result.valid = false;
							result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage');
							defer.resolve(result);
						}
						else {
							var ProjectFk = entity.ProjectFk || -1;
							$http.get(globals.webApiBaseUrl + 'controlling/structure/validationControllingUnit?ControllingUnitFk=' + value + '&ProjectFk=' + ProjectFk).then(function (response) {
								if (response.data) {
									result = {
										apply: true,
										valid: false,
										error: $translate.instant('basics.common.error.controllingUnitError')
									};
									platformRuntimeDataService.applyValidationResult(result, entity, model);
									defer.resolve(result);
								}
								else {
									if(entity.ControllingUnitFk !== value){
										entity.ControllingUnitFk = value;
										dataService.data.markItemAsModified(entity,dataService.data);
									}
									defer.resolve(true);
								}
							});
							asyncMarker.myPromise = defer.promise;
						}
						asyncMarker.myPromise = defer.promise.then(function (response) {
							return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, dataService);
						});
						return asyncMarker.myPromise;
					};




					service.validatePerformedFrom = function (currentItem, value, field) {
						var result = {apply: true, valid: true};
						if (currentItem.PerformedTo && value) {
							if (value > currentItem.PerformedTo) {
								result.valid = false;
								result.error = $translate.instant('cloud.common.Error_EndDateTooEarlier', {fieldName: field});
							}
						}
						if ( field && value !== currentItem[field]) {
							onPropertyChanged.defaultChanged(currentItem, value, field);
						}
						platformRuntimeDataService.applyValidationResult(result, currentItem, field);
						platformDataValidationService.finishValidation(result, currentItem, value, field, service, dataService);
						return result;
					};
					service.validatePerformedTo = function (currentItem, value, field) {
						var result = {apply: true, valid: true};
						if (currentItem.PerformedFrom && value) {
							if (currentItem.PerformedFrom > value) {
								result.valid = false;
								result.error = $translate.instant('cloud.common.Error_EndDateTooEarlier', {fieldName: field});
							}
						}
						if ( field && value !== currentItem[field]) {
							onPropertyChanged.defaultChanged(currentItem, value, field);
						}
						platformRuntimeDataService.applyValidationResult(result, currentItem, field);
						platformDataValidationService.finishValidation(result, currentItem, value, field, service, dataService);
						return result;
					};

					service.validatePrcStructureFk = function validatePrcStructureFk(entity, value, model) {
						if (model && value && value === entity[model]) { // to filter not change value
							return true;
						}
						var result = {apply: true, valid: true};
						if (angular.isUndefined(value) || value === null || value === -1) {
							result.valid = false;
							result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
						}
						// Set the new value to the PrcStructureFk field.
						entity.PrcStructureFk = value;
						if(!(entity.MdcTaxCodeFk > 0)){ // jshint ignore : line
							var structure = _.find(basicsLookupdataLookupDescriptorService.getData('PrcStructure'), {Id: value});
							if(structure){
								service.validateMdcTaxCodeFk(entity,structure.TaxCodeFk,'MdcTaxCodeFk');
							}
						}
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						platformDataValidationService.finishValidation(angular.copy(result), entity, value, model, service, dataService);
						dataService.updateRootRow();
						dataService.fireItemModified(entity);
						dataService.data.markItemAsModified(entity,dataService.data);
						$timeout(dataService.gridRefresh, 0, false);
						return result;
					};
					service.validateMdcTaxCodeFk = function validateMdcTaxCodeFk(entity, value, model) {
						if (model && value === entity[model]) { // to filter not change value
							return true;
						}
						var result = {apply: true, valid: true};
						if (angular.isUndefined(value) || value === null || value === -1) {
							result.valid = false;
							result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
						}
						// Set the new value to the PrcStructureFk field.
						entity.MdcTaxCodeFk = value;

						platformRuntimeDataService.applyValidationResult(result, entity, model);
						platformDataValidationService.finishValidation(angular.copy(result), entity, value, model, service, dataService);
						dataService.updateRootRow();
						dataService.fireItemModified(entity);
						dataService.data.markItemAsModified(entity,dataService.data);


						var procurementPesHeaderService = $injector.get('procurementPesHeaderService');
						var pesheader = procurementPesHeaderService.getSelected();

						if(pesheader) {
							procurementPesHeaderService.update().then(function () {
								var taxCodeFk = entity.MdcTaxCodeFk === null ? 0 : entity.MdcTaxCodeFk;
								$http.get(globals.webApiBaseUrl + 'procurement/common/boq/RecalculationBoQ?headerId=' + pesheader.Id + '&vatGroupFk=' + pesheader.BpdVatGroupFk + '&sourceType=pes'+'&taxCodeFk='+taxCodeFk).then(function () {

									var prcBoqMainService = $injector.get('prcBoqMainService');
									var procurementPesBoqService = $injector.get('procurementPesBoqService');

									var boqMainService = prcBoqMainService.getService(procurementPesBoqService);
									boqMainService.load();
									$timeout(dataService.gridRefresh, 0, false);
								});
							});
						}
						return result;
					};

					/**
						 * @ngdoc function
						 * @name validatorAndOnPropertyChanged
						 * @function
						 * @methodOf procurement.quote.procurementQuoteHeaderDataService
						 * @description getOnPropertyChanged
						 */
					function getOnPropertyChanged(){
						return {
							defaultChanged:function(){

							},
							conHeaderFkChanged: function (currentItem,value) {
								var conHeaderView = dataService.getLookupValue({ConHeaderFk:value}, 'ConHeaderFk:ConHeaderView');
								currentItem.PackageFk = conHeaderView.PrcPackageFk;
								onPropertyChanged.packageFkChanged(currentItem);
								if(value > 0) {
									service.validateMdcTaxCodeFk(currentItem,conHeaderView.TaxCodeFk,'MdcTaxCodeFk');
									currentItem.PrcBoqFk = null;
								}
								basicsLookupdataLookupDescriptorService.loadItemByKey('PrcPackage',currentItem.PackageFk||0).then(dataService.gridRefresh);
								$timeout(function(){
									if(dataService.updateReadOnly){
										dataService.updateReadOnly(currentItem, 'PrcBoqFk');
										dataService.updateReadOnly(currentItem, 'PackageFk'); // when the conHeaderFk is null, set the packageFk filed readonly
										dataService.updateRootRow();
									}
								});
							},
							packageFkChanged: function (currentItem, value) { // when packageFk change, set the status for the prcBoqFk
								if(!value) {
									currentItem.PrcBoqFk = null; // if the packageFk is null, clear the prcBoqFk
								}
								var packages = basicsLookupdataLookupDescriptorService.getData('PrcPackage');
								if (packages && packages[currentItem.PackageFk]) {
									var packageItem = packages[currentItem.PackageFk];
									service.validatePrcStructureFk(currentItem, packageItem.StructureFk, 'PrcStructureFk');
								}
								$timeout(function(){
									if(dataService.updateReadOnly){
										dataService.updateReadOnly(currentItem, 'PrcBoqFk');
										dataService.updateRootRow();
									}
								});
							},
							PrcBoqFkChanged: function (currentItem,value) {
								var boq = dataService.getLookupValue({PrcBoqFk:value},'PrcBoqFk:PrcBoqExtended');
								currentItem.PrcItemStatusFk = boq.PrcItemStatusFk;
							}
						};
					}
					return service;
				}
			}
		]);
})(angular);
