/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService, UiCommonFormDialogService } from '@libs/ui/common';
import { UsermanagementRightBulkAssignDialogComponent } from '../../components/usermanagement-right-bulk-assign-dialog/usermanagement-right-bulk-assign-dialog.component';

import { UsermanagementRoleDataService } from '../../roles/services/usermanagement-role-data.service';

import { UsermanagementFromAccessRoleCategoryService } from '../../services/usermanagement-from-access-role-category.service';

import { IAccessRoleCategory, IAccessRoleCategoryEntity, IUpdateCategoryBulk } from '../../roles/model/entities/role-category.interface';
import { CopyRoleWizardService } from '../../services/wizards/usermanagement-right-copyrole-wizard.service';

/**
 * User Management Right Wizard Service
 */
export class UsermanagementRightWizard {
	/**
	 * Delete Rights Wizard Configure section
	 *
	 * @param {IInitializationContext} context context Object
	 */
	public async deleteRights(context: IInitializationContext) {
		const modalDialogService = context.injector.get(UiCommonDialogService);

		//TODO:this entity will be used in future development
		//const service = context.injector.get(UsermanagementRoleDataService);
		//const entity = service.getSelection();

		const modalOptions: ICustomDialogOptions<{ key: string }, UsermanagementRightBulkAssignDialogComponent> = {
			width: '60%',
			buttons: [
				{ id: StandardDialogButtonId.Ok, caption: { key: 'usermanagement.right.wizardDeleteRights' } },
				{ id: StandardDialogButtonId.Cancel, caption: { key: 'ui.common.dialog.cancelBtn' } },
			],

			headerText: { key: 'usermanagement.right.dialogDeleteRight.dialogTitle' },

			id: 'deleteRight',
			resizeable: true,
			value: { key: 'usermanagement.right.dialogDeleteRight.dialogTitle' },
			bodyComponent: UsermanagementRightBulkAssignDialogComponent,
		};
		const result = await modalDialogService.show(modalOptions);
		//TODO: Operations to be done on the result object
		console.log(result);
	}

	public async assignCategory(context: IInitializationContext) {
		const modalDialogService = context.injector.get(UiCommonFormDialogService);
		const accessRoleCategoryService = context.injector.get(UsermanagementFromAccessRoleCategoryService);
		
		accessRoleCategoryService.getRoleCategoryList().subscribe(async (data: IAccessRoleCategory[]) => {
			const categories: IAccessRoleCategory[] = [
				{
					Id: -1,
					Name: 'None (Remove Category)',
				},
			];

			categories.push(...data);

			//TODO:this entity will be used in future development
			const service = context.injector.get(UsermanagementRoleDataService);

			const selectedEntity = service.getSelection();

			const formData = accessRoleCategoryService.preparedFromConfig(selectedEntity.length, categories);

			const result = await modalDialogService.showDialog<IAccessRoleCategoryEntity>({
				id: 'dialogAssignCategory',
				headerText: { key: 'usermanagement.right.dialogAssignCategory.dialogTitle' },
				formConfiguration: formData.formConfig,
				entity: formData.entity,
				runtime: formData.runTimeInfo,
				width: '400px',
				height: '300px',
				minWidth: '400px',
				minHeight: '300px',
				showOkButton: true,
				showCancelButton: true,
				customButtons: [],
				topDescription: {key:'usermanagement.right.dialogAssignCategory.dialogTitle'},
			});
			// TODO: Ok Button Name chanes , After Assign button click show message as per angular js implementaion
			// TODO: Roles Count Label show on form dailog
			if (result?.closingButtonId === StandardDialogButtonId.Ok) {
				const rolesId = selectedEntity.map((item) => item.Id);
				const categoryId = result.value?.category;
				const payloda: IUpdateCategoryBulk = {
					NewCategory: categoryId as number,
					RoleIds: rolesId,
				};
				accessRoleCategoryService.updateCategoryBulk(payloda).subscribe(async (data) => {
					console.log(data);
				});
			} else {
				console.log(result);
			}
		});
	}

	public copyRoleWizard(context: IInitializationContext) {
		const service = context.injector.get(CopyRoleWizardService);
		service.copyRole();
	}
}
