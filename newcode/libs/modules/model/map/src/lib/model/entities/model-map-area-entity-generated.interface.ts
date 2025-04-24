/*
 * Copyright(c) RIB Software GmbH
 */

//import { IModelFileEntity } from './model-file-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IModelMapAreaEntityGenerated extends IEntityBase {

    /*
	 * modelFk
	 */
	ModelFk: number;
    /*
	 * number
	 */
    Id: number;
    /*
	 * MapFk
	 */
    MapFk:number;
    /*
	 * LocationFk
	 */
    LocationFk:number;
    /*
	 * description
	 */
    Description?: string;
    
}
