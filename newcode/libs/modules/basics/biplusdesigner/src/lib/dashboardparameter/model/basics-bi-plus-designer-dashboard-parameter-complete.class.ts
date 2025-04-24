/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IDashboardParameterEntity } from '../../biplusdesignerdashboard/model/entities/dashboard-parameter-entity.interface';

export class BasicsBiPlusDesignerDashboardParameterComplete implements CompleteIdentification<IDashboardParameterEntity> {
	public Id: number = 0;

	public Datas: IDashboardParameterEntity[] | null = [];
}
