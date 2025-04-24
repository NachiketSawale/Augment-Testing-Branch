/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IMdcContrChartEntity } from './mdc-contr-chart-entity.interface';
import { IMdcContrFormulaPropDefEntity } from './mdc-contr-formula-prop-def-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IMdcContrConfigHeaderEntityGenerated extends IEntityBase {

/*
 * Id
 */
  Id?: number | null;

/*
 * MdcContextFk
 */
  MdcContextFk?: number | null;

/*
 * MdcContrChartEntities
 */
  MdcContrChartEntities?: IMdcContrChartEntity[] | null;

/*
 * MdcContrFormulaPropDefEntities
 */
  MdcContrFormulaPropDefEntities?: IMdcContrFormulaPropDefEntity[] | null;
}
