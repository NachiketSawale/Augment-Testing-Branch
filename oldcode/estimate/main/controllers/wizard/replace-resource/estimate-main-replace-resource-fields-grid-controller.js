/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainReplaceResourceFieldsGridController
	 * @requires $scope
	 * @description Replaced Value Configuration : used for modify estimate
	 */
	angular.module(moduleName).controller('estimateMainReplaceResourceFieldsGridController', ['$scope', '$timeout', 'platformCreateUuid', 'platformGridAPI', 'platformGridControllerService', 'estimateMainReplaceResourceFieldsUIConfigService', 'estimateMainReplaceResourceFieldsGridDataService', 'estimateMainReplaceResourceCommonService', 'estimateMainLookupService', 'estimateMainService', 'basicsLookupdataLookupFilterService',
		'basicsCommonHeaderColumnCheckboxControllerService',
		function ($scope, $timeout, platformCreateUuid, platformGridAPI, platformGridControllerService, gridUIConfigService, gridDataService, estimateMainReplaceResourceCommonService, estimateMainLookupService, estimateMainService, basicsLookupdataLookupFilterService,
			basicsCommonHeaderColumnCheckboxControllerService) {

			let myGridConfig = {
				initCalled: false,
				columns: [],
				collapsed: false,
				enableDraggableGroupBy: false,
				skipPermissionCheck: true,
				multiSelect: false,
				rowChangeCallBack: function () {

				},
				cellChangeCallBack: function () {

				}
			};


			$scope.gridId = 'ec38261457c14d04ba674f8f09805dae';

			$scope.setTools = function () {};

			$scope.tools = {
				update : function () {}
			};

			let isLoaded = false;
			let headerCheckBoxFields = ['isFilter'];
			let headerCheckBoxEvents = [
				{
					source: 'grid',
					name: 'onHeaderCheckboxChanged',
					fn:  function (){
						estimateMainReplaceResourceCommonService.setReplacedGridReadOnly(gridDataService.getList(), true);
					}
				}
			];

			function init() {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				platformGridControllerService.initListController($scope, gridUIConfigService, gridDataService, null, myGridConfig);
				basicsCommonHeaderColumnCheckboxControllerService.init($scope, gridDataService, headerCheckBoxFields, headerCheckBoxEvents);

				if(!isLoaded) {
					gridDataService.load().then(function () {
						estimateMainReplaceResourceCommonService.setReplacedGridReadOnly(gridDataService.getList(), true);
						platformGridAPI.grids.resize($scope.gridId);
					});
					isLoaded = true;
				}
			}

			let filters = [{
				key: 'estimate-replace-prc-package-filter',
				serverSide: true,
				fn: function () {
					return {
						ProjectFk: estimateMainService.getSelectedProjectId(),
						IsLive: true
					};
				}
			}];

			basicsLookupdataLookupFilterService.registerFilter(filters);




			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
			});

			init();
		}]);
})();
