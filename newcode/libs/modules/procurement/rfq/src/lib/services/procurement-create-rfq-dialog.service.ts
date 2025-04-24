/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {
	IRfqHeaderDialogEntity
} from '@libs/procurement/common';
import {
	FieldType,
	IEditorDialogResult, IFieldValueChangeInfo,
	IFormConfig,
	UiCommonFormDialogService
} from '@libs/ui/common';
import {EntityRuntimeData} from '@libs/platform/data-access';
import {PrcSharedPrcConfigLookupService} from '@libs/procurement/shared';
import { BasicsSharedNumberGenerationService } from '@libs/basics/shared';

/**
 * Rfq create popup dialog service
 */

@Injectable({
	providedIn: 'root'
})
export class ProcurementCreateRfqDialogService  {
	private alternate: boolean = false;
	private readonly genNumberSvc = inject(BasicsSharedNumberGenerationService);
	private readonly prcConfigLookup = inject(PrcSharedPrcConfigLookupService);
	private readonly formDialogService = inject(UiCommonFormDialogService);

	// TODO: this is sample data, it will be taken from context later.
	public dialogFormEntity: IRfqHeaderDialogEntity = {
		ConfigurationFk: 11,
		ClerkReqFk: 1012452,
		PrcStrategyFk: 1,
		Code: '',
		Remark: '',
	};

	private readonly formRuntimeInfo: EntityRuntimeData<IRfqHeaderDialogEntity> = {
		readOnlyFields: [],
		validationResults: [],
		entityIsReadOnly: false
	};

	private readonly formConfig: IFormConfig<IRfqHeaderDialogEntity> = {
		formId: 'create-rfq-dialog-form',
		showGrouping: false,
		groups: [
			{
				groupId: 'default',
				header: { text: 'RfQ' },
			},
		],
		rows: [
			{
				groupId: 'default',
				id: 'configurationFk',
				label: {
					text: 'Configuration',
				},
				type: FieldType.Integer,
				model: 'ConfigurationFk',
				sortOrder: 1,
				required: true,
				change:(info: IFieldValueChangeInfo<IRfqHeaderDialogEntity>)  => {
					this.validateConfigurationFk(info);
				}
			},
			{
				groupId: 'default',
				id: 'ClerkReqFk',
				label: {
					text: 'Requisition Owner',
				},
				type: FieldType.Integer,
				model: 'ClerkReqFk',
				sortOrder: 2,
				required: false
			},
			{
				groupId: 'default',
				id: 'PrcStrategyFk',
				label: {
					text: 'Strategy',
				},
				type: FieldType.Integer,
				model: 'PrcStrategyFk',
				sortOrder: 3,
				required: true,
			},
			{
				groupId: 'default',
				id: 'code',
				label: {
					text: 'Rfq Code',
				},
				type: FieldType.Code,
				model: 'Code',
				sortOrder: 4,
			},
			{
				groupId: 'default',
				id: 'Remark',
				label: {
					text: 'Remark',
				},
				type: FieldType.Remark,
				model: 'Code',
				sortOrder: 4,
			}
		],
	};

	protected validateConfigurationFk(info: IFieldValueChangeInfo<IRfqHeaderDialogEntity>):void{
		this.alternate = !this.alternate;
		if (info.newValue && this.alternate && info.entity.ConfigurationFk !== undefined) {
			this.prcConfigLookup.getItemByKey({
				id: info.entity.ConfigurationFk
			}).subscribe(e => {
				if (e !== null) {
					info.entity.Code = this.genNumberSvc.provideNumberDefaultText(e.RubricCategoryFk, 5);
				}
				if(info.entity.Code === '') {
					this.formRuntimeInfo.validationResults.push(
						{
							field: 'Code',
							result: {
								valid: false,
								error: 'Can not be empty!',
							},
						}
					);
				}
			});
		}
	}

	/**
	 * Method opens the form dialog.
	 */
	public async openCreateDialogForm() {
		const result = await this.formDialogService.showDialog<IRfqHeaderDialogEntity>({
			id: 'create-rfq-dialog',
			headerText: 'New Record',
			formConfiguration: this.formConfig,
			entity: this.dialogFormEntity,
			runtime: this.formRuntimeInfo,
			customButtons: []
		});
		return result;
	}

	private handleOk(result: IEditorDialogResult<IRfqHeaderDialogEntity>): void {
		//TODO:Operations to be carried out on ok click.
		console.log(result);
	}

	private handleCancel(result?: IEditorDialogResult<IRfqHeaderDialogEntity>): void {
		//TODO:Operations to be carried out on ok click.
		console.log(result);
	}

}