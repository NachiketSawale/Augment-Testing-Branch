/*
* $Id$
* Copyright(c) RIB Software GmbH
*/
(function (angular) {
	'use strict';

	const moduleName = 'basics.costcodes';
	angular.module(moduleName).controller('basicsCostCodesReferencesController',basicsCostCodesReferencesController);
	basicsCostCodesReferencesController.$inject = ['$scope','$injector','$timeout','platformGridAPI','basicsCostcodesReferenceConfigurationService','platformGridControllerService','basicsCostCodesReferenceDataService','basicsCostCodesMainService'];

	function basicsCostCodesReferencesController($scope,$injector,$timeout,platformGridAPI,basicsCostcodesReferenceConfigurationService,platformGridControllerService,basicsCostCodesReferenceDataService,basicsCostCodesMainService) {
		$scope.gridId = '6ED3EB55351246E3A7398C2C29C450DD';
		const myGridConfig = {
			initCalled: false,
			columns: [],
			grouping: false,
			statusBar:true,
			enableConfigSave: true,
			type: 'referencesList'
		};

		platformGridControllerService.initListController($scope, basicsCostcodesReferenceConfigurationService, basicsCostCodesReferenceDataService, null, myGridConfig);

		function loadCurrentItem(){
			$scope.currentItem = basicsCostCodesMainService.getSelected();
			basicsCostCodesReferenceDataService.setGridId($scope.gridId);
			basicsCostCodesReferenceDataService.loadCostcodeData($scope.currentItem);
		}
		basicsCostCodesMainService.registerSelectionChanged(loadCurrentItem);

		// remove tools
		const idsToRemove = ['t14', 't12', 't199','t-addpinningdocument'];
		_.remove($scope.tools.items, item => idsToRemove.includes(item.id));

		//  unregister subscription
		$scope.$on('$destroy', function () {
			basicsCostCodesMainService.unregisterSelectionChanged(loadCurrentItem);
		});

	}
})(angular);