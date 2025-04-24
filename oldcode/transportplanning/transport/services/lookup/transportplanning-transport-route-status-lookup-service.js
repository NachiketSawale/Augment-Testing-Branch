(function (angular) {

    /**
     * @description
     * transportplanningTransportRouteStatusLookupService provides complete route status lookup data
     */

    /* global globals, angular */
    'use strict';
    var moduleName = 'transportplanning.transport';

    angular.module(moduleName).factory('transportplanningTransportRouteStatusLookupService', lookupService);

    lookupService.$inject = ['$http', '$q', '$injector', 'basicsLookupdataLookupDescriptorService'];

    function lookupService($http, $q, $injector, basicsLookupdataLookupDescriptorService) {
        var service = {};
        var lookupData = {
            routeStatusList: []
        };

        service.getList = function () {
            return lookupData.routeStatusList;
        };

        service.clearCache = function clearCache() {
            lookupData.routeStatusList = [];
        };

        service.load = function load() {
            $http.post(globals.webApiBaseUrl + 'basics/customize/transportrtestatus/list').then(function (response) {
                lookupData.routeStatusList = response.data;
                basicsLookupdataLookupDescriptorService.updateData('basics.customize.transportrtestatus', response.data);
            });

        };

        service.load();

        return service;
    }

})(angular);
