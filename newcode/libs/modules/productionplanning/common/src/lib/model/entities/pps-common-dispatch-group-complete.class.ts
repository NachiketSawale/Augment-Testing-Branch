

import { CompleteIdentification } from '@libs/platform/common';
import { IPpsCommonDispatchGroupEntity } from './pps-common-dispatch-group-entity.interface';

export class PpsCommonDispatchGroupComplete implements CompleteIdentification<IPpsCommonDispatchGroupEntity> {

	public Dispatcher: IPpsCommonDispatchGroupEntity[] | null = null;
}