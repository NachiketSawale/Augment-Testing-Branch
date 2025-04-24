/**
 * Created by shen on 4/28/2022
 */

(function (angular) {
	'use strict';
	let moduleName = 'logistic.card';

	/**
	 * @ngdoc service
	 * @name logisticCardDocumentValidationService
	 * @description provides validation methods for logistic card document entities
	 */

	angular.module(moduleName).service('logisticCardDocumentValidationService', LogisticCardDocumentValidationService);

	LogisticCardDocumentValidationService.$inject = ['_','logisticCardDocumentDataService', 'platformDataValidationService','platformRuntimeDataService',];

	function LogisticCardDocumentValidationService(_, logisticCardDocumentDataService, platformDataValidationService, platformRuntimeDataService) {

		let self = this;
		let dataService = logisticCardDocumentDataService;
		self.validateUrl = function (entity, value, model) {
			entity.Url = _.isNil(entity.Url) && _.isNil(value)  ? '' : entity.Url;

			return  !_.isNil(entity.FileArchiveDocFk) ? removeMandatory(entity,value,model)
				: platformDataValidationService.validateMandatory(entity, value, model, self, dataService);
		};

		function removeMandatory(entity, value, model){
			var result = {apply: true, valid: false};
			result.apply = true;
			result.valid = true;
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			platformDataValidationService.finishValidation(result, entity, true, model, dataService, dataService);
			return result;
		}
	}

})(angular);