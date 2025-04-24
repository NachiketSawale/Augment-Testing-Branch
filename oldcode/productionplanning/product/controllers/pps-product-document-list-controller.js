(function () {
	'use strict';
	/* global angular, _ */

	var module = 'productionplanning.product';
	angular.module(module).controller('ppsProductDocumentListController', ListController);

	ListController.$inject = [
		'$scope',
		'$translate',
		'$injector',
		'platformGridAPI',
		'basicsCommonUploadDownloadControllerService',
		'platformGridControllerService',
		'ppsCommonGenericDocumentUIStandardService',
		'ppsCommonGenericDocumentFromValuesHelper',
		'ppsProductGenericDocumentDataService'];

	function ListController($scope,
		$translate,
		$injector,
		platformGridAPI,
		uploadDownloadControllerService,
		platformGridControllerService,
		uiStandardService,
		ppsCommonGenericDocumentFromValuesHelper,
		dataService) {

		function createUiService(uiStandardService) {
			let columns = _.cloneDeep(uiStandardService.getStandardConfigForListView().columns);
			let column = columns.find(x => x.id === 'from');
			if (column) {
				column.editor = 'select';
				let items = ppsCommonGenericDocumentFromValuesHelper.translatedFromValues.filter(e => e.id === 'PRODUCT_PRJ' || e.id === 'PRODUCT_CAD'); // for editing "from" field, we can only select "PRODUCT_PRJ" or "PRODUCT_CAD"
				column.editorOptions = {
					items: items,
					valueMember: 'id',
					displayMember: 'description'
				};
			}
			return {
				getStandardConfigForListView: () => {
					return {
						columns: columns
					};
				}
			};
		}

		var gridConfig = {initCalled: false, columns: []};

		platformGridControllerService.initListController($scope, createUiService(uiStandardService), dataService, null, gridConfig);

		uploadDownloadControllerService.initGrid($scope, dataService);

		let onCellChange = (e, args) => {
			const field = args.grid.getColumns()[args.cell].field;
			if (field === 'From') {
				if (!ppsCommonGenericDocumentFromValuesHelper.isDocumentSavedInPpsDocTable(args.item.From)) {
					args.item.PpsDocumentTypeFk = null;
					dataService.gridRefresh();
				}
				$injector.get('ppsCommonGenericDocumentProcessor').processPpsDocumentTypeFkField(args.item);
			}
		};
		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
		});
	}
})(angular);