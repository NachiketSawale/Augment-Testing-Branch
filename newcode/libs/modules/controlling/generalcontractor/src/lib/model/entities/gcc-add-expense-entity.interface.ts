/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IGccAddExpenseEntityGenerated } from './gcc-add-expense-entity-generated.interface';

export interface IGccAddExpenseEntity extends IGccAddExpenseEntityGenerated {
    ProjectFk?: number | null;
}
