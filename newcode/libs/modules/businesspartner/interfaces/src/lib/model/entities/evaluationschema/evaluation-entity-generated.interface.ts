/*
 * Copyright(c) RIB Software GmbH
 */

import { IEvaluationDocumentEntity } from './evaluation-document-entity.interface';
import { IEvaluationEntity } from './evaluation-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IEvaluationEntityGenerated extends IEntityBase {

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk: number;

  /**
   * Checked
   */
  Checked: boolean;

  /**
   * ChildrenItem
   */
  ChildrenItem?: IEvaluationEntity[] | null;

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
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * ConHeaderFk
   */
  ConHeaderFk?: number | null;

  /**
   * Contact1Fk
   */
  Contact1Fk?: number | null;

  /**
   * Contact2Fk
   */
  Contact2Fk?: number | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * EvalPermissionObjectInfo
   */
  EvalPermissionObjectInfo?: string | null;

  /**
   * EvalStatusFk
   */
  EvalStatusFk: number;

  /**
   * EvaluationDate
   */
  EvaluationDate: Date | string;

  /**
   * EvaluationDocumentEntities
   */
  EvaluationDocumentEntities?: IEvaluationDocumentEntity[] | null;

  /**
   * EvaluationMotiveFk
   */
  EvaluationMotiveFk: number;

  /**
   * EvaluationSchemaDescription
   */
  EvaluationSchemaDescription?: string | null;

  /**
   * EvaluationSchemaFk
   */
  EvaluationSchemaFk: number;

  /**
   * HasChildren
   */
  HasChildren: boolean;

  /**
   * HasToGenerateCode
   */
  HasToGenerateCode?: boolean | null;

  /**
   * Icon
   */
  Icon?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * InvHeaderFk
   */
  InvHeaderFk?: number | null;

  /**
   * IsReadonly
   */
  IsReadonly: boolean;

  /**
   * OldEvaluationMotiveId
   */
  OldEvaluationMotiveId: number;

  /**
   * PId
   */
  PId?: number | null;

  /**
   * Points
   */
  Points?: number | null;

  /**
   * ProjectFk
   */
  ProjectFk?: number | null;

  /**
   * QtnHeaderFk
   */
  QtnHeaderFk?: number | null;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * Remark2
   */
  Remark2?: string | null;

  /**
   * RubricCategoryId
   */
  RubricCategoryId?: number | null;

  /**
   * SubsidiaryFk
   */
  SubsidiaryFk?: number | null;

  /**
   * UserDefined1
   */
  UserDefined1?: string | null;

  /**
   * UserDefined2
   */
  UserDefined2?: string | null;

  /**
   * UserDefined3
   */
  UserDefined3?: string | null;

  /**
   * UserDefined4
   */
  UserDefined4?: string | null;

  /**
   * UserDefined5
   */
  UserDefined5?: string | null;

  /**
   * ValidFrom
   */
  ValidFrom?: Date | string | null;

  /**
   * ValidTo
   */
  ValidTo?: Date | string | null;
}
