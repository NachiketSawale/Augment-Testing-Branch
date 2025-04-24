/*
 * Copyright(c) RIB Software GmbH
 */

import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { BasicsSharedBim360AuthenticationService } from './basics-shared-bim360-authentication.service';
import { BasicsBim360AuthenticationType } from '../model/enums/basics-bim360-authentication-type.enum';
import { BasicsBim360ResponseStatusCode } from '../model/enums/basics-bim360-response-status-code.enum';
import { IBasicsSyncProjectToBim360DialogModel } from '../model/entities/dialog/sync-project-to-bim360-dialog-model.interface';
import { IBasicsBim360InitProjectDataResponseEntity } from '../model/entities/response/bim360-init-project-data-response-entity.interface';
import { IBasicsBim360ResponseEntity } from '../model/entities/response/basics-bim360-response-entity.interface';
import { IBasicsBim360ProjectDataRequestEntity } from '../model/entities/request/bim360-project-data-request-entity.interface';
import { IBasicsCreateBim360ProjectRequestEntity } from '../model/entities/request/create-bim360-project-request-entity.interface';
import { IBasicsBim360CreateProjectEntity, IBasicsBim360CreateProjectUserEntity } from '../model/entities/basics-bim360-createproject-entity.interface';
import { IBasicsSaveProjectToBim360ResponseEntity } from '../model/entities/response/save-project-to-bim360-response-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedSyncProjectToBim360Service {
	private readonly http = inject(PlatformHttpService);
	private readonly bim360AuthService = inject(BasicsSharedBim360AuthenticationService);
	private readonly queryProjectByIdUrl = 'basics/common/bim360/projects/byid';
	private readonly createProjectUrl = 'basics/common/bim360/projects/create';
	private readonly initProjectDataUrl = 'project/main/bim360/Init';

	public initProjectData$(dialog: IBasicsSyncProjectToBim360DialogModel): Observable<IBasicsBim360InitProjectDataResponseEntity> {
		return new Observable((observer) => {
			const tokenInfoTwoLegs = this.bim360AuthService.getSessionAuth(BasicsBim360AuthenticationType.TwoLegged);

			dialog.paramsInfo = {
				TokenInfo: tokenInfoTwoLegs ?? this.bim360AuthService.getDefaultTwoLeggedToken(),
				BasCurrencyFk: dialog.projectData?.CurrencyFk ?? undefined,
				BasStateFk: (dialog.projectData?.AddressEntity && dialog.projectData.AddressEntity.StateFk) ?? undefined,
				BasCountryFk: dialog.projectData?.CountryFk ?? undefined,
				BasContractFk: dialog.projectData?.ContractTypeFk ?? undefined,
			};

			this.http.post$<IBasicsBim360InitProjectDataResponseEntity>(this.initProjectDataUrl, dialog.paramsInfo).subscribe({
				next: (resData) => {
					if (resData.StateCode && resData.StateCode !== BasicsBim360ResponseStatusCode.OK) {
						observer.error(resData.ResultMsg);
					} else {
						if (resData.usersInfo) {
							this.bim360AuthService.setSessionAuth(resData.usersInfo?.TokenInfo);
						}
						observer.next(resData);
						observer.complete();
					}
				},
				error: (err) => {
					observer.error(err);
				},
			}); //end of this.http.post
		});
	}

	/**
	 * Load BIM 360 project data.
	 * @param projectTemplateId.
	 */
	public loadProjectDataById$(projectTemplateId: string): Observable<IBasicsBim360ResponseEntity> {
		return new Observable((observer) => {
			const tokenInfoTwoLegs = this.bim360AuthService.getSessionAuth(BasicsBim360AuthenticationType.TwoLegged);

			const requestInfo: IBasicsBim360ProjectDataRequestEntity = {
				TokenInfo: tokenInfoTwoLegs,
				ProjInfo: {
					projectNo: projectTemplateId,
				},
			};

			this.http.post$<IBasicsBim360ResponseEntity>(this.queryProjectByIdUrl, requestInfo).subscribe({
				next: (resData) => {
					this.bim360AuthService.setSessionAuth(resData.TokenInfo);
					observer.next(resData);
				},
				error: (err) => {
					observer.error(err);
				},
			}); //end of this.http.post
		});
	}

	/**
	 * Save 4.0 project to BIM 360.
	 * @param toSave project to be saved.
	 * @param userData
	 */
	public saveProjectToBim360$(toSave: IBasicsBim360CreateProjectEntity, userData: IBasicsBim360CreateProjectUserEntity): Observable<IBasicsSaveProjectToBim360ResponseEntity> {
		return new Observable((observer) => {
			const tokenInfoTwoLegs = this.bim360AuthService.getSessionAuth(BasicsBim360AuthenticationType.TwoLegged);

			const requestInfo: IBasicsCreateBim360ProjectRequestEntity = {
				TokenInfo: tokenInfoTwoLegs,
				TokenInfo2: null,
				CreateProjectData: toSave,
				UserData: userData,
			};

			this.http.post$<IBasicsSaveProjectToBim360ResponseEntity>(this.createProjectUrl, requestInfo).subscribe({
				next: (resData) => {
					this.bim360AuthService.setSessionAuth(resData.TokenInfo);
					observer.next(resData);
				},
				error: (err) => {
					observer.error(err);
				},
			});
		});
	}
}
