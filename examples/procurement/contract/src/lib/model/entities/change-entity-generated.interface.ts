/*
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase } from '@libs/platform/common';

export interface IChangeEntityGenerated extends IEntityBase {

  /**
   * Change2defectEntities
   */
  // Change2defectEntities?: IChange2DefectEntity[] | null;

  /**
   * Change2externalEntities
   */
  // Change2externalEntities?: IChange2ExternalEntity[] | null;

  /**
   * Change2inforequestEntities
   */
  // Change2inforequestEntities?: IChange2InforequestEntity[] | null;

  /**
   * ChangeReasonFk
   */
  ChangeReasonFk: number;

  /**
   * ChangeStatusFk
   */
  ChangeStatusFk: number;

  /**
   * ChangeTypeFk
   */
  ChangeTypeFk: number;

  /**
   * Code
   */
  Code: string;

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * ConfirmationDate
   */
  ConfirmationDate?: string | null;

  /**
   * ContractHeaderFk
   */
  ContractHeaderFk?: number | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * ElectronicDataExchangeNrGermanGaeb
   */
  ElectronicDataExchangeNrGermanGaeb?: number | null;

  /**
   * ExpectedCost
   */
  ExpectedCost: number;

  /**
   * ExpectedRevenue
   */
  ExpectedRevenue: number;

  /**
   * FactorByAmount
   */
  FactorByAmount: number;

  /**
   * FactorByReason
   */
  FactorByReason: number;

  /**
   * Id
   */
  Id: number;

  /**
   * InstructionDate
   */
  InstructionDate?: string | null;

  /**
   * IsChangeOrder
   */
  IsChangeOrder: boolean;

  /**
   * IsReadOnlyByStatus
   */
  IsReadOnlyByStatus: boolean;

  /**
   * LastDate
   */
  LastDate?: string | null;

  /**
   * OrdHeaderFk
   */
  OrdHeaderFk?: number | null;

  /**
   * PermissionObjectInfo
   */
  PermissionObjectInfo?: string | null;

  /**
   * Probability
   */
  Probability: number;

  /**
   * Project
   */
  // Project?: IIProjectEntity | null;

  /**
   * ProjectChangeType
   */
  ProjectChangeType?: string | null;

  /**
   * ProjectFk
   */
  ProjectFk: number;

  /**
   * Reason
   */
  Reason?: string | null;

  /**
   * Reference
   */
  Reference?: string | null;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * RubricCategoryFk
   */
  RubricCategoryFk: number;

  /**
   * SearchPattern
   */
  SearchPattern?: string | null;

  /**
   * SubmissionDate
   */
  SubmissionDate?: string | null;

  /**
   * UserDefinedDate01
   */
  UserDefinedDate01?: string | null;

  /**
   * UserDefinedDate02
   */
  UserDefinedDate02?: string | null;

  /**
   * UserDefinedDate03
   */
  UserDefinedDate03?: string | null;

  /**
   * UserDefinedDate04
   */
  UserDefinedDate04?: string | null;

  /**
   * UserDefinedDate05
   */
  UserDefinedDate05?: string | null;

  /**
   * UserDefinedNumber01
   */
  UserDefinedNumber01?: number | null;

  /**
   * UserDefinedNumber02
   */
  UserDefinedNumber02?: number | null;

  /**
   * UserDefinedNumber03
   */
  UserDefinedNumber03?: number | null;

  /**
   * UserDefinedNumber04
   */
  UserDefinedNumber04?: number | null;

  /**
   * UserDefinedNumber05
   */
  UserDefinedNumber05?: number | null;

  /**
   * UserDefinedText01
   */
  UserDefinedText01?: string | null;

  /**
   * UserDefinedText02
   */
  UserDefinedText02?: string | null;

  /**
   * UserDefinedText03
   */
  UserDefinedText03?: string | null;

  /**
   * UserDefinedText04
   */
  UserDefinedText04?: string | null;

  /**
   * UserDefinedText05
   */
  UserDefinedText05?: string | null;
}
