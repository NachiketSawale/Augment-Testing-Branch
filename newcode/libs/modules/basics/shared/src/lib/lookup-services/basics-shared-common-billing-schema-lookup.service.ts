/*
 * Copyright(c) RIB Software GmbH
 */

import { ILookupSearchRequest, ILookupSearchResponse, UiCommonLookupReadonlyDataService} from '@libs/ui/common';
import { ICommonBillingSchemaEntity } from '../billing-schema/model/interfaces/common-billing-schema-entity.interface';
import { IIdentificationData } from '@libs/platform/common';
import { Observable } from 'rxjs';
import { IEntityList, IEntitySelection } from '@libs/platform/data-access';
/**
 * Lookup Service for common billing schema
 */
export class BasicsShareCommonBillingSchemaLookupService<T extends ICommonBillingSchemaEntity> extends UiCommonLookupReadonlyDataService<T> {
	public constructor(private dataService: IEntitySelection<T> & IEntityList<T>) {
		super({
			uuid: '58e2e5e105c34d07b97867e2006be61a',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description',
		});

	}
	public getItemByKey(key: IIdentificationData): Observable<T> {
		return new Observable<T>(e => {
			e.next(this.dataService.getList().find(e => e.Id === key.id));
			e.complete();
		});
	}

	public getList(): Observable<T[]> {
		return new Observable<T[]>(e => {
			e.next(this.dataService.getList());
			e.complete();
		});
	}

	public getSearchList(request: ILookupSearchRequest): Observable<ILookupSearchResponse<T>> {
		throw new Error('Using client side search, this method should not be called');
	}
}
