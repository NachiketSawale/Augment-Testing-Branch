/*
 * Copyright(c) RIB Software GmbH
 */

import { IHsqChecklist2formEntity } from './hsq-checklist-2-form-entity.interface';
import { IHsqChecklistEntity } from './hsq-checklist-entity.interface';
import { IHsqChkListTemplateEntity } from './hsq-chk-list-template-entity.interface';
import { IPesHeaderEntity } from './pes-header-entity.interface';
import { IProjectEntity } from './project-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IHsqChecklistEntityGenerated extends IEntityBase {

  /**
   * ClerkChkFk
   */
  ClerkChkFk?: number | null;

  /**
   * ClerkHsqFk
   */
  ClerkHsqFk?: number | null;

  /**
   * Code
   */
  Code: string;

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * DatePerformed
   */
  DatePerformed?: Date | string | null;

  /**
   * DateReceived
   */
  DateReceived?: Date | string | null;

  /**
   * DateRequired
   */
  DateRequired?: Date | string | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DescriptionTr
   */
  DescriptionTr?: number | null;

  /**
   * HsqChecklist2formEntities
   */
  HsqChecklist2formEntities?: IHsqChecklist2formEntity[] | null;

  /**
   * HsqChecklistEntities_HsqChecklistFk
   */
  HsqChecklistEntities_HsqChecklistFk?: IHsqChecklistEntity[] | null;

  /**
   * HsqChecklistEntity_HsqChecklistFk
   */
  HsqChecklistEntity_HsqChecklistFk?: IHsqChecklistEntity | null;

  /**
   * HsqChecklistFk
   */
  HsqChecklistFk?: number | null;

  /**
   * HsqChecklisttemplateFk
   */
  HsqChecklisttemplateFk?: number | null;

  /**
   * HsqChklisttemplateEntity
   */
  HsqChklisttemplateEntity?: IHsqChkListTemplateEntity | null;

  /**
   * HsqChklisttypeFk
   */
  HsqChklisttypeFk: number;

  /**
   * HsqChlStatusFk
   */
  HsqChlStatusFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * PesHeaderEntity
   */
  PesHeaderEntity?: IPesHeaderEntity | null;

  /**
   * PesHeaderFk
   */
  PesHeaderFk?: number | null;

  /**
   * PrcStructureFk
   */
  PrcStructureFk?: number | null;

  /**
   * ProjectEntity
   */
  ProjectEntity?: IProjectEntity | null;

  /**
   * ProjectFk
   */
  ProjectFk?: number | null;

  /**
   * Userdefined1
   */
  Userdefined1?: string | null;

  /**
   * Userdefined2
   */
  Userdefined2?: string | null;

  /**
   * Userdefined3
   */
  Userdefined3?: string | null;

  /**
   * Userdefined4
   */
  Userdefined4?: string | null;

  /**
   * Userdefined5
   */
  Userdefined5?: string | null;
}
