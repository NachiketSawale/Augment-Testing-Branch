/**
 * @author: chd
 * @date: 3/22/2021 11:33 AM
 * @description:
 */
(function (angular) {
	'use strict';
	/**
	 * @ngdoc controller
	 * @name mtwo.mtwoAIConfigurationModelListController
	 * @require $scope
	 * @description mtwoAIConfigurationModelListController controller for mtwo aiconfiguration main grid controller
	 *
	 */
	let moduleName = 'mtwo.aiconfiguration';

	angular.module(moduleName).controller('mtwoAIConfigurationModelListController', MtwoAIConfigurationModelListController);

	MtwoAIConfigurationModelListController.$inject = [
		'$scope',
		'platformGridControllerService',
		'mtwoAIConfigurationModelListDataService',
		'mtwoAIConfigurationModelListUIStandardService',
		'mtwoAIConfigurationHeaderValidationService'];

	function MtwoAIConfigurationModelListController(
		$scope,
		platformGridControllerService,
		mtwoAIConfigurationModelListDataService,
		mtwoAIConfigurationModelListUIStandardService,
		mtwoAIConfigurationHeaderValidationService) {

		let myGridConfig = {
			initCalled: false, columns: [], isFlatList: true

		};

		platformGridControllerService.initListController($scope, mtwoAIConfigurationModelListUIStandardService, mtwoAIConfigurationModelListDataService, mtwoAIConfigurationHeaderValidationService, myGridConfig);
	}
})(angular);
