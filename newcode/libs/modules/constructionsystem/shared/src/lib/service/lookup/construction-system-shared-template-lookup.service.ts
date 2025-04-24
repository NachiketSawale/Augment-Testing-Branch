/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { UiCommonLookupTypeDataService } from '@libs/ui/common';
import { ICosTemplateEntity } from '../../model/entities/cos-template-entity.interface';
import { Observable } from 'rxjs';
import { IIdentificationData } from '@libs/platform/common';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemSharedTemplateLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<ICosTemplateEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('CosTemplate', {
			uuid: '5470836b92a143cf806e-e2c8e8fa49eb',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
			showClearButton: true,
		});
	}

	/**
	 * override getting lookup entity
	 * @param key
	 * @deprecated use getItemByKeyAsync instead
	 */
	public override getItemByKey(key: IIdentificationData): Observable<ICosTemplateEntity> {
		return new Observable((subscriber) => {
			const cacheItem = this.cache.getItem(key);

			if (cacheItem) {
				this.completeWithValue(subscriber, cacheItem);
			} else {
				this.getList().subscribe((item) => {
					if (item.length > 0) {
						const entity = this.mapEntity(item);
						this.processItems([entity]);
						this.cache.setItem(entity);
						this.completeWithValue(subscriber, entity);
					} else {
						subscriber.error(new Error(`Item with key ${key.id} not found`));
					}
				});
			}
		});
	}
}
