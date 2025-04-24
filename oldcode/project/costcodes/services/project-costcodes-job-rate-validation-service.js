/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectCostCodesJobRateValidationService
	 * @description provides validation methods for project costcodes job rate properties
	 */
	angular.module('project.costcodes').factory('projectCostCodesJobRateValidationService',
		['$http', '$injector', '$translate', 'platformDataValidationService',
			'projectCostCodesJobRateMainService','platformModuleStateService',
			'projectCommonJobService',
			function ( $http, $injector, $translate, platformDataValidationService, projectCostCodesJobRateService,platformModuleStateService,projectCommonJobService) {

				let service = {};

				service.validateRate = function validateRate(entity, value, model) {
					let res = platformDataValidationService.isMandatory(value, model);

					return platformDataValidationService.finishValidation(res, entity, value, model, service, projectCostCodesJobRateService);
				};

				service.validateFactorCosts = function validateFactorCosts(entity, value, model) {
					let res = platformDataValidationService.isMandatory(value, model);

					return platformDataValidationService.finishValidation(res, entity, value, model, service, projectCostCodesJobRateService);
				};

				service.validateFactorQuantity = function validateFactorQuantity(entity, value, model) {
					let res = platformDataValidationService.isMandatory(value, model);

					return platformDataValidationService.finishValidation(res, entity, value, model, service, projectCostCodesJobRateService);
				};

				service.validateLgmJobFk = function validateLgmJobFk(entity, value, model) {
					let items = projectCostCodesJobRateService.getList();
					let itemsByJob = _.filter(items, function(item){
						return item.LgmJobFk === value && item.ProjectCostCodeFk === entity.ProjectCostCodeFk;
					});

					return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, itemsByJob, service, projectCostCodesJobRateService);
				};

				service.asyncValidateLgmJobFk = function asyncValidateLgmJobFk(entity, value, model) {
					// asynchronous validation is only called, if the normal returns true, so we do not need to call it again.
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, projectCostCodesJobRateService);
					let selectedCostCodeItem =  $injector.get('projectCostCodesMainService').getSelected();

					let mdcCostCodeId = selectedCostCodeItem && selectedCostCodeItem.Id === entity.ProjectCostCodeFk && selectedCostCodeItem.MdcCostCodeFk ? selectedCostCodeItem.MdcCostCodeFk : 0;

					asyncMarker.myPromise =projectCommonJobService.prepareData().then(function(){
						let isReadOnly = projectCommonJobService.isJobReadOnly(value);
						if(isReadOnly){
							let resError = {apply: true,valid: false,error: $translate.instant('project.main.noUseJobError.readOnly')};
							return platformDataValidationService.finishAsyncValidation(resError, entity, value, model, asyncMarker, service, projectCostCodesJobRateService);
						}else{
							return $http.get(globals.webApiBaseUrl + 'project/costcodes/job/rate/getpricebyjob?'+'jobId='+value+'&mdcCostCodeId='+mdcCostCodeId
							).then(function (response) {
								let res = {valid:true};
								let priceEntity = response.data;
								if(priceEntity){
									entity.Rate = priceEntity.Rate;
									entity.CurrencyFk = priceEntity.CurrencyFk;
									entity.FactorCosts = priceEntity.FactorCosts;
									entity.RealFactorCosts = priceEntity.RealFactorCosts;
									entity.FactorQuantity = priceEntity.FactorQuantity;
									entity.RealFactorQuantity = priceEntity.RealFactorQuantity;
									entity.FactorHour = priceEntity.FactorHour;
									entity.DayWorkRate = priceEntity.SalesPrice;
									entity.Co2Source = priceEntity.Co2Source;
									entity.Co2Project = priceEntity.Co2Project;
									entity.Co2SourceFk = priceEntity.Co2SourceFk;
								}

								// Call the platformDataValidationService that everything is finished
								return platformDataValidationService.finishAsyncValidation(res, entity, value, model, asyncMarker, service, projectCostCodesJobRateService);
							});
						}
					});

					return asyncMarker.myPromise;
				};


				service.asyncValidateFactorCosts = asyncValidateRealFactor;

				service.asyncValidateFactorQuantity = asyncValidateRealFactor;

				function asyncValidateRealFactor(entity, value, model) {
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, projectCostCodesJobRateService);
					asyncMarker.myPromise = projectCostCodesJobRateService.calcRealFactorsNew(entity, value, model).then(function (updateCostJobRates) {
						if (updateCostJobRates && updateCostJobRates.length) {
							let parentService = projectCostCodesJobRateService.parentService();
							let parentSelected = parentService.getSelected();
							let modState = platformModuleStateService.state(parentService.getModule());
							let parentItemName = parentService.getItemName();
							let itemName = projectCostCodesJobRateService.getItemName();
							let parentState = parentService.assertPath(modState.modifications, false, parentSelected);
							if (parentState[parentItemName + 'ToSave'] && _.isArray(parentState[parentItemName + 'ToSave'])) {
								_.forEach(parentState[parentItemName + 'ToSave'], function (prjCostCodeToSave) {
									let currentCostJobRate = _.find(updateCostJobRates, {'ProjectCostCodeFk': prjCostCodeToSave.MainItemId,});
									if (currentCostJobRate) {
										if (!prjCostCodeToSave[itemName + 'ToSave']) {
											prjCostCodeToSave[itemName + 'ToSave'] = [];
										}
										let changeJobRate = projectCostCodesJobRateService.findJobRate(prjCostCodeToSave[itemName + 'ToSave'], currentCostJobRate);
										if (changeJobRate) {
											projectCostCodesJobRateService.mergeCostCodeJob(changeJobRate, currentCostJobRate);
										} else {
											prjCostCodeToSave[itemName + 'ToSave'].push(currentCostJobRate);
										}
									}
								});
							}
						}
						return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, service, projectCostCodesJobRateService);
					});
					return asyncMarker.myPromise;
				}


				return service;
			}
		]);

})(angular);
