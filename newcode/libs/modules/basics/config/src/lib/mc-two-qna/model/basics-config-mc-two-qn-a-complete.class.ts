/*
 * Copyright(c) RIB Software GmbH
 */


import { CompleteIdentification } from '@libs/platform/common';

import { IMcTwoQnAEntity } from './entities/mc-two-qn-aentity.interface';

/**
 * Basics config McTwo QnA complete class
 */
export class BasicsConfigMcTwoQnAComplete implements CompleteIdentification<IMcTwoQnAEntity> {

	public MainItemId: number = 0;

	public Datas: IMcTwoQnAEntity[] | null = [];


}
