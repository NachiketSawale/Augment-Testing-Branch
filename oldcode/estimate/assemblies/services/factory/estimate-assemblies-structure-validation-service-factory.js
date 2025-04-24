/**
 * Created by lnt on 26.08.2021.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals */

	let moduleName = 'estimate.assemblies';

	/**
	 * @ngdoc service
	 * @name estimateAssembliesAssemblyValidationService
	 * @description provides validation methods for assembly entities
	 */
	angular.module(moduleName).factory('estimateAssembliesStructureValidationServiceFactory', ['$http', '$q', '$injector', 'platformRuntimeDataService','estimateAssembliesRuleService',
		'estimateAssembliesRuleUpdateService', '_', 'platformDataValidationService', 'estimateParamUpdateService',
		function ($http, $q, $injector, platformRuntimeDataService, estimateRuleService,
			estimateAssembliesRuleUpdateService, _, platformDataValidationService, estimateParamUpdateService) {

			let factoryService = {};

			factoryService.createAssemblyStructureValidationService = function (assemblyStructureService, estimateAssembliesService) {
				let service = {};
				let mainItemName = 'EstAssemblyCat';

				service.validateCode = function validateCode(entity, value, field) {
					return platformDataValidationService.isMandatory(value, field);
				};

				service.asyncValidateCode = function asyncValidateCode(entity, value, field) {
					// asynchronous validation is only called, if the normal returns true, so we do not need to call it again.
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, assemblyStructureService);
					// Now the data service knows there is an outstanding asynchronous request.
					let postData = {
						Id: entity.Id,
						LineItemContextFk: entity.LineItemContextFk,
						Code: value,
						EstAssemblyCatFk: entity.EstAssemblyCatFk
					};// Call data prepared

					asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'estimate/assemblies/structure/isuniquecode', postData).then(function (response) {
						// Interprete result.
						let res = {};
						if (response.data) {
							res.valid = true;
						} else {
							res.valid = false;
							res.apply = true;
							res.error = '...';
							res.error$tr$ = 'estimate.assemblies.errors.uniqCode';
						}

						// Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
						platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, assemblyStructureService);

						// Provide result to grid / form container.
						return res;
					});

					return asyncMarker.myPromise;
				};

				// service.validateEstAssemblyTypeFk = function validateEstAssemblyTypeFk(entity, value, field) {
				// return platformDataValidationService.isMandatory(value, field);
				// };

				// validate Assembly Type
				service.asyncValidateEstAssemblyTypeFk = function asyncValidateEstAssemblyTypeFk(entity, value, field) {
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, field, value, assemblyStructureService);

					let assemblyTypeChanger = entity.EstAssemblyTypeFk + '-' + value;// old value - new value
					if (entity.EstAssemblyTypeFk !== value) {
						// let estimateAssembliesService = $injector.get('estimateAssembliesService');
						$injector.get('estimateMainResourceTypeLookupService').resetAssemblyCategoryId();
						estimateAssembliesService.setAssemblyCategory({Id: entity.Id, EstAssemblyTypeFk: value});
					}

					let postData = {
						Id: entity.Id,
						LineItemContextFk: entity.LineItemContextFk,
						AssemblyTypeChanger: assemblyTypeChanger,
						NewTypeId: value,
						IsHasError: platformRuntimeDataService.hasError(entity, field) ? true : false
					};// Call data prepared
					asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'estimate/assemblies/structure/isassemblytypechanged', postData).then(function (response) {
						// Interprete result.
						let res = {};
						if (response.data) {
							res.valid = true;
							entity.EstAssemblyTypeFk = value;
						} else {
							res.valid = false;
							res.apply = true;
							res.error = '...';
							res.error$tr$ = 'estimate.assemblies.errors.assemblyTypeAssigned';
							// todo:pop up a error message
						}

						// Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
						platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, assemblyStructureService);

						// Provide result to grid / form container.
						return res;
					});

					return asyncMarker.myPromise;
				};


				// do not apply the value by the lookup editor, but apply it manually
				service.validateRule = function (entities/* , value, field */) {

					let validateRs = {
						apply: false, // do not apply the value by the lookup editor, but apply it manually
						valid: true,
						error: ''
					};

					let entity = entities;
					if (_.isArray(entities)) {
						entity = entities[0];
					}

					let ruleIds = entity.Rule;

					let creationData = {
						estHeaderFk: entity.EstHeaderFk,
						ruleIds: ruleIds,
						mainItemName: mainItemName,
						mainItemId: entity.Id
					};

					$http.post(globals.webApiBaseUrl + 'estimate/assemblies/getFormulaParameterEntities', creationData).then(
						function (response) {
							let result = {};
							let containerData = estimateAssembliesService.getContainerData();
							result.FormulaParameterEntities = response.data;
							if (result.FormulaParameterEntities && result.FormulaParameterEntities.length) {
								result.containerData = containerData;
								result.EstHeaderId = entity.EstHeaderFk;
								result.entity = entity;
								result.MainItemName = mainItemName;
								result.EstLeadingStuctureContext = estimateParamUpdateService.getLeadingStructureContext({}, entity, 'estimateMainAssembliesCategoryService');
								let estimateAssembliesCopyParameterService = $injector.get('estimateAssembliesCopyParameterService');
								estimateAssembliesCopyParameterService.init(entities, result.FormulaParameterEntities, mainItemName);
								let paramDialogServiceNew = $injector.get('estimateAssembliesDetailsParamDialogService');
								paramDialogServiceNew.showDialog(result, estimateAssembliesService.getDetailsParamReminder());
							}
						}
					);

					return validateRs;
				};

				return service;
			};

			return factoryService;
		}

	]);

})();
