/**
 * Created by anl on 12/18/2017.
 */

(function (angular) {

    'use strict';
    var moduleName = 'productionplanning.productionset';

    angular.module(moduleName).factory('productionplanningProductionsetStatusLookupService', lookupService);

    lookupService.$inject = ['$http', '$q', '$injector', 'basicsLookupdataLookupDescriptorService'];

    function lookupService($http, $q, $injector, basicsLookupdataLookupDescriptorService) {
        var service = {};

	    service.getList = function () {
		    return basicsLookupdataLookupDescriptorService.getData('basics.customize.ppsproductionsetstatus');
	    };

        service.load = function load() {
            return $http.post(globals.webApiBaseUrl + 'basics/customize/ppsproductionsetstatus/list').then(function (response) {
	            basicsLookupdataLookupDescriptorService.updateData('basics.customize.ppsproductionsetstatus', response.data);
            });
        };

        service.load();

        return service;
    }

})(angular);