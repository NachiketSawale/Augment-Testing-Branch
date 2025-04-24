/*
 * Copyright(c) RIB Software GmbH
 */

import { IConstructionSystemCommonScriptErrorEntity } from '@libs/constructionsystem/common';

export interface ICosInsErrorEntity extends IConstructionSystemCommonScriptErrorEntity {
	Instance?: string | undefined;
	LoggingSource?: number | undefined;
	TwoQResultId?: number | undefined;
	IsCosCache?: boolean | undefined;
}
