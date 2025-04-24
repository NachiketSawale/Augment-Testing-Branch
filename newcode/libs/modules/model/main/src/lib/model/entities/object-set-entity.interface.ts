/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IObjectSetEntityGenerated } from './object-set-entity-generated.interface';

export interface IObjectSetEntity extends IObjectSetEntityGenerated {

    CompoundId: string;

    selModelRole: string;
}
