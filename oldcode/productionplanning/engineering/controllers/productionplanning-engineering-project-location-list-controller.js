/**
 * Created by las on 7/4/2018.
 */


(function (angular) {

    'use strict';

    var moduleName = 'productionplanning.engineering';
    angular.module(moduleName).controller('productionplanningEngineeringProjectLocationListController', EngProjectLocationListController);

    EngProjectLocationListController.$inject = ['$scope', 'platformGridControllerService', 'productionplanningEngineeringProjectLocationDataService',
        'projectLocationStandardConfigurationService', 'platformDragdropService',
        '$translate', 'platformGridAPI', 'productionplanningCommonStructureFilterService',
        'productionplanningEngineeringTaskClipboardService','productionplanningEngineeringMainService',
        'estimateCommonControllerFeaturesServiceProvider'];

    function EngProjectLocationListController($scope, platformGridControllerService, dataService, uiStandardService,  platformDragdropService,
                                      $translate, platformGridAPI, PpsCommonStructureFilterService,
                                      PpsEngineeringTaskClipboardService, mainService,
                                      estimateCommonControllerFeaturesServiceProvider) {
        var gridConfig = {
            initCalled: false,
            columns: [], parentProp: 'LocationParentFk',
            childProp: 'Locations',
            type: 'projectLocation-leadingStructure',
            dragDropService: PpsEngineeringTaskClipboardService,
            marker : {
                filterService: PpsCommonStructureFilterService,
                filterId: 'productionplanningEngineeringMainService_ProjectLocation',
                dataService: dataService,
                serviceName: 'productionplanningEngineeringProjectLocationDataService',
                serviceMethod: 'getList',
                multiSelect:false
            }
        };

        dataService.extendByFilter('productionplanningEngineeringMainService','productionplanningEngineeringMainService_ProjectLocation', PpsCommonStructureFilterService);
        platformGridControllerService.initListController($scope, uiStandardService, dataService, null, gridConfig);

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

        PpsCommonStructureFilterService.onFilterButtonRemoved.register($scope.updateTools);
        mainService.PinningContextChanged.register(reloadData);
        // refresh data when task are refreshed
        mainService.registerRefreshRequested(dataService.refresh);
        $scope.$on('$destroy', function () {
            PpsCommonStructureFilterService.onFilterButtonRemoved.unregister($scope.updateTools);
            mainService.unregisterRefreshRequested(dataService.refresh);
            mainService.PinningContextChanged.unregister(reloadData);
        });

    }

})(angular);