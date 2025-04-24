/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstAllArea2GcAreaValueEntity } from './est-all-area-2gc-area-value-entity.interface';
import { IEstAllowanceAreaEntity } from './est-allowance-area-entity.interface';

export interface IEstAllowanceAreaCompositeEntityGenerated {

/*
 * Area2GcAreaValues
 */
  Area2GcAreaValues?: IEstAllArea2GcAreaValueEntity[] | null;

/*
 * Areas
 */
  Areas?: IEstAllowanceAreaEntity[] | null;
}
