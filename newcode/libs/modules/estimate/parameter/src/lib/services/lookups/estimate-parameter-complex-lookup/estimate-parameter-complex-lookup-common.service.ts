/*
 * Copyright(c) RIB Software GmbH
*/

import {GridApiService, PopupService } from '@libs/ui/common';
import {inject, Injectable, Injector} from '@angular/core';
import {isFunction, find, filter, groupBy, map, cloneDeep,each,isArray,uniqBy} from 'lodash';
import {EstimateMainService} from '@libs/estimate/main';
import {EstimateMainContextService} from '@libs/estimate/shared';
import {IDescriptionInfo, PlatformHttpService, PlatformPermissionService, PlatformTranslateService, PropertyPath} from '@libs/platform/common';
import {EstimateParameterUpdateService} from '../../estimate-parameter-update.service';
import {EstimateParameterFormatterService} from './estimate-parameter-formatter.service';
import {EstimateParameterComplexInputGroupLookupService} from './estimate-parameter-complex-inputgroup-lookup.service';
import { EstimateAssembliesService } from '@libs/estimate/assemblies';
import { EstimateRuleParameterConstant } from '@libs/estimate/rule';
import { IEstCustomParameter, IEstimateParameter, IEstParamArgs, IEstParamDataService, IEstParamEntity, IEstParamIds, IEstParamLookupCreationData, IEstParamScope, IEstParamSelectionArgs, IEstParamTab } from '../../../model/estimate-parameter.interface';
import { IReadOnlyField } from '@libs/platform/data-access';


@Injectable({
    providedIn: 'root'
})

/**
 * EstimateParamComplexLookupCommonService provides all lookup common fn. for estimate Parameters complex lookup
 */
export class EstimateParamComplexLookupCommonService {
    private injector = inject(Injector);
    private popupService = inject(PopupService);
    private gridApi = inject(GridApiService);
    protected readonly estimateMainService = inject(EstimateMainService);
    private readonly estimateMainContextService = inject(EstimateMainContextService);
    private platformPermissionService = inject(PlatformPermissionService);
    private http = inject(PlatformHttpService);
    protected readonly estimateParamUpdateService = inject(EstimateParameterUpdateService);
    protected readonly estimateParameterFormatterService = inject(EstimateParameterFormatterService);
    protected readonly estParamComplexInputGroupLookupService = inject(EstimateParameterComplexInputGroupLookupService);
    protected readonly estimateAssembliesService = inject(EstimateAssembliesService);
    public readonly translate = inject(PlatformTranslateService);

    private _currentParamDataService:IEstParamDataService | null = null;
    private _currentPermissionUuid: string = '';
    private _currentMainDataService:IEstParamDataService | null = null;

    private currentTabIndexOfUserForm: number = 0;
    private newFormWindIsOpen: boolean = false;
    private currentRuleId: number = 0;
    private isPrjAssemblyCat: boolean = false;

    public get currentParamDataService() {
        return this._currentParamDataService;
    }

    public set currentParamDataService(service) {
        this._currentParamDataService = service;
    }

    public get currentPermissionUuid() {
        return this._currentPermissionUuid;
    }

    public set currentPermissionUuid(uuid) {
        this._currentPermissionUuid = uuid;
    }

    public get currentMainDataService() {
        return this._currentMainDataService;
    }

    public set currentMainDataService(service) {
        this._currentMainDataService = service;
    }

    //todo - get platform or get service

    //service.onCloseOverlayDialog = new PlatformMessenger();
    //service.onParameterSaved = new PlatformMessenger();

    /**
     * @name getOptions
     * @methodOf EstimateParamComplexLookupCommonService
     * @description get Options
     */
    public getOptions(scope:IEstParamScope): IEstParamLookupCreationData | null | undefined {
        const config = scope.$parent?.$parent?.groups;
        if (!config) {
            return;
        }

        //todo - get parent groups        
        let group = config.find((grp) => grp.Gid === 'ruleAndParam');

        // fix parameter not found error in the Assembly module's assembly detail form
        if (!group) {
            group = config.find((grp) => grp.Gid === 'basicData');

            if (!group) {
                return;
            }
        }

        const ruleConfig = group.Rows.find(row => row.Rid === 'param');
        return ruleConfig ? ruleConfig.FormatterOptions : null;
    }

    /**
     * @name openPopup
     * @methodOf EstimateParamComplexLookupCommonService
     * @description open Popup
     */
    public openPopup<PU,PT>(e:PU, service:PT) {
       /* this.cusParameterValueAssignments(scope).then(function () {
            let popupOptions = {
                //todo: once rule complex lookup done
                // templateUrl: globals.appBaseUrl + '/estimate.rule/templates/estimate-rule-complex-lookup.html',
                title: 'estimate.parameter.params',
                showLastSize: true,
                controller: ['$scope', 'basicsLookupdataLookupControllerFactory', '$popupInstance', controller],
                width: 900,
                height: 400,
                //focusedElement: angular.element(e.target.parentElement),
                //relatedTarget: angular.element(e.target),
               // scope: scope.$new(),
                zIndex: 1000,
                showActionButtons: true
            };

            // toggle popup
            let instance = this.popupService.toggle(popupOptions);

            if (instance) {
                instance.okClicked.then(function () {
                    let _gridId = this.estParamComplexInputgroupLookupService.gridGuid();
                    let gRows = this.gridApi.grids.element('id', _gridId).instance.getData().getRows();

                    if (_gridId && (gRows.length > 0)) {
                        this.gridApi.grids.commitEdit(_gridId);
                        this.gridApi.grids.cancelEdit(_gridId);

                        //TODO navigation bar service
                      /!*  setTimeout(function () {
                            let platformNavBarService = $injector.get('platformNavBarService');
                            platformNavBarService.getActionByKey('save').fn();
                            instance.close();
                        }, 300);*!/
                    }
                });
            }

            function controller($scope, lookupControllerFactory, $popupInstance) {

                let options =$scope;// scope.$parent.$parent.config ? scope.$parent.$parent.config.formatterOptions : service.getOptions(scope);
                this.estParamComplexInputGroupLookupService.initController($scope, lookupControllerFactory, options, $popupInstance, this.getAllColumns());

                service.setCurrentParamService(this.estParamComplexInputGroupLookupService.dataService);
                let dataService = options.realDataService ; //$injector.get(options.realDataService) : $injector.get(options.itemServiceName);
                let entity = dataService.getSelected();
                if (!entity && dataService.getServiceName && dataService.getServiceName() === 'estimateMainBoqService') {
                    // in Boq Container, the root item Id == -1, So when user to estimate from other module,
                    // no selected value even you click on it.
                    let entities = dataService.getSelectedEntities();
                    entity = entities && entities.length > 0 ? entities[0] : entity;
                }

                let result = service.HandleUserFormTab($scope, entity);
                if (result && result.then) {
                    result.then(function () {
                        let includeUserFormRules = find(entity.RuleAssignment, function (item) {
                            return !!item.FormFk;
                        });
                        let indexItem = includeUserFormRules ? find($scope.tabs, {contextFk: includeUserFormRules.Id}) : null;
                        $scope.tabClick(indexItem || $scope.tabs[0], 'user_form_assign_parameter_frame', 3);
                    });
                }

                if (!this.isEditable()) {

                    $scope.tools.items = filter($scope.tools.items, (e) => !['t1', 't2'].includes(e.id));

                    each($scope.displayItem, function (item) {
                        let fields = service.setReadOnly(item, true);
                      //  $injector.get('platformRuntimeDataService').readonly(item, fields);
                    });
                }

                $scope.onContentResized = function () {
                    resize();
                };

                function resize() {
                    setTimeout(function () {
                        this.gridApi.grids.resize($scope.gridId);
                    });
                }

                // for close the popup-menu
                $scope.$on('$destroy', function () {
                    if ($scope.$close) {
                        $scope.$close();
                    }
                });
            }
        })*/
    }

    /**
     * @name setReadOnly
     * @methodOf EstimateParamComplexLookupCommonService
     * @description set ReadOnly
     */
    public setReadOnly<PU extends object>(items:IEstimateParameter[], isReadOnly:boolean) {
        const fields: Array<IReadOnlyField<PU>> = [];
        // item = isArray(items) ? items[0] : null;

        items.forEach((key,value) => {
            const field: IReadOnlyField<PU> = {field: key as unknown as PropertyPath<PU>, readOnly: isReadOnly};
            fields.push(field);
        });
        return fields;
    }

    /**
     * @name HandleUserFormTab
     * @methodOf EstimateParamComplexLookupCommonService
     * @description Handle User Form Tab
     */
    public HandleUserFormTab($scope:IEstParamScope, entity:IEstParamEntity) {
        this.currentTabIndexOfUserForm = 0;
        this.currentRuleId = 0;
        //let userFormCommonService = $injector.get('basicsUserformCommonService');
       // userFormCommonService.formDataSaved.register(this.syncUserFromToParameter);
        //userFormCommonService.winOnClosed.register(this.userFormWinClose);
        //service.onParameterSaved.register(parameterSaveFinish);

        // $scope.$on('$destroy', function () {
        //    // userFormCommonService.formDataSaved.unregister(this.syncUserFromToParameter);
        //    // userFormCommonService.winOnClosed.unregister(this.userFormWinClose);
        //    // service.onParameterSaved.unregister(parameterSaveFinish);
        // });

        $scope.CurrentParamDataService = this._currentParamDataService;

        $scope.Tabs = [];
        // const openOption = [{name: this.translate.instant('basics.userform.newWindow'), method: 1}]; // ,{name: $translate.instant('basics.userform.tab'), method:3}];
        // const openOptionNews = [{name: this.translate.instant('basics.userform.newWindow'), method: 1}];

        let formTab = null;

        if (entity && entity.RuleAssignment) {
            const ids:IEstParamIds[] = [];
            let rubricFk = 70;

            const ruleAssigns = this._currentParamDataService && this._currentParamDataService.isPupopUpParameterWin && typeof this._currentParamDataService.isPupopUpParameterWin === 'function' && this._currentParamDataService.isPupopUpParameterWin() ? [entity.RuleAssignment[entity.RuleAssignment.length - 1]] : entity.RuleAssignment;
            ruleAssigns.forEach((item) => {
                if (item) {
                    if (item.FormFk && filter(ids, {
                        FormId: item.FormFk,
                        ContextId: item.MainId || item.Id
                    }).length <= 0) {
                        ids.push({FormId: item.FormFk, ContextId: item.OriginalMainId || item.MainId || item.Id});
                    }
                    if (item.IsPrjRule || item.PrjEstRuleFk > 0) {
                        rubricFk = 79;
                    }
                }
            });
            if (ids.length > 0) {
                formTab = this.http.post$('basics/userform/getlistbyids?rubricFk=' + rubricFk, ids).subscribe(function (response) {
                   /*// if (response && response.data) {
                       // each(response.data, function (item) {
                            let currentRule = find(entity.RuleAssignment, {Id: item.ContextId}) || find(entity.RuleAssignment, {MainId: item.ContextId});
                            $scope.tabs.push({
                                name: currentRule.Code,
                                currRule: currentRule,
                                index: i + 1,
                                className: i === 1 ? 'userFormAssignParamTabBg' : '',
                                userFormFk: item.Id,
                                contextFk: currentRule.MainId || currentRule.Id,
                                formDataId: item.CurrentFormDataId,
                                rubricFk: rubricFk,
                                display: 'none',
                                displayNew: 'none',
                                openOptions: openOption,
                                openOptionNews: openOptionNews,
                                width: item.FormWidth,
                                height: item.FormHeight
                            });
                            i++;
                        });
                    }*/
                });
            }
        }
        if (entity && entity.FormFk && (!this._currentParamDataService || !this._currentParamDataService.isPupopUpParameterWin || !this._currentParamDataService.isPupopUpParameterWin())) {
            formTab = this.http.post$('basics/userform/getlistbyids?rubricFk=' + 78, [{
                FormId: entity.FormFk,
                ContextId: entity.Id,
                ContextId1: entity.EstHeaderFk
            }]).subscribe(function (response) {
                /*if (response && response.data) {
                    each(response.data, function (item) {
                        $scope.tabs.push({
                            name: item.Description,
                            index: i + 1,
                            className: i === 1 ? 'userFormAssignParamTabBg' : '',
                            userFormFk: item.Id,
                            contextFk: entity.Id,
                            context1Fk: entity.EstHeaderFk,
                            formDataId: item.CurrentFormDataId,
                            rubricFk: 78,
                            display: 'none',
                            displayNew: 'none',
                            openOptions: openOption,
                            openOptionNews: openOptionNews,
                            width: item.FormWidth,
                            height: item.FormHeight
                        });
                        i++;
                    });
                }*/
            });
        }

        $scope.ParamsTab = [];
        const anyUserForm = (entity && entity.RuleAssignment && find(entity.RuleAssignment, function (item) {
            return !!item.FormFk;
        })) || (entity && !!entity.FormFk);
        $scope.ParamsTab.push({
            Name: this.translate.instant('estimate.main.assigned'),
            Index: 1,
            ClassName: anyUserForm ? '' : 'userFormAssignParamTabBg'
        });
        $scope.ShowParamGrid = !anyUserForm;
        // $scope.showParamGridCover = anyUserForm;
        $scope.SaveResult = false;
        $scope.ShowIframe = anyUserForm;

        $scope.tabClick = (item:IEstParamTab,openMethod:()=>void) => {          
            
            if (this.newFormWindIsOpen) {
                return;
            }

            $scope.SaveResult = false;
          /*  var userFormEditable = this.isEditable(),
                jframe = $('#' + frameId)[0],
                win = jframe.contentWindow;
            if ($(jframe).attr('src') !== 'about:blank' && this._currentTabIndexOfUserForm !== item.index) {
                $(jframe).attr('src', 'about:blank');
            }*/

            if (item.Index === 1) {
                this.currentTabIndexOfUserForm = item.Index;
                goToTab(1);
                return;
            }

            if (this.currentTabIndexOfUserForm === item.Index && typeof openMethod !== 'function') {
                return;
            }

            each($scope.Tabs, function (tab) {
                tab.Display = 'none';
                tab.DisplayNew = 'none';
            });

          /*  var userFormCommonService = $injector.get('basicsUserformCommonService');
            var userFormOption = {
                formId: item.userFormFk,
                formDataId: item.formDataId,
                contextId: item.contextFk,
                context1Id: item.context1Fk,
                editable: userFormEditable,
                modal: openMethod === 1,
                rubricFk: item.rubricFk,
                openMethod: openMethod - 0,
                iframe: jframe
            };
            if (item.rubricFk === 79) {
                this._currentRuleId = item.contextFk;
            } else {
                this._currentRuleId = 0;
            }

            var basicsUserFormPassthroughDataService = $injector.get('basicsUserFormPassthroughDataService');
            var currentParamDataService = $injector.get('estimateParamComplexLookupCommonService').getCurrentParamService();
            var paramDatas = currentParamDataService.getList();

            // $scope.showParamGridCover = false;

            setTimeout(function () {
                basicsUserFormPassthroughDataService.setInitialData({
                    params: paramDatas,
                    currentRule: item.currRule,
                    contextInfo: basicsUserFormPassthroughDataService.getContextInfo()
                });

                if (openMethod !== this.userFormOpenMethod.NewWindow) {
                    userFormCommonService.setOption(userFormOption);

                    if (item.index !== 1) {
                        goToTab(item.index);
                        if (this._currentTabIndexOfUserForm !== item.index) {
                            this._currentTabIndexOfUserForm = item.index;
                            userFormOption.openMethod = 4;
                            userFormCommonService.showData(userFormOption);
                        } else {
                            if (typeof win.initFormData === 'function') {
                                win.initFormData();
                            }
                        }
                    }
                } else {
                    // goToTab(1);
                    // currentTabIndexOfUserForm = 1;
                    this.newFormWindIsOpen = true;
                    userFormCommonService.showData(userFormOption);
                }
            }, 200);*/

            function goToTab(index:number) {
                // let gridId = currentParamDataService.getGridId();
                each($scope.Tabs, function (tab) {
                    tab.ClassName = '';
                });
                each($scope.ParamsTab, function (tab) {
                    tab.ClassName = '';
                });

                if (index === 1) {
                    $scope.ShowParamGrid = true;
                    // $scope.showParamGridCover = false;
                    $scope.ShowIframe = false;
                    if ($scope.ParamsTab && $scope.ParamsTab.length > 0) {
                        $scope.ParamsTab[0].ClassName = 'userFormAssignParamTabBg';
                    }
                    if ($scope.onContentResized && isFunction($scope.onContentResized)) {
                        $scope.onContentResized();
                    }
                } else {
                    item.ClassName = 'userFormAssignParamTabBg';
                    $scope.ShowParamGrid = false;
                    $scope.ShowIframe = true;
                }

                if (!$scope.CurrentParamDataService || !$scope.CurrentParamDataService.IsPupopUpParameterWin || !$scope.CurrentParamDataService.isPupopUpParameterWin()) {
                  //TODO JFRAME
                    //  $(jframe.parentNode.parentNode.parentNode.parentNode.parentNode).css('width', item.width - 0 > 0 && index !== 1 ? item.width : 900);
                   // $(jframe.parentNode.parentNode.parentNode.parentNode.parentNode).css('height', item.height - 0 > 0 && index !== 1 ? item.height : 400);
                }
            }
        };

        $scope.openMethodOption = (item, isOpen) => {
            if (this.currentTabIndexOfUserForm === item.Index) {
                item.DisplayNew = isOpen ? 'block' : 'none';
                return;
            }
            item.Display = isOpen ? 'block' : 'none';
        };

        return formTab;       
    }

    private parameterSaveFinish($scope:IEstParamScope) {
        $scope.SaveResult = true;
    }

    /**
     * @name userFormWinClose
     * @methodOf EstimateParamComplexLookupCommonService
     * @description user Form Win Close
     */
    public userFormWinClose() {
        this.newFormWindIsOpen = false;
    }

    /**
     * @name syncUserFromToParameter
     * @methodOf EstimateParamComplexLookupCommonService
     * @description sync User From To Parameter
     */
    public syncUserFromToParameter(formDateId:number, args:IEstParamArgs[]) {
        this.newFormWindIsOpen = false;
        let formData = args.map(arg => arg.FormData);
        if (!formData) {
            this.syncParamFinished();
            return;
        }

        let newParams: IEstimateParameter[] = [];
        if (formData.some(data => !!data.Parameters && data.Parameters.length > 0)) {
            newParams = formData.flatMap(data => data.Parameters);
            each(newParams, function (item) {
                item.Code = item.Code.replace(/-/ig, '_');
            });
        } else {
            if (formData.length === 0) {
                this.syncParamFinished();
                return;
            }
            formData = filter(formData, (item: { Parameters?: IEstimateParameter[], ParamCode?: string, ColumnName?: string }): item is { Parameters: IEstimateParameter[], ParamCode: string, ColumnName: string } =>{
                return !!item.ParamCode && !!item.ColumnName;
            });
            if (formData.length === 0) {
                this.syncParamFinished();
                return;
            }

            const pGroup = groupBy(formData, 'paramCode');
            /*pGroup = filter(pGroup, function (group) {
                return !find(group, {columnName: 'BeChecked'}) || (find(group, {columnName: 'BeChecked'}) ? find(group, {columnName: 'BeChecked'}).value : false);
            });*/
            each(pGroup, function (group) {
                const foundItem = find(group, { columnName: 'Code' });
                const paramCode = foundItem ? foundItem.valueOf() : '';
                const item = {
                    Code: paramCode,
                    ParameterValue: find(group, {columnName: 'ParameterValue'}) ? find(group, {columnName: 'ParameterValue'})?.valueOf().toString() : '',
                    ValueDetail: find(group, {columnName: 'ValueDetail'}) ? find(group, {columnName: 'ValueDetail'})?.valueOf() : '',
                    UomFk: find(group, {columnName: 'UomFk'}) ? find(group, {columnName: 'UomFk'})?.valueOf() : '',
                    ItemValue: find(group, {columnName: 'ItemValue'}) ? find(group, {columnName: 'ItemValue'})?.valueOf() : '',
                    Desc: find(group, {columnName: 'Desc'}) ? find(group, {columnName: 'Desc'})?.valueOf() : ''
                };
                item.Code = item.Code ?? (item.ParameterValue ? find(group, { columnName: 'ParameterValue' })?.valueOf() ?? '' : '');
               //newParams.push(item);
            });
        }

        const allPermisson = [], createNewParams = [], oldParams = this._currentParamDataService?.getSelection();
        newParams.forEach((item) => {
            if (item.Code) {
                item.Code = item.Code.toUpperCase();
                const oldParam = find(oldParams, {Code: item.Code});
                if (oldParam) {
                    this.mergeNewParamToOld(oldParam, item);
                    if ((oldParam.ProjectEstRuleFk ?? 0) - 0 !== this.currentRuleId - 0 && this.currentRuleId - 0 > 0) {
                        oldParam.ProjectEstRuleFk = this.currentRuleId;
                        this._currentParamDataService?.updateParameter(oldParam, 'ProjectEstRuleFk');
                    }
                } else {
                    if (!!item.ParameterValue || !!item.ValueDetail || (item.UomFk && item.UomFk !== '0')) {
                        const permission = this._currentParamDataService?.createItem(item.Code, true).then((param:IEstimateParameter) =>{
                            param.Code = item.Code;
                            param.EstParameterGroupFk = 3;
                            param.ValueType = EstimateRuleParameterConstant.Decimal2;
                            if (item.ParameterValue) {
                                if (typeof item.ParameterValue === 'string' && (item.ParameterValue.toLowerCase() === 'false' || item.ParameterValue.toLowerCase() === 'true')) {
                                    param.ValueType = EstimateRuleParameterConstant.Boolean;
                                } else if (typeof item.ParameterValue === 'string' && !item.ParameterValue.match(new RegExp('^[-]?\\d+(\\.\\d+)?$', 'g'))) {
                                    param.ValueType = EstimateRuleParameterConstant.Text;
                                }
                            }
                            param.ProjectEstRuleFk = this.currentRuleId - 0 > 0 ? this.currentRuleId : undefined;
                            if (!param.DescriptionInfo) {
                                param.DescriptionInfo = {
                                    Description: '',
                                    DescriptionTr: 0,
                                    DescriptionModified: false,
                                    Translated: '',
                                    OtherLanguages: null,
                                    VersionTr: 0,
                                    Modified: false
                                };
                            }
                            param.DescriptionInfo.OtherLanguages = item.DescriptionInfo?.OtherLanguages ?? null;
                            this.mergeNewParamToOld(param, item);
                            createNewParams.push(param);
                        });
                        allPermisson.push(permission);
                    }
                }
            }
        });
        if (allPermisson.length > 0) {
          /* $q.all(allPermisson).then(function () {

                if (this._currentParamDataService.asyncValidateCode) {
                    let codeValidationPermissons = [];
                    each(createNewParams, function (item) {
                        item.OldParameterValue = item.ParameterValue;
                        item.OldValueDetail = item.ValueDetail;
                        item.IsCreateFromUserForm = true;
                        codeValidationPermissons.push(this._currentParamDataService.asyncValidateCode(item, item.Code, 'Code'));
                    });

                    $q.all(codeValidationPermissons).then(function () {
                        each(createNewParams, function (item) {
                            item.ParameterValue = item.Version === -1 ? item.OldParameterValue : item.ParameterValue;
                            item.ValueDetail = item.Version === -1 ? item.OldValueDetail : item.ValueDetail;
                        });

                        this.validataValueDetail(this._currentParamDataService);
                        this.syncParamFinished();
                    });
                } else {
                    this.validataValueDetail(this._currentParamDataService);
                    this.syncParamFinished();
                }
            });*/
        } else {
            this.validataValueDetail(this._currentParamDataService);
            this.syncParamFinished();
        }
    }

    /**
     * @name syncParamFinished
     * @methodOf EstimateParamComplexLookupCommonService
     * @description sync Param Finished
     */
    private syncParamFinished() {
        if (this._currentParamDataService?.syncParametersFinished) {
            this._currentParamDataService?.syncParametersFinished();
        }

        //TODO
        //service.onParameterSaved.fire();
    }

    /**
     * @name validataValueDetail
     * @methodOf EstimateParamComplexLookupCommonService
     * @description validate value details
     */
    private validataValueDetail(dataService:IEstParamDataService|null) {
       if(dataService !== null){       
            const list = filter(dataService.getSelection(), function (item) {
                return item.NeedValidation ?? item.NeedValidation;
            });
            if (!list || list.length === 0) {
                // TODO gridRefresh is not implemented yet
            // dataService.gridRefresh();
                return;
            }

            /*let estimateRuleCommonService = $injector.get('estimateRuleCommonService');
            let platformRuntimeDataService = $injector.get('platformRuntimeDataService');
            let permissions = [];
            each(list, function (item) {
                let dataService = $injector.get('estimateParamDataService');
                if (!dataService.getModule || !dataService.getModule()) {
                    dataService.getModule = function () {
                        return 'RuleParameter';
                    };
                }
                let result = estimateRuleCommonService.getAsyncParameterDetailValidationResult(item, item.ValueDetail, 'ValueDetail', dataService);
                permissions.push(result);
                result.then(function (data) {
                    platformRuntimeDataService.applyValidationResult(data, item, 'ValueDetail');
                });
            });

            if (permissions.length === 0) {
                dataService.gridRefresh();
                return;
            }

            $q.all(permissions).then(function () {
                dataService.gridRefresh();
            });*/
        }
    }

    /**
     * @name mergeNewParamToOld
     * @methodOf EstimateParamComplexLookupCommonService
     * @description merge New Param To Old
     */
    private mergeNewParamToOld(oldParam:IEstimateParameter, newParam:IEstimateParameter) {
        const oldParamValue = oldParam.ParameterValue;
        const oldParamValueDetail = oldParam.ValueDetail;
        if (oldParam.ValueType === EstimateRuleParameterConstant.Boolean) {
            oldParam.ParameterValue = !newParam.ParameterValue || newParam.ParameterValue === '0' || (typeof newParam.ParameterValue === 'string' && newParam.ParameterValue.toLowerCase() === 'false') ? 0 : 1;
            oldParam.ValueDetail = '';
            if (oldParamValue !== oldParam.ParameterValue) {
                this._currentParamDataService?.updateParameter(oldParam, 'ParameterValue');
            }

        } else if (oldParam.ValueType === EstimateRuleParameterConstant.Text || oldParam.ValueType === EstimateRuleParameterConstant.TextFormula) {
            const oldParamText = oldParam.ParameterText;
            oldParam.ParameterValue = 0;
            oldParam.ValueDetail = newParam.ValueDetail || oldParam.ValueDetail;
            oldParam.ValueText = typeof newParam.ParameterValue === 'string' ? newParam.ParameterValue : oldParam.ValueText;
            oldParam.ParameterText = typeof newParam.ParameterValue === 'string' ? newParam.ParameterValue : oldParam.ParameterText;
            if (oldParamValueDetail !== oldParam.ValueDetail || oldParamText !== oldParam.ParameterText) {
                this._currentParamDataService?.updateParameter(oldParam, 'ParameterText');
            }
        } else {
            if (newParam.ParameterValue) {
                newParam.ParameterValue = (newParam.ParameterValue + '').match(new RegExp('^[-]?\\d+(\\.\\d+)?$', 'g')) ? parseFloat(newParam.ParameterValue.toString()) : 0;
            }
            oldParam.ParameterValue = newParam.ParameterValue === 0 ? 0 : (newParam.ParameterValue || oldParam.ParameterValue);
            oldParam.ValueDetail = newParam.ParameterValue === 0 ? '0' : (newParam.ValueDetail || oldParam.ValueDetail);
            if (oldParamValueDetail !== oldParam.ValueDetail) {
                this._currentParamDataService?.updateParameter(oldParam, 'ValueDetail');
                oldParam.NeedValidation = !!oldParam.ValueDetail && true;
            } else if (oldParamValue !== oldParam.ParameterValue) {
                this._currentParamDataService?.updateParameter(oldParam, 'ParameterValue');
            }
        }
        newParam.UomFk = newParam.UomFk || '';
        newParam.UomFk = typeof newParam.UomFk === 'string' && newParam.UomFk.match(new RegExp('\\d+', 'g')) ? parseInt(newParam.UomFk) : 0;
        const oldUomFk = oldParam.UomFk;
        oldParam.UomFk = newParam.UomFk || oldParam.UomFk;
        if (oldUomFk !== oldParam.UomFk) {
            this._currentParamDataService?.updateParameter(oldParam, 'UomFk');
        }

        if (newParam.Desc) {
            oldParam.DescriptionInfo = oldParam.DescriptionInfo || {} as IDescriptionInfo;
            const oldDesc = oldParam.DescriptionInfo?.Description;
            oldParam.DescriptionInfo.Description = newParam.Desc;
            oldParam.DescriptionInfo.Translated = newParam.DescriptionInfo ? newParam.DescriptionInfo.Translated : newParam.Desc;
            if (oldDesc !== newParam.Desc) {
                oldParam.DescriptionInfo.Modified = true;
                this._currentParamDataService?.updateParameter(oldParam, 'DescriptionInfo');
            }
        }
    }

    /**
     * @name onSelectionChange
     * @methodOf EstimateParamComplexLookupCommonService
     * @description on Selection Change
     */
    public onSelectionChange(args:IEstParamSelectionArgs, scope:IEstParamScope) {
        const entity = args.Entity,
            lookupItems = isArray(args.PreviousItem) ? args.PreviousItem : [args.PreviousItem];
        const opt = scope.$parent?.$parent?.config ? scope.$parent?.$parent?.config?.formatterOptions : this.getOptions(scope);
        if (args.SelectedItem && args.SelectedItem.Id) {
            if (args.SelectedItem.ValueType === 1) {
                if (args.SelectedItem.ValueDetail && (args.SelectedItem.ValueDetail + '').indexOf('.') < 0) {
                    args.SelectedItem.ValueDetail += '.000';
                } else {
                    args.SelectedItem.ValueDetail = args.SelectedItem.DefaultValue;
                }
            } else if (args.SelectedItem.ValueType === 2) {
                args.SelectedItem.ValueDetail = null;
            }
            const selectedItem = cloneDeep(args.SelectedItem);
            selectedItem.MainId = 0;
            lookupItems.push(args.SelectedItem);
            this.estimateParamUpdateService.setParamToSave([selectedItem], entity, opt?.ItemServiceName ?? '', opt?.ItemName ?? '');
            entity.Param = map(uniqBy(lookupItems, 'Id'), 'Code');
        } else {
            this.estimateParamUpdateService.setParamToDelete(lookupItems && lookupItems.length ? lookupItems : null, entity, opt?.ItemServiceName ?? '', opt?.ItemName ?? '');
        }
        // TODO - dependent on Scope object
        // scope.ngModel = entity.Param;
        //this.estParamComplexInputGroupLookupService.refreshRootParam(scope.entity, scope.ngModel, opt.RootServices);
    }

    /**
     * @name getOptions
     * @methodOf EstimateParamComplexLookupCommonService
     * @description clear all items in param complpex lookup grid container
     */
    public clearAllItems(args:IEstParamSelectionArgs, scope:IEstParamScope, canDelete:boolean) {
       // let opt;
        //TODO get .dataService
        //let opt = scope.$parent.$parent.config ? scope.$parent.$parent.config.formatterOptions : service.getOptions(scope);

      /*  let   lookupItems = this.estimateParameterFormatterService.getItemsByParam(scope.entity, opt);

        if (lookupItems && lookupItems.length > 0) {
            let entity = args.entity;

            this.estimateParamUpdateService.setParamToDelete(lookupItems && lookupItems.length ? lookupItems : null, entity, opt.itemServiceName, opt.itemName);

            // if the user not initialize the parameter controller, the complexLookupService.dataService will have no function,
            // so here make the function not undefined
            let complexLookupService = this.estParamComplexInputGroupLookupService;
          //TODO
            if (!complexLookupService.dataService.getEstLeadingStructureContext) {
                complexLookupService.dataService.getEstLeadingStructureContext = function getEstLeadingStructureContext() {
                    // let item = cloneDeep(scope.entity);
                    let item = {};
                    let selectItem = $injector.get(opt.itemServiceName).getSelected();
                    if (selectItem) {
                        item = this.estimateParamUpdateService.getLeadingStructureContext(item, selectItem, opt.itemServiceName, opt.itemName);
                    }
                    return {item: item, itemName: opt.itemName};
                };
            }

            if (!complexLookupService.dataService.getEstLeadingStructContext) {
                complexLookupService.dataService.getEstLeadingStructContext = function getEstLeadingStructContext() {
                    let item = {};
                    item = this.estimateParamUpdateService.getLeadingStructureContext(item, entity, opt.itemServiceName, opt.itemName);
                    return {item: item, itemName: opt.itemName};
                };
            }
            if (canDelete) {
                // service.onCloseOverlayDialog.fire();
                entity.Param = this.estimateParameterFormatterService.getParamNotDeleted(opt.itemName);
                scope.ngModel = entity.Param;
                this.estimateParameterFormatterService.clearParamNotDeleted(opt.itemName);
                this.estParamComplexInputGroupLookupService.refreshRootParam(entity, scope.ngModel, opt.RootServices);
            } else {
                let mainService;
                //TODO
                // = opt.realDataService === 'estimateAssembliesService' ? $injector.get(opt.realDataService) : $injector.get(opt.itemServiceName);
                mainService = !mainService ? this.estimateMainService : mainService;

                if ((opt.itemServiceName === 'estimateMainService' || opt.itemServiceName === 'estimateMainAssembliesCategoryService') && entity.EstHeaderFk) {
                    //TODO
                    //this.estimateMainContextService.setSelectedEstHeaderId(entity.EstHeaderFk);
                }

                if (opt.itemServiceName === 'projectAssemblyStructureService' || opt.itemServiceName === 'projectAssemblyMainService') {
                   //TODO
                    // mainService = $injector.get('projectMainService');
                }

                if (isFunction(mainService.update)) {
                    mainService.update().then(function () {
                        entity.Param = this.estimateParameterFormatterService.getParamNotDeleted(opt.itemName);
                        scope.ngModel = entity.Param;
                        this.estimateParameterFormatterService.clearParamNotDeleted(opt.itemName);
                        this.estParamComplexInputGroupLookupService.refreshRootParam(entity, scope.ngModel, opt.RootServices);
                        mainService.fireItemModified(entity);
                        if (opt.realDataService) {
                            //TODO
                            let realDataService = $injector.get(opt.realDataService);
                            $injector.get('platformGridAPI').rows.refreshRow({
                                gridId: realDataService.getGridId(),
                                item: entity
                            });
                        }
                    });
                }
            }
        }*/
    }

    /**
     * @name clearSameParameter
     * @methodOf EstimateParamComplexLookupCommonService
     * @description If the parameter has same code,same datatype,keep assembly parameter
     */
    public clearSameParameter(lineItem:IEstimateParameter, assemblyParameter:IEstimateParameter[]) {
        const scope = {
            entity: lineItem,
            $parent: {
                $parent: {
                    config: {
                        formatterOptions: {
                            dataServiceMethod: 'getItemByRuleAsync',
                            dataServiceName: 'estimateRuleFormatterService',
                            itemName: 'EstLineItems',
                            itemServiceName: 'estimateMainService',
                            serviceName: 'basicsCustomizeRuleIconService',
                            validItemName: 'EstLineItems'
                        }
                    }
                }
            }
        };
        scope.$parent.$parent.config.formatterOptions = {
            dataServiceMethod: 'getItemByParamAsync',
            dataServiceName: 'estimateParameterFormatterService',
            itemName: 'EstLineItems',
            itemServiceName: 'estimateMainService',
            serviceName: 'estimateParameterFormatterService',
            validItemName: 'EstLineItems'
        };

        const opt = scope.$parent.$parent.config.formatterOptions;

        const existsParam:IEstimateParameter[] = this.estimateParameterFormatterService.getItemsByParam(scope.entity,this.estimateParameterFormatterService.postData);
        if (existsParam && existsParam.length > 0) {
            const toDeleteParamter:IEstimateParameter[] = [];
            each(existsParam, function (lineItemParam) {
                filter(assemblyParameter, function (assParam) {
                    if (assParam.Code === lineItemParam.Code && assParam.ValueType === lineItemParam.ValueType) {
                        toDeleteParamter.push(lineItemParam);
                    }
                });
            });

            if (toDeleteParamter.length > 0) {
                this.estimateParamUpdateService.setParamToDelete(toDeleteParamter && toDeleteParamter.length ? toDeleteParamter : null, lineItem, opt.itemServiceName, opt.itemName);
                // TODO Param does not exist on IEstLineItemEntity
               // lineItem.Param = this.estimateParameterFormatterService.getParamNotDeleted(opt.itemName) ? this.estimateParameterFormatterService.getParamNotDeleted(opt.itemName) : lineItem.Param;
               //TODO
                //scope.ngModel = lineItem.Param;
                this.estimateParameterFormatterService.clearParamNotDeleted(opt.itemName);
                //TODO
               // this.estParamComplexInputGroupLookupService.refreshRootParam(lineItem, scope.ngModel, opt.RootServices);
            }
        }

    }

    /**
     * @name getColumns
     * @methodOf EstimateParamComplexLookupCommonService
     * @description get columns for param complex lookup
     */
    public getColumns() {
        return [
            {
                id: 'code',
                formatter: 'code',
                field: 'Code',
                name: 'Code',
                name$tr$: 'cloud.common.entityCode',
                editor: 'directive',
                grouping: {
                    title: 'cloud.common.entityCode',
                    getter: 'Code',
                    aggregators: [],
                    aggregateCollapsed: true
                },
                editorOptions: {
                    directive: 'basics-common-limit-input',//Todo : change the directive to service
                    validKeys: {
                        regular: '^([a-zA-Z_][a-zA-Z0-9_]{0,15})?$'
                    }
                },
                width: 70
            },
            {
                id: 'desc',
                field: 'DescriptionInfo',
                name: 'Description',
                width: 120,
                toolTip: 'Description',
                editor: 'translation',
                formatter: 'translation',
                name$tr$: 'cloud.common.entityDescription',
                maxLength: 255,
                grouping: {
                    title: 'cloud.common.entityDescription',
                    getter: 'Description',
                    aggregators: [],
                    aggregateCollapsed: true
                }
            }
        ];
    }

    /**
     * @name getAllColumns
     * @methodOf EstimateParamComplexLookupCommonService
     * @description get all columns for param complex lookup
     */
    private getAllColumns() {
        // let addCols = [
        //     {
        //         id: 'estparamgrpfk',
        //         field: 'EstParameterGroupFk',
        //         name: 'EstParameterGroupFk',
        //         width: 120,
        //         toolTip: 'Est Parameter Group Fk',
        //         editor: 'lookup',
        //         formatter: 'lookup',
        //         name$tr$: 'basics.customize.estparametergroup',
        //         grouping: {
        //             title: 'basics.customize.estparametergroup',
        //             getter: 'EstParameterGroupFk',
        //             aggregators: [],
        //             aggregateCollapsed: true
        //         }
        //     },
        //     {
        //         id: 'valuedetail',
        //         field: 'ValueDetail',
        //         name: 'ValueDetail',
        //         width: 120,
        //         toolTip: 'ValueDetail',
        //         editor: 'comment',
        //         formatter: 'comment', function(row, cell, value){
		// 					//return angular.uppercase(value);
		// 				} ,
        //         name$tr$: 'basics.customize.valuedetail',
        //         grouping: {
        //             title: 'basics.customize.valuedetail',
        //             getter: 'ValueDetail',
        //             aggregators: [],
        //             aggregateCollapsed: true
        //         }
        //     },
        //     {
        //         id: 'uomfk',
        //         field: 'UomFk',
        //         name: 'UomFk',
        //         width: 120,
        //         toolTip: 'UomFk',
        //         editor: 'integer',
        //         formatter: 'integer',
        //         name$tr$: 'cloud.common.entityUoM',
        //         grouping: {
        //             title: 'cloud.common.entityUoM',
        //             getter: 'UomFk',
        //             aggregators: [],
        //             aggregateCollapsed: true
        //         }
        //     },
        //     {
        //         id: 'parametervalue',
        //         field: 'ParameterValue',
        //         name: 'ParameterValue',
        //         width: 120,
        //         toolTip: 'ParameterValue',
        //         editor: 'dynamic',
        //         formatter: 'dynamic',
        //         name$tr$: 'basics.customize.parametervalue',
        //          grouping: {
        //             title: 'basics.customize.parametervalue',
        //             getter: 'ParameterValue',
        //             aggregators: [],
        //             aggregateCollapsed: true
        //         },
        //         domain: function (item, column) {
        //             let domain;
        //             if (item.ValueType === EstimateRuleParameterConstant.TextFormula) {

        //                 domain = 'directive';
        //                 column.field = 'ParameterText';
        //                 column.ValueText = null;
        //                 column.editorOptions = {
        //                     lookupDirective: 'parameter-value-type-text-formula-lookup',
        //                     lookupType: 'ParamValueTypeTextFormulaLookup',
        //                     dataServiceName: 'estimateMainParameterValueLookupService',
        //                     valueMember: 'Id',
        //                     displayMember: 'Value',
        //                     isTextEditable: true,
        //                     showClearButton: true
        //                 };

        //                 column.formatterOptions = {
        //                     lookupType: 'ParamValueTypeTextFormulaLookup',
        //                     dataServiceName: 'estimateMainParameterValueLookupService',
        //                     displayMember: 'Value',
        //                     field: 'ParameterText',
        //                     isTextEditable: true,
        //                     multiSelect: true
        //                 };
        //             } else if (item.ValueType === EstimateRuleParameterConstant.Boolean) {

        //                 domain = 'boolean';
        //                 column.DefaultValue = false;
        //                 column.field = 'ParameterValue';
        //                 column.editorOptions = null;
        //                 column.formatterOptions = null;
        //                 column.regex = null;

        //             } else if (item.ValueType === EstimateRuleParameterConstant.Text) {

        //                 domain = 'description';
        //                 column.DefaultValue = 0;
        //                 column.field = 'ParameterText';
        //                 column.editorOptions = null;
        //                 column.formatterOptions = null;
        //                 column.maxLength = 255;
        //                 column.regex = null;
        //             } else {   // means the valueType is Decimal2 or the valueType is Undefined

        //                 domain = 'quantity';
        //                 column.DefaultValue = null;
        //                 column.field = 'ParameterValue';
        //                 column.editorOptions = {decimalPlaces: 3};
        //                 column.formatterOptions = {decimalPlaces: 3};
        //                 column.regex = '^(?:\\d{0,13}(?:\\.\\d{0,3}){0,16})?$';
        //             }

        //             return domain;
        //         }
        //     },
        //     {
        //         id: 'defaultvalue',
        //         field: 'DefaultValue',
        //         name: 'DefaultValue',
        //         width: 120,
        //         toolTip: 'DefaultValue',
        //         editor: 'dynamic',
        //         formatter: 'dynamic',
        //         name$tr$: 'estimate.parameter.defaultValue',
        //         grouping: {
        //             title: 'basics.customize.defaultValue',
        //             getter: 'DefaultValue',
        //             aggregators: [],
        //             aggregateCollapsed: true
        //         },
        //         domain: function (item, column) {
        //             let domain;
        //             if (item.ValueType === EstimateRuleParameterConstant.Boolean) {

        //                 domain = 'boolean';
        //                 column.DefaultValue = false;
        //                 column.field = 'DefaultValue';
        //                 column.editorOptions = null;
        //                 column.formatterOptions = null;
        //                 column.regex = null;
        //                 column.readonly = true;

        //             } else if (item.ValueType === EstimateRuleParameterConstant.Text || item.ValueType === EstimateRuleParameterConstant.TextFormula) {

        //                 domain = 'description';
        //                 column.DefaultValue = null;
        //                 column.field = 'ValueText';
        //                 column.editorOptions = null;
        //                 column.formatterOptions = null;
        //                 column.maxLength = 255;
        //                 column.regex = null;
        //                 column.readonly = true;

        //             } else {   // means the valueType is Decimal2 or the valueType is Undefined

        //                 domain = 'quantity';
        //                 column.DefaultValue = null;
        //                 column.field = 'DefaultValue';
        //                 column.editorOptions = {decimalPlaces: 3};
        //                 column.formatterOptions = {decimalPlaces: 3};
        //                 column.regex = '^(?:\\d{0,13}(?:\\.\\d{0,3}){0,16})?$';
        //                 column.readonly = true;
        //             }
        //             return domain;
        //         }
        //     },
        //     {
        //         id: 'valuetype',
        //         field: 'ValueType',
        //         name: 'Value Type',
        //         width: 120,
        //         toolTip: 'Value Type',
        //         name$tr$: 'estimate.parameter.valueType',
        //         grouping: {
        //             title: 'basics.customize.valueType',
        //             getter: 'ValueType',
        //             aggregators: [],
        //             aggregateCollapsed: true
        //         },
        //         required: false,
        //         editor: 'lookup',
        //         editorOptions: {
        //             lookupDirective: 'estimate-rule-parameter-type-lookup'
        //         },
        //         formatter: 'lookup',
        //         formatterOptions: {
        //             lookupType: 'ParameterValueType',
        //             dataServiceName: 'estimateRuleParameterTypeDataService',
        //             displayMember: 'Description'
        //         }
        //     },
        //     {
        //         id: 'islookup1',
        //         field: 'IsLookup',
        //         name: 'IsLookup',
        //         width: 120,
        //         toolTip: 'IsLookup',
        //         editor: 'boolean',
        //         formatter: 'boolean',
        //         name$tr$: 'estimate.parameter.isLookup',
        //         grouping: {
        //             title: 'basics.customize.isLookup',
        //             getter: 'IsLookup',
        //             aggregators: [],
        //             aggregateCollapsed: true
        //         }
        //     },
        //     {
        //         id: 'estruleparamvaluefk',
        //         field: 'EstRuleParamValueFk',
        //         name: 'Item Value',
        //         width: 100,
        //         toolTip: 'Item Value',
        //         name$tr$: 'estimate.parameter.estRuleParamValueFk',
        //         required: false,
        //         editor: 'lookup',
        //         editorOptions: {
        //             lookupDirective: 'estimate-main-parameter-value-lookup'
        //         },
        //         formatter: 'lookup',
        //         formatterOptions: {
        //             lookupType: 'EstMainParameterValues',
        //             dataServiceName: 'estimateMainParameterValueLookupService',
        //             displayMember: 'DescriptionInfo.Translated'
        //         },
        //         grouping: {
        //             title: 'estimate.parameter.estRuleParamValueFk',
        //             getter: 'EstRuleParamValueFk',
        //             aggregators: [],
        //             aggregateCollapsed: true
        //         }
        //     },
        //     {
        //         id: 'prjEstRuleFk',
        //         field: 'ProjectEstRuleFk',
        //         name: 'Project Rule',
        //         width: 120,
        //         toolTip: 'Project Rule',
        //         name$tr$: 'estimate.parameter.prjEstRule',
        //         readonly: true,
        //         grouping: {
        //             title: 'estimate.parameter.prjEstRule',
        //             getter: 'ProjectEstRuleFk',
        //             aggregators: [],
        //             aggregateCollapsed: true
        //         }
        //     }
        // ];

        /*  let columns = this.getColumns().concat(addCols);
        let uomConfig = columns.find( function (item) {
            return item.id === 'uomfk';
        });

        let paramgrpConfig = columns.find( function (item) {
            return item.id === 'estparamgrpfk';
        });

        let prjEstRuleConfig = columns.find( function (item) {
            return item.id === 'prjEstRuleFk';
        });

        angular.extend(uomConfig,basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
             dataServiceName: 'basicsUnitLookupDataService', cacheEnable: true }).grid);

         angular.extend(paramgrpConfig,basicsLookupdataConfigGenerator.provideGenericLookupConfig('estimate.lookup.parametergroup').grid);

         let prjEstRuleLookupConfig = $injector.get('basicsLookupdataConfigGenerator').provideDataServiceLookupConfig({
             dataServiceName: 'projectEstimateRuleLookupDataService',
             enableCache: true,
             readonly : true,
             filter: function () {
                 let prjId = estimateMainService.getSelectedProjectId();
                 return prjId ? prjId : -1;
             }});

         angular.extend(prjEstRuleConfig,prjEstRuleLookupConfig.grid);

         estimateCommonLookupValidationService.addValidationAutomatically(columns, paramValidationService);*!/
*/
        //return columns;
    }

    /**
     * @name displayFormatter
     * @methodOf EstimateParamComplexLookupCommonService
     * @description display Formatter
     */
    public displayFormatter(value:string|number, lookupItem:string, displayValue:string|number, lookupConfig:object, entity:IEstimateParameter) {
       if (!entity) {
            return;
        }
       // const column = {formatterOptions: {serviceName: 'estimateParameterFormatterService', acceptFalsyValues: true}}; //service = $injector.get('platformGridDomainService');

        // let param = {};
        if (isArray(entity.Param)) {
          // param = entity.Param && entity.Param.length ? {'params': entity.Param} : 'default';
        }
        //return service.formatter('imageselect')(null, null, param, column, entity, null, null);*!/
    }

    /**
     * @name isEditable
     * @methodOf EstimateParamComplexLookupCommonService
     * @description check is param editable
     */
    private isEditable() {
        if (this._currentMainDataService && isFunction(this._currentMainDataService?.IsReadonly)) {
            if (this._currentMainDataService.isReadOnly()) {
                return false;
            }
        }

        if (this.estimateMainContextService.getHeaderStatus() || !this.estimateMainService.hasCreateUpdatePermission()) {
            return false;
        }

        if (this._currentMainDataService && this._currentMainDataService.getServiceName() === 'estimateMainRootService') {
            return true;
        }

        if (this._currentPermissionUuid) {
            const permissionService = this.platformPermissionService;
            if (!permissionService.hasWrite(this._currentPermissionUuid)) {
                return false;
            }
        }
        return true;
    }

    /**
     * @name getProjectId
     * @methodOf EstimateParamComplexLookupCommonService
     * @description get Project ID
     */
    public getProjectId() {
        // let projectId = null;// the wic boq ,assembly module no need get the projectId

        //TODO

       /* /!*let estimateParamDataService = $injector.get('estimateParamDataService');

        // assembly module get the parameters from the  estimateAssembliesService
        let isAssembly = this.estimateAssembliesService.getIsAssembly();

        // estimate module get the paramters from the estimateParamDataService
        let isEstimate = this.estimateMainContextService.getIsEstimate();

        let isFromWicBoq = $injector.get('boqRuleComplexLookupService').isNavFromBoqWic();

        let isFromProjectBoq = $injector.get('boqRuleComplexLookupService').isNavFromBoqProject();

        let fromModule = estimateParamDataService.getModule();
        if (fromModule && fromModule.toLowerCase() === 'project') {
            projectId = estimateParamDataService.getProjectId();
        } else if (fromModule && fromModule.toLowerCase() === 'estlineitems') {
            projectId = isEstimate ? this.estimateMainContextService.getSelectedProjectId() : null;
        }

        if (isFromProjectBoq) {
            projectId = this.estimateMainContextService.getSelectedProjectId();
        }
        if (isFromWicBoq) {
            projectId = null;
        }

        if (this.getIsPrjAssemblyCat() || this.checkIsPrjAssembly()) {
            projectId = this.estimateMainContextService.getSelectedProjectId();
        }

        if (isAssembly) {
            // after assign rule show parameter dailog window
            projectId = null;  // no need search the parameter by projectId in assembly module
        }
        if (isEstimate && !(fromModule && fromModule.toLowerCase() === 'project')) {
            projectId = this.estimateMainContextService.getSelectedProjectId();
        }
        return projectId;*/
    }

    /**
     * @name setIsPrjAssemblyCat
     * @methodOf EstimateParamComplexLookupCommonService
     * @description set prj assembly category
     */
    public setIsPrjAssemblyCat(opt:IEstParamLookupCreationData|null|undefined) {
        if(opt !== null && opt !== undefined){
            this.isPrjAssemblyCat = opt.ItemName === 'EstAssemblyCat' && opt.ItemServiceName === 'projectAssemblyStructureService';
        }        
    }

    /**
     * @name getIsPrjAssemblyCat
     * @methodOf EstimateParamComplexLookupCommonService
     * @description get is current prj assembly category
     */
    public getIsPrjAssemblyCat() {
        return this.isPrjAssemblyCat;
    }

    /**
     * @name checkIsPrjAssembly
     * @methodOf EstimateParamComplexLookupCommonService
     * @description Check is lookup used in Prj Assembly
     */
    public checkIsPrjAssembly() {
        //TODO
        //return $injector.get('projectAssemblyMainService').getIsPrjAssembly();
    }

    /**
     * @name getCurrentOption
     * @methodOf EstimateParamComplexLookupCommonService
     * @description get current Options
     */
    public getCurrentOption(scope:IEstParamScope):IEstParamLookupCreationData | null | undefined {       
        return scope.$parent?.$parent?.config ? scope.$parent?.$parent?.config?.formatterOptions : this.getOptions(scope);
    }

    /**
     * @name cusParameterValueAssignments
     * @methodOf EstimateParamComplexLookupCommonService
     * @description Custom Param Value assignments
     */
    public cusParameterValueAssignments(scope:IEstParamScope) {
        //TODO defer
        //let deferred = $q.defer();
        const options = this.getCurrentOption(scope);
        this.setIsPrjAssemblyCat(options);
        //TODO use options
        const displayData: IEstimateParameter[] = this.estimateParameterFormatterService.getItemsByParam(scope.Entity, this.estimateParameterFormatterService.postData) as IEstCustomParameter[];
        const cusDisplayData = filter(displayData, function (item) {
            return item.Id === 3002 ;
            //TODO need to check how to handle this item.SourceId === 3002 && item.IsLookup && !item.IsAssignmentCusParameterValue;
        });

        const displayDataGroups = groupBy(displayData, function (item) {
            return item.Code;
        });

        if (cusDisplayData.length) {
            const cusParameterToSaveCodes:string[] = [];
            each(cusDisplayData, function (item) {
                const groupData = displayDataGroups[item.Code];
                const isAssignmentCusParameterValue = false;
                each(groupData, function (data) {
                    //TODO
                    /*if (data.Id !== item.Id && data.IsAssignmentCusParameterValue) {
                        isAssignmentCusParameterValue = true;
                        item.IsAssignmentCusParameterValue = true;
                    }*/
                });
                if (!isAssignmentCusParameterValue) {
                    cusParameterToSaveCodes.push(item.Code);
                }
            });

            if (cusParameterToSaveCodes.length) {
                const requestData = {
                    codes: cusParameterToSaveCodes,
                    ValueTypes: [],
                    PrjProjectFk: this.getProjectId(),
                };

                this.http.post$('estimate/rule/projectestruleparam/value/cusparametervalueassignments', requestData).subscribe(function (response) {
                   //TODO
                    /*each(response.data, function (item) {
                        let groupData = displayDataGroups[item];
                        each(groupData, function (data) {
                            data.isAssignmentCusParameterValue = true;
                        });
                    })*/
                    //TODO
                    //deferred.resolve();
                });
            } else {
                //TODO
                //deferred.resolve();
            }
        } else {
            //TODO
            //deferred.resolve();
        }

        //return deferred.promise;
    }
}
