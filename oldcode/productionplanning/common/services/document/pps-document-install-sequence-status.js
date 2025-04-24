(function (angular){

    /* global globals, _ */
    'use strict';
    let moduleName = 'productionplanning.common';

    angular.module(moduleName).value('ppsInstallSequenceStatus', {
        Nothing: 0,
        Append: 1,
        Insert: 2,
        Remove: 3
    });

})(angular);