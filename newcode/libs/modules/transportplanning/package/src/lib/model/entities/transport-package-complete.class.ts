/*
 * Copyright(c) RIB Software GmbH
 */

import { ITransportPackageEntityGenerated } from './transport-package-entity-generated.interface';
import { IPPSEventEntity, IPpsEventParentComplete, PPSEventComplete } from '@libs/productionplanning/shared';

export class TransportPackageComplete implements IPpsEventParentComplete<ITransportPackageEntityGenerated> {
	/**
	 * MainItemId
	 */
	public MainItemId!: number | null;

	/**
	 * TransportPackage
	 */
	public EventsToSave: PPSEventComplete[] | null = [];

	/**
	 * TransportPackage
	 */
	public EventsToDelete: IPPSEventEntity[] | null = [];

	/**
	 * TransportPackage
	 */
	public TransportPackage?: ITransportPackageEntityGenerated[] | null = [];
}