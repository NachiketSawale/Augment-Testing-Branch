import { IDataProvider } from './data-provider.interface';
import { ISearchResult } from '@libs/platform/common';
import { ISearchPayload } from '@libs/platform/common';

export interface IRootDataProvider<T, U> extends IDataProvider<T> {
	filter(payload: ISearchPayload): Promise<ISearchResult<T>>

	filterEnhanced?<PT extends object, RT>(payload: PT, onSuccess: (filtered: RT) => ISearchResult<T>): Promise<ISearchResult<T>>

	update(complete: U): Promise<U>

	delete(entities: T[] | T): void
}
