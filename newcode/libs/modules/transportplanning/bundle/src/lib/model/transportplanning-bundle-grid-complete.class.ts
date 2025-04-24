/*
 * Copyright(c) RIB Software GmbH
 */

import { IBundleEntity } from './entities/bundle-entity.interface';
import { IPPSEventEntity, IPpsEventParentComplete, IPpsProductEntityGenerated, PPSEventComplete, PpsProductCompleteEntity } from '@libs/productionplanning/shared';

export class TransportplanningBundleGridComplete implements IPpsEventParentComplete<IBundleEntity> {
	public MainItemId: number = 0;

	public Bundles: IBundleEntity[] | null = [];

	public ProductToSave: PpsProductCompleteEntity[] | null = [];
	public ProductToDelete: IPpsProductEntityGenerated[] | null = [];

	public EventsToSave: PPSEventComplete[] | null = [];
	public EventsToDelete: IPPSEventEntity[] | null = [];
}
