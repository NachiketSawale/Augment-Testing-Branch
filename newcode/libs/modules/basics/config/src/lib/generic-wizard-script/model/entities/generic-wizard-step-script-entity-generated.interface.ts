/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IGenericWizardStepScriptEntityGenerated extends IEntityBase {

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * GenericWizardContainerFk
 */
  GenericWizardContainerFk?: number | null;

/*
 * GenericWizardContainerPropertyFk
 */
  GenericWizardContainerPropertyFk?: number | null;

/*
 * GenericWizardInstanceFk
 */
  GenericWizardInstanceFk?: number | null;

/*
 * GenericWizardScriptTypeFk
 */
  GenericWizardScriptTypeFk?: number | null;

/*
 * GenericWizardStepFk
 */
  GenericWizardStepFk?: number | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * Remark
 */
  Remark?: string | null;

/*
 * ScriptAction
 */
  ScriptAction?: string | null;
}
