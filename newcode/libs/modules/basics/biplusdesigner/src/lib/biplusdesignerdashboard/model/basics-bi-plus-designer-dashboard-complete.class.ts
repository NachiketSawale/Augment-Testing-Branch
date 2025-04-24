/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IDashboardEntity } from './entities/dashboard-entity.interface';

export class BasicsBiPlusDesignerDashboardComplete implements CompleteIdentification<IDashboardEntity> {
	public Id: number = 0;

	public Datas: IDashboardEntity[] | null = [];
}
