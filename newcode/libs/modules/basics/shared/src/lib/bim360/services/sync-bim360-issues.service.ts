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
import { BasicsBim360ResponseStatusCode } from '../model/enums/basics-bim360-response-status-code.enum';
import { IBasicsBim360ProjectEntity } from '../model/entities/basics-bim360-project-entity.interface';
import { IBasicsSyncBim360IssuesDialogModel } from '../model/entities/dialog/sync-bim360-issues-dialog-model.interface';
import { IBasicsBim360IssueViewEntity } from '../lookup/entities/basics-bim360-issue-view-entity.interface';
import { IBasicsBim360IssueEntity } from '../model/entities/basics-bim360-issue-entity.interface';
import { IBasicsBim360SaveIssuesRequestEntity } from '../model/entities/request/save-issues-request-entity.interface';
import { IBasicsBim360LoadIssueRfiRequestEntity } from '../model/entities/request/load-issue-rfi-request-entity.interface';
import { IBasicsBim360SaveIssuesResponseEntity } from '../model/entities/response/save-issues-response-entity.interface';
import { BasicsSharedBim360IssueStatusService } from './bim360-issue-status.service';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedSyncBim360IssuesService {
	private readonly http = inject(PlatformHttpService);
	private readonly bim360AuthService = inject(BasicsSharedBim360AuthenticationService);
	private readonly helperService = inject(BasicsSharedBim360HelperService);
	private readonly statusService = inject(BasicsSharedBim360IssueStatusService);
	private readonly queryIssuesUrl = 'defect/main/bim360/issues';
	private readonly saveIssuesUrl = 'defect/main/bim360/saveIssues';

	private curProjInfo?: IBasicsBim360ProjectEntity | null;
	private keyItemMap = new Map<string, number>();
	private index: number = 0;

	private fetchId(entity: IBasicsBim360IssueEntity) {
		let id = this.keyItemMap.get(entity.Id);
		if (id) {
			return id;
		}
		id = ++this.index;
		this.keyItemMap.set(entity.Id, id);
		return id;
	}

	public clearCache() {
		this.keyItemMap.clear();
		this.index = 0;
	}

	/**
	 * Load BIM 360 issues.
	 * @param dialog Data saved in dialog.
	 */
	public loadBim360Issues$(dialog: IBasicsSyncBim360IssuesDialogModel): Observable<IBasicsBim360IssueViewEntity[]> {
		return new Observable((observer) => {
			if (this.curProjInfo?.PrjId !== dialog.projInfo?.PrjId) {
				// if project changed, reset cache.
				this.clearCache();
			}
			this.curProjInfo = dialog.projInfo;

			const tokenInfo = this.bim360AuthService.getSessionAuth(BasicsBim360AuthenticationType.ThreeLegged);
			const tokenInfoTwoLegs = this.bim360AuthService.getSessionAuth(BasicsBim360AuthenticationType.TwoLegged);

			const requestInfo: IBasicsBim360LoadIssueRfiRequestEntity = {
				TokenInfo: tokenInfo,
				TokenInfo2: tokenInfoTwoLegs,
				ProjInfo: this.helperService.toProject(dialog?.projInfo),
				Options: {
					SearchText: dialog.searchText,
					Status: dialog.filterStatus,
					ShowImported: dialog.showImported,
				},
			};

			this.http.post$<IBasicsBim360ResponseEntity>(this.queryIssuesUrl, requestInfo).subscribe({
				next: (resData) => {
					this.bim360AuthService.updateSessionToken(resData.TokenInfo, resData.TokenInfo2);
					if (resData.StateCode === BasicsBim360ResponseStatusCode.OK) {
						let lookupList: IBasicsBim360IssueViewEntity[] = [];
						if (resData.ResultMsg) {
							const docList = JSON.parse(resData.ResultMsg) as unknown as IBasicsBim360IssueEntity[];
							if (docList) {
								lookupList = docList.map((f) => {
									const viewEntity = this.helperService.toIssueViewEntity(f, this.fetchId(f)); // string type id is not supported by lookup base.
									viewEntity.srcEntity.StatusDisplay = this.statusService.getIssueStatusDisplay(viewEntity.srcEntity.Status);
									return viewEntity;
								});
							}
						}
						observer.next(lookupList);
						observer.complete();
					} else {
						let err = resData.ResultMsg;
						if (!err || err === '[]') {
							err = resData.StateCode;
						}
						observer.error(err);
					}
				},
				error: (err) => {
					observer.error(err);
				},
			}); //end of this.http.post
		});
	}

	/**
	 * Save BIM 360 issues to 4.0.
	 * @param toSave issues to be saved.
	 * @param dialog Data saved in dialog.
	 */
	public saveIssues$(toSave: IBasicsBim360IssueEntity[], dialog: IBasicsSyncBim360IssuesDialogModel): Observable<IBasicsBim360SaveIssuesResponseEntity> {
		return new Observable((observer) => {
			const tokenInfo = this.bim360AuthService.getSessionAuth(BasicsBim360AuthenticationType.ThreeLegged);
			const tokenInfoTwoLegs = this.bim360AuthService.getSessionAuth(BasicsBim360AuthenticationType.TwoLegged);

			const requestInfo: IBasicsBim360SaveIssuesRequestEntity = {
				TokenInfo: tokenInfo,
				TokenInfo2: tokenInfoTwoLegs,
				ProjInfo: this.helperService.toProject(dialog?.projInfo),
				IssueList: toSave,
				Options: {
					ImportDocument: dialog.importDocument,
				},
			};

			this.http.post$<IBasicsBim360SaveIssuesResponseEntity>(this.saveIssuesUrl, requestInfo).subscribe({
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
