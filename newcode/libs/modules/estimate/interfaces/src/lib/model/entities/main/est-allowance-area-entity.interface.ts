/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstAllowanceAreaEntityGenerated } from './est-allowance-area-entity-generated.interface';

export interface IEstAllowanceAreaEntity extends IEstAllowanceAreaEntityGenerated {
    Children: IEstAllowanceAreaEntity[]
}
