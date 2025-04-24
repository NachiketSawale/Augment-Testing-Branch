
(function (angular) {
	'use strict';

	angular.module('controlling.generalcontractor').controller('controllingGeneralContractorBudgetShiftWizardController',
		['_', '$timeout', '$scope', '$injector', '$translate','platformGridControllerService','platformGridAPI', 'basicsLookupdataLookupFilterService',
			'controllingGeneralContractorBudgetShiftWizardUiService',
			'controllingGeneralContractorBudgetShiftWizardDataService',
			function (_, $timeout, $scope, $injector, $translate, platformGridControllerService, platformGridAPI, basicsLookupdataLookupFilterService,
				gridUIConfigService,
				gridDataService) {
				$scope.gridId = '81D7FE4E05D543BBA5E8C99C95C3414B';
				$scope.options = $scope.$parent.modalOptions;
				// $scope.dataItem = $scope.options.dataItem;
				$scope.modalOptions = {
					headerText: $scope.options.headerText,
					closeButtonText: $translate.instant('basics.common.cancel'),
					actionButtonText: $translate.instant('basics.common.ok')
				};

				$scope.getContainerUUID = function () {
					return $scope.gridId;
				};

				$scope.setTools = function (tools) {
					tools.update = function () {
						tools.version += 1;
					};
				};

				$scope.tools = {
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: [
						{
							id: 'create',
							sort: 0,
							caption: 'cloud.common.taskBarNewRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-new',
							fn: function () {
								gridDataService.createItem();
							},
							disabled: true
						},
						{
							id: 'delete',
							sort: 10,
							caption: 'cloud.common.taskBarDeleteRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-delete',
							fn: function () {
								gridDataService.deleteItem();
							},
							disabled: true
						}
					],
					update: function () {
					}
				};

				$scope.noPinProjectError = {
					show: false,
					messageCol: 1,
					message: $translate.instant('controlling.generalcontractor.noPinnedProject'),
					iconCol: 1,
					type: 3
				};

				$scope.othererror = {
					show: false,
					messageCol: 1,
					message: $translate.instant('controlling.generalcontractor.NoSelectedCostControl'),
					iconCol: 1,
					type: 1
				};

				(function(){
					$scope.noPinProjectError.show  = $scope.othererror.show = false;
					let cloudDesktopPinningContextService = $injector.get('cloudDesktopPinningContextService');
					let item = cloudDesktopPinningContextService.getPinningItem('project.main');
					if (!item) {
						$scope.noPinProjectError.show = true;
					}
					let costControl = $injector.get('controllingGeneralcontractorCostControlDataService').getSelected();
					if(!costControl){
						$scope.othererror.show = true;
					}

					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}

					platformGridControllerService.initListController($scope, gridUIConfigService, gridDataService, null, {
						columns: [],
						type: 'BudgetShifts',
						skipPermissionCheck: true,
						grouping: false,
						enableColumnReorder: false,
						enableConfigSave: false
					});

					$scope.isReady = true;
					gridDataService.loadData().then(function (){
						$timeout(function (){platformGridAPI.grids.resize($scope.gridId);});

						angular.forEach($scope.tools.items, function (item) {
							if (item.id === 'create'){
								item.disabled = !gridDataService.isAnyBudgetToShift() || gridDataService.isBudgetShiftFinish();
							}
							else if (item.id === 'delete'){
								item.disabled = true;
							}
						});

						gridDataService.gridRefresh();
					});

					gridDataService.setScope($scope);
				})();

				$scope.hasErrors = function checkForErrors() {
					return $scope.noPinProjectError.show || $scope.othererror.show || gridDataService.hasAnyError() || $scope.isLoading;
				};

				$scope.onOK = function () {
					if (!$scope.hasErrors()) {
						$scope.isLoading = true;
						gridDataService.createBudgetShift().then(function (response){
							if(response && response.data){
								!response.data.Error && !response.data.Warning && $injector.get('controllingGeneralcontractorCostControlDataService').refresh();

								response.data.Error && $injector.get('platformModalService').showMsgBox(response.data.Error, $translate.instant('controlling.generalcontractor.GenerateBudgetShiftTitle'), 'error');

								response.data.Warning && $injector.get('platformModalService').showMsgBox(response.data.Warning, $translate.instant('controlling.generalcontractor.GenerateBudgetShiftTitle'), 'warning');

								console.log(response.data.TimeSb)
							}

							$scope.isLoading = false;
							$scope.$close({ok: true, data: $scope.dataItem});
						}, function(/* err */){
							$scope.isLoading = false;
							$scope.$close({ok: true, data: $scope.dataItem});
						});
					}
				};

				$scope.onCancel = function () {
					$scope.$close({});
				};

				$scope.modalOptions.cancel = function () {
					$scope.$close(false);
				};

				function onChangeGridContent() {
					let selected = platformGridAPI.rows.selection({
						gridId: $scope.gridId
					});
					selected = _.isArray(selected) ? selected[0] : selected;

					_.forEach($scope.tools.items, function (item) {
						if (item.id === 'create'){
							item.disabled = !gridDataService.isAnyBudgetToShift() || gridDataService.isBudgetShiftOverproof() || gridDataService.isBudgetShiftFinish();
						}
						else if (item.id === 'delete'){
							item.disabled = !selected || selected.SorurceType || gridDataService.getList().length === 2;
						}
					});
					$scope.tools.update();
				}

				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);

				let lookupFilter = [
					{
						key: 'est-prj-controlling-unit-filter',
						serverSide: true,
						serverKey: 'controlling.structure.prjcontrollingunit.filterkey',
						fn: function () {
							return 'ProjectFk=' + $injector.get('estimateMainService').getProjectId();
						}
					}
				];

				basicsLookupdataLookupFilterService.registerFilter(lookupFilter);

				function reloadMainContainer(){
					$injector.get('controllingGeneralcontractorCostControlDataService').refresh();
					$scope.isLoading = false;
					$scope.$close({ok: true, data: $scope.dataItem});
				}

				$injector.get('platformConcurrencyExceptionHandler').registerConcurrencyExceptionHandler(reloadMainContainer);

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					basicsLookupdataLookupFilterService.unregisterFilter(lookupFilter);

					$injector.get('platformConcurrencyExceptionHandler').unregisterConcurrencyExceptionHandler(reloadMainContainer);
				});
			}
		]
	);
})(angular);
