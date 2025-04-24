/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, Input } from '@angular/core';
import { FieldType, IGridDialogOptions, ILookupContext, ILookupOptions, UiCommonGridDialogService, UiCommonLookupBtn } from '@libs/ui/common';
import { IUniqueFieldDto, IUniqueFieldOption } from './../model/profile-lookup.interface';
import { BasicsSharedUniqueFieldProfileLookupService, IUniqueFieldProfileEntity } from './../services/basics-unique-field-profile-lookup.service';
import { PlatformHttpService, PlatformPermissionService } from '@libs/platform/common';

@Component({
	selector: 'basics-shared-unique-fields-profile-lookup',
	templateUrl: './profile-lookup.component.html',
	styleUrl: './profile-lookup.component.scss'
})
export class BasicsSharedUniqueFieldsProfileLookupComponent {
	private readonly gridDialogService = inject(UiCommonGridDialogService);
	private permissionService = inject(PlatformPermissionService);
	private readonly http = inject(PlatformHttpService);
	protected readonly FieldType = FieldType;
	@Input()
	public uniqueFieldOption!: IUniqueFieldOption;
	@Input()
	public value!: IUniqueFieldDto[];
	public readonly aggregateProfileLookup = inject(BasicsSharedUniqueFieldProfileLookupService);
	public deleteBtn = new UiCommonLookupBtn('delete', '', (context?: ILookupContext<IUniqueFieldProfileEntity, object>) => {
		this.deleteProfile(context);
	}, () => {
		/*todo  need get selected profile,framework no supply
		const selectedProfile = this.aggregateProfileLookup.getSelected();
		const isSystemProfile = selectedProfile && 'System' === selectedProfile.ProfileAccessLevel;
		if (isSystemProfile) {
			return this.permissionService.hasDelete('9eaa7843becc49f1af5b4b11e8fa09ee');
		}
		return selectedProfile?.Id !== 0;
		 */
		return true;
	});
	public createBtn = new UiCommonLookupBtn('create', '', (context?: ILookupContext<IUniqueFieldProfileEntity, object>) => {
		this.createOrEditProfile(context);
	});

	public aggregateProfileCustomOptions: ILookupOptions<IUniqueFieldProfileEntity, object> = {
		buttons: [
			this.deleteBtn,
			this.createBtn
		],
		serverSideFilter: {
			key: '',
			execute: () => {
				return {
					identityName: this.uniqueFieldOption.identityName,
					dynamicUniqueFieldService: this.uniqueFieldOption.dynamicUniqueFieldService
				};
			},
		},
	};

	public constructor() {
		this.deleteBtn.css = {class: 'control-icons ico-input-delete input-sm'};
		this.createBtn.css = {class: 'control-icons ico-input-lookup'};
	}

	private async deleteProfile(context?: ILookupContext<IUniqueFieldProfileEntity, object>) {
		const selectedItem = context?.lookupInput?.selectedItem;
		await this.http.post('basics/common/uniquefieldsprofile/delete', selectedItem);
		//todo require refresh profile list,no found good function,framework no supply
	}

	private async createOrEditProfile(context?: ILookupContext<IUniqueFieldProfileEntity, object>) {
		const selectedItemUniqueFields = context?.lookupInput?.selectedItem?.UniqueFields ?? [];
		const gridDialogData: IGridDialogOptions<IUniqueFieldDto> = {
			width: '40%',
			headerText: 'basics.common.uniqueFields.uniqueFieldsDialogTitle',
			selectedItems: [],
			isReadOnly: false,
			allowMultiSelect: true,
			items: selectedItemUniqueFields,
			gridConfig: {
				uuid: '11300f03f9fe4c2e98e345e35b72a011',
				idProperty: 'id',
				columns: [{
					type: FieldType.Boolean,
					id: 'Selected',
					//required: true,
					model: 'isSelect',
					label: {
						text: 'Selected',
						key: 'basics.common.fieldSelector.checkbox.select',
					},
					visible: true,
					sortable: true,
					readonly: false
				}, {
					type: FieldType.Description,
					id: 'Field',
					required: true,
					model: 'fieldName',
					maxLength: 16,
					label: {
						text: 'Fields',
						key: 'basics.common.uniqueFields.fields',
					},
					visible: true,
					sortable: true,
					readonly: true
				}]
			},
			resizeable: true,
			buttons: [
				{
					id: 'Save',
					caption: 'basics.common.button.save',
					fn: (event, info) => {
						this.save();
					}
				},
				{
					id: 'Save As',
					caption: 'basics.common.button.saveAs',
					fn: (event, info) => {
						this.saveAs();
					}
				},
				{
					id: 'Ok',
					caption: 'basics.common.ok',
					autoClose: false,
					fn: (event, info) => {
						const selectItems = info.dialog.items.filter(item => item.isSelect);
						this.value = selectItems;
						info.dialog.close();
					}
				}
			]
		};
		await this.gridDialogService.show(gridDialogData);
	}


	private save() {
		//todo this.aggregateProfileLookup.save();
	}

	private saveAs() {
		//todo showSaveProfileAsDialog
		// platformDialogService.showSaveProfileAsDialog(modalOptions).then(
		// 	function (result) {
		// 		//var selectedItem = service.getSelectedItem();
		// 		service.saveAs(profile, result.value.textProfileName, result.value.selectedArea.description);
		// 	}
		// );
	}
}