import { CompleteIdentification, IEntityIdentification, ISearchPayload, ISearchResult } from '@libs/platform/common';
import { DataServiceHierarchicalRoot } from '@libs/platform/data-access';
import { IfilterStructureDataServiceCreateContext } from '../model/filter-structure-interface';
import { get } from 'lodash';

export class BasicsSharedFilterStructureDataService<T extends IEntityIdentification, PU extends CompleteIdentification<T>> extends DataServiceHierarchicalRoot<T, PU> {
	private hasLoaded: boolean = false;

	public constructor(private opt: IfilterStructureDataServiceCreateContext<T>) {
		super(opt.dataServiceOption);
	}

	protected override provideLoadByFilterPayload(payload: ISearchPayload): object {
		this.filter(payload);
		this.hasLoaded = true;
		return {};
	}

	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<T> {
		const fr = get(loaded, 'FilterResult')!;
		return {
			dtos: loaded as T[],
			FilterResult: fr
		};
	}

}