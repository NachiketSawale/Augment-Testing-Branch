/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBoqStructureEntityGenerated } from './boq-structure-entity-generated.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IBoqStructureEntity extends IBoqStructureEntityGenerated {

    BoqTypeId?: number;

    IsChecked?: boolean;

    BoqCatAssignTypeId?: number;

    EditBoqCatalogConfigType?: boolean;

    BoqCatalogAssignDesc?: string;

    // This index signature shall help to be able to access the properties of IBoqStructureEntity via an index like "boqStructure["propertyName"]"
    [key: string]: string | number | boolean | Date | IEntityBase | Array<IEntityBase> | null | undefined | (() => boolean);
}
