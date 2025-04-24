/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global _ */
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainAssemblyRelateWicListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of assembly entities.
	 **/
	angular.module(moduleName).controller('estimateMainAssemblyRelateWicListController',
		['$scope', '$injector', '$timeout','platformGridAPI', 'platformControllerExtendService', 'platformGridControllerService', 'estimateMainAssemblyRelateWicConfigurationService', 'estimateMainWicRelateAssemblyService',
			'estimateMainClipboardService',
			function ($scope, $injector, $timeout,platformGridAPI, platformControllerExtendService, platformGridControllerService, estimateMainAssemblyRelateWicConfigurationService, estimateMainWicRelateAssemblyService,
				estimateMainClipboardService) {

				let gridConfig = {
					type: 'estWic2Assemblies',
					dragDropService: estimateMainClipboardService,
					costGroupService: 'estimateMainWicRelateAssemblyCostGroupService',
					isCostGroupReadonly : true
				};

				platformControllerExtendService.initListController($scope, estimateMainAssemblyRelateWicConfigurationService, estimateMainWicRelateAssemblyService, null, gridConfig);

				estimateMainWicRelateAssemblyService.setGridId($scope.gridId);

				if(!estimateMainWicRelateAssemblyService.toolHasAdded){
					$scope.addTools(estimateMainWicRelateAssemblyService.getFilterTools());
					estimateMainWicRelateAssemblyService.toolHasAdded = true;
				}

				let estimateCommonPaginationService = $injector.get('estimateCommonPaginationService');
				estimateCommonPaginationService.registerPagination($scope, estimateMainWicRelateAssemblyService);


				function updateFilterTools(){
					if (platformGridAPI.grids.exist($scope.gridId)) {
						$scope.addTools(estimateMainWicRelateAssemblyService.getFilterTools());
						estimateMainWicRelateAssemblyService.updateList([]);
					}
				}
				estimateMainWicRelateAssemblyService.updateFilterTools.register(updateFilterTools);

				function updateAssemblies(e, item){
					if(_.isEmpty(item)){
						estimateMainWicRelateAssemblyService.updateAssemblies();
					}
				}

				$injector.get('estimateMainAssembliesCategoryService').registerSelectionChanged(updateAssemblies);
				$injector.get('estimateMainBoqService').registerSelectionChanged(updateAssemblies);
				$injector.get('estimateMainWicBoqService').registerSelectionChanged(updateAssemblies);

				$scope.$on('$destroy', function () {
					$injector.get('estimateMainAssembliesCategoryService').unregisterSelectionChanged(updateAssemblies);
					$injector.get('estimateMainBoqService').unregisterSelectionChanged(updateAssemblies);
					$injector.get('estimateMainWicBoqService').unregisterSelectionChanged(updateAssemblies);

					estimateMainWicRelateAssemblyService.updateFilterTools.unregister(updateFilterTools);
				});

			}
		]);
})();
