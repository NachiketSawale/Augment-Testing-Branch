(angular => {
	'use strict';
	/* global _ */
	const moduleName = 'productionplanning.ppscostcodes';

	angular.module(moduleName).factory('ppsCostCodesValidationService', ppsCostCodesValidationService);

	ppsCostCodesValidationService.$inject = ['$q', 'platformDataValidationService', 'platformRuntimeDataService', 'ppsCostCodesDataService', '$translate'];

	function ppsCostCodesValidationService($q, platformDataValidationService, platformRuntimeDataService, ppsCostCodesDataService, $translate) {
		const service = {};

		let isChangingFieldNewTksTimeSymbolFkFromValidValueToNull = (entity, value) => (entity.PpsCostCode && !_.isNil(entity.PpsCostCode.NewTksTimeSymbolFk)) && _.isNil(value);

		function resetPpsCostCode(entity) {
			let ppsCostCodeObj = entity.PpsCostCode;
			ppsCostCodeObj.TksTimeSymbolFk = 0; // for passing .net Core Validator
			ppsCostCodeObj.UseToCreateComponents = false;
			ppsCostCodeObj.UseToUpdatePhaseReq = false;
			ppsCostCodeObj.ShowAsSlotOnProduct = false;
			ppsCostCodeObj.CommentText = null;
			ppsCostCodeObj.UserDefined1 = null;
			ppsCostCodeObj.UserDefined2 = null;
			ppsCostCodeObj.UserDefined3 = null;
			ppsCostCodeObj.UserDefined4 = null;
			ppsCostCodeObj.UserDefined5 = null;

			removeAllErrors(entity, service); // remove all validation errors of mandatory fields(TksTimeSymbolFk/UseToCreateComponents/...) of entity.PpsCostCode
		}

		function removeAllErrors(entity) {
			const fields = ['PpsCostCode.NewTksTimeSymbolFk',
				'PpsCostCode.UseToCreateComponents',
				'PpsCostCode.UseToUpdatePhaseReq',
				'PpsCostCode.ShowAsSlotOnProduct',
			];
			fields.forEach(field => {
				platformDataValidationService.removeFromErrorList(entity, field, service, ppsCostCodesDataService);
				const result = true;
				platformRuntimeDataService.applyValidationResult(result, entity, field); // remove UI error hint
			});
			ppsCostCodesDataService.gridRefresh();
		}

		service.validateNewTksTimeSymbolFk = function (entity, value, model) {
			if (isChangingFieldNewTksTimeSymbolFkFromValidValueToNull(entity, value)) {
				resetPpsCostCode(entity);
			}
			else {
				let itemList = ppsCostCodesDataService.getList();
				let result = platformDataValidationService.isUniqueAndMandatory(itemList, model, value, entity.Id, {object: $translate.instant('productionplanning.ppscostcodes.tksTimeSymbolFk')});
				platformDataValidationService.finishValidation(result,entity, value, model, service, ppsCostCodesDataService);
				return result;
			}
		};

		// for validation wizard dialog
		service.validatePpsCostCode$NewTksTimeSymbolFk = service.validateNewTksTimeSymbolFk;

		// remark: there is strange situation(UI refreshing&triggering modification problems) of control of lookup field NewTksTimeSymbolFk on grid when adding async validation method for field NewTksTimeSymbolFk, so here we don't add a corresponding async validation method, and move some original business logic(like creating new PpsCostCode with unique ID) in server side when saving

		/*
		service.validateTksTimeSymbolFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, ppsCostCodesDataService);
		};

		service.asyncValidateTksTimeSymbolFk = function (entity, value, model) {
			const asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, ppsCostCodesDataService);
			const deferred = $q.defer();

			ppsCostCodesDataService.getOrCreatePpsCostCode(entity).then(() => {
				const result = platformDataValidationService.isMandatory(value, model);
				deferred.resolve(result);
			});

			asyncMarker.myPromise = deferred.promise.then(response => {
				return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, ppsCostCodesDataService);
			});

			return asyncMarker.myPromise;
		};

		// for validation wizard
		service.validatePpsCostCode$TksTimeSymbolFk = service.validateTksTimeSymbolFk;
		service.asyncValidatePpsCostCode$TksTimeSymbolFk = service.asyncValidateTksTimeSymbolFk;
		*/

		return service;
	}
})(angular);