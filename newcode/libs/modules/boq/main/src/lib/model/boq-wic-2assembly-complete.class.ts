/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IBoqWic2assemblyEntity } from '@libs/boq/interfaces';

export class BoqWic2AssemblyComplete implements CompleteIdentification<IBoqWic2assemblyEntity>{

 /*
  * BoqMainWic2Assembly
  */
  public BoqMainWic2Assembly?: IBoqWic2assemblyEntity | null;

 /*
  * EntitiesCount
  */
  public EntitiesCount?: number | null = 10;

 /*
  * MainItemId
  */
  public MainItemId?: number | null = 10;
}
