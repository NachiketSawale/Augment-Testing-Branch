/**
 * Created by wul on 4/18/2018.
 */

(function () {

	'use strict';

	let boqMainModule = 'estimate.main';

	/**
     * @ngdoc service
     * @name estimateMainWidboqValidationService
     * @description provides boq validation services for common modules
     */
	angular.module(boqMainModule).factory('estimateMainWidboqValidationService', ['platformDataValidationService', '$injector', '$q','generateWipBoqStructureService','boqMainValidationServiceProvider',
		function (platformDataValidationService, $injector, $q, generateWipBoqStructureService,boqMainValidationServiceProvider) {

			let service  = boqMainValidationServiceProvider.getInstance(generateWipBoqStructureService);
			boqMainValidationServiceProvider.skipAsyncValidateReference(true);

			let validataFun = service.validateReference;

			service.validateReference = function (entity, value, model) {
				let result = validataFun(entity, value, model);

				if(result.valid){
					result = $injector.get('estimateMainWicboqToPrjboqCompareDataForWicService').validateRootRefNo(entity, value);
				}

				return result;
			};

			return service;
		}
	]);

})();
