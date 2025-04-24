/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { flatMap, get, set } from 'lodash';

export class BasicsMaterialFilterLayoutExtendHelper<T extends object> {

	public async ExtendLayout(layoutConfig: Promise<ILayoutConfiguration<T>>): Promise<ILayoutConfiguration<T>> {

		const config = await layoutConfig;

		const group = config.groups?.find((group) => group.gid === 'basicData');
		if (group) {
			group.attributes.push('IsChecked' as keyof T);
		} else {
			throw new Error('the layout should have a group with id basicData');
		}


		config.transientFields = [
			...config.transientFields || [],
			{
				id: 'IsChecked',
				readonly: false,
				model: 'IsChecked',
				type: FieldType.Boolean,
				headerChkbox: true,
				pinned: true,
			}
		];

		//Set all columns as readonly except 'IsChecked', still some workaround implement. Maybe framework can provide better solution in future
		(flatMap(config.groups, 'attributes') as string[])
			.filter((attr) => attr !== 'IsChecked')
			.forEach((attr) => {
				const overloads = get(config.overloads, attr);
				if (!overloads) {
					set(config.overloads!, attr, { readonly: true });
				} else {
					overloads.readonly = true;
				}
			});

		return config;
	}
}
