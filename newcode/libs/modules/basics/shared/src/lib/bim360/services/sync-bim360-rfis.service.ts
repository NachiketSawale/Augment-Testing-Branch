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
import { IBasicsSyncBim360RFIsDialogModel } from '../model/entities/dialog/sync-bim360-rfis-dialog-model.interface';
import { IBasicsBim360RFIViewEntity } from '../lookup/entities/basics-bim360-rfi-view-entity.interface';
import { IBasicsBim360RFIEntity } from '../model/entities/basics-bim360-rfi-entity.interface';
import { IBasicsBim360SaveRFIsRequestEntity } from '../model/entities/request/save-rfis-request-entity.interface';
import { IBasicsBim360SaveRFIsResponseEntity } from '../model/entities/response/save-rfis-response-entity.interface';
import { BasicsSharedBim360RFIStatusService } from './bim360-rfi-status.service';
import { IBasicsBim360LoadIssueRfiRequestEntity } from '../model/entities/request/load-issue-rfi-request-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedSyncBim360RFIsService {
	private readonly http = inject(PlatformHttpService);
	private readonly bim360AuthService = inject(BasicsSharedBim360AuthenticationService);
	private readonly helperService = inject(BasicsSharedBim360HelperService);
	private readonly statusService = inject(BasicsSharedBim360RFIStatusService);
	private readonly queryRFIsUrl = 'project/rfi/informationrequest/bim360/rfis';
	private readonly saveRFIsUrl = 'project/rfi/informationrequest/bim360/saverfis';

	private curProjInfo?: IBasicsBim360ProjectEntity | null;
	private keyItemMap = new Map<string, number>();
	private index: number = 0;

	private fetchId(entity: IBasicsBim360RFIEntity) {
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
	 * Load BIM 360 RFIs.
	 * @param dialog Data saved in dialog.
	 */
	public loadBim360RFIs$(dialog: IBasicsSyncBim360RFIsDialogModel): Observable<IBasicsBim360RFIViewEntity[]> {
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

			this.http.post$<IBasicsBim360ResponseEntity>(this.queryRFIsUrl, requestInfo).subscribe({
				next: (resData) => {
					this.bim360AuthService.updateSessionToken(resData.TokenInfo, resData.TokenInfo2);
					if (resData.StateCode === BasicsBim360ResponseStatusCode.OK) {
						let lookupList: IBasicsBim360RFIViewEntity[] = [];
						if (resData.ResultMsg) {
							const docList = JSON.parse(resData.ResultMsg) as unknown as IBasicsBim360RFIEntity[];
							if (docList) {
								lookupList = docList.map((f) => {
									const viewEntity = this.helperService.toRFIViewEntity(f, this.fetchId(f)); // string type id is not supported by lookup base.
									viewEntity.srcEntity.StatusDisplay = this.statusService.getRFIStatusDisplay(viewEntity.srcEntity.Status);
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
	 * Save BIM 360 RFIs to 4.0.
	 * @param toSave RFIs to be saved.
	 * @param dialog Data saved in dialog.
	 */
	public saveRFIs$(toSave: IBasicsBim360RFIEntity[], dialog: IBasicsSyncBim360RFIsDialogModel): Observable<IBasicsBim360SaveRFIsResponseEntity> {
		return new Observable((observer) => {
			const tokenInfo = this.bim360AuthService.getSessionAuth(BasicsBim360AuthenticationType.ThreeLegged);
			const tokenInfoTwoLegs = this.bim360AuthService.getSessionAuth(BasicsBim360AuthenticationType.TwoLegged);

			const requestInfo: IBasicsBim360SaveRFIsRequestEntity = {
				TokenInfo: tokenInfo,
				TokenInfo2: tokenInfoTwoLegs,
				ProjInfo: this.helperService.toProject(dialog?.projInfo),
				RfiList: toSave,
				Options: {
					ImportDocument: dialog.importDocument,
				},
			};

			this.http.post$<IBasicsBim360SaveRFIsResponseEntity>(this.saveRFIsUrl, requestInfo).subscribe({
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
