(function (angular) {
    /* global angular */
    'use strict';

    var moduleName = 'cloud.uitesting';
    var testingModule = angular.module(moduleName);

    /**
     * @ngdoc service
     * @name cloudUitestingMainService
     * @function
     *
     * @description
     * cloudUitestingMainService is the data service for all UI testing related functionality.
     */
    testingModule.factory('cloudUitestingMainService', cloudUitestingMainService);

    cloudUitestingMainService.$inject = ['$http', '$log', 'moment'];

    function cloudUitestingMainService($http, $log, moment) {
        var service = {};
        var currentItem;

        service.getSelected = function getSelected() {
            return currentItem;
        };

        service.setSelected = function setSelected(item) {
            currentItem = item;
        };

        service.getList = function () {
            return $http({
                method: 'GET',
                url: globals.webApiBaseUrl + 'cloud/uitesting/list'
            }).then(function (response) {
                response.data.forEach(function( obj ) {
                    obj.Datetime = moment.utc(obj.Datetime);
                });
                return response.data;
            }, function (error) {
                $log.error(error);
            });
        };

        service.getMockCountryData = function () {
            return $http({
                method: 'GET',
                url: globals.webApiBaseUrl + 'cloud/uitesting/countrylist'
            }).then(function (response) {
                return response;
            }, function (error) {
                $log.error(error);
            });
        };

        return service;

    }
})(angular);

