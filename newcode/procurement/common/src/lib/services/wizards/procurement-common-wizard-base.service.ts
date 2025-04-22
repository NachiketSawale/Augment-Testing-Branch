/*
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import { CompleteIdentification, IEntityIdentification, PlatformConfigurationService, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';

import { IEditorDialogResult, IFormDialogConfig, StandardDialogButtonId, UiCommonDialogService, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';

import { IProcurementCommonWizardConfig } from '../../model/interfaces/procurement-common-wizard-config.interface';

import { ProcurementCommonWizardUtilService } from './procurement-common-wizard-util.service';

/**
 * Provide a base implementation for procurement form wizard wizards
 * It will implement the basic behavior as below
 * 1. Check any main entity selected or not.
 * 2. Show the form dialog or customize dialog
 * 3. User click OK in the wizard to execute the wizard
 * 4. Save the selected main entity
 * 5. Execute as calling the http call if user press OK
 * 6. Refresh the selected entity if the wizard was executed.
 */
export class ProcurementCommonWizardBaseService<T extends IEntityIdentification, U extends CompleteIdentification<T>, FT extends object> {
	protected constructor(protected readonly config: IProcurementCommonWizardConfig<T, U>) {}

	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected readonly formDialogService = inject(UiCommonFormDialogService);
	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly http = inject(PlatformHttpService);
	protected readonly configService = inject(PlatformConfigurationService);
	protected readonly dialogService = inject(UiCommonDialogService);
	protected readonly wizardUtilService = inject(ProcurementCommonWizardUtilService);

	protected async getFormDialogConfig(): Promise<IFormDialogConfig<FT> | null> {
		return null;
	}

	/*
	 * Show the wizard dialog
	 * Please override getFormDialogConfig or showWizardDialog to show the dialog;
	 * If just simple wizard without showing the dialog just do not override this method
	 */
	protected async showWizardDialog(): Promise<IEditorDialogResult<FT> | undefined> {
		return { closingButtonId: StandardDialogButtonId.Ok };
	}

	protected async startWizardValidate(checkReadonly: boolean = true): Promise<boolean> {
		if (!this.config.rootDataService.hasSelection()) {
			await this.messageBoxService.showMsgBox('cloud.common.noCurrentSelection', 'cloud.common.errorMessage', 'ico-error');
			return false;
		}

		if (checkReadonly && this.config.rootDataService.isEntityReadonly()) {
			await this.messageBoxService.showMsgBox('procurement.common.errorTip.recordIsReadOnly', 'procurement.common.errorTip.recordIsReadOnlyTitle', 'ico-error');
			return false;
		}
		return true;
	}

	/**
	 * Start the wizard
	 */
	public async onStartWizard() {
		if (!(await this.startWizardValidate())) {
			return;
		}

		const selEntity = this.config.rootDataService.getSelectedEntity();
		if (selEntity) {
			const formDialogConfig = await this.getFormDialogConfig();
			let result: IEditorDialogResult<FT> | undefined;
			if (formDialogConfig) {
				result = await this.formDialogService.showDialog<FT>(formDialogConfig);
			} else {
				result = await this.showWizardDialog();
			}

			if (this.isExecuteButtonClicked(result) && result) {
				await this.onFinishWizard(result.value, result.closingButtonId);
			}
		}
	}

	protected isExecuteButtonClicked(result: IEditorDialogResult<FT> | undefined): boolean {
		return result?.closingButtonId === StandardDialogButtonId.Ok;
	}

	protected async onFinishWizard(opt?: FT, btnId: StandardDialogButtonId | string = StandardDialogButtonId.Ok) {
		const selEntity = this.config.rootDataService.getSelectedEntity() as IEntityIdentification;
		if (selEntity) {
			//Save the data first
			if (this.updateBeforeExecute()) {
				await this.config.rootDataService.update(selEntity as T);
			}

			const isSuccess = await this.doExecuteWizard(opt, btnId);

			if (isSuccess && this.refreshSelectAfterExecute()) {
				//this refresh seems doesn't work currently.
				//TODO: refreshOnlySelected Effective use after DEV-17417 is done.
				await this.config.rootDataService.refreshOnlySelected([selEntity as T]);
			}
		}
	}

	/**
	 * Override this method to if you do not want to update the data before execute the wizard.
	 */
	protected updateBeforeExecute(): boolean {
		return true;
	}

	/**
	 * Override this method to if you do not want to refresh the data after execute the wizard.
	 */
	protected refreshSelectAfterExecute(): boolean {
		return true;
	}

	/**
	 * Override this method to execute the wizard based on the form dialog result.
	 */
	protected async doExecuteWizard(opt?: FT, bntId: StandardDialogButtonId | string = StandardDialogButtonId.Ok): Promise<boolean> {
		throw new Error('Overwrite this method');
	}
}
