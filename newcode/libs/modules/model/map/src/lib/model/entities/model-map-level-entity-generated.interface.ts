/*
 * Copyright(c) RIB Software GmbH
 */

//import { IModelFileEntity } from './model-file-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IModelMapLevelEntityGenerated extends IEntityBase {
/*
   * modelFk - integer
   */
ModelFk: number;
  
/*
 * id - integer
 */
Id: number;

/*
 * mapAreaFk - integer
 */
MapAreaFk: number;

/*
 * prjDocumentFk - integer (optional)
 */
PrjDocumentFk?: number;

/*
 * locationFk - integer (optional)
 */
LocationFk?: number;

/*
 * description - string (optional)
 */
Description?: string;

/*
 * zMax - decimal (optional)
 */
ZMax?: number;

/*
 * zMin - decimal (optional)
 */
ZMin?: number;

/*
 * orientationAngle - decimal
 */
OrientationAngle: number;

/*
 * translationX - decimal
 */
TranslationX: number;

/*
 * translationY - decimal
 */
TranslationY: number;

/*
 * scale - decimal
 */
Scale: number;

/*
 * zLevel - decimal (optional)
 */
ZLevel?: number;

/*
 * viewingDistance - decimal (optional)
 */
ViewingDistance?: number;

/*
 * isUp - boolean
 */
IsUp: boolean;

/*
 * vectorData - string (optional)
 */
VectorData?: string;

/*
 * alignmentPoint1 - string (optional)
 */
AlignmentPoint1?: string;

/*
 * alignmentPoint2 - string (optional)
 */
AlignmentPoint2?: string;
}
