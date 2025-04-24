/**
 * Created by reimer on 24.09.2014.
 */
(function () {

	'use strict';
	/* global _ */
	var moduleName = 'procurement.common';

	/**
	 * @ngdoc controller
	 * @name procurementCommonPrcBoqListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of prc boq's
	 **/
	angular.module(moduleName).controller('procurementCommonPrcBoqListController',
		['$scope', '$translate', 'procurementContextService', 'procurementCommonPrcBoqService',
			'procurementCommonPrcBoqUIStandardService', 'procurementCommonPrcBoqValidationService',
			'platformGridControllerService', 'prcBoqMainService',
			'procurementCommonHelperService', '$injector',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, $translate, moduleContext, procurementCommonPrcBoqService,
				gridColumns, validationService, platformGridControllerService,
				prcBoqMainService, procurementCommonHelperService, $injector) {

				prcBoqMainService = prcBoqMainService.getService(moduleContext.getMainService());
				procurementCommonPrcBoqService = procurementCommonPrcBoqService.getService(moduleContext.getMainService(), prcBoqMainService);
				validationService = validationService(procurementCommonPrcBoqService);

				var myGridConfig = {initCalled: false, columns: [], addValidationAutomatically: true};
				platformGridControllerService.initListController($scope, gridColumns, procurementCommonPrcBoqService, validationService, myGridConfig);

				//  local copy of the entity (for watch)
				$scope.selectedPrcBoq = {};   // must be initialized as object - otherwise watch will not work !

				// synchronise boq root
				var watch = $scope.$watch('selectedPrcBoq', function (newVal, oldVal) {

					// noinspection JSValidateTypes
					if (newVal && oldVal && Object.prototype.hasOwnProperty.call(newVal,'Id') && Object.prototype.hasOwnProperty.call(oldVal,'Id') && newVal.Id === oldVal.Id) {
						if (newVal.BoqRootItem.BriefInfo.Translated !== oldVal.BoqRootItem.BriefInfo.Translated) {

							// console.log('Brief changed');
							var boqRootItem = prcBoqMainService.getRootBoqItem();
							if (boqRootItem) {
								boqRootItem.BriefInfo.Translated = newVal.BoqRootItem.BriefInfo.Translated;
							}
						}
					}
					procurementCommonPrcBoqService.setSelectedPrcBoq(newVal);
				}, true);

				procurementCommonPrcBoqService.registerFilters();

				var reactOnBoqImportSucceeded = function () {
					var selectedBoq = procurementCommonPrcBoqService.getSelected();
					if (selectedBoq) {
						procurementCommonPrcBoqService.reloadItem(selectedBoq);
					}
					// prcBoqMainService.recalculateTotalsForHeader();
				};

				var reactOnRenumberBoqSucceeded = function () {
					var selectedBoq = procurementCommonPrcBoqService.getSelected();
					if (selectedBoq) {
						procurementCommonPrcBoqService.reloadItem(selectedBoq);
					}
				};

				prcBoqMainService.onImportSucceeded.register(reactOnBoqImportSucceeded);
				prcBoqMainService.onRenumberBoqSucceeded.register(reactOnRenumberBoqSucceeded);

				// binding module readOnly handler
				var moduleReadOnlyStatusHandler = new procurementCommonHelperService.ModuleStatusHandler();
				moduleReadOnlyStatusHandler.bindGridReadOnlyListener($scope.gridId); // bind listener
				prcBoqMainService.addUsingContainer($scope.gridId);

				$scope.isLoading = procurementCommonPrcBoqService.getEntityCreatingStatus();
				$scope.loadingText = $translate.instant('procurement.common.createStatusTest');
				procurementCommonPrcBoqService.entityCreating.register(onEntityCreating);

				var setCellEditable = function (e, args) {
					var field = args.column.field;
					var item = args.item;

					return procurementCommonPrcBoqService.getCellEditable(item, field);
				};

				var platformGridAPI = $injector.get('platformGridAPI');
				platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);

				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', selectedRowsChanged);

				function selectedRowsChanged() {
					$injector.get('procurementPackageQtoDetailService').isCanCreate = undefined;
				}

				if (_.startsWith(prcBoqMainService.getServiceName(), 'procurementPackage')) {
					prcBoqMainService.addBoqHeaderDeepCopyTool($scope, procurementCommonPrcBoqService);
					prcBoqMainService.addBoqBackupTools(       $scope, procurementCommonPrcBoqService, 'PrcBoq', 'procurement/common/boq');
				}

				$scope.$on('$destroy', function () {
					prcBoqMainService.removeUsingContainer($scope.gridId);
					watch();
					moduleReadOnlyStatusHandler.unbindGridReadOnlyListener($scope.gridId); // unbind listener
					procurementCommonPrcBoqService.unregisterFilters();
					prcBoqMainService.onImportSucceeded.unregister(reactOnBoqImportSucceeded);
					prcBoqMainService.onRenumberBoqSucceeded.unregister(reactOnRenumberBoqSucceeded);
					procurementCommonPrcBoqService.entityCreating.unregister(onEntityCreating);
					platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', setCellEditable);
				});

				// //////////////////

				function onEntityCreating(e, isCreating) {
					$scope.isLoading = isCreating;
				}
			}
		]);
})();