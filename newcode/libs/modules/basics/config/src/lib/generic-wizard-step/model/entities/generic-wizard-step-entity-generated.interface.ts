/*
 * Copyright(c) RIB Software GmbH
 */

// import { IGenericWizardStepScriptEntity } from './generic-wizard-step-script-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IGenericWizardStepEntityGenerated extends IEntityBase {

  /*
   * AutoSave
   */
  AutoSave?: boolean | null;

  /*
   * CommentInfo
   */
  CommentInfo?: IDescriptionInfo | null;

  /*
   * GenericWizardInstanceFk
   */
  GenericWizardInstanceFk?: number | null;

  /*
   * GenericWizardStepFk
   */
  GenericWizardStepFk?: number | null;

  /*
   * GenericWizardStepTypeFk
   */
  GenericWizardStepTypeFk?: number | null;

  /*
   * GenwizardStepscriptEntities
   */
  // GenwizardStepscriptEntities?: IGenericWizardStepScriptEntity[] | null;

  /*
   * Id
   */
  Id?: number | null;

  /*
   * IsHidden
   */
  IsHidden?: boolean | null;

  /*
   * Remark
   */
  Remark?: string | null;

  /*
   * Sorting
   */
  Sorting?: number | null;

  /*
   * TextFooter
   */
  TextFooter?: string | null;

  /*
   * TextHeader
   */
  TextHeader?: string | null;

  /*
   * TitleInfo
   */
  TitleInfo?: IDescriptionInfo | null;
}
