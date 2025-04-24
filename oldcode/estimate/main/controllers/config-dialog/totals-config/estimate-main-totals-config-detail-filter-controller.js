/**
 * Created by mov on 2/8/2018.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global _, Slick */

	let moduleName = 'estimate.main';

	/**
	 @ngdoc controller
	 * @name estimateMainTotalsConfigDetailFilterController
	 * @function
	 *
	 * @description
	 * Controller for the Totals configuration details filter popup.
	 */
	angular.module(moduleName).controller('estimateMainTotalsConfigDetailFilterController', [
		'$scope', 'platformGridAPI', '$popupInstance', 'platformTranslateService','$injector',
		function ($scope, platformGridAPI, $popupInstance, platformTranslateService,$injector) {

			$scope.gridId = 'de0c65b5f0574305bdab01d429ef9981';
			$scope.grid = {
				state: $scope.gridId
			};

			let gridConfig = {
				data: [],
				columns: angular.copy($scope.settings.columns),
				id: $scope.gridId,
				lazyInit: false,
				isStaticGrid: true,
				options: {
					indicator: true,
					editorLock: new Slick.EditorLock(),
					multiSelect: false,
					skipPermissionCheck: true
				}
			};

			platformGridAPI.grids.config(gridConfig);
			platformTranslateService.translateGridConfig(gridConfig.columns);

			$scope.options.dataView.dataProvider.getList($scope.settings, $scope.$parent).then(function(data){
				let processedData = $scope.settings.dataProcessor.execute(data, $scope.options);
				platformGridAPI.items.data($scope.gridId, processedData);
			});

			$scope.refresh = function () {
				if ($scope.settings.onDataRefresh) { // exists external data refresh callback.
					$scope.settings.onDataRefresh($scope);
				}
			};

			$scope.refreshData = function refreshData(processedData){
				platformGridAPI.items.data($scope.gridId, processedData);
			};

			function onPopupResizeStop() {
				if (platformGridAPI.grids.exist($scope.gridId)){
					platformGridAPI.grids.resize($scope.gridId);
				}
			}

			function processItem(item, identification) {
				$scope.entity.Modified = true;
				if (item.Filter) {
					if (_.findIndex($scope.entity[identification], {Id: item.Id}) === -1) {
						if (!_.isArray($scope.entity[identification])){
							$scope.entity[identification] = [];
						}
						item.EstTotalsConfigDetailFk = $scope.entity.Id;
						$scope.entity[identification].push(item);
					}
				} else {
					_.remove($scope.entity[identification], {'Id': item.Id});
				}
			}

			function onCellChange(e, args) {
				let column = $scope.$parent.$parent.$parent.config.field;
				processItem(args.item,column);
				processLllegalData(column);
			}

			function onHeaderCheckboxChange(e) {
				let column = $scope.$parent.$parent.$parent.config.field;
				let data = platformGridAPI.items.data($scope.gridId);
				_.forEach(data, function (item) {
					item.Filter = e.target.checked;
					processItem(item,column);
					$scope.$apply();
				});

				processLllegalData(column);
			}

			function processLllegalData(column) {
				let selectedTotalConfigDetail = $injector.get('estimateMainEstTotalsConfigDetailDataService').getSelected();
				if(!selectedTotalConfigDetail){
					return;
				}

				let data = _.filter(selectedTotalConfigDetail[column],function (item) {
					return !item.Filter;
				});

				if(data){
					$scope.options.dataView.dataProvider.getList($scope.settings, $scope.$parent).then(function(lookupData){
						_.forEach(data,function (item) {
							let findData = _.find(lookupData,{Id: item.Id});
							if(findData){
								findData.Filter = true;
							}else {
								_.remove($scope.entity[column], {'Id': item.Id});
							}
						});
					});
				}
			}

			$popupInstance.onResizeStop.register(onPopupResizeStop);
			platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);
			platformGridAPI.events.register($scope.gridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChange);

			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)){
					$popupInstance.onResizeStop.unregister(onPopupResizeStop);
					platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
					platformGridAPI.events.unregister($scope.gridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChange);
					platformGridAPI.grids.unregister($scope.gridId);

					if ($scope.$close){
						$scope.$close();
					}
				}
			});
		}
	]);
})();

