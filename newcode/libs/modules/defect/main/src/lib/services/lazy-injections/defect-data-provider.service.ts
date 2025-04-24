/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { DefectMainHeaderDataService } from '../defect-main-header-data.service';
import { DEFECT_DATA_PROVIDER, IDefectHeaderDataProvider, IDfmDefectEntity } from '@libs/defect/interfaces';

@Injectable({
	providedIn: 'root',
})
@LazyInjectable<IDefectHeaderDataProvider<IDfmDefectEntity>>({
	token: DEFECT_DATA_PROVIDER,
	useAngularInjection: true,
})
export class DefectHeaderDataProviderService implements IDefectHeaderDataProvider<IDfmDefectEntity> {
	private readonly service = inject(DefectMainHeaderDataService);

	public refreshOnlySelected(selected: IDfmDefectEntity[]): Promise<IDfmDefectEntity[]> {
		return this.service.refreshOnlySelected(selected);
	}
}
