/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IUserFormDataEntity } from '../model/entities/user-form-data-entity.interface';
import { ItemType } from '@libs/ui/common';
import { IEntityIdentification, PlatformPermissionService, ServiceLocator } from '@libs/platform/common';
import { IUserFormDataEntityInfoBehaviorOptions } from '../model/interfaces/user-form-data-entity-info-options.interface';
import { UserFormDisplayMode } from '../model/interfaces/user-form-display-mode.enum';
import { BasicsSharedUserFormConnector } from '../model/user-form-connector.class';
import { BasicsSharedUserFormService } from '../services/user-form.service';
import { IEntitySelection } from '@libs/platform/data-access';

/**
 *
 */
export class BasicsSharedUserFormDataGridBehavior<PT extends object> implements IEntityContainerBehavior<IGridContainerLink<IUserFormDataEntity>, IUserFormDataEntity> {
	/**
	 *
	 * @param options
	 */
	public constructor(
		private options: IUserFormDataEntityInfoBehaviorOptions<PT>
	) {

	}

	private _containerLink!: IGridContainerLink<IUserFormDataEntity>;

	private get selectedItem(): IUserFormDataEntity | null {
		return this.dataService.getSelectedEntity();
	}

	private get parentSelectedItem(): IEntityIdentification | null {
		return this.parentService.hasSelection() ? this.parentService.getSelectedEntity() as IEntityIdentification : null;
	}

	public get dataService(): IEntitySelection<IUserFormDataEntity> {
		return this.options.dataService;
	}

	public get parentService(): IEntitySelection<PT> {
		return this.options.parentService;
	}

	public get containerLink(): IGridContainerLink<IUserFormDataEntity> {
		return this._containerLink;
	}

	private showUserForm(displayMode: UserFormDisplayMode): Promise<BasicsSharedUserFormConnector> | undefined {
		if (!this.selectedItem || !this.parentSelectedItem) {
			return undefined;
		}
		const userFormService = ServiceLocator.injector.get(BasicsSharedUserFormService);
		return userFormService.show({
			formId: this.selectedItem.FormFk,
			formDataId: this.selectedItem.Id,
			contextId: this.parentSelectedItem.Id,
			isReadonly: false,
			modal: true,
			editable: true,
			displayMode: displayMode
		});
	}

	private addToolbars(containerLink: IGridContainerLink<IUserFormDataEntity>) {
		if (!this.options.bulkEditorSupport) {
			// TODO: Removed the build editor.
			// containerLink.uiAddOns.toolbar.deleteItems(EntityContainerCommand.BulkEditor);
		}

		containerLink.uiAddOns.toolbar.addItems([{
			id: 'preview',
			caption: {
				text: 'Preview',
				key: 'basics.common.preview.button.previewCaption'
			},
			type: ItemType.Item,
			hideItem: false,
			sort: 20,
			iconClass: 'tlb-icons ico-preview-form',
			fn: () => {
				if (this.selectedItem) {
					const userFormService = ServiceLocator.injector.get(BasicsSharedUserFormService);
					userFormService.preview(this.selectedItem.FormFk);
				}
			},
			disabled: () => {
				return !this.options.dataService.hasSelection();
			}
		}, {
			id: 'edit-dropdown',
			caption: {
				text: 'Edit By',
				key: 'basics.userform.editBy'
			},
			hideItem: false,
			sort: 21,
			type: ItemType.DropdownBtn,
			iconClass: 'tlb-icons ico-preview-data',
			isSet: true,
			list: {
				showImages: false,
				showTitles: true,
				cssClass: 'dropdown-menu-right',
				items: [{
					id: 't-navigation-new-window',
					caption: {
						text: 'New Window',
						key: 'basics.userform.newWindow'
					},
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-preview-data',
					fn: () => {
						this.showUserForm(UserFormDisplayMode.Window);
					},
					disabled: () => {
						return !this.options.dataService.hasSelection();
					}
				}, {
					id: 't-navigation-pop-window',
					caption: {
						text: 'Popup Window',
						key: 'basics.userform.popWindow'
					},
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-preview-data',
					fn: () => {
						this.showUserForm(UserFormDisplayMode.Dialog);
					},
					disabled: () => {
						return !this.options.dataService.hasSelection();
					}
				}]
			},
			disabled: () => {
				if (!this.options.dataService.hasSelection()) {
					return true;
				}
				if (this.options.isParentAndSelectedReadonly && this.options.isParentAndSelectedReadonly()) {
					return true;
				}
				const permissionService = ServiceLocator.injector.get(PlatformPermissionService);
				return !permissionService.hasWrite(this.options.permissionUuid);
			}
		}]);
	}

	public onInit(containerLink: IGridContainerLink<IUserFormDataEntity>) {
		this._containerLink = containerLink;
	}

	public onCreate(containerLink: IGridContainerLink<IUserFormDataEntity>) {
		this.addToolbars(containerLink);
		if (this.options.onCreate) {
			this.options.onCreate(this);
		}
	}

	public onDestroy(containerLink: IGridContainerLink<IUserFormDataEntity>) {
		if (this.options.onDestroy) {
			this.options.onDestroy(this);
		}
	}
}