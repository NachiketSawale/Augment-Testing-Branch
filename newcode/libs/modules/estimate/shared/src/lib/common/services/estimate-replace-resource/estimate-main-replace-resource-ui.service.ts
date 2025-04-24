/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {createLookup, FieldType, FieldValidationInfo, FormRow, IFormConfig} from '@libs/ui/common';
import {EstimateMainWizardContextService} from '../estimate-main-wizard-context.service';
import {EstimateMainResourceForm} from '../../enums/estimate-main-resource-form.enum';
import {ProcurementPackageLookupService} from '@libs/procurement/shared';
import {EstimateMainBeReplaceType} from '../../enums/estimate-main-be-replace-type.enum';
import {
    EstimateMainReplaceFunctionType,
    EstimateReplaceResource,
    IEstLineItemEntity,
    IEstResourceEntity
} from '@libs/estimate/interfaces';
import {EstimateResourceBaseDataService} from '../../../line-item/services/estimate-resource-base-date.service';
import {LineItemBaseComplete} from '../../../line-item/model/estimate-line-item-base-complete.class';
import {ResourceBaseComplete} from '../../../line-item/model/estmate-resource-base-complete.class';
import {EstimateMainResourceType} from '../../enums/estimate-main-resource-type.enum';
import {cloneDeep, isNull} from 'lodash';
import {PlatformTranslateService} from '@libs/platform/common';
import {ValidationResult} from '@libs/platform/data-access';
import {EstimateMainReplaceResourceCommonService} from './estimate-main-replace-resource-common.service';
import {
    EstimateSharedReplaceResourceFieldsComponent
} from './estimate-main-replace-resource-fields/estimate-shared-replace-resource-fields.component';
import {BasicsSharedMaterialLookupService} from '@libs/basics/shared';
import {EstimateShareCostCodesLookupService} from '../../../lookups/estimate-share-cost-codes-lookup.service';

// TODO: Will be done in the future
@Injectable({
    providedIn: 'root'
})
export class EstimateMainReplaceResourceUiService {
    private readonly estimateMainWizardContextService = inject(EstimateMainWizardContextService);
    private readonly estimateMainReplaceResourceCommonService = inject(EstimateMainReplaceResourceCommonService);
    private readonly translateService = inject(PlatformTranslateService);

    private resourceDataService: EstimateResourceBaseDataService<IEstResourceEntity, ResourceBaseComplete, IEstLineItemEntity, LineItemBaseComplete> | null = null;
    private lgmJobId: number | null = null;

    private ESTIMATE_SCOPE = {
        ALL_ESTIMATE: {
            value: 0,
            label: 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.allEstimate',
        },
        RESULT_SET: {
            value: 1,
            label: 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.resultSet',
        },
        RESULT_HIGHLIGHTED: {
            value: 2,
            label: 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.Highlighted',
        },
    };

    // ignore job
    private ignoreJob: FormRow<EstimateReplaceResource> = {
        groupId: 'g21',
        id: 'ignorejob',
        model: 'IgnoreJob',
        label: {text: 'Ignore Current Element Job', key: 'estimate.main.replaceResourceWizard.ignorejob'},
        sortOrder: 5,
        type: FieldType.Boolean
    };

    public getLgmJobId() {
        return this.lgmJobId;
    }

    public setLgmJobId(currentLgmJobId: number | null) {
        this.lgmJobId = currentLgmJobId;
    }

    public setResourceDataService(dataService: EstimateResourceBaseDataService<IEstResourceEntity, ResourceBaseComplete, IEstLineItemEntity, LineItemBaseComplete> | null) {
        this.resourceDataService = dataService;
    }

    /**
     * getReplacementFormUIConfig
     */
    public getReplacementFormConfig(_reload: boolean | null,
                                    resourceType: number | null,
                                    estimateMainOrAssemblyResourceService: EstimateResourceBaseDataService<IEstResourceEntity, ResourceBaseComplete, IEstLineItemEntity, LineItemBaseComplete> | null,
                                    estimateLineItems: IEstLineItemEntity[] | null): IFormConfig<EstimateReplaceResource> {
        const isEstAssemblyResource = this.estimateMainWizardContextService.getConfig() === EstimateMainResourceForm.EstimateAssemblyResource;
        const formConfiguration: IFormConfig<EstimateReplaceResource> = {
            formId: 'estimate.main.replaceResourceWizard.replaceform',
            showGrouping: true,
            groups: [
                {
                    groupId: 'g21',
                    open: true,
                    header: {text: 'Select Replacement Element', key: 'estimate.main.replaceResourceWizard.group1Name'},
                    visible: true
                },
                {
                    groupId: 'g22',
                    open: true,
                    header: {
                        text: 'Replaced Value Configuration',
                        key: 'estimate.main.replaceResourceWizard.group2Name'
                    },
                    visible: true
                }
            ],
            rows: [
                {
                    // TODO: grid
                    groupId: 'g22',
                    id: 'replacedfields',
                    model: 'replacedFields',
                    type: FieldType.CustomComponent,
                    componentType: EstimateSharedReplaceResourceFieldsComponent,
                    label: {
                        text: 'Resource Configure Details',
                        key: 'estimate.main.replaceResourceWizard.replaceDetailsGrid'
                    },
                    readonly: false,
                    visible: true
                },
                {
                    groupId: 'g21',
                    id: 'functionType',
                    model: 'FunctionTypeFk',
                    type: FieldType.Lookup,
                    label: {
                        text: 'Function Type',
                        key: 'estimate.main.replaceResourceWizard.functionType'
                    },
                    // TODO: onSelectedItemChanged and lookup
                    lookupOptions: createLookup({
                        dataServiceToken: ProcurementPackageLookupService,
                        showDescription: true,
                        descriptionMember: 'Description',
                        // events: [{
                        //     name: 'onSelectedItemChanged',
                        //     handler: (e: ILookupEvent<>) => {
                        //         if (args.selectedItem) {
                        //             if (args.entity) {
                        //                 // clear the current element value
                        //                 args.entity.ToBeReplacedFk = null;
                        //                 args.entity.ToBeReplacedElement = null;
                        //
                        //                 args.entity.BeReplacedWithFk = null;
                        //                 args.entity.BeReplacedWithElement = null;
                        //
                        //             }
                        //             // update the form view
                        //             estimateMainReplaceResourceCommonService.setSelectedToBeReplaceFk(null);
                        //             estimateMainReplaceResourceCommonService.onFormConfigUpdated.fire(args.selectedItem, args.entity.ResourceTypeId);
                        //             estimateMainReplaceResourceCommonService.onBroadcastConfigUpdated.fire();
                        //         }
                        //     }
                        // }]
                    }),
                    required: true,
                    readonly: false,
                    visible: true,
                    sortOrder: 2
                },
            ]
        };

        // TODO:
        // let costCodeLookupDirective = isEstAssemblyResource ? 'estimate-main-assembly-cost-codes-lookup': 'estimate-main-project-cost-codes-lookup';
        // let materialLookupDirective = isEstAssemblyResource ? 'estimate-assemblies-material-lookup': 'estimate-main-material-lookup';

        const originalRows: FormRow<EstimateReplaceResource>[] = [
            // CostCode
            {
                groupId: 'g21',
                id: 'mdccostcodefk',
                model: 'CostCodeFk',
                type: FieldType.Lookup,
                visible: true,
                required: true,
                lookupOptions: createLookup({
                    // TODO: lookup
                    dataServiceToken: EstimateShareCostCodesLookupService, // the dataServiceToken is not right
                    showDescription: true,
                    descriptionMember: isEstAssemblyResource ? 'DescriptionInfo.Translated' : 'Description',
                    showClearButton: true,
                    disableDataCaching: false
                })
            },
            // Material
            {
                groupId: 'g21',
                id: 'materialfk',
                model: 'MaterialFk',
                type: FieldType.Lookup,
                visible: true,
                required: true,
                lookupOptions: createLookup({
                    // TODO: lookup
                    dataServiceToken: BasicsSharedMaterialLookupService,
                    showDescription: true,
                    descriptionMember: 'DescriptionInfo.Translated',
                    showClearButton: true,
                    events: []
                })
            },
            // Assembly
            {
                groupId: 'g21',
                id: 'estassemblyfk',
                model: 'EstAssemblyFk',
                type: FieldType.Lookup,
                visible: true,
                required: true,
                lookupOptions: createLookup({
                    // TODO: lookup
                    dataServiceToken: ProcurementPackageLookupService, // the dataServiceToken is not right
                    showDescription: true,
                    descriptionMember: 'DescriptionInfo.Translated',
                    showClearButton: true,
                    events: [],
                    // TODO:
                    // lookupOptions: {
                    //     filterAssemblyKey:'estimate-main-resources-prj-assembly-priority-filter'
                    // }
                })
            },
            // Equipment Assembly
            {
                groupId: 'g21',
                id: 'estassemblyfk',
                model: 'EstAssemblyFk',
                type: FieldType.Lookup,
                visible: true,
                required: true,
                lookupOptions: createLookup({
                    // TODO: lookup
                    dataServiceToken: ProcurementPackageLookupService, // the dataServiceToken is not right
                    showDescription: true,
                    descriptionMember: 'DescriptionInfo.Translated',
                    showClearButton: true,
                    events: []
                })
            }
        ];

        let isToBeReplacedElementCostCode = false;
        let isToBeReplacedElementMaterial = false;
        let isBeReplacedElementAssembly = false;
        let isBeReplacedElementEquipmentAssembly = false;
        // filter the rows with selectFunction
        let selectedFunction = this.estimateMainReplaceResourceCommonService.getSelectedFunction();
        let replaceType = EstimateMainBeReplaceType.costCode;

        const estimateResourceService = this.resourceDataService || estimateMainOrAssemblyResourceService;
        if (!isNull(selectedFunction) && selectedFunction.Id) {
            let firstRowIndex = 0;
            let secondRowIndex = 0;

            const selectedResourceItem = estimateResourceService?.getSelectedEntity();
            if (selectedResourceItem) {
                if (selectedResourceItem.EstResourceTypeFk === EstimateMainResourceType.Material && !_reload) {
                    // default will be materail type
                    this.estimateMainReplaceResourceCommonService.setSelectedFunction({Id: EstimateMainReplaceFunctionType.ReplaceMaterial});
                    selectedFunction = this.estimateMainReplaceResourceCommonService.getSelectedFunction();
                }

                if ((selectedResourceItem.EstResourceTypeFk === EstimateMainResourceType.Assembly || (selectedResourceItem.EstResourceTypeFk === EstimateMainResourceType.SubItem && selectedResourceItem.EstAssemblyFk)) && !_reload) {
                    // default will be materail type
                    this.estimateMainReplaceResourceCommonService.setSelectedFunction({Id: EstimateMainReplaceFunctionType.ReplaceAssembly});
                    selectedFunction = this.estimateMainReplaceResourceCommonService.getSelectedFunction();
                }

                if (selectedResourceItem.EstResourceTypeFk === EstimateMainResourceType.Plant && !_reload) {
                    // default will be materail type
                    this.estimateMainReplaceResourceCommonService.setSelectedFunction({Id: EstimateMainReplaceFunctionType.ReplaceEquipmentAssemblyByEquipmentAssembly});
                    selectedFunction = this.estimateMainReplaceResourceCommonService.getSelectedFunction();
                }
            }

            if (!isNull(selectedFunction)) {
                const selectedFunctionId = selectedFunction.Id;
                switch (selectedFunctionId) {
                    case EstimateMainReplaceFunctionType.ReplaceCostCode: // Replace CostCode
                        firstRowIndex = secondRowIndex = 0;
                        isToBeReplacedElementCostCode = true;
                        replaceType = EstimateMainBeReplaceType.costCode;
                        break;
                    case EstimateMainReplaceFunctionType.ReplaceCostCodeByMaterial: // Replace CostCode By Material
                        secondRowIndex = 1;
                        isToBeReplacedElementMaterial = true;
                        replaceType = EstimateMainBeReplaceType.costCode;
                        break;
                    case EstimateMainReplaceFunctionType.ReplaceCostCodeByAssembly: // Replace CostCode By Assembly
                        secondRowIndex = 2;
                        // isToBeReplacedElementCostCode = true;
                        replaceType = EstimateMainBeReplaceType.costCode;
                        break;
                    case EstimateMainReplaceFunctionType.ReplaceMaterial: // Replace Material
                        firstRowIndex = secondRowIndex = 1;
                        replaceType = EstimateMainBeReplaceType.material;
                        isToBeReplacedElementMaterial = true;
                        break;
                    case EstimateMainReplaceFunctionType.ReplaceMaterialByCostCode: // Replace Material By CostCode
                        firstRowIndex = 1;
                        secondRowIndex = 0;
                        isToBeReplacedElementCostCode = true;
                        replaceType = EstimateMainBeReplaceType.material;
                        break;
                    case EstimateMainReplaceFunctionType.ReplaceMaterialByAssembly: // Replace Material By Assembly
                        firstRowIndex = 1;
                        secondRowIndex = 2;
                        replaceType = EstimateMainBeReplaceType.material;
                        break;
                    case EstimateMainReplaceFunctionType.ReplaceAssembly: // replace Assembly by assembly
                        firstRowIndex = secondRowIndex = 2;
                        isBeReplacedElementAssembly = true;
                        replaceType = EstimateMainBeReplaceType.assembly;
                        break;
                    case EstimateMainReplaceFunctionType.ReplaceEquipmentAssemblyByEquipmentAssembly:
                        firstRowIndex = secondRowIndex = 3;
                        isBeReplacedElementEquipmentAssembly = true;
                        replaceType = EstimateMainBeReplaceType.equipmentAssembly;
                        break;
                    case EstimateMainReplaceFunctionType.RemoveResource: // remove resource
                        firstRowIndex = 0;
                        secondRowIndex = 0;
                        replaceType = EstimateMainBeReplaceType.costCode;
                        switch (resourceType) {
                            case EstimateMainReplaceFunctionType.Material: {
                                replaceType = EstimateMainBeReplaceType.material;
                                firstRowIndex = 1;
                                break;
                            }
                            case EstimateMainReplaceFunctionType.Assembly: {
                                replaceType = EstimateMainBeReplaceType.assembly;
                                isBeReplacedElementAssembly = true;
                                firstRowIndex = 2;
                                break;
                            }
                            case EstimateMainReplaceFunctionType.EquipmentAssembly: {
                                replaceType = EstimateMainBeReplaceType.equipmentAssembly;
                                isBeReplacedElementEquipmentAssembly = true;
                                firstRowIndex = 3;
                                break;
                            }
                        }
                        break;
                    default:
                        break;
                }
            }

            // set the default current element
            this.setDefaultElementAndJob(selectedResourceItem, replaceType);

            const firstRow: FormRow<EstimateReplaceResource> = cloneDeep(originalRows[firstRowIndex]);
            if (isBeReplacedElementAssembly) {
                // TODO:
                // firstRow.options.lookupDirective = 'estimate-main-resource-assembly-lookup';
            }
            if (isBeReplacedElementEquipmentAssembly) {
                // TODO:
                // firstRow.options.lookupOptions.filterPlantAssemblyKey = 'plant-assembly-filter-by-estimate';
            }
            formConfiguration.rows.push(firstRow);

            if (selectedFunction && selectedFunction.Id !== EstimateMainReplaceFunctionType.RemoveResource) {
                if (isToBeReplacedElementCostCode) {
                    const rowIn: FormRow<EstimateReplaceResource> = cloneDeep(originalRows[secondRowIndex]);
                    // TODO:
                    // rowIn.options.lookupDirective = 'estimate-main-cost-codes-lookup';
                    // rowIn.options.descriptionMember = 'DescriptionInfo.Translated';
                    formConfiguration.rows.push(rowIn);
                } else {
                    formConfiguration.rows.push(cloneDeep(originalRows[secondRowIndex]));
                }
            }

            const itemsInGroup1 = formConfiguration.rows.filter((row) => {
                return row.groupId === 'g21';
            });
            let itemIndex = 0;
            itemsInGroup1.forEach((item) => {
                if (itemIndex === 1) {
                    item.model = 'ToBeReplacedFk';
                    item.sortOrder = 10;
                    item.label = {text: 'Current Element', key: 'estimate.main.replaceResourceWizard.currentElement'};
                    // TODO:
                    // if (item.options.lookupOptions && item.options.lookupOptions.events) {
                    //     item.options.lookupOptions.events.push(angular.copy(lookupOptionEvents[0]));
                    //     if (replaceType === estimateMainBeReplaceType.material) {
                    //         item.options.lookupOptions.filterKey = 'estimate-main-material-project-lookup-filter';
                    //     }
                    // }
                } else if (itemIndex === 2) {
                    item.id = 'beReplacedWithFk';
                    item.model = 'BeReplacedWithFk';
                    item.sortOrder = 20;
                    item.label = {
                        text: 'Replaced With Element',
                        key: 'estimate.main.replaceResourceWizard.replacedElement'
                    };
                    if (isToBeReplacedElementMaterial) {
                        // TODO:
                        // if (item.options.lookupOptions && item.options.lookupOptions.events) {
                        //     item.options.lookupOptions.events.push(angular.copy(lookupOptionEvents[1]));
                        //     if(isToBeReplacedElementMaterial) {
                        //         item.options.lookupOptions.filterKey = 'estimate-main-replace-material-lookup-filter';
                        //     }
                        // }
                    }
                }
                itemIndex++;
            });
        }

        // set the selection 'select estiamte scope'
        if (this.estimateMainWizardContextService.getConfig() === EstimateMainResourceForm.EstimateMainResource) {
            formConfiguration.rows.push(this.getHighlightScopeFormRow(estimateLineItems));
        }
        formConfiguration.rows.push(this.getResultSetScopeFormRow());
        formConfiguration.rows.push(this.getAllEstimateScopeFormRow());

        if (!isEstAssemblyResource) {

            formConfiguration.rows.push(this.ignoreJob);

            const sourceJobFk: FormRow<EstimateReplaceResource> = {
                groupId: 'g21',
                id: 'lgmjobfk',
                model: 'SourceJobFk',
                label: {text: 'Current Element Job', key: 'estimate.main.replaceResourceWizard.currentJob'},
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    // TODO: wait estimate-main-current-element-job-lookup-service
                    dataServiceToken: ProcurementPackageLookupService, // the dataServiceToken is not right
                    showDescription: true,
                    disableDataCaching: false,
                    descriptionMember: 'DescriptionInfo.Translated',
                    showClearButton: true,
                    events: []
                }),
                required: replaceType === EstimateMainBeReplaceType.costCode,
                readonly: true,
                sortOrder: 11
            };

            formConfiguration.rows.push(sourceJobFk);

            // TODO: estimate-main-current-element-job-lookup-service
            // if (isToBeReplacedElementCostCode && !isNull(selectedFunction) && selectedFunction.Id !== 141) {
            //     formConfiguration.rows.push(targetJob('estimateMainReplaceElementJobService', true));
            // } else if (isToBeReplacedElementMaterial) {
            //     formConfiguration.rows.push(targetMaterialJob('estimateMainReplaceElementJobService', true));
            // }
        }

        // function selection lookup
        const sourceTypeRow: FormRow<EstimateReplaceResource> = {
            groupId: 'g21',
            id: 'sourceType',
            label: {text: 'Resource Type', key: 'estimate.main.replaceResourceWizard.resourceType'},
            type: FieldType.Select,
            model: 'ResourceTypeId',
            itemsSource: {
                items: [
                    {id: 11, displayName: this.translateService.instant('estimate.main.mdcCostCodeFk').text},
                    {id: 12, displayName: this.translateService.instant('estimate.main.mdcMaterialFk').text},
                    {id: 13, displayName: this.translateService.instant('estimate.main.assembly').text},
                    {id: 15, displayName: this.translateService.instant('estimate.main.equipmentAssembly').text},
                ],
            },
            readonly: false,
            required: true,
            visible: !isNull(selectedFunction) && selectedFunction.Id === EstimateMainReplaceFunctionType.RemoveResource,
            sortOrder: 2,
            validator: (info: FieldValidationInfo<EstimateReplaceResource>) =>{
                this.estimateMainReplaceResourceCommonService.setSelectedToBeReplaceFk(null);
                return new ValidationResult();
                // TODO:
                // this.estimateMainReplaceResourceCommonService.onFormConfigUpdated.fire({Id: 141}, value);
                // this.estimateMainReplaceResourceCommonService.onBroadcastConfigUpdated.fire();
            }
        };

        formConfiguration.rows.push(sourceTypeRow);
        if(formConfiguration.groups){
            formConfiguration.groups[1].visible = !isNull(selectedFunction) && selectedFunction.Id !== EstimateMainReplaceFunctionType.RemoveResource;
        }

        return formConfiguration;
    }

    private setDefaultElementAndJob(selectedResourceItem: IEstResourceEntity | null | undefined, replaceType: number) {
        // TODO: wait estimateMainLookupService, estimateMainPlantAssemblyDialogService and Redesign the value retrieval method in the future
        // this.estimateMainReplaceResourceCommonService.setDefaultType(replaceType);
        // if (selectedResourceItem) {
        //     let toBeReplacedFk: number | null =
        //         (replaceType === EstimateMainBeReplaceType.costCode && selectedResourceItem.EstResourceTypeFk === EstimateMainResourceType.CostCode) ? selectedResourceItem.MdcCostCodeFk :
        //             (replaceType === EstimateMainBeReplaceType.material && selectedResourceItem.EstResourceTypeFk === EstimateMainResourceType.Material) ? selectedResourceItem.MdcMaterialFk :
        //                 (replaceType === EstimateMainBeReplaceType.assembly && (selectedResourceItem.EstResourceTypeFk === EstimateMainResourceType.Assembly || selectedResourceItem.EstAssemblyFk)) ? selectedResourceItem.Id : null;
        //
        //     const currentJobId = this.lgmJobId; // should set lgmJobId when open replace wizard, or null
        //     if (replaceType === EstimateMainBeReplaceType.costCode) {
        //         if (this.estimateMainWizardContextService.getConfig() === EstimateMainResourceForm.EstimateAssemblyResource) {
        //             const copyResourceItem = cloneDeep(selectedResourceItem);
        //             if(toBeReplacedFk){
        //                 copyResourceItem.Id = toBeReplacedFk;
        //             }
        //             this.estimateMainReplaceResourceCommonService.setDefaultCurrentElement(toBeReplacedFk, copyResourceItem);
        //         } else {
        //             // find out the id of the project cost code by job and mdcCostCodeFk
        //             let prjCostCodes = $injector.get('estimateMainLookupService').getEstCostCodesSyn();
        //             let findPrjCostCode = prjCostCodes.find((item) => {
        //                 return (item.MdcCostCodeFk === toBeReplacedFk || item.Code === selectedResourceItem.Code);
        //             });
        //             this.estimateMainReplaceResourceCommonService.setDefaulteCurrentElementJob(currentJobId);
        //             if (findPrjCostCode) {
        //                 this.estimateMainReplaceResourceCommonService.setDefaultCurrentElement(findPrjCostCode.Id, findPrjCostCode);
        //             }else{
        //                 this.estimateMainReplaceResourceCommonService.setDefaultCurrentElement(null, null);
        //             }
        //         }
        //     } else if(replaceType === EstimateMainBeReplaceType.material) {
        //         if (this.estimateMainWizardContextService.getConfig() === EstimateMainResourceForm.EstimateAssemblyResource) {
        //             this.estimateMainReplaceResourceCommonService.setDefaultCurrentElement(toBeReplacedFk, null);
        //         } else {
        //             let prjMaterials = $injector.get('estimateMainPrjMaterialLookupService').getPrjMaterialSyn();
        //             let findprjMaterial = _.find(prjMaterials, function (item) {
        //                 return item.MdcMaterialFk === toBeReplacedFk && item.LgmJobFk === currentJobId;
        //             });
        //             this.estimateMainReplaceResourceCommonService.setDefaulteCurrentElementJob(currentJobId);
        //             this.estimateMainReplaceResourceCommonService.setDefaultCurrentElement(toBeReplacedFk, findprjMaterial);
        //         }
        //     } else if(replaceType === EstimateMainBeReplaceType.assembly){
        //         if (this.estimateMainWizardContextService.getConfig() === EstimateMainResourceForm.EstimateAssemblyResource) {
        //             let estimateMainResAssemblyLookupSer = $injector.get('estimateMainResourceAssemblyLookupService');
        //             let assemblies = estimateMainResAssemblyLookupSer.getList();
        //             let findAssemble = _.find(assemblies, function (item) {
        //                 return item.Code === selectedResourceItem.Code;
        //             });
        //             this.estimateMainReplaceResourceCommonService.setDefaultCurrentElement(findAssemble.Id, findAssemble);
        //             estimateMainResAssemblyLookupSer.setCurrentCode(selectedResourceItem.Code);
        //         } else {
        //             let estimateMainResAssemblyLookupSer = $injector.get('estimateMainResourceAssemblyLookupService');
        //             let assemblies = estimateMainResAssemblyLookupSer.getList();
        //             let findAssemble = _.find(assemblies, function (item) {
        //                 return item.Code === selectedResourceItem.Code && item.LgmJobFk === (selectedResourceItem.LgmJobFk || currentJobId);
        //             });
        //             if(findAssemble){
        //                 // find the source job in this case(material)
        //                 this.estimateMainReplaceResourceCommonService.setDefaulteCurrentElementJob(currentJobId);
        //                 this.estimateMainReplaceResourceCommonService.setDefaultCurrentElement(findAssemble.Id, findAssemble);
        //                 estimateMainResAssemblyLookupSer.setCurrentCode(selectedResourceItem.Code);
        //             }else{
        //                 this.estimateMainReplaceResourceCommonService.setDefaulteCurrentElementJob(null);
        //                 this.estimateMainReplaceResourceCommonService.setDefaultCurrentElement(null, null);
        //             }
        //
        //         }
        //     }
        //     // else if(replaceType === EstimateMainBeReplaceType.equipmentAssembly){
        //     //     let estimateMainPlantAssemblyDialogService = $injector.get('estimateMainPlantAssemblyDialogService');
        //     //     let findAssemble = estimateMainPlantAssemblyDialogService.getAssemblyById(selectedResourceItem.EstAssemblyFk);
        //     //
        //     //     if(findAssemble){
        //     //         // find the source job in this case(material)
        //     //         this.estimateMainReplaceResourceCommonService.setDefaulteCurrentElementJob(currentJobId);
        //     //         this.estimateMainReplaceResourceCommonService.setDefaultCurrentElement(findAssemble.Id, findAssemble);
        //     //         // estimateMainResAssemblyLookupSer.setCurrentCode(selectedResourceItem.Code);
        //     //     }else{
        //     //         this.estimateMainReplaceResourceCommonService.setDefaulteCurrentElementJob(null);
        //     //         this.estimateMainReplaceResourceCommonService.setDefaultCurrentElement(null, null);
        //     //     }
        //     // }
        // } else {
        //     this.estimateMainReplaceResourceCommonService.setDefaultCurrentElement(0, null);
        //     this.estimateMainReplaceResourceCommonService.setDefaulteCurrentElementJob(0);
        // }
    }

    private getHighlightScopeFormRow(estimateLineItems: IEstLineItemEntity[] | null) {
        const resultRow: FormRow<EstimateReplaceResource> = {
            groupId: 'g21',
            id: 'selectScope',
            model: 'estimateScope',
            type: FieldType.Radio,
            label: {
                text: 'Select Estimate Scope',
                key: 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.label'
            },
            itemsSource: {
                items: [{
                    id: this.ESTIMATE_SCOPE.RESULT_HIGHLIGHTED.value,
                    displayName: {text: 'Highlighted Line Item', key: this.ESTIMATE_SCOPE.RESULT_HIGHLIGHTED.label}
                }]
            },
            sortOrder: 1
        };
        resultRow.readonly = !(!isNull(estimateLineItems) && estimateLineItems.length > 0);
        return resultRow;
    }

    private getResultSetScopeFormRow(): FormRow<EstimateReplaceResource> {
        return {
            groupId: 'g21',
            id: 'currentScope',
            model: 'estimateScope',
            type: FieldType.Radio,
            itemsSource: {
                items: [{
                    id: this.ESTIMATE_SCOPE.RESULT_SET.value,
                    displayName: {text: 'Current Result set', key: this.ESTIMATE_SCOPE.RESULT_SET.label}
                }]
            },
            sortOrder: 1
        };
    }

    private getAllEstimateScopeFormRow(): FormRow<EstimateReplaceResource> {
        // TODO: wait getCurrentModuleName function
        // let mainViewService = $injector.get('mainViewService');
        // let currentModuleName = mainViewService.getCurrentModuleName();
        //
        // let sourceScopeAllLabel$tr$ = '';
        //
        // if (currentModuleName === moduleName){ // Estimate
        //     sourceScopeAllLabel$tr$ = ESTIMATE_SCOPE.ALL_ESTIMATE.label;
        // }else if (currentModuleName === 'estimate.assemblies'){
        //     sourceScopeAllLabel$tr$ = 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.allAssembly';
        // }

        return {
            groupId: 'g21',
            id: 'allScope',
            model: 'estimateScope',
            type: FieldType.Radio,
            itemsSource: {
                items: [{
                    id: this.ESTIMATE_SCOPE.ALL_ESTIMATE.value,
                    displayName: {text: 'All Estimate', key: this.ESTIMATE_SCOPE.ALL_ESTIMATE.label}
                }]
            },
            sortOrder: 1
        };
    }
}