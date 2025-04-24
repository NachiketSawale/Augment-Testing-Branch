import { CompleteIdentification } from '@libs/platform/common';
import {IRfqRequisitionEntity} from './rfq-requisition-entity.interface';

export class RfqRequisitionEntityComplete implements CompleteIdentification<IRfqRequisitionEntity> {
	public MainItemId: number = 0;

}