/**
 * @author: chd
 * @date: 3/22/2021 1:54 PM
 * @description:
 */
(function (angular) {
	'use strict';

	let moduleName = 'mtwo.aiconfiguration';

	angular.module(moduleName).controller('mtwoAIConfigurationModelInputParameterController', MtwoAIConfigurationModelInputParameterController);

	MtwoAIConfigurationModelInputParameterController.$inject = ['$scope', 'platformGridControllerService', 'mtwoAIConfigurationModelInputParameterService', 'mtwoAIConfigurationModelInputParameterUIStandardService'];

	function MtwoAIConfigurationModelInputParameterController($scope, platformGridControllerService, mtwoAIConfigurationModelInputParameterService, mtwoAIConfigurationModelInputParameterUIStandardService) {
		let myGridConfig = {
			initCalled: false, columns: [], parentProp: 'MtoModelParameterFk', childProp: 'ChildItems',
			type: 'ModelParameter'
		};
		platformGridControllerService.initListController($scope, mtwoAIConfigurationModelInputParameterUIStandardService, mtwoAIConfigurationModelInputParameterService, {}, myGridConfig);
	}
})(angular);
