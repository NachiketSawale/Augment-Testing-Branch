/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
    'use strict';
    let moduleName = 'estimate.main';

    angular.module(moduleName).factory('estimateMainSortCodesDialogService', [
         '$http', '$injector', 'estimateMainService', '$translate','platformModalFormConfigService', 'platformTranslateService',
        function ( $http, $injector, estimateMainService, $translate,platformModalFormConfigService, platformTranslateService) {

            const SORT_CODE_MAP = {
                'SortCode01': 'SortCode01',
                'SortCode02': 'SortCode02',
                'SortCode03': 'SortCode03',
                'SortCode04': 'SortCode04',
                'SortCode05': 'SortCode05',
                'SortCode06': 'SortCode06',
                'SortCode07': 'SortCode07',
                'SortCode08': 'SortCode08',
                'SortCode09': 'SortCode09',
                'SortCode10': 'SortCode10'
            };

            const DIALOG_HEIGHT = '200px';
            const DIALOG_WIDTH = '250px';
            const MIN_DIALOG_HEIGHT = '250px';
            const DEFAULT_MESSAGE = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: 'Code'});
            const UNIQUE_MESSAGE = $translate.instant('cloud.common.uniqueValueErrorMessage', {object: 'Code'});

            let service = {};
            let newLookupJson = [];
            service.layout = {};

            service.create = function create(item, $scope) {
                let newCreatedItem = {};
                getSortCodeList($scope).then(sortCodeList => {
                    newLookupJson = getNewLookupJson($scope,sortCodeList);

                    let sortCodeType = getSortCodeType($scope.dataServiceName);
                    let sortCodeNumber = sortCodeType ? sortCodeType.slice(-2) : '';
                    let projectId = estimateMainService.getSelectedProjectId() || 0;

                    service.layout = {
                        title: $translate.instant('estimate.main.createNewSortCode') + '-' + sortCodeNumber,
                        dataItem: newCreatedItem,
                        dialogOptions: {
                            height: DIALOG_HEIGHT,
                            width: DIALOG_WIDTH,
                            minHeight: MIN_DIALOG_HEIGHT,
                            disableOkButton: () => !newCreatedItem.Code || !!newCreatedItem.__rt$data.errors?.Code,
                        },
                        showOkButton: true,
                        resizeable: true,
                        formConfiguration: getDialogConfig(sortCodeNumber, newLookupJson, $translate),
                        handleOK: function handleOK(result) {
                            result.data.Description = result.data.DescriptionInfo ? result.data.DescriptionInfo.Translated : '';
                            let sortCodeCompleteDto = {
                                'ProjectFk': projectId,
                                'Code': result.data.Code,
                                'Description': result.data.Description,
                                'SortCodeType': sortCodeType,
                            };

                            $http.post(globals.webApiBaseUrl + 'project/structures/SaveSortCode', sortCodeCompleteDto)
                                .then(function (response) {
                                    item[sortCodeType + 'Fk'] = response.data;
                                    item['SortDesc'+sortCodeNumber+'Fk'] = response.data;
                                    $injector.get($scope.dataServiceName).updateItemIdByCode($scope, result.data.Code, response.data,result.data.Description);
                                    estimateMainService.markItemAsModified(item);
                                });
                        }
                    };

                    platformTranslateService.translateFormConfig(service.layout.formConfiguration);
                    platformModalFormConfigService.showDialog(service.layout);
                });
            };

            async function getSortCodeList($scope) {
                return await $injector.get($scope.dataServiceName).getList($scope);
            }

            function getSortCodeType(dataServiceName) {
                return Object.keys(SORT_CODE_MAP).find(key => dataServiceName.includes(key)) || '';
            }

            function getNewLookupJson($scope,sortCodes) {
                return [
                    {
                        gid: 'SortCode',
                        rid: 'Code',
                        model: 'Code',
                        id: 'Code',
                        field: 'Code',
                        label: 'Code',
                        formatter: 'code',
                        width: 70,
                        label$tr$: 'cloud.common.entityCode',
                        searchable: true,
                        type: 'code',
                        readonly: false,
                        required: true,
                        cssClass: 'text-left',
                        validator: (entity, value, model) => validateSortCode($scope, entity, value, model,sortCodes)
                    },
                    {
                        gid: 'SortCode',
                        rid: 'Description',
                        model: 'DescriptionInfo',
                        id: 'Description',
                        field: 'DescriptionInfo',
                        label: 'Description',
                        formatter: 'translation',
                        width: 100,
                        label$tr$: 'cloud.common.entityDescription',
                        searchable: true,
                        type: 'translation',
                        readonly: false,
                    },
                ];
            }

            function validateSortCode($scope, entity, value, model,sortCodes) {
                let itemExists = sortCodes.find(x => x.Code === value) !== undefined;
                if (itemExists || value === '') {
                    return {
                        valid: false,
                        apply: true,
                        error:  value === '' ? DEFAULT_MESSAGE : itemExists ? UNIQUE_MESSAGE : DEFAULT_MESSAGE,
                        value: value,
                        model: model,
                        entity: entity,
                    };
                }
            }

            function getDialogConfig(sortCodeNumber, newLookupJson, $translate) {
                return {
                    fid: $translate.instant('estimate.main.createNewSortCode'),
                    version: '1.0',
                    showGrouping: true,
                    groups: [
                        {
                            gid: 'SortCode',
                            header$tr$: 'estimate.main.createNewSortCode' + '-' + sortCodeNumber,
                            header: $translate.instant('estimate.main.createNewSortCode') + '-' + sortCodeNumber,
                            isOpen: true,
                            height: '100px',
                        }
                    ],
                    rows: newLookupJson
                };
            }

            return service;
        }
    ]);
})();