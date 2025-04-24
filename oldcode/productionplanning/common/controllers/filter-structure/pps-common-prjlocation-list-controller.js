/**
 * Created by zov on 15/05/2019.
 */
(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).controller('ppsCommonProjectLocationListController', [
		'$scope', '$injector',
		'ppsCommonProjectLocationFilterDataServiceFactory', 'productionplanningEngineeringTaskClipboardService',
		'productionplanningCommonStructureFilterService', 'estimateCommonControllerFeaturesServiceProvider',
		'platformGridControllerService', 'projectLocationStandardConfigurationService',
		'cloudDesktopPinningContextService', 'ppsCommonProjectLocationValidationServiceFactory',
		function ($scope, $injector,
				  ppsCommonProjectLocationFilterDataServiceFactory, ppsEngineeringTaskClipboardService,
				  ppsCommonStructureFilterService, estimateCommonControllerFeaturesServiceProvider,
				  platformGridControllerService, uiStandardService,
				  cloudDesktopPinningContextService, validationServiceFactory) {

			var mainServiceName = $scope.getContentValue('mainService');
			var isEditable = $scope.getContentValue('editable');
			var mainService = $injector.get(mainServiceName);
			var dataService = ppsCommonProjectLocationFilterDataServiceFactory.getPrjLocationFilterService(mainService, isEditable);

			var gridConfig = {
				initCalled: false,
				columns: [], parentProp: 'LocationParentFk',
				childProp: 'Locations',
				type: 'projectLocation-leadingStructure',
				dragDropService: ppsEngineeringTaskClipboardService,
				marker: {
					filterService: ppsCommonStructureFilterService,
					filterId: mainServiceName + '_ProjectLocation',
					dataService: dataService,
					serviceName: mainServiceName,
					serviceMethod: 'getPrjLocationList',
					multiSelect: false
				}
			};
			var validationService = validationServiceFactory.create(dataService);
			platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);
			estimateCommonControllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);

			function reloadData() {
				var projectId = mainService.getSelectedProjectId();
				if(projectId > 0)
				{
					dataService.load();
				}
			}

			var toolItem = _.find($scope.tools.items, {id:'t13'});  //item filter button
			if(toolItem)
			{
				toolItem.caption = 'productionplanning.common.toolbarMainEntityFilter';
			}

			ppsCommonStructureFilterService.onFilterButtonRemoved.register($scope.updateTools);
			cloudDesktopPinningContextService.onSetPinningContext.register(reloadData);
			// refresh data when task are refreshed
			mainService.registerRefreshRequested(dataService.refresh);
			$scope.$on('$destroy', function () {
				ppsCommonStructureFilterService.onFilterButtonRemoved.unregister($scope.updateTools);
				mainService.unregisterRefreshRequested(dataService.refresh);
				cloudDesktopPinningContextService.onSetPinningContext.unregister(reloadData);
			});
		}
	]);
})();