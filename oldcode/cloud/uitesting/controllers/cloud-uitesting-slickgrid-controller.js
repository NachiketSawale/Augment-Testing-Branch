/**
 * Created by ong on 15.10.2019.
 */
(function () {

    'use strict';
    var moduleName = 'cloud.uitesting';

    /**
     * @ngdoc controller
     * @name cloudUitestingSlickgridController
     * @function
     *
     * @description
     * Controller for the  list view of resource entities
     **/
    angular.module(moduleName).controller('cloudUitestingSlickgridController', cloudUitestingSlickgridController);

    cloudUitestingSlickgridController.$inject = ['$scope','platformGridControllerService', 'platformGridAPI', '$translate', 'cloudUitestingMainService', 'cloudUitestingLookupService'];

    function cloudUitestingSlickgridController($scope, platformGridControllerService, platformGridAPI, $translate, cloudUitestingMainService, cloudUitestingLookupService) {

        $scope.gridId = '89942a432c00489c9382e88d317fe797';

        $scope.gridData = {
            state: $scope.gridId
        };

        $scope.loadingOption = {
            loading: false,
            info: 'loading data...'
        };

        var testColumns = {
            columns: [
                {
                    id: 'boolean',
                    field: 'Boolean',
                    name: $translate.instant('cloud.uitesting.entityBoolean'),
                    formatter: 'boolean',
                    editor: 'boolean',
                    formatterOptions: {
                        hideReadonly : true
                    },
                    width: 50
                },
                {
                    id: 'code',
                    field: 'AlphanumericString',
                    name: $translate.instant('cloud.uitesting.entityCode'),
                    formatter: 'code',
                    editor: 'code',
                    formatterOptions: {
                        hideReadonly : false
                    },
                    width: 50
                },
                {
                    id: 'integer',
                    field: 'Numeric',
                    name: $translate.instant('cloud.uitesting.entityNumeric'),
                    formatter: 'integer',
                    editor: 'integer',
                    formatterOptions: {
                        hideReadonly : false
                    },
                    width: 50
                },
                {
                    id: 'quantity',
                    field: 'Quantity',
                    name: $translate.instant('cloud.uitesting.entityQuantity'),
                    formatter: 'quantity',
                    editor: 'quantity',
                    formatterOptions: {
                        hideReadonly : false
                    },
                    width: 50
                },
                {
                    id: 'factor',
                    field: 'Factor',
                    name: $translate.instant('cloud.uitesting.entityFactor'),
                    formatter: 'factor',
                    editor: 'factor',
                    formatterOptions: {
                        hideReadonly : false
                    },
                    width: 50
                },
                {
                    id: 'exchangerate',
                    field: 'ExchangeRate',
                    name: $translate.instant('cloud.uitesting.entityExchangerate'),
                    formatter: 'exchangerate',
                    editor: 'exchangerate',
                    formatterOptions: {
                        hideReadonly : false
                    },
                    width: 50
                },
                {
                    id: 'percentage',
                    field: 'Percentage',
                    name: $translate.instant('cloud.uitesting.entityPercentage'),
                    formatter: 'percent',
                    editor: 'percent',
                    formatterOptions: {
                        hideReadonly : false
                    },
                    width: 50
                },
                {
                    id: 'description',
                    field: 'Description',
                    name: $translate.instant('cloud.uitesting.entityDescription'),
                    formatter: 'description',
                    editor: 'description',
                    formatterOptions: {
                        hideReadonly : false
                    },
                    width: 150
                },
                {
                    id: 'comment',
                    field: 'Description',
                    name: $translate.instant('cloud.uitesting.entityComment'),
                    formatter: 'comment',
                    editor: 'comment',
                    formatterOptions: {
                        hideReadonly : false
                    },
                    width: 150
                },
                {
                    id: 'remark',
                    field: 'Description',
                    name: $translate.instant('cloud.uitesting.entityRemark'),
                    formatter: 'remark',
                    editor: 'remark',
                    formatterOptions: {
                        hideReadonly : false
                    },
                    width: 150
                },
                {
                    id: 'date',
                    field: 'Datetime',
                    name: $translate.instant('cloud.uitesting.entityDate'),
                    formatter: 'date',
                    editor: 'date',
                    formatterOptions: {
                        hideReadonly : false
                    },
                    width: 150
                },
                {
                    id: 'time',
                    field: 'Datetime',
                    name: $translate.instant('cloud.uitesting.entityTime'),
                    formatter: 'time',
                    editor: 'time',
                    formatterOptions: {
                        hideReadonly : false
                    },
                    width: 150
                },
                {
                    id: 'datetime',
                    field: 'Datetime',
                    name: $translate.instant('cloud.uitesting.entityDatetime'),
                    formatter: 'datetime',
                    editor: 'datetime',
                    formatterOptions: {
                        hideReadonly : false
                    },
                    width: 150
                },
                {
                    id: 'money',
                    field: 'Money',
                    name: $translate.instant('cloud.uitesting.entityMoney'),
                    formatter: 'money',
                    editor: 'money',
                    formatterOptions: {
                        hideReadonly : false
                    },
                    width: 150
                },
                {
                    id: 'select',
                    field: 'CountryId',
                    domain: 'select',
                    editor: 'select',
                    editorOptions: {
                        displayMember: 'CountryName',
                        valueMember: 'Id',
                        items: cloudUitestingLookupService,
                        popupOptions: {
                            hasDefaultWidth: false
                        }
                    },
                    formatter: 'select',
                    name$tr$: $translate.instant('cloud.uitesting.entitySelect'),
                    width: 100
                },
                {
                    id: 'imageselect',
                    editor: 'imageselect',
                    name$tr$: $translate.instant('cloud.uitesting.entityImageselect'),
                    editorOptions: {serviceName: 'basicsConfigReportGroupIconService'},
                    formatter: 'imageselect',
                    formatterOptions: {serviceName: 'basicsConfigReportGroupIconService'}
                },
                {
                    id: 'lookupdialog',
                    field: 'LookupDialogId',
                    name: $translate.instant('cloud.uitesting.entityLookupDialog'),
                    editor: 'lookup',
                    editorOptions: {
                        directive: 'business-partner-main-business-partner-dialog',
                        lookupOptions: {
                            showClearButton: true
                        }
                    },
                    formatter: 'lookup',
                    formatterOptions: {
                        lookupType: 'BusinessPartner',
                        displayMember: 'BusinessPartnerName1'
                    },
                    width: 150
                },
                {
                    id: 'lookup',
                    field: 'LookupId',
                    name: $translate.instant('cloud.uitesting.entityLookup'),
                    editor: 'lookup',
                    editorOptions: {
                        directive: 'basics-lookupdata-payment-term-lookup',
                        lookupOptions: {displayMember: 'Code', showClearButton: true}
                    },
                    formatter: 'lookup',
                    formatterOptions: {'lookupType': 'PaymentTerm', 'displayMember': 'Code'},
                    width: 80
                },
                {
                    id: 'color',
                    field: 'Color',
                    name: $translate.instant('cloud.uitesting.entityColor'),
                    formatter: 'colorpicker',
                    editor: 'colorpicker',
                    formatterOptions: {
                        hideReadonly : false
                    },
                    width: 150
                },
                {
                    id: 'email',
                    field: 'Email',
                    name: $translate.instant('cloud.uitesting.entityEmail'),
                    formatter: 'email',
                    editor: 'email',
                    formatterOptions: {
                        hideReadonly : false
                    },
                    width: 150
                },
                {
                    id: 'url',
                    field: 'Url',
                    name: $translate.instant('cloud.uitesting.entityUrl'),
                    formatter: 'url',
                    editor: 'url',
                    formatterOptions: {
                        hideReadonly : false
                    },
                    width: 150
                },
                {
                    id: 'phone',
                    field: 'Phone',
                    name: $translate.instant('cloud.uitesting.entityPhone'),
                    formatter: 'phone',
                    editor: 'phone',
                    formatterOptions: {
                        hideReadonly : false
                    },
                    width: 150
                }
            ]
        };

        var uiStandardService = {
            getStandardConfigForListView: function () {
                return testColumns;
            }
        };

        var myGridConfig = {initCalled: false, columns: []};

        platformGridControllerService.initListController($scope, uiStandardService, cloudUitestingMainService, null, myGridConfig);

        cloudUitestingMainService.getList().then(function (data) {
            platformGridAPI.items.data($scope.gridId, data);
        });
    }
})();