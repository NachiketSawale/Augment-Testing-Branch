/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	angular.module('basics.common').controller('basicsCommonResolveConflictController', [
		'_',
		'$q',
		'$timeout',
		'$scope',
		'$translate',
		'$options',
		'platformGridAPI',
		'conflictVersionType',
		'conflictGridContextService',
		function (_, $q, $timeout, $scope, $translate, $options, platformGridAPI, conflictVersionType, conflictGridContextService) {
			let gridSelected = null;
			let actionItemsLinks = null;
			$scope.activeTab = 0;
			$scope.operateHint = changeOperateHint(conflictVersionType.MyLocalEntity);

			const gridConfigs = $options.gridConfigs;
			_.forEach(gridConfigs, function (gridConfig) {
				platformGridAPI.grids.config(gridConfig);
				platformGridAPI.events.register(gridConfig.id, 'onActiveCellChanged', onActiveCellChanged);
				platformGridAPI.events.register(gridConfig.id, 'onMarkerSelectionChanged', onMarkerSelectionChangedHandler);
			});

			$scope.gridDatas = _.map(gridConfigs, function (gridConfig) {
				return { state: gridConfig.id };
			});

			if($scope.gridDatas.length > 0) {
				conflictGridContextService.setCurrentConflictGridId($scope.gridDatas[0].state);
			}

			$scope.setActiveTab = function(index, gridId) {
				$scope.activeTab = index;
				conflictGridContextService.setCurrentConflictGridId(gridId);
				$timeout(function () {
					platformGridAPI.grids.resize(gridId);
				}, 50);
			};

			$scope.isActiveTab = function(index) {
				return $scope.activeTab === index;
			};

			$scope.messageList = {
				activeValue: '',
				items: _.map(gridConfigs, function (gridConfig,key) {
					return {
						id: gridConfig.id,
						cssClass: 'btn-default jsExecution',
						type: 'radio',
						caption: gridConfig.title,
						value: gridConfig.id,
						visible: true,
						fn: function () {
							$scope.setActiveTab(key, gridConfig.id);
							actionItemsLinks.update();
						}
					};
				})
			};

			$scope.initActionItemsLinks = function (link) {
				actionItemsLinks = link;
				link.setFields($scope.messageList);
			};

			function onActiveCellChanged(event, arg) {
				gridSelected = arg.grid;
			}

			function onMarkerSelectionChangedHandler(e, arg){
				if(arg && arg.grid && arg.grid.getSelectedRows()){
					let itemSelected = arg.grid.getDataItem(arg.grid.getSelectedRows());
					if(itemSelected.isChecked){
						let data = platformGridAPI.grids.element('id', arg.grid.id).data;
						data.filter(e => e.Id === itemSelected.Id && e.conflictVersionType !== itemSelected.conflictVersionType).forEach(e => {
							e.isChecked = false;
						});
						$scope.operateHint = changeOperateHint(itemSelected.conflictVersionType);
					}else{
						itemSelected.isChecked = true;
					}
					platformGridAPI.grids.refresh(arg.grid.id, true);
				}
			}

			function changeOperateHint(versionType){
				if (versionType === conflictVersionType.MyLocalEntity) {
					return $translate.instant('basics.common.conflict.keepLocalVersion');
				} else if (versionType === conflictVersionType.OthersEntity) {
					return $translate.instant('basics.common.conflict.acceptNewerVersion');
				} else {
					return $translate.instant('basics.common.conflict.manuallyResolve');
				}
			}

			$scope.close = function (isOk) {
				$scope.$close({isOk: isOk, isCancel: true});
			};

			$scope.$on('$destroy', function () {
				_.forEach(gridConfigs, function (gridConfig) {
					platformGridAPI.events.unregister(gridConfig.id, 'onActiveCellChanged', onActiveCellChanged);
					platformGridAPI.events.unregister(gridConfig.id, 'onMarkerSelectionChanged', onMarkerSelectionChangedHandler);
				});
			});
		},
	]);
})(angular);
