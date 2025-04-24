/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { FieldType, IFormDialogConfig, StandardDialogButtonId, UiCommonDialogService, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { inject } from '@angular/core';
import { DataServiceFlatRoot, DataServiceHierarchicalRoot } from '@libs/platform/data-access';
import { IChangeCodeOptions } from '../model/code-change-options.interface';

export interface IBasicSharedChangeCodeWizardConfig<T extends IEntityIdentification, U extends CompleteIdentification<T>>{
	moduleNameTranslationKey: string,
	rootDataService: (DataServiceHierarchicalRoot<T, U> | DataServiceFlatRoot<T, U>),
	getCode: (entity: T) => string,
	setCode:(code:string,entity: T)=> void
}


export class BasicsSharedChangeCodeService<T extends IEntityIdentification, U extends CompleteIdentification<T>> {

	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly http = inject(HttpClient);
	protected readonly configService = inject(PlatformConfigurationService);
	protected readonly dialogService = inject(UiCommonDialogService);
	protected readonly formDialogService = inject(UiCommonFormDialogService);

	public constructor(protected readonly config: IBasicSharedChangeCodeWizardConfig<T, U>) {
	}

	/**
	 * Start the wizard
	 */
	public async onStartWizard() {
		if (!this.config.rootDataService.hasSelection()) {
			await this.messageBoxService.showMsgBox(
				this.translateService.instant('cloud.common.noCurrentSelection').text,
				this.translateService.instant('cloud.common.errorMessage').text,
				'ico-error');
			return;
		}
		const selEntity = this.config.rootDataService.getSelectedEntity();
		if (selEntity) {
			const formDialogConfig: IFormDialogConfig<IChangeCodeOptions> = {
				id: 'change-code-dialog',
				headerText: {
					text: this.translateService.instant(this.config.moduleNameTranslationKey).text
				},
				entity: {
					Code: this.config.getCode(selEntity),
				},
				formConfiguration: {
					showGrouping: false,
					rows: [{
						id: 'code',
						model: 'Code',
						type: FieldType.Code,
						//todo need add asyncValidator
						required: true,
						label: {'key': 'procurement.common.wizard.change.configuration.name'}
					}]
				}
			};
			const result = await this.formDialogService.showDialog<IChangeCodeOptions>(formDialogConfig);
			if (result?.closingButtonId === StandardDialogButtonId.Ok && result?.value) {
				await this.onFinishWizard(result.value);
			}
		}
	}

	protected async onFinishWizard(opt: IChangeCodeOptions) {
		const selectedEntity = this.config.rootDataService.getSelectedEntity()!;
		this.config.setCode(opt.Code, selectedEntity);
		if (selectedEntity) {
			this.config.rootDataService.setModified(selectedEntity);
			const result = await this.config.rootDataService.update(selectedEntity);
			if (result) {
				//this refresh seems doesn't work currently.
				await this.config.rootDataService.refreshOnlySelected([selectedEntity as T]);
			}
		}
	}
}