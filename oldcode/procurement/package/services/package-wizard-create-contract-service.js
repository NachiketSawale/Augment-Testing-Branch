(function (angular) {
    'use strict';
    var moduleName = 'procurement.package';
    // eslint-disable-next-line no-redeclare
    /* global angular,$ */
    /**
     * Service of wizard 'create contract' dialog controller of module 'procurement.package'.
     */
    angular.module(moduleName).factory('procurementPackageWizardCreateContractService', [
        '$http', '$translate', '$q', 'procurementRequisitionWizardCreateContractService', 'procurementPackageDataService',
        'procurementPackagePackage2HeaderService', 'basicsLookupdataLookupDescriptorService',
        'basicsLookupdataLookupDataService', 'globals', '_', 'platformDialogService', 'platformGridAPI', 'platformModuleNavigationService', '$timeout', 'basicsWorkflowWizardContextService','businessPartnerHelper',
        function ($http, $translate, $q, procurementRequisitionWizardCreateContractService, packageDataService,
                  subPackageDataService, lookupDescriptorService, lookupDataService, globals, _, platformDialogService, platformGridAPI, platformModuleNavigationService, $timeout, basicsWorkflowWizardContextService,helperService) {

            var service = {
                scope: null,
                selectedSubPackage: null,
                baseContractId: -1,
                translatePrefix: null
            };

            service.confirmCreateContractOption = confirmCreateContractOption;
            service.createContract = createContract;
            service.createNewBaseContract = createNewBaseContract;
            service.clearContractorInfo = clearContractorInfo;
            service.execute = execute;
            service.getCreatedContract = getCreatedContract;
            service.getSelectedContracts = getSelectedContracts;
            service.naviGate = naviGate;
            service.onOk = onOk;
            service.setDataForCreateContract = setDataForCreateContract;
            service.showMsBox = showMsBox;
            service.showInfo = showInfo;
            service.showCreateContractDialog = showCreateContractDialog;
            service.setDefaultSupplier = setDefaultSupplier;
            service.setDefaultChangeProject = setDefaultChangeProject;
            service.setDefaultContact = setDefaultContact;
            service.getModule = () => ({name: moduleName});

            function onOk(gridId, resultPromise) {
                // 3 cases:
                // 1 overWrite, 2 create(change order or new base contract).
                service.scope.initOptions.dialogLoading = true;
                if (service.scope.initOptions.radioType === service.scope.initOptions.changeRadioVal) {
                    // $scope.initOptions.dataModels.projectChange;
                    var param = {
                        mainItemId: service.selectedSubPackage.Id,
                        ProjectFk: service.scope.initOptions.dataModels.projectChange ? service.scope.initOptions.dataModels.projectChange.Id : null,
                        ConHeaders: getSelectedContracts(gridId),
                        DoesCopyHeaderTextFromPackage: service.scope.initOptions.doesCopyHeaderTextFromPackage
                    };

                    return $http.post(globals.webApiBaseUrl + 'procurement/contract/wizard/createchangeordercontracts', param).then(function (response) {
                        // showNavigationPage(false, response.data);
                        afterCreateSuccessfully(response, true, resultPromise);
                    }, function () {
                        service.scope.initOptions.dialogLoading = false;

                        return showInfo(true, $translate.instant(service.translatePrefix + 'fail'), 'ico-error'); // todo
                    });

                } else if (service.scope.initOptions.radioType === service.scope.initOptions.overWriteRadioVal) {
                    $http.post(globals.webApiBaseUrl + 'procurement/package/wizard/overwritecontract',
                        {
                            ContractId: service.baseContractId,
                            DoesCopyHeaderTextFromPackage: service.scope.initOptions.doesCopyHeaderTextFromPackage
                        }).then(function (response) {
                        if (response && response.data) {
                            if(resultPromise) {
                                basicsWorkflowWizardContextService.setResult(response.data);
                                resultPromise.resolve();
                            }
                            showNavigationPage(false, service.baseContractId);
                        } else {
                            showInfo(true, $translate.instant(service.translatePrefix + 'fail'), 'ico-error'); // todo
                        }
                    }, function () {
                        service.scope.$close(false);
                    });

                } else if (service.scope.initOptions.radioType === service.scope.initOptions.newBaseRadioVal) {
                    createNewBaseContract(resultPromise);
                }
            }

            function showNavigationPage(isBaseContract, contractId) {

                var msg = null;
                if (isBaseContract) {
                    msg = $translate.instant(service.translatePrefix + 'createContractSuccessfully'); // todo
                } else {
                    msg = $translate.instant(service.translatePrefix + 'overwriteSuccessfully');// todo
                }
                getCreatedContract(contractId).then(function (response) {

                    if (response && response.data) {
                        let code = $translate.instant(service.translatePrefix + 'newCode', {newCode: response.data.Code});
                        $($('#contractWizardDIV').parent()).css('margin', '0 auto').css('width', '600px');
                        showInfo(true, msg + '<br />' + code, 'ico-info', true);
                    }

                    service.scope.initOptions.dialogLoading = false;
                    service.scope.initOptions.isBtnNavigateDisabled = false;
                });

                service.scope.initOptions.step = 'step3';
                service.scope.initOptions.dataModels.contractEntity.Id = contractId;
            }

            function createContract(subPackageFromScope, resultPromiseFromScope) {
                var parameter = {
                    SubPackageId: subPackageFromScope ? subPackageFromScope.Id : service.selectedSubPackage.Id,
                    BpFK: service.scope.initOptions.dataModels.businessPartner.Id,
                    SubsidiaryFk: service.scope.initOptions.dataModels.subsidiary.Id || null,
                    SupplierFk: service.scope.initOptions.dataModels.supplier.Id || null,
                    ContactFk: service.scope.initOptions.dataModels.contact.Id || null
                };
                // Create only one contract for the selected subPackage.
                $http.post(globals.webApiBaseUrl + 'procurement/package/wizard/createcontract', parameter).then(function (response) {
                    service.scope.initOptions.dialogLoading = false;
                    if (response.data && angular.isArray(response.data) && response.data.length > 0) {
                        // it has updated the package status, so need to refresh
                        packageDataService.refresh();
                        if (resultPromiseFromScope) {
                            basicsWorkflowWizardContextService.setResult(response.data);
                            resultPromiseFromScope.resolve();
                        }
                        showNavigationPage(true, response.data[0]);
                    } else {
                        showInfo(true, $translate.instant(service.translatePrefix + 'fail'), 'ico-error');// todo
                    }
                }, function () {
                    service.scope.initOptions.dialogLoading = false;
                    service.scope.initOptions.onClose();
                });
            }

            function createNewBaseContract(resultPromise) {
                var parameter = {
                    mainItemId: service.selectedSubPackage.Id,
                    BusinessPartnerFk: service.scope.initOptions.dataModels.businessPartner.Id, // $scope.initOptions.dataModels.specificBusinessPartner,
                    SubsidiaryFk: service.scope.initOptions.dataModels.subsidiary.Id || null,
                    SupplierFk: service.scope.initOptions.dataModels.supplier.Id || null,
                    DoesCopyHeaderTextFromPackage: service.scope.initOptions.doesCopyHeaderTextFromPackage,
                    ContactFk: service.scope.initOptions.dataModels.contact.Id || null
                };
                $http.post(globals.webApiBaseUrl + 'procurement/contract/wizard/createnewbasecontracts', parameter).then(function (response) {
                    afterCreateSuccessfully(response,false, resultPromise);
                }, function () {
                    service.scope.$close(false);
                });
            }

            function afterCreateSuccessfully(response, isChangeOrderContract,resultPromise) {

                var bodyText = null;

                if (isChangeOrderContract) {
                    bodyText = $translate.instant(service.translatePrefix + 'createContractSuccessfully'); // todo
                } else {
                    bodyText = $translate.instant(service.translatePrefix + 'createNewBaseContractSuccessfully');// todo
                }
                if (response && response.data && response.data.length > 0) {

                    // let code = '[ ';
                    // response.data.forEach(function(item){
                    // code += '(' + item.Code + ',' + item.Description + (item.ConStatus ?  ',' + item.ConStatus.DescriptionInfo.Translated : '') + ')';
                    // });
                    // code += ' ]';
                    let codeArr = [];
                    response.data.forEach(function (item) {
                        codeArr.push(item.Code);
                    });
                    // may create more then one changeOrdercontract.
                    var ids = response.data.map(function (item) {
                        return item.Id;
                    });
                    if(resultPromise) {
                        basicsWorkflowWizardContextService.setResult(ids);
                        resultPromise.resolve();
                    }
                    service.scope.initOptions.onNavigate = function () {
                        // send contract`s id.
                        naviGate(ids, null);
                    };
                    service.scope.initOptions.dialogLoading = false;
                    service.scope.initOptions.step = 'step3';
                    // $scope.initOptions.dataModels.contractEntity = ids;
                    service.scope.initOptions.isBtnNavigateDisabled = false;
                    let code = $translate.instant(service.translatePrefix + 'newCode', {newCode: codeArr.join(', ')});
                    $($('#contractWizardDIV').parent()).css('margin', '0 auto').css('width', '600px');
                    return showInfo(true, bodyText + '<br />' + code, 'ico-info', true);
                } else {
                    bodyText = service.translatePrefix + 'fail';

                    return showInfo(true, bodyText, 'ico-info');
                }
            }

            function naviGate(entity, property) {
                service.scope.$close(false);
                //
                platformModuleNavigationService.navigate({
                    moduleName: 'procurement.contract',
                    registerService: 'procurementContractHeaderDataService'
                }, entity, property);
            }

            function getSelectedContracts(gridId) {

                var contractsData = platformGridAPI.items.data(gridId) || [];
                var selectedBaseContracts = [];

                contractsData.forEach(function (item) {
                    if (item.Selected) {
                        selectedBaseContracts.push(item);
                    }
                });

                return selectedBaseContracts;
            }

            function execute(params) {
                packageDataService.isPackageWizardCreateContract = true;

                var modalOptions = {
                    headerText$tr$: 'cloud.common.informationDialogHeader',
                    bodyText$tr$: 'procurement.package.wizard.contract.selectOnoPackage',
                    showOkButton: true,
                    iconClass: 'ico-info'
                };

                var selectedPackage = params.isTriggeredByWorkflow ? basicsWorkflowWizardContextService.getContext().entity : packageDataService.getSelected();

                // no package selected
                if (!selectedPackage) {
                    return platformDialogService.showDialog(modalOptions);
                }
                $http.get(globals.webApiBaseUrl + 'procurement/package/prcpackage2header/getSubPackage', {params: {prcPackage: selectedPackage.Id}}).then(function (result) {
                    // no subPackage selected
                    var subPackage = params.isTriggeredByWorkflow ? result.data[0] : subPackageDataService.getSelected();
                    if (!subPackage) {
                        modalOptions.bodyText$tr$ = 'procurement.package.wizard.contract.noSubPackage';
                        return platformDialogService.showDialog(modalOptions).then(function () {
                            params.resultPromise.resolve({cancel:false});
						});
                    }
                    service.confirmCreateContractOption(subPackage.Id).then(function (response) {
                        var result = response.data;

                        // in this case, it has valid base contracts but no changes. so do nothing but show a inform dialog.
                        if (result && (result.changeItems && result.changeItems.length <= 0)) {
                            modalOptions.bodyText$tr$ = 'procurement.package.wizard.contract.noChangeFound';
							return platformDialogService.showDialog(modalOptions).then(function () {
								params.resultPromise.resolve({cancel:false});
							});
                        }
                        // there would be 2 cases:
                        // 1: result is null, it means no valid base contracts.2: it has valid contracts and has changes: then there would be 3 cases:
                        // (1): overwrite only one base contract,(2): create change order contracts,(3): create new base contract.
                        let request = {
                            MainItemIds: [subPackage.PrcHeaderFk],
                            ModuleName: 'procurement.package'
                        };
                        $http.post(globals.webApiBaseUrl + 'procurement/common/wizard/hascontracteddata', request)
                            .then(function (response) {
                                let hasContractItem = response ? response.data : false;
                                return platformDialogService.showDialog({
                                    headerText$tr$: 'procurement.package.wizard.contract.header',
                                    templateUrl: globals.appBaseUrl + 'procurement.package/partials/create-contract-wizard-view.html',
                                    minWidth: '850px',
                                    width: '900px',
                                    resizeable: true,
                                    data: result,
                                    hasContractItem: hasContractItem,
                                    package: params.isTriggeredByWorkflow ? selectedPackage : null,
                                    subPackage: params.isTriggeredByWorkflow ? subPackage : null,
                                    resultPromise: params.isTriggeredByWorkflow ? params.resultPromise : null
                                });
                            });
                    });
                });
            }

            function showCreateContractDialog(subPackageFromScope, resultPromiseFromScope) {

                service.scope.initOptions.dialogLoading = true;
                // create a base contract immediately
                createContract(subPackageFromScope, resultPromiseFromScope);
            }

            function setDataForCreateContract(subPackageId) {

                showInfo(false, '', 0);
                clearContractorInfo();

                if (service.scope.initOptions.step === 'step1' && subPackageId) {
                    $q.all([hasData(subPackageId), getData(subPackageId), getContractBPData(subPackageId)]).then(function (responses) {
                        // if subpackage has exsited contract, using contract's BP.
                        var setContractBP = function () {
                            if (responses[2] && responses[2].data && responses[2].data.businesspartner) {
                                service.scope.initOptions.dataModels.businessPartner = angular.copy(responses[2].data.businesspartner) || {};
                                service.scope.initOptions.dataModels.subsidiary = angular.copy(responses[2].data.subsidiary) || {};
                                service.scope.initOptions.dataModels.supplier = angular.copy(responses[2].data.supplier) || {};

                                service.scope.initOptions.isBtnLookupContractorDisabled = true;
                                service.scope.initOptions.isBtnNextDisabled = false;

                                $timeout(function () {
                                    getContactByBP(service.scope.initOptions.dataModels.businessPartner,service.scope.initOptions.dataModels.subsidiary);
                                });
                            }
                        };

                        var setPackageBP = function () {
                            var packageItem = packageDataService.getSelected();
                            if (packageItem && packageItem.BusinessPartnerFk) {
                                var packageBP = _.find(lookupDescriptorService.getData('BusinessPartner'), {Id: packageItem.BusinessPartnerFk});
                                var packageSubsidiary = _.find(lookupDescriptorService.getData('Subsidiary'), {Id: packageItem.SubsidiaryFk});
                                var packageSupplier = _.find(lookupDescriptorService.getData('Supplier'), {Id: packageItem.SupplierFk});
                                if (!_.isNull(packageBP) && !_.isUndefined(packageBP)) {
                                    service.scope.initOptions.dataModels.businessPartner = angular.copy(packageBP);
                                    service.scope.initOptions.isBtnNextDisabled = false;
                                }
                                service.scope.initOptions.dataModels.subsidiary = angular.copy(packageSubsidiary) || {};
                                service.scope.initOptions.dataModels.supplier = angular.copy(packageSupplier) || {};

                                $timeout(function () {
	                                getContactByBP(service.scope.initOptions.dataModels.businessPartner,service.scope.initOptions.dataModels.subsidiary);
                                });
                            }

                        };

                        var skipLookupContractor = function () {
                            // skip show bp lookup dialog if bp already assigned
                            // if (service.scope.initOptions.dataModels.businessPartner.Id && service.scope.initOptions.dataModels.businessPartner.Id > 0) {
                            // defect#116444 please allow user interaction even if the BP is filled in the dialog.
                            // service.scope.initOptions.onNext();
                            // }
                        };

                        // show warning when sub-package has no prcItems and Boqs
                        if (responses[0] && !responses[0].data) {
                            showInfo(true, $translate.instant('procurement.package.wizard.noDataInSubPackage'), 'ico-warning');
                        }

                        // set data from PrcItem-> material item -> material catalog -> catalog bp
                        if (responses[1] && responses[1].data) {
                            var data = responses[1].data || {};

                            var setDefaultBP = function () {
                                if (data.businessPartners.length === 1) {
                                    service.scope.initOptions.dataModels.businessPartner = data.businessPartners[0] || {};
                                    service.scope.initOptions.dataModels.subsidiary = angular.copy(data.subsidiaries[0]) || {};
                                    var subsidiaryId = service.scope.initOptions.dataModels.subsidiary.Id;
                                    if (_.isNil(subsidiaryId)) {
                                        subsidiaryId = -1;
                                    }
                                    if (_.isEmpty(data.suppliers)) {
                                        setDefaultSupplier(data.businessPartners[0].Id, -1, subsidiaryId);
                                    } else {
                                        lookupDescriptorService.attachData({'supplier': data.suppliers});
                                        service.scope.initOptions.dataModels.supplier = angular.copy(data.suppliers[0]) || {};
                                    }

                                    service.scope.initOptions.isBtnNextDisabled = false;

                                    $timeout(function () {
	                                    getContactByBP(service.scope.initOptions.dataModels.businessPartner,service.scope.initOptions.dataModels.subsidiary);
                                    });

                                } else if (data.businessPartners.length === 0) {
                                    setPackageBP();
                                } else {
                                    service.scope.initOptions.dataModels.businessPartner.BusinessPartnerName1 = $translate.instant('procurement.package.wizard.contract.validateBP');
                                    service.scope.initOptions.isBtnNextDisabled = true;
                                }
                            };

                            var isFramworkAgreement = true;
                            if (data.prcItems.length <= 0) {
                                isFramworkAgreement = false;
                            } else {
                                _.each(data.prcItems, function (item) {
                                    if (!item.MdcMaterialFk) {
                                        isFramworkAgreement = false;
                                    }
                                });
                            }

                            // (1) If not all the PRC_ITEM belong to a material item or If there is no PRC_ITEM,
                            //    Then use package's bp or lookup a contractor (bp) to create contract.
                            if (!isFramworkAgreement) {
                                setPackageBP();
                                setContractBP();
                                skipLookupContractor();
                                return;
                            }

                            // (2) If ALL the PRC_ITEM are material items and from different material catalogs
                            //  (2.1) If the catalogs have different BP or none BP
                            //        Then show “***Multi or None Business Partners***” in the BP field, and the 'Next' button become grey out.
                            //        Unless the user has looked up and specify one BP.
                            //  (2.2) If the catalogs have only one BP, use it as default contractor.
                            if (data.materialCatalogs.length > 1) {
                                setDefaultBP();
                            }
                                //  (3) If ALL the PRC_ITEM are are material items and from the same material catalog,
                                //  If this catalog has a BP assigned, use it as default contractor, else show “***Multi or None Business Partners***”
                                //  (3) If ALL the PRC_ITEM are are material items and from the same material catalog
                            //  (3.1) If this catalog has not BP assigned, show “***Multi or None Business Partners***”!//  (3.2) If this catalog has BP assigned, use it as default contractor,
                            else if (data.materialCatalogs.length === 1) {
                                setDefaultBP();

                                if (data.businessPartners.length === 1) {
                                    // If the material catalog type is 'framework agreements' (ID=3), BP fields and “look up contractor” button become grey out.
                                    if (data.materialCatalogs[0].MaterialCatalogTypeFk === 3) {
                                        service.scope.initOptions.isBtnLookupContractorDisabled = true;
                                    }
                                }
                            }
                        }

                        setPackageBP();
                        setContractBP();
                        skipLookupContractor();
                    });
                }
            }

            //
            // /**
            //  * @ngdoc function
            //  * @param {bool} isShow (true: show, false: hidden)
            //  * @param {string} message
            //  * @param {string} icon
            //  */
            function showInfo(isShow, message, icon, showCon = false) {
                // var errorType = {info: 1, warning: 2, error: 3};
                var type = 3;
                switch (icon) {
                    case 'ico-info':
                        type = 1;
                        break;
                    case 'ico-warning':
                        type = 2;
                        break;
                    case 'ico-error':
                        type = 3;
                        break;
                    default:
                        type = 3;
                        break;
                }
                service.scope.error = {
                    show: isShow,
                    messageCol: 1,
                    message: message,
                    type: type,
                    showCon: showCon
                };
            }

            function clearContractorInfo() {
                service.scope.initOptions.dataModels.businessPartner = {};
                service.scope.initOptions.dataModels.subsidiary = {};
                service.scope.initOptions.dataModels.supplier = {};
                service.scope.initOptions.isBtnNextDisabled = true;
            }

            function showMsBox(bodyText) {
                var modalOptions = {
                    headerText$tr$: 'cloud.common.informationDialogHeader',
                    bodyText$tr$: 'procurement.package.wizard.contract.selectOnoPackage',
                    showOkButton: true,
                    iconClass: 'ico-info'
                };
                modalOptions.bodyText$tr$ = bodyText;

                return platformDialogService.showDialog(modalOptions);
            }

            // todo
            function setDefaultSupplier(bpId, supplierId, subsidiaryId) {
                // load bp's suppliers and set the first suplier as default when SupplierId not set.
                var currentSupplier = _.find(lookupDescriptorService.getData('supplier'), {Id: supplierId});
                if (currentSupplier) {
                    service.scope.initOptions.dataModels.supplier = angular.copy(currentSupplier);
                } else {
                    var searchRequest = {
                        FilterKey: 'businesspartner-main-supplier-common-filter',
                        SearchFields: ['Code', 'Description', 'BusinessPartnerName1'],
                        SearchText: '',
                        AdditionalParameters: {
                            BusinessPartnerFk: bpId,
                            SubsidiaryFk: subsidiaryId
                        }
                    };
                    lookupDataService.getSearchList('supplier', searchRequest).then(function (dataList) {
                        var data = dataList.items ? dataList.items : [];
                        if (data && data.length > 0) {
                            lookupDescriptorService.attachData({'supplier': data});
                            service.scope.initOptions.dataModels.supplier = angular.copy(data[0]);
                        }
                    });
                }
            }

            function setDefaultContact(bpId, subsidiaryId) {
                if (bpId) {
                    var filterDatas = [];
                    var pbContactParam = {Value: bpId, filter: ''};
                    $http.post(globals.webApiBaseUrl + 'businesspartner/contact/listbybusinesspartnerid', pbContactParam).then(function (response) {
                        if (response.data) {
                            if (!_.isNil(subsidiaryId)) {
                                filterDatas = _.filter(response.data.Main, function (item) {
                                    return item.SubsidiaryFk === subsidiaryId || _.isNil(item.SubsidiaryFk);
                                });
                            } else {
                                filterDatas = response.data.Main;
                            }
                            if (filterDatas.length > 0) {
                                service.scope.initOptions.dataModels.contact = angular.copy(filterDatas[0]);
                            } else {
                                service.scope.initOptions.dataModels.contact = null;
                            }
                        } else {
                            service.scope.initOptions.dataModels.contact = null;
                        }
                    });
                }
            }

	        function getContactByBP(bp, subsidiary) {
		        if (!bp || !bp.Id) {
			        return;
		        }

		        const bpId = bp.Id;
		        const branchFk = subsidiary?.Id;

		        const filterContacts = (contacts) => {
			        return branchFk
				        ? contacts.filter(item => item.SubsidiaryFk === branchFk || _.isNil(item.SubsidiaryFk))
				        : contacts;
		        };

		        const contacts = _.filter(lookupDescriptorService.getData('contact'), {BusinessPartnerFk: bpId});
		        if (contacts && contacts.length > 0) {
			        service.scope.initOptions.dataModels.contact = helperService.getDefaultContactByByConditionKey(filterContacts(contacts), branchFk, 'IsProcurement');
		        } else {
			        const searchRequest = {
				        AdditionalParameters: {BusinessPartnerFk: bpId},
				        FilterKey: 'prc-con-contact-filter',
				        PageState: {PageNumber: 0, PageSize: 100},
				        SearchText: '',
				        TreeState: {StartId: null, Depth: null},
				        RequirePaging: true
			        };

			        lookupDataService.getSearchList('contact', searchRequest).then(function (res) {
				        const contacts = res.items || [];
				        if (contacts && contacts.length > 0) {
					        lookupDescriptorService.attachData({'contact': contacts});
					        service.scope.initOptions.dataModels.contact = helperService.getDefaultContactByByConditionKey(filterContacts(contacts), branchFk, 'IsProcurement');
				        }
			        });
		        }
	        }

            function setDefaultChangeProject(subPackage) {
                // packageWizardCreateContractService
                // httpRead: { route: globals.webApiBaseUrl + 'change/main/', endPointRead: 'byProject' },
                // filterParam: 'projectId'
                var projectFk = subPackage ? subPackage.ProjectFk : service.selectedSubPackage.ProjectFk;
                var changes = _.filter(lookupDescriptorService.getData('ChangeProject'), {ProjectFk: projectFk});
                if (changes && changes.length > 0) {
                    if (changes.length === 1) {
                        service.scope.initOptions.dataModels.projectChange = angular.copy(changes[0]);
                    }
                } else {
                    var pageState = {
                        PageNumber: 0,
                        PageSize: 1000
                    };
                    var prjChangeRequest = {
                        AdditionalParameters: {
                            ProjectFk: projectFk,
                            IsProcurement: true
                        },
                        FilterKey: 'project-change-lookup-for-procurement-common-filter',
                        PageState: pageState
                    };
                    lookupDataService.getSearchList('ProjectChange', prjChangeRequest).then(function (response) {
                        // $http.get(globals.webApiBaseUrl + 'change/main/byProject?projectId='+projectFk).then(function (response) {
                        var data = response && response.items;
                        if (data && data.length > 0) {
                            lookupDescriptorService.attachData({'ChangeProject': data});
                            if (data.length === 1) {
                                service.scope.initOptions.dataModels.projectChange = angular.copy(data[0]);
                            }
                        }
                    });
                }
            }

            function confirmCreateContractOption(subPackageId) {
                return $http.get(globals.webApiBaseUrl + 'procurement/contract/wizard/confirmcreatecontractoption?subPackageId=' + subPackageId);
            }

            function getCreatedContract(contractId) {
                return $http.get(globals.webApiBaseUrl + 'procurement/contract/header/getitembyId?id=' + contractId);
            }

            function hasData(subPackageId) {
                return $http.post(globals.webApiBaseUrl + 'procurement/package/wizard/hasdata', {subPackageId: subPackageId});
            }

            function getData(subPackageId) {
                return $http.post(globals.webApiBaseUrl + 'procurement/package/wizard/getdataforcreatecontract', {subPackageId: subPackageId});
            }

            function getContractBPData(subPackageId) {
                return $http.post(globals.webApiBaseUrl + 'procurement/contract/header/getcontractbpdata', {Value: subPackageId});
            }

            return service;
        }
    ]);

})(angular);