import { inject, Injectable } from '@angular/core';
import { createLookup, FieldType, IFieldValueChangeInfo, IFormConfig, IGridConfiguration, LookupSimpleEntity, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { IInitializationContext, PropertyType } from '@libs/platform/common';
import { UiCommonLookupItemsDataService } from '@libs/ui/common';
import { BoqItemDataService, BoqItemDataServiceBase } from '../boq-main-boq-item-data.service';
import { every, find, forEach, isEmpty, some, split } from 'lodash';
import { ICrbCostgrpCatAssignEntity, IPrjCostgrpCatAssignUnmappedEntity } from '../../model/entities/crb-costgrp-cat-assign-entity.interface';
import { BoqWizardServiceBase } from './boq-main-wizard.service';
import { BoqWizardUuidConstants } from '@libs/boq/interfaces';


let PrjCostgrpCatAssigns: IPrjCostgrpCatAssignUnmappedEntity[] | undefined;

@Injectable({providedIn: 'root'})
export abstract class BoqCrbSiaImportWizardService extends BoqWizardServiceBase{
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private boqItemDataService!: BoqItemDataServiceBase;
	public getUuid(): string {
		return BoqWizardUuidConstants.CrbSiaImportWizardUuid;
	}
	protected async exec(boqItemDataService: BoqItemDataServiceBase) {
		this.boqItemDataService = boqItemDataService;
		this.startImport();
	}

	private selectedFile: File = new File([], 'dummy');

	public startImport() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.crbx, .01s';
		input.multiple = false;

		input.onchange = () => {
			const files = input.files;
			if (files) {
				this.selectedFile = files[0];
				this.importSia(null);
			}
		};

		input.click();
	}

	private importSia(siaImportObject: SiaImportResponse | null) {
		const crbCostgrpCatAssignGridConfiguration: IGridConfiguration<ICrbCostgrpCatAssignEntity> = {
			uuid: 'D0A31C49AEDA4B3B9FB1C31EA53AA5FF',
			idProperty: 'Code',
			skipPermissionCheck: true,
			columns: [{
				id: 'Name',
				model: 'Name',
				sortable: false,
				label: 'boq.main.crbCostgrpCatStructure',
				type: FieldType.Description,
				width: 200,
				visible: true,
				keyboard: {
					enter: false,
					tab: false
				},
				pinned: true,
			},
			{
				id: 'PrjCostgrpcatAssignFk',
				model: 'PrjCostgrpcatAssignFk',
				sortable: false,
				label: 'boq.main.prjCostgrpCatExist',
				type: FieldType.Lookup,
				width: 120,
				visible: true,
				lookupOptions: createLookup({
					dataServiceToken: BoqMainCrbCostgroupLookupService2
				}),
				keyboard: {
					enter: false,
					tab: false
				},
				pinned: true,
				change: e => onAssignmentChanged(e)
			},
			{
				id: 'NewPrjCostgrpCatAssign.Code',
				model: 'NewPrjCostgrpCatAssign.Code',
				sortable: false,
				label: 'boq.main.prjCostgrpCatNew',
				type: FieldType.Description,
				width: 120,
				visible: true,
				keyboard: {
					enter: false,
					tab: false
				},
				pinned: true
			},
			{
				id: 'PrjCostgrpcatAssignDescription',
				model: 'PrjCostgrpcatAssignDescription',
				sortable: false,
				label: 'cloud.common.entityDescription',
				type: FieldType.Description,
				width: 150,
				visible: true,
				keyboard: {
					enter: false,
					tab: false
				},
				pinned: true
			},
			{
				id: 'Sorting',
				model: 'Sorting',
				sortable: false,
				label: 'cloud.common.entitySorting',
				type: FieldType.Description,
				width: 60,
				visible: true,
				keyboard: {
					enter: false,
					tab: false
				},
				pinned: true
			},
			{
				id: 'NewPrjCostgrpCatAssign.IsBoq',
				model: 'NewPrjCostgrpCatAssign.IsBoq',
				sortable: false,
				label: 'basics.customize.isBoQ',
				type: FieldType.Boolean,
				width: 40,
				visible: true,
				keyboard: {
					enter: false,
					tab: false
				},
				pinned: true
			},
			{
				id: 'NewPrjCostgrpCatAssign.IsEstimate',
				model: 'NewPrjCostgrpCatAssign.IsEstimate',
				sortable: false,
				label: 'basics.customize.isestimate',
				type: FieldType.Boolean,
				width: 40,
				visible: true,
				keyboard: {
					enter: false,
					tab: false
				},
				pinned: true
			},
			{
				id: 'NewPrjCostgrpCatAssign.IsConstructionSystem',
				model: 'NewPrjCostgrpCatAssign.IsConstructionSystem',
				sortable: false,
				label: 'basics.customize.isliccos',
				type: FieldType.Boolean,
				width: 40,
				visible: true,
				keyboard: {
					enter: false,
					tab: false
				},
				pinned: true
			},
			{
				id: 'NewPrjCostgrpCatAssign.IsProcurement',
				model: 'NewPrjCostgrpCatAssign.IsProcurement',
				sortable: false,
				label: 'basics.customize.isProcurement',
				type: FieldType.Boolean,
				width: 40,
				visible: true,
				keyboard: {
					enter: false,
					tab: false
				},
				pinned: true
			},
			{
				id: 'NewPrjCostgrpCatAssign.IsEngineering',
				model: 'NewPrjCostgrpCatAssign.IsEngineering',
				sortable: false,
				label: 'basics.customize.isEngineering',
				type: FieldType.Boolean,
				width: 40,
				visible: true,
				keyboard: {
					enter: false,
					tab: false
				},
				pinned: true
			},
			{
				id: 'NewPrjCostgrpCatAssign.IsProductionSystem',
				model: 'NewPrjCostgrpCatAssign.IsProductionSystem',
				sortable: false,
				label: 'basics.customize.isProductionSystem',
				type: FieldType.Boolean,
				width: 40,
				visible: true,
				keyboard: {
					enter: false,
					tab: false
				},
				pinned: true
			},
			{
				id: 'NewPrjCostgrpCatAssign.IsModel',
				model: 'NewPrjCostgrpCatAssign.IsModel',
				sortable: false,
				label: 'basics.customize.isModel',
				type: FieldType.Boolean,
				width: 40,
				visible: true,
				keyboard: {
					enter: false,
					tab: false
				},
				pinned: true
			},
			{
				id: 'NewPrjCostgrpCatAssign.IsQto',
				model: 'NewPrjCostgrpCatAssign.IsQto',
				sortable: false,
				label: 'basics.customize.isQuantityTakeOff',
				type: FieldType.Boolean,
				width: 40,
				visible: true,
				keyboard: {
					enter: false,
					tab: false
				},
				pinned: true
			},
			{
				id: 'NewPrjCostgrpCatAssign.IsControlling',
				model: 'NewPrjCostgrpCatAssign.IsControlling',
				sortable: false,
				label: 'basics.customize.isControlling',
				type: FieldType.Boolean,
				width: 40,
				visible: true,
				keyboard: {
					enter: false,
					tab: false
				},
				pinned: true
			},
			{
				id: 'NewPrjCostgrpCatAssign.IsDefect',
				model: 'NewPrjCostgrpCatAssign.IsDefect',
				sortable: false,
				label: 'basics.customize.isDefect',
				type: FieldType.Boolean,
				width: 40,
				visible: true,
				keyboard: {
					enter: false,
					tab: false
				},
				pinned: true
			},]
		};

		function initNewOne(crbCostgrpCatAssign: ICrbCostgrpCatAssignEntity, code: string) {
			crbCostgrpCatAssign.NewPrjCostgrpCatAssign = { 'Code': code };
			crbCostgrpCatAssign.NewPrjCostgrpCatAssign.IsBoq = true;
		}

		function setReadonlyState(crbCostgrpCatAssign: ICrbCostgrpCatAssignEntity): void {
			// TODO-BOQ: eslint error

			// const prjCostgrpCatAssigns = find(siaImportObject?.PrjCostgrpCatAssigns, { 'Id': crbCostgrpCatAssign.PrjCostgrpcatAssignFk });
			// const isStandardCatalog: boolean = !!prjCostgrpCatAssigns?.ContextCostGroupCatalogFk;

			/*
			crbCostgrpCatAssignGridConfiguration.columns?.forEach(function (column: { id: string; readonly: boolean; }) {
				let readonly = true;
				if (column.id === 'PrjCostgrpcatAssignFk') {
					readonly = isStandardCatalog || !!crbCostgrpCatAssign.NewPrjCostgrpCatAssign;
				} else if (column.id === 'PrjCostgrpcatAssignDescription') {
					readonly = isStandardCatalog || !!crbCostgrpCatAssign.PrjCostgrpcatAssignFk;
				} else {
					readonly = !crbCostgrpCatAssign.NewPrjCostgrpCatAssign;
				}

				column.readonly = readonly;
			});
			*/
		}

		function onAssignmentChanged(e: IFieldValueChangeInfo<ICrbCostgrpCatAssignEntity, PropertyType> ) {
			const crbCostgrpCatAssign = e.entity;
			const prjCostgrpCatAssign = find(siaImportObject?.PrjCostgrpCatAssigns, { 'Id': crbCostgrpCatAssign.PrjCostgrpcatAssignFk });

			setReadonlyState(crbCostgrpCatAssign);

			if (e.field.id === 'PrjCostgrpcatAssignFk') {
				crbCostgrpCatAssign.NewPrjCostgrpCatAssign = null;
				if (prjCostgrpCatAssign && prjCostgrpCatAssign.ProjectCostGroupCatalogFk) {
					crbCostgrpCatAssign.BasCostgroupCatFk = prjCostgrpCatAssign.ProjectCostGroupCatalogFk;
					crbCostgrpCatAssign.PrjCostgrpcatAssignDescription = prjCostgrpCatAssign.Description;
				} else {
					crbCostgrpCatAssign.PrjCostgrpcatAssignFk = -1;
					crbCostgrpCatAssign.BasCostgroupCatFk = -1;
					crbCostgrpCatAssign.PrjCostgrpcatAssignDescription = '';
				}
			}
		}

		const fileReader = new FileReader();
		fileReader.onload = (e) => {
			function disableOkButton(): boolean {
				return !every(siaImportObject?.CrbCostgrpCatAssigns, function (crbCostgrpCatAssign) {
					return crbCostgrpCatAssign.PrjCostgrpcatAssignFk !== -1 || crbCostgrpCatAssign.NewPrjCostgrpCatAssign;
				});
			}

			const request = new SiaImportRequest();
			request.BoqHeaderId = 1076053; //TODO-BOQ boqRootItem.BoqHeaderFk,
			request.ProjectId = 1007770; //TODO-BOQ boqItemDataService.getSelectedProjectId(),
			request.FileName = this.selectedFile?.name;
			request.FileContent = new FileContent();
			request.FileContent.Content = split(e.target?.result?.toString(), ',')[1];
			request.SiaImportResponse = siaImportObject;
			this.http.post$('boq/main/crb/importsia', request).subscribe(res => {
				const response = res as SiaImportResponse;
				if (response !== null) {
					if (some(response.CrbCostgrpCatAssigns)) {
						if (response.ErrorText) {
							this.messageBoxService.showMsgBox(response.ErrorText, this.translateService.instant('cloud.common.errorMessage').text, 'ico-warning');
						} else {
							// old boqMainCrbSiaImportController
							PrjCostgrpCatAssigns = response.PrjCostgrpCatAssigns;
							//var importSia = response.importSia;
							const siaImportObject = response;

							const crbCostgrpCatAssignFormConfig: IFormConfig<SiaImportResponse> = {
								formId: 'crbCostgrpCatAssign-form',
								showGrouping: false,
								rows: [
									{
										id: 'CrbCostgrpCatAssigns',
										type: FieldType.Grid,
										configuration: crbCostgrpCatAssignGridConfiguration as IGridConfiguration<object>,
										height: 200,
										model: 'CrbCostgrpCatAssigns',
									},
									{
										id: 'CrbWicGroup',
										label: 'boq.main.crbWicGroupSelection',
										type: FieldType.Lookup,
										model: 'WicGroupId',
										lookupOptions: createLookup({
											dataServiceToken: WicGroupLookupService,

										})
									},
								]
							};

							forEach(siaImportObject.CrbCostgrpCatAssigns, function (crbCostgrpCatAssign) {
								const prjCostgrpCatAssign = find(siaImportObject.PrjCostgrpCatAssigns, { 'Id': crbCostgrpCatAssign.PrjCostgrpcatAssignFk });
								if (prjCostgrpCatAssign) {
									crbCostgrpCatAssign.PrjCostgrpcatAssignDescription = prjCostgrpCatAssign.Description;
								} else {
									switch (crbCostgrpCatAssign.Code) {
										case '001': { initNewOne(crbCostgrpCatAssign, 'CRBKAG'); } break;
										case '002': { initNewOne(crbCostgrpCatAssign, 'CRBOGL'); } break;
										case '003': { initNewOne(crbCostgrpCatAssign, 'CRBEGL'); } break;
										case '004': { initNewOne(crbCostgrpCatAssign, 'CRBET_'); } break;
										case '005': { initNewOne(crbCostgrpCatAssign, 'CRBVGR'); } break;
										case '007': { initNewOne(crbCostgrpCatAssign, 'CRBNGL'); } break;
										case '008': { initNewOne(crbCostgrpCatAssign, 'CRBRGL'); } break;
									}
								}
								setReadonlyState(crbCostgrpCatAssign);
							});

							this.formDialogService.showDialog({
								id: 'crbCostgrpCatAssignDialog',
								headerText: 'boq.main.crbCostgrpCatAssign',
								formConfiguration: crbCostgrpCatAssignFormConfig,
								entity: response,
								width: '1300',
								showOkButton: !disableOkButton() //TODO-BOQ disableOkButton: disableOkButton()
							})?.then(result => {
								if (result?.closingButtonId === StandardDialogButtonId.Ok) {
									siaImportObject.PrjCostgrpCatAssigns = undefined;
									this.importSia(siaImportObject);
								}
							});
						}
					} else {
						if (isEmpty(response.ErrorText) && isEmpty(response.InfoText)) {
							this.messageBoxService.showInfoBox(this.translateService.instant('boq.main.importSucceeded').text, 'info', false);
						} else if (!isEmpty(response.ErrorText) && isEmpty(response.InfoText) && isEmpty(response.SiaTestError)) {
							this.messageBoxService.showMsgBox(response.ErrorText, this.translateService.instant('cloud.common.errorMessage').text, 'ico-warning');
						} else {
							if (isEmpty(response.ErrorText)) {
								this.messageBoxService.showMsgBox(!isEmpty(response.SiaTestError) ? response.SiaTestError : response.InfoText, this.translateService.instant('cloud.common.importSucceeded').text, 'ico-info');
							} else {
								this.messageBoxService.showMsgBox(!isEmpty(response.SiaTestError) ? response.SiaTestError : response.InfoText, this.translateService.instant('cloud.common.errorMessage').text, 'ico-error');
							}
							//TODO-BOQ platformLongTextDialogService.showDialog(
							//	{
							//		headerText$tr$: 'boq.main.siaImport',
							//		topDescription: isEmpty(response.ErrorText) ?
							//			{ text: $translate.instant('boq.main.importSucceeded'), iconClass: 'tlb-icons ico-info' } :
							//			{ text: response.data.ErrorText, iconClass: 'tlb-icons ico-error' },
							//		codeMode: true,
							//		hidePager: true,
							//		dataSource: new function () {
							//			platformLongTextDialogService.LongTextDataSource.call(this);
							//			this.current = !_.isEmpty(response.data.SiaTestError) ? response.data.SiaTestError : response.data.InfoText;
							//		}
							//	});
						}

						if (isEmpty(response.ErrorText)) {
							this.boqItemDataService.refreshAll();
						}
					}
				}
			});
		};
		fileReader.readAsDataURL(this.selectedFile);
	}
}

@Injectable({providedIn: 'root'})
export class BoqMainCrbSiaImportWizardService extends BoqCrbSiaImportWizardService {
	public async execute(context: IInitializationContext) {
		await this.exec(context.injector.get(BoqItemDataService));
	}
}

@Injectable({ providedIn: 'root' })
export class BoqMainCrbCostgroupLookupService2<TEntity extends object> extends UiCommonLookupItemsDataService<IPrjCostgrpCatAssignUnmappedEntity, TEntity> {

	public constructor() {
		const items: IPrjCostgrpCatAssignUnmappedEntity[] = PrjCostgrpCatAssigns ? PrjCostgrpCatAssigns : [];
		super(items, {
			uuid: '0fb7e56cc046457798e5e6fd3461b1cb',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
		});
	}
}

@Injectable({ providedIn: 'root' })
export class WicGroupLookupService<TEntity extends object> extends UiCommonLookupItemsDataService<LookupSimpleEntity, TEntity> {

	//TODO-BOQ Waiting for the Angular migration of the data-boq-main-flat-wic-group-lookup in the “Source BoQ” container
	//TODO-BOQ $scope.wicGroupLookupOptions = {showClearButton: true, filterKey: 'estimate-main-wic-group-master-data-filter'};
	public constructor() {

		const makeItems = () => {
			const items = [];
			items.push(new LookupSimpleEntity(201, 'SWISS CRB - Swiss CRB Standard'));
			return items;
		};

		super(makeItems(), {
			uuid: '11efc5dc34d4463ebea0ca8560650605',
			idProperty: 'id',
			valueMember: 'id',
			displayMember: 'description',
		});
	}
}

class SiaImportResponse {
	public CrbCostgrpCatAssigns: ICrbCostgrpCatAssignEntity[] = [];
	public PrjCostgrpCatAssigns?: IPrjCostgrpCatAssignUnmappedEntity[];
	public WicGroupId?: number;
	public InfoText: string = '';
	public ErrorText: string = '';
	public SiaTestError: string = '';
}

class SiaImportRequest {
	public BoqHeaderId?: number;
	public ProjectId?: number;
	public FileName?: string;
	public FileContent?: FileContent;
	public SiaImportResponse?: SiaImportResponse | null;
}

class FileContent {
	public Content: string | ArrayBuffer | null | undefined;
}


