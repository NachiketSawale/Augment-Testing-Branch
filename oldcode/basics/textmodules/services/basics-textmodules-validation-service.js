/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let moduleName = 'basics.textmodules';

	/**
	 * @ngdoc service
	 * @name basicsTextModulesValidationService
	 * @description provides validation methods for text modules instances
	 */
	angular.module(moduleName).factory('basicsTextModulesValidationService', basicsTextModulesValidationService);

	basicsTextModulesValidationService.$inject = [
		'_',
		'$q',
		'$http',
		'$injector',
		'$translate',
		'globals',
		'platformDataValidationService',
		'platformRuntimeDataService'
	];

	function basicsTextModulesValidationService(
		_,
		$q,
		$http,
		$injector,
		$translate,
		globals,
		platformDataValidationService,
		platformRuntimeDataService) {

		let service = {};

		service.validateCode = validateCode;
		service.validateDescriptionInfo = validateDescriptionInfo;
		service.asyncValidateClient = asyncValidateClient;
		service.validateTextModuleTypeFk = validateTextModuleTypeFk;
		service.validateIsLanguageDependent = validateIsLanguageDependent;
		service.validateTextFormatFk = validateTextFormatFk;

		// service.validateLanguageFk = function validateLanguageFk(entity, value) {
		// if(value === 0 || value === null || angular.isUndefined(value)){
		// return {valid: false,apply: true,error$tr$: 'cloud.common.Error_PropertyIsRequired'};
		// }
		// };

		return service;

		function validateCode(entity, value, model) {
			let dataService = getDataService();
			let items = dataService.getList();
			let workflowTranslationTyp = 44;
			if(entity.TextModuleTypeFk === workflowTranslationTyp && value !== null) {
				let firstMatchPosition = value.search(/[\\=\\ \\.\\*\\,\\(\\)\\+\\?\\!\\:§\\$\\%\\&\\/\\|€\\@\\~\\^°öÖäÄüÜ\\<\\>\\#]/gm);

				if (firstMatchPosition >= 0) {
					let res = platformDataValidationService.createErrorObject('basics.textmodules.invalidValueErrorMessage', {});
					return platformDataValidationService.finishValidation(res, entity, value, model, service, dataService);
				}
			}
			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, service, dataService);
		}

		function validateDescriptionInfo(entity, value, model) {
			let dataService = getDataService();
			let field = 'DescriptionInfo';
			let result = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			platformRuntimeDataService.applyValidationResult(result, entity, field);
			return result;
		}

		function asyncValidateClient(entity, value, model) {
			let defer = $q.defer();
			let result = {valid: true, apply: true};
			let dataService = getDataService();
			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);

			if (!value) {
				asyncMarker.myPromise = defer.promise;
				platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService);
				defer.resolve(result);
				return asyncMarker.myPromise;
			}

			asyncMarker.myPromise = $http.get(globals.webApiBaseUrl + 'basics/textmodules/getinvalidcompanycodeexpressions?expression=' + value + '&textModuleContextId=' + entity.TextModuleContextFk)
				.then(function (response) {
					let invalidExprs = (response && response.data) || [];
					if (invalidExprs.length > 0) {
						let invalids = _.join(invalidExprs, ';');
						result.valid = false;
						result.error = $translate.instant('basics.textmodules.error.clientErrorNotFoundCompany', {
							invalids: invalids
						});
					}
					return platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService);
				});

			return asyncMarker.myPromise;
		}

		function validateTextModuleTypeFk(entity, value, model) {
			let dataService = getDataService();
			let tempValue = value;
			if (value === 0 || value === -1) {
				tempValue = null;
			}
			var result = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			dataService.updateItemReadonly(entity, {textModuleTypeId: tempValue});
			return result;
		}

		function validateIsLanguageDependent(entity, value) {
			let dataService = getDataService();

			dataService.isLanguageDependentChanged.fire(value);
			return true;
		}

		function validateTextFormatFk(entity, value) {
			let dataService = getDataService();

			dataService.textFormatChanged.fire(value);
			return true;
		}

		function getDataService() {
			return $injector.get('basicsTextModulesMainService');
		}
	}

})(angular);
