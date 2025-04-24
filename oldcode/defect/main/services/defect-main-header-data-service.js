/**
 * Created by jim on 5/4/2017.
 */
/* global globals,jQuery */
(function (angular) {
    'use strict';

    var moduleName = 'defect.main';
    var module = angular.module(moduleName);

    // jshint -W072
    module.factory('defectMainHeaderDataService',
        ['_', '$injector', '$http', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'procurementCommonHelperService',
            'procurementContextService', 'cloudDesktopSidebarService', 'platformRuntimeDataService',
            'ServiceDataProcessDatesExtension', 'PlatformMessenger', 'defectMainHeaderReadonlyProcessor', 'basicsLookupdataLookupFilterService', 'basicsCommonMandatoryProcessor',
            'cloudDesktopPinningContextService', 'modelViewerViewerRegistryService', 'modelViewerModelSelectionService',
            '$q', 'platformContextService', 'modelViewerDragdropService', 'defectNumberGenerationSettingsService', 'platformDataValidationService',
            '$translate', 'platformObjectHelper', 'modelViewerToggleObjectSelectionHelperService', 'platformObservableService', 'modelViewerModelIdSetService',
            function (_, $injector, $http, platformDataServiceFactory, basicsLookupdataLookupDescriptorService, procurementCommonHelperService, procurementContextService,
                cloudDesktopSidebarService, platformRuntimeDataService, ServiceDataProcessDatesExtension, PlatformMessenger, defectMainHeaderReadonlyProcessor, basicsLookupdataLookupFilterService,
                basicsCommonMandatoryProcessor, cloudDesktopPinningContextService, modelViewerViewerRegistryService,
                modelViewerModelSelectionService, $q, platformContextService, modelViewerDragdropService, defectNumberGenerationSettingsService,
                platformDataValidationService, $translate, platformObjectHelper, modelViewerToggleObjectSelectionHelperService, platformObservableService, modelViewerModelIdSetService) {

                var service = {};
                var container;

                const globalSettings = {
                    overwriteBlacklist: _.assign(platformObservableService.createObservableBoolean({
                        initialValue: true
                    }), {
                        uiHints: {
                            id: 'toggleOverwriteBlacklist',
                            caption$tr$: 'model.annotation.updateBlacklist',
                            iconClass: 'tlb-icons ico-set-model-blacklist'
                        }
                    }),
                    cuttingPlanes: _.assign(platformObservableService.createObservableBoolean({
                        initialValue: true
                    }), {
                        uiHints: {
                            id: 'toggleCutObjects',
                            caption$tr$: 'model.annotation.cuttingPlanes ',
                            iconClass: 'tlb-icons ico-set-cutting-planes'
                        }
                    })
                };

                var sidebarSearchOptions = {
                    moduleName: moduleName,  // required for filter initialization
                    enhancedSearchEnabled: true,
                    pattern: '',
                    pageSize: 100,
                    useCurrentClient: null,
                    includeNonActiveItems: null,
                    showOptions: true,
                    showProjectContext: false, // TODO: rei remove it
                    pinningOptions: {
                        isActive: true,
                        showPinningContext: [{ token: 'project.main', show: true }, { token: 'model.main', show: true }],
                        setContextCallback: setCurrentPinningContext, // may own context service
	                     setModelContextCallback:setModelPinningContext,
	                     disableModelContextBtnCallback:function (selected) {
		                    return selected.MdlModelFk <= 0;
	                    },
                    },
                    withExecutionHints: false,
                    enhancedSearchVersion: '2.0',
                    includeDateSearch: true
                };
                var initialDialogService = $injector.get('defectCreationInitialDialogService');
                var serviceOptions = {
                    flatRootItem: {
                        module: module,
                        serviceName: 'defectMainHeaderDataService',
                        entityNameTranslationID: 'defect.main.defectGridTitle',
                        entityInformation: { module: 'Defect.Main', entity: 'DfmDefect', specialTreatmentService: initialDialogService },
                        httpCRUD: {
                            route: globals.webApiBaseUrl + 'defect/main/header/',
                            usePostForRead: true
                        },
                        dataProcessor: [
                            defectMainHeaderReadonlyProcessor,
                            new ServiceDataProcessDatesExtension(['DateIssued', 'DateRequired', 'DateFinished', 'Userdate1',
                                'Userdate2', 'Userdate3', 'Userdate4', 'Userdate5']), {
                                processItem: processItem
                            }],

                        entityRole: {
                            root: {
                                itemName: 'DfmDefect',
                                moduleName: 'defect.main.moduleDisplayNameDefect',
                                addToLastObject: true,
                                lastObjectModuleName: moduleName,
                                showProjectHeader: {
                                    getProject: function (entity) {
                                        if (!entity || !entity.PrjProjectFk) {
                                            return null;
                                        }
                                        return basicsLookupdataLookupDescriptorService.getLookupItem('PrcProject', entity.PrjProjectFk);
                                    }
                                }
                            }
                        },
                        entitySelection: { supportsMultiSelection: true },
                        presenter: {
                            list: {
                                initCreationData: function initCreationData(param) {
                                    // creationData.ProjectFk = procurementContextService.loginProject;
                                    var pinProjectEntity = _.find(cloudDesktopPinningContextService.getContext(), { token: 'project.main' });
                                    var pinModelEntity = _.find(cloudDesktopPinningContextService.getContext(), { token: 'model.main' });
                                    if (!_.isNil(pinProjectEntity)) {
                                        param.ProjectFk = pinProjectEntity.id;
                                    }
                                    if (!_.isNil(pinModelEntity)) {
                                        param.ModelFk = pinModelEntity.id;
                                    }
                                },
                                incorporateDataRead: function (response, data) {
                                    $injector.invoke(['basicsCostGroupAssignmentService', function (basicsCostGroupAssignmentService) {
                                        basicsCostGroupAssignmentService.process(response, service, {
                                            mainDataName: 'dtos',
                                            attachDataName: 'Defect2CostGroups', // name of MainItem2CostGroup
                                            dataLookupType: 'Defect2CostGroups',// name of MainItem2CostGroup
                                            identityGetter: function identityGetter(entity) {
                                                return {
                                                    Id: entity.MainItemId
                                                };
                                            }
                                        });
                                    }]);
                                    return container.data.handleReadSucceeded(response, data);

                                }
                            }
                        },
                        sidebarWatchList: { active: true },
                        sidebarSearch: { options: sidebarSearchOptions },
                        filterByViewer: true,
                        transaction: {
                            uid: 'defectMainHeaderDataService',
                            title: 'defect.main.defectGridTitle',
                            columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' },
                            { header: 'cloud.common.entityUserDefined', param: { 'p_0': '1' }, field: 'Userdefined1' },
                            { header: 'cloud.common.entityUserDefined', param: { 'p_0': '2' }, field: 'Userdefined2' },
                            { header: 'cloud.common.entityUserDefined', param: { 'p_0': '3' }, field: 'Userdefined3' },
                            { header: 'cloud.common.entityUserDefined', param: { 'p_0': '4' }, field: 'Userdefined4' },
                            { header: 'cloud.common.entityUserDefined', param: { 'p_0': '5' }, field: 'Userdefined5' }],
                            dtoScheme: {
                                typeName: 'DfmDefectDto',
                                moduleSubModule: 'Defect.Main'
                            }
                        }
                    }
                };

                container = platformDataServiceFactory.createNewComplete(serviceOptions);
                service = container.service;

                container.data.doPrepareDelete = function doPrepareDelete(deleteParams) {
                    deleteParams.entity = deleteParams.entities[0];
                    deleteParams.entities = null;
                };

                var basReadData = container.data.doReadData;
                container.data.doReadData = function doReadData() {
                    var fRequest = cloudDesktopSidebarService.filterRequest;
                    var lookupDataService = $injector.get('basicsLookupdataLookupDataService');
                    lookupDataService.getSearchList('CheckListStatus', 'IsDefect=true').then(
                        function (data) {
                            if (data.length > 0) {
                                basicsLookupdataLookupDescriptorService.updateData('CheckListStatus', data);
                            }
                        }
                    );
                    if (fRequest && fRequest.pinnedFilter && fRequest.pinnedFilter.moduleName !== moduleName) {
                        cloudDesktopSidebarService.filterRequest.pinnedFilter = null;
                    }
                    return basReadData.apply(this, arguments).then(function () {
                        // window.console.log(res);
                    });
                };

                var confirmDeleteDialogHelper = $injector.get('prcCommonConfirmDeleteDialogHelperService');
                confirmDeleteDialogHelper.attachConfirmDeleteDialog(container);

                service.canDelete = function () {
                    var selectedItem = service.getSelected();
                    if (selectedItem !== null && selectedItem !== undefined) {
                        if (selectedItem.Version !== 0) {
                            return !selectedItem.IsReadonlyStatus;
                        } else {
                            return true;
                        }
                    } else {
                        return false;
                    }

                };

                var filters = [
                    {
                        key: 'defect-main-reference-defect-filter',
                        serverKey: 'defect-header-filter',
                        serverSide: true,
                        fn: function (item) {
                            var filterObj = {};
                            if (!_.isNil(item.PrjProjectFk)) {
                                filterObj.ProjectFk = item.PrjProjectFk;
                            }
                            filterObj.Id = item.Id || 0;
                            return filterObj;
                        }
                    },
                    {
                        key: 'defect-main-location-filter',
                        serverSide: true,
                        fn: function (item) {
                            return 'ProjectFk=' + item.PrjProjectFk;
                        }
                    },
                    {
                        key: 'defect-main-Procurement-Contract-filter',
                        serverKey: 'prc-con-header-for-pes-filter',
                        serverSide: true,
                        fn: function (item) {
                            var filterObj = {};
                            if (item.PrjProjectFk !== undefined) {
                                filterObj.ProjectFk = item.PrjProjectFk;
                            }
                            return filterObj;
                        }
                    },
                    {
                        key: 'defect-main--sales-contract-filter',
                        serverSide: true,
                        fn: function (item) {
                            var filter = '';
                            var currentItem = item;
                            if (!currentItem) {
                                return '';
                            }

                            if (!_.isNil(currentItem.PrjProjectFk)) {
                                filter += ' ProjectFk=' + currentItem.PrjProjectFk;
                            }
                            if (!_.isNil(currentItem.BasCompanyFk)) {
                                if (filter !== '') {
                                    filter += ' and CompanyFk=' + currentItem.BasCompanyFk;
                                } else {
                                    filter += ' CompanyFk=' + currentItem.BasCompanyFk;
                                }
                            }

                            return filter;
                        }
                    },
                    {
                        key: 'defect-main-activity-filter',
                        serverSide: true,
                        fn: function (item) {
                            return 'ScheduleFk=' + item.PsdScheduleFk;
                        }
                    },
                    {
                        key: 'defect-main-controlling-unit-filter',
                        serverKey: 'basics.masterdata.controllingunit.filterkey',
                        serverSide: true,
                        fn: function (item) {
                            // return 'PrjProjectFk=' + item.PrjProjectFk;
                            if (item.PrjProjectFk) {
                                return { ProjectFk: item.PrjProjectFk };
                            }
                        }
                    },
                    {
                        key: 'defect-main-subsidiary-filter',
                        serverKey: 'businesspartner-main-subsidiary-common-filter',
                        serverSide: true,
                        fn: function (item) {
                            return {
                                BusinessPartnerFk: !_.isNil(item) ? item.BpdBusinesspartnerFk : null
                            };
                        }
                    },
                    {
                        key: 'defect-main-contact-filter',
                        serverSide: true,
                        serverKey: 'prc-con-contact-filter',
                        fn: function (item) {
                            return {
                                BusinessPartnerFk: !_.isNil(item) ? item.BpdBusinesspartnerFk : null,
                                SubsidiaryFk: !_.isNil(item) ? item.BpdSubsidiaryFk : null
                            };
                        }
                    },
                    {
                        key: 'defect-main-pes-header-filter',
                        serverKey: 'defect-main-pes-header-filter',
                        serverSide: true,
                        fn: function (item) {
                            if (item) {
                                return {
                                    CompanyFk: platformContextService.clientId,
                                    ProjectFk: !_.isNil(item) ? (item.PrjProjectFk === 0 ? null : item.PrjProjectFk) : null,
                                    ConHeaderFk: !_.isNil(item) ? (item.ConHeaderFk === 0 ? null : item.ConHeaderFk) : null
                                };
                            }
                        }
                    },
                    {
                        key: 'defect-type-filter',
                        serverSide: true,
                        fn: function (item) {
                            return 'RubricCategoryFk =' + item.RubricCategoryFk; // defect rubricFK is 73
                        }
                    },
                    {
                        key: 'defect-rubric-category-filter',
                        serverKey: 'rubric-category-by-rubric-company-lookup-filter',
                        serverSide: true,
                        fn: function () {
                            return { Rubric: 73 }; // defect rubricFK is 73
                        }
                    },
                    {
                        key: 'hsqe-checklist-header-filter',
                        serverSide: true,
                        fn: function (item) {
                            var statusData = basicsLookupdataLookupDescriptorService.getData('CheckListStatus');
                            var defectStatus = _.filter(statusData, { IsDefect: true });
                            var statusMap = '(';
                            var i = 0;
                            _.map(defectStatus, function (j) {
                                if (i > 0) {
                                    statusMap = statusMap + ' or ';
                                }
                                i = i + 1;
                                statusMap = statusMap + ' HsqChlStatusFk = ' + j.Id;
                            });
                            if (i > 0) {
                                statusMap = statusMap + ') and ';
                            } else {
                                statusMap = '';
                            }
                            statusMap = statusMap + ' BasCompanyFk = ' + platformContextService.clientId;
                            if (!_.isNil(item) && item.PrjProjectFk !== 0 && item.PrjProjectFk !== null) {
                                statusMap = statusMap + ' and PrjProjectFk = ' + item.PrjProjectFk;
                            }
                            return statusMap;
                        }
                    }
                ];

                var createDefectItem = container.service.createItem;
                service.createItem = function createItem() {
                    // var creationData = container.data.doPrepareCreate(container.data);
                    $http.get(globals.webApiBaseUrl + 'defect/main/header/getstatusbydefaultcategory').then(function (respond) {
                        if (respond.data !== 0) {
                            // container.data.doCallHTTPCreate(creationData, container.data, container.data.onCreateSucceeded);
                            createDefectItem();
                        } else {
                            $injector.get('platformModalService').showMsgBox('defect.main.rubricCategoryMissingDefautStatus', 'defect.main.NoDefaultStatus', 'warning');
                        }
                    });
                };

                var onReadSucceeded = container.data.onReadSucceeded;
                container.data.onReadSucceeded = function incorporateDataRead(readData, data) {
                    basicsLookupdataLookupDescriptorService.attachData(readData || {});

                    var dataRead = onReadSucceeded({
                        dtos: readData.dtos,
                        FilterResult: readData.FilterResult,
                        Defect2CostGroups: readData.Defect2CostGroups,
                        CostGroupCats: readData.CostGroupCats
                    },
                        data);

                    service.goToFirst();
                    return dataRead;
                };

                // register filter by hand
                service.registerFilters = function registerFilters() {
                    basicsLookupdataLookupFilterService.registerFilter(filters);

                };

                // unload filters
                service.unregisterFilters = function () {
                    basicsLookupdataLookupFilterService.unregisterFilter(filters);

                };

                service.registerFilters();

                container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
                    typeName: 'DfmDefectDto',
                    moduleSubModule: 'Defect.Main',
                    validationService: 'defectMainHeaderElementValidationService',
                    mustValidateFields: ['Code', 'DfmStatusFk', 'BasDefectTypeFk', 'PrjProjectFk', 'BasDefectPriorityFk',
                        'BasDefectSeverityFk', 'DateIssued', 'DfmRaisedbyFk', 'BpdBusinesspartnerFk', 'BpdSubsidiaryFk',
                        'BpdContactFk']
                });

                service.updateReadOnly = function (entity, fieldToBeSet, value) {
                    if (!_.isNil(value)) {
                        defectMainHeaderReadonlyProcessor.setFieldReadonlyOrNot(entity, fieldToBeSet, false);
                    } else {
                        defectMainHeaderReadonlyProcessor.setFieldReadonlyOrNot(entity, fieldToBeSet, true);
                    }
                };

                service.createDeepCopy = function createDeepCopy() {
                    $http.post(globals.webApiBaseUrl + 'defect/main/header/deepcopy', service.getSelected())
                        .then(function (response) {
                            container.data.handleOnCreateSucceeded(response.data, container.data);
                            service.refresh();
                        },
                            function (/* error */) {
                            });
                };

                var onCreateSucceeded = container.data.onCreateSucceeded;
                container.data.onCreateSucceeded = function (newData, data, creationData) {
                    defectNumberGenerationSettingsService.assertLoaded().then(function () {
                        platformRuntimeDataService.readonly(newData, [{
                            field: 'Code',
                            readonly: defectNumberGenerationSettingsService.hasToGenerateForRubricCategory(newData.RubricCategoryFk)
                        }]);
                        newData.Code = defectNumberGenerationSettingsService.provideNumberDefaultText(newData.RubricCategoryFk, newData.Code);
                        var currentItem = container.service.getSelected();
                        var result = { apply: true, valid: true };
                        if (newData.Code === '') {
                            result.valid = false;
                            result.error = $translate.instant('cloud.common.generatenNumberFailed', { fieldName: 'Code' });
                        }
                        platformDataValidationService.finishValidation(result, currentItem, currentItem.Code, 'Code', service, service);
                        platformRuntimeDataService.applyValidationResult(result, currentItem, 'Code');
                        service.fireItemModified(currentItem);

                    });

                    return onCreateSucceeded.call(container.data, newData, data, creationData).then(function () {
                        if (service.completeEntityCreateed !== undefined) {
                            service.completeEntityCreateed.fire(null, newData);
                        }
                    });
                };

                service.getCode = function (rubricCatalogId) {
                    var defer = $q.defer();
                    $http.get(globals.webApiBaseUrl + 'defect/main/header/getcode?rubricCategoryId=' + rubricCatalogId).then(function (response) {
                        defer.resolve(response.data);
                    });
                    return defer.promise;
                };

                service.getModel = function (modelId) {
                    var defer = $q.defer();
                    $http.get(globals.webApiBaseUrl + 'model/project/model/getbyid?id=' + modelId).then(function (response) {
                        defer.resolve(response.data);
                    });
                    return defer.promise;
                };

                function processItem(item) {
                    var fields = [
                        {
                            field: 'ModelFk',
                            readonly: !!item.MdlModelFk
                        }
                    ];
                    platformRuntimeDataService.readonly(item, fields);
                }

                function refreshAction() {
                    angular.forEach(service.getList(), function (item) {
                        processItem(item);
                    });
                    service.gridRefresh();
                }

                function loadSelectedModel() {
                    refreshAction();
                }

                function setCurrentPinningContext(dataService) {
                    function setCurrentProjectToPinnningContext(dataService) {
                        var currentItem = dataService.getSelected();
                        if (currentItem) {
                            var projectPromise = $q.when(true);
                            var modelPromise = $q.when(true);
                            var pinningContext = [];

                            if (angular.isNumber(currentItem.Id)) {
                                if (angular.isNumber(currentItem.PrjProjectFk)) {
                                    projectPromise = cloudDesktopPinningContextService.getProjectContextItem(currentItem.PrjProjectFk).then(function (pinningItem) {
                                        pinningContext.push(pinningItem);
                                    });
                                }
                                if (angular.isNumber(currentItem.MdlModelFk)) {
                                    modelPromise = service.getModel(currentItem.MdlModelFk).then(function (modelItem) {
                                        if (modelItem) {
                                            pinningContext.push(
                                                new cloudDesktopPinningContextService.PinningItem('model.main', currentItem.MdlModelFk,
                                                    cloudDesktopPinningContextService.concate2StringsWithDelimiter(modelItem.Code, modelItem.Description, ' - '))
                                            );
                                        }
                                    });
                                }
                            }

                            return $q.all([projectPromise, modelPromise]).then(
                                function () {
                                    if (pinningContext.length > 0) {
                                        cloudDesktopPinningContextService.setContext(pinningContext, dataService);
                                    }
                                });
                        }
                    }

                    setCurrentProjectToPinnningContext(dataService);
                }

	            function setModelPinningContext(dataService) {
		            return cloudDesktopPinningContextService.setCurrentModelToPinnningContext(dataService, 'MdlModelFk', 'PrjProjectFk');
	            }

                modelViewerViewerRegistryService.onViewersChanged.register(refreshAction);
                modelViewerViewerRegistryService.registerViewerReadinessChanged(refreshAction);
                modelViewerModelSelectionService.onSelectedModelChanged.register(loadSelectedModel);
                service.unregisterAll = function unregisterAll() {
                    modelViewerViewerRegistryService.unregisterViewerReadinessChanged(refreshAction);
                    modelViewerViewerRegistryService.onViewersChanged.unregister(refreshAction);
                    modelViewerModelSelectionService.onSelectedModelChanged.unregister(loadSelectedModel);
                };

                service.getModuleState = function getModuleState(item) {
                    var readonlyStatus = false;
                    if (item && item.Id) {
                        var parentItem = item || service.getSelected();
                        var status = basicsLookupdataLookupDescriptorService.getData('DfmStatus');
                        if (parentItem && parentItem.Id) {
                            var state = _.find(status, { Id: parentItem.DfmStatusFk });
                            if (state) {
                                readonlyStatus = state.IsReadonly;
                            }
                        }
                    }
                    return readonlyStatus;
                };

                service.getHeaderEditAble = function () {
                    return !service.getModuleState();
                };

                var onSelectionChanged = function onSelectionChanged() {
                    if (service.hasSelection()) {
                        var currentItem = service.getSelected();
                        defectMainHeaderReadonlyProcessor.updateReadOnlyFiled(currentItem, service.getModuleState(currentItem));
                    }
                };

                service.registerSelectionChanged(onSelectionChanged);

                service.navigation = function (/* item, triggerfield */) {

                };

                service.createObjectSet = function (data, hasObjectSet) {
                    var config = null;
                    if (!hasObjectSet) {
                        config = {
                            projectId: modelViewerModelSelectionService.getSelectedModel().info.projectId,
                            objectSetId: null,
                            objectSetCreationParams: {
                                Name: data.Name,
                                TypeFk: data.ObjectSetTypeFk,
                                StatusFk: data.ObjectSetStatusFk,
                                BusinessPartnerFk: data.BusinessPartnerFk,
                                ClerkFk: data.ClerkFk,
                                ReportFk: data.ReportFk,
                                FormFk: data.FormFk,
                                DueDate: data.DueDate,
                                Remark: data.Remark
                            }
                        };
                    } else {
                        config = {
                            projectId: modelViewerModelSelectionService.getSelectedModel().info.projectId,
                            objectSetId: data.ObjectSetId,
                            objectSetCreationParams: null
                        };
                    }
                    modelViewerDragdropService.paste().then(function (createParam) {
                        var objectIdSet = createParam.includedObjectIds;
                        config.objectIds = objectIdSet.useGlobalModelIds().toCompressedString();
                        $http.post(globals.webApiBaseUrl + 'model/main/objectset2object/assignobjects', config)
                            .then(function (response) {
                                var entity = service.getSelected();
                                if (!_.isNil(response.data) && !hasObjectSet) {

                                    var ObjectSet = response.data.ObjectSet;
                                    entity.MdlObjectsetFk = ObjectSet.Id;
                                    entity.ObjectSetKey = ObjectSet.ObjectSetKey;
                                    entity.ObjectSetStatusFk = ObjectSet.ObjectSetStatusFk;
                                    entity.ObjectSetTypeFk = ObjectSet.ObjectSetTypeFk;
                                    service.fireItemModified(entity);
                                    service.markCurrentItemAsModified();
                                }
                            });
                    });

                };

                service.getSelectedProjectId = function () {
                    var prjId = -1;
                    var project = cloudDesktopPinningContextService.getPinningItem('project.main');
                    if (!_.isNil(project)) {
                        prjId = project.id;
                    }
                    var defect = service.getSelected();
                    if (defect && !_.isNull(defect.PrjProjectFk)) {
                        prjId = defect.PrjProjectFk;
                    }
                    return prjId;
                };

	            service.navigateTo = function navigateTo(item, triggerfield) {
		            if (!item || !triggerfield) return;

		            let defectId = platformObjectHelper.getValue(item, triggerfield) || item.DefectFk;

		            if (defectId && triggerfield !== 'Ids') {
			            cloudDesktopSidebarService.filterSearchFromPKeys([defectId]);
		            } else if (triggerfield === 'Ids' && item.FromGoToBtn && _.isString(item.Ids)) {
			            const ids = item.Ids.split(',').map(id => id.trim()).filter(id => id);
			            if (ids.length > 0) {
				            cloudDesktopSidebarService.filterSearchFromPKeys(ids);
			            }
		            }
	            };

                // load lookup items, and cache in front end.
                basicsLookupdataLookupDescriptorService.loadData(['DfmStatus']);

                service.load = function load() {
                    $http.post(globals.webApiBaseUrl + 'basics/customize/modelobjectsetstatus/list').then(function (response) {
                        if (!_.isNil(response) && !_.isNil(response.data)) {
                            basicsLookupdataLookupDescriptorService.updateData('basics.customize.modelobjectsetstatus', response.data);
                        }

                    });

                    /*
                    $http.post(globals.webApiBaseUrl + 'basics/customize/modelobjectsettype/list').then(function (response) {
                        basicsLookupdataLookupDescriptorService.attachData('basics.customize.modelobjectsettype', response);
                    });
                    */
                };

                let modelAnnotationMarkerDisplayService = null;

                const originalOnDeleteDone = container.data.onDeleteDone;
                container.data.onDeleteDone = function (deleteParams) {
                    if (!modelAnnotationMarkerDisplayService) {
                        modelAnnotationMarkerDisplayService = $injector.get('modelAnnotationMarkerDisplayService');
                    }

                    const delItems = Array.isArray(deleteParams.entities) ? deleteParams.entities : [deleteParams.entity];
                    for (let item of delItems) {
                        modelAnnotationMarkerDisplayService.removeAnnotationParent(`!Defect!${item.Id}`);
                    }

                    return originalOnDeleteDone.apply(this, arguments);
                };

                service.retrieveModelObjectIds = function (info) {
                    return $http.get(globals.webApiBaseUrl + 'defect/main/defect2mdlobject/objids', {
                        params: {
                            defectIds: _.join(_.map(info.items, d => d.Id), ':'),
                            modelId: info.modelId
                        }
                    }).then(r => r.data);
                };

                service.registerSelectionChanged(function (e, entity) {
                    const viewer = modelViewerViewerRegistryService.getViewers();
                    if (entity && entity.Camera) {
                        if (viewer && entity.Camera.Id !== 0) {
                            _.forEach(viewer, function (v) {
                                if (!v.isReady()) {
                                    return;
                                }

                                v.showCamPos({
                                    pos: {
                                        x: entity.Camera.PosX,
                                        y: entity.Camera.PosY,
                                        z: entity.Camera.PosZ
                                    },
                                    trg: {
                                        x: entity.Camera.PosX + entity.Camera.DirX,
                                        y: entity.Camera.PosY + entity.Camera.DirY,
                                        z: entity.Camera.PosZ + entity.Camera.DirZ
                                    }
                                });
                                if (globalSettings.overwriteBlacklist.getValue()) {
                                    const bl = v.getFilterEngine().getBlacklist();
                                    bl.excludeAll();

                                    if (entity.Camera.HiddenMeshIds) {
                                        const meshIds = modelViewerModelIdSetService.createFromCompressedStringWithArrays(entity.Camera.HiddenMeshIds).useSubModelIds();
                                        bl.includeMeshIds(meshIds);
                                    }
                                }
                                if (globalSettings.cuttingPlanes.getValue()) {
                                    if (Array.isArray(entity.Camera.ClippingPlanes) && entity.Camera.ClippingPlanes.length > 0) {
                                        v.setCuttingPlane(entity.Camera.ClippingPlanes);
                                        v.setCuttingActive();
                                    } else {
                                        v.setCuttingInactive();
                                    }
                                }
                            });
                        }
                    }
                });

                modelViewerToggleObjectSelectionHelperService.initializeObservable({
                    dataService: service,
                    titleKey: 'defect.main.selectObjects',
                    initialValue: true
                });

                service.load();
                // add the onCostGroupCatalogsLoaded messenger
                service.onCostGroupCatalogsLoaded = new PlatformMessenger();

                return service;
            }]);
})(angular, jQuery);
