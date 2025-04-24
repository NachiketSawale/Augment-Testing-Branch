(function () {
    'use strict';
    let moduleName = 'controlling.generalcontractor';
    angular.module(moduleName).factory('controllingGeneralContractorCreateCostControlFrmEstWizardDialogService', ['globals', 'PlatformMessenger', '$http', '$q','_', '$injector', '$translate', 'platformModalService', 'platformDataValidationService', 'platformRuntimeDataService', 'platformContextService', 'platformTranslateService', 'platformModalFormConfigService', 'cloudDesktopPinningContextService', 'basicsLookupdataLookupFilterService',
        function (globals, PlatformMessenger, $http,$q, _, $injector, $translate, platformModalService, platformDataValidationService, platformRuntimeDataService, platformContextService, platformTranslateService, platformModalFormConfigService, cloudDesktopPinningContextService, basicsLookupdataLookupFilterService) {

            let service = {};
            let initDataItem = {};
            let projectContext = {};

            service.resetToDefault = function resetToDefault() {
                projectContext = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
                initDataItem = {
                    Comment: null,
                    ProjectFk: null,
                    EstHeaderHelper: null,
                };
            };
            service.resetToDefault();

            let estHeaderList =[];
            service.getList = function getList(){
                return estHeaderList;
            };

            service.getEstHeaderFromServer = function getEstHeaderFromServer() {
                let estimateDataService =  $injector.get('controllingGeneralContractorEstimateDataService');
                let selectedEstimate = estimateDataService.getSelectedEntities();

                let redHintsContracts = estimateDataService.getList();
                redHintsContracts = _.filter(redHintsContracts,{'Flag':'2'});
                selectedEstimate = selectedEstimate.concat(redHintsContracts);

                projectContext = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
                let postData ={
                    ProjectId: projectContext ? projectContext.id :-1,
                };
                let deferred = $q.defer();

                $http.post(globals.webApiBaseUrl + 'controlling/ceneralContractor/GetGccEstimateCompletes', postData)
                    .then(function (response) {
                        let estHeaders =[];
                        if(response && response.data){
                            estHeaders = _.filter(response.data,function (d){
                                return d.Flag !=='4' && d.Flag !=='3';
                            });
                        }

                        if(selectedEstimate && selectedEstimate.length){
                            _.forEach(estHeaders,function (d) {
                                let con = _.find(selectedEstimate,{'Id':d.Id});
                                if(con){
                                    d.IsMarked = true;
                                }

                            });
                        }
                        estHeaderList  = estHeaders;
                        deferred.resolve(estHeaders);
                        return deferred.promise;
                    });
                return deferred.promise;
            };

            service.showDialog = function showDialog(onCreateFn) {
                projectContext = _.find (cloudDesktopPinningContextService.getContext (), {token: 'project.main'});
                service.resetToDefault();

                let searchData = {
                    ProjectId: projectContext ? projectContext.id : -1,
                    FixRateCheckType: 1
                };

                $http.post(globals.webApiBaseUrl + 'Controlling/GeneralContractor/GCAdditionalExpensesController/getProjectCostCodesIsEditable', searchData).then(function (response) {
                    if (response && response.data) {
                        if(response.data.noGCCOrderSetting){
                            platformModalService.showMsgBox('controlling.generalcontractor.noGCCOrderSetting', 'cloud.common.informationDialogHeader', 'info');
                        }else if (response.data.fixedRate) {
                            platformModalService.showMsgBox('controlling.generalcontractor.IsFixRate', 'cloud.common.informationDialogHeader', 'info');
                        }else {

                            let config = {
                                title: $translate.instant ('controlling.generalcontractor.CreateUpdateCostControlStructureWizardFrmEst'),
                                dataItem: initDataItem,
                                handleOK: function handleOK(result) {
                                    let creationData = {
                                        ProjectFk: projectContext ? projectContext.id : -1,
                                        Comment: result.data.Comment,
                                        EstHeaderHelper: result.data.EstHeaderHelper
                                    };

                                    if (_.isFunction (onCreateFn)) {
                                        onCreateFn (creationData);
                                    }
                                }
                            };

                            let headerText = $translate.instant ('controlling.generalcontractor.CreateUpdateCostControlStructureWizardFrmEst');

                            platformModalService.showDialog ({
                                headerText: $translate.instant (headerText),
                                dataItem: initDataItem,
                                templateUrl: globals.appBaseUrl + 'controlling.generalcontractor/templates/create-update-cost-control-dialog-frm-est-template.html',
                                backdrop: false,
                                resizeable: true,
                                width: '900px',
                                uuid: 'DF11B3A4AA3A4199ACC1B1A299D1B9FA'

                            }).then (function (result) {
                                    if (result.ok) {
                                        config.handleOK (result);
                                    } else {
                                        if (config.handleCancel) {
                                            config.handleCancel (result);
                                        }
                                    }
                                }
                            );

                        }
                    }
                });
            };

            return service;

        }]);
})();
