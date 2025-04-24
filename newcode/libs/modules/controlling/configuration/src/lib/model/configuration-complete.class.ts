/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IMdcContrColumnPropDefEntity } from './entities/mdc-contr-column-prop-def-entity.interface';
import { IMdcContrFormulaPropDefEntity } from './entities/mdc-contr-formula-prop-def-entity.interface';
import { IMdcContrChartEntity } from './entities/mdc-contr-chart-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';

export class ConfigurationComplete implements CompleteIdentification<IMdcContrColumnPropDefEntity>{

 /*
  * ContrColumnPropDefToSave
  */
  public ContrColumnPropDefToSave!: IMdcContrColumnPropDefEntity[] | null;

 /*
  * ContrFormulaPropDefToSave
  */
  public ContrFormulaPropDefToSave!: IMdcContrFormulaPropDefEntity[] | null;

 /*
  * MdcContrCharToSave
  */
  public MdcContrCharToSave!: IMdcContrChartEntity[] | null;
}
