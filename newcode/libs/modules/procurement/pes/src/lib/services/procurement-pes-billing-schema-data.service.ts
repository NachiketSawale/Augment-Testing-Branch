/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { IPesHeaderEntity } from '../model/entities';
import { CommonBillingSchemaDataService, ICommonBillingSchemaEntity } from '@libs/basics/shared';
import { ProcurementPesHeaderDataService } from './procurement-pes-header-data.service';
import { PesCompleteNew } from '../model/complete-class/pes-complete-new.class';

/**
 * pes billing schema data service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementPesBillingSchemaDataService extends CommonBillingSchemaDataService<ICommonBillingSchemaEntity, IPesHeaderEntity, PesCompleteNew> {
	/**
	 * The constructor
	 */
	public constructor() {
		const pesDataService = inject(ProcurementPesHeaderDataService);
		const qualifier = 'procurement.pes.billingschmema';
		super(pesDataService, qualifier);
	}

	protected override provideLoadPayload(): object {
		const pesHeaderEntity = this.parentService.getSelectedEntity()!;
		return {
			MainItemId: pesHeaderEntity.Id,
			qualifier: this.qualifier,
		};
	}

	protected override getParentBillingSchemaId(pes: IPesHeaderEntity): number {
		return pes.BillingSchemaFk!;
	}

	protected getRubricCategory(pes: IPesHeaderEntity): number {
		return pes.RubricCategoryFk;
	}

	public getExchangeRate(pes: IPesHeaderEntity): number {
		return pes.ExchangeRate;
	}

	public override isParentFn(parentKey: IPesHeaderEntity, entity: ICommonBillingSchemaEntity): boolean {
		return entity.HeaderFk === parentKey.PesHeaderFk;
	}

	protected async doRecalculateBillingSchema(): Promise<ICommonBillingSchemaEntity[]> {
		const headerEntity = this.parentService.getSelectedEntity();

		if (headerEntity) {
			return this.http.get<ICommonBillingSchemaEntity[]>('procurement/pes/billingschema/Recalculate', { params: { headerFk: headerEntity.Id } });
		}

		throw new Error('Main entity is not selected');
	}
}
