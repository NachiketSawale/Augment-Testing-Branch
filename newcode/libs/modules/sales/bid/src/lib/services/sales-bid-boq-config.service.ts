/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { BoqCompositeConfigService } from '@libs/boq/main';
import { IBidBoqCompositeEntity } from '@libs/sales/interfaces';

@Injectable({providedIn: 'root'})

/***
 * Sales bid boq config service
 */
export class SalesBidBoqConfigService extends BoqCompositeConfigService<IBidBoqCompositeEntity> {
	protected properties = {
		...this.getBoqItemProperties(),
		...this.getBoqHeaderProperties(),
	};
}