/**
 * Created by lcn on 7/27/2023
 */

(function (angular) {
	'use strict';
	const moduleName = 'basics.company';

	/**
	 * @ngdoc controller
	 * @name basicsCompanyStockEvaluationRuleDetailController
	 * @function
	 *
	 * @description
	 *
	 **/

	angular.module(moduleName).controller('basicsCompanyStockEvaluationRuleDetailController', BasicsCompanyStockEvaluationRuleDetailController);

	BasicsCompanyStockEvaluationRuleDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsCompanyStockEvaluationRuleDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '5b80291b17714d7dab952bcd22ca5b26');
	}
})(angular);