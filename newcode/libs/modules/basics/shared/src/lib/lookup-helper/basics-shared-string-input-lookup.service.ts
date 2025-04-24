import { ILookupSearchRequest, ILookupSearchResponse, LookupIdentificationData, LookupSearchResponse, UiCommonLookupReadonlyDataService } from '@libs/ui/common';
import { map, Observable } from 'rxjs';

/**
 *  lookup only support number or IIdentificationDataMutable as key by default.
 *  this service extend it to support string as key.
 */
export abstract class BasicsSharedStringInputLookupService<T extends object> extends UiCommonLookupReadonlyDataService<T> {
	public override getSearchList(request: ILookupSearchRequest): Observable<ILookupSearchResponse<T>> {
		return this.getList().pipe(
			map((list) => {
				return new LookupSearchResponse(list);
			}),
		);
	}

	public override getItemByKey(key: Readonly<LookupIdentificationData>): Observable<T> {
		return this.getList().pipe(
			map((list) => {
				return (
					list.find((item) => {
						return item[this.config.valueMember as keyof T] === key.key;
					}) ?? list[0]
				);
			}),
		);
	}
}
