/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';
import { IEstResourceEntity } from './estimate-resource-base-entity.interface';

export interface IEstResource2infoVEntityGenerated {

/*
 * AssemblyCode
 */
  AssemblyCode?: string | null;

/*
 * AssemblyDescription
 */
  AssemblyDescription?: IDescriptionInfo | null;

/*
 * CostCodeCode
 */
  CostCodeCode?: string | null;

/*
 * CostCodeDescription
 */
  CostCodeDescription?: IDescriptionInfo | null;

/*
 * CostCodeDescription2
 */
  CostCodeDescription2?: IDescriptionInfo | null;

/*
 * CostCodePrcStructFk
 */
  CostCodePrcStructFk?: number | null;

/*
 * EstResourceEntity
 */
  EstResourceEntity?: IEstResourceEntity | null;

/*
 * HeaderId
 */
  HeaderId?: number | null;

/*
 * IsBudget
 */
  IsBudget?: boolean | null;

/*
 * IsCost
 */
  IsCost?: boolean | null;

/*
 * IsEditable
 */
  IsEditable?: boolean | null;

/*
 * IsLabour
 */
  IsLabour?: boolean | null;

/*
 * IsRate
 */
  IsRate?: boolean | null;

/*
 * LineitemId
 */
  LineitemId?: number | null;

/*
 * MaterialCode
 */
  MaterialCode?: string | null;

/*
 * MaterialDescription
 */
  MaterialDescription?: IDescriptionInfo | null;

/*
 * MaterialDescription2
 */
  MaterialDescription2?: IDescriptionInfo | null;

/*
 * PrcStructureCode
 */
  PrcStructureCode?: string | null;

/*
 * PrcStructureFk
 */
  PrcStructureFk?: number | null;

/*
 * PrjCostCodeCode
 */
  PrjCostCodeCode?: string | null;

/*
 * PrjCostCodeDescription
 */
  PrjCostCodeDescription?: string | null;

/*
 * PrjCostCodeDescription2
 */
  PrjCostCodeDescription2?: string | null;

/*
 * PrjCostCodeIsBudget
 */
  PrjCostCodeIsBudget?: boolean | null;

/*
 * PrjCostCodeIsCost
 */
  PrjCostCodeIsCost?: boolean | null;

/*
 * PrjCostCodeIsEditable
 */
  PrjCostCodeIsEditable?: boolean | null;

/*
 * PrjCostCodeIsLabour
 */
  PrjCostCodeIsLabour?: boolean | null;

/*
 * PrjCostCodeIsRate
 */
  PrjCostCodeIsRate?: boolean | null;

/*
 * PrjCostCodePrcStructureFk
 */
  PrjCostCodePrcStructureFk?: number | null;

/*
 * ResourceCode
 */
  ResourceCode?: string | null;

/*
 * ResourceId
 */
  ResourceId?: number | null;
}
