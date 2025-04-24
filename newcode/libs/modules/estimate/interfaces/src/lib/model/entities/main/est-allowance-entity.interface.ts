/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstAllowanceEntityGenerated } from './est-allowance-entity-generated.interface';

export interface IEstAllowanceEntity extends IEstAllowanceEntityGenerated {
     Version: number;
     oldCode: string;
     isUniq: boolean;
}
