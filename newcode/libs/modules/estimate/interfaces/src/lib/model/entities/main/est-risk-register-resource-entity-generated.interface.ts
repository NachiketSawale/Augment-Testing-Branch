/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';
import { IEstRiskRegisterResourceEntity } from './est-risk-register-resource-entity.interface';

export interface IEstRiskRegisterResourceEntityGenerated {

/*
 * Code
 */
  Code: string;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstResourceTypeFk
 */
  EstResourceTypeFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * IsEditable
 */
  IsEditable?: boolean | null;

/*
 * IsMaster
 */
  IsMaster?: boolean | null;

/*
 * IsRate
 */
  IsRate?: boolean | null;

/*
 * LgmJobFk
 */
  LgmJobFk?: number | null;

/*
 * MainItemId
 */
  MainItemId?: number | null;

/*
 * MdcCostCodeFk
 */
  MdcCostCodeFk?: number | null;

/*
 * MdcMaterialFk
 */
  MdcMaterialFk?: number | null;

/*
 * PrcStructureFk
 */
  PrcStructureFk?: number | null;

/*
 * ResourceId
 */
  ResourceId?: number | null;

/*
 * RiskEventFk
 */
  RiskEventFk?: number | null;

/*
 * RiskResource
 */
  RiskResource?: IEstRiskRegisterResourceEntity[] | null;

/*
 * RiskResourcesFk
 */
  RiskResourcesFk?: number | null;

/*
 * WeightedValue
 */
  WeightedValue?: number | null;
}
