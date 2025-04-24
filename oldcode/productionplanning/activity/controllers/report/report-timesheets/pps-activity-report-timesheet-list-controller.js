/**
 * Created by anl on 2/5/2018.
 */

(function () {
	'use strict';

	var moduleName = 'productionplanning.activity';

	angular.module(moduleName).controller('productionplanningActivityTimeSheetListController', TimeSheetListController);

	TimeSheetListController.$inject = ['$scope', '$injector', '$translate',
		'platformContainerControllerService',
		'platformGridAPI','platformPermissionService',
		'productionplanningActivityContainerInformationService',
		'productionplanningReportTimeSheetContainerService',
		'basicsCommonToolbarExtensionService'];

	function TimeSheetListController($scope, $injector,
									 $translate,
									 platformContainerControllerService,
									 platformGridAPI,platformPermissionService,
									 activityContainerInformationService,
									 timeSheetContainerService,
									 basicsCommonToolbarExtensionService) {

		var reportGUID = '1435d4d81ed6429bb7cdcfb80ff39f2b';
		var dynamicReportService = activityContainerInformationService.getContainerInfoByGuid(reportGUID).dataServiceName;


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
			listServiceName: 'activityReportTimeSheetResourceDialogListService',
			listColumnsServiceName: 'activityReportTimeSheetResourceDialogListColumns',

			isShowTreeview: false
		};

		if (!activityContainerInformationService.hasDynamic(containerUid)) {
			timeSheetContainerService.prepareGridConfig(containerUid,
				activityContainerInformationService, initConfig, dynamicReportService, dialogConfig);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);

		var timeSheetDataService = activityContainerInformationService.getContainerInfoByGuid(containerUid).dataServiceName;

		function setPermission(tool,permission) {
			if (_.isString(tool.permission)) {
				var split = tool.permission.split('#');
				tool.permission = {};
				tool.permission[permission] = platformPermissionService.permissionsFromString(split[1]);
			}
		}
		var permission = $scope.getContentValue('permission');
		var tool = {
			id: 't1',
			caption: $translate.instant('productionplanning.report.timesheet.AutoCreate'),
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
		setPermission(tool,permission);
		//$scope.tools.items.unshift(tool);
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