/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IBoqSurchargedItemEntity } from '@libs/boq/interfaces';

export class BoqSurchargedComplete implements CompleteIdentification<IBoqSurchargedItemEntity>{

 /*
  * BoqSurcharged
  */
  public BoqSurcharged?: IBoqSurchargedItemEntity | null;

 /*
  * EntitiesCount
  */
  public EntitiesCount?: number | null = 10;

 /*
  * MainItemId
  */
  public MainItemId?: number | null = 10;
}
