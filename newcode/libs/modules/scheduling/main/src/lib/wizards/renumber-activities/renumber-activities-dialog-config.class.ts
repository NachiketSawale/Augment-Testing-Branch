/*
 * Copyright(c) RIB Software GmbH
 */

import { createLookup, FieldType, IFormConfig, IFormDialogConfig } from '@libs/ui/common';
import { BasicsSharedCodeFormatLookupService } from '@libs/basics/shared';
import { PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { IRenumberDataEntity } from '@libs/scheduling/interfaces';

export class RenumberActivitiesDialogConfig {
	private readonly translateService = ServiceLocator.injector.get(PlatformTranslateService);

	public createFormConfiguration(dataItem: IRenumberDataEntity,
	                               props:{id: string, displayName: string}[]): IFormDialogConfig<IRenumberDataEntity>{
		return <IFormDialogConfig<IRenumberDataEntity>>{
			headerText: 'scheduling.main.renumberActivities',
			id: 'RenumberActivities',
			entity: dataItem,
			formConfiguration: <IFormConfig<IRenumberDataEntity>> {
				formId: 'renumber-activities-form',
				showGrouping: true,
				groups:[
					{
						groupId: 'baseGroup',
						header: {text: 'Renumber settings', key: 'scheduling.main.wizardSortTitle'},
						open: true,
						visible: true,
						sortOrder: 1
					},
					{
						groupId: 'level1',
						header: {text: 'Level 1', key: 'scheduling.main.wizardSortLevel1'},
						open: true,
						visible: true,
						sortOrder: 2
					},
					{
						groupId: 'level2',
						header: {text: 'Level 2', key: 'scheduling.main.wizardSortLevel2'},
						open: true,
						visible: true,
						sortOrder: 3
					},
					{
						groupId: 'level3',
						header: {text: 'Level 3', key: 'scheduling.main.wizardSortLevel3'},
						open: false,
						visible: true,
						sortOrder: 4
					},
					{
						groupId: 'level4',
						header: {text: 'Level 4', key: 'scheduling.main.wizardSortLevel4'},
						open: false,
						visible: true,
						sortOrder: 5
					},
					{
						groupId: 'level5',
						header: {text: 'Level 5', key: 'scheduling.main.wizardSortLevel5'},
						open: false,
						visible: true,
						sortOrder: 6
					}
				],

				rows: [
					{
						groupId: 'baseGroup',
						id: 'codeFormatFk',
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedCodeFormatLookupService
						}),
						model: 'CodeFormatFk',
						label: {key: 'basics.customize.codeformat'},
						sortOrder: 1
					},
					{
						groupId: 'baseGroup',
						id: 'testrun',
						type: FieldType.Boolean,
						model: 'IsTestRun',
						label: {key: 'scheduling.main.testRun'},
						sortOrder: 2
					},
					{
						groupId: 'level1',
						id: 'sortSetting1',
						type: FieldType.Select,
						itemsSource: {
							items: props
						},
						model: 'SortLevels[0].SortAttribute',
						label: {key: 'scheduling.main.wizardSortAttrLevel', params: {p_0: 1}},
						sortOrder: 1
					},
					{
						groupId: 'level1',
						id: 'sortTyp1',
						type: FieldType.Select,
						itemsSource: {
							items: [
								{
									id: 0,
									displayName: this.translateService.instant('scheduling.main.sortOrderAsc')
								},
								{
									id: 1,
									displayName: this.translateService.instant('scheduling.main.sortOrderDesc')
								}
							]
						},
						model: 'SortLevels[0].SortOrder',
						label: {key: 'scheduling.main.wizardSortTyp', params: {p_0: 1}},
						sortOrder: 2
					},
					{
						groupId: 'level2',
						id: 'sortSetting2',
						type: FieldType.Select,
						itemsSource: {
							items: props
						},
						model: 'SortLevels[1].SortAttribute',
						label: {key: 'scheduling.main.wizardSortAttrLevel', params: {p_0: 2}},
						sortOrder: 1
					},
					{
						groupId: 'level2',
						id: 'sortTyp2',
						type: FieldType.Select,
						itemsSource: {
							items: [
								{
									id: 0,
									displayName: this.translateService.instant('scheduling.main.sortOrderAsc')
								},
								{
									id: 1,
									displayName: this.translateService.instant('scheduling.main.sortOrderDesc')
								}
							]
						},
						model: 'SortLevels[1].SortOrder',
						label: {key: 'scheduling.main.wizardSortTyp', params: {p_0: 2}},
						sortOrder: 2
					},
					{
						groupId: 'level3',
						id: 'sortSetting3',
						type: FieldType.Select,
						itemsSource: {
							items: props
						},
						model: 'SortLevels[2].SortAttribute',
						label: {key: 'scheduling.main.wizardSortAttrLevel', params: {p_0: 3}},
						sortOrder: 1
					},
					{
						groupId: 'level3',
						id: 'sortTyp3',
						type: FieldType.Select,
						itemsSource: {
							items: [
								{
									id: 0,
									displayName: this.translateService.instant('scheduling.main.sortOrderAsc')
								},
								{
									id: 1,
									displayName: this.translateService.instant('scheduling.main.sortOrderDesc')
								}
							]
						},
						model: 'SortLevels[2].SortOrder',
						label: {key: 'scheduling.main.wizardSortTyp', params: {p_0: 3}},
						sortOrder: 2
					},
					{
						groupId: 'level4',
						id: 'sortSetting4',
						type: FieldType.Select,
						itemsSource: {
							items: props
						},
						model: 'SortLevels[3].SortAttribute',
						label: {key: 'scheduling.main.wizardSortAttrLevel', params: {p_0: 4}},
						sortOrder: 1
					},
					{
						groupId: 'level4',
						id: 'sortTyp4',
						type: FieldType.Select,
						itemsSource: {
							items: [
								{
									id: 0,
									displayName: this.translateService.instant('scheduling.main.sortOrderAsc')
								},
								{
									id: 1,
									displayName: this.translateService.instant('scheduling.main.sortOrderDesc')
								}
							]
						},
						model: 'SortLevels[3].SortOrder',
						label: {key: 'scheduling.main.wizardSortTyp', params: {p_0: 4}},
						sortOrder: 2
					},
					{
						groupId: 'level5',
						id: 'sortSetting5',
						type: FieldType.Select,
						itemsSource: {
							items: props
						},
						model: 'SortLevels[4].SortAttribute',
						label: {key: 'scheduling.main.wizardSortAttrLevel', params: {p_0: 5}},
						sortOrder: 1
					},
					{
						groupId: 'level5',
						id: 'sortTyp5',
						type: FieldType.Select,
						itemsSource: {
							items: [
								{
									id: 0,
									displayName: this.translateService.instant('scheduling.main.sortOrderAsc')
								},
								{
									id: 1,
									displayName: this.translateService.instant('scheduling.main.sortOrderDesc')
								}
							]
						},
						model: 'SortLevels[4].SortOrder',
						label: {key: 'scheduling.main.wizardSortTyp', params: {p_0: 5}},
						sortOrder: 2
					}
				]
			}
		};
	}
}