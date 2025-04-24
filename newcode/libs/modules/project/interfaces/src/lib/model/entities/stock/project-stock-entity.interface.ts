/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IProjectStockEntityGenerated } from './project-stock-entity-generated.interface';
import { IAddressEntity } from '@libs/ui/map';

export interface IProjectStockEntity extends IProjectStockEntityGenerated {

	AddressEntity?: IAddressEntity | null
}
