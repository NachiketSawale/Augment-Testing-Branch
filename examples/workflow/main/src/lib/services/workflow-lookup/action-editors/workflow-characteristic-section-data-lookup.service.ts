/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupEndpointConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IDescriptionInfo, IEntityBase, IEntityContext, IEntityIdentification, IIdentificationData } from '@libs/platform/common';
import { Observable } from 'rxjs/internal/Observable';

export interface CharacteristicSectionEntity extends IEntityBase, IEntityIdentification {
	ModuleFk?: number;
	DescriptionInfo?: IDescriptionInfo;
	Sorting?: number;
	IsDefault?: boolean;
	ContainerUuid?: string;
	SectionName?: string;
	Checked?: boolean;
}

@Injectable({
	providedIn: 'root'
})

export class WorkflowSectionCharacteristicLookup<T extends object = object>
	extends UiCommonLookupEndpointDataService<CharacteristicSectionEntity, T> {

	private list: CharacteristicSectionEntity[] = [];

	public constructor() {
		const config: ILookupEndpointConfig<CharacteristicSectionEntity, object> = {
			httpRead: {route: 'basics/characteristic/section', endPointRead: 'list'}
		};
		super(config, {
			uuid: '',
			displayMember: 'DescriptionInfo.Description',
			valueMember: 'Id',
		});
	}

	/**
	 * Get data item by identification data
	 * @param key
	 * @param context
	 */
	//the override is necessary because in this case the "key" parameter is a String and not a number
	public override getItemByKey(key: IIdentificationData, context?: IEntityContext<T>): Observable<CharacteristicSectionEntity> {
		return new Observable((observer) => {

			if (this.list.length > 0) {
				observer.next(this.getItem(key));
				observer.complete();
			} else {
				this.getList(context).subscribe((itemList) => {
					if (this.list.length <= 0) {
						this.list = itemList;
					}
					observer.next(this.getItem(key));
					observer.complete();
				});
			}
		});

	}

	private getItem(key: IIdentificationData): CharacteristicSectionEntity {
		let value: CharacteristicSectionEntity = {Id: 0};
		if (this.list.length > 0) {
			this.list.forEach(item => {
				const i = this.identify(item);
				const keyItem = key.id ? key.id.toString() : key.toString();
				if (i.id.toString() == keyItem) {
					value = item;
				}
			});
		}
		return value;
	}
}