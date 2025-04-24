/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IPrcGeneralsEntity } from '../../model/entities';
import { AsyncReadonlyFunctions, BasicsSharedGeneralTypeLookupService, EntityAsyncReadonlyProcessorBase, ReadonlyFunctions, ReadonlyInfo } from '@libs/basics/shared';
import { ProcurementCommonGeneralsDataService } from '../procurement-common-generals-data.service';
import { firstValueFrom } from 'rxjs';
import { inject } from '@angular/core';
import { isNil } from 'lodash';

/**
 * Procurement Generals entity readonly processor
 */
export class ProcurementCommonGeneralsReadonlyProcessor<T extends IPrcGeneralsEntity,
	PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends EntityAsyncReadonlyProcessorBase<T> {
	protected readonly generalTypeLookupService = inject(BasicsSharedGeneralTypeLookupService);

	/**
	 *The constructor
	 */
	public constructor(protected dataService: ProcurementCommonGeneralsDataService<T, PT, PU>) {
		super(dataService);
	}


	public generateReadonlyFunctions(): ReadonlyFunctions<T> {
		return {
			ControllingUnitFk: {
				shared: ['TaxCodeFk'],
				readonly: this.readonlyByIsCost,
			}
		};
	}

	private readonlyByIsCost(info: ReadonlyInfo<T>) {
		return !info.item.IsCost;
	}

	public generateAsyncReadonlyFunctions(): AsyncReadonlyFunctions<T> {
		return {
			Value: async e => await this.readonlyValue(e),
		};
	}


	protected async readonlyValue(info: ReadonlyInfo<T>) {
		const generalsType = await firstValueFrom(this.generalTypeLookupService.getItemByKey({id: info.item.PrcGeneralstypeFk}));
		return !isNil(generalsType.CrbPriceConditionTypeFk);
	}
}