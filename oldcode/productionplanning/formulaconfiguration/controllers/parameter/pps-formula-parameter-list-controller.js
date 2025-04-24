(function(angular) {
	'use strict';
	/* global globals, angular */
	const moduleName = 'productionplanning.formulaconfiguration';

	angular.module(moduleName).controller('ppsFormulaParameterListController', ListController);

	ListController.$inject = ['$scope', '$injector', 'platformContainerControllerService', 'platformTranslateService',
		'productionplanningFormulaConfigurationParameterUIStandardService','ppsFormulaParameterDataService','$translate'];

	function ListController($scope, $injector, platformContainerControllerService, platformTranslateService,
		uiStandardService,ppsFormulaParameterDataService,$translate) {
		$scope.containerHeaderInfo = {
			prefix: $translate.instant('cloud.common.Container') + ': ',
			currentContainerName: '',
		};
		platformTranslateService.translateGridConfig(uiStandardService.getStandardConfigForListView().columns);
		const containerUUid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, moduleName, containerUUid);

		let config = [{
			gridId: '7d65f3bd54224873bef7ef881eeab365',
			serviceName: 'ppsFormulaVersionDataService',
			title: $translate.instant('productionplanning.formulaconfiguration.entityFormulaVersion')
		},{
			gridId: '204126a8563e49caa9aa4fa95ff5c786',
			serviceName: 'ppsFormulaInstanceDataService',
			title: $translate.instant('productionplanning.formulaconfiguration.entityFormulaInstance')
		}];

		ppsFormulaParameterDataService.registerRelativeSelectionChanged(config);
		ppsFormulaParameterDataService.registerServiceChangedMessage(registerServiceChangedMessage);

		function registerServiceChangedMessage(currentContainerName) {
			$scope.containerHeaderInfo.currentContainerName = currentContainerName;
		}

		$scope.$on('$destroy', () => {
			ppsFormulaParameterDataService.unRegisterRelativeSelectionChanged();
			ppsFormulaParameterDataService.unRegisterServiceChangedMessage();
		});
	}

})(angular);