/**
 * Created by lav on 7/22/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.accounting';

	angular.module(moduleName).controller('productionplanningAccountingRuleCommonChildController',
		[
			'$scope',
			'ppsDrawingPreviewUIService',
			'platformGridAPI',
			'ppsDrawingPreviewDialogService',
			'productionpalnningAccountingRuleValidationService',
			'platformGridControllerService',
			'platformDataServiceFactory',
			'platformToolbarService',
			'$timeout',
			'$http',
			'basicsLookupdataPopupService',
			'platformDataServiceModificationTrackingExtension',
			'$injector',
			'basicsCommonMandatoryProcessor',
			'$options',
			'platformDataValidationService',
			'platformDataServiceDataProcessorExtension',
			'platformDataServiceEntityRoleExtension',
			'$q',
			'platformPermissionService',
			function ($scope,
					  ppsDrawingPreviewUIService,
					  platformGridAPI,
					  ppsDrawingPreviewDialogService,
					  accountingRuleValidationService,
					  platformGridControllerService,
					  platformDataServiceFactory,
					  platformToolbarService,
					  $timeout,
					  $http,
					  basicsLookupdataPopupService,
					  platformDataServiceModificationTrackingExtension,
					  $injector,
					  basicsCommonMandatoryProcessor,
					  $options,
					  platformDataValidationService,
					  platformDataServiceDataProcessorExtension,
					  platformDataServiceEntityRoleExtension,
					  $q,
					  platformPermissionService) {
				_.extend($scope, $options);
				$injector.get('platformContainerUiAddOnService').addManagerAccessor($scope, $('#dummyId123456789'), function () {
				});
				$scope.setTools = function (tools) {
					tools.update = function () {
						tools.version += 1;
					};
				};

				if (!$scope.hideTools) {
					//Define standard toolbar Icons and their function on the scope
					$scope.tools = {
						showImages: true,
						showTitles: true,
						cssClass: 'tools',
						items: [
							{
								id: 'd1',
								sort: 3,
								type: 'divider'
							},
							{
								id: 'create',
								sort: 5,
								caption: 'cloud.common.taskBarNewRecord',
								type: 'item',
								iconClass: 'tlb-icons ico-rec-new',
								permission: '#c',
								fn: function () {
									return service.createItem();
								},
								disabled: function () {
									return !service.canCreate();
								}
							},
							{
								id: 'delete',
								sort: 10,
								caption: 'cloud.common.taskBarDeleteRecord',
								type: 'item',
								iconClass: 'tlb-icons ico-rec-delete',
								permission: '#d',
								fn: function () {
									return service.deleteSelection();
								},
								disabled: function () {
									return !service.canDelete();
								}
							}
						],
						update: function () {
							_.forEach($scope.tools.items, function (item) {
								if ($options.permission && item.permission) {
									var split = item.permission.split('#');
									item.permission = {};
									item.permission[split[0].length ? split[0] : $options.permission] = platformPermissionService.permissionsFromString(split[1]);
								}
							});
							$scope.tools.items = platformToolbarService.getTools($options.gridId, $scope.tools.items);
						}
					};
				} else {
					$scope.tools = {
						update: function () {
						}
					};
				}
				var service = $scope.dataService; // jshint ignore:line
				if (!$scope.dataService) {
					var dataOption = {
						flatRootItem: {
							module: moduleName,
							serviceName: 'previewDummyService',
							entityRole: {
								root: {
									itemName: 'previewDummp',
									moduleName: 'productionplanning.accounting'
								}
							}
						}
					};

					var serviceContainer = platformDataServiceFactory.createNewComplete(dataOption);

					serviceContainer.data.doCallHTTPRead = function () {
						var dataItems = $scope.getList(ppsDrawingPreviewDialogService.getSelected());
						serviceContainer.data.handleReadSucceeded(dataItems, serviceContainer.data);
						return $q.when(dataItems);
					};
					service = serviceContainer.service;
				}
				if ($options.permission) {
					$scope.readonly = !platformPermissionService.hasWrite($options.permission);
				}

				var origFn = $scope.UIStandardService.getStandardConfigForListView;
				$scope.UIStandardService.getStandardConfigForListView = function () {
					var gridConfig = _.cloneDeep(origFn());
					_.forEach($scope.additionalColumns, function (column) {
						gridConfig.columns.unshift(column);
					});
					_.forEach(gridConfig.columns, function (column) {
						if ($scope.readonly) {
							column.editor = null;
						}
						column.navigator = null;
					});
					return gridConfig;
				};

				platformGridControllerService.initListController($scope, $scope.UIStandardService, service, $scope.validationService, {});

				$scope.UIStandardService.getStandardConfigForListView = origFn;

				//avoid close when click tool button
				var tempHidePopup = basicsLookupdataPopupService.hidePopup;
				basicsLookupdataPopupService.hidePopup = function () {
				};
				if ($scope.load) {
					service.refresh();
				}

				function onResize() {
					$timeout(function () {
						platformGridAPI.grids.resize($scope.gridId);
					});
				}

				$(window).bind('resize', onResize);

				var onCellChange = function (e, args) {
					if (service.handleFieldChanged) {
						var col = args.grid.getColumns()[args.cell].field;
						service.handleFieldChanged(args.item, col);
					}
				};

				platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

				$scope.$on('$destroy', function () {
					$(window).unbind('resize', onResize);
					platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
					basicsLookupdataPopupService.hidePopup = tempHidePopup;
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
				});
			}
		]);
})(angular);
