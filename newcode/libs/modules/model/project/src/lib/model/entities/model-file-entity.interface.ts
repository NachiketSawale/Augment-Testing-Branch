/*
 * Copyright(c) RIB Software GmbH
 */

import { ConcreteMenuItem } from '@libs/ui/common';
import { IModelFileEntityGenerated } from './model-file-entity-generated.interface';

export interface IModelFileEntity extends IModelFileEntityGenerated {

	status?: ConcreteMenuItem<IModelFileEntity>[];

	statusText?: string;
}
