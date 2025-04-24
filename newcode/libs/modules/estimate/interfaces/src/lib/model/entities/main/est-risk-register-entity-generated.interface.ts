/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstRiskRegisterEntity } from './est-risk-register-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstRiskRegisterEntityGenerated extends IEntityBase {

/*
 * Code
 */
  Code: string;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EntityType
 */
  EntityType?: string | null;

/*
 * EstHeaderFk
 */
  EstHeaderFk?: number | null;

/*
 * HasChildren
 */
  HasChildren?: boolean | null;

/*
 * Id
 */
  Id: number;

/*
 * IsMaster
 */
  IsMaster?: boolean | null;

/*
 * RiskRegisterImpactEntities
 */
  // RiskRegisterImpactEntities?: IEstRiskRegisterImpactEntity[] | null;

/*
 * RiskRegisterParentFk
 */
  RiskRegisterParentFk?: number | null;

/*
 * RiskRegisters
 */
  RiskRegisters?: IEstRiskRegisterEntity[] | null;
}
