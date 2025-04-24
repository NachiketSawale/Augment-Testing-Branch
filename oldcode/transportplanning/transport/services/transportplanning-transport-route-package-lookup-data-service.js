(function (angular) {
    'use strict';

    var moduleName = 'transportplanning.transport';
    /**
     * @ngdoc service
     * @name TransportplanningTransportRoutePackageLookupDataService
     * @function
     *
     * @description
     * TransportplanningTransportRoutePackageLookupDataService is the data service for getting packages of the current route.
     */
    angular.module(moduleName).factory('transportplanningTransportRoutePackageLookupDataService', lookupDataService);
    lookupDataService.$inject = ['$injector', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator'];

    function lookupDataService($injector, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
        basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('transportplanningTransportRoutePackageLookupDataService', {
            valMember: 'Id',
            dispMember: 'Code',
            uuid: '568c370264a8403f8c47f9df1fbd6b36',
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
                route: globals.webApiBaseUrl + 'transportplanning/package/',
                endPointRead: 'listbyroute',
            },
            filterParam: 'routeId',
        };

        return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
    }
})(angular);
