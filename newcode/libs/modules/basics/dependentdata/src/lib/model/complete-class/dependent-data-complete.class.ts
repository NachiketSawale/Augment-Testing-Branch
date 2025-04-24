/*
 * Copyright(c) RIB Software GmbH
 */
import { IDependentDataColumnEntity } from '../entities/dependent-data-column-entity.interface';
import { IDependentDataEntity } from '../entities/dependent-data-entity.interface';
import { IUserChartEntity } from '../entities/user-chart-entity.interface';
import { UserChartComplete } from './user-chart-complete.class';

import { CompleteIdentification } from '@libs/platform/common';

export class DependentDataComplete implements CompleteIdentification<IDependentDataEntity> {

	/**
	 * DependentData
	 */
	public DependentData?: IDependentDataEntity | null;

	/**
	 * DependentDataChartToDelete
	 */
	public DependentDataChartToDelete?: IUserChartEntity[] | null = [];

	/**
	 * DependentDataChartToSave
	 */
	public DependentDataChartToSave?: UserChartComplete[] | null = [];

	/**
	 * DependentDataColumnsToDelete
	 */
	public DependentDataColumnsToDelete?: IDependentDataColumnEntity[] | null = [];

	/**
	 * DependentDataColumnsToSave
	 */
	public DependentDataColumnsToSave?: IDependentDataColumnEntity[] | null = [];

	/**
	 * EntitiesCount
	 */
	public EntitiesCount: number = 0;

	/**
	 * MainItemId
	 */
	public MainItemId: number = 0;
}
