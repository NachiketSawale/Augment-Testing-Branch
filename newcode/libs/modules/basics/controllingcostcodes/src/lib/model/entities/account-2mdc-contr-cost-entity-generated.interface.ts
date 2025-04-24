/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IContrCostCodeEntity } from './contr-cost-code-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IAccount2MdcContrCostEntityGenerated extends IEntityBase {

/*
 * BasAccountFk
 */
  BasAccountFk?: number | null;

/*
 * ContrCostCodeEntity
 */
  ContrCostCodeEntity?: IContrCostCodeEntity | null;

/*
 * Factor
 */
  Factor?: number | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * MdcContextFk
 */
  MdcContextFk?: number | null;

/*
 * MdcContrCostCodeFk
 */
  MdcContrCostCodeFk?: number | null;

/*
 * MdcLedgerContextFk
 */
  MdcLedgerContextFk?: number | null;

/*
 * NominalDimension1
 */
  NominalDimension1?: string | null;

/*
 * NominalDimension2
 */
  NominalDimension2?: string | null;

/*
 * NominalDimension3
 */
  NominalDimension3?: string | null;
}
