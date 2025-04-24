
(function (angular){
	'use strict';

	let moduleName = 'estimate.main';
	angular.module(moduleName).controller('estimateMainStandardAllowancesController',
		['$scope', '_', '$timeout', 'globals','$injector','platformGridControllerService', 'estimateMainStandardAllowancesDataService','estimateMainStandardAllowancesConfigurationService',
			'estimateMainStandardAllowancesValidationService','platformGridAPI','$translate','$http','platformModalService','estimateMainService','estimateMainAllowanceCodeLookupService',
			'platformPermissionService','estimateMainResourceService',
			function ($scope,_,$timeout,globals,$injector,platformGridControllerService,estimateMainStandardAllowancesDataService,estimateMainStandardAllowancesConfigurationService,
				estimateMainStandardAllowancesValidationService,platformGridAPI,$translate,$http,platformModalService,estimateMainService,estimateMainAllowanceCodeLookupService,
				platformPermissionService, estimateMainResourceService) {
				let myGridConfig = {
					initCalled: false,
					type: 'lineItems',
					column:[],
					sortOption: {
						initialSortColumn:{field: 'code', id: 'code'},
						isAsc: true
					},
					rowChangeCallBack: function rowChangeCallBack() {
						let selectedItem = estimateMainStandardAllowancesDataService.getSelected();
						if(selectedItem.MdcAllowanceTypeFk < 3){
							$injector.get('estStandardAllowancesCostCodeDetailDataService').load();
						}
						if(selectedItem){
							setOriginalEntity(selectedItem);
						}
					}
				};

				function refreshRelateContainer(){
					let selectedItem = estimateMainStandardAllowancesDataService.getSelected();
					estimateMainService.load();
					if(selectedItem && selectedItem.MdcAllowanceTypeFk < 3 ){
						$injector.get('estStandardAllowancesCostCodeDetailDataService').load();
					} else if(selectedItem && selectedItem.MdcAllowanceTypeFk === 3){
						$injector.get('estimateMainAllowanceAreaService').load();
					}

					let totalGrid = platformGridAPI.grids.element('id', '07b7499a1f314f16a94edddc540c55d4');
					if(totalGrid && totalGrid.instance){
						$injector.get('estimateConfigTotalService').load();
					}
				}

				let tools = [
					{
						id: 'estimate-main-config-total-recalculate',
						caption: 'estimate.main.dirtyRecalculate',
						type: 'item',
						iconClass: 'control-icons ico-recalculate',
						disabled: isdisabled,
						fn: function () {
							setIsLoading(true);
							estimateMainService.update().then(function(){
								// calculate
								let param = {
									EstHeaderId: estimateMainService.getSelectedEstHeaderId(),
									ProjectId: estimateMainService.getProjectId(),
									EstAllowance: estimateMainStandardAllowancesDataService.getSelected()
								};

								$http.post(globals.webApiBaseUrl + 'estimate/main/estimateallowance/recalculate', param).then(function (response) {
									if (response && response.data){
										refreshRelateContainer();
									}
									setIsLoading(false);
								},function(){
									setIsLoading(false);
								});
							});
							return true;
						}
					}
				];

				function isdisabled() {
					return !platformPermissionService.hasWrite('681223e37d524ce0b9bfa2294e18d650') || $scope.isLoad;
				}

				platformGridControllerService.initListController($scope, estimateMainStandardAllowancesConfigurationService, estimateMainStandardAllowancesDataService, estimateMainStandardAllowancesValidationService, myGridConfig);
				$scope.addTools(tools);

				function setIsLoading(value){
					$scope.isLoad = value;
					$scope.tools.update();
				}

				estimateMainStandardAllowancesDataService.setIsLoading = function(value){
					setIsLoading(value);
				};

				function onSelectedRowsChanged() {
					estimateMainStandardAllowancesDataService.setIsSelectChange(true);
					let isDeleteAllowance = estimateMainStandardAllowancesDataService.getIsDeleteAllowance();
					if(isDeleteAllowance.deleteEntity){
						if(isDeleteAllowance.deleteActiveAllowance){
							setIsLoading(true);
							estimateMainService.update().then(function(){
								// calculate
								let param = {
									EstHeaderId: estimateMainService.getSelectedEstHeaderId(),
									ProjectId: estimateMainService.getProjectId(),
									EstAllowance: estimateMainStandardAllowancesDataService.getSelected()
								};

								$http.post(globals.webApiBaseUrl + 'estimate/main/estimateallowance/recalculate', param).then(function (response) {
									if (response && response.data){
										refreshRelateContainer();
									}
									setIsLoading(false);
								},function(){
									setIsLoading(false);
								});
							});
						}
						estimateMainStandardAllowancesDataService.setIsSelectChange(false);
						estimateMainStandardAllowancesDataService.setIsDeleteAllowance(false,false);
					}
				}

				function cellChangeCallBack(e,args) {
					let col = args.grid.getColumns()[args.cell].field;
					let entity = args.item;
					if (col === 'Code') {
						if (entity.Code) {
							entity.Code = entity.Code.toUpperCase();
							estimateMainStandardAllowancesDataService.gridRefresh();
						}
						if (entity.isUniq) {

							let strContent = $translate.instant('estimate.main.copyMdcAllowance');
							let strTitle = $translate.instant('estimate.main.copyMdcAllowance');
							let isShowCopyDialog;
							if(entity.Code === estimateMainAllowanceCodeLookupService.getSelectedCode()){
								isShowCopyDialog = true;
							} else {
								let lookupData = estimateMainAllowanceCodeLookupService.getLookupData();
								let filter = _.filter(lookupData,{Code:entity.Code});
								isShowCopyDialog = filter.length > 0;
								if(isShowCopyDialog){
									estimateMainAllowanceCodeLookupService.setSelectedId(filter[0]);
								}
							}

							if (isShowCopyDialog) {
								platformModalService.showYesNoDialog(strContent, strTitle, 'no').then(function (result) {
									if (result.yes) {
										let mdcAllowanceFk = estimateMainAllowanceCodeLookupService.getSelectedId();
										let param = {
											EstHeaderFk: estimateMainService.getSelectedEstHeaderId(),
											Id: entity.Id,
											mdcAllowanceFk: mdcAllowanceFk
										};
										$http.post(globals.webApiBaseUrl + 'estimate/main/estimateallowance/copyMdcAllowance', param).then(function (response) {
											if (response && response.data){
												estimateMainStandardAllowancesDataService.setHasUpdateItem(entity);
												let items = estimateMainStandardAllowancesDataService.getList();
												_.forEach(items,function (item){
													if(response.data.Id === item.Id){
														angular.extend(item,response.data);
														estimateMainStandardAllowancesDataService.setAllowanceTypeReadOnly(item);
														$injector.get('platformDataProcessExtensionHistoryCreator').processItem(item);
													}
												});
												if(entity.MdcAllowanceTypeFk !== 3){
													$injector.get('estimateMainAllowanceAreaService').clearData();
													$injector.get('estStandardAllowancesCostCodeDetailDataService').load();
												}else {
													$injector.get('estimateMainAllowanceAreaService').load();
												}
												estimateMainStandardAllowancesDataService.gridRefresh();
											}
										});

										estimateMainStandardAllowancesValidationService.validateCode(entity, entity.Code, 'Code');
										estimateMainStandardAllowancesDataService.gridRefresh();
									}

									if (result.no) {
										estimateMainStandardAllowancesValidationService.validateCode(entity, entity.Code, 'Code');
										estimateMainStandardAllowancesDataService.gridRefresh();
									}

									if (result.ok) {
										entity.Code = entity.oldCode;
										estimateMainStandardAllowancesDataService.gridRefresh();
									}
								});
							}
						}
					}

					// if(entity.MdcAllowanceTypeFk !== 3 && (col === 'MarkUpGa' || col === 'MarkUpRp' || col === 'MarkUpAm')){
					//    $injector.get('estStandardAllowancesCostCodeDetailDataService').ReCalculateMarkup2costCodes(col);
					// }

					if(col === 'IsActive' && !estimateMainStandardAllowancesDataService.getIsSelectChange()){
						setIsLoading(true);
						estimateMainService.update().then(function(){
							// calculate
							let param = {
								EstHeaderId: estimateMainService.getSelectedEstHeaderId(),
								ProjectId: estimateMainService.getProjectId(),
								AllowanceFk:estimateMainStandardAllowancesDataService.getActiveAllowanceChange(),
								EstAllowance: estimateMainStandardAllowancesDataService.getSelected()
							};

							$http.post(globals.webApiBaseUrl + 'estimate/main/estimateallowance/recalculate', param).then(function (response) {
								if (response && response.data){
									refreshRelateContainer();
								}
								estimateMainStandardAllowancesDataService.setActiveAllowanceChange(null);
								setIsLoading(false);
							},function(){
								setIsLoading(false);
							});
						});
						estimateMainStandardAllowancesDataService.setIsActiveChange(false);
					}

					estimateMainStandardAllowancesDataService.setIsSelectChange(false);

					if(col === 'IsActive' || col === 'MdcAllowanceTypeFk' || col === 'IsOneStep'){
						$injector.get('estimateMainContextDataService').setAllowanceEntity(entity.IsActive ? entity : {});
						estimateMainService.processItems();
						estimateMainService.gridRefresh();
						estimateMainResourceService.processItems();
						estimateMainResourceService.gridRefresh();
						$injector.get('estStandardAllowancesCostCodeDetailDataService').gridRefresh();
						$injector.get('estimateConfigTotalService').gridRefresh();
					}

					if (col === 'MarkUpGa' ||col === 'MarkUpRp' ||col === 'MarkUpAm' && entity) {
						updateEntityAllowances(entity,col);
					}
				}

				/**
				 * Updates the allowances for the given entity based on the specified type.
				 *
				 * @param {Object} entity - The entity containing the allowance data.
				 * @param {string} type - The type of markup to update (e.g., 'MarkUpGa', 'MarkUpRp', 'MarkUpAm').
				 */
				function updateEntityAllowances(entity, type) {
					const markupTypes = {
						'MarkUpGa': 'GaPerc',
						'MarkUpRp': 'RpPerc',
						'MarkUpAm': 'AmPerc'
					};

					if (markupTypes[type]) {
						updateEntityAllowancesMarkup(entity, type, markupTypes[type]);
					}
				}
				/**
				 * Updates the allowances markup for the given entity and type.
				 *
				 * @param {Object} entity - The entity containing the allowance data.
				 * @param {string} type - The type of markup to update (e.g., 'MarkUpGa', 'MarkUpRp', 'MarkUpAm').
				 * @param {string} markupType - The markup type field to update in the allowances cost codes.
				 */
				function updateEntityAllowancesMarkup(entity,type,markupType){
					let standardAllowancesCostCodeDetailDataService = $injector.get('estStandardAllowancesCostCodeDetailDataService');

					let allowancesCostCodes = standardAllowancesCostCodeDetailDataService.getList();
					if(!allowancesCostCodes || !_.isArray(allowancesCostCodes)){
						return;
					}
					allowancesCostCodes.forEach(function (item) {
						if(originalEntity[type] && item[markupType] && originalEntity[type] === item[markupType]){
							item[markupType] = entity[type];
							standardAllowancesCostCodeDetailDataService.markItemAsModified(item);
						}
					});
					standardAllowancesCostCodeDetailDataService.gridRefresh();
					setOriginalEntity(entity);
				}

				//Store the data before the current row change
				let originalEntity={};

				/**
				 * Sets the original entity's markup values based on the selected item.
				 *
				 * @param {Object} selectedItem - The selected item containing the markup data.
				 */
				function setOriginalEntity(selectedItem){
					if(selectedItem){
						originalEntity.MarkUpGa = selectedItem.MarkUpGa;
						originalEntity.MarkUpRp = selectedItem.MarkUpRp;
						originalEntity.MarkUpAm = selectedItem.MarkUpAm;
					}
				}
				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				platformGridAPI.events.register($scope.gridId, 'onCellChange', cellChangeCallBack);
				estimateMainStandardAllowancesDataService.registerSelectionChanged(initIsSelectChange);

				estimateMainService.registerRefreshRequested(refreshAllowanceListService);
				function initIsSelectChange() {
					estimateMainStandardAllowancesDataService.setIsSelectChange(false);
				}

				function refreshAllowanceListService(){
					let grid = platformGridAPI.grids.element('id', $scope.gridId);
					if(grid){
						let projectId = estimateMainService.getSelectedProjectId();
						if(projectId) {
							estimateMainStandardAllowancesDataService.showFeedbackComponent($scope);
							estimateMainStandardAllowancesDataService.refresh().then(function () {
								estimateMainStandardAllowancesDataService.hideFeedbackComponent();
							});
						}
					}
				}

				function updateTools() {
					let toolIds = ['estimate-main-config-total-recalculate','t12','t108','gridSearchAll','gridSearchColumn','t1999','t200','create','delete'];
					if(estimateMainStandardAllowancesDataService.getIsReadOnlyContainer() || !platformPermissionService.hasWrite('96e6498b2ffc429dbb1ef2336b45a369')){
						toolIds.shift();
					}
					$scope.tools.items = _.filter ($scope.tools.items, function (d) {
						return _.includes(toolIds, d.id);
					});
					$timeout (function () {
						$scope.tools.update();
					});
				}

				function processCreateAndDeleteButton() {
					let buttons = _.filter ($scope.tools.items, function (d) {
						return _.includes(['create','delete'], d.id);
					});
					_.forEach(buttons,function(button){
						button.disabled= isdisabled;
					});
				}

				processCreateAndDeleteButton();
				updateTools();
				estimateMainService.onContextUpdated.register(estimateMainStandardAllowancesDataService.loadAllowance);
				estimateMainStandardAllowancesDataService.loadAllowance($scope);

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
					platformGridAPI.events.unregister($scope.gridId, 'onCellChange', cellChangeCallBack);
					estimateMainStandardAllowancesDataService.unregisterSelectionChanged(initIsSelectChange);
					estimateMainService.unregisterRefreshRequested(refreshAllowanceListService);
					estimateMainService.onContextUpdated.unregister(estimateMainStandardAllowancesDataService.loadAllowance);
				});
			}
		]);
})(angular);