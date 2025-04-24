/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IUserEntity } from '@libs/usermanagement/interfaces';
import { ItemType } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class UserManagementUserListBehavior implements IEntityContainerBehavior<IGridContainerLink<IUserEntity>, IUserEntity> {

	public onCreate(containerLink: IGridContainerLink<IUserEntity>): void {
		containerLink.uiAddOns.toolbar.addItems({
			caption: 'usermanagement.user.goto',
			type: ItemType.DropdownBtn,
			iconClass: 'tlb-icons ico-goto',
			list: {
				showImages: true,
				cssClass: 'dropdown-menu-right',
				items: [{
					id: 'groups',
					type: ItemType.Item,
					disabled: false,
					caption: 'usermanagement.user.groups',
					iconClass: 'app-small-icons ico-groups',
					fn: function () {
						// TODO: jump to 'usermanagement.group' once DEV-9382 is solved
					}
				}, {
					id: 'roles',
					type: ItemType.Item,
					disabled: false,
					iconClass: 'app-small-icons ico-users',
					caption: 'usermanagement.user.roles',
					fn: function () {
						// TODO: jump to 'usermanagement.right' once DEV-9382 is solved
					}
				}, {
					id: 'clerk',
					type: ItemType.Item,
					disabled: false,
					iconClass: 'app-small-icons ico-clerk',
					caption: 'usermanagement.user.clerk',
					fn: function () {
						// TODO: jump to 'basics.clerk' once DEV-9382 is solved
					}
				}, {
					id: 'company',
					type: ItemType.Item,
					disabled: false,
					iconClass: 'app-small-icons ico-company-structure',
					caption: 'usermanagement.user.company',
					fn: function () {
						// TODO: jump to 'basics.company' once DEV-9382 is solved
					}
				}, {
					id: 'customizing',
					type: ItemType.Item,
					disabled: false,
					iconClass: 'app-small-icons ico-settings',
					caption: 'usermanagement.user.customizing',
					fn: function () {
						// TODO: jump to 'basics.customize' once DEV-9382 is solved
					}
				}]
			}
		});
	}
}