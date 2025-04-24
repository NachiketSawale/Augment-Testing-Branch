/**
 * Created by zwz on 5/5/2017.
 */



(function () {
    'use strict';

    var moduleName = 'productionplanning.ppsmaterial';

    angular.module(moduleName).controller('productionplanningPpsmaterialController', productionplanningPpsmaterialController);

    productionplanningPpsmaterialController.$inject = ['$scope', '$translate', 'platformMainControllerService',
        'productionplanningPpsMaterialRecordMainService', 'productionplanningPpsMaterialTranslationService',
        'basicsMaterialMaterialCatalogService', 'basicsMaterialMaterialGroupsService', 'platformNavBarService',
        'ppsMaterialToMdlProductTypeDataService',
        'ppsCadToMaterialDataService'];

    function productionplanningPpsmaterialController($scope, $translate, platformMainControllerService,
                                                     mainDataService, translateService,
                                                     materialCatalogService, materialGroupsService, platformNavBarService,
                                                     ppsMaterialToMdlProductTypeDataService,
                                                     ppsCadToMaterialDataService) {
        var opt = {search: true, reports: false};
        var result = platformMainControllerService.registerCompletely($scope, mainDataService, {},
            translateService, moduleName, opt);

        materialCatalogService.load();
        materialGroupsService.load();

        function update(){
            mainDataService.update().then(function(){
                ppsCadToMaterialDataService.update();
                ppsMaterialToMdlProductTypeDataService.update();
            });
        }

        function refresh(){
            mainDataService.refresh();
            ppsCadToMaterialDataService.refresh();
            ppsMaterialToMdlProductTypeDataService.refresh();
        }

        function clear() {
            mainDataService.clear();
            ppsCadToMaterialDataService.clear();
            ppsMaterialToMdlProductTypeDataService.clear();
        }

        platformNavBarService.getActionByKey('save').fn = update;
        platformNavBarService.getActionByKey('refresh').fn = refresh;
        platformNavBarService.getActionByKey('discard').fn = clear;

        // un-register on destroy
        $scope.$on('$destroy', function () {
            platformMainControllerService.unregisterCompletely(mainDataService, result, translateService, opt);
            mainDataService.clearData();

        });
    }
})();
