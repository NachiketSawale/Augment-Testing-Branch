/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IResourceEquipmentPlant2EstimatePriceListLineItemEntity } from '@libs/resource/interfaces';

export class ResourceEquipmentPlant2EstimatePriceListLineItemUpdate implements CompleteIdentification<IResourceEquipmentPlant2EstimatePriceListLineItemEntity> {
	public MainItemId: number = 0;
	public Plant2EstimatePriceListLineItems: IResourceEquipmentPlant2EstimatePriceListLineItemEntity[] | null = [];
}