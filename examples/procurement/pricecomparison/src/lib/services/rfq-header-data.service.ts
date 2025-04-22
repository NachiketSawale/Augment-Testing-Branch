/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { ProcurementRfqHeaderDataBaseService } from '@libs/procurement/rfq';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { IPrcCommonReadonlyService } from '@libs/procurement/common';
import { PrcRfqStatusLookupService, RfqStatusEntity } from '@libs/procurement/shared';

/**
 *
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonRfqHeaderDataService extends ProcurementRfqHeaderDataBaseService
 implements IPrcCommonReadonlyService<IRfqHeaderEntity> {
	private readonly statusLookupService = inject(PrcRfqStatusLookupService);
	public getSelectedBaseRfqId(): number {
		const selected = this.getSelectedEntity() as IRfqHeaderEntity;
		return selected.RfqHeaderFk ? selected.RfqHeaderFk : selected.Id;
	}

	public getSelectedRfqId() {
		const selected = this.getSelectedEntity() as IRfqHeaderEntity;
		return selected.Id;
	}

	public isSelectedItemHasChangeOrder() {
		const rfq = this.getSelectedEntity() as IRfqHeaderEntity;
		return (rfq.Children && rfq.Children.length > 0) || (this.getList().some((item) => {
			return item.Id === rfq.RfqHeaderFk;
		}));
	}

	public isEntityReadonly(entity?: IRfqHeaderEntity): boolean {
		const status = this.getStatus(entity);
		if (!status) {
			return true;
		}
		return status.IsReadonly;
	}

	public getStatus(entity?: IRfqHeaderEntity): RfqStatusEntity | undefined {
		const selectedEntity = entity ?? this.getSelectedEntity();
		if (!selectedEntity) {
			return undefined;
		}

		const status = this.statusLookupService.cache.getItem({ id: selectedEntity.RfqStatusFk });
		return status || undefined;
	}
}