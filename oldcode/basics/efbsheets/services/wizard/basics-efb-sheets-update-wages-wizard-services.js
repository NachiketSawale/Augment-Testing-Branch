/**
 * $Id:  $
 * Copyright (c) RIB Software SE
 */

(function () {
    'use strict';
    /* global globals */

    let moduleName = 'basics.efbsheets';
    /**
     * @ngdoc service
     * @name basicsEfbsheetsUpdateWagesWizardService
     * @description provides wizard configuration
     */

    angular.module(moduleName).factory('basicsEfbsheetsUpdateWagesWizardService', ['$http', '$injector', '$translate', 'platformModalService', 'basicsEfbsheetsMainService', 'platformTranslateService', 'platformSidebarWizardConfigService',
        'platformModalFormConfigService',
        function ($http, $injector, $translate, platformModalService, basicsEfbsheetsMainService, platformTranslateService, platformSidebarWizardConfigService, platformModalFormConfigService) {

            let service = {};

            service.updateWages = function updateWages() {

                let title = 'basics.efbsheets.updateWages';
                let updateWagesConfig = {
                    title: $translate.instant(title),
                    dataItem: {
                        selectedScope: 'HighlightedCrewMix'
                    },
                    formConfiguration: {
                        fid: 'basics.efbsheets.updateWages',
                        version: '0.1.1',
                        showGrouping: true,
                        groups: [
                            {
                                gid: 'selectedScope',
                                header: 'Select scope for Crew Mixes',
                                header$tr$: 'basics.efbsheets.selectCrewMixeScope',
                                visible: true,
                                isOpen: true,
                                attributes: [],
                                sortOrder: 1
                            }
                        ],
                        rows: [
                            {
                                gid: 'selectedScope',
                                rid: 'selectedScope',
                                label: 'Select Crew Mixes Scope',
                                label$tr$: 'basics.efbsheets.selectCrewMixeScope',
                                type: 'radio',
                                model: 'selectedScope',
                                sortOrder: 0,
                                options: {
                                    labelMember: 'label',
                                    valueMember: 'Value',
                                    groupName: 'scope',
                                    items: [
                                        {
                                            Id: 0,
                                            label: 'Select Highlighted Crew Mix',
                                            label$tr$: 'basics.efbsheets.selectHighlightedCrewMix',
                                            Value: 'HighlightedCrewMix'
                                        },
                                        {
                                            Id: 1,
                                            label: 'Select Current Crew Mix',
                                            label$tr$: 'basics.efbsheets.currentResultSet',
                                            Value: 'CurrentResultSet'
                                        },
                                        {
                                            Id: 2,
                                            label: 'Select Entire Crew Mix',
                                            label$tr$: 'basics.efbsheets.selectEntireCrewMix',
                                            Value: 'EntireCrewMix'
                                        }
                                    ]
                                }
                            }
                        ]
                    },

                    handleOK: function handleOK(result) {
                        if (!result || !result.ok || !result.data) {
                            return;
                        }

                        let scopeMap = {
                            'HighlightedCrewMix': 0,
                            'CurrentResultSet': 1,
                            'EntireCrewMix': 2
                        };

                        let crewMixScope = scopeMap[result.data.selectedScope];

                        let selectedCrewMixes = [];

                        if (crewMixScope === 0) {
                            selectedCrewMixes = basicsEfbsheetsMainService.getSelectedEntities();
                        } else if (crewMixScope === 1) {
                            selectedCrewMixes = basicsEfbsheetsMainService.getList();
                        } else if (crewMixScope === 2) {
                            selectedCrewMixes = []; // This will come from backend
                        }

                        selectedCrewMixes = Array.isArray(selectedCrewMixes) ? selectedCrewMixes : [selectedCrewMixes];
                        let mainItemIds = selectedCrewMixes.map(entity => parseInt(entity.Id));

                        let postData = {
                            'mainItemId': mainItemIds,
                            'crewMixScope': crewMixScope
                        };

                        function updateCrewMixes() {
                            return $http.post(globals.webApiBaseUrl + 'basics/efbsheets/crewmixes/updatewages', postData)
                                .then(function (response) {

                                    $injector.get('basicsEfbSheetsWageGroupLookupDataService').clearCache();
                                    $injector.get('basicsEfbSheetsSurchargeLookupDataService').clearCache();
                                    $injector.get('basicsEfbSheetsAdditionalCostLookupDataService').clearCache();

                                    basicsEfbsheetsMainService.addList(response.data);
                                    basicsEfbsheetsMainService.fireListLoaded();

                                    basicsEfbsheetsMainService.setSelected({}).then(function () {
                                        let list = basicsEfbsheetsMainService.getList();
                                        let updatedCrewMix = _.find(list, { Id: mainItemIds[0] });

                                        if (updatedCrewMix) {
                                            basicsEfbsheetsMainService.setSelected(updatedCrewMix);
                                        }
                                        showSuccessMessage();
                                    });
                                });
                        }

                        basicsEfbsheetsMainService.updateAndExecute(updateCrewMixes);
                    }
                };

                function showSuccessMessage() {
                    var modalOptions = {
                        headerTextKey: $translate.instant('basics.efbsheets.updateWages'),
                        bodyTextKey: $translate.instant('basics.efbsheets.updateWagesSuccess'),
                        showOkButton: true,
                        iconClass: 'ico-info'
                    };
                    platformModalService.showDialog(modalOptions);
                };

                platformTranslateService.translateFormConfig(updateWagesConfig.formConfiguration);
                updateWagesConfig.scope = platformSidebarWizardConfigService.getCurrentScope();

                platformModalFormConfigService.showDialog(updateWagesConfig);
            };

            return service;
        }
    ]);
})();

