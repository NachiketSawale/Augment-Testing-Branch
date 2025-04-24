/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { ICosGlobalParamEntity } from '@libs/constructionsystem/shared';
import { CompleteIdentification } from '@libs/platform/common';
import { ICosGlobalParamValueEntity } from '@libs/constructionsystem/shared';

export class CosGlobalParamComplete implements CompleteIdentification<ICosGlobalParamEntity> {
	/**
	 * CosGlobalParamValueToDelete
	 */
	public CosGlobalParamValueToDelete?: ICosGlobalParamValueEntity[] | null = [];

	/**
	 * CosGlobalParamValueToSave
	 */
	public CosGlobalParamValueToSave?: ICosGlobalParamValueEntity[] | null = [];

	/*
	 * CosGlobalParams
	 */
	public CosGlobalParams?: ICosGlobalParamEntity[] | null = [];

	/*
	 * EntitiesCount
	 */
	public EntitiesCount: number = 0;

	/*
	 * MainItemId
	 */
	public MainItemId: number = 0;
}
