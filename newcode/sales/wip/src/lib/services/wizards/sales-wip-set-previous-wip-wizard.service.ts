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
	IFormDialogConfig,
	StandardDialogButtonId,
	UiCommonFormDialogService,
	UiCommonGridDialogService,
	UiCommonMessageBoxService
} from '@libs/ui/common';
import { PlatformConfigurationService, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { SalesWipWipsDataService } from '../sales-wip-wips-data.service';
import { WipHeaderComplete } from '../../model/wip-header-complete.class';
import { HttpClient } from '@angular/common/http';
import { SalesWipPreviousWipLookupService } from '../../lookups/sales-wip-previous-wip-lookup.service';
import { ICreateWipAccruals } from './sales-wip-create-accruals-wizard.service';

@Injectable({
	providedIn: 'root'
})
export class SalesWipSetPreviousWipWizardService {

	protected readonly formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	protected readonly gridDialogService: UiCommonGridDialogService = inject(UiCommonGridDialogService);
	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected http = inject(HttpClient);
	protected configService = inject(PlatformConfigurationService);
	public headerDataService: SalesWipWipsDataService = inject(SalesWipWipsDataService);
	private readonly httpService = inject(PlatformHttpService);


	public setPreviousWip() {
		this.showSetPreviousWipDialog();
	}

	public async showSetPreviousWipDialog(): Promise<boolean> {

		const selectedEntity = this.headerDataService.getSelectedEntity();
		if(!selectedEntity) {
			this.messageBoxService.showMsgBox(this.translateService.instant('cloud.common.noCurrentSelection').text, this.translateService.instant('Set Previous WIP').text, 'ico-warning');
			return false;
		}

		const entity: ISetPreviousWip = {
			previousWipId: null,
		};

		const config: IFormDialogConfig<ISetPreviousWip> = {
			headerText: 'Set Previous WIP',
			formConfiguration: this.generateFormConfig(),
			customButtons: [],
			entity: entity
		};

		const ret = false;
		this.formDialogService.showDialog(config)?.then(async (result: IEditorDialogResult<ISetPreviousWip>) => {
			if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
				const url = 'sales/wip/update';
				const postData = new WipHeaderComplete();
				const itemSelected = this.headerDataService.getSelectedEntity();
				const param = {
					EntitiesCount:1,
					MainItemId:selectedEntity.Id,
					WipHeader:itemSelected,
					saveCharacteristicsOngoing:true,
				};
				if (postData.WipHeader) {
					await this.httpService.get<ICreateWipAccruals>('sales/wip/list?projectId=' + selectedEntity.ProjectFk).then((res) => {
						res;
						return this.httpService.post(url,param).then(result => {
							return result;
						});
					});
				}
			}
		});

		return ret;
	}

	private generateFormConfig(): IFormConfig<ISetPreviousWip> {
		const formRows: FormRow<ISetPreviousWip>[] = [
			{
				id: 'previousWipId',
				model: 'previousWipId',
				label: {
					key: 'Previous WIP',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: SalesWipPreviousWipLookupService,
				}),
				readonly: false,
				required: true,
			},
		];
		return {
			formId: 'set.previouswip.form',
			showGrouping: false,
			addValidationAutomatically: false,
			rows: formRows,
		};
	}
}

export interface ISetPreviousWip {
	previousWipId: number | null,
}