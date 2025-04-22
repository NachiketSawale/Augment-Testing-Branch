/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IPesHeaderEntity } from '../model/entities';
import { ProcurementCommonWizardBaseService } from '@libs/procurement/common';
import { ProcurementPesHeaderDataService } from '../services/procurement-pes-header-data.service';
import { FieldType, IFormDialogConfig, StandardDialogButtonId } from '@libs/ui/common';
import { PesCompleteNew } from '../model/complete-class/pes-complete-new.class';

interface IPESUpdateQuantityOptions {
	IsSchedule: boolean;
	IsUpdateLineItem: boolean;
}

@Injectable({
	providedIn: 'root',
})
export class ProcurementPesUpdateQuantityWizardService extends ProcurementCommonWizardBaseService<IPesHeaderEntity, PesCompleteNew, IPESUpdateQuantityOptions> {
	public constructor() {
		super({
			rootDataService: inject(ProcurementPesHeaderDataService),
		});
	}

	protected override async getFormDialogConfig(): Promise<IFormDialogConfig<IPESUpdateQuantityOptions> | null> {
		return {
			id: 'pes-update-quantity-dialog',
			headerText: {
				text: 'procurement.pes.wizard.updatePesIQ',
			},
			entity: {
				IsSchedule: true,
				IsUpdateLineItem: false,
			},
			formConfiguration: {
				formId: 'change-configuration-dialog',
				showGrouping: false,
				rows: [
					{
						id: 'Schedule',
						model: 'IsSchedule',
						type: FieldType.Boolean,
						required: true,
						label: {
							key: 'procurement.pes.wizard.schedule',
						},
					},
					{
						id: 'updateLineItem',
						model: 'IsUpdateLineItem',
						type: FieldType.Boolean,
						required: true,
						label: {
							key: 'procurement.pes.wizard.updateLineItem',
						},
					},
				],
			},
		};
	}

	protected override async doExecuteWizard(opt?: IPESUpdateQuantityOptions, bntId: StandardDialogButtonId | string = StandardDialogButtonId.Ok): Promise<boolean> {
		const selEntities = this.config.rootDataService.getSelection();
		if (selEntities.length === 0) {
			throw new Error('Should have selected entities');
		}

		if (opt) {
			await this.http.post('procurement/common/prcitemassignment/updatepesestimatefromschedule', {
				PesHeaderIds: selEntities.map((i) => i.Id),
				IsSchedule: opt.IsSchedule,
				IsUpdateLineItem: opt.IsUpdateLineItem,
			});
		}

		return true;
	}
}
