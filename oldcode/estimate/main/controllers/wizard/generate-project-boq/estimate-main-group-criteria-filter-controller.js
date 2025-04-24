/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global Slick */

	let moduleName = 'estimate.main';

	/**
     @ngdoc controller
     * @name estimateMainGroupCriteriaFilterController
     * @function
     *
     */
	angular.module(moduleName).controller('estimateMainGroupCriteriaFilterController', [
		'_', '$scope', '$injector', '$translate','platformGridAPI', '$popupInstance', 'platformTranslateService',
		function (_, $scope, $injector, $translate, platformGridAPI, $popupInstance, platformTranslateService) {

			$scope.gridId = 'f07b15dfb6e247c5862b40aa29bc7dc9';
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

			$scope.options.dataView.dataProvider.getList($scope.entity.GroupCriteria).then(function(data){
				// let processedData = $scope.settings.dataProcessor.execute(data, $scope.options);
				platformGridAPI.items.data($scope.gridId, data);
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

			function processItem(item) {
				$scope.entity.Modified = true;
				$scope.entity.loadedWicBoq = false;

				let descCriteria = $injector.get('estimateMainDescriptionCriteriaComplexService').getDescDescByGroupCriteria(item.Code);
				if (item.Select) {
					if (_.findIndex($scope.entity.GroupCriteria, {Code: item.Code}) === -1) {
						if (!_.isArray($scope.entity.GroupCriteria)){
							$scope.entity.GroupCriteria = [];
						}
						$scope.entity.GroupCriteria.push({
							'Code': item.Code,
							'Description': item.Description
						});
					}

					if(descCriteria){
						if($scope.entity.DescCriteria.indexOf(descCriteria) < 0){
							$scope.entity.DescCriteria = $scope.entity.DescCriteria ? $scope.entity.DescCriteria + ' + ' + descCriteria : descCriteria;
						}
					}
					$scope.entity.DescCriteriaOver = descCriteria;

				} else {
					_.remove($scope.entity.GroupCriteria, {'Code': item.Code});
					if(descCriteria && $scope.entity.DescCriteria.indexOf(descCriteria) >= 0){
						let reg = new RegExp('\\+*\\s*' + descCriteria);
						$scope.entity.DescCriteria = $scope.entity.DescCriteria.replace(reg, '');
						reg = /\s{2,}/ig;
						$scope.entity.DescCriteria = $scope.entity.DescCriteria.replace(reg, '');

						if($scope.entity.DescCriteria === ' '){
							$scope.entity.DescCriteria = '';
						}
					}
				}
			}

			function onCellChange(e, args) {
				processItem(args.item);
			}

			function onHeaderCheckboxChange(e) {
				let data = platformGridAPI.items.data($scope.gridId);
				_.forEach(data, function (item) {
					if(item.Code !== $translate.instant('estimate.main.generateProjectBoQsWizard.wicItemRefNo')){
						item.Select = e.target.checked;
						processItem(item);
						$scope.$apply();
					}else{
						item.Select = true;
						$scope.$apply();
					}
				});
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

