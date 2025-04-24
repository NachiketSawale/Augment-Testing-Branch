/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstAssemblyCatEntity } from '@libs/estimate/interfaces';
import { CompleteIdentification } from '@libs/platform/common';


export class EstAssemblyCatComplete implements CompleteIdentification<IEstAssemblyCatEntity>{

 /*
  * EntitiesCount
  */
  public EntitiesCount!: number | null;

 /*
  * EstAssemblyCat
  */
  public EstAssemblyCat!: IEstAssemblyCatEntity | null;

 /*
  * Id
  */
  public Id!: number | null;

 /*
  * MainItemId
  */
  public MainItemId!: number | null;
}
