/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
    /* global globals, _ */
    'use strict';

    let moduleName = 'basics.efbsheets';
    let efbSheetsModule = angular.module(moduleName);
    /**
     * @ngdoc factory
     * @name basicsEfbSheetsSideBarWizardService
     * @description
     * basicsEfbSheetsSideBarWizardService provides update options for Crew Mixes
     */
    efbSheetsModule.factory('basicsEfbSheetsSideBarWizardService',
        ['$injector',

            function ($injector) {

                let service = {};

                service.updateWages = function updateWages() {
                    let basicsEfbsheetsUpdateWagesWizardService = $injector.get('basicsEfbsheetsUpdateWagesWizardService');
                    basicsEfbsheetsUpdateWagesWizardService.updateWages();
                };

                service.updateWagesFromMaster = function updateWagesFromMaster() {
                    let projectEfbsheetsDataService = $injector.get('basicsEfbsheetsProjectMainService');
                    let platformTranslateService = $injector.get('platformTranslateService');
                    let platformModalFormConfigService = $injector.get('platformModalFormConfigService');
                    let platformSidebarWizardConfigService = $injector.get('platformSidebarWizardConfigService');
                    let basicsEfbsheetsMainService = $injector.get('basicsEfbsheetsMainService');
                    let $translate = $injector.get('$translate');
                    let $http = $injector.get('$http');
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
                                selectedCrewMixes = projectEfbsheetsDataService.getSelectedEntities();
                            } else if (crewMixScope === 1) {
                                selectedCrewMixes = projectEfbsheetsDataService.getList();
                            } else if (crewMixScope === 2) {
                                selectedCrewMixes = []; // This will come from backend
                            }

                            selectedCrewMixes = Array.isArray(selectedCrewMixes) ? selectedCrewMixes : [selectedCrewMixes];
                            let mainItemIds = selectedCrewMixes.length
                            ? selectedCrewMixes.map(entity => parseInt(entity?.Id)).filter(id => !isNaN(id))
                            : [];
                                                      
                            if (crewMixScope === 0 && !mainItemIds.length) {
                                showNoSelectionMessage();
                                return;
                            }

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

                                        projectEfbsheetsDataService.addList(response.data);
                                        projectEfbsheetsDataService.fireListLoaded();

                                        projectEfbsheetsDataService.setSelected({}).then(function () {
                                            let list = projectEfbsheetsDataService.getList();
                                            let updatedCrewMix = _.find(list, { Id: mainItemIds[0] });

                                            if (updatedCrewMix) {
                                                projectEfbsheetsDataService.setSelected(updatedCrewMix);
                                            }
                                            showSuccessMessage();
                                        });
                                    });
                            }

                            basicsEfbsheetsMainService.updateAndExecute(updateCrewMixes);
                        }
                    };

                    function showSuccessMessage() {
                        var platformModalService = $injector.get('platformModalService');
                        var modalOptions = {
                            headerTextKey: $translate.instant('basics.efbsheets.updateWages'),
                            bodyTextKey: $translate.instant('basics.efbsheets.updateWagesSuccess'),
                            showOkButton: true,
                            iconClass: 'ico-info'
                        };
                        platformModalService.showDialog(modalOptions);
                    };

                    function showNoSelectionMessage() {
                        var platformModalService = $injector.get('platformModalService');
                        var modalOptions = {
                            headerTextKey: $translate.instant('basics.efbsheets.updateWages'),
                            bodyTextKey: $translate.instant('basics.efbsheets.noSelection'),
                            showOkButton: true,
                            iconClass: 'ico-warning'
                        };
                        platformModalService.showDialog(modalOptions);
                    }

                    platformTranslateService.translateFormConfig(updateWagesConfig.formConfiguration);
                    updateWagesConfig.scope = platformSidebarWizardConfigService.getCurrentScope();

                    platformModalFormConfigService.showDialog(updateWagesConfig);
                }

                return service;
            }
        ]);
})(angular);

