/*
 * Copyright(c) RIB Software GmbH
 */

import { InitializationContext, PlatformModuleNavigationService } from '@libs/platform/common';
import { inject, Injectable, Injector } from '@angular/core';
import { ConcreteMenuItem } from '../../model/menu-list/interface';
import { IMenuList } from '../../services/menu-list/menu-list.interface';
import {
	IModuleNavigator,
	ModuleNavigatorIdentification
} from '../model/module-navigator.interface';
import { ItemType } from '../../model/menu-list/enum/menulist-item-type.enum';

/**
 * Provides utility functions for navigators
 *
 * @group Fields API
 */
@Injectable({
	providedIn: 'root'
})
export class UiModuleNavigationHelperService {

	private readonly platformModuleNavigationService = inject(PlatformModuleNavigationService);
	private readonly injector = inject(Injector);
	private readonly NAV_GROUP_ID = 'navigationGroup';

	/**
	 * builds a navigator id
	 * @param navigator
	 */
	public buildId(navigator: ModuleNavigatorIdentification): string {
		return `navItem_${navigator.internalModuleName}` + (navigator.fieldId ? `_${navigator.fieldId}` : '');
	}

	public createGroupWithItems() {

	}

	/**
	 * createAndAdd a navigator menu item
	 * @param navigator
	 * @param toolbar
	 */
	public createAndAdd(navigator: IModuleNavigator, toolbar: IMenuList) {
		const navItem: ConcreteMenuItem = this.createNavigationItem(navigator);
		toolbar.addItems(navItem, this.NAV_GROUP_ID);
	}

	/**
	 * creates a navigationItem
	 * @param navInfo
	 */
	public createNavigationItem(navInfo: IModuleNavigator): ConcreteMenuItem {
		return {
			id: this.buildId({internalModuleName: navInfo.internalModuleName}),
			hideItem: false,
			iconClass: navInfo.icon,
			type: ItemType.Item,
			caption: navInfo.displayText,
			disabled: () => {
				const identificationData = typeof navInfo.entityIdentifications === 'function' ? navInfo.entityIdentifications(new InitializationContext(this.injector)) : navInfo.entityIdentifications;
				return identificationData.length === 0;
			},
			fn: () => {
				this.platformModuleNavigationService.navigate(navInfo);
			}
		};
	}

	/**
	 * Removes a single or all navigators
	 * @param toolbar
	 * @param navigatorIdentitfication
	 */
	public remove(toolbar: IMenuList, navigatorIdentitfication?: ModuleNavigatorIdentification) {
		if (!navigatorIdentitfication) {
			toolbar.deleteItems(this.NAV_GROUP_ID);
		} else {
			toolbar.deleteItems(this.buildId(navigatorIdentitfication));
		}
	}

}
