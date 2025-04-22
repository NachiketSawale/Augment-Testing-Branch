/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { FieldType } from '../../../model/fields';
import { UiCommonLookupEndpointDataService } from '../../../lookup';

/**
 * Lookup entity data.
 */
export interface IGridConfigLookup {
	Code: string;
	keyWords: string | null;
}

/**
 * Service provides data for user label lookup.
 */
@Injectable({
	providedIn: 'root',
})
export class UiCommonGridConfigUserLabelLookupService<T extends object> extends UiCommonLookupEndpointDataService<IGridConfigLookup, T> {
	public constructor() {
		super(
			{
				httpRead: {
					route: 'basics/customize/userlabel/',
					endPointRead: 'list',
					usePostForRead: true,
				},
			},
			{
				uuid: '7f644bce8e034baeaa4bf306c466e20b',
				idProperty: 'Id',
				valueMember: 'Id',
				displayMember: 'Code',
				showClearButton: true,
				gridConfig: {
					uuid: '7f644bce8e034baeaa4bf306c466e20b',
					columns: [
						{
							id: 'Code',
							model: 'Code',
							width: 300,
							sortable: true,
							type: FieldType.Description,
							label: {
								key: 'Code',
								text: 'Code',
							},
							readonly: true,
							visible: true,
						},
						{
							id: 'keyWords',
							model: 'keyWords',
							width: 300,
							sortable: true,
							type: FieldType.Description,
							label: {
								key: 'Key Words',
								text: 'Key Words',
							},
							readonly: true,
							visible: true,
						},
					],
				},
				showDialog: false,
				showGrid: true,
			},
		);
	}
}
