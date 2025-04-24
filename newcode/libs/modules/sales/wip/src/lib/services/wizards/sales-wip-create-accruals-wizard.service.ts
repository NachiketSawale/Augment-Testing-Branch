/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	createLookup,
	FieldType,
	FormRow,
	IEditorDialogResult,
	IFormConfig,
	IFormDialogConfig, IGridDialogOptions,
	StandardDialogButtonId,
	UiCommonFormDialogService,
	UiCommonGridDialogService,
	UiCommonMessageBoxService
} from '@libs/ui/common';
import { IDescriptionInfo, PlatformConfigurationService, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { SalesWipWipsDataService } from '../sales-wip-wips-data.service';
import { WipHeaderComplete } from '../../model/wip-header-complete.class';
import { BasicsSharedTransactionTypeLookupService } from '@libs/basics/shared';
import _ from 'lodash';
import { SalesWipAccrualLookupService } from '../../lookups/sales-wip-accrual-lookup.service';

@Injectable({
	providedIn: 'root'
})
export class SalesWipCreateAccrualsWizardService {

	protected readonly formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	protected readonly gridDialogService: UiCommonGridDialogService = inject(UiCommonGridDialogService);
	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly httpService = inject(PlatformHttpService);
	protected configService = inject(PlatformConfigurationService);
	public headerDataService: SalesWipWipsDataService = inject(SalesWipWipsDataService);


	public createWipAccruals() {
		this.showCreateWipAccrualsDialog();
	}

	public async showCreateWipAccrualsDialog(): Promise<boolean> {

		const selectedEntity = this.headerDataService.getSelectedEntity();
		if(!selectedEntity) {
			this.messageBoxService.showMsgBox(this.translateService.instant('cloud.common.noCurrentSelection').text, this.translateService.instant('Create WIP Accruals').text, 'ico-warning');
			return false;
		}

		const entity: ISalesWipCreateAccruals = {
			TransactionTypeId: 3,
			AccrualMode: 1,
			EffectiveDate:new Date(new Date().getFullYear(), new Date().getMonth(), 0),
			VoucherNo: this.translateService.instant('cloud.common.isGenerated').text,
			PostingDate: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
			Description: 'WIP Accruals',
			CommentText: ''
		};

		const config: IFormDialogConfig<ISalesWipCreateAccruals> = {
			headerText: 'sales.wip.wizardCreateAccrualsTitle',
			formConfiguration: this.generateFormConfig(),
			customButtons: [],
			entity: entity
		};

		const ret = false;
		this.formDialogService.showDialog(config)?.then(async (result: IEditorDialogResult<ISalesWipCreateAccruals>) => {
			if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
				const queryPath = 'sales/wip/accrual/create';
				const postData = new WipHeaderComplete();
				const params = {
					TransactionTypeId: result.value.TransactionTypeId,
					AccrualMode: result.value.AccrualMode,
					EffectiveDate:result.value.EffectiveDate,
					VoucherNo: result.value.VoucherNo,
					PostingDate: result.value.PostingDate,
					Description: result.value.Description,
					CommentText: result.value.CommentText,
				};
				if (postData.WipHeader) {
					await this.httpService.post<ICreateWipAccruals>(queryPath, params).then((res) => {
						const items = res.invalidWipEntities as unknown as IInvalidWipEntity[];
						if (_.get(res, 'withErrors') || _.size(_.get(res, 'errors')) > 0) {
							const gridDialogData: IGridDialogOptions<IInvalidWipEntity> = {
								width: '30%',
								headerText: 'sales.wip.wizardCreateAccrualsTitle',
								selectedItems: [],
								topDescription: {
									iconClass: 'tlb-icons ico-error',
									text: 'There are invalid WIP records:',
								},
								isReadOnly: true,
								items: items,
								gridConfig: {
									uuid: '11300f03f9fe4c2e98e345e35b72a011',
									columns: [{
										id: 'Code',
										model: 'Code',
										type: FieldType.Code,
										label: 'cloud.common.entityCode',
										sortable: true
									}, {
										id: 'DescriptionInfo',
										model: 'DescriptionInfo',
										sortable: false,
										label: 'cloud.common.entityDescription',
										type: FieldType.Translation,
										width: 200
									}, {
										type: FieldType.Remark,
										id: 'errormsg',
										required: true,
										model: 'ErrOrMsg',
										label: {
											text: 'Error Message',
											key: 'cloud.common.errorMessage',
										},
										visible: true,
										sortable: true,
									}],
								},
								resizeable: true,
								buttons: [
									{
										id: 'Ok',
										caption: 'basics.common.ok',
										autoClose: false,
										fn: (event, info) => {
											info.dialog.close();
										}
									}
								]
							};
							this.gridDialogService.show(gridDialogData);
						} else{
							this.messageBoxService.showMsgBox('Done Successfully', this.translateService.instant('sales.wip.wizardCreateAccrualsTitle').text, 'ico-info');
						}

						this.headerDataService.refreshSelected();
						return;
					});
				}
			}
		});

		return ret;
	}

	private generateFormConfig(): IFormConfig<ISalesWipCreateAccruals> {
		const formRows: FormRow<ISalesWipCreateAccruals>[] = [
			{
				id: 'TransactionTypeId',
				model: 'TransactionTypeId',
				label: {
					key: 'sales.wip.transactionType',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedTransactionTypeLookupService,
				}),
				readonly: true,
				required: true,
			},
			{
				id: 'AccrualMode',
				model: 'AccrualMode',
				label: {
					key: 'sales.wip.accrualMode',
				},
				required: true,
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: SalesWipAccrualLookupService,
					readonly: false
				}),
			},
			{
				id: 'EffectiveDate',
				label: {
					key: 'sales.wip.entityDateEffective',
				},
				model: 'EffectiveDate',
				type: FieldType.Date,
				required: true,
			},
			{
				id: 'VoucherNo',
				model: 'VoucherNo',
				label: {
					key: 'sales.wip.transaction.voucherNumber',
				},
				type: FieldType.Code,
				required: true,
				readonly: true,
			},
			{
				id: 'PostingDate',
				label: {
					key: 'sales.wip.transaction.postingDate',
				},
				model: 'PostingDate',
				type: FieldType.DateUtc,
				required: true,
			},
			{
				id: 'Description',
				model: 'Description',
				type: FieldType.Description,
				label: 'cloud.common.entityDescription',
				required: true,
			},
			{
				id: 'CommentText',
				model: 'CommentText',
				label: {
					key: 'cloud.common.entityCommentText',
				},
				type: FieldType.Comment,
			},
		];
		return {
			formId: 'create.accruals.form',
			showGrouping: false,
			addValidationAutomatically: false,
			rows: formRows,
		};
	}
}

export interface ISalesWipCreateAccruals {
	TransactionTypeId: number,
	AccrualMode: number,
	EffectiveDate:Date | string,
	VoucherNo: string,
	PostingDate: Date | string,
	Description: string,
	CommentText: string
}
export interface IInvalidWipEntity {
	Code: string,
	DescriptionInfo: IDescriptionInfo | null,
	ErrOrMsg?: string,
}
export interface ICreateWipAccruals {
	errors: [],
	invalidWipEntities:object[],
	withErrors: boolean,
}