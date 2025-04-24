/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectCostCodesValidationService
	 * @description provides validation methods for project costcodes properties
	 */
	angular.module('project.costcodes').factory('projectCostCodesValidationService',
		['$http', '$injector', 'platformDataValidationService',
			'projectCostCodesMainService',
			'hourfactorReadonlyProcessor',
			'ProjectCostCodesProcessor',

			function ($http, $injector, platformDataValidationService,
				projectCostCodesMainService,
				hourfactorReadonlyProcessor,
				ProjectCostCodesProcessor) {

				let service = {};

				service.validateCode = function (entity, value, model) {

					let items = projectCostCodesMainService.getList();
					let result = platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, service, projectCostCodesMainService);
					if(result.valid){
						if(entity && entity.__rt$data && entity.__rt$data.errors) {
							if(entity.__rt$data.errors.Code === null || entity.__rt$data.errors.Code) {
								delete entity.__rt$data.errors.Code;
								delete entity.__rt$data.errors;
							}
						}
					}
					
					$injector.get('platformRuntimeDataService').readonly(entity, [{field: 'Code', readonly: false}]);
					$injector.get('platformRuntimeDataService').applyValidationResult(result, entity, 'Code');
					return platformDataValidationService.finishValidation(result, entity, entity.Code, model, service, projectCostCodesMainService);
					
				};

				service.asyncValidateCode = function (entity, value, model) {

					// asynchronous validation is only called, if the normal returns true, so we do not need to call it again.
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, projectCostCodesMainService);

					let param = '?code=' + value + '&projectId=' + entity.ProjectFk + '&costcodeId=' + entity.Id;
					asyncMarker.myPromise = $http.get(globals.webApiBaseUrl + 'project/costcodes/isuniqcode' + param).then(function (response) {
						let res = {};

						let isUniq = response.data;
						if(!isUniq) {
							res.valid = false;
							res.apply = true;
							res.error = '...';
							res.error$tr$ = 'project.costcodes.uniqueCodeErrorMessage';							
						} else {
							res.valid = true;
						}

						if(!res.valid){
							$injector.get('platformRuntimeDataService').readonly(entity, [{field: 'Code', readonly: false}]);
						}
						
						// Call the platformDataValidationService that everything is finished
						platformDataValidationService.finishAsyncValidation(res, entity, value, model, asyncMarker, service, projectCostCodesMainService);

						// Provide result to grid / form container.
						return res;
					});

					return asyncMarker.myPromise;
				};

				service.validateRate = function validateRate(entity, value, model) {
					let res = platformDataValidationService.isMandatory(value, model);

					return platformDataValidationService.finishValidation(res, entity, value, model, service, projectCostCodesMainService);
				};

				service.validateFactorCosts = function validateFactorCosts(entity, value, model) {
					let res = platformDataValidationService.isMandatory(value, model);

					return platformDataValidationService.finishValidation(res, entity, value, model, service, projectCostCodesMainService);
				};

				service.validateFactorQuantity = function validateFactorQuantity(entity, value, model) {
					let res = platformDataValidationService.isMandatory(value, model);

					return platformDataValidationService.finishValidation(res, entity, value, model, service, projectCostCodesMainService);
				};

				service.validateIsLabour = function validateIsLabour(entity, value) {
					hourfactorReadonlyProcessor.setHourfactorReadonly(entity, !value);
					if(!value){
						entity.FactorHour = 1;
					}
					return platformDataValidationService.isMandatory(value, 'IsLabour');
				};

				service.validateIsRate = function validateIsRate(entity, value, model) {
					hourfactorReadonlyProcessor.processIsEditable(entity, value, model);
					return !platformDataValidationService.isEmptyProp(value, model);
				};

				service.validateIsEditable = function validateIsEditable(entity, value, model) {
					hourfactorReadonlyProcessor.processIsEditable(entity, value, model);
					return !platformDataValidationService.isEmptyProp(value, model);
				};

				service.validateIsChildAllowed = function validateIsChildAllowed(entity, value, model) {
					let result = !platformDataValidationService.isEmptyProp(value, model);

					if(result){
						entity.IsChildAllowed = value;

						ProjectCostCodesProcessor.processIsChildAllowed(entity, value, model);
					}

					return result;
				};
				return service;
			}
		]);

})(angular);
