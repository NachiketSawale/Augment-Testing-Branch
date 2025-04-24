/*
 * Copyright(c) RIB Software GmbH
 */

import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { BasicsSharedBim360AuthenticationService } from './basics-shared-bim360-authentication.service';
import { BasicsSharedBim360HelperService } from './basics-shared-bim360-helper.service';
import { BasicsBim360AuthenticationType } from '../model/enums/basics-bim360-authentication-type.enum';
import { IBasicsBim360ResponseEntity } from '../model/entities/response/basics-bim360-response-entity.interface';
import { IBasicsBim360DocumentRequestEntity } from '../model/entities/request/basics-bim360-document-request-entity.interface';
import { BasicsBim360ResponseStatusCode } from '../model/enums/basics-bim360-response-status-code.enum';
import { IBasicsDocumentToBim360Entity } from '../model/entities/basics-document-to-bim360-entity.interface';
import { IBasicsSaveDocumentsToBim360RequestEntity } from '../model/entities/request/save-documents-to-bim360-request-entity.interface';
import { IBasicsSyncDocumentsToBim360DialogModel } from '../model/entities/dialog/sync-documents-to-bim360-dialog-model.interface';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedSyncDocumentsToBim360Service {
	private readonly http = inject(PlatformHttpService);
	private readonly bim360AuthService = inject(BasicsSharedBim360AuthenticationService);
	private readonly helperService = inject(BasicsSharedBim360HelperService);
	private readonly queryDocumentsUrl = 'documents/centralquery/bim360/loadITwoDocuments';
	private readonly saveDocumentsUrl = 'documents/centralquery/bim360/uploadDocuments';

	/**
	 * Load BIM 360 documents.
	 * @param dialog Data saved in dialog.
	 */
	public loadDocuments$(dialog: IBasicsSyncDocumentsToBim360DialogModel): Observable<IBasicsDocumentToBim360Entity[]> {
		return new Observable((observer) => {
			const tokenInfoTwoLegs = this.bim360AuthService.getSessionAuth(BasicsBim360AuthenticationType.TwoLegged);

			const requestInfo: IBasicsBim360DocumentRequestEntity = {
				TokenInfo: tokenInfoTwoLegs,
				TokenInfo2: null,
				ProjInfo: this.helperService.toProject(dialog?.projInfo),
				Options: {
					SearchText: dialog.searchText,
				},
			};

			this.http.post$<IBasicsBim360ResponseEntity>(this.queryDocumentsUrl, requestInfo).subscribe({
				next: (resData) => {
					this.bim360AuthService.updateSessionToken(resData.TokenInfo, resData.TokenInfo2);
					if (resData.StateCode === BasicsBim360ResponseStatusCode.OK) {
						let docList: IBasicsDocumentToBim360Entity[] = [];
						if (resData.ResultMsg) {
							docList = JSON.parse(resData.ResultMsg) as unknown as IBasicsDocumentToBim360Entity[];
						}
						observer.next(docList ?? []);
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
	 * Save 4.0 documents to BIM 360.
	 * @param toSave documents to saved.
	 * @param dialog Data saved in dialog.
	 */
	public saveDocumentsToBim360$(toSave: IBasicsDocumentToBim360Entity[], dialog: IBasicsSyncDocumentsToBim360DialogModel): Observable<IBasicsBim360ResponseEntity> {
		return new Observable((observer) => {
			const tokenInfoTwoLegs = this.bim360AuthService.getSessionAuth(BasicsBim360AuthenticationType.TwoLegged);

			const requestInfo: IBasicsSaveDocumentsToBim360RequestEntity = {
				TokenInfo: tokenInfoTwoLegs,
				TokenInfo2: null,
				ProjInfo: this.helperService.toProject(dialog?.projInfo),
				DocumentList: toSave,
				Options: {
					SearchText: dialog.searchText,
					Path: dialog.folderInfo?.srcEntity.Id,
				},
			};

			this.http.post$<IBasicsBim360ResponseEntity>(this.saveDocumentsUrl, requestInfo).subscribe({
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
