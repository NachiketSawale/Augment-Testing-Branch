/**
 * Created by lcn on 7/27/2023
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	const moduleName = 'basics.company';

	/**
	 * @ngdoc controller
	 * @name basicsCompanyStockEvaluationRuleController
	 * @function
	 *
	 * @description
	 **/

	angular.module(moduleName).controller('basicsCompanyStockEvaluationRuleController', BasicsCompanyStockEvaluationRuleController);

	BasicsCompanyStockEvaluationRuleController.$inject = ['$scope', '$translate', 'platformContainerControllerService'];

	function BasicsCompanyStockEvaluationRuleController($scope, $translate,platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '3b739717fa8e4a04941a5824a1f606de');
	}
})(angular);