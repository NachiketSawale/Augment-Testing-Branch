/*
 * Copyright(c) RIB Software GmbH
 */

import { ICosHeaderEntity } from '@libs/constructionsystem/shared';
import { ICosParameterGroupEntity } from '@libs/constructionsystem/shared';

export interface ICreateHeaderResponse {
	CosHeaderDto: ICosHeaderEntity;
	CosParameterGroupDto: ICosParameterGroupEntity;
}
