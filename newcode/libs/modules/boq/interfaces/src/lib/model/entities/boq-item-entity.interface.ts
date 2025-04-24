/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBoqItemEntityGenerated } from './boq-item-entity-generated.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';


export interface IBoqItemEntity extends IBoqItemEntityGenerated {

    // Property needed for handling UPD value calculation
    isUDPChanged?: boolean;

    // This index signature shall help to be able to access the properties of IBoqItemEntity via an index like "boqItem["propertyName"]"
    [key: string]: string | number | boolean | Date | IBoqItemEntity | IDescriptionInfo | IEntityBase | Array<IEntityBase> | null | undefined | (() => boolean);
}