/*
 * Copyright(c) RIB Software GmbH
 */

import { IReqHeaderEntity } from './reqheader-entity.interface';
import { IPrcGeneralsEntity, ProcurementCommonComplete } from '@libs/procurement/common';
import { ReqVariantCompleteEntity } from './req-variant-complete-entity.class';
import { IReqVariantEntity } from './req-variant-entity.interface';

export class ReqHeaderCompleteEntity extends ProcurementCommonComplete<IReqHeaderEntity>{
	public HeaderId!: number;
	public ReqHeader?: IReqHeaderEntity | null;
	public ReqHeaders?: IReqHeaderEntity[] | null;
	public RequisitionVariantToSave?: ReqVariantCompleteEntity[] = [];
	public RequisitionVariantToDelete?: IReqVariantEntity[] = [];
	public PrcGeneralsToSave?:Array<IPrcGeneralsEntity>;
	public PrcGeneralsToDelete?:Array<IPrcGeneralsEntity>;
}
