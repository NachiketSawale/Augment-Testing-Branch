/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedChangeStatusService } from '../../status-change/services/change-status.service';
import { IUserFormDataEntity } from '../model/entities/user-form-data-entity.interface';
import { IStatusChangeOptions } from '../../status-change/model/interfaces/status-change-options.interface';
import { IEntitySelection } from '@libs/platform/data-access';

/**
 * Form data status service.
 */
export class BasicsSharedUserFormDataStatusService extends BasicsSharedChangeStatusService<IUserFormDataEntity, object, object> {

	/**
	 *
	 * @param dataService The form data service.
	 */
	public constructor(
		protected readonly dataService: IEntitySelection<IUserFormDataEntity>
	) {
		super();
	}

	protected statusConfiguration: IStatusChangeOptions<object, object> = {
		title: 'Change Form Data Status',
		guid: '756badc830b74fdcbf6b6ddc3f92f7bd',
		isSimpleStatus: false,
		statusName: 'formdata',
		checkAccessRight: true,
		statusField: 'FormDataStatusFk',
		updateUrl: 'basics/userform/data/changestatus'
	};

	public override beforeStatusChanged(): Promise<boolean> {
		// TODO: It can be customized here
		return Promise.resolve(true);
	}

	public override afterStatusChanged() {
		// TODO-DRIZZLE: To be implemented.
	}
}