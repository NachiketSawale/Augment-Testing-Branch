/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { ICompanyInfo, IHeaderInfo } from '../../model/interfaces/session-info-header.interface';
import { Router } from '@angular/router';
import { PlatformConfigurationService } from '@libs/platform/common';
import { IOidcUserData } from '@libs/platform/common';
import { PlatformAuthService } from '@libs/platform/authentication';

@Component({
	selector: 'ui-main-frame-session-info-header',
	templateUrl: './session-info-header.component.html',
	styleUrls: ['./session-info-header.component.scss']
})
export class UiMainFrameSessionInfoHeaderComponent implements OnInit, AfterViewInit, OnDestroy {

	@Input()
	public headerInfo!: IHeaderInfo;

	@Input()
	public companyInfo!: ICompanyInfo;

	@Input()
	public roleInfo!: string;

	private unSubscribeAll: Subject<void> = new Subject();

	public constructor(private router: Router,
	                   private authService: PlatformAuthService,
	                   private configurationService: PlatformConfigurationService) {
	}

	public ngAfterViewInit(): void {

		this.configurationService.contextChangeEmitter.subscribe(
			(context) => {
				this.companyInfo = {
					companyCode: context.checkCompanyResponse.companyCode,
					companyId: context.checkCompanyResponse.signedInCompanyId,
					companyName: context.checkCompanyResponse.companyName,
					roleName: context.checkCompanyResponse.roleName
				};
				this.setUserAndRoleInfo();
			});


	}

	public ngOnInit(): void {

		const contextResult = this.configurationService ? this.configurationService.getContextResult : null;
		if (contextResult) {
			this.companyInfo = {
				companyCode: contextResult.signedInCompanyCode,
				companyId: contextResult.signedInCompanyId,
				companyName: contextResult.signedInCompanyName,
				roleName: contextResult.roleName
			};
		} else {
			this.getCompanyInfo();
		}

		this.setUserAndRoleInfo();

	}

	private setUserAndRoleInfo() {
		this.authService.getUserData().subscribe((userData: IOidcUserData) => {
			if (userData) {
				this.roleInfo = `${userData.name}(${userData.idp}) | ${this.companyInfo.roleName}`; // 'neiljohnson@winjit.com' + '(Local)' + ' | ' + this.companyInfo.roleName + '';
			} else {
				this.getUserandRoleInfo();
			}
		});
	}


	/**
	 * @ngdoc function
	 * @name getCompanyInfo
	 * @description This function is used to get user CompanyInfo
	 */
	private getCompanyInfo() {
		this.companyInfo = JSON.parse(localStorage.getItem('-ctx') || '{}');
		if (this.companyInfo) {
			this.companyInfo = {
				companyCode: '902',
				companyId: 78,
				companyName: 'Testdata',
				roleName: '1 Admin'
			};
		}
	}

	/**
	 * @ngdoc function
	 * @name getUserandRoleInfo
	 * @description This function is used to get user LoginInfo for eg.IdpName,UserName,roleName
	 */
	private getUserandRoleInfo(): void {
		const userNameRoleName = '<not logged in>';// + ' | ' + this.companyInfo.roleName + '';
		this.roleInfo = userNameRoleName;
	}

	public ngOnDestroy(): void {
		if (this.unSubscribeAll) {
			this.unSubscribeAll.next();
			this.unSubscribeAll.complete();
		}
	}
}
