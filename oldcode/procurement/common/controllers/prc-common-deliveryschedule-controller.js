// / <reference path='../services/deliveryScheService.js' />

(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name procurementCommonDeliveryScheduleListController
	 * @require $rootScope, $scope, procurementCommonDeliveryScheduleDataService, procurementCommonDeliveryscheduleColumns, procurementCommonPrcItemDataService, $q
	 * @description controller for delivery schedule
	 */
	angular.module('procurement.common').controller('procurementCommonDeliveryScheduleListController',
		['platformGridControllerService', '$translate', '$scope', 'procurementContextService',
			'procurementCommonDeliveryScheduleDataService', 'procurementCommonItemdeliveryUIStandardService',
			'procurementCommonDeliveryScheduleValidationService', 'procurementCommonPrcItemDataService',
			'platformTranslateService', 'procurementCommonHelperService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function (gridControllerService, $translate, $scope, moduleContext, dataServiceFactory, uiService, validationService,
			          procurementCommonPrcItemDataService, platformTranslateService, procurementCommonHelperService) {

				var dataService = dataServiceFactory.getService(moduleContext.getItemDataService());

				validationService = validationService(dataService);
				var gridConfig = {
					initCalled: false,
					columns: [],
					enableConfigSave: true
				};

				function ItemTypeChange() {
					$scope.parentItem = dataService.parentService().getSelected();
					if($scope.parentItem) {
						let itemTypeFk = $scope.parentItem.BasItemTypeFk;
						updateTools(itemTypeFk);
						let itemList = dataService.getList();
						_.forEach(itemList,(item)=>{
							dataService.readonlyFieldsByItemType(item,itemTypeFk);
						});
					}
				}
				function updateTools(itemTypeFk){
					var tools = $scope.tools;
					if(tools) {
						_.forEach($scope.tools.items, (item) => {
							if (item.id === 'create' || item.id === 'delete') {
								if (itemTypeFk === 7) {
									item.disabled = true;
								} else {
									item.disabled = false;
								}
							}
						});
						$scope.tools.update();
					}
				}
				dataService.updateToolsEvent.register(ItemTypeChange);

				dataService.parentService().registerSelectionChanged(onParentItemChanged);

				function onParentItemChanged() {
					$scope.parentItem = dataService.parentService().getSelected();
					if($scope.parentItem) {
						let itemTypeFk = $scope.parentItem.BasItemTypeFk;
						updateTools(itemTypeFk);
						let itemList = dataService.getList();
						_.forEach(itemList,(item)=>{
							dataService.readonlyFieldsByItemType(item,itemTypeFk);
						});
					}
				}

				gridControllerService.initListController($scope, uiService, dataService, validationService, gridConfig);

				// create form configure from ui service
				var formConfig = uiService.getStandardConfigForDetailView();
				formConfig.groups = formConfig.groups.filter(function (group) {
					return group.gid === 'quantityTitle';
				});

				formConfig.rows = formConfig.rows.filter(function (row) {
					return row.gid === 'quantityTitle';
				});
				formConfig.fid = formConfig.fid + '.Total';
				formConfig.showGrouping = false;
				$scope.formContainerOptions = {
					formOptions: {
						configure: formConfig, showButtons: [], validationMethod: function () {
						}
					}, statusInfo: function () {
					}
				};
				// end form config

				$scope.Scheduled = dataService.Scheduled;

				// binding module readOnly handler
				var moduleReadOnlyStatusHandler = new procurementCommonHelperService.ModuleStatusHandler();
				moduleReadOnlyStatusHandler.bindGridReadOnlyListener($scope.gridId); // bind listener
				$scope.$on('$destroy', function () {
					moduleReadOnlyStatusHandler.unbindGridReadOnlyListener($scope.gridId); // unbind listener
				});
			}]);
})(angular);