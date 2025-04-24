/*
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import { CompleteIdentification, IEntityIdentification, } from '@libs/platform/common';
import { FieldType, IFormDialogConfig, } from '@libs/ui/common';
import { firstValueFrom } from 'rxjs';
import { IProcurementCommonWizardConfig } from '../../model/interfaces/procurement-common-wizard-config.interface';
import { ProcurementCommonSystemOption } from '../../model/enums/procurement-system-option.enum';
import { BasicsSharedSystemOptionLookupService } from '@libs/basics/shared';
import { ProcurementCommonWizardBaseService } from './procurement-common-wizard-base.service';


interface IProcurementCommonRenumberItemConfig<T extends IEntityIdentification, U extends CompleteIdentification<T>> extends IProcurementCommonWizardConfig<T, U> {
	moduleInternalName: string,

}

interface IRenumberItemOptions {
	start: number,
	increaseStep: number
}


export class ProcurementCommonRenumberItemWizardService<T extends IEntityIdentification, U extends CompleteIdentification<T>> extends ProcurementCommonWizardBaseService<T, U, IRenumberItemOptions> {

	private readonly systemOptionLookup = inject(BasicsSharedSystemOptionLookupService);

	protected constructor(protected override readonly config: IProcurementCommonRenumberItemConfig<T, U>) {
		super(config);
	}

	protected override async getFormDialogConfig(): Promise<IFormDialogConfig<IRenumberItemOptions>> {

		const incrementStep = await this.getIncrementStep();
		return {
			id: 'change-configuration-dialog',
			headerText: {
				key: 'procurement.common.renumberItem.title'
			},
			entity: {
				start: incrementStep,
				increaseStep: incrementStep
			},
			formConfiguration: {
				formId: 'renumber-item',
				showGrouping: false,
				rows: [
					{
						id: 'start',
						model: 'start',
						type: FieldType.Integer,
						required: true,
						label: {
							'text': 'Start Value',
							'key': 'procurement.common.entityStartValue'
						}
					},
					{
						id: 'increaseStep',
						model: 'increaseStep',
						type: FieldType.Integer,
						required: true,
						label: {
							'text': 'Increment',
							'key': 'procurement.common.entityIncrement'
						}
					},
				]
			},
			customButtons: []
		};
	}

	protected override async doExecuteWizard(opt: IRenumberItemOptions) {
		const selEntity = this.config.rootDataService.getSelectedEntity() as IEntityIdentification;
		if (selEntity) {
			this.wizardUtilService.showLoadingDialog('procurement.common.renumberItem.title');
			const resp = await this.http.post<boolean>('procurement/common/wizard/renumberitem', {
					MainItemId: selEntity.Id,
					ModuleName: this.config.moduleInternalName,
					StartValue: opt.start,
					Stepincrement: opt.increaseStep
				});
			this.wizardUtilService.closeLoadingDialog();
			return resp;
		}
		return false;
	}
	private async getIncrementStep() {
		//TODO: if later framework provide general implementation for system options, reuse the framework implementation.
		const systemOptionPrcIncrement = await firstValueFrom(this.systemOptionLookup.getItemByKey({id: ProcurementCommonSystemOption.IncrementStep}));
		const value = parseInt(systemOptionPrcIncrement.ParameterValue);
		return isNaN(value) ? 10 : value;
	}
}