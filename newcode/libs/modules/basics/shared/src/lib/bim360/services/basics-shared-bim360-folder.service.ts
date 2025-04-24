/*
 * Copyright(c) RIB Software GmbH
 */
import { Observable, of } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { BasicsBim360AuthenticationType } from '../model/enums/basics-bim360-authentication-type.enum';
import { IBasicsBim360ResponseEntity } from '../model/entities/response/basics-bim360-response-entity.interface';
import { BasicsSharedBim360AuthenticationService } from './basics-shared-bim360-authentication.service';
import { BasicsSharedBim360HelperService } from './basics-shared-bim360-helper.service';
import { IBasicsBim360DocumentEntity } from '../model/entities/basics-bim360-document-entity.interface';
import { IBasicsBim360ProjectEntity } from '../model/entities/basics-bim360-project-entity.interface';
import { IBasicsBim360DocumentDialogModel } from '../model/entities/dialog/basics-bim360-document-dialog-model.interface';
import { IBasicsBim360DocumentViewEntity } from '../lookup/entities/basics-bim360-document-view-entity.interface';
import { IBasicsBim360DocumentRequestEntity } from '../model/entities/request/basics-bim360-document-request-entity.interface';
import { BasicsBim360ResponseStatusCode } from '../model/enums/basics-bim360-response-status-code.enum';

/**
 * Autodesk bim360 search service.
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedBim360FolderService {
	private readonly http = inject(PlatformHttpService);
	private readonly bim360AuthService = inject(BasicsSharedBim360AuthenticationService);
	private readonly helperService = inject(BasicsSharedBim360HelperService);
	private readonly queryFolderUrl = 'documents/centralquery/bim360/folders';

	private curProjInfo?: IBasicsBim360ProjectEntity;
	private keyItemMap = new Map<string, number>();
	private keyEntityMap = new Map<string, IBasicsBim360DocumentEntity>();
	private index: number = 0;

	private fetchId(folder: IBasicsBim360DocumentEntity) {
		let id = this.keyItemMap.get(folder.Id);
		if (id) {
			return id;
		}
		id = this.index++;
		this.keyItemMap.set(folder.Id, id);
		this.keyEntityMap.set(folder.Id, folder);
		return id;
	}

	public fetchFolderById(folderId: string): IBasicsBim360DocumentViewEntity | undefined {
		const id = this.keyItemMap.get(folderId); //todo-Any: remove local cache after string type id is supported by lookup base.
		const f = this.keyEntityMap.get(folderId);
		if (id && f) {
			return this.helperService.toDocumentViewEntity(f, id);
		}
		return undefined;
	}

	public clearCache() {
		this.keyItemMap.clear();
		this.keyEntityMap.clear();
		this.index = 0;
	}

	public getFolderList(dialog?: IBasicsBim360DocumentDialogModel, searchText: string | null = null): Observable<IBasicsBim360DocumentViewEntity[]> {
		if (!dialog || !dialog.projInfo) {
			return of([]);
		}
		if (this.curProjInfo && this.curProjInfo.PrjId !== dialog.projInfo.PrjId) {
			// project changed, reset cache.
			this.clearCache();
		}
		this.curProjInfo = dialog.projInfo;

		return new Observable((observer) => {
			const tokenInfoTwoLegs = this.bim360AuthService.getSessionAuth(BasicsBim360AuthenticationType.TwoLegged);
			const requestInfo: IBasicsBim360DocumentRequestEntity = {
				TokenInfo: tokenInfoTwoLegs,
				TokenInfo2: null,
				ProjInfo: this.helperService.toProject(dialog?.projInfo),
				Options: {
					SearchText: searchText, //the searchText seems doesn't work as expected?
				},
			};

			this.http.post$<IBasicsBim360ResponseEntity>(this.queryFolderUrl, requestInfo).subscribe({
				next: (resData) => {
					this.bim360AuthService.setSessionAuth(resData.TokenInfo);
					if (resData.StateCode === BasicsBim360ResponseStatusCode.OK) {
						if (resData.ResultMsg) {
							const folderList = JSON.parse(resData.ResultMsg) as unknown as IBasicsBim360DocumentEntity[];
							if (folderList) {
								const lookupList = folderList.map((f) => {
									return this.helperService.toDocumentViewEntity(f, this.fetchId(f)); // string type id is not supported by lookup base.
								});
								observer.next(lookupList);
							}
							observer.complete();
						}
					} else {
						observer.error(resData.ResultMsg);
					}
				},
				error: (err) => {
					observer.error(err);
				},
			}); //end of this.http.post
		});
	}
}
