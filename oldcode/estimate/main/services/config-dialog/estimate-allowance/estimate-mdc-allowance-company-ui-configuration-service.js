/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

    'use strict';

    let moduleName = 'estimate.main';

    /**
     * @ngdoc service
     * @name estimateMdcAllowanceCompanyUIConfigurationService
     * @function
     *
     * @description
     *basicsCostCodesCompanyConfigService
     */
    angular.module(moduleName).factory('estimateMdcAllowanceCompanyUIConfigurationService',
        ['platformTranslateService',
            function (platformTranslateService) {

                let service = {};

                service.getColumns = function getColumns(){
                    return [
                        {
                            id: 'code',
                            field: 'Code',
                            name: 'Code',
                            name$tr$: 'cloud.common.entityCode',
                            formatter: 'code',
                            readonly: true,
                            editor: null,
                        },
                        {
                            id: 'CompanyName',
                            field: 'CompanyName',
                            name: 'Company Name',
                            name$tr$: 'cloud.common.entityCompanyName',
                            formatter: 'description',
                            readonly: true,
                            editor: null,
                        },
                        {
                            id: 'IsChecked',
                            field: 'IsChecked',
                            name: 'Can Look Up',
                            name$tr$: 'basics.costcodes.canlookup',
                            formatter: 'boolean',
                            editor: 'boolean',
                            width: 100,
                        }
                    ];
                };

                let gridColumns =  service.getColumns();

                platformTranslateService.translateGridConfig(gridColumns);

                service.getStandardConfigForListView = function(){
                    return{
                        addValidationAutomatically: true,
                        columns : gridColumns
                    };
                };

                return service;
            }
        ]);
})(angular);

