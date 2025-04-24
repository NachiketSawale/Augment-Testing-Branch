/*
 * Copyright(c) RIB Software GmbH
 */

import { IPpsMaterialMappingEntity } from './pps-material-mapping-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IPpsMaterialEntityGenerated extends IEntityBase {

  /**
   * BasClobsBqtyContent
   */
  BasClobsBqtyContent?: string | null;

  /**
   * BasClobsBqtyFk
   */
  BasClobsBqtyFk: number;

  /**
   * BasClobsPqtyContent
   */
  BasClobsPqtyContent?: string | null;

  /**
   * BasClobsPqtyFk
   */
  BasClobsPqtyFk: number;

  /**
   * BasUomBillFk
   */
  BasUomBillFk: number;

  /**
   * BasUomOvrFk
   */
  BasUomOvrFk?: number | null;

  /**
   * BasUomPlanFk
   */
  BasUomPlanFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsBundled
   */
  IsBundled: boolean;

  /**
   * IsForSettlement
   */
  IsForSettlement: boolean;

  /**
   * IsOverrideMaterial
   */
  IsOverrideMaterial: boolean;

  /**
   * IsReadonly
   */
  IsReadonly: boolean;

  /**
   * IsSerialProduction
   */
  IsSerialProduction: boolean;

  /**
   * MatGroupOvrFk
   */
  MatGroupOvrFk?: number | null;

  /**
   * MatSiteGrpFk
   */
  MatSiteGrpFk?: number | null;

  /**
   * MaterialOvrFk
   */
  MaterialOvrFk?: number | null;

  /**
   * MdcMaterialFk
   */
  MdcMaterialFk: number;

  /**
   * PpsMaterialMappingEntities
   */
  PpsMaterialMappingEntities?: IPpsMaterialMappingEntity[] | null;

  /**
   * ProdMatGroupFk
   */
  ProdMatGroupFk: number;

  /**
   * QuantityFormula
   */
  QuantityFormula: string;

  /**
   * SummarizeGroup
   */
  SummarizeGroup?: number | null;

  /**
   * SummarizeMode
   */
  SummarizeMode: number;

  /**
   * UserdefinedForProddesc1
   */
  UserdefinedForProddesc1?: string | null;

  /**
   * UserdefinedForProddesc2
   */
  UserdefinedForProddesc2?: string | null;

  /**
   * UserdefinedForProddesc3
   */
  UserdefinedForProddesc3?: string | null;

  /**
   * UserdefinedForProddesc4
   */
  UserdefinedForProddesc4?: string | null;

  /**
   * UserdefinedForProddesc5
   */
  UserdefinedForProddesc5?: string | null;
}
