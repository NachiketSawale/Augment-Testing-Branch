/*
 * Copyright(c) RIB Software GmbH
 */


// import { IWizard2GroupEntity } from './wizard-2group-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { IModuleEntity } from '../../../modules/model/entities/module-entity.interface';

export interface IWizardGroupEntityGenerated extends IEntityBase {

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
   * Icon
   */
  Icon?: number | null;

  /*
   * Id
   */
  Id?: number | null;

  /*
   * IsDefault
   */
  IsDefault?: boolean | null;

  /*
   * IsVisible
   */
  IsVisible?: boolean | null;

  /*
   * ModuleEntity
   */
  ModuleEntity?: IModuleEntity | null;

  /*
   * ModuleFk
   */
  ModuleFk?: number | null;

  /*
   * Name
   */
  Name?: IDescriptionInfo | null;

  /*
   * Sorting
   */
  Sorting?: number | null;

  /*
   * Wizard2GroupEntities
   */
  // Wizard2GroupEntities?: IWizard2GroupEntity[] | null;
}
