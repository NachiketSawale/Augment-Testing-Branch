/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification, IEntityIdentification, } from '@libs/platform/common';
import { IEditorDialogResult, } from '@libs/ui/common';
import { ProcurementCommonWizardBaseService } from './procurement-common-wizard-base.service';
import { IProcurementCommonBusinessPartnerSearchWizardConfig } from '../../model/interfaces/wizard/prc-common-businesspartner-search-wizard.interface';
import { IBusinessPartnerWizardInitialEntity } from '@libs/businesspartner/shared';


export abstract class ProcurementCommonBusinessPartnerSearchWizardBaseService<T extends IEntityIdentification, U extends CompleteIdentification<T>, PT extends object, PU extends CompleteIdentification<PT>, R extends object>
	extends ProcurementCommonWizardBaseService<T, U, R> {
	protected wizardInitialEntity: IBusinessPartnerWizardInitialEntity & { headerFk?: number } | undefined;

	public constructor(protected override readonly config: IProcurementCommonBusinessPartnerSearchWizardConfig<T, U, PT, PU>) {
		super(config);
	}

	protected override async showWizardDialog(): Promise<IEditorDialogResult<R> | undefined> {
		const selHeader = this.config.rootDataService.getSelectedEntity();
		if (this.config.subDataService && !this.config.subDataService.hasSelection()) {
			await this.messageBoxService.showMsgBox(
				this.translateService.instant('procurement.common.noCurrentSubSelection').text,
				this.translateService.instant('cloud.common.errorMessage').text,
				'ico-error');
			return;
		}
		const selSubHeader = this.config.subDataService?.getSelectedEntity();
		if (selHeader) {
			this.wizardInitialEntity = this.config.getWizardInitialEntity(selHeader, selSubHeader || {} as PT);
			return await this.dialogShow();
		}
		return undefined;
	}

	protected abstract dialogShow(): Promise<IEditorDialogResult<R> | undefined>;


}