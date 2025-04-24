/**
 * Created by anl on 8/9/2017.
 */

(function () {
	/* global angular */
	'use strict';
	var moduleName = 'productionplanning.mounting';


	angular.module(moduleName).controller('productionplanningMountingReport2ProductListController', Report2ProductListController);

	Report2ProductListController.$inject = ['$scope', 'platformContainerControllerService',
		'productionplanningMountingContainerInformationService',
		'productionplanningReportProductContainerService',
		'platformGridAPI',
		'platformPermissionService',
		'$timeout',
		'basicsCommonToolbarExtensionService',
		'productionplanningProductDocumentDataProviderFactory',
		'ppsDocumentToolbarButtonExtension'];
	function Report2ProductListController($scope, platformContainerControllerService,
		mountingContainerInformationService,
		report2ProductContainerService,
		platformGridAPI,
		platformPermissionService,
		$timeout,
		basicsCommonToolbarExtensionService,
		productDocumentDataProviderFactory,
		ppsDocumentToolbarButtonExtension) {

		var reportGUID = '518268e717e2413a8107c970919eea85';
		var dynamicReportService = mountingContainerInformationService.getContainerInfoByGuid(reportGUID).dataServiceName;

		var containerUid = $scope.getContentValue('uuid');
		var originLayout = 'af02d448a61b4e048dc76d7cedf76bfa';
		var initConfig = {
			id: containerUid,
			layout: containerUid,
			usedLayout: originLayout,
			moduleName: moduleName
		};

		var dialogConfig =
		{
			needReloadData: true,
			headerText: 'productionplanning.common.product.listTitle',
			listGridID: 'r7rt78ec58614a82af2c4dbd07e981c2',
			listServiceName: 'mountingDialogProductListService',
			listColumnsServiceName: 'mountingDialogProductListColumns',

			isShowTreeview: false
		};

		if (!mountingContainerInformationService.hasDynamic(containerUid)) {
			report2ProductContainerService.prepareGridConfig(containerUid,
				mountingContainerInformationService, initConfig, dynamicReportService, dialogConfig);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);

		var containerInfo = mountingContainerInformationService.getContainerInfoByGuid(containerUid);
		var reportProductDataService = containerInfo.dataServiceName;
		// set custom tools(with permission)
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

		var setCellEditable = function () {
			return false;
		};

		var updateTools = function () {
			$timeout($scope.tools.update, 50);
		};
		reportProductDataService.registerSelectionChanged(updateTools);

		platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', setCellEditable);
		});

	}
})();