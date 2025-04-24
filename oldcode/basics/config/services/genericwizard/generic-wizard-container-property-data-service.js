/**
 * Created by baf on 03.05.2016
 */
(function () {
    'use strict';
    var basicsConfigModule = angular.module('basics.config');

    /**
     * @ngdoc service
     * @name basicsConfigGenWizardContainerPropertyDataService
     * @function
     *
     * @description
     * basicsConfigGenWizardContainerPropertyDataService is a data service for managing properties displayed in container of generic wizards
     */
    basicsConfigModule.factory('basicsConfigGenWizardContainerPropertyDataService', ['basicsConfigGenWizardContainerDataService',
        'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsConfigGenericWizardDataProcessorFactoryService',
        'basicsConfigWizardXGroupService', 'basicsConfigGenWizardInstanceDataService', 'genericWizardUseCaseConfigService', 'platformRuntimeDataService', 'platformVanillaDataProtectorService',

        function (basicsConfigGenWizardContainerDataService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
                  basicsConfigGenericWizardDataProcessorFactoryService, basicsConfigWizardXGroupService, basicsConfigGenWizardInstanceDataService,
                  genericWizardUseCaseConfigService, platformRuntimeDataService, platformVanillaDataProtectorService) {

            var genWizardContainerPropertyDataServiceOption = {
                flatLeafItem: {
                    module: basicsConfigModule,
                    serviceName: 'basicsConfigGenWizardContainerPropertyDataService',
                    entityNameTranslationID: 'basics.config.entityProperty',
                    httpCreate: {route: globals.webApiBaseUrl + 'basics/config/genwizard/containerproperty/'},
                    httpRead: {
                        usePostForRead: true,
                        route: globals.webApiBaseUrl + 'basics/config/genwizard/containerproperty/'
                    },
                    dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
                        typeName: 'GenericWizardContainerPropertiesDto',
                        moduleSubModule: 'Basics.Config'
                    }),
                        basicsConfigGenericWizardDataProcessorFactoryService.getInstanceFkDataProcessor('Instance', basicsConfigWizardXGroupService),
                        basicsConfigGenericWizardDataProcessorFactoryService.getContainerFkDataProcessor('Container', basicsConfigGenWizardContainerDataService),
                        {processItem: processItem}
                    ],
                    actions: {
                        delete: true,
                        canDeleteCallBackFunc: canDelete,
                        create: 'flat',
                        canCreateCallBackFunc: canDeleteOrCreate
                    },
                    modification: {multi: true},
                    entityRole: {
                        leaf: {
                            itemName: 'Properties',
                            parentService: basicsConfigGenWizardContainerDataService
                        }
                    },
                    translation: {
                        uid: 'basicsConfigGenWizardContainerPropertyDataService',
                        title: 'basics.config.genWizardContainerPropertyListContainerTitle',
                        columns: [
                            {header: 'basics.config.label', field: 'LabelInfo'},
                            {header: 'basics.config.toolTip', field: 'ToolTipInfo'}
                        ],
                        dtoScheme: {typeName: 'GenericWizardContainerPropertiesDto', moduleSubModule: 'Basics.Config'}
                    },
                    presenter: {
                        list: {
                            initCreationData: function initCreationData(creationData) {
                                creationData.SuperEntityId = basicsConfigGenWizardContainerDataService.getSelected().Id;
                                creationData.EntityId = basicsConfigGenWizardInstanceDataService.getSelected().Id;
                            },
                            handleCreateSucceeded: function handleCreateSucceeded(newItem) {
                                if (getReadonly()) {
                                    newItem.IsReadOnly = true;
                                }
                            }
                        }
                    }
                }
            };

            function getReadonly() {
                var res = false;
                var genWiz = basicsConfigGenWizardInstanceDataService.getSelected();
                if (genWiz !== undefined && genWiz !== null) {
                    var config = genericWizardUseCaseConfigService.getUseCaseConfiguration(genWiz.WizardConfiGuuid);
                    res = config.readonly;
                }
                return res;
            }

            function processItem(item) {
                var isReadonly = getReadonly();
                platformRuntimeDataService.readonly(item, [{
                    field: 'IsReadOnly',
                    readonly: isReadonly
                }]);
            }

            function canDeleteOrCreate() {
                    return !basicsConfigGenWizardContainerDataService.isContainerTypeChart();
            }

            function canDelete(item){
                return platformVanillaDataProtectorService.isVanillaData(item) ? false : !basicsConfigGenWizardContainerDataService.isContainerTypeChart();
            }

            var serviceContainer = platformDataServiceFactory.createNewComplete(genWizardContainerPropertyDataServiceOption);

            serviceContainer.data.initReadData = function initGenWizardContainerPropertyReadData(readData) {
                readData.SuperEntityId = basicsConfigGenWizardContainerDataService.getSelected().Id;
            };

            return serviceContainer.service;
        }
    ]);
})();