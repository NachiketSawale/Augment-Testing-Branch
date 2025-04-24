/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IDashboard2GroupEntity } from './entities/dashboard-2group-entity.interface';

/**
 * Basicsbiplusdesigner Dashboard to Group Entity Complete Class
 */
export class BasicsBiPlusDesignerDashboard2GroupComplete implements CompleteIdentification<IDashboard2GroupEntity>{

	public Id: number = 0;

	public Datas: IDashboard2GroupEntity[] | null = [];

	
}
