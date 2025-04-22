/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompareTreeResponseBase } from '../compare-tree-response-base.interface';
import { ICompositeBoqEntity } from './composite-boq-entity.interface';
import { ICompareRowEntity } from '../compare-row-entity.interface';
import { IBoqItem2CostGroupEntity } from '@libs/boq/interfaces';
import { ILookupDescriptorEntity } from '@libs/basics/shared';
import { ICustomCompareColumnEntity } from '../custom-compare-column-entity.interface';

export interface ICompareBoqTreeResponse extends ICompareTreeResponseBase<ICompositeBoqEntity> {
	BoqLineType: ILookupDescriptorEntity[];
	BoqCustomColumn: ICustomCompareColumnEntity[];
	BoqCustomRow: ICompareRowEntity[];
	BoqCustomQuoteRow: ICompareRowEntity[];
	BoqCustomSchemaRow: ICompareRowEntity[];
	ItemTypes: object[];
	ItemTypes2: object[];
	BoqItemCostGroupCats: object;
	BoqItem2CostGroups: IBoqItem2CostGroupEntity[];
	CostGroup: object[];
}