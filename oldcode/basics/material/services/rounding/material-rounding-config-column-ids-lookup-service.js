(function (angular) {
    'use strict';
    /* global globals */

    angular.module('basics.material').factory('materialRoundingConfigColumnIdsLookupService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

        function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

            basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('materialRoundingConfigColumnIdsLookupService', {
                valMember: 'Id',
                dispMember: 'Description',
                columns: [
                    {
                        id: 'Description',
                        field: 'Column',
                        name: 'Description',
                        formatter: 'description',
                        width: 300,
                        name$tr$: 'cloud.common.entityDescription'
                    }
                ],
                uuid: '3282dd79e07c45739b2e2576cc66b911'
            });

            let materialMainRoundingConfigColumnIdsLookupDataServiceConfig = {
                httpRead: {
                    route: globals.webApiBaseUrl + 'basics/material/roundingconfig/',
                    endPointRead: 'getroundingcolumnids',
                    usePostForRead: false
                }
            };

            return platformLookupDataServiceFactory.createInstance(materialMainRoundingConfigColumnIdsLookupDataServiceConfig).service;
        }]);
})(angular);
