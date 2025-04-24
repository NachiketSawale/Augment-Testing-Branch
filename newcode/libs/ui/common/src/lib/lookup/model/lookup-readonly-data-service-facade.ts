/*
 * Copyright(c) RIB Software GmbH
 */
import { isArray } from 'lodash';
import { map, Observable, Subscriber } from 'rxjs';

import { IEntityContext, IIdentificationData } from '@libs/platform/common';

import { ILookupConfig } from './interfaces/lookup-options.interface';
import { ILookupReadonlyDataService } from './interfaces/lookup-readonly-data-service.interface';
import { LookupSearchResponse } from './lookup-search-response';
import { LookupSearchRequestFacade } from './lookup-search-request-facade';
import { LookupSearchResponseFacade } from './lookup-search-response-facade';
import { ILookupSearchResponse } from './interfaces/lookup-search-response.interface';
import { ILookupSearchRequest } from './interfaces/lookup-search-request.interface';
import { ILookupDataCache } from './interfaces/lookup-data-cache.interface';
import { ILookupDataPage } from './interfaces/lookup-data-page.interface';
import { ILookupDataSync } from './interfaces/lookup-data-sync.interface';
import { LookupContext } from '../model/lookup-context';
import { ILookupDataTree } from './interfaces/lookup-data-tree.interface';
import { IGridConfiguration } from '../../grid';
import { FieldType } from '../../model/fields';
import { LookupFormatterService } from '../services/lookup-formatter.service';
import { LookupIdentificationData } from './lookup-identification-data';
import { ILookupIdentificationData } from './interfaces/lookup-identification-data.interface';

/**
 * A facade between lookup data service and lookup component
 */
export class LookupReadonlyDataServiceFacade<TItem extends object, TEntity extends object> implements ILookupReadonlyDataService<TItem, TEntity> {
	private lastRequest?: ILookupSearchRequest;
	public config: ILookupConfig<TItem, TEntity>;
	public cache: ILookupDataCache<TItem>;
	public paging: ILookupDataPage<TItem>;
	public syncService?: ILookupDataSync<TItem>;
	public tree?: ILookupDataTree<TItem>;
	public loading = false;

	public constructor(public dataService: ILookupReadonlyDataService<TItem, TEntity>, private context: LookupContext<TItem, TEntity>) {
		this.cache = dataService.cache;
		this.paging = dataService.paging;
		this.syncService = dataService.syncService;
		this.tree = dataService.tree;
		this.config = context.lookupConfig;
		context.lookupFacade = this;
	}

	// client side filter
	private filterList(list: TItem[]): Observable<TItem[]> {
		return new Observable(subscriber => {
			let clientSideFilter = this.config.clientSideFilter;
			let clientSideAsyncFilter = this.config.clientSideAsyncFilter;

			if (!clientSideFilter && this.config.clientSideFilterToken) {
				clientSideFilter = this.context.injector.get(this.config.clientSideFilterToken);
			}
			if (clientSideFilter) {
				list = list.filter(item => clientSideFilter!.execute(item, this.context));
			}

			if (!clientSideAsyncFilter && this.config.clientSideAsyncFilterToken) {
				clientSideAsyncFilter = this.context.injector.get(this.config.clientSideAsyncFilterToken);
			}
			if (clientSideAsyncFilter) {
				clientSideAsyncFilter.execute(list, this.context).then(e => {
					subscriber.next(e);
					subscriber.complete();
				});
			} else {
				subscriber.next(list);
				subscriber.complete();
			}
		});
	}

	// client side search
	private searchList(list: TItem[], request: LookupSearchRequestFacade) {
		const searchFields = this.generateSearchFields();

		if (request.searchText) {
			return list.filter(item => {
				return this.matchItem(item, searchFields, request);
			});
		}

		return list;
	}

	/**
	 * find most similar item from matched items to complete value in edit box.
	 * @param list
	 * @param request
	 * @private
	 */
	private searchCompleteItem(list: TItem[], request: LookupSearchRequestFacade) {
		request.matchExact = true;

		let similarItem = this.searchCompleteItemInList(list, request);

		if (similarItem) {
			return similarItem;
		}

		request.matchExact = false;
		request.matchFront = true;

		similarItem = this.searchCompleteItemInList(list, request);

		return similarItem;
	}

	private searchCompleteItemInList(list: TItem[], request: LookupSearchRequestFacade) {
		const formatterService = this.context.injector.get(LookupFormatterService);

		return list.find(item => {
			const text = formatterService.getPlainText(item, this.context);
			return this.matchText(text, request);
		});
	}

	private escape(text: string) {
		if (!text || typeof text !== 'string') {
			return '';
		}

		const metaChars = ['\\\\', '\\^', '\\$', '\\*', '\\+', '\\?', '\\{', '\\}',
			'\\.', '\\(', '\\)', '\\:', '\\=', '\\!', '\\|', '\\[', '\\]', '\\&'];

		metaChars.forEach((metaChar) => {
			text = text.replace(new RegExp(metaChar, 'gi'), metaChar);
		});

		return text;
	}

	private matchItem(dataItem: TItem, matchFields: string[], filter: LookupSearchRequestFacade) {
		const formatterService = this.context.injector.get(LookupFormatterService);
		return matchFields.some((matchField) => {
			const value = formatterService.getPropertyText(dataItem, matchField, this.config.translateDisplayMember);
			return this.matchText(value, filter);
		});
	}

	private matchText(text: string, filter: LookupSearchRequestFacade) {
		if (!text) {
			return false;
		}

		const flags = this.config?.isCaseSensitiveSearch ? '' : 'i';
		let pattern = this.escape(filter.searchText);

		if (this.config?.isExactSearch || filter.matchExact) {
			pattern = '^' + pattern + '$';
		} else if (filter.matchFront) {
			pattern = '^' + pattern;
		}

		const expression = new RegExp(pattern, flags);
		return text ? expression.test(text) : false;
	}

	private buildSearchString(searchText: string, searchFields: string[]) {
		if (this.config.buildSearchString) {
			return this.config.buildSearchString(searchText);
		}

		let filterString = '';

		if (searchFields && searchFields.length) {
			// searchValue = this.urlEncoding(searchValue); // don't need url encoding now, it seems somewhere do encoding already.
			searchFields.forEach((searchField) => {
				if (searchField.match(/fk$/i)) { // foreign key
					return;
				}
				if (filterString) {
					filterString = filterString + ' or ';
				}

				if (searchField === 'DescriptionInfo' || searchField === 'DescriptionInfo.Translated') { // description and description_tr
					filterString = filterString + 'DescriptionInfo.Description.Contains("' + searchText + '")';
				} else {
					filterString = filterString + '(' + searchField + '!=null and ' + searchField + '.ToString().Contains("' + searchText + '"))';
				}

				// todo: temporary solution, consider common solution for search not string type property.
				/*
				if (searchField.toLowerCase() === 'id' && $.isNumeric(searchValue)) {
				  filterString = filterString + searchField + '=' + searchValue;
				} else {
				  filterString = filterString + searchField + '.Contains("' + searchValue + '")';
				}
				*/
			});
		}

		return filterString ? '(' + filterString + ')' : '';
	}

	/**
	 * Identify lookup entity
	 * @param item
	 */
	public identify(item: TItem): IIdentificationData {
		return this.dataService.identify(item);
	}

	/**
	 * Get whole lookup data list
	 */
	public getList(): Observable<TItem[]> {
		return new Observable(observer => {
			this.loading = true;
			this.dataService.getList(this.context).subscribe({
				next: list => {
					this.loading = false;
					this.filterList(list).subscribe(e => {
						observer.next(e);
						observer.complete();
					});
				},
				error: error => {
					this.loading = false;
					observer.error(error);
				}
			});
		});
	}

	/**
	 * Resolve search list of lookup entity
	 * @param request
	 */
	public getSearchList(request: ILookupSearchRequest): Observable<ILookupSearchResponse<TItem>> {
		return new Observable(subscriber => {
			if (!request.filterString) {
				request.filterString = '';
			}

			let serverSideFilter = this.config.serverSideFilter;

			if (!serverSideFilter && this.config.serverSideFilterToken) {
				serverSideFilter = this.context.injector.get(this.config.serverSideFilterToken);
			}

			// apply lookup filter
			if (serverSideFilter) {
				request.filterKey = serverSideFilter.key;

				Promise.resolve(serverSideFilter.execute(this.context)).then(filter => {
					if (filter instanceof Object) {
						request.filterByParameter = true;
						request.additionalParameters = filter;
					} else if (typeof filter === 'string') {
						if (request.filterString) {
							request.filterString += ' and ';
						}
						request.filterString += `(${filter})`;
					}

					this.postGetSearchList(request, subscriber);
				});
			} else {
				this.postGetSearchList(request, subscriber);
			}
		});
	}

	private generateSearchFields() {
		if (isArray(this.config.inputSearchMembers)) {
			return this.config.inputSearchMembers;
		}

		const fields = [this.config.displayMember];

		if (this.config.gridConfig) {
			const gridConfig = this.config.gridConfig as IGridConfiguration<TItem>;

			if (gridConfig.columns) {
				gridConfig.columns.forEach(e => {
					const field = e.model as string;

					if ([FieldType.Code, FieldType.Description, FieldType.Text, FieldType.Remark, FieldType.Comment, FieldType.Translation].some(f => f === e.type)) {
						fields.push(field);
					}
				});
			}
		}

		return fields;
	}

	private postGetSearchList(request: ILookupSearchRequest, subscriber: Subscriber<ILookupSearchResponse<TItem>>) {
		request.searchFields = this.generateSearchFields();

		if (request.searchText && !this.config.isClientSearch) {
			// server side search, build filter string
			if (request.filterString) {
				request.filterString += ' and ';
			}
			request.filterString += this.buildSearchString(request.searchText, request.searchFields);
		}

		if (this.paging.enabled) {
			this.paging.resetLength();
			request.pageState = {
				pageNumber: this.paging.index,
				pageSize: this.paging.pageCount
			};
		}

		this.loading = true;
		this.lastRequest = request;
		this.dataService.getSearchList(request, this.context).subscribe(res => {
			this.loading = false;
			if (this.paging.enabled) {
				this.paging.setLength(res.itemsFound);
			}
			subscriber.next(res);
		}, error => {
			this.loading = false;
		});
	}

	/**
	 * Get lookup entity by identification data
	 * @param id
	 */
	public getItemByKey(id: IIdentificationData): Observable<TItem> {
		return this.dataService.getItemByKey(id, this.context);
	}

	private canGetList() {
		return this.config.canListAll && !this.config.serverSideFilter && !this.config.serverSideFilterToken;
	}

	/**
	 * Load lookup data
	 */
	public load(): Observable<ILookupSearchResponse<TItem>> {
		if (this.canGetList()) {
			return this.getList().pipe(map(list => {
				if (this.paging.enabled) {
					this.paging.list = list;
					return new LookupSearchResponse(this.paging.getPageData());
				}
				return new LookupSearchResponse(list);
			}));
		}

		const request = new LookupSearchRequestFacade('', []);
		return this.getSearchList(request);
	}

	/**
	 * Search lookup data
	 * @param input
	 * @param autoComplete
	 * @param formEntity
	 */
	public search(input: string, autoComplete: boolean, formEntity?: object): Observable<LookupSearchResponseFacade<TItem>> {
		return new Observable(observer => {
			const request = new LookupSearchRequestFacade(input, []);

			request.formEntity = formEntity;

			if (this.canGetList()) {
				this.getList().subscribe(list => {
					let items = this.searchList(list as TItem[], request);
					if (this.paging.enabled) {
						this.paging.list = items;
						items = this.paging.getPageData() as TItem[];
					}
					const response = new LookupSearchResponseFacade(items);
					if (autoComplete) {
						const completeItem = this.searchCompleteItem(response.items, request);
						if (completeItem && this.canSelect(completeItem)) {
							response.completeItem = completeItem;
						} else {
							response.completeItem = null;
						}
					}
					observer.next(response);
				});
			} else {
				this.getSearchList(request).subscribe(res => {
					const response = new LookupSearchResponseFacade(res.items);

					if (this.config.isClientSearch) {
						response.items = this.searchList(response.items, request);
						response.itemsFound = response.items.length;
						response.itemsRetrieved = response.items.length;
					} else {
						response.itemsFound = res.itemsFound;
						response.itemsRetrieved = res.itemsRetrieved;
					}

					if (autoComplete) {
						const completeItem = this.searchCompleteItem(res.items as TItem[], request);
						if (completeItem && this.canSelect(completeItem)) {
							response.completeItem = completeItem;
						} else {
							response.completeItem = null;
						}
					}
					observer.next(response);
				});
			}
		});
	}

	/**
	 * Search lookup data synchronize
	 * @param input
	 * @param autoComplete
	 */
	public searchSync(input: string, autoComplete: boolean): LookupSearchResponseFacade<TItem> {
		if (!this.syncService) {
			throw new Error('searchSyncService is null');
		}

		const request = new LookupSearchRequestFacade(input, []);

		const list = this.syncService.getListSync();
		let items = this.searchList(list, request);

		if (this.paging.enabled) {
			this.paging.list = items;
			items = this.paging.getPageData();
		}

		const response = new LookupSearchResponseFacade(items);

		if (autoComplete) {
			const completeItem = this.searchCompleteItem(response.items, request);
			if (completeItem && this.canSelect(completeItem)) {
				response.completeItem = completeItem;
			} else {
				response.completeItem = null;
			}
		}
		return response;
	}

	/**
	 * load next page data
	 */
	public loadNextPage(): Observable<ILookupSearchResponse<TItem>> {
		if (!this.paging.canNext()) {
			throw new Error('can not go to next page');
		}

		const nextPage = this.paging.next();

		if (this.canGetList()) {
			return new Observable(observer => {
				observer.next(new LookupSearchResponse(this.paging.getPageData()));
			});
		}

		if (!this.lastRequest || !this.lastRequest.pageState) {
			throw new Error('page state is not available');
		}

		this.lastRequest.pageState.pageNumber = nextPage;
		return this.dataService.getSearchList(this.lastRequest, this.context);
	}

	/**
	 * Load previous page data
	 */
	public loadPreviousPage(): Observable<ILookupSearchResponse<TItem>> {
		if (!this.paging.canPrev()) {
			throw new Error('can not go to previous page');
		}

		const prevPage = this.paging.prev();

		if (this.canGetList()) {
			return new Observable(observer => {
				observer.next(new LookupSearchResponse(this.paging.getPageData()));
			});
		}

		if (!this.lastRequest || !this.lastRequest.pageState) {
			throw new Error('page state is not available');
		}

		this.lastRequest.pageState.pageNumber = prevPage;
		return this.dataService.getSearchList(this.lastRequest, this.context);
	}

	/**
	 * Create identification data
	 * @param value
	 */
	public createIdentificationData(value: number | string | IIdentificationData): ILookupIdentificationData {
		return LookupIdentificationData.create(value, this.context);
	}

	/**
	 * Load data item by id
	 * @param value
	 */
	public loadDataItemById(value: number | string | IIdentificationData) {
		const id = this.createIdentificationData(value);
		return this.getItemByKey(id);
	}


	/**
	 * Is current item valid
	 * @param dataItem
	 */
	public canSelect(dataItem: TItem): boolean {
		if (this.config.selectableCallback) {
			return this.config.selectableCallback(dataItem, this.context);
		}
		return true;
	}

	/**
	 * Get default lookup entity asynchronously
	 * @param context
	 */
	public async getDefaultAsync(context?: IEntityContext<TEntity>): Promise<TItem | null | undefined> {
		return this.dataService.getDefaultAsync(context);
	}

	/**
	 * Get whole lookup entities asynchronously
	 * @param context
	 */
	public async getListAsync(context?: IEntityContext<TEntity>): Promise<TItem[]> {
		return this.dataService.getListAsync(context);
	}

	/**
	 * Get lookup entity by id asynchronously
	 * @param key
	 * @param context
	 */
	public getItemByKeyAsync(key: IIdentificationData, context?: IEntityContext<TEntity>): Promise<TItem> {
		return this.dataService.getItemByKeyAsync(key, context);
	}

	/**
	 * Search lookup entities asynchronously
	 * @param request
	 * @param context
	 */
	public getSearchListAsync(request: ILookupSearchRequest, context?: IEntityContext<TEntity>): Promise<ILookupSearchResponse<TItem>> {
		return this.dataService.getSearchListAsync(request, context);
	}
}