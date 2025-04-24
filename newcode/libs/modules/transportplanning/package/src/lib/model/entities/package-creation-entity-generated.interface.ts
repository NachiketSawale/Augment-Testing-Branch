/*
 * Copyright(c) RIB Software GmbH
 */

import { ITrsRouteObject } from './trs-route-object.interface';
import { ITransportPackageEntity } from './transport-package-entity.interface';

export interface IPackageCreationEntityGenerated {
	/**
	 * Id
	 */
	Id: number;

	/**
	 * MainItem
	 */
	MainItem?: ITrsRouteObject | null;

	/**
	 * MainItemId
	 */
	MainItemId?: number | null;

	/**
	 * Parent
	 */
	Parent?: ITransportPackageEntity | null;

	/**
	 * ParentId
	 */
	ParentId?: number | null;
}
