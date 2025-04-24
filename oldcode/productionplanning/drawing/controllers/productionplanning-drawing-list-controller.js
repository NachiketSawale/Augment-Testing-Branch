/**
 * Created by zov on 03/04/2019.
 */
(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.drawing';
	angular.module(moduleName).controller('productionplanningDrawingListController', [
		'$scope',
		'platformContainerControllerService',
		'platformGridAPI',
		'basicsCommonToolbarExtensionService',
		'ppsDrawingPreviewUIService',
		'platformModuleNavigationService',
		'$translate',
		'productionplanningDrawingGotoBtnsExtension',
		'productionplanningDrawingGobacktoBtnsExtension',
		function ($scope,
				  platformContainerControllerService,
				  platformGridAPI,
				  basicsCommonToolbarExtensionService,
				  ppsDrawingPreviewUIService,
				  navigationService,
				  $translate,
			gotoBtnsExtension,gobacktoBtnsExtension) {
			var guid = 'a9d9591baf2d4e58b5d21cd8a6048dd1';
			platformContainerControllerService.initController($scope, moduleName, guid);

			var modCIS = platformContainerControllerService.getModuleInformationService(moduleName);
			var layInfo = modCIS.getContainerInfoByGuid(guid);
			var dataServ = platformContainerControllerService.getServiceByToken(layInfo.dataServiceName);
			dataServ.registerEvents();
			var onCellChange = function (e, args) {
				var col = args.grid.getColumns()[args.cell].field;
				dataServ.handleFieldChanged(args.item, col);
			};
			platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

			let isShowingDrawingPreviewDialog = false;
			var tool = {
				id: 't1',
				caption: 'productionplanning.drawing.checking',
				type: 'item',
				iconClass: 'control-icons ico-criterion-lookup',
				fn: function () {
					isShowingDrawingPreviewDialog = true;
					ppsDrawingPreviewUIService.showDialog(dataServ.getSelected(), function callbackFn(){
						isShowingDrawingPreviewDialog = false;
						$scope.tools.update();
					});
				},
				disabled: function () {
					return isShowingDrawingPreviewDialog || !dataServ.getSelected();
				}
			};

			basicsCommonToolbarExtensionService.insertBefore($scope, tool);
			basicsCommonToolbarExtensionService.insertBefore($scope, gotoBtnsExtension.createGotoBtns(dataServ));
			basicsCommonToolbarExtensionService.insertBefore($scope, gobacktoBtnsExtension.createGobacktoBtns(dataServ));

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
				if (_.isFunction(dataServ.onDestroy)) {
					dataServ.onDestroy();
				}
			});
		}
	]);
})();