/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupEndpointConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IEntityContext, IIdentificationData } from '@libs/platform/common';
import { Observable } from 'rxjs';

export class UseCase {
	public WizardConfiGuuid?: string;
}

@Injectable({
	providedIn: 'root'
})
export class WorkflowGenericWizardUseCaseLookup<T extends object = object>
	extends UiCommonLookupEndpointDataService<UseCase, T> {
	private list: UseCase[] = [];
	public constructor() {
		const lookupEndpointConfig: ILookupEndpointConfig<UseCase, object> = {
			httpRead: { route: 'basics/config/genwizard/instance/', endPointRead: 'getUseCaseUuidList'}
		};
		super(lookupEndpointConfig, {
			uuid: 'eb9f50d284b64120b367df5d097d0eb1',
			displayMember: 'CommentInfo.Description',
			valueMember: 'Id'
		});
	}

	/**
	 * Get data item by identification data
	 * @param key
	 * @param context
	 */
	//the override is necessary because in this case the "key" parameter is a String and not a number
	public override getItemByKey(key: IIdentificationData, context?: IEntityContext<T>): Observable<UseCase> {
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

	private getItem(key: IIdentificationData): UseCase {
		let value:UseCase = {} as UseCase;
		if (this.list.length > 0) {
			this.list.forEach(item => {
				const i = item.WizardConfiGuuid;
				const keyItem = key.id ? key.id.toString() : key.toString();
				if (i!.toString() == keyItem) {
					value = item;
				}
			});
		}
		return value;
	}
}