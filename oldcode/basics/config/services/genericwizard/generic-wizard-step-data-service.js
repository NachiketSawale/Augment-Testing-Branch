/**
 * Created by baf on 03.05.2016
 */
(function () {
    'use strict';
    var basicsConfigModule = angular.module('basics.config');

    /**
     * @ngdoc service
     * @name basicsConfigGenWizardStepDataService
     * @function
     *
     * @description
     * basicsConfigGenWizardStepDataService is a data service for managing steps of generic wizard instances.
     */
    basicsConfigModule.factory('basicsConfigGenWizardStepDataService', ['basicsConfigGenWizardInstanceDataService', 'platformDataServiceFactory',
        'platformDataServiceProcessDatesBySchemeExtension', 'basicsConfigGenericWizardDataProcessorFactoryService', 'basicsConfigWizardXGroupService',
        'platformDataServiceInitialValidationDataProcessorFactory', 'genericWizardUseCaseConfigService', 'platformRuntimeDataService', 'platformVanillaDataProtectorService',
        function (basicsConfigGenWizardInstanceDataService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
                  basicsConfigGenericWizardDataProcessorFactoryService, basicsConfigWizardXGroupService, initialValidationFactory,
                  genericWizardUseCaseConfigService, platformRuntimeDataService, platformVanillaDataProtectorService) {

            var genWizardStepServiceOption = {
                flatNodeItem: {
                    module: basicsConfigModule,
                    serviceName: 'basicsConfigGenWizardStepDataService',
                    entityNameTranslationID: 'basics.config.entityWizardStep',
                    httpCreate: {route: globals.webApiBaseUrl + 'basics/config/genwizard/step/'},
                    httpRead: {usePostForRead: true, route: globals.webApiBaseUrl + 'basics/config/genwizard/step/'},
                    dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
                        typeName: 'GenericWizardStepDto',
                        moduleSubModule: 'Basics.Config'
                    }),
                        basicsConfigGenericWizardDataProcessorFactoryService.getInstanceFkDataProcessor('Instance', basicsConfigWizardXGroupService),
                        initialValidationFactory.createProcessor({
                            typeName: 'GenericWizardStepDto',
                            moduleSubModule: 'Basics.Config'
                        }, 'basicsConfigGenWizardValidationService'), {processItem: processItem}],
                    actions: {delete: true, canDeleteCallBackFunc: canDelete, create: 'flat'},
                    modification: {multi: true},
                    entityRole: {node: {itemName: 'Steps', parentService: basicsConfigGenWizardInstanceDataService}},
                    translation: {
                        uid: 'basicsConfigGenWizardStepDataService',
                        title: 'basics.config.genWizardStepListContainerTitle',
                        columns: [
                            {header: 'basics.config.entityTitle', field: 'TitleInfo'},
                            {header: 'cloud.common.entityComment', field: 'CommentInfo'}
                        ],
                        dtoScheme: {typeName: 'GenericWizardStepDto', moduleSubModule: 'Basics.Config'}
                    },
                    presenter: {
                        list: {
                            initCreationData: function initCreationData(creationData) {
                                creationData.SuperEntityId = basicsConfigGenWizardInstanceDataService.getSelected().Id;
                            },
                            incorporateDataRead: function incorporateDataRead(readItems, data) {
                                if (readItems.length > 0) {
                                    readItems = _.sortBy(readItems, ['Sorting']);
                                }
                                return data.handleReadSucceeded(readItems, data);
                            },
                            handleCreateSucceeded: function handleCreateSucceeded(newItem) {
                                if (getReadonly()) {
                                    newItem.AutoSave = false;
                                }
                            }
                        }
                    }
                }
            };

            var serviceContainer = platformDataServiceFactory.createNewComplete(genWizardStepServiceOption);

            serviceContainer.data.initReadData = function initGenWizardStepReadData(readData) {
                readData.SuperEntityId = basicsConfigGenWizardInstanceDataService.getSelected().Id;
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

            function canDelete(item) {
                return platformVanillaDataProtectorService.isVanillaData(item) ? false : !getReadonly() || item.Version === 0;
            }

            function processItem(item) {
                var isReadonly = getReadonly();
                platformRuntimeDataService.readonly(item, [{
                    field: 'GenericWizardStepTypeFk',
                    readonly: isReadonly && item.Version > 0
                }, {
                    field: 'AutoSave',
                    readonly: isReadonly
                }, {
                    field: 'GenericWizardStepFk',
                    readonly: isReadonly
                }]);
            }

            return serviceContainer.service;
        }
    ]);
})();