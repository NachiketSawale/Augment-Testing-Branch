/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IFilterStructures } from '../../model/entities/filter-request/instance-filter-structures.interface';
import { FilterMethod } from '../../model/enums/cos-filter-method.enum';

/**
 * filter service of module constructionsystem main
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainFilterService {
	private filters: IFilterStructures = {
		Method: FilterMethod.Assigned,
	};

	public getFilters() {
		return this.filters;
	}
}
