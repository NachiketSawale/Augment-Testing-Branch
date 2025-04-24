import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
    createLookup,
    FieldType, FormRow,
    IEditorDialogResult, IFieldValueChangeInfo,
    IFormConfig,
    StandardDialogButtonId,
    UiCommonFormDialogService, UiCommonMessageBoxService
} from '@libs/ui/common';
import {PlatformConfigurationService, PlatformTranslateService, PropertyPath} from '@libs/platform/common';
import {CreatePackagesWizardMap} from '../model/interfaces/controlling-general-contractor-cost-header-map.interface';
import {
    BasicsShareControllingUnitLookupService, BasicsSharedProcurementConfigurationLookupService,
    BasicsSharedProcurementStructureLookupService
} from '@libs/basics/shared';
import {ProjectSharedLookupService} from '@libs/project/shared';
import {ProcurementPackageLookupService} from '@libs/procurement/shared';
import {
    ControllingGeneralContractorCostHeaderDataService
} from '../services/controlling-general-contractor-cost-header-data.service';
import {EntityRuntimeData} from '@libs/platform/data-access';

@Injectable({
    providedIn: 'root'
})
export class ControllingGeneralContractorCreatePackagesWizardDialogService{


    private http = inject(HttpClient);
    public formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
    private readonly configService = inject(PlatformConfigurationService);
    public parentService: ControllingGeneralContractorCostHeaderDataService = inject(ControllingGeneralContractorCostHeaderDataService);
    private readonly messageBoxService = inject(UiCommonMessageBoxService);
    private formEntityRuntimeData: EntityRuntimeData<CreatePackagesWizardMap> = new EntityRuntimeData<CreatePackagesWizardMap>();
    private readonly translate = inject(PlatformTranslateService);

    private defaultItem: CreatePackagesWizardMap = {
        GenerateType: '1',
        PrjProjectFk: null,
        StructureFk: null,
        ConfigurationFk: null,
        PrcPackageFk: null,
        Code:'Is generated',
        Description: null,
        Budget:0,
        MdcControllingUnitFk:null,
        Remark:'',
        Remark2:'',
        Remark3:''
    };


    public async onStartWizard() {
       const  parent = this.parentService.getSelectedEntity();
        if(!parent){
            this.messageBoxService.showMsgBox('controlling.generalcontractor.NoCostControlSelected', 'cloud.common.informationDialogHeader', 'ico-info', 'message', false);
            return;
        }else {
            this.defaultItem.PrjProjectFk = parent?.PrjProjectFk;
            this.defaultItem.MdcControllingUnitFk = Math.abs(parent?.Id);
            this.defaultItem.GenerateType = '1';

            this.updateReadonly('1',this.prepareFormConfig,this.defaultItem);

            const result = await this.formDialogService
                .showDialog<CreatePackagesWizardMap>({
                    id: 'CreatePackagesStructureWizard',
                    headerText: 'controlling.generalcontractor.CreatePackagesStructureWizard',
                    formConfiguration: this.prepareFormConfig,
                    runtime: undefined,
                    customButtons: [],
                    topDescription: '',
                    entity: this.defaultItem,
                })
                ?.then((result) => {
                    if (result?.closingButtonId === StandardDialogButtonId.Ok) {
                        this.handleOk(result);
                    }
                });

            return result;
        }
    }



    private updateEntityRuntimeData<TR extends object>(entityRuntimeData: EntityRuntimeData<TR>, formConfig: IFormConfig<TR>) {
        formConfig.rows.forEach((row: FormRow<TR>) => {
            const field = entityRuntimeData.readOnlyFields.find(r => r.field === row.model);
            if (field) {
                field.readOnly = row.readonly as boolean;
            } else {
                entityRuntimeData.readOnlyFields.push({
                    field: row.model as PropertyPath<TR>,
                    readOnly: row.readonly as boolean
                });
            }
        });
    }

    private updateReadonly(generateType: string,formConfig: IFormConfig<CreatePackagesWizardMap>,entity:CreatePackagesWizardMap) {

        const generateType1ReadOnly: string[] = ['PrcPackageFk', 'Code'];
        const generateType2ReadOnly: string[] = ['Code', 'Description','ConfigurationFk'];
        formConfig.rows.forEach(row => {
            if (generateType === '1' && !(row.model ==='PrjProjectFk' || row.model ==='MdcControllingUnitFk' )) {
                entity.Code ='Is generated';
                row.readonly = generateType1ReadOnly.some(field => field === row.model);
            } else if(!(row.model ==='PrjProjectFk' || row.model ==='MdcControllingUnitFk' )){
                row.readonly = generateType2ReadOnly.some(field => field === row.model);
                entity.Code ='';
            }
        });

        entity.ConfigurationFk =null;
        entity.Description =null;

        entity.PrcPackageFk =null;
        entity.StructureFk = null;

        this.updateEntityRuntimeData(this.formEntityRuntimeData, formConfig);
    }

    public prepareFormConfig: IFormConfig<CreatePackagesWizardMap> ={
        formId: 'controlling.generalcontractor.CreatePackagesStructureWizard',
        showGrouping: false,
        rows: [
            {
                id: 'radio',
                label: 'controlling.generalcontractor.GenerateType',
                type: FieldType.Radio,
                model: 'GenerateType',
                itemsSource: {
                    items: [
                        {
                            id: '1',
                            displayName: 'controlling.generalcontractor.Create',
                        },
                        {
                            id: '2',
                            displayName: 'controlling.generalcontractor.Update',
                        }
                    ],
                },
                change: (changeInfo: IFieldValueChangeInfo<CreatePackagesWizardMap>)=> {
                    const generateType = changeInfo.newValue as string;
                    const entity:CreatePackagesWizardMap  = changeInfo.entity as CreatePackagesWizardMap;
                    this.updateReadonly(generateType,this.prepareFormConfig,entity);
                },
                sortOrder: 1,
            },

            {
                id: 'MdcControllingUnitFk',
                label: {
                    key: 'controlling.generalcontractor.ControllingUnitFk',
                },
                type: FieldType.Lookup,
                readonly:true,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsShareControllingUnitLookupService,
                    showClearButton: true,
                    showDescription: true,
                    descriptionMember: 'DescriptionInfo.Translated'

                }),
                model: 'MdcControllingUnitFk',
                sortOrder: 2
            },
            {
                id: 'PrjProjectFk',
                label: {
                    key: 'controlling.generalcontractor.entityProjectName',
                },
                readonly:true,
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: ProjectSharedLookupService,
                    showDescription: true,
                    descriptionMember: 'ProjectNo',
                }),
                model: 'PrjProjectFk',
                sortOrder:3,
            },
            {
                id: 'PrcPackageFk',
                label: {
                    key: 'controlling.generalcontractor.prcPackageFk',
                },
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: ProcurementPackageLookupService,
                    showDescription: true,
                    descriptionMember: 'Description',
                    selectableCallback:(item,context) => {
                        const entity =context?.entity as CreatePackagesWizardMap;
                        if(entity) {
                            entity.ConfigurationFk = item.PrcPackageConfigurationFk;
                            entity.StructureFk = item.StructureFk;
                        }
                        return true;
                    },
                    serverSideFilter: {
                        key: '',
                        execute(context) {
                            const entity = context?.entity as CreatePackagesWizardMap;
                            return {
                                ProjectFk: entity?.PrjProjectFk
                            };
                        },
                    },
                }),
                model: 'PrcPackageFk',
                sortOrder: 4
            },
            {
                id: 'code',
                model: 'Code',
                type: FieldType.Code,
                label: { text: 'Code', key: 'cloud.common.entityCode' },
                sortOrder: 5
            },
            {
                id: 'description',
                model: 'Description',
                type: FieldType.Translation,
                label: { text: 'Description', key: 'cloud.common.entityDescription' },
                sortOrder: 6
            },
            {
                id: 'StructureFk',
                label: {
                    key: 'controlling.generalcontractor.entityPrcStructureFk',
                },
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsSharedProcurementStructureLookupService,
                    showClearButton: true
                }),
                model: 'StructureFk',
                sortOrder: 7,
                required:true
            },
            {
                id: 'ConfigurationFk',  //TO DO validateDialogConfigurationFk to get the budgetKindInfo
                label: {
                    key: 'controlling.generalcontractor.entityConfiguration',
                },
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsSharedProcurementConfigurationLookupService,
                    displayMember: 'DescriptionInfo.Translated',
                    showClearButton: true
                }),
                model: 'ConfigurationFk',
                sortOrder: 8
            },
            {
                id: 'Budget',
                model: 'Budget',
                type: FieldType.Decimal,
                label: { text: 'Budget', key: 'controlling.generalcontractor.Budget' },
                sortOrder: 9
            },
            {
                id: 'Remark',
                model: 'Remark',
                type: FieldType.Remark,
                label: { text: 'Remark', key: 'controlling.generalcontractor.Remark' },
                sortOrder: 10
            },
            {
                id: 'Remark2',
                model: 'Remark2',
                type: FieldType.Remark,
                label: { text: 'Remark2', key: 'controlling.generalcontractor.Remark2' },
                sortOrder: 11
            },{
                id: 'Remark3',
                model: 'Remark3',
                type: FieldType.Remark,
                label: { text: 'Remark3', key: 'controlling.generalcontractor.Remark3' },
                sortOrder: 12
            }

        ]
    };

    private handleOk(payload: IEditorDialogResult<CreatePackagesWizardMap>): void {
        const param = payload.value;
        this.http.post(this.configService.webApiBaseUrl + 'procurement/package/package/createOrUpdatePackageByGccWizard', param).subscribe((response) => {

            const data = response as CreatePackagesWizardMap;
            const bodyText = this.translate.instant('controlling.generalcontractor.CreatePackageWizardResult',{'packageCode': data.Code}).text;

            this.messageBoxService.showMsgBox(bodyText, 'cloud.common.informationDialogHeader', 'ico-info', 'message', false);
        });
    }



    public defaultvalue<Tvalue>(): Tvalue {
        return this.defaultItem as Tvalue;
    }

}