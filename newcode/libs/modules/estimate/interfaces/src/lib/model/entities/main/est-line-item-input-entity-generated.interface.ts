/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IModelFeature } from './model-feature.interface';

export interface IEstLineItemInputEntityGenerated {

/*
 * EstHeaderFk
 */
  EstHeaderFk?: number | null;

/*
 * ModelFeature
 */
  ModelFeature?: IModelFeature | null;

/*
 * ProjectFk
 */
  ProjectFk?: number | null;

/*
 * SelectLevel
 */
  SelectLevel?: string | null;
}
