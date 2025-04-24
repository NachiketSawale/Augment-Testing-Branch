/**
 * Created by anl on 4/22/2020.
 */


(function () {
	/*global angular*/
	'use strict';
	var moduleName = 'productionplanning.report';

	angular.module(moduleName).controller('productionplanningReportTimeSheetListController', ReportTimeSheetListController);

	ReportTimeSheetListController.$inject = ['$scope', 'platformContainerControllerService',
		'platformGridAPI',
		'productionplanningReportContainerInformationService',
		'productionplanningReportTimeSheetContainerService',
		'productionplanningReportReportDataService',
		'platformPermissionService',
		'basicsCommonToolbarExtensionService'];

	function ReportTimeSheetListController($scope, platformContainerControllerService,
										  platformGridAPI,
										  reportContainerInformationService,
										  reportTimeSheetContainerService,
										  reportDataService,
										  platformPermissionService,
										  basicsCommonToolbarExtensionService) {

		var containerUid = $scope.getContentValue('uuid');
		var originLayout = 'f690bd4b069d48cc995447dc5776899d';
		var initConfig = {
			id: containerUid,
			layout: containerUid,
			usedLayout: originLayout,
			moduleName: moduleName
		};


		var dialogConfig = {
			headerText: 'productionplanning.report.timesheet.PoolResources',
			listGridID: 'fe781ce6e7cb40118ca04a65bcfddbf9',
			listServiceName: 'productionplanningReportTimeSheetDialogResourceListService',
			listColumnsServiceName: 'productionplanningReportTimeSheetDialogResourceListColumns',

			isShowTreeview: false
		};

		if (!reportContainerInformationService.hasDynamic(containerUid)) {
			reportTimeSheetContainerService.prepareGridConfig(containerUid,
				reportContainerInformationService, initConfig, reportDataService, dialogConfig);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);

		var timeSheetContainerInfo = reportContainerInformationService.getContainerInfoByGuid(containerUid);
		var timeSheetDataService = timeSheetContainerInfo.dataServiceName;
		//var timeSheetValidationService = timeSheetContainerInfo.validationServiceName;

		//set custom tools(with permission)
		function setPermission(tool, permission) {
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
			sort: 1,
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
		setPermission(tool, permission);
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