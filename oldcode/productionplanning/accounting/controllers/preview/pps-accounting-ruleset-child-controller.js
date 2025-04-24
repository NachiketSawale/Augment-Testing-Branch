/**
 * Created by lav on 7/22/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.accounting';

	angular.module(moduleName).controller('productionplanningAccountingRuleSetChildController',
		[
			'$scope',
			'$controller',
			'ppsDrawingPreviewUIService',
			'$translate',
			'productionplanningAccountingRuleSetDataService',
			'productionplanningAccountingRuleSetUIStandardService',
			'productionpalnningAccountingRuleSetValidationService',
			'$timeout',
			'platformPermissionService',
			function ($scope,
					  $controller,
					  ppsDrawingPreviewUIService,
					  $translate,
					  accountingRuleSetDataService,
					  accountingRuleSetUIStandardService,
					  productionpalnningAccountingRuleSetValidationService,
					  $timeout,
					  platformPermissionService) {

				var dataService = accountingRuleSetDataService.getService({
					serviceKey: 'preview',
					extendBefore: function (so) {
						if (so && so.flatRootItem && so.flatRootItem.sidebarSearch && so.flatRootItem.sidebarSearch.options) {
							so.flatRootItem.sidebarSearch.options.pageSize = 99999;//not work, actually
						}
					},
					extendAfter: function (sc) {
						sc.data.callAfterSuccessfulUpdate = markAsModified;
						sc.data.initReadData = function (readData) {
							readData.IncludeNonActiveItems = true;
						};
						sc.data.showHeaderAfterSelectionChanged = null;//remove it to avoid the header update
					}
				});

				function markAsModified() {
					dataService.needRefresh = true;
				}

				dataService.registerEntityDeleted(markAsModified);

				var ruleSetConfig = {
					title: $translate.instant('productionplanning.accounting.entityRuleSet'),
					gridId: '8f452834f2e84jg2a40cfb7y7hd4185f',
					dataService: dataService,
					UIStandardService: accountingRuleSetUIStandardService,
					validationService: productionpalnningAccountingRuleSetValidationService,
					additionalColumns: ppsDrawingPreviewUIService.generateAdditionalColumns('RuleSetIds'),
					permission: 'fcdf2e62fb8848bc99dd1a52fdbdf47f'
				};

				angular.extend(this, $controller('productionplanningAccountingRuleCommonChildController', {
					$scope: $scope,
					$options: ruleSetConfig
				}));

				$scope.$parent.ruleSetService = dataService;
				$scope.$parent.gridIds.push(ruleSetConfig.gridId);

				$scope.tools.items.unshift(
					{
						id: 'refresh',
						sort: 1,
						caption: 'cloud.common.toolbarRefresh',
						type: 'item',
						iconClass: 'control-icons ico-crefo3',
						permission: '#r',
						fn: function () {
							return dataService.refresh();
						},
						disabled: function () {
							return false;
						}
					}
				);

				$timeout(function () {
					var refreshToolItem = _.find($scope.tools.items, {id: 'refresh'});
					if (platformPermissionService.has(ruleSetConfig.permission, refreshToolItem.permission[ruleSetConfig.permission])) {
						dataService.refresh().then(function () {
							var list = dataService.getList();
							_.forEach(list, function (item) {
								ppsDrawingPreviewUIService.processRuleObject(item, 'RuleSetIds');
							});
							var selected = _.find(list, {UDIsMatch: true});
							if (!selected) {
								selected = _.find(list, {UDHasConflict: true});
							}
							if (selected) {
								dataService.setSelected(selected);
							}

						});
					}
				});

				$scope.$on('$destroy', function () {
					dataService.unregisterEntityDeleted(markAsModified);
				});
			}
		]);
})(angular);