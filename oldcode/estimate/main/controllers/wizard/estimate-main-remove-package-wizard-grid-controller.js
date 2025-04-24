/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global _ */
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc controller
	 * @name estimateMainPackageWizardGridController
	 * @function
	 *
	 * @description
	 * Controller to show the Grid with packages on Remove Package wizard
	 **/
	angular.module(moduleName).controller('estimateMainPackageWizardGridController', ['$scope', '$timeout', '$injector', 'platformGridAPI', 'platformCreateUuid',
		'estimateMainRemovePackageWizardDetailService', 'platformGridControllerService', 'basicsCommonHeaderColumnCheckboxControllerService', 'estimateMainRemovePackageResourcesDialogService',
		function ($scope, $timeout, $injector, platformGridAPI, platformCreateUuid, estimateMainRemovePackageWizardDetailService, platformGridControllerService, basicsCommonHeaderColumnCheckboxControllerService, packageResourcesService) {

			let myGridConfig = {
				initCalled: false,
				skipPermissionCheck: true,
				cellChangeCallBack: function () {
					onSelectionChanged();
				}
			};

			$scope.gridId = platformCreateUuid();

			$scope.onContentResized = function () {
				resize();
			};

			$scope.gridData = {
				state: $scope.gridId
			};

			function resize() {
				$timeout(function () {
					platformGridAPI.grids.resize($scope.gridId);
				});
			}

			function skipContractedPackages(item) {
				return item && item.IsContracted;
			}

			function init() {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}

				let selectedScope = $scope && $scope.entity ? $scope.entity.estimateScope : 2;
				estimateMainRemovePackageWizardDetailService.setDataList(true,selectedScope);
				platformGridAPI.events.register($scope.gridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChange);
				packageResourcesService.onLoadPackageResource.register(loadPackageResGroup);
				platformGridControllerService.initListController($scope, estimateMainRemovePackageWizardDetailService, estimateMainRemovePackageWizardDetailService, null, myGridConfig);

				basicsCommonHeaderColumnCheckboxControllerService.setGridId($scope.gridId);
				basicsCommonHeaderColumnCheckboxControllerService.init($scope, estimateMainRemovePackageWizardDetailService, ['IsChecked'], null, {skipFn: skipContractedPackages});
			}

			$scope.isCheckedValueChange = function isCheckedValueChange() {
				return {apply: true, valid: true, error: ''};
			};

			function onHeaderCheckboxChange(scope) {
				$scope.isCheckedValueChange(null, scope.target.checked);
				onSelectionChanged();
				estimateMainRemovePackageWizardDetailService.updateOnHeaderCheckboxChange();
			}

			function onSelectionChanged() {
				let packagesToRemove = estimateMainRemovePackageWizardDetailService.getPackagesToRemove();
				let selectedScope = $scope && $scope.entity ? $scope.entity.estimateScope : 2;
				packageResourcesService.setDataList(true, packagesToRemove, selectedScope).then(function (data) {
					loadPackageResGroup(data);
				});
			}
			function  loadPackageResGroup(data){
				let items = data;
				let itemsCount = !!(items && items.length);
				let formConfig = $scope.formOptions.configure;
				let haspackageResGroup = _.find(formConfig.groups, function (item) {
					return item.gid === 'selectPackageResources';
				});

				if (haspackageResGroup && haspackageResGroup.visible !== itemsCount) {
					haspackageResGroup.isOpen = itemsCount;
					haspackageResGroup.visible = itemsCount;

					let haspackageResRow = _.find(formConfig.rows, function (item) {
						return item.rid === 'selectPackageResources';
					});
					if (haspackageResRow) {
						haspackageResRow.visible = itemsCount;
					}
					$scope.$emit('form-config-updated');
				}
			}
			$scope.setTools = function (tools) {
				tools.update = function () {
					tools.version += 1;
				};
			};

			init();

			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				estimateMainRemovePackageWizardDetailService.setDataList(false);
				platformGridAPI.events.unregister($scope.gridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChange);
				packageResourcesService.onLoadPackageResource.unregister(loadPackageResGroup);
			});
		}
	]);
})();
