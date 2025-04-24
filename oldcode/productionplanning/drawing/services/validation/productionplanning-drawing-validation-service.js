/**
 * Created by zov on 08/04/2019.
 */
(function () {
	'use strict';
	/* global angular, globals, _ */

	var moduleName = 'productionplanning.drawing';
	angular.module(moduleName).service('productionplanningDrawingValidationService', [
		'platformValidationServiceFactory',
		'productionplanningDrawingMainService',
		'platformDataValidationService',
		'platformModuleStateService',
		'platformRuntimeDataService',
		'$q',
		'$http',
		function (platformValidationServiceFactory,
				  dataService,
				  platformDataValidationService,
				  platformModuleStateService,
				  platformRuntimeDataService,
				  $q,
				  $http) {
			var self = this;

			function clearError(result, entity, model) {
				// clear error if validation passes
				if ((result === true || result.valid === true) && entity.__rt$data.errors) {
					delete entity.__rt$data.errors[model];
					let modState = platformModuleStateService.state(dataService.getModule ? dataService.getModule() : dataService.getService().getModule());
					if (modState.validation && modState.validation.issues) {
						_.remove(modState.validation.issues, function (error) {
							if (_.has(error, 'model') && error.model === model) {
								return true;
							}
						});
					}
				}
			}

			platformValidationServiceFactory.addValidationServiceInterface({
					typeName: 'EngDrawingDto',
					moduleSubModule: 'ProductionPlanning.Drawing'
				}, {
					mandatory: ['Code', 'EngDrawingStatusFk', 'EngDrawingTypeFk', 'PrjProjectFk', 'LgmJobFk', 'BasClerkFk'],
					// uniques: ['Code'], // validate in server side #129871
					periods: [
						{from: 'StartDate', to: 'EndDate'}
					]
				},
				self,
				dataService);

			self.validateCode = (entity, value, field) => {
				if (_.isNil(entity.PrjProjectFk)) {
					var result = platformDataValidationService.createErrorObject('productionplanning.drawing.errorProjectFieldEmpty', 'prjprojectfk');
					return platformDataValidationService.finishValidation(result, entity, value, field, self, dataService);
				}
				return platformDataValidationService.validateMandatory(entity, value, field, self, dataService);
			};

			self.asyncValidateCode = function asyncValidateCode(entity, value, field) {
				//asynchronous validation is only called, if the normal returns true, so we do not need to call it again.
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, dataService);
				asyncMarker.myPromise = $http.get(`${globals.webApiBaseUrl}productionplanning/drawing/isunique?id=${entity.Id}&&code=${value}&&projectId=${entity.PrjProjectFk || -1}`).then(function (response) {
					let res = {};
					if (response.data) {
						res = {apply: true, valid: true, error: ''};
						if(entity.__rt$data && entity.__rt$data.errors && entity.__rt$data.errors.hasOwnProperty('Code')){
							delete entity.__rt$data.errors.Code;
						}
					} else {
						res.valid = false;
						res.apply = true;
						res.error = 'The Code should be unique';
						res.error$tr$ = 'productionplanning.item.validation.errors.uniqCode';
					}
					return platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, self, dataService);
				});

				return asyncMarker.myPromise;
			};

			self.asyncValidateEngDrawingTypeFk = function asyncValidateEngDrawingTypeFk(entity, value, field) {
				let getCode = (entity, value) => {
					if (!_.isEmpty(entity.Code)) { // if drawing's Code is not empty, don't trigger regenerating code when changing drawingType #139291
						let defer = $q.defer();
						defer.resolve();
						return defer.promise;
					}
					return dataService.getCode(value, entity.LgmJobFk);
				};
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, dataService);
				asyncMarker.myPromise = getCode(entity, value).then(function (response) {
					var result = {
						valid: true,
						apply: true
					};
					if (angular.isObject(response)) {
						entity.Code = response.data;
						// trigger validating Code
						let codeValidationResult = platformDataValidationService.validateMandatory(entity, entity.Code, 'Code', self, dataService);
						clearError(codeValidationResult, entity, 'Code'); // clear error if mandatory validation of Code passes
						platformRuntimeDataService.applyValidationResult(codeValidationResult, entity, 'Code');
					}
					return platformDataValidationService.finishAsyncValidation(result, entity, value, field, asyncMarker, self, dataService);
				});

				return asyncMarker.myPromise;
			};
		}]);
})();