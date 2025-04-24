/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IPpsItemSourceEntityGenerated } from './pps-item-source-entity-generated.interface';

export interface IPpsItemSourceEntity extends IPpsItemSourceEntityGenerated {
    ProjectFk: number;
    OrdHeaderFk?: number | null;
}
