/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IPPSItemEntity } from './pps-item-entity.interface';
import {IEntityBase} from '@libs/platform/common';

export interface ICreateSubPUsRequestGenerated {

/*
 * Config
 */
  Config?: IEntityBase | null;

/*
 * MdcProductDescriptionFk
 */
  MdcProductDescriptionFk?: number | null;

/*
 * OpenQuantity
 */
  OpenQuantity?: number | null;

/*
 * ParentItem
 */
  ParentItem?: IPPSItemEntity | null;

/*
 * PpsProductTemplateCode
 */
  PpsProductTemplateCode?: string | null;

/*
 * ProductCreationNumber
 */
  ProductCreationNumber?: number | null;
}
