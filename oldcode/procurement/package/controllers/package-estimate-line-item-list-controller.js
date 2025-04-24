/**
 * Created by zos on 9/9/2015.
 */
(function (angular) {

	'use strict';
	var moduleName = 'estimate.main';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/**
	 * @ngdoc controller
	 * @name estimateMainLineItemListController
	 * @function
	 * @description
	 * Controller for the  list view of Estimate Line Item entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('packageEstimateLineItemListController',
		['$scope', '$injector', 'platformGridControllerService', 'procurementPackageEstimateLineItemDataService', 'packageEstimateLineitemUIStandardService',
			'procurementPackageEstimateResourceDataService', 'modelViewerStandardFilterService', 'packageEstLineItemDynamicConfigurationService',
			function ($scope, $injector, platformGridControllerService, lineItemDataService, lineitemUIStandardService,
				estimateResourceDataService, modelViewerStandardFilterService, packageEstLineItemDynamicConfigurationService) {

				var myGridConfig = {
					initCalled: false,
					columns: [],
					cellChangeCallBack: function cellChangeCallBack(arg) {
						var resourceList = estimateResourceDataService.getList();
						var col = arg.grid.getColumns()[arg.cell].field;

						if (col === 'PrcPackageFk') {
							var selectedLineItem = lineItemDataService.getSelected();
							if (selectedLineItem && selectedLineItem.Id && selectedLineItem.EstLineItemFk === null && resourceList.length > 0) {
								angular.forEach(resourceList, function (res) {
									res.PrcPackageFk = selectedLineItem.PrcPackageFk;
									estimateResourceDataService.markItemAsModified(res);
								});
							}
						}
					}
				};

				// set the all column readonly except prcpackagefk
				angular.forEach(lineitemUIStandardService.getStandardConfigForListView().columns, function (entity) {
					if (entity.field !== 'PrcPackageFk') {
						entity.editor = null;
						entity.readonly = true;
					}
				});

				lineItemDataService.canCreate = lineItemDataService.canDelete = function () {
					return false;
				};

				platformGridControllerService.initListController($scope, packageEstLineItemDynamicConfigurationService, lineItemDataService, {}, myGridConfig);

				var platformGridAPI = $injector.get('platformGridAPI');

				// noinspection JSUnusedLocalSymbols
				function getLineItemSelectedItems(e, arg) {
					lineItemDataService.getLineItemSelected(arg, platformGridAPI.rows.getRows($scope.gridId));
				}

				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', getLineItemSelectedItems);

				modelViewerStandardFilterService.attachMainEntityFilter($scope, lineItemDataService.getServiceName());

				function setDynamicColumnsLayoutToGrid() {
					packageEstLineItemDynamicConfigurationService.applyToScope($scope);
				}

				packageEstLineItemDynamicConfigurationService.registerSetConfigLayout(setDynamicColumnsLayoutToGrid);

				var createBtnIdx = _.findIndex($scope.tools.items, function (item) {
					return item.id === 'create';
				});

				$scope.tools.items.splice(createBtnIdx, 1);

				var deleteBtnIdx = _.findIndex($scope.tools.items, function (item) {
					return item.id === 'delete';
				});

				$scope.tools.items.splice(deleteBtnIdx, 1);

				let parentService = $injector.get('procurementPackageDataService');
				$injector.get('procurementCommonFilterJobVersionToolService').registerToolEvent($scope, lineItemDataService, parentService);
				$scope.$on('$destroy', function () {
					platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', getLineItemSelectedItems);
					packageEstLineItemDynamicConfigurationService.unregisterSetConfigLayout(setDynamicColumnsLayoutToGrid);
				});

			}
		]);
})(angular);
