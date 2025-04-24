/**
 * Created by anl on 6/1/2017.
 */

(function (angular) {
    'use strict';

    /**
     * @ngdoc service
     * @name productionplanningItemItemLookupDataService
     * @function
     *
     * @description
     * productionplanningItemItemLookupDataService is the data service for activity lookup
     */
    var moduleName = 'productionplanning.item';
    angular.module(moduleName).factory('productionplanningItemItemLookupDataService',
        ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

            function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {


                basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('productionplanningItemItemLookupDataService', {
                    valMember: 'Id',
                    dispMember: 'DescriptionInfo.Translated',
                    columns: [
                        {
                            id: 'Code',
                            field: 'Code',
                            name: 'Code',
                            formatter: 'code',
                            width: 100,
                            name$tr$: 'cloud.common.entityCode'
                        },
                        {
                            id: 'Description',
                            field: 'DescriptionInfo.Translated',
                            name: 'Description',
                            formatter: 'translation',
                            name$tr$: 'cloud.common.descriptionInfo'
                        }
                    ],
                    uuid: 'd9ca1c9f5dff4d6993fceb5f54542504'
                });

                var itemLookupDataServiceConfig = {
                    httpRead: {route: globals.webApiBaseUrl + 'productionplanning/item/', endPointRead: 'lookuptree'},
                    tree: { parentProp: 'PPSItemFk', childProp: 'ChildItems',initialState: 'expanded' },
                    filterParam: 'ppsHeaderFk'
                };

                return platformLookupDataServiceFactory.createInstance(itemLookupDataServiceConfig).service;
            }]);
})(angular);