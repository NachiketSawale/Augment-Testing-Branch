/**
 * @author: chd
 * @date: 3/22/2021 1:54 PM
 * @description:
 */
(function (angular) {
	'use strict';

	let moduleName = 'mtwo.aiconfiguration';

	angular.module(moduleName).controller('mtwoAIConfigurationModelOutputParameterController', MtwoAIConfigurationModelOutputParameterController);

	MtwoAIConfigurationModelOutputParameterController.$inject = ['$scope', 'platformGridControllerService', 'mtwoAIConfigurationModelOutputParameterService', 'mtwoAIConfigurationModelOutputParameterUIStandardService'];

	function MtwoAIConfigurationModelOutputParameterController($scope, platformGridControllerService, mtwoAIConfigurationModelOutputParameterService, mtwoAIConfigurationModelOutputParameterUIStandardService) {

		let myGridConfig = {
			initCalled: false, columns: [], parentProp: 'MtoModelParameterFk', childProp: 'ChildItems',
			type: 'ModelParameter'
		};
		platformGridControllerService.initListController($scope, mtwoAIConfigurationModelOutputParameterUIStandardService, mtwoAIConfigurationModelOutputParameterService, {}, myGridConfig);
	}
})(angular);
