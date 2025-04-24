(function (angular) {
    'use strict';
    /* global globals, angular */
    var moduleName = 'transportplanning.transport';
    /**
     * @ngdoc service
     * @name transportplanningTransportRouteLookupDataService
    */
    angular.module(moduleName).factory('transportplanningTransportRouteLookupDataService', lookupDataService);
    lookupDataService.$inject = ['$injector', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator'];

    function lookupDataService($injector, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
        basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('transportplanningTransportRouteLookupDataService', {
            valMember: 'Id',
            dispMember: 'Code',
            uuid: 'c83389b09a164521975e9c1ad2a11d32',
            columns: [
                {
                    id: 'Code',
                    field: 'Code',
                    name: 'Code',
                    formatter: 'code',
                    name$tr$: 'cloud.common.entityCode'
                },
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
                route: globals.webApiBaseUrl + 'transportplanning/transport/route/',
                endPointRead: 'lookuplist',
            }
        };

        return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
    }
})(angular);
