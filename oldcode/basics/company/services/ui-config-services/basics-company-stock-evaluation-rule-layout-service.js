/**
 * Created by lcn on 7/27/2023
 */

(function (angular) {
	'use strict';
	const moduleName = 'basics.company';

	/**
	 * @ngdoc controller
	 * @name basicsCompanyStockEvaluationRuleLayoutService
	 * @function
	 *
	 * @description
	 *
	 **/
	angular.module(moduleName).service('basicsCompanyStockEvaluationRuleLayoutService', BasicsCompanyStockEvaluationRuleLayoutService);

	BasicsCompanyStockEvaluationRuleLayoutService.$inject = ['platformUIConfigInitService', 'basicsCompanyContainerInformationService', 'basicsCompanyTranslationService',];

	function BasicsCompanyStockEvaluationRuleLayoutService(platformUIConfigInitService, basicsCompanyContainerInformationService, basicsCompanyTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: basicsCompanyContainerInformationService.getStockEvaluationRuleLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Basics.Company',
				typeName: 'StockEvaluationRule4CompDto'
			},
			translator: basicsCompanyTranslationService
		});
	}
})(angular);
