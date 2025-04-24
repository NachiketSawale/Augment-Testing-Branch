/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable} from '@angular/core';
import {PlatformHttpService, ServiceLocator} from '@libs/platform/common';

@Injectable({
    providedIn: 'root'
})
export class BasicsSharedTeamsManagementService {
    private readonly httpService = ServiceLocator.injector.get(PlatformHttpService);
    public enableTeamsChatNavigation: boolean = true;

    public constructor() {
        this.prepareTeamsChatOption();
    }

    private prepareTeamsChatOption() {
        this.httpService.get<boolean>('basics/common/systemoption/isenableteamschatnavigation').then(res => {
				this.enableTeamsChatNavigation = res;
			});
    }
}