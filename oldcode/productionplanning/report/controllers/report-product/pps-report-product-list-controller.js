/**
 * Created by anl on 4/22/2020.
 */


(function () {
	/*global angular*/
	'use strict';
	var moduleName = 'productionplanning.report';

	angular.module(moduleName).controller('productionplanningReportProductListController', ReportProductListController);

	ReportProductListController.$inject = ['$scope', 'platformContainerControllerService',
		'platformGridAPI', '$timeout',
		'productionplanningReportContainerInformationService',
		'productionplanningReportProductContainerService',
		'productionplanningReportReportDataService',
		'platformPermissionService',
		'basicsCommonToolbarExtensionService',
		'productionplanningProductDocumentDataProviderFactory',
		'ppsDocumentToolbarButtonExtension'];

	function ReportProductListController($scope, platformContainerControllerService,
		platformGridAPI, $timeout,
		reportContainerInformationService,
		reportProductContainerService,
		reportDataService,
		platformPermissionService,
		basicsCommonToolbarExtensionService,
		productDocumentDataProviderFactory,
		ppsDocumentToolbarButtonExtension) {

		var containerUid = $scope.getContentValue('uuid');
		var originLayout = 'af02d448a61b4e048dc76d7cedf76bfa';
		var initConfig = {
			id: containerUid,
			layout: containerUid,
			usedLayout: originLayout,
			moduleName: moduleName
		};

		if (!reportContainerInformationService.hasDynamic(containerUid)) {
			reportProductContainerService.prepareGridConfig(containerUid,
				reportContainerInformationService, initConfig, reportDataService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);

		var reportProductContainerInfo = reportContainerInformationService.getContainerInfoByGuid(containerUid);
		var reportProductDataService = reportProductContainerInfo.dataServiceName;
		//var reportProductValidationService = reportProductContainerInfo.validationServiceName;

		var setCellEditable = function () {
			return false;
		};

		//set custom tools(with permission)
		function setPermission(tool, permission) {
			if (_.isString(tool.permission)) {
				var split = tool.permission.split('#');
				tool.permission = {};
				tool.permission[permission] = platformPermissionService.permissionsFromString(split[1]);
			}
		}

		var permission = $scope.getContentValue('permission');
		var delRefTool = {
			id: 'deleteReportProductRef',
			caption: 'cloud.common.deleteReference',
			type: 'item',
			iconClass: 'tlb-icons ico-reference-delete',
			permission: '#d',
			fn: function deleteRef() {
				reportProductDataService.deleteSelection();
			},
			disabled: function () {
				return !reportProductDataService.canDeleteRef();
			}
		};
		setPermission(delRefTool, permission);

		var creRefTool = {
			id: 'createReportProductRef',
			caption: 'cloud.common.createReference',
			type: 'item',
			iconClass: 'tlb-icons ico-reference-add',
			permission: '#c',
			fn: function createRef() {
				reportProductDataService.assignedProduct();
			},
			disabled: function () {
				return !reportProductDataService.canCreateRef();
			}
		};
		setPermission(creRefTool, permission);
		basicsCommonToolbarExtensionService.insertBefore($scope, [creRefTool, delRefTool], -1);

		(function extendPpsDocumentActionButtons() {
			const docTypes = productDocumentDataProviderFactory.ppsDocumentTypes;
			ppsDocumentToolbarButtonExtension.extendDocumentButtons(docTypes, $scope, reportProductDataService);
		})();

		var updateTools = function () {
			if ($scope.tools) {
				$timeout($scope.tools.update, 50);
			}else{
				$scope.updateTools();
			}
		};
		reportProductDataService.registerSelectionChanged(updateTools);

		platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', setCellEditable);
		});
	}
})();