(function () {
	'use strict';
	/* global angular */

	const moduleName = 'productionplanning.drawingtype';

	/**
	 * @ngdoc service
	 * @name productionPlanningDrawingTypeValidationService
	 * @description provides validation methods for drawing type entities
	 */
	angular.module(moduleName).service('productionPlanningDrawingTypeValidationService', ValidationService);

	ValidationService.$inject = ['$q', '$translate', 'platformDataValidationService', 'platformValidationServiceFactory', 'productionPlanningDrawingTypeConstantValues', 'productionPlanningDrawingTypeDataService'];

	/* jshint -W040 */ // remove the warning that possible strict voilation
	function ValidationService($q, $translate, platformDataValidationService, platformValidationServiceFactory, constantValues, dataService) {
		let self = this;
		let schemeInfo = constantValues.schemes.drawingType;
		let specification = {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(schemeInfo)
		};

		platformValidationServiceFactory.addValidationServiceInterface(schemeInfo, specification, self, dataService);

		self.asyncValidateMaterialGroupFk = function asyncValidateMaterialGroupFk (entity, value, model) {
			let defer = $q.defer();
			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);

			asyncMarker.myPromise = defer.promise.then(function (response) {
				return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, self, dataService);
			});

			if (value < 0) {
				defer.resolve({
					apply: true,
					valid: false,
					error: $translate.instant('basics.material.error.materialGroupSelectError')
				});
				return asyncMarker.myPromise;
			}

			defer.resolve({
				apply: true, valid: true
			});

			return asyncMarker.myPromise;
		};

	}

})(angular);