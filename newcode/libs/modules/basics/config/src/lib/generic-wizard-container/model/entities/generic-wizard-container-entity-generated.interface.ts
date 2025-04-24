/*
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

/**
 * Basics Config Generic Wizard Container Generated Interface 
 */
export interface IGenericWizardContainerEntityGenerated extends IEntityBase {

/*
 * CanInsert
 */
  CanInsert?: boolean | null;

/*
 * CommentInfo
 */
  CommentInfo?: IDescriptionInfo | null;

/*
 * ContainerUuid
 */
  ContainerUuid?: string | null;

/*
 * FilearchivedocFk
 */
  FilearchivedocFk?: number | null;

/*
 * GenericWizardInstanceFk
 */
  GenericWizardInstanceFk?: number | null;

/*
 * GenericWizardStepFk
 */
  GenericWizardStepFk?: number | null;

/*
 * GenwizardStepscriptEntities
 */
  // GenwizardStepscriptEntities?: IGenericWizardStepScriptEntity[] | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * IsGrid
 */
  IsGrid?: boolean | null;

/*
 * Remark
 */
  Remark?: string | null;

/*
 * Sorting
 */
  Sorting?: number | null;

/*
 * TitleInfo
 */
  TitleInfo?: IDescriptionInfo | null;
}
