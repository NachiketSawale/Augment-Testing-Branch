(function (angular) {
	'use strict';
	/* global globals,_ */

	/**
	 * @ngdoc service
	 * @name constructionSystemProjectInstanceHeaderValidationService
	 * @function
	 * @requires platformDataValidationService
	 *
	 * @description
	 *
	 * #validation service for constructionsystem project instanceheader.
	 */
	angular.module('constructionsystem.project').factory('constructionSystemProjectInstanceHeaderValidationService', [
		'$q', 'platformDataValidationService', 'constructionSystemProjectInstanceHeaderService', 'platformRuntimeDataService',
		function ($q, platformDataValidationService, dataService, platformRuntimeDataService) {
			var service = {};
			var httpRoute = globals.webApiBaseUrl + 'constructionsystem/project/instanceheader/';

			/**
			 * validate synchronously
			 */
			service.validateCode = function (entity, value, model) {
				var result = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);

				if (result.valid) {
					var filter = function (item) {
						if (item) {
							return item.ProjectFk === entity.ProjectFk;
						}
					};
					result = platformDataValidationService.isUnique(_.filter(dataService.getList(), filter), model, value, entity.Id);
				}
				platformRuntimeDataService.applyValidationResult(result, entity, model);
				return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
			};

			service.validateModelFk = function (entity, value) {
				validateModelAndEstimateHeader(entity, entity.EstimateHeaderFk, value);
			};

			service.validateEstimateHeaderFk = function (entity, value) {
				validateModelAndEstimateHeader(entity, value, entity.ModelFk);
			};

			function validateModelAndEstimateHeader(entity, estimateHeaderFk, modelFk) {
				let groupObject = {ProjectFk: entity.ProjectFk, EstimateHeaderFk: estimateHeaderFk};
				let groupResult = true;
				if (modelFk) {
					groupObject.ModelFk = modelFk;
					groupResult = platformDataValidationService.isGroupUnique(dataService.getList(), groupObject,
						entity.Id, 'constructionsystem.project.modelEstimateUniqueError'
					);
				}

				// -1 means estimate header is empty.
				if (estimateHeaderFk < 0) {
					estimateHeaderFk = null;
				}

				var estimateHeaderResult = platformDataValidationService.validateMandatory(entity, estimateHeaderFk, 'EstimateHeaderFk', service, dataService);
				if (modelFk) {
					platformRuntimeDataService.applyValidationResult(groupResult, entity, 'ModelFk');
					platformDataValidationService.finishValidation(groupResult, entity, modelFk, 'ModelFk', service, dataService);
				}

				if (estimateHeaderResult.valid) {
					platformRuntimeDataService.applyValidationResult(angular.copy(groupResult), entity, 'EstimateHeaderFk');
					platformDataValidationService.finishValidation(angular.copy(groupResult), entity, estimateHeaderFk, 'EstimateHeaderFk', service, dataService);
				} else {
					platformRuntimeDataService.applyValidationResult(estimateHeaderResult, entity, 'EstimateHeaderFk');
					platformDataValidationService.finishValidation(estimateHeaderResult, entity, estimateHeaderFk, 'EstimateHeaderFk', service, dataService);
				}
			}

			/**
			 * validate asynchronously
			 */
			service.asyncValidateCode = function (entity, value, model) {
				var defer = $q.defer();
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, model, value, dataService);
				asyncMarker.myPromise = defer.promise;

				platformDataValidationService.isAsyncGroupUnique(httpRoute + 'codeunique',
					{
						code: value,
						projectId: entity.ProjectFk
					},
					entity.Id, 'constructionsystem.project.codeUniqueError'
				).then(function (result) {
					defer.resolve(platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService));
				});

				return defer.promise;
			};

			service.asyncValidateModelFk = function (entity, value, model) {
				var defer = $q.defer();
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, model, value, dataService);
				asyncMarker.myPromise = defer.promise;
				let param = {projectId: entity.ProjectFk, estimateHeaderId: entity.EstimateHeaderFk};
				if (value) {
					param.modelId = value;
					platformDataValidationService.isAsyncGroupUnique(httpRoute + 'modelestimateunique', param, entity.Id, 'constructionsystem.project.modelEstimateUniqueError'
					).then(function (result) {
						defer.resolve(platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService));
					});
				} else {
					defer.resolve(platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, service, dataService));
				}
				return defer.promise;
			};

			service.asyncValidateEstimateHeaderFk = function (entity, value, model) {
				var defer = $q.defer();
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, model, value, dataService);
				asyncMarker.myPromise = defer.promise;
				let param = {projectId: entity.ProjectFk, estimateHeaderId: value};
				if (entity.ModelFk) {
					param.modelId = entity.ModelFk;
					platformDataValidationService.isAsyncGroupUnique(httpRoute + 'modelestimateunique', param, entity.Id, 'constructionsystem.project.modelEstimateUniqueError'
					).then(function (result) {
						defer.resolve(platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService));
					});
				} else {
					defer.resolve(platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, service, dataService));
				}
				return defer.promise;
			};

			service.validateIsIncremental = function (entity, value) {
				platformRuntimeDataService.readonly(entity, [
					{field: 'ModelOldFk', readonly: !value}
				]);
				var result = {
					valid: true,
					apply: true,
					error: 'Estimate and old model combination is not existed!'
				};
				if (value === true) {
					var list = dataService.getList();
					var item = _.find(list, {
						EstimateHeaderFk: entity.EstimateHeaderFk,
						ModelFk: entity.ModelOldFk,
						IsIncremental: false
					});
					result.valid = (item !== null && item !== undefined);
				}
				platformRuntimeDataService.applyValidationResult(result, entity, 'ModelOldFk');
				return platformDataValidationService.finishValidation(result, entity, value, 'ModelOldFk', service, dataService);
			};

			service.validateModelOldFk = function (entity, value) {
				var list = dataService.getList();
				var item = _.find(list, {
					EstimateHeaderFk: entity.EstimateHeaderFk,
					ModelFk: value,
					IsIncremental: false
				});
				var result = {
					valid: (item !== null && item !== undefined),
					apply: true,
					error: 'Estimate and old model combination is not existed!'
				};
				platformRuntimeDataService.applyValidationResult(result, entity, 'ModelOldFk');
				return platformDataValidationService.finishValidation(result, entity, value, 'ModelOldFk', service, dataService);
			};

			return service;
		}
	]);
})(angular);
