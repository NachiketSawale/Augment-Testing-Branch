/**
 * Created by anl on 2/5/2018.
 */

(function () {
	/* global angular */
	'use strict';
	var moduleName = 'productionplanning.activity';


	angular.module(moduleName).controller('productionplanningActivityActivityListController', ActivityListController);

	ActivityListController.$inject = ['$scope', '$injector', 'platformContainerControllerService',
		'platformTranslateService', 'productionplanningActivityActivityUIStandardService',
		'productionplanningActivityActivityDataService', 'platformGridAPI',
		'productionplanningActivityGotoBtnsExtension',
		'productionplanningMountingActivityResourceRequisitionLookupDataService',
		'productionplanningCommonStructureFilterService',
		'$timeout',
		'basicsCommonToolbarExtensionService',
		'ppsCommonModelFilterService',
		'productionplanningActivityGobacktoBtnsExtension'];

	function ActivityListController($scope, $injector, platformContainerControllerService, platformTranslateService, uiStandardService,
		activityDataService, platformGridAPI,
		gotoBtnsExtension,
		productionplanningMountingActivityResourceRequisitionLookupDataService,
		ppsCommonStructureFilterService,
		$timeout,
		basicsCommonToolbarExtensionService,
		ppsCommonModelFilterService,
		gobacktoBtnsExtension) {
		platformTranslateService.translateGridConfig(uiStandardService.getStandardConfigForListView().columns);

		platformContainerControllerService.initController($scope, moduleName, '0fabc9f2d6a946b1bd5517bb7229e10a');

		$scope.setTools(ppsCommonStructureFilterService.getToolbar(activityDataService));

		basicsCommonToolbarExtensionService.insertBefore($scope, gotoBtnsExtension.createGotoBtns(activityDataService));
		basicsCommonToolbarExtensionService.insertBefore($scope, gobacktoBtnsExtension.createGobacktoBtns(activityDataService));
		activityDataService.registerFilter();

		var onCellChange = function (e, args) {
			var col = args.grid.getColumns()[args.cell].field;
			if (col === 'EventTypeFk' && !_.isNull(args.item.EventTypeFk) && args.item.Version === 0) {
				activityDataService.updateActivity(args.item);
			}
			else if(col === 'PrjLocationFk'){
				activityDataService.updateLocationInfo(args.item);
			}

		};
		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		function onChangeGridContent() {
			var selected = platformGridAPI.rows.selection({
				gridId: $scope.gridId
			});
			selected = _.isArray(selected) ? selected[0] : selected;
			if (_.isNil(selected)) {
				// productionplanningMountingActivityResourceRequisitionLookupDataService.clearFilter();
				productionplanningMountingActivityResourceRequisitionLookupDataService.setFilter(0);
			} else {
				productionplanningMountingActivityResourceRequisitionLookupDataService.setFilter(selected.PpsEventFk);
			}
		}

		// update toolbar
		function updateToolsWA() {
			$timeout($scope.tools.update, 50);
		}

		ppsCommonStructureFilterService.onUpdated.register(updateToolsWA);

		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);
		activityDataService.registerSelectedEntitiesChanged(ppsCommonModelFilterService.updateMainEntityFilter);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
			activityDataService.unregisterFilter();
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);
			ppsCommonStructureFilterService.onUpdated.unregister(updateToolsWA);
			activityDataService.unregisterSelectedEntitiesChanged(ppsCommonModelFilterService.updateMainEntityFilter);
		});
	}
})();