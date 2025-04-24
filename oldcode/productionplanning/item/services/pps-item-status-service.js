/**
 * Created by anl on 12/18/2017.
 */

(function (angular) {

    'use strict';
    var moduleName = 'productionplanning.item';

    angular.module(moduleName).factory('productionplanningItemStatusLookupService', lookupService);

    lookupService.$inject = ['$http', '$q', '$injector', 'basicsLookupdataLookupDescriptorService'];

    function lookupService($http, $q, $injector, basicsLookupdataLookupDescriptorService) {
        var service = {};
        var lookupData = {
            itemStatusList: []
        };

        service.getItemList = function () {
            return lookupData.itemStatusList;
        };

        service.clearCache = function clearCache() {
            lookupData.itemStatusList = [];
        };

        service.load = function load() {
            return $http.post(globals.webApiBaseUrl + 'basics/customize/ppsitemstatus/list').then(function (response) {
                lookupData.itemStatusList = response.data;
                basicsLookupdataLookupDescriptorService.updateData('basics.customize.ppsitemstatus', response.data);
            });
        };

        service.load();

        return service;
    }

})(angular);