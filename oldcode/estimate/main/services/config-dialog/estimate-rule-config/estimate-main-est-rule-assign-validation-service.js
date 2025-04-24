/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _ */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainEstRuleAssignValidationService',['$translate','platformDataValidationService',
		'estimateMainRuleConfigDetailDataService','estimateMainDialogDataService','platformRuntimeDataService',
		function ($translate, platformDataValidationService,estimateMainStructureConfigDetailDataService,estimateMainDialogDataService,platformRuntimeDataService) {
			let service = {};

			function checkHasErr() {
				let data = estimateMainStructureConfigDetailDataService.getList();
				// let allAtrs = ['EstStructureFk','EstQuantityRelFk','Sorting'];
				let hashEstStructureFk = {},
					hashEstQuantityRelFkSorting = {};
				let hasErr = true;

				hasErr = data.some(function (item) {
					if(!hashEstStructureFk[item.EstStructureFk + (item.Code || '')]){
						hashEstStructureFk[item.EstStructureFk + (item.Code || '')] = true;
					}else{
						return true;// has record the same value.
					}

					if(item.EstQuantityRelFk === 1){
						if(!hashEstQuantityRelFkSorting[item.Sorting]){
							hashEstQuantityRelFkSorting[item.Sorting] = true;
						}else{
							return true;
						}
					}

					if(item.EstStructureFk === 0){
						return true;
					}
				});

				estimateMainStructureConfigDetailDataService.hasEstStructureErr.fire(!hasErr);

			}

			function validateEstStructureFk(entity, value, model) {
				entity[model] = value;// must do it,the check need the data has been change
				let configDetailList = estimateMainStructureConfigDetailDataService.getList();
				let validateResult = platformDataValidationService.createSuccessObject();
				let errList = [];

				_.filter(configDetailList,function (item) {
					if(platformRuntimeDataService.hasError(item, model)){
						errList.push(item);
					}
				});

				let resSubItemUnique = isUnique(value + (entity.Code || ''));

				let resSubItemFinish = platformDataValidationService.finishValidation(resSubItemUnique, entity, entity.EstStructureFk, model, service, estimateMainStructureConfigDetailDataService);
				if(resSubItemFinish.valid === false){
					if (entity.EstStructureFk === 0){
						resSubItemFinish.error$tr$ = 'estimate.main.estStructureFkEmptyErrMsg';
					}
					else{
						resSubItemFinish.error$tr$param$ = { object: 'Structure'};
					}
				}
				platformRuntimeDataService.applyValidationResult(resSubItemFinish, entity, model);
				validateResult = resSubItemFinish;


				angular.forEach(errList, function (subItem) {
					let resSubItemUnique = isUnique(subItem.EstStructureFk+ (subItem.Code || ''));
					let resSubItemFinish = platformDataValidationService.finishValidation(resSubItemUnique, subItem, subItem.EstStructureFk, model, service, estimateMainStructureConfigDetailDataService);
					if(resSubItemFinish.valid === false){
						if (subItem.EstStructureFk === 0){
							resSubItemFinish.error$tr$ = 'estimate.main.estStructureFkEmptyErrMsg';
						}
						else{
							resSubItemFinish.error$tr$param$ = { object: 'Structure'};
						}
					}
					platformRuntimeDataService.applyValidationResult(resSubItemFinish, subItem, model);
				});

				checkHasErr();

				let currentIsCostGroup = estimateMainStructureConfigDetailDataService.selectedCostGroup();
				if(!value || !currentIsCostGroup){
					entity.Code = '';
				}

				if(validateResult.valid && currentIsCostGroup && !entity.Code){
					platformRuntimeDataService.applyValidationResult({valid:false, apply: true, error$tr$: 'cloud.common.emptyOrNullValueErrorMessage'}, entity, 'Code');
				}else{
					platformRuntimeDataService.applyValidationResult(true, entity, 'Code');
				}

				estimateMainStructureConfigDetailDataService.setCodeColReadOnly(entity);

				return validateResult;

				function isUnique(checkValue) {
					let res = {apply: true, valid: true, error: ''};
					if (!value) {
						res = {
							apply: true,
							valid: false,
							error: '...',
							error$tr$: 'cloud.common.emptyOrNullValueErrorMessage',
							error$tr$param$: {object: model.toLowerCase()}
						};
					}else{
						let repeatOne = _.find(configDetailList, function (item) {
							return (item.EstStructureFk + (item.Code || '')) === checkValue && entity.Id !== item.Id;
						});
						if(repeatOne){
							res = {
								apply: true,
								valid: false,
								error: '...',
								error$tr$: 'cloud.common.uniqueValueErrorMessage',
								error$tr$param$: {object: model.toLowerCase()}
							};
						}
					}
					return res;
				}
			}

			function validateCode(entity, value, model) {
				entity[model] = value;
				return validateEstStructureFk(entity, entity.EstStructureFk, 'EstStructureFk');
			}

			function validateEstQuantityRelFk(entity, value, model) {
				let fromStructureList = [],
					fromStructureErrList = [];
				let res = platformDataValidationService.createSuccessObject();
				entity[model] = value;
				let configDetailList = estimateMainStructureConfigDetailDataService.getList();

				if(entity[model] !== 1)
				{
					platformDataValidationService.finishValidation(res, entity, entity[model], model, service, estimateMainStructureConfigDetailDataService);
					let resSubItemFinish = platformDataValidationService.finishValidation(res, entity, entity.Sorting, 'Sorting', service, estimateMainStructureConfigDetailDataService);
					platformRuntimeDataService.applyValidationResult(resSubItemFinish, entity, model);
					platformRuntimeDataService.applyValidationResult(resSubItemFinish, entity, 'Sorting');

				}

				_.filter(configDetailList, function (item) {
					if (item.EstQuantityRelFk === 1){
						fromStructureList.push(item);
						if(platformRuntimeDataService.hasError(item, model)){
							fromStructureErrList.push(item);
						}
					}
				});

				if(entity[model] === 1)
				{
					let resSubItemUnique = platformDataValidationService.isValueUnique(fromStructureList, 'Sorting', entity.Sorting, entity.Id);
					res = platformDataValidationService.finishValidation(resSubItemUnique, entity, entity.Sorting, 'Sorting', service, estimateMainStructureConfigDetailDataService);
					if(res.error$tr$){
						res.error$tr$ = 'estimate.main.estStructureErrMsg';
					}

					platformRuntimeDataService.applyValidationResult(res, entity, 'Sorting');
					platformRuntimeDataService.applyValidationResult(res, entity, 'EstQuantityRelFk');
				}

				angular.forEach(fromStructureErrList, function (subItem) {
					let resSubItemUnique = platformDataValidationService.isValueUnique(fromStructureList, 'Sorting', subItem.Sorting, subItem.Id);
					let resSubItemFinish = platformDataValidationService.finishValidation(resSubItemUnique, subItem, subItem.Sorting, 'Sorting', service, estimateMainStructureConfigDetailDataService);
					platformDataValidationService.finishValidation(resSubItemUnique, subItem, subItem[model], model, service, estimateMainStructureConfigDetailDataService);
					if(resSubItemFinish.error$tr$){
						resSubItemFinish.error$tr$ = 'estimate.main.estStructureErrMsg';
					}

					platformRuntimeDataService.applyValidationResult(resSubItemFinish, subItem, 'Sorting');
					platformRuntimeDataService.applyValidationResult(resSubItemFinish, subItem, model);

				});

				checkHasErr();

				return res;
			}

			function validateSorting(entity, value, model){
				let fromStructureList = [],
					fromStructureErrList = [];
				let res = platformDataValidationService.createSuccessObject();
				entity[model] = value;
				let configDetailList = estimateMainStructureConfigDetailDataService.getList();

				if(entity.EstQuantityRelFk !== 1){
					return res;
				}


				_.filter(configDetailList, function (item) {
					if (item.EstQuantityRelFk === 1){
						fromStructureList.push(item);
						if(platformRuntimeDataService.hasError(item, model)){
							fromStructureErrList.push(item);
						}
					}
				});

				let resSubItemUnique = platformDataValidationService.isValueUnique(fromStructureList, model, entity[model], entity.Id);
				res = platformDataValidationService.finishValidation(resSubItemUnique, entity, entity[model], model, service, estimateMainStructureConfigDetailDataService);
				if(res.error$tr$){
					res.error$tr$ = 'estimate.main.estStructureErrMsg';
				}

				platformRuntimeDataService.applyValidationResult(res, entity, model);
				platformRuntimeDataService.applyValidationResult(res, entity, 'EstQuantityRelFk');

				angular.forEach(fromStructureErrList, function (subItem) {
					let resSubItemUnique = platformDataValidationService.isValueUnique(fromStructureList, model, subItem[model], subItem.Id);
					let resSubItemFinish = platformDataValidationService.finishValidation(resSubItemUnique, subItem, subItem[model], model, service, estimateMainStructureConfigDetailDataService);
					resSubItemFinish = platformDataValidationService.finishValidation(resSubItemUnique, subItem, subItem.EstQuantityRelFk, 'EstQuantityRelFk', service, estimateMainStructureConfigDetailDataService);
					if(resSubItemFinish.error$tr$){
						resSubItemFinish.error$tr$ = 'estimate.main.estStructureErrMsg';
					}

					platformRuntimeDataService.applyValidationResult(resSubItemFinish, subItem, model);
					platformRuntimeDataService.applyValidationResult(resSubItemFinish, subItem, 'EstQuantityRelFk');
				});

				checkHasErr();

				return res;
			}

			service.validateEstQuantityRelFk = validateEstQuantityRelFk;

			service.validateSorting = validateSorting;

			service.validateEstStructureFk = validateEstStructureFk;

			service.validateCode = validateCode;

			return service;

		}]);
})(angular);
