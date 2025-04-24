/*
 * Copyright(c) RIB Software GmbH
 */

import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { IBasicsSyncBim360DocumentsDialogModel } from '../model/entities/dialog/sync-bim360-documents-dialog-model.interface';
import { IBasicsBim360DocumentEntity } from '../model/entities/basics-bim360-document-entity.interface';
import { IBasicsBim360DocumentViewEntity } from '../lookup/entities/basics-bim360-document-view-entity.interface';
import { BasicsSharedBim360AuthenticationService } from './basics-shared-bim360-authentication.service';
import { BasicsSharedBim360HelperService } from './basics-shared-bim360-helper.service';
import { BasicsBim360AuthenticationType } from '../model/enums/basics-bim360-authentication-type.enum';
import { IBasicsBim360ResponseEntity } from '../model/entities/response/basics-bim360-response-entity.interface';
import { IBasicsBim360SaveDocumentsResponseEntity } from '../model/entities/response/save-documents-response-entity.interface';
import { IBasicsBim360SaveDocumentsRequestEntity } from '../model/entities/request/save-documents-request-entity.interface';
import { IBasicsBim360DocumentRequestEntity } from '../model/entities/request/basics-bim360-document-request-entity.interface';
import { BasicsBim360ResponseStatusCode } from '../model/enums/basics-bim360-response-status-code.enum';
import { IBasicsBim360ProjectEntity } from '../model/entities/basics-bim360-project-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedSyncBim360DocumentsService {
	private readonly http = inject(PlatformHttpService);
	private readonly bim360AuthService = inject(BasicsSharedBim360AuthenticationService);
	private readonly helperService = inject(BasicsSharedBim360HelperService);
	private readonly queryDocumentsUrl = 'documents/centralquery/bim360/documents';
	private readonly saveDocumentsUrl = 'documents/centralquery/bim360/saveDocuments';

	private curProjInfo?: IBasicsBim360ProjectEntity | null;
	private keyItemMap = new Map<string, number>();
	private index: number = 0;

	private fetchId(folder: IBasicsBim360DocumentEntity) {
		let id = this.keyItemMap.get(folder.Id);
		if (id) {
			return id;
		}
		id = ++this.index;
		this.keyItemMap.set(folder.Id, id);
		return id;
	}

	public clearCache() {
		this.keyItemMap.clear();
		this.index = 0;
	}

	/**
	 * Load BIM 360 documents.
	 * @param dialog Data saved in dialog.
	 */
	public loadBim360Documents$(dialog: IBasicsSyncBim360DocumentsDialogModel): Observable<IBasicsBim360DocumentViewEntity[]> {
		return new Observable((observer) => {
			if (this.curProjInfo?.PrjId !== dialog.projInfo?.PrjId) {
				// if project changed, reset cache.
				this.clearCache();
			}
			this.curProjInfo = dialog.projInfo;

			const tokenInfoTwoLegs = this.bim360AuthService.getSessionAuth(BasicsBim360AuthenticationType.TwoLegged);

			const requestInfo: IBasicsBim360DocumentRequestEntity = {
				TokenInfo: tokenInfoTwoLegs,
				TokenInfo2: null,
				ProjInfo: this.helperService.toProject(dialog?.projInfo),
				Options: {
					SearchText: dialog.searchText,
					Path: dialog.folderInfo?.srcEntity.Id,
				},
			};

			this.http.post$<IBasicsBim360ResponseEntity>(this.queryDocumentsUrl, requestInfo).subscribe({
				next: (resData) => {
					this.bim360AuthService.updateSessionToken(resData.TokenInfo, resData.TokenInfo2);
					if (resData.StateCode === BasicsBim360ResponseStatusCode.OK) {
						let lookupList: IBasicsBim360DocumentViewEntity[] = [];
						if (resData.ResultMsg) {
							const docList = JSON.parse(resData.ResultMsg) as unknown as IBasicsBim360DocumentEntity[];
							if (docList) {
								lookupList = docList.map((f) => {
									return this.helperService.toDocumentViewEntity(f, this.fetchId(f)); // string type id is not supported by lookup base.
								});
							}
						}
						observer.next(lookupList ?? []);
						observer.complete();
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

	/**
	 * Save BIM 360 documents to 4.0.
	 * @param toSave documents to saved.
	 * @param dialog Data saved in dialog.
	 */
	public saveDocuments$(toSave: IBasicsBim360DocumentEntity[], dialog: IBasicsSyncBim360DocumentsDialogModel): Observable<IBasicsBim360SaveDocumentsResponseEntity> {
		return new Observable((observer) => {
			const tokenInfoTwoLegs = this.bim360AuthService.getSessionAuth(BasicsBim360AuthenticationType.TwoLegged);

			const requestInfo: IBasicsBim360SaveDocumentsRequestEntity = {
				TokenInfo: tokenInfoTwoLegs,
				TokenInfo2: null,
				ProjInfo: this.helperService.toProject(dialog?.projInfo),
				DocumentList: toSave,
				Options: {
					SearchText: dialog.searchText,
					Path: dialog.folderInfo?.srcEntity.Id,
					Compress2Zip: dialog.checkBoxCompressChecked,
					ZipFileName: dialog.zipFileName,
				},
			};

			this.http.post$<IBasicsBim360SaveDocumentsResponseEntity>(this.saveDocumentsUrl, requestInfo).subscribe({
				next: (resData) => {
					this.bim360AuthService.updateSessionToken(resData.TokenInfo, resData.TokenInfo2);
					observer.next(resData);
				},
				error: (err) => {
					observer.error(err);
				},
			});
		});
	}
}
