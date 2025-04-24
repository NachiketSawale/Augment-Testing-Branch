/**
 * Created by las on 7/31/2018.
 */


(function (angular) {

    'use strict';

    var moduleName = 'productionplanning.common';
    angular.module(moduleName).controller('productionplanningCommonPsdActivityFilterListController', commonPsdActivityFilterListController);

    commonPsdActivityFilterListController.$inject = ['$scope', '$injector', 'platformGridControllerService',
        'schedulingMainActivityStandardConfigurationService',
        'productionplanningCommonStructureFilterService',
        'productionplanningCommonPsdActivityFilterDataServiceFactory',
        'estimateCommonControllerFeaturesServiceProvider',
        'productionplanningEngineeringTaskClipboardService'];

    function commonPsdActivityFilterListController($scope, $injector, platformGridControllerService,
                                             psdActivityUiStandardService,
                                             PpsCommonStructureFilterService,
                                                   CommonPsdActivityFilterDataServiceFactory,
                                             estimateCommonControllerFeaturesServiceProvider,
                                             engineeringTaskClipboardService) {

        var mainServiceName = $scope.getContentValue('mainService');
        var mainService = $injector.get(mainServiceName);

        var activityFilterDataService = CommonPsdActivityFilterDataServiceFactory.createActivityFilterService(mainService);

        var gridConfig = {
            initCalled: false,
            columns: [],
            parentProp: 'ParentActivityFk',
            childProp: 'Activities',
            type: 'psdActivity-leadingStructure',
            dragDropService: engineeringTaskClipboardService,
            marker: {
                filterService: PpsCommonStructureFilterService,
                filterId: mainServiceName + '_PsdActivity',
                dataService: activityFilterDataService,
                serviceName: mainServiceName,
                serviceMethod: 'getPsdActivityList',
                multiSelect: false
            }
        };

        CommonPsdActivityFilterDataServiceFactory.extendByFilter(mainServiceName, activityFilterDataService, mainServiceName + '_PsdActivity', PpsCommonStructureFilterService);
        platformGridControllerService.initListController($scope, psdActivityUiStandardService, activityFilterDataService, null, gridConfig);

        estimateCommonControllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);

        function reloadData() {
            var projectId = mainService.getSelectedProjectId();
            if (projectId > 0) {
                activityFilterDataService.load();
            }
        }

        var toolItem = _.find($scope.tools.items, {id: 't13'});  //item filter button
        if (toolItem) {
            toolItem.caption = 'productionplanning.common.toolbarMainEntityFilter';
        }

        PpsCommonStructureFilterService.onFilterButtonRemoved.register($scope.updateTools);
        mainService.PinningContextChanged.register(reloadData);

        $scope.$on('$destroy', function () {
            PpsCommonStructureFilterService.onFilterButtonRemoved.unregister($scope.updateTools);
            mainService.PinningContextChanged.unregister(reloadData);
        });
    }

})(angular);