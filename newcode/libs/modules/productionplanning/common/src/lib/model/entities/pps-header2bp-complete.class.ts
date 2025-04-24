import {CompleteIdentification, IEntityBase} from '@libs/platform/common';
import {IPpsHeader2BpEntity} from './pps-header2bp-entity.interface';

export class PpsHeader2BpComplete implements CompleteIdentification<IPpsHeader2BpEntity> {
	public MainItemId: number = 0;
	public Header2Bp?: IPpsHeader2BpEntity;
	public Header2ContactToSave?: IEntityBase[];
	public Header2ContactToDelete?: IEntityBase[];
}