/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject, Injector } from '@angular/core';
import { IModuleNavigation } from '../model/module-navigation/module-navigation.interface';
import { INavigationInfo } from '../model/module-navigation/navigation-info.interface';
import { Router } from '@angular/router';
import { PlatformKeyService } from './platform-key.service';
import { PlatformConfigurationService } from './platform-configuration.service';
import { InitializationContext } from '../model';

/**
 * Service used for navigating between modules.
 */
@Injectable({
	providedIn: 'root'
})
export class PlatformModuleNavigationService implements IModuleNavigation {

	/**
	 *  Provide access to angular router.
	 */
	private readonly router = inject(Router);

	private readonly injector = inject(Injector);

	private readonly platformKeyService = inject(PlatformKeyService);

	private readonly platformConfigurationService = inject(PlatformConfigurationService);

	private activeNavigationPayload?: INavigationInfo;

	private readonly navigationInfoKey: string = 'moduleNavigationInfo';

	/**
	 * navigates to a defined business module
	 *
	 * @param navigationInfo navigationInfo, the payload which is used for identifying target module and entities
	 * returns
	 */
	public navigate(navigationInfo: INavigationInfo): Promise<boolean> {
		const errorFn = () => console.error('invalid navigation info');
		if (navigationInfo.internalModuleName !== '' && navigationInfo.internalModuleName.includes('.')) {
			const targetModule = navigationInfo.internalModuleName.replace('.', '/');
			if (targetModule) {
				const isCtrlPressed = this.platformKeyService.isCtrlPressed();
				const isShiftPressed = this.platformKeyService.isShiftPressed();
				this.activeNavigationPayload = navigationInfo;
				if (!isCtrlPressed && !isShiftPressed) {
					return this.router.navigate([targetModule.toLowerCase()]).then((navResult) => {
						if (!navResult) {
							errorFn();
						}
						navigationInfo.onNavigationDone?.(navigationInfo);
						return navResult;
					});
				} else {
					navigationInfo.entityIdentifications = typeof navigationInfo.entityIdentifications === 'function' ? navigationInfo.entityIdentifications(new InitializationContext(this.injector)) : navigationInfo.entityIdentifications;
					this.platformConfigurationService.setApplicationValue(this.navigationInfoKey, JSON.stringify(navigationInfo), true);
					window.open(`${this.platformConfigurationService.clientUrl}#/${targetModule}`, isCtrlPressed ? '_blank' : undefined);
				}
			}
		}
		errorFn();
		return Promise.resolve(false);
	}

	/**
	 *  Provide access to activeNavigationPayload.
	 */
	public get navigationPayload() {
		const navInfoFromLS = JSON.parse(this.platformConfigurationService.getApplicationValue(this.navigationInfoKey) as string) as INavigationInfo;
		const temp = {...this.activeNavigationPayload ? this.activeNavigationPayload : navInfoFromLS};
		this.platformConfigurationService.removeApplicationValue(this.navigationInfoKey);
		this.activeNavigationPayload = undefined;

		return temp;
	}

}
