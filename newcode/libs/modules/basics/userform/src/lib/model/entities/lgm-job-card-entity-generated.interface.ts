/*
 * Copyright(c) RIB Software GmbH
 */

import { IResRequisitionEntity } from './res-requisition-entity.interface';
import { IResReservationEntity } from './res-reservation-entity.interface';
import { IResResourceEntity } from './res-resource-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface ILgmJobCardEntityGenerated extends IEntityBase {

  /**
   * Actualfinish
   */
  Actualfinish?: Date | string | null;

  /**
   * Actualstart
   */
  Actualstart?: Date | string | null;

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
   * Description
   */
  Description?: string | null;

  /**
   * EtmDivisionFk
   */
  EtmDivisionFk: number;

  /**
   * EtmWorkoperationtypeFk
   */
  EtmWorkoperationtypeFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * LgmContextFk
   */
  LgmContextFk: number;

  /**
   * LgmDispatchHeaderFk
   */
  LgmDispatchHeaderFk?: number | null;

  /**
   * LgmJobFk
   */
  LgmJobFk: number;

  /**
   * LgmJobPerformingFk
   */
  LgmJobPerformingFk?: number | null;

  /**
   * LgmJobcardareaFk
   */
  LgmJobcardareaFk?: number | null;

  /**
   * LgmJobcardgroupFk
   */
  LgmJobcardgroupFk?: number | null;

  /**
   * LgmJobcardpriorityFk
   */
  LgmJobcardpriorityFk?: number | null;

  /**
   * LgmJobcardstatusFk
   */
  LgmJobcardstatusFk: number;

  /**
   * LgmJobcardtemplateFk
   */
  LgmJobcardtemplateFk?: number | null;

  /**
   * Meterreading
   */
  Meterreading?: number | null;

  /**
   * Plannedfinish
   */
  Plannedfinish?: Date | string | null;

  /**
   * Plannedstart
   */
  Plannedstart?: Date | string | null;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * ResRequisitionEntity
   */
  ResRequisitionEntity?: IResRequisitionEntity | null;

  /**
   * ResRequisitionFk
   */
  ResRequisitionFk?: number | null;

  /**
   * ResReservationEntity
   */
  ResReservationEntity?: IResReservationEntity | null;

  /**
   * ResReservationFk
   */
  ResReservationFk?: number | null;

  /**
   * ResResourceEntity
   */
  ResResourceEntity?: IResResourceEntity | null;

  /**
   * ResResourceFk
   */
  ResResourceFk?: number | null;

  /**
   * ReservationId
   */
  ReservationId?: number | null;

  /**
   * RubricCategoryFk
   */
  RubricCategoryFk: number;

  /**
   * SearchPattern
   */
  SearchPattern?: string | null;

  /**
   * Userdefineddate01
   */
  Userdefineddate01?: Date | string | null;

  /**
   * Userdefineddate02
   */
  Userdefineddate02?: Date | string | null;

  /**
   * Userdefineddate03
   */
  Userdefineddate03?: Date | string | null;

  /**
   * Userdefineddate04
   */
  Userdefineddate04?: Date | string | null;

  /**
   * Userdefineddate05
   */
  Userdefineddate05?: Date | string | null;

  /**
   * Userdefinednumber01
   */
  Userdefinednumber01?: number | null;

  /**
   * Userdefinednumber02
   */
  Userdefinednumber02?: number | null;

  /**
   * Userdefinednumber03
   */
  Userdefinednumber03?: number | null;

  /**
   * Userdefinednumber04
   */
  Userdefinednumber04?: number | null;

  /**
   * Userdefinednumber05
   */
  Userdefinednumber05?: number | null;

  /**
   * Userdefinedtext01
   */
  Userdefinedtext01?: string | null;

  /**
   * Userdefinedtext02
   */
  Userdefinedtext02?: string | null;

  /**
   * Userdefinedtext03
   */
  Userdefinedtext03?: string | null;

  /**
   * Userdefinedtext04
   */
  Userdefinedtext04?: string | null;

  /**
   * Userdefinedtext05
   */
  Userdefinedtext05?: string | null;
}
