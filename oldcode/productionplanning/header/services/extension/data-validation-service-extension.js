/**
 * Created by zwz on 10/23/2019.
 */
(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name productionplanningHeaderDataValidationServiceExtension
	 * @function
	 * @requires platform:platformDataValidationService, platformModuleStateService
	 */
	var moduleName = 'productionplanning.header';
	angular.module(moduleName).service('productionplanningHeaderDataValidationServiceExtension', ValidationServiceExtension);
	ValidationServiceExtension.$inject = ['platformDataValidationService'];
	function ValidationServiceExtension(platformDataValidationService) {

		this.ensureNoRelatedError = function ensureNoRelatedError(entity, model, relModels, errorTrs, validationService, dataService) {
			if (entity && entity.__rt$data && entity.__rt$data.errors) {
				_.forEach(relModels, function (relModel) {
					var error = entity.__rt$data.errors[relModel];
					if (error && error.error$tr$ === errorTrs[relModel]) {
						delete entity.__rt$data.errors[relModel];
						platformDataValidationService.removeFromErrorList(entity, relModel, validationService, dataService);
					}
				});
				platformDataValidationService.removeFromErrorList(entity, model, validationService, dataService);
			}
		};

	}
})();