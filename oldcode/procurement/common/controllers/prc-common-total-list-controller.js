(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/**
	 * @ngdoc controller
	 * @name procurementCommonTotalListController
	 * @requires $scope, $translate, $filter, procurementContractTotalDataService, procurementContractTotalValidationService, procurementcontractTotalColumns, procurementContractHeaderDataService, messengerService, platformTranslateService
	 * @description Controller for total container
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.common').controller('procurementCommonTotalListController',
		['$scope', '$translate', 'procurementContextService', 'platformGridControllerService', 'procurementCommonTotalDataService', 'procurementCommonTotalValidationService',
			'procurementCommonTotalUIStandardService', 'procurementCommonHelperService',
			function ($scope, $translate, moduleContext, gridControllerService, dataServiceFactory, validationService, gridColumns, procurementCommonHelperService) {

				var gridConfig = {initCalled: false, columns: []},
					dataService = dataServiceFactory.getService(moduleContext.getMainService());
				var moduleName = moduleContext.getModuleName();

				validationService = validationService(dataService);
				dataService.newEntityValidator(validationService);// for validate dialogue when first create
				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				var tools = [{
					id: 't1000',
					sort: 1000,
					caption: $translate.instant('procurement.common.total.dirtyRecalculate'),
					type: 'item',
					iconClass: 'control-icons ico-recalculate',
					permission: '#w',
					disabled: function () {
						// var leadingService = moduleContext.getMainService();
						// return !(leadingService.isTotalDirty && dataService.getList().length);
						if (moduleName && moduleName === 'procurement.contract') {
							var leadingService = moduleContext.getMainService();
							var parentItem = leadingService.getSelected();
							if (parentItem !== null) {
								if (parentItem && parentItem.ConStatus.IsReadonly) {
									return true;
								}
							}

						}
						return dataService.getList().length === 0;
					},
					fn: function updateCalculation() {
						dataService.updateCalculation();
					}
				}, {
					id: 't1001',
					sort: 1001,
					caption: 'procurement.common.total.toolbarFilter',
					type: 'check',
					iconClass: 'tlb-icons ico-on-off-zero',
					permission: '#w',
					value: !dataService.getShowAllStatus(),
					disabled: function () {
						return false;
					},
					fn: function refreshTotal() {
						dataService.refreshTotal();
					}
				}, {
					id: 'd999',
					sort: 999,
					type: 'divider'
				}];
				gridControllerService.addTools(tools);

				// for refresh the tool bar enable and disable
				var refreshDisplay = function () {
					var phase = $scope.$root.$$phase;
					if (phase !== '$apply' && phase !== '$digest') {
						$scope.$apply();
					}
				};

				if (moduleName && moduleName === 'procurement.contract') {
					dataService.resetIsDisableRecaculate = function () {
						var item = _.find($scope.tools.items, {id: 't1000'});
						if (item) {
							item.disabled = function () {
								var leadingService = moduleContext.getMainService();
								var parentItem = leadingService.getSelected();
								if (parentItem && parentItem.ConStatus.IsReadonly) {
									return true;
								}
								return dataService.getList().length === 0;
							};
							$scope.tools.update();
						}
					};
				}

				// register filters
				dataService.registerFilters();
				dataService.registerItemModified(refreshDisplay);

				// binding module readOnly handler
				var moduleReadOnlyStatusHandler = new procurementCommonHelperService.ModuleStatusHandler();
				moduleReadOnlyStatusHandler.bindGridReadOnlyListener($scope.gridId); // bind listener
				$scope.$on('$destroy', function () {
					moduleReadOnlyStatusHandler.unbindGridReadOnlyListener($scope.gridId); // unbind listener
					// dataService.unregisterFilters();
					dataService.unregisterItemModified(refreshDisplay);
					// canRecalcuetWatch();
				});
			}
		]);

})(angular);
