/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { OnInit, Component, ViewContainerRef } from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';
import { UserDataResult } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { PlatformAuthService } from '@libs/platform/authentication';

@Component({
	selector: 'itwo40-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
// TODO: remove implementation of AfterViewInit?
export class AppComponent implements /*AfterViewInit,*/ OnInit {
	title = 'RIB iTWO 4.0';

	userData$?: Observable<UserDataResult>;
	isAuthenticated = false;

	constructor(private view: ViewContainerRef, private authService: PlatformAuthService, private configService: PlatformConfigurationService, private router: Router) {
	}

	ngOnInit(): void {
		this.authService.checkAuth().subscribe(({isAuthenticated, userData, accessToken, idToken}) => {
			if (!isAuthenticated) {
				this.router.navigate(['/app/main']);
			} else {
				this.authService.setAuthenticated(true);
				this.configService.trySwitchToSavedCompany(userData.user_id).subscribe((companyValid) => {
					if (companyValid) {
					} else {
						this.router.navigate(['company']);
					}
				});
			}
		});
	}

	/*
	ngAfterViewInit() {
		// This method does not exist.
		//this.modalDialogService.setContainerRef(this.view);
	}*/
}
