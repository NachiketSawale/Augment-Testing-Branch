/**
 * Created by mov on 6/12/2018.
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.project';

	/**
	 * @ngdoc controller
	 * @name projectMainLineItemSelectionStatementListController
	 * @function
	 * @description
	 * Controller for the  list view of Project Selection Statement
	 **/
	angular.module(moduleName).controller('projectMainLineItemSelectionStatementListController', [
		'_', '$scope', '$translate', '$injector', 'platformGridControllerService', 'estimateProjectEstimateLineItemSelStatementListService', 'estimateMainLineItemSelStatementConfigurationService', 'estimateProjectLiSelStatementListValidationService',
		'estimateProjectRateBookConfigDataService', 'estimateProjectRateBookDataService', 'platformGridAPI','platformPermissionService',
		function (
			_, $scope, $translate, $injector, platformGridControllerService, estimateProjectEstimateLineItemSelStatementListService, estimateMainLineItemSelStatementConfigurationService, estimateProjectLiSelStatementListValidationService,
			estimateProjectRateBookConfigDataService, estimateProjectRateBookDataService, platformGridAPI,platformPermissionService) {

			let gridConfig = {
				parentProp: 'EstLineItemSelStatementFk',
				childProp: 'EstLineItemSelStatementChildren',
				childSort: true,
				type: 'estlineitemselstatements',
				// skipPermissionCheck: true,
				cellChangeCallBack: onCellChangeCallBack
			};

			$scope.subDivisionDisabled = true;

			let configService = getConfigService();
			platformGridControllerService.initListController($scope, configService, estimateProjectEstimateLineItemSelStatementListService, estimateProjectLiSelStatementListValidationService, gridConfig);

			let additionalTools = [
				{
					id: 'import',
					caption: 'estimate.main.lineItemSelStatement.import',
					type: 'item',
					iconClass: 'tlb-icons ico-import',
					fn: function () {
						let basicsImportService = $injector.get('basicsImportService');

						let options = estimateProjectEstimateLineItemSelStatementListService.getImportOptions();
						basicsImportService.showImportDialog(options);
					},
					disabled: function () {
						let isHeaderReadOnly = $injector.get('estimateMainService').getHeaderStatus();
						if (isHeaderReadOnly) {
							return true;
						}
						return !isProjectLoaded();
					}
				}, {
					id: 'export',
					caption: 'estimate.main.lineItemSelStatement.export',
					type: 'item',
					iconClass: 'tlb-icons ico-export',
					fn: function () {
						let platformModalService = $injector.get('platformModalService');
						let selStatements = estimateProjectEstimateLineItemSelStatementListService.getList();
						if (_.isEmpty(selStatements)) {
							platformModalService.showErrorBox('estimate.main.lineItemSelStatement.exportNoRecordsError', 'estimate.main.lineItemSelStatement.export');
							return;
						}
						let basicsExportService = $injector.get('basicsExportService');
						let options = estimateProjectEstimateLineItemSelStatementListService.getExportOptions();

						basicsExportService.showExportDialog(options);
					},
					disabled: function () {
						let isHeaderReadOnly = $injector.get('estimateMainService').getHeaderStatus();
						if (isHeaderReadOnly) {
							return true;
						}
						let items = estimateProjectEstimateLineItemSelStatementListService.getList();
						if (isProjectLoaded()) {
							if (_.size(items) > 0) {
								return false;
							}
						}
						return true;
					}
				},
				{
					id: 'tbNewDivision',
					caption: $translate.instant('cloud.common.toolbarNewDivision'),
					type: 'item',
					iconClass: 'tlb-icons ico-fld-ins-below',
					// permission: {'591c9d3784ed4fa496b0e03fd7a56838':4},
					fn: function () {
						estimateProjectEstimateLineItemSelStatementListService.createNewDivision();
					},
					disabled: function () {
						let isHeaderReadOnly = $injector.get('estimateMainService').getHeaderStatus();
						if (isHeaderReadOnly) {
							return true;
						}
						return !isProjectLoaded();
					}
				}
			];

			let tbCreateItem = _.find($scope.tools.items, {'id': 'create'});
			// eslint-disable-next-line no-prototype-builtins
			if (tbCreateItem && tbCreateItem.hasOwnProperty('fn')) {
				tbCreateItem.fn = function () {
					estimateProjectEstimateLineItemSelStatementListService.createNewItem();
				};
				tbCreateItem.disabled = function () {
					return !isProjectLoaded();
				};
			}
			let tbCreateChildItem = _.find($scope.tools.items, {'id': 'createChild'});
			// eslint-disable-next-line no-prototype-builtins
			if (tbCreateChildItem && tbCreateChildItem.hasOwnProperty('fn')) {
				tbCreateChildItem.fn = estimateProjectEstimateLineItemSelStatementListService.createNewSubDivision;
			}
			tbCreateChildItem.disabled = function () {
				return !!$scope.subDivisionDisabled;
			};

			_.forEach(additionalTools.reverse(), function (tool) {
				$scope.tools.items.unshift(tool);
			});

			function onCellChangeCallBack() {
			}

			function getConfigService() {
				let generalColumns = angular.copy(estimateMainLineItemSelStatementConfigurationService.getStandardConfigForListView().columns);
				// Remove isExecute and logging message columns
				let columns = _.filter(generalColumns, function (field) {
					return ['isexecute', 'loggingmessage'].indexOf(field.id) === -1;
				});

				// Update usage contextestimate-main-resources-assembly-type-filter
				_.forEach(columns, function (field) {
					let isEstassemblyfk = ['estassemblyfk'].indexOf(field.id) > -1;
					if (isEstassemblyfk) {
						field.editorOptions.lookupOptions.usageContext = 'estimateProjectEstimateLineItemSelStatementListService';
					}
				});

				let getStandardConfigForListView = function () {
					return {
						addValidationAutomatically: true,
						columns: columns
					};
				};

				return {
					getDtoScheme: estimateMainLineItemSelStatementConfigurationService.getDtoScheme,
					getStandardConfigForListView: getStandardConfigForListView,
					getStandardConfigForDetailView: estimateMainLineItemSelStatementConfigurationService.getStandardConfigForDetailView
				};
			}

			function isProjectLoaded() {
				let projectMainService = $injector.get('projectMainService');
				let selectedItem = projectMainService.getSelected();
				if (selectedItem && selectedItem.Id) {
					return _.isNumber(selectedItem.Id) && selectedItem.Id > 0;
				}
				return false;
			}

			function updateSubDivisionItem(){
				$scope.$evalAsync(function () {
					$scope.subDivisionDisabled = true;
					let currentItem = estimateProjectEstimateLineItemSelStatementListService.getSelected();
					if (currentItem && Object.prototype.hasOwnProperty.call(currentItem, 'EstLineItemSelStatementType')) {
						if (currentItem.EstLineItemSelStatementType === 1) {
							$scope.subDivisionDisabled = false;
						}
					}
				});
				$scope.tools.update();
			}

			estimateProjectEstimateLineItemSelStatementListService.registerSelectionChanged(updateSubDivisionItem);

			function onListLoaded() {
				let list = estimateProjectEstimateLineItemSelStatementListService.getList();
				if (_.size(list) > 0) {
					$scope.tools.update();
				}
			}

			function onInitialized(){
				if(!platformPermissionService.hasCreate('591c9d3784ed4fa496b0e03fd7a56838')){
					_.remove($scope.tools.items,{'id': 'tbNewDivision'});
					$scope.tools.update();
				}
			}

			platformGridAPI.events.register($scope.gridId, 'onInitialized', onInitialized);

			// also init master data filter when the 'master data filter' container not exist
			function reInit(contentTypeFk) {
				estimateProjectRateBookDataService.setThisContentTypeId(null);
				if (contentTypeFk) {
					estimateProjectRateBookConfigDataService.setContentTypeId(contentTypeFk);
				} else {
					estimateProjectRateBookDataService.setThisContentTypeId(-1);
				}
				estimateProjectRateBookDataService.load().then(function () {
					estimateProjectRateBookDataService.setThisContentTypeId(null);
				});
			}

			function onContenTypeChanged(contentTypeFk) {
				if (!platformGridAPI.grids.exist('37de9c2128f54ab199a62c1526b4d411')) {
					reInit(contentTypeFk);
				}
			}

			function onMasterDataFilterChanged() {
				estimateProjectRateBookConfigDataService.clearData();
				estimateProjectRateBookConfigDataService.initData();
			}

			estimateProjectEstimateLineItemSelStatementListService.registerListLoaded(onListLoaded);
			estimateProjectRateBookConfigDataService.OnContenTypeChanged.register(onContenTypeChanged);
			estimateProjectRateBookConfigDataService.OnMasterDataFilterChanged.register(onMasterDataFilterChanged);

			$scope.$on('$destroy', function () {
				estimateProjectEstimateLineItemSelStatementListService.unregisterListLoaded(onListLoaded);
				estimateProjectRateBookConfigDataService.OnContenTypeChanged.unregister(onContenTypeChanged);
				estimateProjectRateBookConfigDataService.OnMasterDataFilterChanged.unregister(onMasterDataFilterChanged);
				estimateProjectEstimateLineItemSelStatementListService.unregisterSelectionChanged(updateSubDivisionItem);
				platformGridAPI.events.unregister($scope.gridId, 'onInitialized', onInitialized);
				// when in project module, don't clear data
				if (!platformGridAPI.grids.exist('713b7d2a532b43948197621ba89ad67a')) {
					estimateProjectRateBookConfigDataService.clearData();
				}
			});
		}
	]);
})(angular);
