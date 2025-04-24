/**
 * Created by anl on 12/15/2017.
 */

(function (angular) {

    'use strict';
    var moduleName = 'productionplanning.mounting';

    angular.module(moduleName).factory('productionplanningMountingStatusLookupService', lookupService);

    lookupService.$inject = ['$http', '$q', '$injector', 'basicsLookupdataLookupDescriptorService'];

    function lookupService($http, $q, $injector, basicsLookupdataLookupDescriptorService) {
        var service = {};
        var lookupData = {
            mntRequisitionStatusList: [],
            mntActivityStatusList: [],
            mntReportStatusList: []
        };

        service.getRequisitionList = function () {
            return lookupData.mntRequisitionStatusList;
        };
        service.getActivityList = function () {
            return lookupData.mntActivityStatusList;
        };
        service.getReportList = function () {
            return lookupData.mntReportStatusList;
        };

        service.clearCache = function clearCache() {
            lookupData.mntRequisitionStatusList = [];
            lookupData.mntActivityStatusList = [];
            lookupData.mntReportStatusList = [];
        };

        service.load = function load() {
        	$http.post(globals.webApiBaseUrl + 'basics/customize/mountingrequisitionstatus/list').then(function (response) {
                lookupData.mntRequisitionStatusList = response.data;
                basicsLookupdataLookupDescriptorService.updateData('basics.customize.mountingrequisitionstatus', response.data);
            });
        	$http.post(globals.webApiBaseUrl + 'basics/customize/mountingactivitystatus/list').then(function (response) {
                lookupData.mntActivityStatusList = response.data;
                basicsLookupdataLookupDescriptorService.updateData('basics.customize.mountingactivitystatus', response.data);
            });
        	$http.post(globals.webApiBaseUrl + 'basics/customize/mountingreportstatus/list').then(function (response) {
                lookupData.mntReportStatusList = response.data;
                basicsLookupdataLookupDescriptorService.updateData('basics.customize.mountingreportstatus', response.data);
            });
        };

        service.load();

        return service;
    }

})(angular);
