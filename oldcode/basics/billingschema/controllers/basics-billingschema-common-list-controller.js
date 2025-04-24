/**
 * Created by wed on 5/21/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.billingschema';
	angular.module(moduleName).controller('basicsBillingSchemaCommonListController',
		['_', '$scope', '$translate', '$injector', 'platformGridControllerService', 'basicsBillingSchemaServiceFactory', 'basicsBillingSchemaValidationFactory', 'basicsBillingSchemaUIStandardServiceFactory','basicsLookupdataLookupFilterService',
			'platformGridAPI','platformDataServiceModificationTrackingExtension','platformModuleStateService',
			function (_, $scope, $translate, $injector, platformGridControllerService, basicsBillingSchemaServiceFactory, basicsBillingSchemaValidationFactory, basicsBillingSchemaUIStandardServiceFactory,basicsLookupdataLookupFilterService,
			          platformGridAPI,platformDataServiceModificationTrackingExtension,platformModuleStateService) {

				// Gets custom data from container configuration.
				var qualifier = $scope.getContentValue('billingSchemaQualifier'),
					parentServiceName = $scope.getContentValue('parentService'),
					dataServiceName = $scope.getContentValue('dataService'),
					configServiceName = $scope.getContentValue('configService'),
					validateServiceName = $scope.getContentValue('validateService'),
					interrupterServiceName = $scope.getContentValue('interrupterServiceName'),
					uuid = $scope.getContentValue('uuid');

				// Initialize related service by custom configuration.
				var parentService = $injector.get(parentServiceName);
				var dataService = dataServiceName ? $injector.get(dataServiceName) : basicsBillingSchemaServiceFactory.getService(qualifier, parentService);
				var validateService = validateServiceName ? $injector.get(validateServiceName) : basicsBillingSchemaValidationFactory.getService(qualifier, dataService);
				var configService = configServiceName ? $injector.get(configServiceName) : basicsBillingSchemaUIStandardServiceFactory.getUIStandardService(qualifier);

				// Defined and extend calculate related logic.
				var interrupterService = angular.extend({
					disabled: function (parentService, dataService) {
						// Will determine the recalculate button is enabled or not.
						return dataService.disableRecalButton();
					},
					recalculate: function (parentService, dataService) {
						// Post recalculate request when recalculate button click event was trigger.
						var context = this;
						if (context.posting) {
							return;
						}

						var selectedHeader = dataService.getParentSelected();
						if (selectedHeader && selectedHeader.Id) {

							var updateData = platformDataServiceModificationTrackingExtension.getModifications(dataService);
							if (updateData && Array.isArray(updateData.BillingSchemaToSave)) {
								var modState = platformModuleStateService.state(dataService.getModule());

								updateData.EntitiesCount -= updateData.BillingSchemaToSave.length;
								updateData.BillingSchemaToSave.length = 0;
								modState.modifications = updateData;
							}


							context.posting = true;
							dataService.recalculateForItem(selectedHeader).then(function () {
								if (parentService.update) {
									parentService.update().then().finally(function () {
										context.posting = false;
									});
								} else if (parentService.allDoPrepareUpdateCall) {
									parentService.allDoPrepareUpdateCall().then().finally(function () {
										context.posting = false;
									});
								}
							}).finally(function () {
								// context.posting = false;
							});
						}
					},
					/* jshint -W098*/
					// eslint-disable-next-line no-unused-vars
					onControllerCreate: function ($scope, parentService, dataService) {
						// Extend something when controller creating.
					},
					/* jshint -W098*/
					// eslint-disable-next-line no-unused-vars
					onControllerDestroy: function ($scope, parentService, dataService) {
						// Clear you data when controller destroy.
					}
				}, interrupterServiceName ? $injector.get(interrupterServiceName) : {});

				platformGridControllerService.initListController($scope, configService, dataService, validateService, {
					initCalled: false,
					columns: []
				});

				$scope.tools.items.splice(0, 1, {
					id: 't1000',
					sort: 1000,
					caption: $translate.instant('basics.billingschema.dirtyRecalculate'),
					type: 'item',
					iconClass: 'control-icons ico-recalculate',
					disabled: function () {
						return interrupterService.disabled(parentService, dataService);
					},
					fn: function () {
						interrupterService.recalculate(parentService, dataService);
					}
				});

				_.remove($scope.tools.items, function (item) {
					return item && (item.id === 'create' || item.id === 'delete');
				});

				var updateTools = function () {
					if ($scope.tools) {
						$scope.tools.update();
					}
				};

				dataService.registerSelectionChanged(updateTools);
				interrupterService.onControllerCreate($scope, parentService, dataService);

				var filters = [
					{
						key: 'basics-billings-controlling-unit-filter',
						serverSide: true,
						serverKey: 'prc.con.controllingunit.by.prj.filterkey',
						fn: function () {
							var moduleName = parentService.getModule().name;
							var extraFilter=false;
							if(moduleName === 'procurement.pes'||moduleName === 'procurement.invoice'){
								extraFilter=true;
							}
							var parentItem = parentService.getSelected();
							if(parentItem){
								return {
									ByStructure: true,
									ExtraFilter: extraFilter,
									PrjProjectFk: parentItem.ProjectFk,
									CompanyFk: null
								};

							}
						}
					}
				];

				function onCellModified(e, arg) {
					dataService.onValueChanged.fire({
						item: arg.item,
						items: arg.grid.getData().getRows(),
						column: arg.grid.getColumns()[arg.cell]
					});
				}

				basicsLookupdataLookupFilterService.registerFilter(filters);
				platformGridAPI.events.register(uuid, 'onCellChange', onCellModified);

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister(uuid,  'onCellChange', onCellModified);
					dataService.unregisterSelectionChanged(updateTools);
					interrupterService.onControllerDestroy($scope, parentService, dataService);
					basicsLookupdataLookupFilterService.unregisterFilter(filters);

				});
			}]);
})(angular);
