/*
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions } from '@libs/platform/data-access';
import { IPrcItemEntity, IPrcItemScopeEntity } from '../model/entities';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { PrcCommonItemComplete } from '../model/procurement-common-item-complete.class';
import { PrcItemScopeDataService } from './prc-item-scope.data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { IBasicsScopeValidationService } from '@libs/basics/interfaces';
import { PrcItemScopeDetailDataService } from './detail/prc-item-scope-detail-data.service';

export class PrcItemScopeValidationService<
	PT extends IPrcItemEntity,
	PU extends PrcCommonItemComplete,
	HT extends IEntityIdentification,
	HU extends CompleteIdentification<HT>
> extends BaseValidationService<IPrcItemScopeEntity> {
	protected readonly validationUtils = inject(BasicsSharedDataValidationService);

	public constructor(private readonly dataService: PrcItemScopeDataService<PT, PU, HT, HU>,
	                   private readonly baseValidation: IBasicsScopeValidationService<IPrcItemScopeEntity>,
	                   private readonly scopeDetailService: PrcItemScopeDetailDataService<PT, PU, HT, HU>) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<IPrcItemScopeEntity> {
		return {
			...this.baseValidation.generateValidationFunctions(),
			IsSelected: async info => {
				const prcItem = this.dataService.selectedPrcItem!;

				if (info.value) {
					this.disSelectOthers(info.entity);
				}

				info.entity.IsSelected = info.value as boolean;

				this.dataService.updateScopeToPrcItem();

				if (prcItem.HasScope) {
					await this.scopeDetailService.calculateScopeTotal(prcItem, info.entity);
				} else {
					this.scopeDetailService.resetScopeTotal(prcItem);
				}

				return this.validationUtils.createSuccessObject();
			},
			MatScope: async info => {
				await this.scopeDetailService.reloadScopeDetails(info.entity, info.value as number);
				return this.validationUtils.createSuccessObject();
			}
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPrcItemScopeEntity> {
		return this.dataService;
	}

	private disSelectOthers(entity: IPrcItemScopeEntity) {
		this.dataService.getList().forEach(e => {
			if (e !== entity) {
				this.dataService.entityProxy.apply(e).IsSelected = false;
			}
		});
	}
}