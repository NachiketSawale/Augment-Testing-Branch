/**
 * Created by shen on 4/29/2022
 */

(function (angular) {
	'use strict';
	let moduleName = 'logistic.card';

	/**
	 * @ngdoc service
	 * @name logisticCardTemplateDocumentValidationService
	 * @description provides validation methods for logistic card templateDocumentValidation entities
	 */
	angular.module(moduleName).service('logisticCardTemplateDocumentValidationService', LogisticCardTemplateDocumentValidationService);

	LogisticCardTemplateDocumentValidationService.$inject = ['_','logisticCardTemplateDocumentDataService', 'platformDataValidationService','platformRuntimeDataService',];

	function LogisticCardTemplateDocumentValidationService(_, logisticCardTemplateDocumentDataService, platformDataValidationService, platformRuntimeDataService) {

		let self = this;
		let dataService = logisticCardTemplateDocumentDataService;

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