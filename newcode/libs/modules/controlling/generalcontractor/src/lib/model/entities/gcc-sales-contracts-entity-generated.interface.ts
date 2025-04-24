/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ISalesContractsEntityGenerated extends IEntityBase {

/*
 * Code
 */
  Code?: string | null;

  Flag:string ;

  Comment?: string | null;

  OrdStatusFk?: number | null;

  PrjChangeFk?: number | null;

  BusinessPartnerFk?: number | null;

  CustomerFk?: number | null;

  Total?: number | null;

  Description?: string | null;
}

