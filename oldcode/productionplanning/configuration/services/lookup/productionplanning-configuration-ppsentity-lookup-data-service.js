(function (angular) {
    'use strict';
//productionplanning-configuration-ppsentity-lookup-data-service.js
    var moduleName = 'productionplanning.configuration';
    /**
     * @ngdoc service
     * @name productionplanningConfigurationPpsentityLookupDataService
     * @function
     *
     * @description
     * productionplanningConfigurationPpsentityLookupDataService is the data service for getting Ppsentity data.
     */
    angular.module(moduleName).factory('productionplanningConfigurationPpsentityLookupDataService', lookupDataService);
    lookupDataService.$inject = ['$injector', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator'];

    function lookupDataService($injector, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
        basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('productionplanningConfigurationPpsentityLookupDataService', {
            valMember: 'Id',
            dispMember: 'DescriptionInfo.Translated',
            uuid: '2277b1ea5fd844be82952ca57e2687f7',
            columns: [

                {
                    id: 'Description',
                    field: 'DescriptionInfo',
                    name: 'Description',
                    formatter: 'translation',
                    name$tr$: 'cloud.common.entityDescription'
                }
            ]

        });

        var lookupDataServiceConfig = {
            httpRead: {
                route: globals.webApiBaseUrl + 'basics/customize/ppsentity/',
                endPointRead: 'list'
            },
            filterParam: {},
            prepareFilter: function prepareFilter() { return {}; }
            //remark: because the actual Request Method of is POST in the server-side, then we need to set 'filterParam' and 'prepareFilter', so we can ensure that it will be POST.
        };

        return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
    }
})(angular);
