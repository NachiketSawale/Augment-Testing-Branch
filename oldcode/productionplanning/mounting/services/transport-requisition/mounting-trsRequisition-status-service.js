/**
 * Created by anl on 12/20/2017.
 */

(function (angular) {
    'use strict';
    var moduleName = 'productionplanning.mounting';

    angular.module(moduleName).factory('mountingTrsRequisitionStatusLookupService', mntTrsReqLookupService);

	mntTrsReqLookupService.$inject = ['$http', '$q', '$injector', 'basicsLookupdataLookupDescriptorService'];

    function mntTrsReqLookupService($http, $q, $injector, basicsLookupdataLookupDescriptorService) {
        var service = {};
        var lookupData = {
            trsRequisitionStatusList: []
        };

        service.getList = function () {
            return lookupData.trsRequisitionStatusList;
        };

        service.clearCache = function clearCache() {
            lookupData.trsRequisitionStatusList = [];
        };

        service.load = function load() {
            $http.post(globals.webApiBaseUrl + 'basics/customize/transportrequisitionstatus/list').then(function (response) {
                lookupData.trsRequisitionStatusList = response.data;
                basicsLookupdataLookupDescriptorService.updateData('basics.customize.transportrequisitionstatus', response.data);
            });
        };

        service.load();

        return service;
    }

})(angular);
