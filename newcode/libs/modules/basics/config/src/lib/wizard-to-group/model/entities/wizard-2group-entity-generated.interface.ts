/*
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { IWizardGroupEntity } from '../../../wizard-group/model/entities/wizard-group-entity.interface';

export interface IWizard2GroupEntityGenerated extends IEntityBase {

/*
 * AccessRightDescriptor
 */
  AccessRightDescriptor?: string | null;

/*
 * AccessRightDescriptorFk
 */
  AccessRightDescriptorFk?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * GenwizardInstanceEntities
 */
  // GenwizardInstanceEntities?: IGenericWizardInstanceEntity[] | null;

/*
 * GroupWizardName
 */
  GroupWizardName?: string | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * IsVisible
 */
  IsVisible?: boolean | null;

/*
 * Name
 */
  Name?: IDescriptionInfo | null;

/*
 * Sorting
 */
  Sorting?: number | null;

/*
 * Visibility
 */
  Visibility?: number | null;

/*
 * Wizard2GroupPValueEntities
 */
  // Wizard2GroupPValueEntities?: IWizard2GroupPValueEntity[] | null;

/*
 * WizardEntity
 */
  // WizardEntity?: IWizardEntity | null;

/*
 * WizardFk
 */
  WizardFk?: number | null;

/*
 * WizardGroupEntity
 */
  WizardGroupEntity?: IWizardGroupEntity | null;

/*
 * WizardGroupFk
 */
  WizardGroupFk?: number | null;
}
