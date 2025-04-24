/**
 * Created by lcn on 7/27/2023
 */

(function (angular) {
	'use strict';
	const moduleName = 'basics.company';

	/**
	 * @ngdoc service
	 * @name basicsCompanyStockEvaluationRuleValidationService
	 * @description provides validation methods for basics company  entities
	 */
	angular.module(moduleName).service('basicsCompanyStockEvaluationRuleValidationService', BasicsCompanyStockEvaluationRuleValidationService);

	BasicsCompanyStockEvaluationRuleValidationService.$inject = ['platformValidationServiceFactory', 'basicsCompanyStockEvaluationRuleDataService', 'platformDataValidationService',];

	function BasicsCompanyStockEvaluationRuleValidationService(platformValidationServiceFactory, dataService, platformDataValidationService) {
		let self = this;
		let schemeId = {typeName: 'StockEvaluationRule4CompDto', moduleSubModule: 'Basics.Company'};
		platformValidationServiceFactory.addValidationServiceInterface(schemeId, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(schemeId)
		}, self, dataService);

		this.validateStockValuationRuleFk = function validateStockValuationRuleFk(entity, value, model) {
			let items = dataService.getList();
			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, self, dataService);
		};
	}

})(angular);
