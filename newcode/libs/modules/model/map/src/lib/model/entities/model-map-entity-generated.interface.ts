/*
 * Copyright(c) RIB Software GmbH
 */

//import { IModelFileEntity } from './model-file-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IModelMapEntityGenerated extends IEntityBase {

    /*
	 * modelFk
	 */
	ModelFk: number;
    /*
	 * number
	 */
    Id: number;
    /*
	 * description
	 */
    Description?: string;
    /*
	 * isDefault
	 */
    IsDefault: boolean;
}
