/*
 * Copyright(c) RIB Software GmbH
 */
import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { BasicsBim360AuthenticationType } from '../model/enums/basics-bim360-authentication-type.enum';
import { IBasicsBim360ResponseEntity } from '../model/entities/response/basics-bim360-response-entity.interface';
import { BasicsSharedBim360AuthenticationService } from './basics-shared-bim360-authentication.service';
import { IBasicsBim360ProjectEntity } from '../model/entities/basics-bim360-project-entity.interface';
import { IBasicsBim360DocumentRequestEntity } from '../model/entities/request/basics-bim360-document-request-entity.interface';
import { BasicsBim360ResponseStatusCode } from '../model/enums/basics-bim360-response-status-code.enum';

/**
 * Autodesk bim360 search service.
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedBim360ProjectForDocumentService {
	private readonly http = inject(PlatformHttpService);
	private readonly bim360AuthService = inject(BasicsSharedBim360AuthenticationService);
	private readonly queryProjectUrl = 'documents/centralquery/bim360/projects';

	public getProjectList(searchText: string | null = null): Observable<IBasicsBim360ProjectEntity[]> {
		return new Observable((observer) => {
			const tokenInfoTwoLegs = this.bim360AuthService.getSessionAuth(BasicsBim360AuthenticationType.TwoLegged);
			const requestInfo: IBasicsBim360DocumentRequestEntity = {
				ProjInfo: null,
				TokenInfo: tokenInfoTwoLegs,
				TokenInfo2: null,
				Options: {
					SearchText: searchText,
				},
			};

			this.http.post$<IBasicsBim360ResponseEntity>(this.queryProjectUrl, requestInfo).subscribe({
				next: (resData) => {
					this.bim360AuthService.setSessionAuth(resData.TokenInfo);

					if (resData.StateCode === BasicsBim360ResponseStatusCode.OK) {
						if (resData.ResultMsg) {
							const projectsInfos = JSON.parse(resData.ResultMsg) as unknown as IBasicsBim360ProjectEntity[];
							if (projectsInfos) {
								projectsInfos.forEach((project) => {
									project.Id = project.PrjId;
								});
								observer.next(projectsInfos);
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
