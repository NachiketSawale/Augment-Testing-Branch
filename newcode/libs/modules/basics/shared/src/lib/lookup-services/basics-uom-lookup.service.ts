/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';

import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IBasicsUomEntity } from '@libs/basics/interfaces';
/**
 * Uom Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedUomLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<IBasicsUomEntity, TEntity> {
	public constructor() {
		super({
			httpRead: { route: 'basics/unit/', endPointRead: 'freetypes' }
		}, {
			uuid: '01faa125dc93475d80a5407dd67e0ed7',
			valueMember: 'Id',
			displayMember: 'Unit',
			gridConfig: {
				columns: [
					{
						id: 'Unit',
						model: 'UnitInfo',
						type: FieldType.Translation,
						label: { text: 'Unit', key: 'cloud.common.entityUoM' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Description',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: {text: 'Description', key: 'cloud.common.entityDescription'},
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}

	public isSameDimension(a: IBasicsUomEntity, b: IBasicsUomEntity): boolean {
		if (a.LengthDimension && b.LengthDimension) {
			return a.LengthDimension === b.LengthDimension;
		}
		if (b.MassDimension && b.MassDimension) {
			return a.MassDimension === b.MassDimension;
		}
		if (a.TimeDimension && b.TimeDimension) {
			return a.TimeDimension === b.TimeDimension;
		}
		return false;
	}
}