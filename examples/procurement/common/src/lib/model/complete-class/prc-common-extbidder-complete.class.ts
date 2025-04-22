/*
 * Copyright(c) RIB Software GmbH
 */


import { IPrcCommonExtBidder2contactEntity, IPrcPackage2ExtBidderEntity } from '../entities';

import { CompleteIdentification } from '@libs/platform/common';

export class PrcCommonExtBidderComplete implements CompleteIdentification<IPrcPackage2ExtBidderEntity>{

	/**
	 * MainItemId
	 */
	public MainItemId: number = 0;

	/**
	 * PrcPackage2ExtBidder
	 */
	public PrcPackage2ExtBidder?: IPrcPackage2ExtBidderEntity | null;

	/**
	 * PrcPackage2ExtBpContactToSave
	 */
	public PrcPackage2ExtBpContactToSave?: IPrcCommonExtBidder2contactEntity[] | null = [];

	/**
	 * PrcPackage2ExtBpContactToDelete
	 */
	public PrcPackage2ExtBpContactToDelete?: IPrcCommonExtBidder2contactEntity[] | null = [];
}
