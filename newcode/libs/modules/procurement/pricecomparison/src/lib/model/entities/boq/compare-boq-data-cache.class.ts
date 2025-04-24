/*
 * Copyright(c) RIB Software GmbH
 */

import { CompareDataBaseCache } from '../../classes/compare-data-base-cache.class';
import { ILookupDescriptorEntity } from '@libs/basics/shared';
import { ICustomItemType } from './custom-item-type.interface';
import { ICustomBoqStructure } from './custom-boq-structure.interface';
import { ICustomBoqStructureDetail } from './custom-boq-structure-detail.interface';
import { ICompositeBoqEntity } from './composite-boq-entity.interface';

export class CompareBoqDataCache extends CompareDataBaseCache<ICompositeBoqEntity> {
	public boqLineTypes: ILookupDescriptorEntity[] = [];
	public costGroupCats: object = {};
	public boqItem2CostGroups: object[] = [];
	public itemTypes: ICustomItemType[] = [];
	public itemTypes2: ICustomItemType[] = [];
	public boqStructures: ICustomBoqStructure[] = [];
	public boqStructureDetails: ICustomBoqStructureDetail[] = [];
	public costGroups: [] = [];

	public override clear() {
		super.clear();
		this.boqLineTypes = [];
		this.costGroupCats = {};
		this.boqItem2CostGroups = [];
		this.itemTypes = [];
		this.itemTypes2 = [];
		this.boqStructures = [];
		this.boqStructureDetails = [];
		this.costGroups = [];
	}
}