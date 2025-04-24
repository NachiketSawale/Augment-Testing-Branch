/**
 * Created by zwz on 5/15/2019.
 */
(function (angular) {
	'use strict';
	/* globals angular, globals, _ */
	var module = 'productionplanning.drawing';

	angular.module(module).controller('productionplanningDrawingComponentCommonListController', ListController);

	ListController.$inject = [
		'$q',
		'$scope', '$injector', '$translate', '$http',
		'platformGridAPI',
		'platformGridControllerService',
		'productionplanningDrawingComponentUIStandardService',
		'productionplanningDrawingComponentDataService',
		'productionplanningDrawingComponentValidationService',
		'basicsCommonToolbarExtensionService',
		'ppsDrawingPickComponentsService',
		'ppsPlannedQuantityPreviewedComponentsHandler',
		'productionplanningDrawingDefaultQuantityAssignmentGridsUIConfig',
		'platformModalService',
		'platformPermissionService'];

	function ListController($q, $scope, $injector, $translate, $http,
		platformGridAPI,
		platformGridControllerService,
		uiStandardServiceFactory,
		dataServiceFactory,
		validationServiceFactory,
		basicsCommonToolbarExtensionService,
		ppsDrawingPickComponentsService,
		ppsPlannedQuantityPreviewedComponentsHandler,
		defaultQuantityAssignmentGridsUIConfig,
		platformModalService,
		platformPermissionService) {

		var gridConfig = {initCalled: false, columns: []};

		// get environment variable from the module-container.json file
		var serviceOptions = $scope.getContentValue('serviceOptions');
		var dataServ = dataServiceFactory.getService(serviceOptions);
		let uiService = uiStandardServiceFactory.getService(dataServ, !!serviceOptions.isReadonly);
		platformGridControllerService.initListController($scope, uiService, dataServ, validationServiceFactory.getService(dataServ), gridConfig);

		if (serviceOptions.parentService === 'productionplanningItemDataService') {
			let parentService = $injector.get('productionplanningItemDataService');
			let disabledFn = function () {
				if (parentService && parentService.getSelected()) {
					return !parentService.getSelected().ProductDescriptionFk;
				}
				return true;
			};

			// remove "new record" button if permission of descriptor "18edd6dbed9941ce99f0b60171be75ed" has no execution
			if (!platformPermissionService.hasExecute('18edd6dbed9941ce99f0b60171be75ed')) {
				_.remove($scope.tools.items, function (item) {
					return item.id === 'create';
				});
			}
			// add pickBtn. remark: permission of descriptor "57f6b42b88cf4748afb725d1db824289" has been loaded in initialization of pps item module(see in pps-item-module.js).
			if (platformPermissionService.hasExecute('57f6b42b88cf4748afb725d1db824289')) {
				var pickBtn = {
					id: 'pickComponents',
					sort: 0,
					caption: $translate.instant('productionplanning.drawing.pickComponents.dialogTitle'),
					type: 'item',
					iconClass: 'tlb-icons ico-add-extend',
					fn: function () {
						ppsDrawingPickComponentsService.showDialog(parentService.getSelected());
					},
					disabled: disabledFn
				};
				basicsCommonToolbarExtensionService.insertBefore($scope, pickBtn);
			}
			// add qtyAssimtBtn

			// HACKCODE: For fixing an issue that can only be reproduced in trunk(daily)/rel6.2/rel6.1 when there is no corresponding BAS_MODULEUICONFIG records of the logined user.(it's ok in rel6.0, it's relative to code-changes about platformgrid after rel6.0)
			// As a temporary solution, here we check if has corrsponding grid config. If not, then set the grid config in advanced, and the issue is fixed.
			// by zwz for ticket #141573 on 2023/4/24
			let mainViewService = $injector.get('mainViewService');
			let uuids = ['192155d838ed413ab72960af7188b597', '23d0092349d7422abe3558a92847b61a', '320a0fab4fef4dc08e6857e4a8d53731'];
			_.each(uuids, (uuid) => {
				if (!mainViewService.hasModuleConfig(uuid, 's') &&
					!mainViewService.hasModuleConfig(uuid, 'r') &&
					!mainViewService.hasModuleConfig(uuid, 'u')) {
					$http.get(globals.webApiBaseUrl + 'basics/layout/getuiconfig?uuid=' + uuid).then((response) => {
						if (_.isEmpty(response) || _.isEmpty(response.data)) {
							const gridConfig = defaultQuantityAssignmentGridsUIConfig[uuid];
							mainViewService.setModuleConfig(gridConfig.uuid, gridConfig.propertyConfig, gridConfig.grouping, gridConfig.gridInfo);
						}
					});
				}
			});

			let isShowingQtyAssimtDialog = false;
			let qtyAssimtBtn = {
				id: 'assignQuantity',
				sort: 0,
				caption: $translate.instant('productionplanning.drawing.quantityAssignment.dialogTitle'),
				type: 'item',
				iconClass: 'tlb-icons ico-add-composite-model',
				fn: function () {
					isShowingQtyAssimtDialog = true;
					$injector.get('ppsPlannedQuantitiyAssginmentDialogLayoutHandler').loadLatestLayoutConfig()
						.then(() => {
							let selectedPU = parentService.getSelected();
							let modalCreateConfig = {
								width: '80%',
								height: '80%',
								resizeable: true,
								templateUrl: globals.appBaseUrl + 'productionplanning.item/templates/pps-planned-quantity-assignment-dialog.html',
								controller: 'ppsPlannedQuantitiyAssginmentDialogController',
								resolve: {
									'$options': function () {
										return {
											selectedPU: selectedPU,
											drwCompDataService: dataServ,
											drwCompUIStdService: uiService
										};
									}
								}
							};
							platformModalService.showDialog(modalCreateConfig).then(function () {
								isShowingQtyAssimtDialog = false;
								$scope.tools.update();
							});
						});
				},
				disabled: () => {
					return isShowingQtyAssimtDialog || disabledFn();
				}
			};
			basicsCommonToolbarExtensionService.insertBefore($scope, qtyAssimtBtn);

			// make records readonly if they were imported
			dataServ.addDataProcessor({
				processItem: item => {
					if (item.Isimported || item.IsReadonly) {
						$injector.get('platformRuntimeDataService').readonly(item, true);
					}
				},
			});
		}
	}
})(angular);

(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.drawing';
	angular.module(moduleName).constant('productionplanningDrawingDefaultQuantityAssignmentGridsUIConfig', {
		// PlannedQuantityGrid
		'192155d838ed413ab72960af7188b597': {
			uuid: '192155d838ed413ab72960af7188b597',
			gridInfo:
				{
					'showFilterRow': true,
					'showMainTopPanel': false,
					'statusBar': false,
					'markReadonlyCells': false,
					'allowCopySelection': false
				},
			grouping:
				{
					'groups': [],
					'sortColumn': 'null',
					'groupColumnWidth': 250
				},
			propertyConfig: [
				{
					'id': 'description',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 200,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'quantity',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 100,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'basuomfk',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 150,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'basuomfkdescription',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 60,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'userdefined1',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 200,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'userdefined2',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 200,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'userdefined3',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 200,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'userdefined4',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 200,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'userdefined5',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 200,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'assigningQuantity',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 120,
					'pinned': true,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'assignableQuantity',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 150,
					'pinned': true,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'assigningQuantityOneUnit',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 150,
					'pinned': true,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'resourcetypefk',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 150,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'boqestitemresfk',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 70,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'boqheaderfk',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 75,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'ppsplannedquantitytypefk',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 150,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'propertymaterialcostcodefk',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 70,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'commenttext',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 200,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'mdcproductdescriptionfk',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 150,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'prjlocationfk',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 150,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'prjlocationfkdescription',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 60,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'duedate',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 100,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				}
			]
		},
		// PlannedQuantityChildrenGrid
		'23d0092349d7422abe3558a92847b61a': {
			uuid: '23d0092349d7422abe3558a92847b61a',
			gridInfo:
				{
					'showFilterRow': true,
					'showMainTopPanel': false
				},
			grouping:
				{
					'groups': [],
					'sortColumn': 'null',
					'groupColumnWidth': 250
				},
			propertyConfig: [
				{
					'id': 'description',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 200,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'quantity',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 100,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'basuomfk',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 150,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'basuomfkdescription',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 60,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'userdefined1',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 200,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'userdefined2',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 200,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'userdefined3',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 200,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'userdefined4',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 200,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'userdefined5',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 200,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'resourcetypefk',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 150,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'boqestitemresfk',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 70,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'boqheaderfk',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 75,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'ppsplannedquantitytypefk',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 150,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'propertymaterialcostcodefk',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 70,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'commenttext',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 200,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'mdcproductdescriptionfk',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 150,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'prjlocationfk',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 150,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'prjlocationfkdescription',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 60,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'duedate',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 100,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				}
			]
		},
		// drawingComponentPreviewGrid
		'320a0fab4fef4dc08e6857e4a8d53731': {
			uuid: '320a0fab4fef4dc08e6857e4a8d53731',
			gridInfo:
				{
					'showFilterRow': true,
					'showMainTopPanel': false,
					'statusBar': false,
					'markReadonlyCells': false,
					'allowCopySelection': false
				},
			grouping:
				{
					'groups': [],
					'sortColumn': 'null',
					'groupColumnWidth': 250
				},
			propertyConfig: [
				{
					'id': 'description',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 200,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'engdrwcompstatusfk',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 150,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'engdrwcomptypefk',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 150,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'mdcmaterialcostcodefk',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 70,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'materialCostcodeDes',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 70,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'materialGroup',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 70,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'materialCatalog',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 70,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'remark',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 200,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'islive',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 30,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'sorting',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 75,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'quantity',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 100,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'basuomfk',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 150,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'basuomfkdescription',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 60,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'quantity2',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 100,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'uom2fk',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 150,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'uom2fkdescription',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 60,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'quantity3',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 100,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'uom3fk',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 150,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'uom3fkdescription',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 60,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'engaccountingrulefk',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 90,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'engaccrulesetresultfk',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 90,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'isimported',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 30,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'userdefined1',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 200,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'userdefined2',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 200,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'userdefined3',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 200,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'userdefined4',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 200,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'userdefined5',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': true,
					'width': 200,
					'pinned': false,
					'sort': false,
					'columnFilterString': ''
				},
				{
					'id': 'insertedat',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': false,
					'width': 150,
					'pinned': false,
					'columnFilterString': ''
				},
				{
					'id': 'insertedby',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': false,
					'width': 150,
					'pinned': false,
					'columnFilterString': ''
				},
				{
					'id': 'updatedat',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': false,
					'width': 150,
					'pinned': false,
					'columnFilterString': ''
				},
				{
					'id': 'updatedby',
					'labelCode': '',
					'keyboard': {
						'enter': true,
						'tab': true
					},
					'hidden': false,
					'width': 150,
					'pinned': false,
					'columnFilterString': ''
				}
			]
		}

	});
})(angular);