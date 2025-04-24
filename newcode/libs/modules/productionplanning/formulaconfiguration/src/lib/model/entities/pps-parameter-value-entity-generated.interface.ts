/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';


export interface IPpsParameterValueEntityGenerated extends IEntityBase {
  Id: number;
  PpsParameterFk: number;
  PpsFormulaInstanceFk?: number | null;
  PpsProductDescriptionFk?: number | null;
  ValueBoolean?: boolean | null;
  ValueNumber?: number | null;
  ValueText?: string | null;
}
