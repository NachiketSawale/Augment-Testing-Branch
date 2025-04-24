/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */

	'use strict';
	let moduleName = 'basics.controllingcostcodes';

	angular.module(moduleName).factory('basicsControllingCostCodesAccountValidationService', ['_','$http','$translate','platformModalService','platformDataValidationService','platformRuntimeDataService',
		'basicsControllingCostCodesAccountService',
		function (_,$http,$translate,platformModalService,platformDataValidationService,platformRuntimeDataService,basicsControllingCostCodesAccountService) {
			let service = {};

			service.validateBasAccountFk = function (entity, value, model) {
				let res= platformDataValidationService.validateMandatory(entity, value, model, service, basicsControllingCostCodesAccountService);
				if(res && res.valid){
					platformRuntimeDataService.applyValidationResult(res, entity, model);
					platformDataValidationService.finishAsyncValidation(res, entity, entity.BasAccountFk, 'BasAccountFk', null, service, basicsControllingCostCodesAccountService);
				}
				return res;
			};

			service.asyncValidateBasAccountFk = function asyncValidateBasAccountFk(entity, value, field) {
				let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, basicsControllingCostCodesAccountService);
				let postData = {MdcContextFk: entity.MdcContextFk, MdcLedgerContextFk: entity.MdcLedgerContextFk,
					MdcContrCostCodeFk: entity.MdcContrCostCodeFk,BasAccountFk: value };

				asyncMarker.myPromise = $http.post(globals.webApiBaseUrl +'basics/controllingcostcodes/account/isuniqueaccount', postData)
					.then(function (response) {
						let res = {};
						if (response.data.length <= 0) {
							res = {apply: true, valid: true, error: ''};
						} else {
							res.valid = false;
							res.apply = true;
							res.error = 'basics.controllingcostcodes.errors.unique';
							res.error$tr$ = 'basics.controllingcostcodes.errors.unique';

							platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, basicsControllingCostCodesAccountService);
							let msg = $translate.instant('basics.controllingcostcodes.errors.uniqAccount', { code: response.data });

							platformModalService.showYesNoDialog(msg, 'Warning', 'yes').then(function (result) {
								if (result.yes) {
									res = {apply: true, valid: true, error: ''};

									platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, basicsControllingCostCodesAccountService);
									return res;
								}
							});
							// return;
						}
					});

				return asyncMarker.myPromise;
			};

			return service;

		}]);
})(angular);