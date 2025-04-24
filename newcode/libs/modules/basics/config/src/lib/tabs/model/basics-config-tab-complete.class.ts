/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IModuleTabEntity } from './entities/module-tab-entity.interface';

export class BasicsConfigTabComplete implements CompleteIdentification<IModuleTabEntity> {
	public MainItemId: number = 0;

	public Datas: IModuleTabEntity[] | null = [];
}
