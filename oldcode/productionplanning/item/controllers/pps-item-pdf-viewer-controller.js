(angular => {
    'use strict';
    const moduleName = 'productionplanning.item';
    angular.module(moduleName).controller('ppsItemPDFViewerController', ppsItemPDFViewerController);
    ppsItemPDFViewerController.$inject = ['$scope', '$controller', 'ppsCommonDocumentAnnotationExtension', 'productionplanningItemDataService'];
    function ppsItemPDFViewerController($scope, $controller,  ppsCommonDocumentAnnotationExtension, productionplanningItemDataService) {
        const baseController = 'modelWdeViewerIgeController';
        angular.extend(this, $controller(baseController, { $scope: $scope }));

        let isLoaded = false;
        $scope.$on('model.wdeviewer.loading', () => {
            isLoaded = false;
        });
        $scope.$on('model.wdeviewer.loaded', () => {
            isLoaded = true;
        });

        function updateTools() {
            $scope.tools.update();
        }

        function onItemSelectionChanged(){
            isLoaded = false;
            updateTools();
            ppsCommonDocumentAnnotationExtension.onItemSelectionChanged();
        }

        const scopeFn = {
            isLoaded: () => isLoaded,
        };
        ppsCommonDocumentAnnotationExtension.setScopeFn(scopeFn);
        productionplanningItemDataService.registerSelectionChanged(onItemSelectionChanged);

        $scope.$on('$destroy', () => {
            productionplanningItemDataService.unregisterSelectionChanged(onItemSelectionChanged);
        });
    }

})(angular);