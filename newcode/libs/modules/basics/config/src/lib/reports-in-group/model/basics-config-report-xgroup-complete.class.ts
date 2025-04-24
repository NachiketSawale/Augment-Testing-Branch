/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';

import { IReport2GroupEntity } from './entities/report-2group-entity.interface';

/**
 * basics config report xgroup complete class.
 */
export class BasicsConfigReportXGroupComplete implements CompleteIdentification<IReport2GroupEntity> {

	public MainItemId: number = 0;

	public Datas: IReport2GroupEntity[] | null = [];


}
