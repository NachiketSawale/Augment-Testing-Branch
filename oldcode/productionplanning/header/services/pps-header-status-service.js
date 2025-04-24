/**
 * Created by anl on 12/18/2017.
 */

(function (angular) {

    'use strict';
    var moduleName = 'productionplanning.header';

    angular.module(moduleName).factory('productionplanningHeaderStatusLookupService', lookupService);

    lookupService.$inject = ['$http', '$q', '$injector', 'basicsLookupdataLookupDescriptorService'];

    function lookupService($http, $q, $injector, basicsLookupdataLookupDescriptorService) {
        var service = {};

	    service.getList = function () {
		    return basicsLookupdataLookupDescriptorService.getData('basics.customize.ppsheaderstatus');
	    };

        service.load = function load() {
            return $http.post(globals.webApiBaseUrl + 'basics/customize/ppsheaderstatus/list').then(function (response) {
	            basicsLookupdataLookupDescriptorService.updateData('basics.customize.ppsheaderstatus', response.data);
            });
        };

        service.load();

        return service;
    }

})(angular);