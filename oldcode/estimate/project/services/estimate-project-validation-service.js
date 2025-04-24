/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals, _ */
	'use strict';

	let moduleName = 'estimate.project';

	/**
	 * @ngdoc service
	 * @name estimateProjectValidationService
	 * @description provides validation methods for estimate project entities
	 */
	angular.module(moduleName).factory('estimateProjectValidationService', ['$injector','$q', 'platformDataValidationService','platformGridAPI',
		'platformLayoutByDataService', 'platformRuntimeDataService','$http','estimateProjectService','$translate',

		function ($injector,$q, platformDataValidationService, platformGridAPI, platformLayoutByDataService, platformRuntimeDataService,$http,estimateProjectService,$translate) {

			let service = {};


			service.asyncValidateEstHeader$Code = function(entity, value, model){
				let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, estimateProjectService);

				let isFilterActive= estimateProjectService.getFilterStatus();
				let uiEstHeaders = _.map(estimateProjectService.getList(), 'EstHeader');
				let allEstHeaderOfPrj = [];

				let grid = platformGridAPI.grids.element('id','ce87d35899f34e809cad2930093d86b5');
				let formLayout = platformLayoutByDataService.provideLayoutFor(estimateProjectService);
				let result = {apply: true, valid: true};

				let defer = $q.defer();
				defer.resolve(true);
				asyncMarker.myPromise = defer.promise;

				if(isFilterActive) {

					asyncMarker.myPromise = estimateProjectService.getAllEstHeaderByProject().then (function (responseData) {

						allEstHeaderOfPrj = isFilterActive ? responseData.concat (uiEstHeaders) : allEstHeaderOfPrj;
						allEstHeaderOfPrj = _.uniqBy (allEstHeaderOfPrj, 'Id');

						let oldEstHeaderCodeNavigator = {};
						result = platformDataValidationService.validateMandatoryUniqEntity(entity, value, 'Code', allEstHeaderOfPrj, service, estimateProjectService);
						if(grid){
							if(result === true || result && result.valid)
							{
								_.each(formLayout.rows, function(row){
									if(row.model === 'EstHeader.Code'){
										row.navigator = oldEstHeaderCodeNavigator;
									}
								});
							}
							else{
								_.each(formLayout.rows, function(row){
									if(row.model === 'EstHeader.Code'){
										oldEstHeaderCodeNavigator = row.navigator;
										row.navigator =  null;
									}
								});
							}
						}
						if(result === true || result && result.valid) {
							result = platformDataValidationService.createSuccessObject();
						}else {
							result = platformDataValidationService.createErrorObject('cloud.common.uniqueValueErrorMessage',{object: 'Code'});
						}
						return $q.when(result);
					});
				}
				return asyncMarker.myPromise;

			};

			service.validateEstHeader$Code = function (entity, value) {
				let items = estimateProjectService.getList();
				let oldEstHeaderCodeNavigator = {};
				let result = platformDataValidationService.validateMandatoryUniqEntity(entity, value, 'EstHeader.Code', items, service, estimateProjectService);

				// here make this estHeader item's go to estimate navigator button disable
				// use the controller's uuid to get grid, and change the navigator disabled or not
				let grid = platformGridAPI.grids.element('id','ce87d35899f34e809cad2930093d86b5');
				// wait a moment, didn't find how to make validation dialog popup navigator diaabled
				let formLayout = platformLayoutByDataService.provideLayoutFor(estimateProjectService);
				if(grid){
					if(result === true || result && result.valid)
					{
						_.each(formLayout.rows, function(row){
							if(row.model === 'EstHeader.Code'){
								row.navigator = oldEstHeaderCodeNavigator;
							}
						});
					}
					else{
						_.each(formLayout.rows, function(row){
							if(row.model === 'EstHeader.Code'){
								oldEstHeaderCodeNavigator = row.navigator;
								row.navigator =  null;
								// row.navigator = oldEstHeaderCodeNavigator;
							}
						});
					}
				}
				if(result === true || result && result.valid) {
					result = platformDataValidationService.createSuccessObject();
				}else {
					result = platformDataValidationService.createErrorObject('cloud.common.uniqueValueErrorMessage',{object: 'Code'});
				}
				return result;
			};

			service.validateEstHeader$LgmJobFk = function (entity, value, model) {
				let result = platformDataValidationService.validateMandatory(entity, value, model, service, estimateProjectService);
				if(entity.Version === 1 && entity.EstHeader.Version === 0 && entity.PrjEstimate.Version === 0 && entity.EstHeader.LgmJobFk !== null){
					$injector.get('platformDataValidationService').removeFromErrorList(entity, model, service, estimateProjectService);
					result.valid = true;
				}

				return platformRuntimeDataService.applyValidationResult(result, entity, model);
			};

			service.validateEstHeader$EstTypeFk = function(entity){
				entity.oldEstTypeFk =  entity.EstHeader.EstTypeFk;
				return true;
			};

			service.asyncValidateEstHeader$EstTypeFk = function (entity,value, model){

				let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, estimateProjectService);

				let postData = {
					PrjProjectFk: entity.PrjEstimate ? entity.PrjEstimate.PrjProjectFk : 0,
					EstTypeFk: value
				};
				let result = {apply: true, valid: true};

				asyncMarker.myPromise = $http.post (globals.webApiBaseUrl + 'estimate/project/getIsGCEstHeaderOfProject', postData)
					.then (function (response) {
						if (response && response.data) {
							let gccEstHeader = response.data.estHeaderEntity;
							if (response.data.IsGCOrder) {
								result.valid = false;
								result.error =  $translate.instant ('estimate.project.estTypeFkWarning');
							} else if (gccEstHeader && (gccEstHeader.Id !== entity.Id && entity.EstTypeFk === gccEstHeader.EstTypeFk)) {
								result.valid = false;
								result.error =  $translate.instant ('estimate.project.estTypeFkInfo');
							} else {
								entity.IsGCOrder = entity.IsGCOrder = response.data.IsGCOrder;
								estimateProjectService.updateToolItems.fire ();
							}
						}
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, estimateProjectService);
						return $q.when(result);
					});

				return asyncMarker.myPromise;
			};

			service.validateEstimateItemsUniqueCode = function validateEstimateItemsUniqueCode(estimateItemsToDelete){

				let model = 'EstHeader.Code';
				let estimateItemsWithErrors = [];

				_.forEach(estimateProjectService.getList(), function(item){ // platformRuntimeDataService.hasError(item, model) &&
					if (_.map(estimateItemsToDelete, 'EstHeader.Id').indexOf(item.EstHeader.Id) !== -1){
						if (_.map(estimateItemsWithErrors, model).indexOf(item.EstHeader[model]) === -1){
							estimateItemsWithErrors.push(item);
						}
					}
				});

				setTimeout(function(){
					estimateProjectService.markEntitiesAsModified(estimateItemsWithErrors);
				}, 50);

				_.forEach(estimateItemsWithErrors, function(item){
					platformDataValidationService.finishValidation(true, item, item[model], model, service, estimateProjectService);
					platformRuntimeDataService.applyValidationResult(true, item, model);
				});
			};

			return service;
		}

	]);

})();

