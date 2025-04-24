/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEngStackEntity } from './entities/eng-stack-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';

export class EngStackComplete implements CompleteIdentification<IEngStackEntity> {

	/*
	 * BundleToDelete
	 */
	//TODO: public BundleToDelete!: IIIdentifyable[] | null;

	/*
	 * BundleToSave
	 */
	//TODO: public BundleToSave!: IIIdentifyable[] | null;

	/*
	 * MainItemId
	 */
	public MainItemId!: number | null;

	/*
	 * ProductDescriptionToDelete
	 */
	//TODO: public ProductDescriptionToDelete!: IIIdentifyable[] | null;

	/*
	 * ProductDescriptionToSave
	 */
	//TODO: public ProductDescriptionToSave!: IIIdentifyable[] | null;

	/*
	 * Stacks
	 */
	public Stacks!: IEngStackEntity | null;
}
