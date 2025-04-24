/*
 * Copyright(c) RIB Software GmbH
 */
import { find } from 'lodash';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { FieldType, ILookupSearchRequest, ILookupSearchResponse, LookupSearchResponse, UiCommonLookupReadonlyDataService } from '@libs/ui/common';
import { IEntityContext, IIdentificationData, ServiceLocator } from '@libs/platform/common';
import { BasicsSharedBim360FolderService } from '../services/basics-shared-bim360-folder.service';
import { IBasicsBim360DocumentDialogModel } from '../model/entities/dialog/basics-bim360-document-dialog-model.interface';
import { IBasicsBim360DocumentViewEntity } from './entities/basics-bim360-document-view-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedBim360FolderLookupService<TEntity extends object> extends UiCommonLookupReadonlyDataService<IBasicsBim360DocumentViewEntity, TEntity> {
	private readonly bim360FolderService = ServiceLocator.injector.get(BasicsSharedBim360FolderService);

	public constructor() {
		super({
			uuid: 'c0ea049c6e7c48d492716492aff23504',
			idProperty: 'Id', //'DocumentId' if string type id is supported.
			valueMember: 'Id', //'DocumentId' if string type id is supported.
			displayMember: 'FullName',
			showGrid: false,
			showDialog: true,
			showClearButton: true,
			disableDataCaching: true,
			dialogOptions: {
				headerText: {
					text: 'Select BIM 360 folder',
					key: 'documents.centralquery.bim360Documents.selectBim360Folder',
				},
			},
			gridConfig: {
				columns: [
					{
						id: 'FullName',
						model: 'FullName',
						type: FieldType.Text,
						label: { text: 'Folder Name', key: 'documents.centralquery.bim360Documents.folderNameDisplay' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 120,
					},
				],
			},
		});
	}

	public getList(): Observable<IBasicsBim360DocumentViewEntity[]> {
		return this.bim360FolderService.getFolderList();
	}

	public getSearchList(request: ILookupSearchRequest, context?: IEntityContext<TEntity>): Observable<ILookupSearchResponse<IBasicsBim360DocumentViewEntity>> {
		return this.bim360FolderService.getFolderList(context?.entity as IBasicsBim360DocumentDialogModel, request.searchText).pipe(
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

	public getItemByKey(key: IIdentificationData, context?: IEntityContext<TEntity>): Observable<IBasicsBim360DocumentViewEntity> {
		const entity = context?.entity as IBasicsBim360DocumentDialogModel;
		if (!entity) {
			return of();
		}
		const folderId = entity.folderInfo?.srcEntity.Id;
		if (folderId) {
			const folder = this.bim360FolderService.fetchFolderById(folderId);
			if (folder) {
				return of(folder);
			}
		}

		return new Observable<IBasicsBim360DocumentViewEntity>((observer) => {
			this.bim360FolderService.getFolderList(context?.entity as IBasicsBim360DocumentDialogModel).subscribe({
				next: (list) => {
					const item = find(list, (e) => e.srcEntity.Id === folderId);
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

	//todo-Any: when click refresh, clear cache. or will lookup support string type id?
}
