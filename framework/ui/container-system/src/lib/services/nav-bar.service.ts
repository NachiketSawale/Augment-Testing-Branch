/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { PlatformPermissionService, Translatable } from '@libs/platform/common';
import { Subject } from 'rxjs';
import {
	ConcreteMenuItem,
	IMenuItem,
	IMenuItemEventInfo,
	IMenuItemsList,
	isParentMenuItem,
	ItemType
} from '@libs/ui/common';
import { NavBarIdentifier } from '../model/nav-bar/nav-bar-identifier';

import { Permissions } from '@libs/platform/common';

@Injectable({
	providedIn: 'root',
})
export class ModuleNavBarService {
	private default!: IMenuItemsList;
	private current!: IMenuItemsList;

	public changed: Subject<void> = new Subject<void>();

	/**
	 *
	 * @param permissionService
	 */
	public constructor(
		private permissionService: PlatformPermissionService
	) {
		this.initializeDefault();
		this.initializeCurrent();
	}

	private initializeDefault() {
		this.default = this.createMenuListItem([
			this.createSimpleMenuItem(NavBarIdentifier.id.save, NavBarIdentifier.group.entityBased, { key: 'cloud.desktop.navBarSaveDesc' }, 'tlb-wh-icons', 'ico-save', 1, false),
			this.createSimpleMenuItem(NavBarIdentifier.id.prev, NavBarIdentifier.group.entityBased, { key: 'cloud.desktop.navBarGoToPrevDesc' }, 'tlb-wh-icons', 'ico-rec-previous', 2, false),
			this.createSimpleMenuItem(NavBarIdentifier.id.next, NavBarIdentifier.group.entityBased, { key: 'cloud.desktop.navBarGoToNextDesc' }, 'tlb-wh-icons', 'ico-rec-next', 3, false),
			this.createSimpleMenuItem(NavBarIdentifier.id.refreshSelection, NavBarIdentifier.group.entityBased, { key: 'cloud.desktop.navBarRefreshSelDesc' }, 'tlb-wh-icons', 'ico-refresh-all', 4, false),
			this.createSimpleMenuItem(NavBarIdentifier.id.refresh, NavBarIdentifier.group.entityBased, { key: 'cloud.desktop.navBarRefreshDesc' }, 'tlb-wh-icons', 'ico-refresh', 5, false),
			this.createSimpleMenuItem(NavBarIdentifier.id.docu, NavBarIdentifier.group.default, { key: 'cloud.desktop.navBarModuleDocuDesc' }, 'tlb-wh-icons', 'ico-help', 6, false),
			this.createSimpleMenuItem(NavBarIdentifier.id.video, NavBarIdentifier.group.entityBased, { key: 'cloud.desktop.navBarModuleVideoDesc' }, 'tlb-wh-icons', 'ico-video', 7, true),
			this.createDropdownMenuItem(NavBarIdentifier.id.optionMenu, NavBarIdentifier.group.entityBased, { key: 'platform.navOptionsMenu' }, 'tlb-wh-icons', 'ico-menu', 8, false,
				this.createMenuListItem([
					this.createSimpleMenuItem(NavBarIdentifier.id.first, NavBarIdentifier.group.entityBased, { key: 'cloud.desktop.navBarSaveDesc' }, 'tlb-icons', 'ico-rec-first', 1, false),
					this.createSimpleMenuItem(NavBarIdentifier.id.last, NavBarIdentifier.group.entityBased, { key: 'cloud.desktop.navBarGoToLastDesc' }, 'tlb-icons', 'ico-rec-last', 2, false),
					this.createSimpleMenuItem(NavBarIdentifier.id.discard, NavBarIdentifier.group.entityBased, { key: 'cloud.desktop.navBarDiscardDesc' }, 'tlb-icons', 'ico-discard', 3, false),
					this.createSimpleMenuItem(NavBarIdentifier.id.exportLayouts, NavBarIdentifier.group.entityBased, { key: 'cloud.desktop.navBarExportLayouts' }, 'tlb-icons', 'ico-export-all-views', 4, false),
					this.createSimpleMenuItem(NavBarIdentifier.id.auditTrail, NavBarIdentifier.group.entityBased, { key: 'cloud.desktop.navBarAuditTrailDesc' }, 'tlb-icons', 'ico-audit-trail', 5, false),
					this.createSimpleMenuItem(NavBarIdentifier.id.restore, NavBarIdentifier.group.entityBased, { key: 'cloud.desktop.navBarResetDeactivateMsg' }, 'tlb-icons', 'ico-reset', 6, false),
					this.createSimpleMenuItem(NavBarIdentifier.id.export, NavBarIdentifier.group.entityBased, { key: 'cloud.desktop.navBarExportDesc' }, 'tlb-icons', 'ico-export', 7, false),
					this.createSimpleMenuItem(NavBarIdentifier.id.import, NavBarIdentifier.group.entityBased, { key: 'cloud.desktop.navBarImportDesc' }, 'tlb-icons', 'ico-import', 8, false),

				], false, true)
			)
		], false, false, 'flex-box');
	}

	private initializeCurrent() {
		this.current = _.cloneDeep(this.default);
		this.updateState();
	}

	private updateState() {
		this.sortMenuItem(this.current.items);
		this.applyPermission(this.current.items);
	}

	private sortMenuItem(items?: IMenuItem[]) {
		if (!items) {
			return;
		}
		items.sort((a, b) => {
			if (a.sort === b.sort) {
				return 0;
			}
			return a.sort && b.sort && a.sort < b.sort ? -1 : 1;
		});

		items.forEach(item => {
			if (isParentMenuItem(item) && item.list.items) {
				this.sortMenuItem(item.list.items);
			}
		});
	}

	private changeDetect(changeFn: () => void) {
		changeFn();
		this.updateState();
		this.changed.next();
	}

	private hasChildren(item: ConcreteMenuItem) {
		return isParentMenuItem(item) && item.list.items?.length;
	}

	private applyPermission(items?: ConcreteMenuItem[]) {
		if (!items || !items.length) {
			return;
		}

		items.forEach(item => {
			if (item.permission) {
				let permission: Record<string, Permissions> = {};
				if (_.isString(item.permission)) {
					const splits = item.permission.split('#');
					permission[splits[0]] = this.permissionService.permissionsFromString(splits[1]);
				} else {
					permission = item.permission;
				}

				const hasPermission = Object.keys(permission).reduce((result, descriptor) => {
					return result && this.permissionService.has(descriptor, permission[descriptor]);
				}, true);

				if (!hasPermission) {
					item.hideItem = true;
				}
			}

			if (isParentMenuItem(item) && this.hasChildren(item)) {
				this.applyPermission(item.list.items);
			}
		});
	}

	private setMenuItemVisibility(keys: string[], visible: boolean) {
		this.changeDetect(() => {
			keys.forEach(key => {
				const action = this.getById(key);
				if (action) {
					action.hideItem = !visible;
				}
			});
		});
	}

	private setMenuItemUsability(keys: string[], enable: boolean) {
		this.changeDetect(() => {
			keys.forEach(key => {
				const action = this.getById(key);
				if (action) {
					action.disabled = !enable;
				}
			});
		});
	}

	private getByIdInternal(id: string, items?: ConcreteMenuItem[]): { target: ConcreteMenuItem | undefined, list: ConcreteMenuItem[] | undefined } {
		let result: { target: ConcreteMenuItem | undefined, list: ConcreteMenuItem[] | undefined } = { target: undefined, list: undefined };
		if (!id || !items || !items.length) {
			return result;
		}
		result.target = items.find(item => item.id === id);
		if (!result.target) {
			items.forEach(item => {
				if (!result.target && isParentMenuItem(item) && this.hasChildren(item)) {
					result = this.getByIdInternal(id, item.list?.items);
				}
			});
		} else {
			result.list = items;
		}
		return result;
	}

	private syncMenuItem(oldItem: IMenuItem, newItem: IMenuItem) {
		return _.extend(oldItem, newItem);
	}

	/**
	 * Create a menu item.
	 * @param id NavBarIdentifier.id or custom string value.
	 * @param groupId NavBarIdentifier.group or custom string value.
	 * @param caption A translatable object.
	 * @param svgSprite Svg sprite name.
	 * @param svgImage Svg image name.
	 * @param sort A number to sorting.
	 * @param hideItem Hide menu item if true.
	 * @param list A sub-list of menu item.
	 * @param cssClass Css class for menu item.
	 * @param iconClass Icon class for menu item.
	 * @param permission The required permission to execute menu item handler.
	 */
	public createSimpleMenuItem(id: string, groupId: string, caption: Translatable, svgSprite: string, svgImage: string, sort: number, hideItem: boolean, list?: IMenuItemsList, cssClass?: string, iconClass?: string, permission?: string | Record<string, Permissions>): ConcreteMenuItem {
		return {
			id: id,
			groupId: groupId,
			type: ItemType.Item,
			caption: caption,
			cssClass: cssClass,
			iconClass: iconClass ?? 'navbar-btn',
			svgSprite: svgSprite,
			svgImage: svgImage,
			permission: permission,
			hideItem: hideItem,
			sort: sort
		};
	}

	/**
	 * Create a dropdown menu item.
	 * @param id NavBarIdentifier.id or custom string value.
	 * @param groupId NavBarIdentifier.group or custom string value.
	 * @param caption A translatable object.
	 * @param svgSprite Svg sprite name.
	 * @param svgImage Svg image name.
	 * @param sort A number to sorting.
	 * @param hideItem Hide menu item if true.
	 * @param list A sub-list of menu item.
	 * @param cssClass Css class for menu item.
	 * @param iconClass Icon class for menu item.
	 * @param permission The required permission to execute menu item handler.
	 */
	public createDropdownMenuItem(id: string, groupId: string, caption: Translatable, svgSprite: string, svgImage: string, sort: number, hideItem: boolean, list: IMenuItemsList, cssClass?: string, iconClass?: string, permission?: string | Record<string, Permissions>): ConcreteMenuItem {
		return {
			id: id,
			groupId: groupId,
			type: ItemType.DropdownBtn,
			caption: caption,
			cssClass: cssClass,
			iconClass: iconClass ?? 'navbar-btn',
			svgSprite: svgSprite,
			svgImage: svgImage,
			permission: permission,
			list: list,
			hideItem: hideItem,
			sort: sort
		};
	}

	/**
	 * Create a menu list item.
	 * @param items The actually displayed menu items.
	 * @param showImages Determine whether to show images.
	 * @param showTitles Determine whether to show titles.
	 * @param cssClass Css class for menu list container.
	 * @param iconClass Css class for menu list container.
	 * @param activeValue Determine whether to active menu item.
	 */
	public createMenuListItem(items: ConcreteMenuItem[], showImages?: boolean, showTitles?: boolean, cssClass?: string, iconClass?: string, activeValue?: string | boolean): IMenuItemsList {
		return {
			cssClass: cssClass,
			items: items,
			showImages: showImages,
			showTitles: showTitles,
			activeValue: activeValue,
			overflow: false,
			iconClass: iconClass,
			layoutChangeable: false,
		};
	}

	/**
	 * Retrieve a menu item with specified id.
	 * @param id NavBarIdentifier.id or custom string value.
	 */
	public getById(id: string): ConcreteMenuItem | undefined {
		return this.getByIdInternal(id, this.current.items).target;
	}

	/**
	 * Retrieve current menu list item.
	 */
	public getCurrent(): IMenuItemsList {
		return this.current;
	}

	/**
	 * Add a menu item in specified parent menu.
	 * @param item The menu item to be added.
	 * @param parentId NavBarIdentifier.id or custom string value.
	 */
	public addMenuItem(item: ConcreteMenuItem, parentId?: string) {
		this.addMenuItems([item], parentId);
	}

	/**
	 * Add menu items in specified parent menu.
	 * @param items The set of menu items to be added.
	 * @param parentId NavBarIdentifier.id or custom string value.
	 */
	public addMenuItems(items: ConcreteMenuItem[], parentId?: string) {
		this.changeDetect(() => {
			items.forEach(item => {
				const oldItem = this.getById(item.id as string);
				if (oldItem) {
					this.syncMenuItem(oldItem, item);
				} else {
					const children = (() => {
						if (parentId) {
							const parent = this.getById(parentId);
							return (parent && isParentMenuItem(parent)) ? parent.list.items : undefined;
						}

						return this.current.items;
					})();

					if (children) {
						children.push(item);
					}
				}
			});
		});
	}

	/**
	 * Remove a menu item with specified id.
	 * @param id NavBarIdentifier.id or custom string value.
	 */
	public removeMenuItem(id: string) {
		this.removeMenuItems([id]);
	}

	/**
	 * Remove a menu item with specified id set.
	 * @param ids The set of NavBarIdentifier.id or custom string value.
	 */
	public removeMenuItems(ids: string[]) {
		this.changeDetect(() => {
			for (let i = 0; i < ids.length; i++) {
				const result = this.getByIdInternal(ids[i], this.current.items);
				if (result.target && result.list) {
					const index = result.list.findIndex(item => item === result.target);
					if (index >= 0) {
						result.list.splice(index, 1);
					}
				}
			}
		});
	}

	/**
	 * Hide menu item with specified id.
	 * @param id NavBarIdentifier.id or custom string value.
	 */
	public setMenuItemInVisible(id: string) {
		this.setMenuItemVisibility([id], false);
	}

	/**
	 * Show menu item with specified id.
	 * @param id NavBarIdentifier.id or custom string value.
	 */
	public setMenuItemVisible(id: string) {
		this.setMenuItemVisibility([id], true);
	}

	/**
	 * Disabled menu item with specified id.
	 * @param id NavBarIdentifier.id or custom string value.
	 */
	public setMenuItemDisabled(id: string) {
		this.setMenuItemUsability([id], false);
	}

	/**
	 * Enabled menu item with specified id.
	 * @param id NavBarIdentifier.id or custom string value.
	 */
	public setMenuItemEnabled(id: string) {
		this.setMenuItemUsability([id], true);
	}

	/**
	 * Set handler for menu item with specified id.
	 * @param id NavBarIdentifier.id or custom string value.
	 * @param handler The handler will be executed when the menu item is clicked.
	 * @param execScope The handle will be executed in this scope if it has specified.
	 */
	public setHandler(id: string, handler: (info: IMenuItemEventInfo) => void, execScope?: object) {
		const target = this.getById(id);
		if (target) {
			target.fn = handler.bind(execScope);
		}
	}

	/**
	 * Clear current menu items then re-initialize.
	 */
	public clearMenuItems() {
		this.changeDetect(() => {
			this.initializeCurrent();
		});
	}
}
