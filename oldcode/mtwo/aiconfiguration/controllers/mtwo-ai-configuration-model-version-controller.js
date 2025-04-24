/**
 * @author: chd
 * @date: 3/24/2021 10:04 AM
 * @description:
 */
(function (angular) {
	'use strict';

	let moduleName = 'mtwo.aiconfiguration';

	angular.module(moduleName).controller('mtwoAIConfigurationModelVersionController', MtwoAIConfigurationModelVersionController);

	MtwoAIConfigurationModelVersionController.$inject = ['$scope', 'platformGridControllerService', 'mtwoAIConfigurationModelVersionService', 'mtwoAIConfigurationModelVersionUIStandardService', 'mtwoAIConfigurationModelVersionValidationService'];

	function MtwoAIConfigurationModelVersionController($scope, platformGridControllerService, mtwoAIConfigurationModelVersionService, mtwoAIConfigurationModelVersionUIStandardService, mtwoAIConfigurationModelVersionValidationService) {

		let myGridConfig = {initCalled: false, columns: [], rowChangeCallBack: function () { }, cellChangeCallBack: function () { } };

		let validator = mtwoAIConfigurationModelVersionValidationService(mtwoAIConfigurationModelVersionService);
		platformGridControllerService.initListController($scope, mtwoAIConfigurationModelVersionUIStandardService, mtwoAIConfigurationModelVersionService, validator, myGridConfig);
	}
})(angular);
