(function () {

    /*global angular*/
    'use strict';
    var moduleName = 'productionplanning.ppsmaterial';
    var angModule = angular.module(moduleName);


    /* jshint -W072*/ //many parameters because of dependency injection
    angModule.controller('ppsMaterialCompatibilityListController', ppsMaterialCompatibilityListController);

    ppsMaterialCompatibilityListController.$inject = ['$scope', 'platformContainerControllerService',
        'platformGridAPI'];
    function ppsMaterialCompatibilityListController($scope, platformContainerControllerService,
                                                    platformGridAPI) {

        platformContainerControllerService.initController($scope, moduleName, 'addd32320fb24fd3b047db0ab575816c');

        // var onCellChange = function (e, args) {
        //     var field = args.grid.getColumns()[args.cell].field;
        //
        //     if(field === 'PpsMaterialItemFk'){
        //         var ppsMaterial = args.item;  //create/change PpsMaterialItemFk
        //     }
        // };
        // platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);
    }
})();