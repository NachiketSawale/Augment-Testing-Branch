/**
 * Created by zwz on 6/2/2017.
 */
(function (angular) {
    'use strict';
    var moduleName = 'productionplanning.ppsmaterial';
    angular.module(moduleName).factory('productionplanningPpsMaterialLookupItems',productionplanningPpsMaterialLookupItems);
    productionplanningPpsMaterialLookupItems.$inject = ['basicsLookupdataLookupDescriptorService'];
    function productionplanningPpsMaterialLookupItems(basicsLookupdataLookupDescriptorService) {
        var eventForItems = [
            {Id: 1, Code: 'Order Header'},
            {Id: 2, Code: 'PPS Header'},
            {Id: 3, Code: 'PPS Item'},
            {Id: 4, Code: 'PPS Product Description'},
            {Id: 5, Code: 'PPS Product'}
        ];
        var lookupItems = {
            'eventFor': eventForItems
        };
        basicsLookupdataLookupDescriptorService.attachData(lookupItems);
        return lookupItems;
    }
})(angular);