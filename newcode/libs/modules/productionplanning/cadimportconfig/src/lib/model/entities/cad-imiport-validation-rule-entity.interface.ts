/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ICadImportValidationRuleEntity extends IEntityBase {

      Id: number;

      Description?: string | null;

      Icon: number;
}
