/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IModelAnnotationReferenceEntityGenerated extends IEntityBase {
   
    /*
     * Id
     */
    Id: number;

    /*
     * FromAnnotationFk
     */
    FromAnnotationFk?: number | null;

    /*
     * ToAnnotationFk
     */
    ToAnnotationFk?: number | null;

    /*
     * ReferenceTypeFk
     */
    ReferenceTypeFk?: number | null;

}
