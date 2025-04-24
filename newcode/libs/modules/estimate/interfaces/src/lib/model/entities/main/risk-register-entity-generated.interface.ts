/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstRiskRegisterUserChoicesEntity } from './est-risk-register-user-choices-entity.interface';
import { IEstRiskevent2lineitemEntity } from './est-riskevent-2lineitem-entity.interface';
import { IRiskRegisterEntity } from './risk-register-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { IEstHeaderEntity } from './est-header-base-entity.interface';

export interface IRiskRegisterEntityGenerated extends IEntityBase {

/*
 * Code
 */
  Code: string;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstHeaderEntity
 */
  EstHeaderEntity?: IEstHeaderEntity | null;

/*
 * EstHeaderFk
 */
  EstHeaderFk?: number | null;

/*
 * EstRiskRegisterUserChoicesEntities
 */
  EstRiskRegisterUserChoicesEntities?: IEstRiskRegisterUserChoicesEntity[] | null;

/*
 * EstRiskevent2lineitemEntities
 */
  EstRiskevent2lineitemEntities?: IEstRiskevent2lineitemEntity[] | null;

/*
 * Id
 */
  Id: number;

/*
 * IsMaster
 */
  IsMaster?: boolean | null;

/*
 * RiskRegisterEntities_RiskRegisterParentFk
 */
  RiskRegisterEntities_RiskRegisterParentFk?: IRiskRegisterEntity[] | null;

/*
 * RiskRegisterEntity_RiskRegisterParentFk
 */
  RiskRegisterEntity_RiskRegisterParentFk?: IRiskRegisterEntity | null;

/*
 * RiskRegisterParentFk
 */
  RiskRegisterParentFk?: number | null;
}
