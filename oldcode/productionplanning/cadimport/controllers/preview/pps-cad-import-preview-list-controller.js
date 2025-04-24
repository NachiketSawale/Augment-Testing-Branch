(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.cadimport';
	angular.module(moduleName).controller('ppsCadImportPreviewListController', [
		'$scope', 'platformGridControllerService',
		'ppsCadImportPreviewUIStandardService', 'ppsCadImportPreviewDataService',
		'basicsCommonToolbarExtensionService', 'platformGridAPI',
		function ($scope, platformGridControllerService,
				  uiStandardService, dataService,
				  basicsCommonToolbarExtensionService, platformGridAPI) {

			var gridConfig = {
				initCalled: false,
				columns: [],
				parentProp: 'ParentFk',
				childProp: 'ChildItems'
			};

			platformGridControllerService.initListController($scope, uiStandardService, dataService, {}, gridConfig);

			var parentService = dataService.parentService();
			parentService.onPropertyChangeEvent.register(dataService.onParentPropertyChange);
			dataService.onParentPropertyChange(null, {entity: parentService.getSelected(), col: 'ImportModel'});

			var onImporting = function () {
				dataService.refreshUI();
			};
			parentService.onImportingEvent.register(onImporting);

			var setCellEditable = function () {
				return false;
			};
			var onCellChange = function (e, args) {
				var col = args.grid.getColumns()[args.cell].field;
				dataService.onPropertyChange({entity: args.item, col: col});
			};

			platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);
			platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);

			$scope.$on('$destroy', function () {
				parentService.onPropertyChangeEvent.unregister(dataService.onParentPropertyChange);
				platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
				platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', setCellEditable);
				parentService.onImportingEvent.unregister(onImporting);
			});
		}
	]);
})();