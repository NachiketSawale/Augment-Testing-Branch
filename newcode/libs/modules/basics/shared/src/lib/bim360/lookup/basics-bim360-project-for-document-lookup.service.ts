/*
 * Copyright(c) RIB Software GmbH
 */
import { find } from 'lodash';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { FieldType, ILookupSearchRequest, ILookupSearchResponse, LookupSearchResponse, UiCommonLookupReadonlyDataService } from '@libs/ui/common';
import { IIdentificationData, ServiceLocator } from '@libs/platform/common';
import { BasicsSharedBim360ProjectForDocumentService } from '../services/basics-shared-bim360-project-for-document.service';
import { IBasicsBim360ProjectEntity } from '../model/entities/basics-bim360-project-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedBim360ProjectForDocumentLookupService<TEntity extends object> extends UiCommonLookupReadonlyDataService<IBasicsBim360ProjectEntity, TEntity> {
	private readonly bim360ProjectService = ServiceLocator.injector.get(BasicsSharedBim360ProjectForDocumentService);

	public constructor() {
		super({
			uuid: '2d5a02634cff4ebabe6d636433e73d7b',
			idProperty: 'Id', //'PrjId'
			valueMember: 'Id', //'PrjId'
			displayMember: 'ProjectNo',
			descriptionMember: 'ProjectName',
			showGrid: false,
			showDialog: true,
			showClearButton: true,
			showDescription: true,
			disableDataCaching: false,
			dialogOptions: {
				headerText: {
					text: 'Assign project',
					key: 'cloud.common.dialogTitleProject',
				},
			},
			gridConfig: {
				columns: [
					{
						id: 'ProjectNo',
						model: 'ProjectNo',
						type: FieldType.Description,
						label: { text: 'Project No.', key: 'cloud.common.entityProjectNo' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 120,
					},
					{
						id: 'ProjectName',
						model: 'ProjectName',
						type: FieldType.Description,
						label: { text: 'Project Name', key: 'cloud.common.entityProjectName' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 200,
					},
				],
			},
		});
	}

	public getList(): Observable<IBasicsBim360ProjectEntity[]> {
		return this.bim360ProjectService.getProjectList();
	}

	public getSearchList(request: ILookupSearchRequest /*, context?: IEntityContext<TEntity>*/): Observable<ILookupSearchResponse<IBasicsBim360ProjectEntity>> {
		return this.bim360ProjectService.getProjectList(request.searchText).pipe(
			map((list) => {
				const response = new LookupSearchResponse(list);
				response.itemsFound = list.length;
				response.itemsRetrieved = list.length;
				return response;
			}),
			catchError((err) => {
				return throwError(() => new Error(err));
			}),
		);
	}

	public getItemByKey(key: IIdentificationData /*, context?: IEntityContext<TEntity>*/): Observable<IBasicsBim360ProjectEntity> {
		const cacheItem = this.cache.getItem(key);
		if (cacheItem) {
			return of(cacheItem);
		}
		return new Observable<IBasicsBim360ProjectEntity>((observer) => {
			this.bim360ProjectService.getProjectList().subscribe({
				next: (list) => {
					this.cache.setList(list);
					this.cache.setItems(list);
					const item = find(list, (e) => e.PrjId === key.id);
					if (item) {
						observer.next(item);
					}
					observer.complete();
				},
				error: (err) => {
					observer.error(err);
				},
			});
		});
	}
}
