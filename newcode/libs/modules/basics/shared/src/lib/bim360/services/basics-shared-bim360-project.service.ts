/*
 * Copyright(c) RIB Software GmbH
 */
import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { BasicsBim360AuthenticationType } from '../model/enums/basics-bim360-authentication-type.enum';
import { BasicsSharedBim360AuthenticationService } from './basics-shared-bim360-authentication.service';
import { IBasicsBim360ProjectEntity } from '../model/entities/basics-bim360-project-entity.interface';
import { IBasicsBim360ProjectRequestEntity } from '../model/entities/request/bim360-project-request-entity.interface';
import { IBasicsBim360ProjectResponseEntity } from '../model/entities/response/basics-bim360-project-response-entity.interface';

/**
 * Autodesk bim360 search service.
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedBim360ProjectService {
	private readonly http = inject(PlatformHttpService);
	private readonly bim360AuthService = inject(BasicsSharedBim360AuthenticationService);
	private readonly queryProjectUrl = 'defect/main/bim360/projects';

	public getProjectList(searchText: string | null = null): Observable<IBasicsBim360ProjectEntity[]> {
		return new Observable((observer) => {
			const tokenInfoTwoLegs = this.bim360AuthService.getSessionAuth(BasicsBim360AuthenticationType.TwoLegged);
			const requestInfo: IBasicsBim360ProjectRequestEntity = {
				TokenInfo: tokenInfoTwoLegs ?? this.bim360AuthService.getDefaultTwoLeggedToken(),
				FilterKey: searchText,
			};

			this.http.post$<IBasicsBim360ProjectResponseEntity>(this.queryProjectUrl, requestInfo).subscribe({
				next: (resData) => {
					this.bim360AuthService.setSessionAuth(resData.TokenInfo);

					const projects = resData.Bim360Projects;
					if (projects) {
						projects.forEach((project) => {
							project.Id = project.PrjId;
						});
					}
					observer.next(projects ?? []);
					observer.complete();
				},
				error: (err) => {
					observer.error(err);
				},
			}); //end of this.http.post
		});
	}
}
