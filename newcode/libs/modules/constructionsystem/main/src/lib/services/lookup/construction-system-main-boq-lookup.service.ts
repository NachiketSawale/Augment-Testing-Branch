import { FieldType, ILookupSearchRequest, ILookupSearchResponse, LookupIdentificationData, LookupSearchResponse, UiCommonLookupReadonlyDataService } from '@libs/ui/common';
import { IBoqItemEntity } from '@libs/boq/interfaces';
import { CollectionHelper, IEntityContext, IIdentificationData, PlatformHttpService, ServiceLocator } from '@libs/platform/common';
import { Observable, of, tap } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { ConstructionSystemMainInstanceDataService } from '../../services/construction-system-main-instance-data.service';
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainBoqLookupService<TEntity extends object> extends UiCommonLookupReadonlyDataService<IBoqItemEntity, TEntity> {
	private readonly httpService = inject(PlatformHttpService);
	private boqListCache: { [key: string]: IBoqItemEntity[] } = {};
	public constructor() {
		super({
			uuid: '6ccd5aa3382c48cb94f56407152816e3',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Reference',
			showDialog: false,
			gridConfig: {
				columns: [
					{
						id: 'ref',
						model: 'Reference',
						label: {
							text: 'Reference',
							key: 'boq.main.Reference',
						},
						width: 100,
						type: FieldType.Description,
						sortable: true,
					},
					{
						id: 'briefInfoef',
						model: 'BriefInfo',
						label: {
							text: 'Brief',
							key: 'boq.main.BriefInfo',
						},
						width: 120,
						type: FieldType.Description,
						sortable: true,
					},
				],
			},
			treeConfig: {
				parentMember: 'BoqItemParent',
				childMember: 'BoqItems',
			},
		});
	}
	public override getList(): Observable<IBoqItemEntity[]> {
		const instanceService = ServiceLocator.injector.get(ConstructionSystemMainInstanceDataService);
		const currentProjectId = instanceService.getCurrentSelectedProjectId();
		const currentBoqHeaderId = instanceService.getCurrentBoqHeaderId();
		const cacheKey = JSON.stringify({ projectId: currentProjectId, headerId: currentBoqHeaderId });

		// Return cached data immediately if available
		if (this.boqListCache[cacheKey]) {
			return of(this.boqListCache[cacheKey]);
		}

		// Handle empty case
		if (!currentBoqHeaderId && !currentProjectId) {
			return of([]);
		}

		// Create appropriate observable based on conditions
		const request$ = currentBoqHeaderId
			? this.httpService.post$<IBoqItemEntity[]>('boq/main/getboqitemsearchlist', {
					BoqHeaderIds: [currentBoqHeaderId],
				})
			: this.httpService.get$<IBoqItemEntity[]>('boq/project/getboqsearchlist', {
					params: {
						projectId: currentProjectId!,
						filterValue: '',
					},
				});

		return request$.pipe(tap((data) => (this.boqListCache[cacheKey] = data)));
	}

	public getSearchList(request: ILookupSearchRequest, context: IEntityContext<TEntity> | undefined): Observable<ILookupSearchResponse<IBoqItemEntity>> {
		return new Observable((observer) => {
			this.getList().subscribe((data) => {
				observer.next(new LookupSearchResponse(data));
				observer.complete();
			});
		});
	}

	public override getItemByKey(key: IIdentificationData, context?: IEntityContext<TEntity>): Observable<IBoqItemEntity> {
		return new Observable<IBoqItemEntity>((observer) => {
			const cacheItem = this.cache.getItem(key);
			if (cacheItem) {
				observer.next(cacheItem);
				observer.complete();
			} else {
				this.getList().subscribe((list) => {
					if (list.length > 0) {
						const items = CollectionHelper.Flatten(list, (boq) => {
							return boq.BoqItems || [];
						});
						items.some((item) => {
							const i = this.identify(item);
							if (LookupIdentificationData.equal(key, i)) {
								observer.next(item);
								observer.complete();
								return true;
							}
							return false;
						});
					}
				});
			}
		});
	}
}
