/*
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions } from '@libs/platform/data-access';
import { IPrcItemEntity, IPrcItemScopeDetailEntity } from '../../model/entities';
import { IBasicsScopeDetailValidationService } from '@libs/basics/interfaces';
import { PrcItemScopeDetailDataService } from './prc-item-scope-detail-data.service';
import { PrcCommonItemComplete } from '../../model/procurement-common-item-complete.class';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';

export class PrcItemScopeDetailValidationService<
	PT extends IPrcItemEntity,
	PU extends PrcCommonItemComplete,
	HT extends IEntityIdentification,
	HU extends CompleteIdentification<HT>
> extends BaseValidationService<IPrcItemScopeDetailEntity> {

	public constructor(
		private readonly dataService: PrcItemScopeDetailDataService<PT, PU, HT, HU>,
		private readonly baseValidation: IBasicsScopeDetailValidationService<IPrcItemScopeDetailEntity>
	) {
		super();
	}

	public generateValidationFunctions(): IValidationFunctions<IPrcItemScopeDetailEntity> {

		return {
			...this.baseValidation.generateValidationFunctions()
		};
	}

	public override getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPrcItemScopeDetailEntity> {
		return this.dataService;
	}

}