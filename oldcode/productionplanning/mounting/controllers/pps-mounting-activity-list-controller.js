/**
 * Created by anl on 8/9/2017.
 */

(function () {
	/*global angular*/
	'use strict';
	var moduleName = 'productionplanning.mounting';


	angular.module(moduleName).controller('productionplanningMountingActivityListController', ActivityListController);

	ActivityListController.$inject = ['$scope', 'platformContainerControllerService',
		'platformGridAPI',
		'productionplanningMountingActivityResourceRequisitionLookupDataService',
		'productionplanningMountingContainerInformationService',
		'productionplanningActivityActivityContainerService',
		'productionplanningActivityGotoBtnsExtension',
		'productionplanningMountingRequisitionDataService',
		'productionplanningActivityActivityDataService',
		'basicsCommonToolbarExtensionService',
		'productionplanningCommonActivityDateshiftService'];

	function ActivityListController($scope, platformContainerControllerService,
									platformGridAPI,
									productionplanningMountingActivityResourceRequisitionLookupDataService,
									mountingContainerInformationService,
									activityContainerService,
									gotoBtnsExtension,
									mntRequisitionDataService,
									activityDataService,
									basicsCommonToolbarExtensionService,
									        activityDateshiftService) {
		//platformTranslateService.translateGridConfig(uiStandardService.getStandardConfigForListView().columns);

		//'3a37c9d82f4e45c28ccd650f1fd2bc1f'
		var containerUid = $scope.getContentValue('uuid');
		var originLayout = '0fabc9f2d6a946b1bd5517bb7229e10a';
		var initConfig =
		{
			id: containerUid,
			layout: containerUid,
			usedLayout: originLayout,
			moduleName: moduleName
		};

		if (!mountingContainerInformationService.hasDynamic()) {
			activityContainerService.prepareGridConfig(containerUid, mountingContainerInformationService,
				initConfig, mntRequisitionDataService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);

		var dynamicActivityDataService = mountingContainerInformationService.getContainerInfoByGuid(containerUid).dataServiceName;

		var initDateshiftConfig = { tools : [ { id: 'fullshift', value: false } ], configId: 'productionplanning.activity' };
		activityDateshiftService.initializeDateShiftController(moduleName, dynamicActivityDataService, $scope, initDateshiftConfig, 'productionplanningActivity');

		basicsCommonToolbarExtensionService.insertBefore($scope, gotoBtnsExtension.createGotoBtns(dynamicActivityDataService));

		dynamicActivityDataService.registerFilter();

		var onCellChange = function (e, args) {
			var col = args.grid.getColumns()[args.cell].field;
			if (col === 'EventTypeFk' && !_.isNull(args.item.EventTypeFk) && args.item.Version === 0) {
				dynamicActivityDataService.updateActivity(args.item);
			}
		};

		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		function onChangeGridContent() {
			var selected = platformGridAPI.rows.selection({
				gridId: $scope.gridId
			});
			selected = _.isArray(selected) ? selected[0] : selected;
			if (_.isNil(selected)) {
				//productionplanningMountingActivityResourceRequisitionLookupDataService.clearFilter();
				productionplanningMountingActivityResourceRequisitionLookupDataService.setFilter(0);
			} else {
				productionplanningMountingActivityResourceRequisitionLookupDataService.setFilter(selected.PpsEventFk);
			}
		}

		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
			dynamicActivityDataService.unregisterFilter();
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);
		});
	}
})();
