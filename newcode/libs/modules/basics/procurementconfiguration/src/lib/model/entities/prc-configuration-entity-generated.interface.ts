/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcConfig2dataformatEntity } from './prc-config-2-dataformat-entity.interface';
import { IPrcConfig2documentEntity } from './prc-config-2-document-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IPrcConfigurationEntityGenerated extends IEntityBase {

  /**
   * ApprovalDealdline
   */
  ApprovalDealdline?: number | null;

  /**
   * ApprovalPeriod
   */
  ApprovalPeriod?: number | null;

  /**
   * BaselineIntegration
   */
  BaselineIntegration: boolean;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsContractRubric
   */
  IsContractRubric: boolean;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * IsMaterial
   */
  IsMaterial: boolean;

  /**
   * IsNotAccrualPrr
   */
  IsNotAccrualPrr: boolean;

  /**
   * IsPackageRubric
   */
  IsPackageRubric: boolean;

  /**
   * IsService
   */
  IsService: boolean;

  /**
   * NarrativeScript
   */
  NarrativeScript?: string | null;

  /**
   * PaymentTermFiFk
   */
  PaymentTermFiFk: number;

  /**
   * PaymentTermPaFk
   */
  PaymentTermPaFk: number;

  /**
   * PrcAwardMethodFk
   */
  PrcAwardMethodFk: number;

  /**
   * PrcConfig2dataformatEntities
   */
  PrcConfig2dataformatEntities?: IPrcConfig2dataformatEntity[] | null;

  /**
   * PrcConfig2documentEntities
   */
  PrcConfig2documentEntities?: IPrcConfig2documentEntity[] | null;

  /**
   * PrcConfigHeaderFk
   */
  PrcConfigHeaderFk: number;

  /**
   * PrcContractTypeFk
   */
  PrcContractTypeFk: number;

  /**
   * PrjContractTypeFk
   */
  PrjContractTypeFk?: number | null;

  /**
   * ProvingDealdline
   */
  ProvingDealdline?: number | null;

  /**
   * ProvingPeriod
   */
  ProvingPeriod?: number | null;

  /**
   * RubricCategoryFk
   */
  RubricCategoryFk: number;

  /**
   * Sorting
   */
  Sorting: number;
}
