/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, IEntityIdentification, IInitializationContext } from '@libs/platform/common';
import { ProcurementCommonWizardBaseService } from './procurement-common-wizard-base.service';
import { IProcurementCommonWizardConfig } from '../../model/interfaces/procurement-common-wizard-config.interface';
import { ICommonWizard } from '../../model/interfaces/wizard/common-wizard.interface';

export interface IProcurementCommonSplitOverallDiscountWizardOption<T extends IEntityIdentification, U extends CompleteIdentification<T>> extends IProcurementCommonWizardConfig<T, U> {
	apiUrl: string;
}

export class ProcurementCommonSplitOverallDiscountWizardService<T extends ISplitOverallDiscountEntity, U extends CompleteIdentification<T>> extends ProcurementCommonWizardBaseService<T, U, object> implements ICommonWizard {
	public constructor(protected override readonly config: IProcurementCommonSplitOverallDiscountWizardOption<T, U>) {
		super(config);
	}

	protected override async doExecuteWizard(opt: object) {
		const params = this.getRequestParams();

		this.wizardUtilService.showLoadingDialog('procurement.common.discountSplittDialogTitle');

		const resp = await this.http.post(this.config.apiUrl, params) as {
			Boq: number;
			Item: number;
			Result: boolean;
		};

		this.wizardUtilService.closeLoadingDialog();

		if (resp.Result) {
			const message = (resp.Boq === 0 && resp.Item === 0) ?
				this.translateService.instant('procurement.common.discountSplitNothing', {itemNum: 0, boqNum: 0}).text :
				this.translateService.instant('procurement.common.discountSplitSucceessfully', {itemNum: resp.Item, boqNum: resp.Boq}).text;

			await this.messageBoxService.showMsgBox(message, 'procurement.common.discountSplittDialogTitle', 'ico-info');

			return true;
		}

		return false;
	}

	/**
	 * Get request parameter
	 * @protected
	 */
	protected getRequestParams() {
		const selectedItem = this.config.rootDataService.getSelectedEntity();
		if (!selectedItem) {
			return null;
		}

		return {
			Id: selectedItem.Id,
			PrcHeaderFk: selectedItem.PrcHeaderFk ?? null,
			OverallDiscount: selectedItem.OverallDiscount,
			OverallDiscountOc: selectedItem.OverallDiscountOc,
			TaxCodeFk: selectedItem.TaxCodeFk ?? null,
			BpdVatGroupFk: selectedItem.BpdVatGroupFk,
			ExchangeRate: selectedItem.ExchangeRate
		};
	}

	public execute(context: IInitializationContext): Promise<void> {
		return this.onStartWizard();
	}
}

/**
 * Interface of splitting overall discount entity
 */
interface ISplitOverallDiscountEntity extends IEntityIdentification {
	PrcHeaderFk?: number | null,
	OverallDiscount: number,
	OverallDiscountOc: number,
	TaxCodeFk?: number | null,
	BpdVatGroupFk?: number | null,
	ExchangeRate: number
}