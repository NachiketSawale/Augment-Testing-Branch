/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEngCadImportConfigEntity } from './entities/cad-import-config-entity.interface';
import { IEngCadValidationEntity } from './entities/cad-validation-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';

export class EngCadImportConfigComplete implements CompleteIdentification<IEngCadImportConfigEntity>{

 /*
  * MainItemId
  */
  public MainItemId!: number | null;

 /*
  * PpsEngineeringCadImports
  */
  public PpsEngineeringCadImports!: IEngCadImportConfigEntity[] | null;

 /*
  * PpsEngineeringCadValidationsToDelete
  */
  public PpsEngineeringCadValidationsToDelete!: IEngCadValidationEntity[] | null;

 /*
  * PpsEngineeringCadValidationsToSave
  */
  public PpsEngineeringCadValidationsToSave!: IEngCadValidationEntity[] | null;
}
