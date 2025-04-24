import { inject, Injectable } from '@angular/core';
import { createLookup, FieldType, IDialogErrorInfo, IEditorDialogResult, IFormConfig, IGridConfiguration, StandardDialogButtonId, UiCommonFormDialogService, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IDescriptionInfo, IIdentificationData, IInitializationContext, PlatformHttpService } from '@libs/platform/common';
import { BoqItemDataServiceBase } from '../boq-main-boq-item-data.service';
import { BoqWizardServiceBase } from './boq-main-wizard.service';
import { BoqItemDataService } from '../boq-main-boq-item-data.service';
import { BoqWizardUuidConstants, IBoqItemEntity } from '@libs/boq/interfaces';
import { BoqMainBoqTypes } from '../../model/boq-main-boq-constants';
import { BoqRuleComplexLookupService } from '../rule/boq-main-rule-complex-lookup.service';

export class BoqUpdateData {
	public BoqHeaderId?: number;
	public ExchangeRate!: number;
	public HeaderId!: number;
	public IsBaseOnCorrectedUPGross!: boolean;
	public IsReCalculateBoqPriceconditions?: boolean;
	public Module!: string;
	public ProjectId?: number | null;
}

export class GenerateWicNumberData {
	public BasBlobsSpecificationFk?: boolean | null;
	public BasUomFk?: boolean | null;
	public BoqHeaderId?: number | null;
	public BoqLineTypeFk?: number | null;
	public CompareNumberUpTo?: number | null;
	public ComparisonProperty?: number | null;
	public CopyDocument?: boolean | null;
	public CopyPricecondition?: boolean | null;
	public DivisionTypeAssignment?: boolean | null;
	public FromBoqItemId?: number | null;
	public GeneratePreLineItems?: boolean | null;
	public IdenticalOutlineSpecification?: boolean | null;
	public IgnoreIndex?: boolean | null;
	public IsOverWrite?: boolean | null;
	public OutSpecification?: boolean | null;
	public Parameter?: boolean | null;
	public PrcStructureFk?: boolean | null;
	public PrjCharacterFk?: boolean | null;
	public ProjectId?: number | null;
	public Reference2?: boolean | null;
	public ReplaceOption?: boolean | null;
	public Rule?: boolean | null;
	public SameUnitOfMeasure?: boolean | null;
	public TextComplementsFk?: boolean | null;
	public TextConfigurationFk?: boolean | null;
	public ToBoqItemId?: number | null;
	public Userdefined1?: boolean | null;
	public Userdefined2?: boolean | null;
	public Userdefined3?: boolean | null;
	public Userdefined4?: boolean | null;
	public Userdefined5?: boolean | null;
	public WicBoqHeaderId?: number | null;
	public WicBoqItemId?: number | null;
	public WicGroupId?: number | null;
	public WorkContent?: boolean | null;
}

export class WizardResult{
	public IsSuccess!:boolean | null;
	public TotalRecordsCount!: number | null;
	public ChangedRecordsCount!: number | null;
	public UnchangedRecordsCount!:number | null;
	public Message!:IDialogErrorInfo | undefined;
	public ChangedRecords!:  [] | null;
	public UnChangedRecords!: IBoqItemEntity[] | null;
}

@Injectable({
	providedIn: 'root'
})
export abstract class BoqUpdateDataFromWicWizardService extends BoqWizardServiceBase {
	private formDialogService : UiCommonFormDialogService = inject(UiCommonFormDialogService);
	private boqItemDataService!: BoqItemDataServiceBase;
	private updateDataFromWic! : GenerateWicNumberData;
	private boqMainUpdateDataFromWicDataService: BoqMainUpdateDataFromWicDataService = inject(BoqMainUpdateDataFromWicDataService);
	private readonly boqMainWizardResultDialogService: BoqMainWizardResultDialogService = inject(BoqMainWizardResultDialogService);
	private boqMainProjectBoqItemLookupDataService : BoqMainProjectBoqItemLookupDataService<object>;

	public constructor() {
		super();
		this.boqMainProjectBoqItemLookupDataService = inject(BoqMainProjectBoqItemLookupDataService);
	}

	public getUuid(): string {
		return BoqWizardUuidConstants.UpdateDataFromWicWizardUuid;
	}

	protected async exec(boqItemDataService: BoqItemDataServiceBase) {
		this.boqItemDataService = boqItemDataService;
		this.updateDataFromWic = new GenerateWicNumberData();
		if (boqItemDataService.getSelectedBoqHeaderId()) {
			this.updateDataFromWic.BoqHeaderId = boqItemDataService.getSelectedBoqHeaderId();
		}

		if (boqItemDataService.getSelectedEntity()) {
			this.updateDataFromWic.FromBoqItemId = boqItemDataService.getSelectedEntity()?.Id;
			this.updateDataFromWic.ToBoqItemId = boqItemDataService.getSelectedEntity()?.Id;
		} else if (boqItemDataService.getRootBoqItem()) {
			const rootBoqItem = boqItemDataService.getRootBoqItem();
			this.updateDataFromWic.FromBoqItemId = rootBoqItem.Id;
			this.updateDataFromWic.ToBoqItemId = rootBoqItem.Id;
		}
		this.updateDataFromWic.IsOverWrite = true;
		this.assertIsNotReadOnly(boqItemDataService).then(response => {
			if (response) {
				if (boqItemDataService.getRootBoqItem()) {
				if (boqItemDataService.getRootBoqItem().IsWicItem) {
					this.messageBoxService.showErrorDialog('boq.main.canNotUpdateDataWicBoQ');
				} else
					if (boqItemDataService.isCrbBoq()) {
						this.messageBoxService.showInfoBox('boq.main.crbDisabledFunc', 'ico-info', true);
					} else if (boqItemDataService.isOenBoq()) {
						this.messageBoxService.showInfoBox('boq.main.oenDisabledFunc', 'ico-info', true);
						return;
					} else {
						this.openBoqUpdateFromWicDialog();
					}
				}
			}
		});
	}

	public async openBoqUpdateFromWicDialog() {
		await this.formDialogService.showDialog<GenerateWicNumberData>({
			id: 'boqUpdateFromWic',
			headerText:'boq.main.boqUpdateFromWic.incomplete',
			formConfiguration: this.boqUpdateFromWicFormConfig,
			entity: this.updateDataFromWic,
			runtime: undefined,
			customButtons: [],
			topDescription: '',
			width: '1200px',
			maxHeight: 'max'
		})?.then(result => {
			if (result?.closingButtonId === StandardDialogButtonId.Ok) {
					this.handleOkBtn(result);
			} else {
				this.handleCancel(result.value);
			}
		});
	}
	/**
	 * Method handles 'Ok' button functionality.
	 */
	private handleOkBtn(result: IEditorDialogResult<GenerateWicNumberData>) {
		if(result){
			this.updateDataFrmWic(result);
		}
	}

	private handleCancel(result?: GenerateWicNumberData | undefined) {
		console.log(result);
	}

	public updateDataFrmWic(data: IEditorDialogResult<GenerateWicNumberData>){
		data.value!.ProjectId = this.boqItemDataService.getSelectedProjectId();
		return this.http.post$<WizardResult>('boq/main/UpdateDataFromWicBoqItem', data.value).subscribe((response: WizardResult) => {
			const result = response;
				if (result) {
					if (result.IsSuccess) {
						if (result.ChangedRecords) {
							result.ChangedRecords.forEach( (boqItem: IBoqItemEntity) => {
								//replacement of 'syncItemsAfterUpdate' , 'getChildServices' , 'localData.loadSpecificationById' functions from the BoqItemDataService
								this.boqItemDataService.load({} as IIdentificationData);
							});
						}
						if( result.TotalRecordsCount !==null && result.ChangedRecordsCount !==null){
							this.boqMainWizardResultDialogService.wizardResult = {
								TotalRecordsCount: result.TotalRecordsCount,
								ChangedRecordsCount: result.ChangedRecordsCount,
								UnchangedRecordsCount: result.TotalRecordsCount - result.ChangedRecordsCount,
								ChangedRecords: result.ChangedRecords,
								UnChangedRecords: result.UnChangedRecords,
								IsSuccess: result.IsSuccess,
								Message: result.Message
							};
							return this.boqMainWizardResultDialogService.openWizardResultDialog();
						} else {
                           return;
						}
					} else {
						return this.messageBoxService.showErrorDialog(result.Message as IDialogErrorInfo);
					}
				} else {
					return;
				}
			}, function () {
				console.log('generatewicnumber failure');
		});
	}

	/**
	 * Demo first form configuration data.
	 */
	private boqUpdateFromWicFormConfig: IFormConfig<GenerateWicNumberData> = {
		formId: 'boqUpdateFromWic',
		showGrouping: true,
		groups: [
			{
				groupId: 'target',
				header: 'boq.main.target',
				open: true
			},
			{
				groupId: 'basicData',
				header: 'boq.main.BasicData',
				open: true
			},
			{
				groupId: 'characteristicNContent',
				header: 'boq.main.CharacteristicNContent',
				open: true
			},
			{
				groupId: 'userDefinedTexts',
				header: 'boq.main.userDefinedTexts',
				open: true
			},

			{
				groupId: 'specificationTexts',
				header: 'boq.main.SpecificationTexts',
				open: true
			},
			{
				groupId: 'copyRuleParameter',
				header: 'boq.main.CopyRuleParameter',
				open: true
			},
		],
		rows: [
			{
				groupId: 'target',
				id:'FromBoqItemId',
				label: 'boq.main.fromRN',
				type: FieldType.Lookup,
				model:'FromBoqItemId',
				lookupOptions: createLookup({
					dataServiceToken: BoqMainProjectBoqItemLookupDataService
				})
			},
			{
				groupId: 'target',
				id:'ToBoqItemId',
				label: 'boq.main.toRN',
				type: FieldType.Lookup,
				model:'ToBoqItemId',
				lookupOptions: createLookup({
					dataServiceToken: BoqMainProjectBoqItemLookupDataService
				})
			},
			{
				groupId: 'basicData',
				id: 'generatePredefineLineItems',
				label: 'boq.main.GeneratePredefineLineItems',
				type: FieldType.Boolean,
				model: 'GeneratePreLineItems',
				readonly:true
			},
			{
				groupId: 'basicData',
				id: 'basicData',
				label: 'boq.main.OutSpecification',
				type: FieldType.Boolean,
				model: 'OutSpecification',
			},
			{
				groupId: 'basicData',
				id: 'BasUomFk',
				label: 'boq.main.BasUomFk',
				type: FieldType.Boolean,
				model: 'BasUomFk',
			},
			{
				groupId: 'basicData',
				id: 'Reference2',
				label: 'boq.main.Reference2',
				type: FieldType.Boolean,
				model: 'Reference2',
			},
			{
				groupId: 'basicData',
				id: 'PrcStructureFk',
				label: 'boq.main.PrcStructureFk',
				type: FieldType.Boolean,
				model: 'PrcStructureFk',
			},
			{
				groupId: 'basicData',
				id: 'CopyPricecondition',
				label: 'boq.main.CopyPricecondition',
				type: FieldType.Boolean,
				model: 'CopyPricecondition',
			},
			{
				groupId: 'basicData',
				id: 'CopyDocument',
				label: 'boq.main.CopyDocument',
				type: FieldType.Boolean,
				model: 'CopyDocument',
			},
			{
				groupId: 'characteristicNContent',
				id: 'WorkContent',
				label: 'boq.main.WorkContent',
				type: FieldType.Boolean,
				model: 'WorkContent',
			},
			{
				groupId: 'characteristicNContent',
				id: 'PrjCharacterFk',
				label: 'boq.main.PrjCharacter',
				type: FieldType.Boolean,
				model: 'PrjCharacterFk',
			},
			{
				groupId: 'characteristicNContent',
				id: 'TextConfigurationFk',
				label: 'boq.main.TextConfiguration',
				type: FieldType.Boolean,
				model: 'TextConfigurationFk',
			},
			{
				groupId: 'userDefinedTexts',
				id: 'Userdefined1',
				label: 'boq.main.Userdefined1',
				type: FieldType.Boolean,
				model: 'Userdefined1',
			},
			{
				groupId: 'userDefinedTexts',
				id: 'Userdefined2',
				label: 'boq.main.Userdefined2',
				type: FieldType.Boolean,
				model: 'Userdefined2',
			},
			{
				groupId: 'userDefinedTexts',
				id: 'Userdefined3',
				label: 'boq.main.Userdefined3',
				type: FieldType.Boolean,
				model: 'Userdefined3',
			},
			{
				groupId: 'userDefinedTexts',
				id: 'Userdefined4',
				label: 'boq.main.Userdefined4',
				type: FieldType.Boolean,
				model: 'Userdefined4',
			},
			{
				groupId: 'userDefinedTexts',
				id: 'Userdefined5',
				label: 'boq.main.Userdefined5',
				type: FieldType.Boolean,
				model: 'Userdefined5',
			},
			{
				groupId: 'specificationTexts',
				id: 'BasBlobsSpecificationFk',
				label: 'boq.main.BasBlobsSpecificationFk',
				type: FieldType.Boolean,
				model: 'BasBlobsSpecificationFk',
			},
			{
				groupId: 'specificationTexts',
				id: 'TextComplementsFk',
				label: 'boq.main.TextComplements',
				type: FieldType.Boolean,
				model: 'TextComplementsFk',
			},
			{
				groupId: 'copyRuleParameter',
				id: 'Rule',
				label: 'boq.main.Rule',
				type: FieldType.Boolean,
				model: 'Rule',
			},
			{
				groupId: 'copyRuleParameter',
				id: 'Parameter',
				label: 'boq.main.Parameter',
				type: FieldType.Boolean,
				model: 'Parameter',
			},
			{
				groupId: 'copyRuleParameter',
				id: 'DivisionTypeAssignment',
				label: 'boq.main.DivisionTypeAssignment',
				type: FieldType.Boolean,
				model: 'DivisionTypeAssignment',
			}
		],

	};
}

@Injectable({
	providedIn: 'root'
})
export class BoqMainUpdateDataFromWicDataService {
	private http: PlatformHttpService = inject(PlatformHttpService);

	public validatiePrjBoqItemAssigedWic(data : GenerateWicNumberData | undefined) {
		return this.http.post('boq/main/ValidatiePrjBoqItemAssigedWic', data);
	}
}

@Injectable({providedIn: 'root'})
export class BoqMainUpdateDataFromWicWizardService extends BoqUpdateDataFromWicWizardService {
	public async execute(context: IInitializationContext) {
		await this.exec(context.injector.get(BoqItemDataService));
	}
}

@Injectable({
	providedIn: 'root'
})
export abstract class BoqGenerateWicNumberWizardService extends BoqWizardServiceBase{
	private formDialogService : UiCommonFormDialogService;
	private readonly boqMainWizardResultDialogService: BoqMainWizardResultDialogService;
	private boqItemDataService!: BoqItemDataServiceBase;
	public generateWicNumberData!:GenerateWicNumberData;
	public constructor() {
		super();
		this.formDialogService = inject(UiCommonFormDialogService);
		this.boqMainWizardResultDialogService = inject(BoqMainWizardResultDialogService);

	}
	public getUuid(): string {
		return BoqWizardUuidConstants.GenerateWicNumberWizardUuid;
	}

	protected async exec(boqItemDataService: BoqItemDataServiceBase) {
		this.boqItemDataService = boqItemDataService;
		this.generateWicNumberData = new GenerateWicNumberData();
		if (boqItemDataService.getSelectedBoqHeaderId()) {
			this.generateWicNumberData.BoqHeaderId =  boqItemDataService.getSelectedBoqHeaderId();
		}

		if (boqItemDataService.getSelectedEntity()) {
			this.generateWicNumberData.FromBoqItemId =  boqItemDataService.getSelectedEntity()?.Id;
			this.generateWicNumberData.ToBoqItemId =  boqItemDataService.getSelectedEntity()?.Id;
			this.generateWicNumberData.BoqHeaderId =  boqItemDataService.getSelectedEntity()?.BoqHeaderFk;
		} else if (boqItemDataService.getRootBoqItem()) {
			const rootBoqItem = boqItemDataService.getRootBoqItem();
			this.generateWicNumberData.FromBoqItemId = rootBoqItem.Id;
			this.generateWicNumberData.ToBoqItemId = rootBoqItem.Id;
		}
		this.assertIsNotReadOnly(boqItemDataService).then(response => {
			if (response) {
				if (boqItemDataService.getRootBoqItem()) {
					if (boqItemDataService.getRootBoqItem().IsWicItem) {
						this.messageBoxService.showErrorDialog('boq.main.canNotGenerateWicNumberInWicBoQ');
					} else
						if (boqItemDataService.isCrbBoq()) {
					this.messageBoxService.showInfoBox('boq.main.crbDisabledFunc', 'info', true);
					} else if (boqItemDataService.isOenBoq()) {
					this.messageBoxService.showInfoBox('boq.main.oenDisabledFunc', 'ico-info', true);
					return;
					} else {
						this.openBoqGenerateWicNumberDialog();
					}
				}
			}
		});
	}

	public async openBoqGenerateWicNumberDialog() {
		await this.formDialogService.showDialog<GenerateWicNumberData>({
			id: 'generateWicNumber',
			headerText:'boq.main.generateWicProperties.incomplete',
			formConfiguration: this.boqGenarateWicNumberFormConfig,
			entity: this.generateWicNumberData,
			runtime: undefined,
			customButtons: [],
			topDescription: '',
			width: '1200px',
			maxHeight: 'max'
		})?.then(result => {
			if (result?.closingButtonId === StandardDialogButtonId.Ok) {
				this.handleOk(result);
			} else {
				this.handleCancel(result);
			}
		});
	}

	/**
	 * Method handles 'Ok' button functionality.
	 */
	private handleOk(result: IEditorDialogResult<GenerateWicNumberData>) {
		if(result){
			this.generateWicNumber(result);
		}
	}

	public generateWicNumber(data: IEditorDialogResult<GenerateWicNumberData>){
		data.value!.ProjectId = this.boqItemDataService.getSelectedProjectId();
		return this.http.post$<WizardResult>('boq/main/generatewicnumber', data.value).subscribe((response: WizardResult) => {
		const result = response;
		if (result) {
			if (result.IsSuccess) {
				if (result.ChangedRecords) {
					result.ChangedRecords.forEach( (boqItem: IBoqItemEntity) => {
						//load() is replacement of 'syncItemsAfterUpdate' , 'getChildServices' , 'localData.loadSpecificationById' functions from the BoqItemDataService
						this.boqItemDataService.load({} as IIdentificationData);
					});
				}
				if( result.TotalRecordsCount !==null && result.ChangedRecordsCount !==null){
					this.boqMainWizardResultDialogService.wizardResult = {
						TotalRecordsCount: result.TotalRecordsCount,
						ChangedRecordsCount: result.ChangedRecordsCount,
						UnchangedRecordsCount: result.TotalRecordsCount - result.ChangedRecordsCount,
						ChangedRecords: result.ChangedRecords,
						UnChangedRecords: result.UnChangedRecords,
						IsSuccess: result.IsSuccess,
						Message: result.Message
					};
					return this.boqMainWizardResultDialogService.openWizardResultDialog();
				} else {
                   return;
				}
			} else {
				return this.messageBoxService.showErrorDialog(result.Message as IDialogErrorInfo); //this.translateService.instant('boq.main.generateWicNumber')
			}
		} else {
         return;
		}
	}, function () {
		console.log('generatewicnumber failure');
	});
}

	/**
	 * Method handles 'Cancel' button functionality.
	 */
	private handleCancel(result?: IEditorDialogResult<GenerateWicNumberData>): void {
		console.log(result);
	}

	/**
	 * Demo first form configuration data.
	 */
	private boqGenarateWicNumberFormConfig: IFormConfig<GenerateWicNumberData> = {
		formId: 'generateWicNumber',
		showGrouping: true,
		groups: [

			{
				groupId: '1',
				header: 'boq.main.source',
				open: true
			},
			{
				groupId: '2',
				header: 'boq.main.target',
				open: true
			},
			{
				groupId: '3',
				header: 'boq.main.comparisonOn',
				open: true
			},
			{
				groupId: '4',
				header:'boq.main.generate',
				open: true
			},
			{
				groupId: 'basicData',
				header: 'boq.main.BasicData',
				open: true
			},
			{
				groupId: 'characteristicNContent',
				header: 'boq.main.CharacteristicNContent',
				open: true
			},
			{
				groupId: 'userDefinedTexts',
				header: 'boq.main.userDefinedTexts',
				open: true
			},
			{
				groupId: 'specificationTexts',
				header: 'boq.main.SpecificationTexts',
				open: true
			},
			{
				groupId: 'copyRuleParameter',
				header: 'boq.main.CopyRuleParameter',
				open: true
			},
		],
		rows: [
			{
				groupId: '1',
				id:'WicGroupId',
				label: 'boq.main.WicGroup',
				type: FieldType.Lookup,
				required: true,
				model:'WicGroupId',
				lookupOptions: createLookup({
					dataServiceToken: BoqWicGroupLookupService,
				})
			},
			{
				groupId: '1',
				id:'WicBoqItemId',
				label: 'boq.main.wicBoq',
				type: FieldType.Lookup,
				required: true,
				model:'WicBoqItemId',
				lookupOptions: createLookup({
					dataServiceToken: BoqHeaderLookupDataService,
					events: [
						{
							name: 'onSelectedItemChanged',
							handler: function (e) {
								const selectedItem = e.context.lookupInput?.selectedItem;
								if( e.context.entity && selectedItem) {
									e.context.entity.WicBoqHeaderId = selectedItem.BoqHeaderFk;
									console.log('e.context.entity.WicBoqHeaderId',e.context.entity.WicBoqHeaderId);
								}
							}
						}
					],
				})
			},
			{
				groupId: '2',
				id:'FromBoqItemId',
				label: 'boq.main.fromRN',
				type: FieldType.Lookup,
				model:'FromBoqItemId',
				lookupOptions: createLookup({
					dataServiceToken: BoqMainProjectBoqItemLookupDataService
				}),
				//TODO-FWK: tree options will be added.
			},
			{
				groupId: '2',
				id:'ToBoqItemId',
				label: 'boq.main.toRN',
				type: FieldType.Lookup,
				model:'ToBoqItemId',
				lookupOptions: createLookup({
					dataServiceToken: BoqMainProjectBoqItemLookupDataService
				})
			},
			{
				groupId: '3',
				id:'ComparisonProperty',
				label: 'boq.main.comparisonType',
				type: FieldType.Radio,
				itemsSource: {
					items: [
						{
							id: 1,
							displayName:  'boq.main.Reference'
						},
						{
							id: 2,
							displayName: 'boq.main.Reference2'
						},
						{
							id: 3,
							displayName: 'boq.main.Stlno'
						}
					],
				},
				model:'ComparisonProperty',
			},
			{
				groupId: '3',
				id:'boqLineTypeFk',
				label: 'boq.main.boqLineTypeFk',
				type: FieldType.Lookup,
				model:'BoqLineTypeFk',
				lookupOptions: createLookup({
					dataServiceToken: BoqMainStructureDetailLookupDataService
				}),
			},
			{
				groupId: '3',
				id: 'IgnoreIndex',
				label: 'boq.main.ignoreIndex',
				type: FieldType.Boolean,
				model: 'IgnoreIndex'
			},
			{
				groupId: '3',
				id: 'CompareNumberUpTo',
				label: 'boq.main.compareNumberUpTo',
				type: FieldType.Integer,
				model: 'CompareNumberUpTo',
			},
			{
				groupId: '3',
				id: 'IdenticalOutlineSpecification',
				label: 'boq.main.identicalOutlineSpecification',
				type: FieldType.Boolean,
				model: 'IdenticalOutlineSpecification',
			},
			{
				groupId: '3',
				id: 'SameUnitOfMeasure',
				label: 'boq.main.sameUnitOfMeasure',
				type: FieldType.Boolean,
				model: 'SameUnitOfMeasure',
			},
			{
				groupId: '4',
				id: 'replace',
				label: 'boq.main.replace',
				type: FieldType.Boolean,
				model: 'ReplaceOption',
			},
			{
				groupId: '4',
				id: 'generatePredefineLineItems',
				label: 'boq.main.GeneratePredefineLineItems',
				type: FieldType.Boolean,
				model: 'GeneratePreLineItems',
			},
			{
				groupId: 'basicData',
				id: 'basicData',
				label: 'boq.main.OutSpecification',
				type: FieldType.Boolean,
				model: 'OutSpecification',
			},
			{
				groupId: 'basicData',
				id: 'BasUomFk',
				label: 'boq.main.BasUomFk',
				type: FieldType.Boolean,
				model: 'BasUomFk',
			},
			{
				groupId: 'basicData',
				id: 'Reference2',
				label: 'boq.main.Reference2',
				type: FieldType.Boolean,
				model: 'Reference2',
			},
			{
				groupId: 'basicData',
				id: 'PrcStructureFk',
				label: 'boq.main.PrcStructureFk',
				type: FieldType.Boolean,
				model: 'PrcStructureFk',
			},
			{
				groupId: 'basicData',
				id: 'CopyPricecondition',
				label: 'boq.main.CopyPricecondition',
				type: FieldType.Boolean,
				model: 'CopyPricecondition',
			},
			{
				groupId: 'basicData',
				id: 'CopyDocument',
				label: 'boq.main.CopyDocument',
				type: FieldType.Boolean,
				model: 'CopyDocument',
			},
			{
				groupId: 'characteristicNContent',
				id: 'WorkContent',
				label: 'boq.main.WorkContent',
				type: FieldType.Boolean,
				model: 'WorkContent',
			},
			{
				groupId: 'characteristicNContent',
				id: 'PrjCharacterFk',
				label: 'boq.main.PrjCharacter',
				type: FieldType.Boolean,
				model: 'PrjCharacterFk',
			},
			{
				groupId: 'characteristicNContent',
				id: 'TextConfigurationFk',
				label: 'boq.main.TextConfiguration',
				type: FieldType.Boolean,
				model: 'TextConfigurationFk',
			},
			{
				groupId: 'userDefinedTexts',
				id: 'Userdefined1',
				label: 'boq.main.Userdefined1',
				type: FieldType.Boolean,
				model: 'Userdefined1',
			},
			{
				groupId: 'userDefinedTexts',
				id: 'Userdefined2',
				label: 'boq.main.Userdefined2',
				type: FieldType.Boolean,
				model: 'Userdefined2',
			},
			{
				groupId: 'userDefinedTexts',
				id: 'Userdefined3',
				label: 'boq.main.Userdefined3',
				type: FieldType.Boolean,
				model: 'Userdefined3',
			},
			{
				groupId: 'userDefinedTexts',
				id: 'Userdefined4',
				label: 'boq.main.Userdefined4',
				type: FieldType.Boolean,
				model: 'Userdefined4',
			},
			{
				groupId: 'userDefinedTexts',
				id: 'Userdefined5',
				label: 'boq.main.Userdefined5',
				type: FieldType.Boolean,
				model: 'Userdefined5',
			},
			{
				groupId: 'specificationTexts',
				id: 'BasBlobsSpecificationFk',
				label: 'boq.main.BasBlobsSpecificationFk',
				type: FieldType.Boolean,
				model: 'BasBlobsSpecificationFk',
			},
			{
				groupId: 'specificationTexts',
				id: 'TextComplementsFk',
				label: 'boq.main.TextComplements',
				type: FieldType.Boolean,
				model: 'TextComplementsFk',
			},
			{
				groupId: 'copyRuleParameter',
				id: 'Rule',
				label: 'boq.main.Rule',
				type: FieldType.Boolean,
				model: 'Rule',
			},
			{
				groupId: 'copyRuleParameter',
				id: 'Parameter',
				label: 'boq.main.Parameter',
				type: FieldType.Boolean,
				model: 'Parameter',
			},
			{
				groupId: 'copyRuleParameter',
				id: 'DivisionTypeAssignment',
				label: 'boq.main.DivisionTypeAssignment',
				type: FieldType.Boolean,
				model: 'DivisionTypeAssignment',
			}
		]
	};
}

@Injectable({providedIn: 'root'})
export class BoqMainGenerateWicNumberWizardService extends BoqGenerateWicNumberWizardService {
	public async execute(context: IInitializationContext) {
		await this.exec(context.injector.get(BoqItemDataService));
	}
}


@Injectable({providedIn: 'root'})
export class BoqMainWizardResultDialogService{
	private formDialogService : UiCommonFormDialogService;
	private boqRuleComplexLookupService: BoqRuleComplexLookupService;
	public wizardResult : WizardResult = {
		IsSuccess: true,
		ChangedRecords:[],
		UnChangedRecords:[],
		ChangedRecordsCount:0,
		Message:undefined,
		TotalRecordsCount:0,
		UnchangedRecordsCount:0
	};
	public constructor() {
		this.formDialogService = inject(UiCommonFormDialogService);
		this.wizardResult.IsSuccess = true;
		this.boqRuleComplexLookupService = inject(BoqRuleComplexLookupService);
	}


	private changeRecordLogConfiguration:  IGridConfiguration<IBoqItemEntity> =  {
		uuid: '1097289d50f8443a9bcf64f142234555',
		skipPermissionCheck: true,
		columns: [
			{
				id: 'brief',
				model: 'BriefInfo',
				sortable: true,
				label: 'boq.main.BriefInfo',
				type: FieldType.Translation,
				width: 120
			},
			{
				id: 'refNo',
				model: 'Reference',
				sortable: true,
				label: 'boq.main.Reference',
				type: FieldType.Description,
				width: 120
			},
			{
				id: 'refNo2',
				model: 'Reference2',
				sortable: true,
				label: 'boq.main.Reference2',
				type: FieldType.Description,
				width: 150
			},
			{
				id: 'wicNo',
				model: 'WicNumber',
				sortable: true,
				label: 'boq.main.WicNumber',
				type: FieldType.Description,
				width: 120
			}
		]
	};

	private unchangeRecordLogConfiguration:  IGridConfiguration<IBoqItemEntity> =  {
		uuid: '1097289d50f8443a9bcf64f142234556',
		skipPermissionCheck: true,
		columns: [
			{
				id: 'brief',
				model: 'BriefInfo',
				sortable: true,
				label: 'boq.main.BriefInfo',
				type: FieldType.Translation,
				width: 120
			},
			{
				id: 'refNo',
				model: 'Reference',
				sortable: true,
				label: 'boq.main.Reference',
				type: FieldType.Description,
				width: 120
			},
			{
				id: 'refNo2',
				model: 'Reference2',
				sortable: true,
				label: 'boq.main.Reference2',
				type: FieldType.Description,
				width: 150
			},
			{
				id: 'wicNo',
				model: 'WicNumber',
				sortable: true,
				label: 'boq.main.WicNumber',
				type: FieldType.Description,
				width: 120
			}
		]
	};

	private wizardResultConfig: IFormConfig<WizardResult> = {
		formId: 'wizardResultId',
		showGrouping: true,
		groups: [

			{
				groupId: '1',
				header: 'boq.main.records',
				open: true
			},
			{
				groupId: '2',
				header: 'boq.main.details',
				open: true
			}
		],
		rows: [
			{
				groupId: '1',
				id:'totalRecords',
				label: 'boq.main.totalRecords',
				type: FieldType.Description,
				model:'TotalRecordsCount'
			},
			{
				groupId: '1',
				id:'changerecords',
				label: 'boq.main.changedRecords',
				type: FieldType.Description,
				model:'ChangedRecordsCount'
			},
			{
				groupId: '1',
				id:'unchangedrecords',
				label: 'boq.main.unchangedRecords',
				type: FieldType.Description,
				model:'UnChangedRecordsCount'
			},
			{
				groupId: '2',
				id:'changeRecordLogs',
				label: 'boq.main.changedRecordsLog',
				type: FieldType.Grid,
				configuration: this.changeRecordLogConfiguration as IGridConfiguration<object>,
				model: 'ChangedRecords',
			},
			{
				groupId: '2',
				id:'unchangeRecordLogs',
				label: 'boq.main.unChangedRecordsLog',
				type: FieldType.Grid,
				configuration: this.unchangeRecordLogConfiguration as IGridConfiguration<object>,
				model:'UnChangedRecords',
			}
		]
	};

	public async openWizardResultDialog() {
		await this.formDialogService.showDialog<WizardResult>({
			id: 'resultId',
			headerText: 'boq.main.generateWicNumber.incomplete',
			formConfiguration: this.wizardResultConfig,
			entity: this.wizardResult,
			runtime: undefined,
			customButtons: [],
			topDescription: '',
			width: '1200px',
			maxHeight: 'max'
		})?.then(result => {
			if (result?.closingButtonId === StandardDialogButtonId.Ok) {
				this.handleOk(result);
			} else {
				this.handleCancel(result);
			}
		});
	}

	/**
	 * Method handles 'Ok' button functionality.
	 */
	private handleOk(result: IEditorDialogResult<WizardResult>) {
		console.log('result of openWizardResultDialog', result);
		//TODO-BOQ: Inactive due to unclear usage of the function.
		//this.boqRuleComplexLookupService.loadLookupData();
		//TODO-BOQ: replacement of load() & access boqItemDataService
		// boqItemDataService.refresh()
	}

	/**
	 * Method handles 'Cancel' button functionality.
	 */
	private handleCancel(result?: IEditorDialogResult<WizardResult>): void {
		console.log(result);
	}
}


@Injectable({
	providedIn: 'root'
})
class BoqWicGroupLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IBoqItemEntity, TEntity> {

	public constructor() {
		super(
			{
				httpRead: { route: 'boq/wic/group/', endPointRead: 'tree'},
				dataProcessors: [],
				filterParam: false,
				tree: {
					parentProp: 'WicGroupFk',
					childProp: 'WicGroups',
				},
			},
			{
				uuid: 'f9d5684f87804c4693f4ef4abe278af6',
				valueMember: 'Id',
				displayMember: 'Code',
				gridConfig: {
					columns: [
						{
							id: 'code',
							model: 'Code',
							type: FieldType.Code,
							label: 'cloud.common.entityCode',
							sortable: true
						},
						{
							id: 'desc',
							model: 'DescriptionInfo.Translated',
							type: FieldType.Description,
							label: 'cloud.common.entityDescription',
							sortable: true
						}
					],
				},
			},
		);
	}
}

@Injectable({
	providedIn: 'root'
})
class BoqHeaderLookupDataService<TEntity extends object> extends UiCommonLookupEndpointDataService<IBoqItemEntity, TEntity> {

	public constructor() {
		super(
			{
				httpRead: { route: 'boq/main', endPointRead: 'getboqheaderlookup', usePostForRead: true },
				filterParam: true,
				prepareListFilter: (IWicGroupEntity) => {
					//TODO-EST: 'estimateProjectRateBookConfigDataService' is required.
					//var filterIds = estimateProjectRateBookConfigDataService.getFilterIds(3);
					return {
						boqType: BoqMainBoqTypes.Wic,
						boqGroupId: null,                //TODO-BOQ: entity.WicGroupFk,
						projectId: 0,
						prcStructureId: 0,
						boqFilterWicGroupIds: []         //TODO-BOQ:filterIds
					};
				}
			},
			{
				uuid: '738c5a42bfd948ab90c84fe3f4266329',
				valueMember: 'Id',
				displayMember: 'BoqNumber',
				gridConfig: {
					columns: [
						{
							id: 'BoqNumber',
							model: 'BoqNumber',
							type: FieldType.Code,
							label: 'boq.main.boqNumber',
							sortable: true
						},
						{
							id: 'Description',
							model: 'Description',
							type: FieldType.Description,
							label: 'cloud.common.entityDescription',
							sortable: true
						}
					],
				},
			},
		);
		this.dataProcessors.push({ processItem: this.processItem });
	}

	private processItem: (item :IBoqItemEntity) => void = (item) => {
		if(item.IsWicItem){
			item['Description'] = 'WIC: ' + item['Description']; // TODO-BOQ: Add translation for WIC
		}
	};

}

interface IBoqItemLookup {
	Reference: string;
	BriefInfo: IDescriptionInfo;
	BoqLineTypeFk: number;
}

@Injectable({
	providedIn: 'root'
})
export class BoqMainProjectBoqItemLookupDataService<TEntity extends object> extends UiCommonLookupEndpointDataService<IBoqItemLookup, TEntity> {
	public constructor(private boqItemDataService : BoqItemDataService) {
		super(
			{
				httpRead: { route: 'boq/project/', endPointRead: 'getboqsearchlist', usePostForRead: false },
				dataProcessors: [],
				filterParam: true,
				prepareListFilter: () => {
					return 'projectId='+ this.boqItemDataService.getSelectedProjectId() +'&filterValue='+'&boqHeaderId='+ this.boqItemDataService.getSelectedBoqHeaderId();
				},
				tree: {
					parentProp: 'BoqItemFk',
					childProp: 'BoqItems',
				},
			},
			{
				uuid: 'f9d5684f87804c4693f4ef4abe278af6',
				valueMember: 'Id',
				displayMember: 'Reference',
				gridConfig: {
					columns: [
						{
							id: 'Brief',
							model: 'BriefInfo.Description',
							type: FieldType.Description,
							label: 'cloud.common.entityBrief',
							sortable: true
						},
						{
							id: 'Reference',
							model: 'Reference',
							type: FieldType.Description,
							label: 'cloud.common.entityReference',
							sortable: true
						},
						{
							id: 'BasUomFk',
							model: 'BasUomFk',
							type: FieldType.Description,
							label: 'cloud.common.entityUoM',
							sortable: true
						}
					],
				},
			},
		);
	}
}

@Injectable({
	providedIn: 'root'
})
class BoqMainStructureDetailLookupDataService<TEntity extends object> extends UiCommonLookupEndpointDataService<IBoqItemLookup, TEntity> {
	protected currentBoqHeaderId?: number | null;
	public constructor(private boqItemDataService : BoqItemDataService) {
		super(
			{
				httpRead: { route: 'boq/main', endPointRead: 'getboqstructuredetails4boqheader', usePostForRead: false },
				dataProcessors: [],
				filterParam: true,
				prepareListFilter: () => {
					return 'headerId='+ this.boqItemDataService.getSelectedBoqHeaderId();
				}
			},
			{
				uuid: '30198d20d5f74bebb52abef69bcbe572',
				valueMember: 'BoqLineTypeFk',
				displayMember: 'DescriptionInfo.Description',
				gridConfig: {
					columns: [
						{
							id: 'BoqLineTypeFk',
							model: 'BoqLineTypeFk',
							type: FieldType.Description,
							label: 'boq.main.BoqLineTypeFk',
							sortable: true
						},
						{
							id: 'Description',
							model: 'DescriptionInfo.Description',
							type: FieldType.Description,
							label: 'cloud.common.entityDescription',
							sortable: true
						}
					],
				},
			},
		);
	}
}