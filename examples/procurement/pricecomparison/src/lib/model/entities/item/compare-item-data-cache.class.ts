/*
 * Copyright(c) RIB Software GmbH
 */

import { CompareDataBaseCache } from '../../classes/compare-data-base-cache.class';
import { ICompositeItemEntity } from './composite-item-entity.interface';

export class CompareItemDataCache extends CompareDataBaseCache<ICompositeItemEntity> {
	public prcPackages: object[] = [];
	public prcStructures: object[] = [];
	public controllingUnits: object[] = [];
	public addresses: object[] = [];
	public paymentTerms: object[] = [];
	public prcItemStatus: object[] = [];

	public override clear() {
		super.clear();
		this.prcPackages = [];
		this.prcStructures = [];
		this.controllingUnits = [];
		this.addresses = [];
		this.paymentTerms = [];
		this.prcItemStatus = [];
	}
}