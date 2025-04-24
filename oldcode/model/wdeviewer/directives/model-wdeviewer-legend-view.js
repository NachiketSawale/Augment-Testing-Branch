(function (angular) {
    'use strict';

    var moduleName = 'model.wdeviewer';

    angular.module(moduleName).directive('modelWdeViewerLegendView', ['$q', 'modelWdeViewerIgeService', 'basicsLookupdataLookupDescriptorService', 'modelWdeViewerObserverService',
        function ($q, modelWdeViewerIgeService, basicsLookupdataLookupDescriptorService, modelWdeViewerObserverService) {
            return {
                restrict: 'A',
                templateUrl: globals.clientUrl + 'model.wdeviewer/templates/legend-view.html',
                require: '^modelWdeViewerIgeViewer',
                link: function (scope, element, attrs, igeViewerCtrl) {
                    let dimensionService = igeViewerCtrl.settings.dimensionService;

                    if (!dimensionService) {
                        scope.showLegend = false;
                        return;
                    }

                    scope.legends = [];

                    function observe() {
                        let unwatcher = modelWdeViewerObserverService.watch(function () {
                            return getDimensionCount();
                        }, update);

                        dimensionService.onDimensionUpdated.register(update);
                        dimensionService.onDimensionsUpdated.register(update);
                        igeViewerCtrl.onLegendChanged.register(update);

                        return function () {
                            unwatcher();
                            dimensionService.onDimensionUpdated.unregister(update);
                            dimensionService.onDimensionsUpdated.unregister(update);
                            igeViewerCtrl.onLegendChanged.unregister(update);
                        };
                    }

                    function getDimensionCount() {
                        let engine = igeViewerCtrl.getIGEInstance();
                        return !engine ? 0 : engine.dimensionCount();
                    }

                    function update() {
                        igeViewerCtrl.generateLegendsAsync().then(legends => {
                            scope.legends = legends;
                        });
                    }

                    let destroy = observe();
                    scope.$on('$destroy', destroy);
                }
            };
        }
    ]);

})(angular);