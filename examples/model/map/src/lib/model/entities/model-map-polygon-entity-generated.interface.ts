/*
 * Copyright(c) RIB Software GmbH
 */

//import { IModelFileEntity } from './model-file-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IModelMapPolygonEntityGenerated extends IEntityBase {

    /*
	 * modelFk
	 */
	ModelFk: number;
    /*
	 * number
	 */
    Id: number;
    /*
	 * MapAreaFk
	 */
    MapAreaFk:number;
    /*
	 * LocationFk
	 */
    LocationFk:number;
    /*
	 * description
	 */
    Description?: string;
    /*
	 * Points
	 */
    Points?: string;
    
}
