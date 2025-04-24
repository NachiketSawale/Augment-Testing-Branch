/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import { FieldType, ILookupConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { ICertifiedEmployeeEntity } from '@libs/timekeeping/interfaces';

/**
 * Certificate lookup service
 */
@Injectable({
	providedIn: 'root'
})

export class TimekeepingEmployeeCertificateLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<ICertifiedEmployeeEntity, TEntity> {

	public constructor() {
		const endpoint = {httpRead: {route:'timekeeping/certificate/',endPointRead:'lookup'}};
		const config: ILookupConfig<ICertifiedEmployeeEntity> =
			{
				uuid: '9bda1d26ecdf4d89be13cf97ddfbf0d9',
				valueMember: 'Id',
				displayMember: 'Description',
				gridConfig:{
					columns: [
						{
							id: 'Description',
							model: 'Description',
							type: FieldType.Description,
							label: {text: 'Description'},
							sortable: true,
							visible: true,
							readonly: true,
							width: 200
						}
					]
				}

			};

		super(endpoint, config);
	}

}