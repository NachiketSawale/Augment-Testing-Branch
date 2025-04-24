
(function (angular) {
	'use strict';
	let moduleName = 'controlling.generalcontractor';
	angular.module(moduleName).controller('controllingGeneralContractorCostHeaderListController',
		['$scope', '$timeout','_','$injector','$translate','moment', 'platformContainerControllerService','controllingGeneralcontractorControllerFeaturesServiceProvider','controllingGeneralcontractorCostControlDataService','platformPermissionService','permissions','platformGridAPI',
			'basicsLookupdataPopupService',
			function ($scope, $timeout,_,$injector,$translate,moment, platformContainerControllerService,controllerFeaturesServiceProvider,dataService,platformPermissionService,permissions,platformGridAPI,
				basicsLookupdataPopupService) {
				platformContainerControllerService.initController($scope, moduleName, '363147351C1A426B82E3890CF661493D');

				controllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);

				function updateTools() {
					$scope.tools.items = _.filter($scope.tools.items,function (d) {
						return d.id==='t108' || d.id ==='gridSearchAll' ||
							d.id ==='gridSearchColumn' || d.id ==='t200'|| d.id ==='collapsenode' ||
							d.id ==='expandnode'|| d.id ==='collapseall' || d.id ==='expandall';
					});

					let settingsBtn = _.find($scope.tools.items,function (item) {
						return item.id ==='t200';
					});

					settingsBtn.list.items = _.filter(settingsBtn.list.items,function (item) {
						return item.id !== 't155';
					});

					let button = {
						id: 't255',
						sort: 200,
						caption$tr$: 'cloud.common.markReadonlyCells',
						type: 'check',
						fn: function () {
							platformGridAPI.grids.markReadOnly($scope.gridId, this.value);
						}
					};

					settingsBtn.list.items.push(button);

					$timeout(function () {
						$scope.tools.update();
					});
				}

				updateTools();

				dataService.setGridId($scope.gridId);
				// update header info
				dataService.setShowHeaderAfterSelectionChanged(function (headerItem) {
					dataService.updateModuleHeaderInfo(headerItem);
				});
				dataService.updateModuleHeaderInfo();

				function refreshCostControl() {
					$injector.get ('controllingGeneralContractorSalesContractsDataService').refreshSalesContracts();
					$injector.get('controllingGeneralContractorEstimateDataService').refreshData();
				}

				dataService.registerRefreshRequested(refreshCostControl);
				dataService.loadCostControl();

				let sb = $scope.getUiAddOns().getStatusBar();

				let data = {
					changedEvent: new Platform.Messenger(),
					dueDate: moment()
				};

				$timeout(function () {
					sb.setVisible(false);

					let settingsBtn = _.find($scope.tools.items,function (item) {
						return item.id ==='t200';
					});

					let markReadOnlyBtn = _.filter(settingsBtn.list.items, {id: 't255'});
					_.forEach(markReadOnlyBtn,function (item) {
						item.value = platformGridAPI.grids.getMarkReadonly($scope.gridId);
					});
				},200);

				function updateDueDateField(selectedDueDate){

					let dueDateItems = _.map(dataService.getDueDates(),function (item) {
						data.dueDate = moment(item);
						return {
							id: item,
							caption: data.dueDate.format('L'),
							type: 'check',
							value: selectedDueDate && selectedDueDate === item,
							fn: function (e, args) {

								if(args.value){
									_.forEach(dueDateItems,function (btn) {
										if(args.id !== btn.id){
											btn.value = false;
										}
									});
								}

								dataService.setSelectedDueDate(args.value ? args.id:null);
								let formatSelectedDueDate = args.value ? moment(args.id).format('L'):null;
								updateDateLebel(formatSelectedDueDate);
								$scope.statusBarInfo.customDate = '';

								dataService.load().then(function (){
									sb.setVisible(false);
									dataService.onDueDatesChanged.fire();
								});
								if ($scope.tools) {
									$scope.tools.update();
								}
							}
						};
					});

					function updateDueDateFieldInternal(){
						$scope.statusBarInfo.dateFields.list.items = dueDateItems;
					}

					updateDueDateFieldInternal();
				}

				$scope.statusBarInfo = {
					customDate: '',
					currentFilterType: 0,
					selectedDate: null,
					filterTypeLabel: $translate.instant('controlling.generalcontractor.dueDate'),
					dateFields: {
						align: 'right',
						disabled: false,
						ellipsis: false,
						id:'dueDate',
						type: 'dropdown-btn',
						visible: true,
						list: {
							initOnce: true,
							items: [],
							level: 0
						}
					},
					filterTypeFields:{
						align: 'right',
						disabled: false,
						ellipsis: false,
						id:'dueDate',
						type: 'dropdown-btn',
						visible: true,
						list: {
							initOnce: true,
							items: [
								{
									id: 'item1',
									caption: $translate.instant('controlling.generalcontractor.dueDate'),
									type: 'check',
									value: null,
									isDisplayed: true,
									fn: function () {
										if($scope.statusBarInfo.currentFilterType === 0){
											return;
										}
										$scope.statusBarInfo.currentFilterType = 0;
										$scope.statusBarInfo.filterTypeLabel = $translate.instant('controlling.generalcontractor.dueDate');
										$scope.statusBarInfo.filterTypeFields.list.items[0].value = $translate.instant('controlling.generalcontractor.dueDate');
										$scope.statusBarInfo.filterTypeFields.list.items[1].value = null;
										if($scope.statusBarInfo.selectedDate){
											$scope.statusBarInfo.selectedDate = null;
											dataService.setSelectedDueDate(null);
											dataService.setIsNeedReLoad(true);
											dataService.loadCostControl();
										}
									}
								},
								{
									id: 'item2',
									caption: $translate.instant('controlling.generalcontractor.customDate'),
									type: 'check',
									value: null,
									isDisplayed: true,
									fn: function () {
										if($scope.statusBarInfo.currentFilterType === 1){
											return;
										}
										$scope.statusBarInfo.currentFilterType = 1;
										$scope.statusBarInfo.filterTypeLabel = $translate.instant('controlling.generalcontractor.customDate');
										$scope.statusBarInfo.filterTypeFields.list.items[0].value = null;
										$scope.statusBarInfo.filterTypeFields.list.items[1].value = $translate.instant('controlling.generalcontractor.customDate');
										if($scope.statusBarInfo.selectedDate){
											$scope.statusBarInfo.selectedDate = null;
											dataService.setSelectedDueDate(null);
											dataService.setIsNeedReLoad(true);
											dataService.loadCostControl();
										}
									}
								}
							],
							level: 0
						}
					}
				};

				let options = {
					multiPopup: false,
					plainMode: true,
					hasDefaultWidth: false
				};
				$scope.openDueDate = function (){

					let instance = basicsLookupdataPopupService.toggleLevelPopup($.extend({}, options, {
						scope: $scope,
						focusedElement: $(event.currentTarget),
						template: '<div data-platform-menu-list data-list="statusBarInfo.dateFields.list" data-init-once data-popup></div>',
						level: 0
					}));
					if (!(_.isNull(instance) || _.isUndefined(instance))) {
						instance.opened.then(function () {
							$timeout(function () {
								$scope.$digest();
							}, 0);
						});
					}
				};

				$scope.openFilterType = function (){

					let instance = basicsLookupdataPopupService.toggleLevelPopup($.extend({}, options, {
						scope: $scope,
						focusedElement: $(event.currentTarget),
						template: '<div data-platform-menu-list data-list="statusBarInfo.filterTypeFields.list" data-init-once data-popup></div>',
						level: 0
					}));
					if (!(_.isNull(instance) || _.isUndefined(instance))) {
						instance.opened.then(function () {
							$timeout(function () {
								$scope.$digest();
							}, 0);
						});
					}
				};

				$scope.dateChange = function (){
					let selelctedDate = $scope.statusBarInfo.customDate && $scope.statusBarInfo.customDate !== '' ? $scope.statusBarInfo.customDate:null;
					dataService.setSelectedDueDate(selelctedDate ? selelctedDate._d.toISOString() : null);
					updateDateLebel(selelctedDate ? selelctedDate.format('L') : null);

					dataService.load().then(function (){
						sb.setVisible(false);
						dataService.onDueDatesChanged.fire();
					});
					if ($scope.tools) {
						$scope.tools.update();
					}
				};

				function updateDateLebel(date){
					$scope.statusBarInfo.selectedDate = date  || '';
				}

				updateDueDateField(dataService.getSelectedDueDate());
				dataService.onLoadDueDates.register(updateDueDateField);

				$scope.$on ('$destroy', function () {
					dataService.onLoadDueDates.unregister(updateDueDateField);
					dataService.unregisterRefreshRequested(refreshCostControl);
				});
			}
		]);
})(angular);
