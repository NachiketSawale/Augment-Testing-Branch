/*
 * Copyright(c) RIB Software GmbH
 */

import {
    FieldType,
    ILookupContext,
    UiCommonLookupTypeDataService,
    createLookup,
    IGridConfiguration,
    UiCommonLookupBtn,
    LookupContext,
    UiCommonLookupViewService,
    UiCommonLookupInputComponent
} from '@libs/ui/common';
import {inject, Injectable} from '@angular/core';

//import { EstimateParameterColumnConfigCommonService } from './estimate-parameter-column-config-common-service';
//import { EstimateParamComplexLookupCommonService } from './estimate-parameter-complex-lookup-common.service';
import {EstimateParamComplexLookupDataService} from './estimate-parameter-complex-lookup-data.service';

import {PlatformTranslateService, ServiceLocator} from '@libs/platform/common';
import {IEstimateParameter} from '../../../model/estimate-parameter.interface';

@Injectable({
    providedIn: 'root'
})

/**
 * lookup to show assigned estimate parameters in different estimation structures with two different dropdown popup
 */
export class EstimateParamComplexLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IEstimateParameter,TEntity> {

    //private columns: ColumnDef<IEstimateParameter>[] ;
    public configuration!: IGridConfiguration<IEstimateParameter>;
    public readonly translate = inject(PlatformTranslateService);
    protected readonly estimateParamComplexLookupDataService = inject(EstimateParamComplexLookupDataService);

    /**
     * The constructor
     */
    public constructor() {
        const dialogBtn = new UiCommonLookupBtn('', '', (context?: ILookupContext<IEstimateParameter, IEstimateParameter>) => {
            this.onOpenPopupClicked(context);
        },function () {
            return true;
        });
        dialogBtn.css = {
            class:'control-icons ico-input-add'
        };
       // dialogBtn.caption =  this.translate.instant('estimate.parameter.addParamHint');
        //dialogBtn.image = this.configService.clientUrl + 'cloud.style/content/images/control-icons.svg#ico-input-add';
        super('estimateParamComplexLookup', {
            uuid: 'E0CE6EAA77BB4DE988A3279A19333220',
            idProperty: 'Id',
            valueMember: 'Code',
            displayMember: 'Code',
            showCustomInputContent: true,
            //formatter: EstimateParamComplexLookupCommonService.displayFormatter,
            disableDataCaching: true,
            gridConfig: {
                columns: [
                    {
                        id: 'code',
                        model: 'Code',
                        type: FieldType.Code,
                        label: {
                            text: 'Code',
                            key: 'cloud.common.entityCode'
                        },
                        visible: true,
                        sortable: false,
                        width: 70,
                        readonly: true
                    },
                    {
                        id: 'desc',
                        model: 'DescriptionInfo.Translated',
                        type: FieldType.Translation,
                        label: {
                            text: 'Description',
                            key: 'cloud.common.entityDescription'
                        },
                        visible: true,
                        sortable: false,
                        width: 100,
                        readonly: true
                    },
                    {
                        id: 'sourceId',
                        type: FieldType.Lookup,
                        lookupOptions: createLookup({//TODO
                            //'estimate-main-param-source-lookup'
                            // dataServiceToken: estimateMainParamSourceLookupDataService
                        }),
                        required: false,
                        readonly: false,
                        visible: true,
                        sortable: false,
                        width: 500
                    }
                ],
                skipPermissionCheck: true
            },
            showDialog: true,
            events: [
                {
                    name: 'onSelectedItemChanged',
                    handler: function (e) {
                        // let scope = this;
                        // clear all items
                        const className= (e.originalEvent?.target as Element).className;
                        if(className.indexOf('ico-input-delete') !== -1){
                           // let platformDeleteSelectionDialogService = $injector.get('platformDeleteSelectionDialogService');
                          //  platformDeleteSelectionDialogService.showDialog({dontShowAgain : true, id: 'e0ce6eaa77bb4de988a3279a19333220',headerText$tr$:'estimate.parameter.deleteParamHint'}).then(result => {
                              //  if (result.yes || result.ok) {
                                   // EstimateParamComplexLookupCommonService.clearAllItems(args, scope);
                               // }
                           // });
                        } else {
                            //args.selectedItem.ValueType = args.selectedItem.ParamvaluetypeFk ? args.selectedItem.ParamvaluetypeFk : args.selectedItem.ValueType;
                           // EstimateParamComplexLookupCommonService.onSelectionChange(args, scope);
                        }
                    }
                },
                {
                    name: 'onInputGroupClick',
                    handler: function (e) {
                        const className = (e.originalEvent?.target as Element).className;
                        if (className.indexOf('ico-parameter') === -1 && className.indexOf('ico-menu') === -1) {
                            return;
                        }

                        // if this has been setted readonly,
                       //if(this.readonly){
                       //     return;
                       // }
                       //EstimateParamComplexLookupCommonService.openPopup(e, this);
                    }
                }
            ],
            buttons: [dialogBtn], /// the second button,  dialog button
        });
    }

    /**
     *  click the dialog button callback
     * @param context
     * @private
     */
    private onOpenPopupClicked(context?: ILookupContext<IEstimateParameter, IEstimateParameter>) {
        const lookUpContext = context as LookupContext<IEstimateParameter, IEstimateParameter>;
        if (lookUpContext) {
            const lookupInput = lookUpContext.lookupInput as UiCommonLookupInputComponent<IEstimateParameter, IEstimateParameter, number>;
            const lookUpViewService = ServiceLocator.injector.get(UiCommonLookupViewService);
            if (lookupInput) {
                lookUpViewService.openPopup(lookupInput.input,lookUpContext, lookupInput.config,false);
                //{
                    //if (e.closingButtonId === StandardDialogButtonId.Ok && e.value && e.value.apply) {
                        //lookupInput.apply(e.value.result!); ///todo apply dialog value to grid is not ready in framework,will back once ready

                        // call callBack to handle multiple selections
                       /* const res = e.value as ICharacteristicCodeLookupViewResult<IEstimateParameter>;
                        if(res.multipleSelectionExceptFirstHandle && res.multipleSelectionIdsExceptFirst.length > 0) {
                            res.multipleSelectionExceptFirstHandle(res.multipleSelectionIdsExceptFirst);
                        }*/
                   // }

                //});
            }
        }
    }

    /*public override getList(options, scope) : Observable<IEstimateParameter[]> {
        let mainItemName : string = null;
        if(scope.$parent && scope.$parent.$parent && scope.$parent.$parent.config ){
            mainItemName = scope.$parent.$parent.config.formatterOptions.itemName;
            if(scope.$parent.$parent.config.formatterOptions.realDataService ==='estimateAssembliesService'){
                mainItemName = 'AssembliesEstLineItems';
            }
        }else if(scope.$parent &&scope.$parent.options){
            mainItemName = scope.$parent.options.itemName;
        }
        this.estimateParamComplexLookupDataService.clearCacheData(mainItemName);

        return new Observable(observer => {
            this.estimateParamComplexLookupDataService.getListAsync(mainItemName,scope.entity, this.cache).subscribe(list => {});
            });
    }*/

   /* public override getItemByKey (value, options, scope) {
        let mainItemName = null;
        if(scope.$parent && scope.$parent.$parent && scope.$parent.$parent.config && scope.$parent.$parent.config.formatterOptions){
            mainItemName = scope.$parent.$parent.config.formatterOptions.itemName;
            if(scope.$parent.$parent.config.formatterOptions.realDataService ==='estimateAssembliesService'){
                mainItemName = 'AssembliesEstLineItems';
            }
        }else if(scope.$parent &&scope.$parent.options){
            mainItemName = scope.$parent.options.itemName;
        }
        return this.estimateParamComplexLookupDataService.getItemByIdAsync(value,mainItemName,scope.entity);
    }

    public  getDisplayItem (value) {
        return this.estimateParamComplexLookupDataService.getItemByIdAsync(value);
    }*/
}