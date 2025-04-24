/*
 * $Id: cloud-uitesting-ui-standard-service.js 562411 2020-08-03 11:46:18Z ong $
 * Copyright (c) RIB Software SE
 */

(function () {
    'use strict';
    var moduleName = 'cloud.uitesting';

    /**
     * @ngdoc service
     * @name cloudUitestingUIConfigurationService
     * @function
     * @requires
     *
     * @description
     * The UI configuration service for the module.
     */
    angular.module(moduleName).factory('cloudUitestingUIStandardService',
        ['platformUIStandardConfigService', 'cloudUitestingTranslationService', 'platformSchemaService',

            function (platformUIStandardConfigService, cloudUitestingTranslationService, platformSchemaService) {

                function createGridLayout() {
                    return {
                        fid: 'cloud.uitesting.grid',
                        version: '1.1.1',
                        showGrouping: false,
                        groups: [
                            {
                                'gid': 'uitesting',
                                'attributes': ['StringType']
                            },
                            {
                                'gid': 'entityHistory',
                                'isHistory': true
                            }
                        ],
                        overloads: {
                        }
                    };
                }

                var uitestingDetailLayout = createGridLayout();

                var BaseService = platformUIStandardConfigService;

               /*var uitestingAttributeDomains = platformSchemaService.getSchemaFromCache({
                    typeName: 'TestDataDto',
                    moduleSubModule: 'Cloud.Uitesting'
                });*/

                var uitestingAttributeDomains = platformSchemaService.getSchemaFromCache({
                    typeName: 'CountryDto',
                    moduleSubModule: 'Basics.Country'
                });

                uitestingAttributeDomains = uitestingAttributeDomains.properties;

                return new BaseService(uitestingDetailLayout, uitestingAttributeDomains, cloudUitestingTranslationService);
            }
        ]);
})();
