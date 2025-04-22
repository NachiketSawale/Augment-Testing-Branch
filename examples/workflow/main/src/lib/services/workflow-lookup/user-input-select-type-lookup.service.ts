/*
 * Copyright(c) RIB Software GmbH
 */

import { UiCommonLookupItemsDataService } from '@libs/ui/common';
import { UserInputConfig } from '../../model/user-input-config.interface';
import { IConfigSelectType } from '../../model/interfaces/workflow-advance-types/config-select-type.interface';

/**
 * This service is responsible for displaying the configured items of "select" type input action.
 */
export class UserInputSelectTypeLookupService<TEntity extends object> extends UiCommonLookupItemsDataService<IConfigSelectType, TEntity> {

	public constructor(item: UserInputConfig) {
		const items = (item.options as unknown as IConfigSelectType);

		let displayMember: string = '';
		let valueMember: string = '';
		const ModifiedItems: (Record<string, string> & { Id: string })[] = [];
		if (typeof items.items === 'string') {
			items.items = JSON.parse(items.items) as Record<string, string>[];
		}

		items.items.forEach((item, index) => {
			ModifiedItems.push({ ...item, Id: index.toString() });
		});

		displayMember = items.displayMember;
		items.id = items.valueMember;
		valueMember = items.id;

		/*Note : in case of expert mode for type "select", if either displayMember or valueMember are
		not configured, we can pick the key names from "items" array itself in order to avoid standard
		lookup configuration issue.*/

		// const findKeys=Object.keys(items.items[0]);
		//const displayMember=items.displayMember?items.displayMember:findKeys[0];
		super(ModifiedItems as [], { uuid: '', displayMember, valueMember, idProperty: valueMember });
	}

}
