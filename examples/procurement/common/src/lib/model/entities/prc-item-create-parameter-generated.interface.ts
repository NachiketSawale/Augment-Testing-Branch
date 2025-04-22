/*
 * Copyright(c) RIB Software GmbH
 */

import { ICreateInsertItemEntity } from './create-insert-item-entity.interface';

export interface IPrcItemCreateParameterGenerated {

  /**
   * BasPaymentTermFiFk
   */
  BasPaymentTermFiFk?: number | null;

  /**
   * BasPaymentTermPaFk
   */
  BasPaymentTermPaFk?: number | null;

  /**
   * ConfigurationFk
   */
  ConfigurationFk: number;

  /**
   * ContractHeaderFk
   */
  ContractHeaderFk?: number | null;

  /**
   * FrmHeaderFk
   */
  FrmHeaderFk?: number | null;

  /**
   * FrmStyle
   */
  FrmStyle?: number | null;

  /**
   * InsertOptions
   */
  InsertOptions?: ICreateInsertItemEntity | null;

  /**
   * InstanceId
   */
  InstanceId?: number | null;

  /**
   * IsContract
   */
  IsContract: boolean;

  /**
   * IsPackage
   */
  IsPackage: boolean;

  /**
   * Itemnos
   */
  Itemnos?: number[] | null;

  /**
   * ParentId
   */
  ParentId?: number | null;

  /**
   * PrcHeaderFk
   */
  PrcHeaderFk: number;

  /**
   * PrcPackageFk
   */
  PrcPackageFk?: number | null;

  /**
   * ProjectFk
   */
  ProjectFk: number;

  /**
   * TaxCodeFk
   */
  TaxCodeFk?: number | null;
}
