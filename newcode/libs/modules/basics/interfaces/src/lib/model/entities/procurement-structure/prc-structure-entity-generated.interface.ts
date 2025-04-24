/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcStructureEntity } from './prc-structure-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IPrcStructureEntityGenerated extends IEntityBase {

  /**
   * AllowAssignment
   */
  AllowAssignment: boolean;

  /**
   * BasLoadingCostId
   */
  BasLoadingCostId: number;

  /**
   * ChildItems
   */
  ChildItems?: IPrcStructureEntity[] | null;

  /**
   * ClerkPrcFk
   */
  ClerkPrcFk?: number | null;

  /**
   * ClerkReqFk
   */
  ClerkReqFk?: number | null;

  /**
   * Code
   */
  Code: string;

  /**
   * CommentTextInfo
   */
  CommentTextInfo?: IDescriptionInfo | null;

  /**
   * CompositeKey
   */
  CompositeKey?: string | null;

  /**
   * CostCodeFk
   */
  CostCodeFk?: number | null;

  /**
   * CostCodeURP1Fk
   */
  CostCodeURP1Fk?: number | null;

  /**
   * CostCodeURP2Fk
   */
  CostCodeURP2Fk?: number | null;

  /**
   * CostCodeURP3Fk
   */
  CostCodeURP3Fk?: number | null;

  /**
   * CostCodeURP4Fk
   */
  CostCodeURP4Fk?: number | null;

  /**
   * CostCodeURP5Fk
   */
  CostCodeURP5Fk?: number | null;

  /**
   * CostCodeURP6Fk
   */
  CostCodeURP6Fk?: number | null;

  /**
   * CostCodeVATFk
   */
  CostCodeVATFk?: number | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * HasChildren
   */
  HasChildren: boolean;

  /**
   * Id
   */
  Id: number;

  /**
   * InternetCatalogFk
   */
  InternetCatalogFk?: number | null;

  /**
   * IsApprovalRequired
   */
  IsApprovalRequired: boolean;

  /**
   * IsFormalHandover
   */
  IsFormalHandover: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * IsStockExcluded
   */
  IsStockExcluded: boolean;

  /**
   * MatrialCount
   */
  MatrialCount: number;

  /**
   * MdcContextFk
   */
  MdcContextFk?: number | null;

  /**
   * PrcConfigHeaderFk
   */
  PrcConfigHeaderFk?: number | null;

  /**
   * PrcStructureFk
   */
  PrcStructureFk?: number | null;

  /**
   * PrcStructureLevel1Fk
   */
  PrcStructureLevel1Fk?: number | null;

  /**
   * PrcStructureLevel2Fk
   */
  PrcStructureLevel2Fk?: number | null;

  /**
   * PrcStructureLevel3Fk
   */
  PrcStructureLevel3Fk?: number | null;

  /**
   * PrcStructureLevel4Fk
   */
  PrcStructureLevel4Fk?: number | null;

  /**
   * PrcStructureLevel5Fk
   */
  PrcStructureLevel5Fk?: number | null;

  /**
   * PrcStructureTypeFk
   */
  PrcStructureTypeFk: number;

  /**
   * ScurveFk
   */
  ScurveFk?: number | null;

  /**
   * TaxCodeFk
   */
  TaxCodeFk?: number | null;
}
