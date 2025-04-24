/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable, inject } from '@angular/core';
import { FieldType, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { UsermanagementRoleDataService } from '../../roles/services/usermanagement-role-data.service';
import { IAccessRoleEntity } from '../../roles/model/entities/access-role-entity.interface';

@Injectable({
	providedIn: 'root',
})
export abstract class CopyRoleWizardService {
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected http = inject(HttpClient);
	protected configurationService = inject(PlatformConfigurationService);
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly userManagementRoleService = inject(UsermanagementRoleDataService);

	public async copyRole() {
		const selectedRole = this.userManagementRoleService.getSelection();
		if (selectedRole) {
			this.processInputDialog(selectedRole);
		} else {
			this.messageBoxService.showMsgBox({
				backdrop: false,
				keyboard: true,
				headerText: {
					key: 'usermanagement.right.errorNoSelectionEnter',
				},
				bodyText: {
					key: 'usermanagement.right.errorNoSelection',
				},
			});
		}
	}

	public async processInputDialog(selectedRole: IAccessRoleEntity[]) {
		const userInput: IAccessRoleEntity | undefined = {
			Id: 0,
			Name: '',
			Description: '',
		};

		const userInputFormConfig: IFormConfig<IAccessRoleEntity> = {
			showGrouping: false,
			rows: [
				{
					id: 'Name',
					label: {
						key: 'usermanagement.right.roleName',
					},
					type: FieldType.Description,
					model: 'Name',
				},
				{
					id: 'Description',
					label: {
						key: 'usermanagement.right.roleDescription',
					},
					type: FieldType.Description,
					model: 'Description',
				},
			],
		};

		const modalOptions = {
			headerText: { key: 'usermanagement.right.copyRoleDialogHeader' },
			showCancelButton: true,
			showOkButton: true,
			entity: userInput,
			customButtons: [],
			formConfiguration: userInputFormConfig,
		};
		await this.formDialogService.showDialog<IAccessRoleEntity>(modalOptions)?.then((result) => {
			if (result?.closingButtonId === StandardDialogButtonId.Ok) {
				this.copySelectedRole(selectedRole, result.value);
			}
		});
	}

	public copySelectedRole(selectedRole: IAccessRoleEntity[], result: IAccessRoleEntity | undefined) {
		const data = {
			RoleId: selectedRole[0]?.Id,
			RoleName: result?.Name,
			RoleDescription: result?.Description,
		};
		if (data.RoleName) {
			this.http.post(this.configurationService.webApiBaseUrl + 'usermanagement/main/role/copy', data).subscribe((res) => {
				this.messageBoxService.showMsgBox('usermanagement.right.copyRoleInfoSuccessful', 'usermanagement.right.copyRoleInfo', 'info');
				return res;
			});
		} else {
			this.messageBoxService.showMsgBox({
				backdrop: false,
				keyboard: true,
				headerText: {
					key: 'usermanagement.right.noRoleName',
				},
				bodyText: {
					key: 'usermanagement.right.noRoleNameEntered',
				},
			});
		}
	}
}
