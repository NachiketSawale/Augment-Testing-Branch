/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IMdcContrColumnPropDefEntity } from './entities/mdc-contr-column-prop-def-entity.interface';
import { IMdcContrConfigHeaderEntity } from './entities/mdc-contr-config-header-entity.interface';
import { IMdcContrFormulaPropDefEntity } from './entities/mdc-contr-formula-prop-def-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';

export class MdcContrConfigComplete implements CompleteIdentification<IMdcContrColumnPropDefEntity>{

 /*
  * MdcContrColumnPropDefs
  */
  public MdcContrColumnPropDefs!: IMdcContrColumnPropDefEntity[] | null;

 /*
  * MdcContrConfigHeader
  */
  public MdcContrConfigHeader!: IMdcContrConfigHeaderEntity | null;

 /*
  * MdcContrFormulaPropDefs
  */
  public MdcContrFormulaPropDefs!: IMdcContrFormulaPropDefEntity[] | null;
}
