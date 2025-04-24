/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnInit } from '@angular/core';
import {AboutDialogService, IDropDownButtonData, IItems,} from '@libs/ui/common';
import { PlatformConfigurationService } from '@libs/platform/common';
import { IMainMenu } from '../../model/interfaces/main-menu.interface';
import { Router } from '@angular/router';
import { PlatformAuthService } from '@libs/platform/authentication';


@Component({
	selector: 'ui-main-frame-main-menu',
	templateUrl: './main-menu.component.html',
	styleUrls: ['./main-menu.component.scss'],
})
export class UiMainFrameMainMenuComponent implements OnInit, IMainMenu {

	private configService = inject(PlatformConfigurationService);
	private aboutDialogService = inject(AboutDialogService);


	public itemIdx: number = 0;
	public mainMenuDeclaration!: IDropDownButtonData;

	public constructor(private router: Router, private authService: PlatformAuthService) {
	}

	public ngOnInit(): void {
		this.mainMenuDeclaration = this.getMainMenu();
	}

	/**
	 * @ngdoc function
	 * @name makeItem
	 * @methodOf MainMenuComponent
	 * @param id
	 * @param captionTr
	 * @param cssclass
	 * @param caption
	 * @param disabled
	 * @returns object
	 * @description This function sets the mainMenuDeclaration for item type
	 */
	public makeItem(id: string, captionTr: string, cssclass: string, caption: string, disabled: boolean | null, callBack?: (items: IItems) => void): IItems {
		return {
			id: id,
			captionString: captionTr ? captionTr : '',
			type: 'item',
			cssClass: cssclass,
			caption: caption,
			disabled: disabled,
			fn: callBack
		};
		//later on need to work on this modaloptions functionality
	}

	/**
	 * @ngdoc function
	 * @name makeDivider
	 * @methodOf MainMenuComponent
	 * @param id string
	 * @description This function sets the mainMenuDeclaration for divider type
	 */
	public makeDivider(id: string): IItems {
		return {
			id: id,
			type: 'divider',
			captionString: '',
			cssClass: '',
			caption: '',
			disabled: false,
			isDisplayed: true,
		};
	}

	/**
	 * @ngdoc function
	 * @name navigateToCompany
	 * @description Navigates to the 'company' route using the router service.
	 */
	private navigateToCompany = () => {
		this.router.navigate(['company']);	
	};

	/**
	 * @ngdoc function
	 * @name navigateToLogin
	 * @description Initiates the login process.
	 */
	private navigateToLogin = () => {
		this.authService.login();	
	};

	/**
	 * @ngdoc function
	 * @name navigateToLogout
	 * @description Logs the user out and revokes associated tokens.
	 */
	private navigateToLogout = () => {
		this.authService.logoffAndRevokeTokens();
	};

	/**
	 * @ngdoc function
	 * @name navigateToAboutDialog
	 * @description navigate to about dialog.
	 */
	private navigateToAboutDialog = (theItem:IItems) => {
		this.aboutDialogService.openAboutDialog(theItem.id);
	};


	/**
	 * @ngdoc function
	 * @name getMainMenu
	 * @methodOf MainMenuComponent
	 * @description This function sets the mainMenuDeclaration
	 */
	private getMainMenu() {
		return {
			cssClass: 'btn-main',
			showSVGTag: true,
			svgSprite: 'sidebar-icons',
			svgImage: 'ico-menue',
			svgCssClass: 'block-image',
			list: {
				cssClass: 'dropdown-menu dropdown-menu-right',
				items: [
					this.makeItem('item' + this.itemIdx++, 'cloud.desktop.mainMenuSettings', 'ico-settings', 'Settings', false),
					this.makeItem('item' + this.itemIdx++, 'cloud.desktop.mainMenuCompany', 'ico-company', 'Company/Role Selection', null, this.navigateToCompany),
					this.makeItem('item' + this.itemIdx++, 'cloud.desktop.externalSystemCredential.dialogTitle', 'ico-users', 'External System Credentials', this.configService.isPortal),
					this.makeItem('item' + this.itemIdx++, 'cloud.desktop.clerkProxy.absence', 'ico-clerk', 'Absence', this.configService.isPortal),
					this.makeItem('item' + this.itemIdx++, 'cloud.desktop.navBarDocuDesc', 'ico-help', 'Documentation', null),
					this.makeItem('item' + this.itemIdx++, 'cloud.desktop.navBarMarketplaceDesc', 'ico-marketplace', 'Marketplace', null),
					this.makeItem('item' + this.itemIdx++, 'cloud.desktop.mainMenuLogon', 'control-icons ico-logon', 'Logon', null, this.navigateToLogin),
					this.makeItem('item' + this.itemIdx++, 'cloud.desktop.mainMenuLogout', 'control-icons ico-logout', 'Logout', null, this.navigateToLogout),
					this.makeDivider('item' + this.itemIdx++),
					this.makeItem('item' + this.itemIdx++, 'cloud.desktop.mainMenuAbout', 'ico-about', 'About', null, this.navigateToAboutDialog),
				],
			},
		};
	}
}
