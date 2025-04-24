/**
 * Created by zov on 11/6/2019.
 */
(function () {
    'use strict';
    /*global angular*/

    var moduleName = 'productionplanning.common';
    angular.module(moduleName).constant('ppsDataCache', {
        itemModule: {
            // itemProductsTotalArea use to sync
            itemProductsTotalArea: [
                // {
                //     itemId:
                //     productsTotalArea:
                // }
            ],
            clearCache: function () {
                this.itemProductsTotalArea.length = 0;
            }
        }
    });
})();