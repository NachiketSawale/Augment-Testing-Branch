/*
 * Copyright(c) RIB Software GmbH
 */

import { IRequisition2RequisitionEntity } from './requisition-2-requisition-entity.interface';
import { IRequisitionitemEntity } from './requisitionitem-entity.interface';
import { IRequisitionRequiredSkillEntity } from './requisition-required-skill-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IRequisitionEntityGenerated extends IEntityBase {

  /**
   * ActivityFk
   */
  ActivityFk?: number | null;

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk?: number | null;

  /**
   * ClerkOwnerFk
   */
  ClerkOwnerFk?: number | null;

  /**
   * ClerkResponsibleFk
   */
  ClerkResponsibleFk?: number | null;

  /**
   * Code
   */
  Code: string;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DispatcherGroupFk
   */
  DispatcherGroupFk?: number | null;

  /**
   * EstHeaderFk
   */
  EstHeaderFk?: number | null;

  /**
   * EstLineItemFk
   */
  EstLineItemFk?: number | null;

  /**
   * EstResourceFk
   */
  EstResourceFk?: number | null;

  /**
   * HasToGenerateCode
   */
  HasToGenerateCode: boolean;

  /**
   * Id
   */
  Id: number;

  /**
   * IsLinkedFixToReservation
   */
  IsLinkedFixToReservation: boolean;

  /**
   * IsReadOnlyStatus
   */
  IsReadOnlyStatus: boolean;

  /**
   * Job
   */
 // Job?: IIJobEntity | null;

  /**
   * JobFk
   */
  JobFk: number;

  /**
   * JobGroupFk
   */
  JobGroupFk?: number | null;

  /**
   * JobPreferredFk
   */
  JobPreferredFk?: number | null;

  /**
   * JobSiteFk
   */
  JobSiteFk?: number | null;

  /**
   * MaterialFk
   */
  MaterialFk?: number | null;

  /**
   * PermissionObjectInfo
   */
  PermissionObjectInfo?: string | null;

  /**
   * PpsEventFk
   */
  PpsEventFk?: number | null;

  /**
   * PreferredResourceSiteFk
   */
  PreferredResourceSiteFk?: number | null;

  /**
   * Project
   */
  //Project?: IIProjectEntity | null;

  /**
   * ProjectChangeFk
   */
  ProjectChangeFk?: number | null;

  /**
   * ProjectChangeStatusFk
   */
  ProjectChangeStatusFk?: number | null;

  /**
   * ProjectFk
   */
  ProjectFk: number;

  /**
   * ProjectStockFk
   */
  ProjectStockFk?: number | null;

  /**
   * Quantity
   */
  Quantity: number;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * RequestedFrom
   */
  RequestedFrom: string;

  /**
   * RequestedTo
   */
  RequestedTo: string;

  /**
   * RequiredSkillList
   */
  //RequiredSkillList?: IIIdentifyable[] | null;

  /**
   * Requisition2RequisitionEntities_ResRequisitionFk
   */
  Requisition2RequisitionEntities_ResRequisitionFk?: IRequisition2RequisitionEntity[] | null;

  /**
   * Requisition2RequisitionEntities_ResRequisitionlinkedFk
   */
  Requisition2RequisitionEntities_ResRequisitionlinkedFk?: IRequisition2RequisitionEntity[] | null;

  /**
   * RequisitionFk
   */
  RequisitionFk?: number | null;

  /**
   * RequisitionGroupFk
   */
  RequisitionGroupFk?: number | null;

  /**
   * RequisitionPriorityFk
   */
  RequisitionPriorityFk?: number | null;

  /**
   * RequisitionStatusFk
   */
  RequisitionStatusFk: number;

  /**
   * RequisitionTypeFk
   */
  RequisitionTypeFk?: number | null;

  /**
   * RequisitonItemsWOStock
   */
  RequisitonItemsWOStock?: IRequisitionitemEntity[] | null;

  /**
   * ResRequisition2skillEntities
   */
  ResRequisition2skillEntities?: IRequisitionRequiredSkillEntity[] | null;

  /**
   * ReservationId
   */
  ReservationId?: number | null;

  /**
   * ReservedFrom
   */
  ReservedFrom?: string | null;

  /**
   * ReservedTo
   */
  ReservedTo?: string | null;

  /**
   * ResourceContextFk
   */
  ResourceContextFk?: number | null;

  /**
   * ResourceFk
   */
  ResourceFk?: number | null;

  /**
   * RubricCategoryFk
   */
  RubricCategoryFk?: number | null;

  /**
   * ScheduleFk
   */
  ScheduleFk?: number | null;

  /**
   * SearchPattern
   */
  SearchPattern?: string | null;

  /**
   * SiteFk
   */
  SiteFk?: number | null;

  /**
   * StockFk
   */
  StockFk?: number | null;

  /**
   * TrsRequisitionFk
   */
  TrsRequisitionFk?: number | null;

  /**
   * TypeFk
   */
  TypeFk?: number | null;

  /**
   * UomFk
   */
  UomFk: number;

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
