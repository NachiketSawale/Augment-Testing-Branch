(function(angular){
	/* global globals */
	'use strict';
	angular.module('estimate.main').factory('estimateMainBoqAreaAssignmentValidationService', ['$injector','$http', '$q',
		'estimateMainStandardAllowancesDataService','projectMainService', 'platformDataValidationService', 'platformRuntimeDataService','estimateMainTranslationService','$translate','boqMainLineTypes',
		function($injector, $http, $q, estimateMainStandardAllowancesDataService, projectMainService, platformDataValidationService, platformRuntimeDataService,estimateMainTranslationService,$translate,boqMainLineTypes){
			let service = {};

			service.validate = function(newItem){
				service.validateFromBoqItemFk(newItem, null, 'FromBoqItemFk');
				service.validateToBoqItemFk(newItem, null, 'ToBoqItemFk');
			};

			service.validateFromBoqItemFk = function(entity, value, model){
				if(entity.BoqHeaderFk && !entity.FromBoqHeaderFk){
					entity.FromBoqHeaderFk = entity.BoqHeaderFk;
				}
				let estimateMainAllowanceBoqAreaAssigmentService = $injector.get('estimateMainAllowanceBoqAreaAssigmentService');
				let result = platformDataValidationService.isMandatory(value, model);

				checkCrbBoqIsHasSubQuantityBoq(result,value);

				platformRuntimeDataService.applyValidationResult(result, entity, model);
				return platformDataValidationService.finishValidation(result, entity, value, model, service, estimateMainAllowanceBoqAreaAssigmentService);
			};

			service.validateToBoqItemFk = function(entity, value, model){
				if(entity.BoqHeaderFk && !entity.ToBoqHeaderFk){
					entity.ToBoqHeaderFk = entity.BoqHeaderFk;
				}
				let estimateMainAllowanceBoqAreaAssigmentService = $injector.get('estimateMainAllowanceBoqAreaAssigmentService');
				let result = platformDataValidationService.isMandatory(value, model);

				checkCrbBoqIsHasSubQuantityBoq(result,value);

				platformRuntimeDataService.applyValidationResult(result, entity, model);
				return platformDataValidationService.finishValidation(result, entity, value, model, service, estimateMainAllowanceBoqAreaAssigmentService);
			};

			service.asyncValidateFromBoqItemFk = function(entity, value, model){
				return checkBoqItemFk(entity, value, model);
			};

			service.asyncValidateToBoqItemFk = function(entity, value, model){
				return checkBoqItemFk(entity, value, model);
			};

			function checkBoqItemFk(entity, value, field) {
				entity[field] = value;
				let estimateMainAllowanceBoqAreaAssigmentService = $injector.get('estimateMainAllowanceBoqAreaAssigmentService');
				// asynchronous validation is only called, if the normal returns true, so we do not need to call it again.
				let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, estimateMainAllowanceBoqAreaAssigmentService);

				// Now the data service knows there is an outstanding asynchronous request.
				let createOption = {};
				let selectedAllowance = estimateMainStandardAllowancesDataService.getSelected();
				createOption.EstAllowanceId = selectedAllowance ? selectedAllowance.Id : null;
				createOption.ProjectId = projectMainService.getIfSelectedIdElse(0);
				createOption.BoqRanges = estimateMainAllowanceBoqAreaAssigmentService.getList();

				asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'estimate/main/boqareaassignment/checkOverlapAreas', createOption).then(function (response) {
					let validationResult = {
						valid : response.data.IsValid,
						apply : true,
						error : response.data.Message
					};

					// Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
					platformDataValidationService.finishAsyncValidation(validationResult, entity, value, field, asyncMarker, service, estimateMainAllowanceBoqAreaAssigmentService);

					// Provide result to grid / form container.
					return validationResult;
				});

				return asyncMarker.myPromise;
			}

			function checkCrbBoqIsHasSubQuantityBoq(result,value) {
				let estimateMainBoqItemService = $injector.get('estimateMainBoqItemService');
				let item = estimateMainBoqItemService.getItemById(value);
				if (item && item.Id && item.BoqLineTypeFk === boqMainLineTypes.position) {
					if (_.isArray(item.BoqItems) && item.BoqItems.length > 0) {
						let crbChildrens = _.filter(item.BoqItems,{'BoqLineTypeFk':boqMainLineTypes.crbSubQuantity});
						if(crbChildrens && crbChildrens.length){
							let translation = estimateMainTranslationService.getTranslationInformation('subQuantityBoQItemsErrormsg');
							result.valid = false;
							result.error = $translate.instant(translation.location + '.' + translation.identifier);
						}
					}
				}
			}

			return service;
		}]);

})(angular);