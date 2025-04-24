/* eslint-disable prefer-const */
import { inject, Injectable } from '@angular/core';
import {
    BasicsExportService,
    BasicsSharedImportEditorType,
    BasicsSharedImportExcelService,
    BasicsSharedImportModel,
    BasicsSharedImportOptions,
    BasicsSharedImportResult,
    ExportOptions
} from '@libs/basics/shared';
import { BoqItemDataService, BoqItemDataServiceBase } from '../boq-main-boq-item-data.service';
import { BoqWizardServiceBase } from './boq-main-wizard.service';
import { forEach } from 'lodash';
import {Dictionary, IInitializationContext} from '@libs/platform/common';
import { BasicsSharedImportField } from '@libs/basics/shared';
import { BoqWizardUuidConstants } from '@libs/boq/interfaces';
import {GridStep, ICustomDialog, IDialogButtonEventInfo, MultistepDialog} from '@libs/ui/common';

export abstract class BoqExcelImportWizardService extends BoqWizardServiceBase {
	public getUuid(): string {
		return BoqWizardUuidConstants.ExcelImportWizardUuid;
	}

	private readonly basicsSharedImportExcelService = inject(BasicsSharedImportExcelService);
	private boqItemDataService!: BoqItemDataServiceBase;

	//TODO-BOQ-Test complete functionality once available from framework - Save, SaveAs, Default All Checkbox selection on Simulate, Refresh after import, Import Result in new tab
	protected async exec(boqItemDataService: BoqItemDataServiceBase, wizardParameters?: Dictionary<string, unknown>) {
		this.boqItemDataService = boqItemDataService;

		this.assertIsNotReadOnly(boqItemDataService).then(response => {
			if (response) {
				if (boqItemDataService.isCrbBoq()) {
					this.messageBoxService.showInfoBox('boq.main.crbDisabledFunc','ico-info', true);
					return;
				} else if (boqItemDataService.isOenBoq()) {
					this.messageBoxService.showInfoBox('boq.main.oenDisabledFunc','ico-info',true);
					return;
				}

				let options = this.getImportOptions();

				if (wizardParameters) {
					const mapData = Object.getOwnPropertyDescriptor(wizardParameters, 'data')?.value;
					const wizardParameter = Object.fromEntries(mapData);
					options.wizardParameter = wizardParameter;
				}

				this.basicsSharedImportExcelService.showImportDialog(options);
			}
		});
	}

	private setRibExcelMappingNames(fields: BasicsSharedImportField[]): void {
		fields.forEach(field => {
			field.MappingName = field['ribFormatMappingName'] as string ?? '';
		});
	}

	private skipFunc = (model: BasicsSharedImportModel) => {
		if ([4, 5, 7].includes(model.ImportFormat)) {
			return true;
		}
		return false;
	};

	private importOptions: BasicsSharedImportOptions & { wizardParameter: unknown } = {
		wizardParameter: {},
		moduleName: 'boq.main',
		fileSelectionPage:{
			excelProfileContexts:[],
         excelProfileChangedFn: (changeInfo)  => {
             if ([4,5,7].includes(changeInfo.newValue as number)) {  // (Planner, Bidder, PES)
					 this.setRibExcelMappingNames(changeInfo.entity.ImportDescriptor.Fields);
             }
         },
		},
		checkDuplicationPage: {   //DoubletFindMethodsPage rename to checkDuplicationPage
			skip: true
		},
		customSettingsPage:{
			skip: true
		},
		fieldMappingsPage: {
			skip: this.skipFunc
		},
		editImportDataPage: {  //EditImportPage rename to editImportDataPage
			skip: this.skipFunc
		},
		previewResultPage: {
			skip: this.skipFunc
		},
		ImportDescriptor : {
			DoubletFindMethods: [
				{
					Selected: false,
					Description:this.translateService.instant('boq.main.DoubletFindMethod0').text
				},  // Id + ParentId
				{
					Selected: true,
					Description: this.translateService.instant('boq.main.DoubletFindMethod1').text,
				}  // ReferenceNo
			],
			Fields: [
                {
                    PropertyName: 'Id',
                    EntityName: 'BoqItem',
                    DisplayName: 'Id', //this.translateService.instant('cloud.common.entityCode').text,
                    DomainName: 'code',
                    Editor: BasicsSharedImportEditorType.none,
                    readonly: true,
                    ribFormatMappingName: 'Id'    // mapping for RibExcelImport format
                },
                {
                    PropertyName: 'ParentId',
                    EntityName: 'BoqItem',
                    DisplayName: 'ParentId',
                    DomainName: 'code',
                    Editor: BasicsSharedImportEditorType.none,
                    readonly: true,
                    ribFormatMappingName: 'ParentId'
                },
                {
                    PropertyName: 'ReferenceNo',
                    EntityName: 'BoqItem',
                    DisplayName: 'ReferenceNo',
                    DomainName: 'description',
                    Editor: BasicsSharedImportEditorType.domain,
                },
                {
                    PropertyName: 'Reference2',
                    EntityName: 'BoqItem',
                    DisplayName: 'Reference2',
                    DomainName: 'description',
                    Editor: BasicsSharedImportEditorType.domain,
                },
                {
                    PropertyName: 'BoQLineType',
                    EntityName: 'BoqItem',
                    DisplayName: 'BoQLineType',
                    DomainName: 'integer',
                    Editor: BasicsSharedImportEditorType.simplelookup,
                    LookupQualifier: 'boq.main.linetype',
                    ribFormatMappingName: 'Line Type'
                },
                {
                    PropertyName: 'OutlineSpecification',
                    EntityName: 'BoqItem',
                    DisplayName: 'OutlineSpecification',
                    DomainName: 'description',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'Outline Spec'
                },
                {
                    PropertyName: 'IsFreeQuantity',
                    EntityName: 'BoqItem',
                    DisplayName: 'IsFreeQuantity',
                    DomainName: 'description',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'Free Quantity',
                },
                {
                    PropertyName: 'Quantity',
                    EntityName: 'BoqItem',
                    DisplayName: 'Quantity',
                    DomainName: 'quantity',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'Quantity'
                },
                {
                    PropertyName: 'QuantityAdj',
                    EntityName: 'BoqItem',
                    DisplayName: 'QuantityAdj',
                    DomainName: 'quantity',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'Quantity'
                },
                {
                    PropertyName: 'UoM',
                    EntityName: 'BoqItem',
                    DisplayName: 'UoM',
                    DomainName: 'integer',
                    Editor: BasicsSharedImportEditorType.simplelookup,
                    LookupQualifier: 'basics.uom',
                    ribFormatMappingName: 'UoM',
                    DisplayMember: 'UOM'
                },
                {
                    PropertyName: 'ItemTypeStandOpt',
                    EntityName: 'BoqItem',
                    DisplayName: 'ItemTypeStandOpt',
                    DomainName: 'integer',
                    Editor: BasicsSharedImportEditorType.simplelookup,
                    LookupQualifier: 'basics.itemtype',
                    DefaultValue: '0',
                    ribFormatMappingName: 'Item Type Stand/Opt'
                },
                {
                    PropertyName: 'ItemTypeBaseAlt',
                    EntityName: 'BoqItem',
                    DisplayName: 'ItemTypeBaseAlt',
                    DomainName: 'integer',
                    Editor: BasicsSharedImportEditorType.simplelookup,
                    LookupQualifier: 'basics.itemtype',
                    ribFormatMappingName: 'Item Type Base/Alt'
                },
                {
                    PropertyName: 'Factor',
                    EntityName: 'BoqItem',
                    DisplayName: 'Factor',
                    DomainName: 'factor',
                    Editor: BasicsSharedImportEditorType.domain,
                },
                {
                    PropertyName: 'UnitRate',
                    EntityName: 'BoqItem',
                    DisplayName: 'UnitRate',
                    DomainName: 'money',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'Unit Rate'
                },
                {
                    PropertyName: 'IsUrb',
                    EntityName: 'BoqItem',
                    DisplayName: 'IsUrb',
                    DomainName: 'description',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'URB',
                },
                {
                    PropertyName: 'Urb1',
                    EntityName: 'BoqItem',
                    DisplayName: 'Urb1',
                    DomainName: 'money',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'URB1'
                },
                {
                    PropertyName: 'Urb2',
                    EntityName: 'BoqItem',
                    DisplayName: 'Urb2',
                    DomainName: 'money',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'URB2'
                },
                {
                    PropertyName: 'Urb3',
                    EntityName: 'BoqItem',
                    DisplayName: 'Urb3',
                    DomainName: 'money',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'URB3'
                },
                {
                    PropertyName: 'Urb4',
                    EntityName: 'BoqItem',
                    DisplayName: 'Urb4',
                    DomainName: 'money',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'URB4'
                },
                {
                    PropertyName: 'Urb5',
                    EntityName: 'BoqItem',
                    DisplayName: 'Urb5',
                    DomainName: 'money',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'URB5'
                },
                {
                    PropertyName: 'Urb6',
                    EntityName: 'BoqItem',
                    DisplayName: 'Urb6',
                    DomainName: 'money',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'URB6'
                },
                {
                    PropertyName: 'ReferenceH1',
                    EntityName: 'BoqItem',
                    DisplayName: 'ReferenceH1',
                    DomainName: 'code',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'H1',
                    Only4RibFormat: true
                },
                {
                    PropertyName: 'ReferenceH2',
                    EntityName: 'BoqItem',
                    DisplayName: 'ReferenceH2',
                    DomainName: 'code',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'H2',
                    Only4RibFormat: true
                },
                {
                    PropertyName: 'ReferenceH3',
                    EntityName: 'BoqItem',
                    DisplayName: 'ReferenceH3',
                    DomainName: 'code',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'H3',
                    Only4RibFormat: true
                },
                {
                    PropertyName: 'ReferenceH4',
                    EntityName: 'BoqItem',
                    DisplayName: 'ReferenceH4',
                    DomainName: 'code',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'H4',
                    Only4RibFormat: true
                },
                {
                    PropertyName: 'ReferenceH5',
                    EntityName: 'BoqItem',
                    DisplayName: 'ReferenceH5',
                    DomainName: 'code',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'H5',
                    Only4RibFormat: true
                },
                {
                    PropertyName: 'ReferenceItem',
                    EntityName: 'BoqItem',
                    DisplayName: 'ReferenceItem',
                    DomainName: 'code',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'Item',
                    Only4RibFormat: true
                },
                {
                    PropertyName: 'ReferenceIx',
                    EntityName: 'BoqItem',
                    DisplayName: 'ReferenceIx',
                    DomainName: 'code',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'Ix',
                    Only4RibFormat: true
                },
                {
                    PropertyName: 'CommentContractor',
                    EntityName: 'BoqItem',
                    DisplayName: 'CommentContractor',
                    DomainName: 'remark',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'Contractor Comment'
                },
                {
                    PropertyName: 'CommentClient',
                    EntityName: 'BoqItem',
                    DisplayName: 'CommentClient',
                    DomainName: 'remark',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'Planner Comment'
                },
                {
                    PropertyName: 'Userdefined1',
                    EntityName: 'BoqItem',
                    DisplayName: 'Userdefined1',
                    DomainName: 'description',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'User-Defined 1'
                },
                {
                    PropertyName: 'Userdefined2',
                    EntityName: 'BoqItem',
                    DisplayName: 'Userdefined2',
                    DomainName: 'description',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'User-Defined 2'
                },
                {
                    PropertyName: 'Userdefined3',
                    EntityName: 'BoqItem',
                    DisplayName: 'Userdefined3',
                    DomainName: 'description',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'User-Defined 3'
                },
                {
                    PropertyName: 'Userdefined4',
                    EntityName: 'BoqItem',
                    DisplayName: 'Userdefined4',
                    DomainName: 'description',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'User-Defined 4'
                },
                {
                    PropertyName: 'Userdefined5',
                    EntityName: 'BoqItem',
                    DisplayName: 'Userdefined5',
                    DomainName: 'description',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'User-Defined 5'
                },
                {
                    PropertyName: 'ExternalCode',
                    EntityName: 'BoqItem',
                    DisplayName: 'ExternalCode',
                    DomainName: 'code',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'External Code'
                },
                {
                    PropertyName: 'DeliveryDate',
                    EntityName: 'BoqItem',
                    DisplayName: 'DeliveryDate',
                    DomainName: 'date',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'Delivery Date'
                },
                {
                    PropertyName: 'Material',
                    EntityName: 'BoqItem',
                    DisplayName: 'Material',
                    DomainName: 'integer',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'Material'
                },
                {
                    PropertyName: 'ProjectCharacteristic',
                    EntityName: 'BoqItem',
                    DisplayName: 'ProjectCharacteristic',
                    DomainName: 'description',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'Project Characteristic'
                },
                {
                    PropertyName: 'WorkContent',
                    EntityName: 'BoqItem',
                    DisplayName: 'WorkContent',
                    DomainName: 'description',
                    Editor: BasicsSharedImportEditorType.domain,
                    ribFormatMappingName: 'Work Content'
                },
                {
                    PropertyName: 'DiscountPercent',
                    EntityName: 'BoqItem',
                    DisplayName: 'DiscountPercent',
                    DomainName: 'percent',
                    Editor: BasicsSharedImportEditorType.domain,
                },
                {
                    PropertyName: 'DiscountPercentIt',
                    EntityName: 'BoqItem',
                    DisplayName: 'DiscountPercentIt',
                    DomainName: 'money',
                    Editor: BasicsSharedImportEditorType.domain,
                },
                {
                    PropertyName: 'Discount',
                    EntityName: 'BoqItem',
                    DisplayName: 'Discount',
                    DomainName: 'money',
                    Editor: BasicsSharedImportEditorType.domain,
                }
			],
			FieldProcessor: (model,oldProfile) => {
				if (oldProfile?.ProfileAccessLevel === undefined) {
					let excelHeaders: { [key: string]: string } = {};
					this.basicsSharedImportExcelService.importHeaderService.getData().forEach((header) => {
						 excelHeaders[header.desc?.toString().toLowerCase()] = header.desc as string;
					});

					forEach(model.ImportDescriptor.Fields, (item) => {
						if (item.PropertyName === 'UnitRate') {
                            const key = Object.keys(excelHeaders).find(key => key.startsWith('unit rate (') && key.endsWith(')'));
                            if (key !== undefined) {
                                item.MappingName = excelHeaders[key];
                            }
						}
						if (item.PropertyName === 'Discount') {
                            const key = Object.keys(excelHeaders).find(key => key.startsWith('discount abs it (') && key.endsWith(')'));
                            if (key !== undefined) {
                                item.MappingName = excelHeaders[key];
                            }
						}
					});
				}
			},
		},
		showInTabAfterImport: true,
		preOpenImportDialogFn: ()  => {
            let selectedBoqHeaderId = this.boqItemDataService.getSelectedBoqHeaderId();
            this.importOptions.ImportDescriptor.MainId = selectedBoqHeaderId || 0;
            return Promise.resolve(true);
		},
		applyImportFn: async (model, info)  =>{
			if(info.dialog.value) {
				if ([4, 5, 7].includes(model.ImportFormat)) { //Bidder, Planner, Pes
					await this.basicsSharedImportExcelService.parseImportFile(info.dialog.value.dataItem, true).then(res => this.handleImportResponse(res, info));
				} else { //Free Excel
					await this.basicsSharedImportExcelService.processImport(info.dialog.value.dataItem, false).then(res => this.handleImportResponse(res, info));
				}
			}
		},
	};

	// Common response handler
	private handleImportResponse = (res: BasicsSharedImportResult, info: IDialogButtonEventInfo<ICustomDialog<MultistepDialog<BasicsSharedImportModel<object>>, object>, void>) => {
		if (res && res.ErrorCounter === 0) {
			info.dialog.close(info.button.id);
			this.boqItemDataService.refreshAll();
		} else {
			if (info.dialog.value) {
				const previewStep = info.dialog.value?.currentStep as GridStep<object>;
				if (Array.isArray(res.ImportObjects)) {
					previewStep.model = res.ImportObjects;
				}
				info.dialog.value.dataItem.importResult = res;
			}
		}
	};

	private getImportOptions() {
		let ExcelProfileContexts: string[] = [];

		if (this.boqItemDataService.getServiceName().includes('Pes')) {
			ExcelProfileContexts.push('BoqPes');
		} else {
			ExcelProfileContexts.push('BoqBidder');
			ExcelProfileContexts.push('BoqPlanner');
		}

		if (this.importOptions.fileSelectionPage !== undefined) {
			this.importOptions.fileSelectionPage.excelProfileContexts = ExcelProfileContexts;
		}

		return this.importOptions;
	}

}

@Injectable({providedIn: 'root'})
export class BoqMainBoqExcelImportWizardService extends BoqExcelImportWizardService {
	public async execute(context: IInitializationContext, wizardParameters?: Dictionary<string, unknown>) {
		await this.exec(context.injector.get(BoqItemDataService), wizardParameters);
	}
}

@Injectable({
	providedIn: 'root'
})
export abstract class BoqExcelExportWizardService extends BoqWizardServiceBase {
	public getUuid(): string {
		return BoqWizardUuidConstants.ExcelExportWizardUuid;
	}

	private readonly basicsExportService = inject(BasicsExportService);
	private boqItemDataService!: BoqItemDataServiceBase;

	protected async exec(boqItemDataService: BoqItemDataServiceBase) {
		this.boqItemDataService = boqItemDataService;
		let options = this.getExportOptions();
		this.basicsExportService.showExportDialog(options);
	}

	//TODO-FWK-DEV-6891: Need to test the visibility of fields(Include Container,Remove special char) once these 2 jira tickets(DEV-13719,DEV-19730) will be completed from framework end. Remaining functionality is completed for excel export
	private exportOptions = {
		moduleName: 'boq.main',
		mainContainer: {id: '1', label: 'boq.main.boqStructure', gridId:'342bf3af97964f5ba24d3e3acc2242dd'},
		subContainers: [],
		permission:'',
		excelProfileContexts:[],
		exportOptionsCallback(ex:ExportOptions){}
	};

	private getExportOptions() {
		this.exportOptions.exportOptionsCallback = (exportOption: ExportOptions) => {
			exportOption.filter = { ...exportOption.filter as object, PKeys: [this.boqItemDataService.getSelectedBoqHeaderId()] };
		};

		let ExcelProfileContexts = [];
		if(this.boqItemDataService.getServiceName().includes('Pes')){
			ExcelProfileContexts.push('BoqPes');
		} else {
			ExcelProfileContexts.push('BoqBidder');
			ExcelProfileContexts.push('BoqPlanner');
			ExcelProfileContexts.push('BoqPlannerPrice');
		}

		(this.exportOptions.excelProfileContexts as string[]) = ExcelProfileContexts;

		return this.exportOptions;
	}
}

@Injectable({providedIn: 'root'})
export class BoqMainBoqExcelExportWizardService extends BoqExcelExportWizardService {
	public async execute(context: IInitializationContext) {
		await this.exec(context.injector.get(BoqItemDataService));
	}
}