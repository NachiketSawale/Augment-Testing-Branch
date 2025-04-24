/**
 * Created by anl on 10/25/2017.
 */

(function () {
	'use strict';

	var moduleName = 'productionplanning.mounting';

	angular.module(moduleName).controller('productionplanningMountingTimeSheetListController', TimeSheetListController);

	TimeSheetListController.$inject = ['$scope', '$injector',
		'platformContainerControllerService',
		'platformGridAPI',
		'platformPermissionService',
		'productionplanningMountingContainerInformationService',
		'productionplanningReportTimeSheetContainerService',
		'basicsCommonToolbarExtensionService'];

	function TimeSheetListController($scope, $injector,
									 platformContainerControllerService,
									 platformGridAPI,
									 platformPermissionService,
									 mountingContainerInformationService,
									 timeSheetContainerService,
									 basicsCommonToolbarExtensionService) {

		var reportGUID = '518268e717e2413a8107c970919eea85';
		var dynamicReportService = mountingContainerInformationService.getContainerInfoByGuid(reportGUID).dataServiceName;


		var containerUid = $scope.getContentValue('uuid');
		var originLayout = 'f690bd4b069d48cc995447dc5776899d';
		var initConfig = {
			id: containerUid,
			layout: containerUid,
			usedLayout: originLayout,
			moduleName: moduleName
		};

		var dialogConfig =
		{
			headerText: 'productionplanning.report.timesheet.PoolResources',
			listGridID: 'fe781ce6e7cb40118ca04a65bcfddbf9',
			listServiceName: 'timeSheetDialogResourceListService',
			listColumnsServiceName: 'timeSheetDialogResourceListColumns',

			isShowTreeview: false
		};

		if (!mountingContainerInformationService.hasDynamic(containerUid)) {
			timeSheetContainerService.prepareGridConfig(containerUid,
				mountingContainerInformationService, initConfig, dynamicReportService, dialogConfig);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);

		var timeSheetDataService = mountingContainerInformationService.getContainerInfoByGuid(containerUid).dataServiceName;
		//set custom tools(with permission)
		function setPermission(tool,permission) {
			if (_.isString(tool.permission)) {
				var split = tool.permission.split('#');
				tool.permission = {};
				tool.permission[permission] = platformPermissionService.permissionsFromString(split[1]);
			}
		}
		var tool = {
			id: 't1',
			caption: 'productionplanning.report.timesheet.AutoCreate',
			type: 'item',
			iconClass: 'tlb-icons ico-timesheet-autocreate',
			permission: '#c',
			fn: function createLink() {
				timeSheetDataService.createDialog();
			},
			disabled: function () {
				return !timeSheetDataService.canCreate();
			}
		};
		var permission = $scope.getContentValue('permission');
		setPermission(tool,permission);
		basicsCommonToolbarExtensionService.insertBefore($scope, tool);

		var onCellChange = function (e, args) {
			var col = args.grid.getColumns()[args.cell].field;
			if (col === 'BreakTime') {
				timeSheetDataService.updateHadBreak(args.item);
			}
		};

		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
		});
	}
})();