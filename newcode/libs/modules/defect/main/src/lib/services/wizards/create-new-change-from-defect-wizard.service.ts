/*
 * Copyright(c) RIB Software GmbH
 */

import { isNil, get } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { BasicsSharedDefect2ProjectChangeTypeLookupService, BasicsSharedRubricCategoryLookupService, Rubric } from '@libs/basics/shared';
import { GetHttpOptions, IEntityIdentification, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { createLookup, FieldType, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { IDfmDefectEntity } from '@libs/defect/interfaces';
import { DefectMainHeaderDataService } from '../defect-main-header-data.service';

/**
 * The ID of Defect2ProjectChangeType entity in the Customized module.
 * Data Type description: Project Change Creation From Defect
 */
enum Defect2ProjectChangeType {
	doNotAssignToChange = 1,
	toBeAssignedToChange = 2,
	assignedToChange = 3,
}

/**
 * The interface for response of creating Change entity API.
 */
interface ICreateChangeResponse {
	logText: string;
	newId?: number;
}

/**
 * The interface for form control data.
 */
interface ICreateChangeFormControlEntity {
	rubricCategoryId: number | null;
}

@Injectable({ providedIn: 'root' })
export class DefectMainCreateNewChangeFromDefectWizardService {
	private readonly http = inject(PlatformHttpService);

	private readonly translateService = inject(PlatformTranslateService);

	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	private readonly formDialogService = inject(UiCommonFormDialogService);

	private readonly defectMainHeaderService = inject(DefectMainHeaderDataService);

	private readonly changeTypeLookupService = inject(BasicsSharedDefect2ProjectChangeTypeLookupService);

	private readonly headerText = 'defect.main.createChangeFromDefect';

	private async showInfo(bodyText: string) {
		await this.messageBoxService.showMsgBox(bodyText, this.headerText, 'info');
	}

	private async showNoSelectedItemsInfo() {
		await this.messageBoxService.showInfoBox('cloud.common.noCurrentSelection', 'info', true);
	}

	private async showCanNotCreateChangeInfo() {
		await this.showInfo('defect.main.wizard.createChange.canNotCreateChange');
	}

	private async showAlreadyCreatedChangeInfo(code: string) {
		await this.showInfo(this.translateService.instant('defect.main.wizard.createChange.alreadyCreatedChange', { code: code }).text);
	}

	private async showSuccessfullyDoneInfo() {
		await this.showInfo('cloud.common.doneSuccessfully');
	}

	private async showSaveTypeInfo() {
		await this.showInfo('defect.main.wizard.createChange.saveType');
	}

	private async showError(bodyText: string) {
		await this.messageBoxService.showMsgBox(bodyText, this.headerText, 'error');
	}

	private async handleOK(mainItem: IDfmDefectEntity, dataItem: ICreateChangeFormControlEntity) {
		const data = { defectId: mainItem.Id, rubricCategoryId: dataItem.rubricCategoryId };
		const result = await this.http.post<ICreateChangeResponse>('change/main/createdchangefromdefect', data);
		if (result.logText.length > 0) {
			return await this.showError(result.logText);
		} else {
			if (!isNil(result.newId)) { // SUCCESS. Empty log message and a valid new id available
				mainItem.ChangeFk = result.newId;
				this.defectMainHeaderService.setModified(mainItem);
				return await this.showSuccessfullyDoneInfo();
			} else {
				return await this.showSaveTypeInfo(); // ERROR No change was created
			}
		}
	}

	private prepareFormConfig(): IFormConfig<ICreateChangeFormControlEntity> {
		return {
			formId: this.headerText,
			showGrouping: false,
			groups: [
				{
					groupId: 'baseGroup',
					open: true,
				},
			],
			rows: [
				{
					groupId: 'baseGroup',
					id: 'group',
					label: {
						key: 'cloud.common.entityBasRubricCategoryFk',
						text: 'Rubric Category',
					},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedRubricCategoryLookupService,
						showClearButton: true,
						displayMember: 'DescriptionInfo',
						valueMember: 'Id',
						gridConfig: {
							columns: [
								{
									id: 'DescriptionInfo',
									model: 'DescriptionInfo',
									type: FieldType.Translation,
									label: { key: 'cloud.common.entityDescription', text: 'Description' },
									width: 300,
									sortable: true,
									visible: true,
									readonly: true,
								},
							],
						},
						clientSideFilter: {
							execute(item): boolean {
								return item.RubricFk === Rubric.ChangeOrder;
							},
						},
					}),
					model: 'rubricCategoryId',
					required: true,
					readonly: false,
					sortOrder: 1,
				},
			],
		};
	}

	public async showCreateDialog() {
		const mainItem = this.defectMainHeaderService.getSelectedEntity();
		if (!mainItem) {
			return await this.showNoSelectedItemsInfo();
		}
		const defect2ProjectChangeTypeEntity = await firstValueFrom(this.changeTypeLookupService.getItemByKey({ id: mainItem.Defect2ChangeTypeFk }));
		if (defect2ProjectChangeTypeEntity.Id !== Defect2ProjectChangeType.toBeAssignedToChange) {
			return await this.showCanNotCreateChangeInfo();
		}
		// todo-allen: Wait for the ChangeEntity interface of Change module to be ready and use ChangeEntity instead of IEntityIdentification.
		const httpOptions: GetHttpOptions = { params: { defectId: mainItem.Id } };
		const changeEntities = await this.http.get<Array<IEntityIdentification>>('change/main/listbydefect', httpOptions);
		if (Array.isArray(changeEntities)) {
			if (changeEntities.length === 0) {
				const result = await this.formDialogService.showDialog({
					headerText: this.headerText,
					formConfiguration: this.prepareFormConfig(),
					entity: { rubricCategoryId: null },
				});
				if (result?.closingButtonId === StandardDialogButtonId.Ok && result?.value) {
					return await this.handleOK(mainItem, result.value);
				}
			} else {
				const changeCode = get(changeEntities[0], 'Code') as string | null | undefined; // todo-allen: use 'changeEntities.Code'.
				if (changeCode) {
					return await this.showAlreadyCreatedChangeInfo(changeCode);
				}
			}
		}
	}
}
