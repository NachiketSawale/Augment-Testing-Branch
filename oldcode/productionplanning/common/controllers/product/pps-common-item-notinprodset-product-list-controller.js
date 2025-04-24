(function () {
	/* global _ */
	'use strict';
	const moduleName = 'productionplanning.common';
	const angModule = angular.module(moduleName);

	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('ppsCommonItemNotInProdsetProductListController', ListController);

	ListController.$inject = ['$scope',
		'platformGridControllerService',
		'ppsCommonItemNotInProdsetProductDataService',
		'productionplanningCommonProductUIStandardService',
		'productionplanningProductDocumentDataProviderFactory',
		'ppsDocumentToolbarButtonExtension'];

	function ListController($scope,
		gridControllerService,
		dataService,
		uiStandardService,
		productDocumentDataProviderFactory,
		ppsDocumentToolbarButtonExtension) {

		let gridConfig = { initCalled: false, columns: [] };

		function createUiService(uiStandardService) {
			let columns = _.cloneDeep(uiStandardService.getStandardConfigForListView().columns);
			// set columns readonly
			_.forEach(columns, function (o) {
				o.editor = null;
			});
			return {
				getStandardConfigForListView: function () {
					return {
						columns: columns
					};
				}
			};
		}

		gridControllerService.initListController($scope, createUiService(uiStandardService), dataService, null, gridConfig);

		(function extendPpsDocumentActionButtons() {
			const docTypes = productDocumentDataProviderFactory.ppsDocumentTypes;
			ppsDocumentToolbarButtonExtension.extendDocumentButtons(docTypes, $scope, dataService);
		})();

		const onSelectedRowsChanged = () => {
			$scope.tools.update();
		};
		dataService.registerSelectionChanged(onSelectedRowsChanged);

		$scope.$on('$destroy', () => {
			dataService.unregisterSelectionChanged(onSelectedRowsChanged);
		});
	}
})();