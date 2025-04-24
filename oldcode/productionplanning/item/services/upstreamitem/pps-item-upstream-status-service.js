/**
 * Created by anl on 12/18/2017.
 */

(function (angular) {

    'use strict';
    var moduleName = 'productionplanning.item';

    angular.module(moduleName).factory('productionplanningUpStreamStatusLookupService', lookupService);

    lookupService.$inject = ['$http', '$q', '$injector', 'basicsLookupdataLookupDescriptorService'];

    function lookupService($http, $q, $injector, basicsLookupdataLookupDescriptorService) {
        var service = {};

	    service.getList = function () {
		    return basicsLookupdataLookupDescriptorService.getData('basics.customize.ppsupstreamstatus');
	    };

        service.load = function load() {
            return $http.post(globals.webApiBaseUrl + 'basics/customize/ppsupstreamitemstatus/list').then(function (response) {
	            basicsLookupdataLookupDescriptorService.updateData('basics.customize.ppsupstreamstatus', response.data);
            });
        };

        service.load();

        return service;
    }

})(angular);