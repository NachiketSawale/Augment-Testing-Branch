/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IModelObjectInfoGenerated } from './model-object-info-generated.interface';

export interface IModelObjectInfo extends IModelObjectInfoGenerated {
	index: number;
    Name: string;
    image:string;
    Id: number;
    parentId: number;

}
