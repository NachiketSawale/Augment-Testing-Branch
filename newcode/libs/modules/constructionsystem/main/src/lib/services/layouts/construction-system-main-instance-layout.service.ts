/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { IInitializationContext, PlatformLazyInjectorService, prefixAllTranslationKeys, ServiceLocator } from '@libs/platform/common';
import { ConstructionSystemSharedTemplateLookupService, ICosInstanceEntity } from '@libs/constructionsystem/shared';
import { CONTROLLING_UNIT_LOOKUP_PROVIDER_TOKEN } from '@libs/controlling/interfaces';
import { ProjectLocationLookupService } from '@libs/project/shared';
import { ConstructionSystemMainInstanceStatusService } from '../construction-system-main-instance-status.service';
import { ConstructionSystemMainInstanceDataService } from '../construction-system-main-instance-data.service';
import { ConstructionSystemMainBoqLookupService } from '../lookup/construction-system-main-boq-lookup.service';
import { ConstructionSystemMainStatusLookupService, ICosInstanceStatusEntity } from '../lookup/construction-system-main-status-lookup.service';

/**
 * The Construction System Main Instance layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainInstanceLayoutService {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	private readonly constructionSystemMainInstanceStatusService = ServiceLocator.injector.get(ConstructionSystemMainInstanceStatusService);
	private readonly instanceService = ServiceLocator.injector.get(ConstructionSystemMainInstanceDataService);

	private getProjectId() {
		return this.instanceService.getCurrentSelectedProjectId();
	}

	public async generateLayout(context: IInitializationContext): Promise<ILayoutConfiguration<ICosInstanceEntity>> {
		const controllUniteLookupProvider = await this.lazyInjector.inject(CONTROLLING_UNIT_LOOKUP_PROVIDER_TOKEN);
		// var headerSetting = basicsCommonCodeDescriptionSettingsService.getSettings([{ ///todo
		// 	typeName: 'CosHeaderEntity',
		// 	module: 'ConstructionSystem.Master'
		// }]);
		// var codeLength = (headerSetting && headerSetting[0] && headerSetting[0].codeLength ? headerSetting[0].codeLength : 16) + 5;
		const codeLength = undefined;
		return {
			groups: [
				{
					gid: 'baseGroup',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: [
						'Code',
						'IsDistinctInstances',
						'DescriptionInfo',
						'CommentText',
						'CosTemplateFk',
						'ControllingUnitFk',
						'LocationFk',
						'IsChecked',
						'Status',
						'BoqItemFk',
						'MasterHeaderCode',
						'MasterHeaderDescription',
						'ProjectSortCode01Fk',
						'ProjectSortCode02Fk',
						'ProjectSortCode03Fk',
						'ProjectSortCode04Fk',
						'ProjectSortCode05Fk',
						'ProjectSortCode06Fk',
						'ProjectSortCode07Fk',
						'ProjectSortCode08Fk',
						'ProjectSortCode09Fk',
						'ProjectSortCode10Fk',
						'IsUserModified',
					],
				},
				{
					gid: 'userDefTextGroup',
					title: {
						key: 'cloud.common.UserdefTexts',
						text: 'User-Defined Texts',
					},
					attributes: ['UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5'],
				},
				{
					gid: 'changeOption',
					title: {
						key: 'constructionsystem.master.chgOptionGridContainerTitle',
						text: 'change option',
					},
					attributes: ['ChangeOption.IsCopyLineItems', 'ChangeOption.IsMergeLineItems', 'ChangeOption.IsChange'], ///todo does not work
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					CommentText: { key: 'entityCommentText', text: 'Comment' },
					ControllingUnitFk: { key: 'entityControllingUnit', text: 'Controlling Unit' },
					Status: { key: 'entityStatus', text: 'Status' },
					UserDefined1: { key: 'entityUserDefText', params: { p_0: '1' }, text: 'User Defined 1' },
					UserDefined2: { key: 'entityUserDefText', params: { p_0: '2' }, text: 'User Defined 2' },
					UserDefined3: { key: 'entityUserDefText', params: { p_0: '3' }, text: 'User Defined 3' },
					UserDefined4: { key: 'entityUserDefText', params: { p_0: '4' }, text: 'User Defined 4' },
					UserDefined5: { key: 'entityUserDefText', params: { p_0: '5' }, text: 'User Defined 5' },
				}),
				...prefixAllTranslationKeys('constructionsystem.main.', {
					IsChecked: { key: 'entityIsChecked', text: 'IsChecked' },
					IsUserModified: { key: 'isUserModified', text: 'Is User Modified' },
					MasterHeaderCode: { key: 'masterHeaderCode', text: 'Master Header Code' },
					MasterHeaderDescription: { key: 'masterHeaderDescription', text: 'Master Header Description' },
				}),
				...prefixAllTranslationKeys('estimate.main.', {
					BoqItemFk: { key: 'boqItemFk', text: 'BoqItem' },
					ProjectSortCode01Fk: { key: 'prjSortCodeFk', params: { number: '1' }, text: 'Project Sort Code 1' },
					ProjectSortCode02Fk: { key: 'prjSortCodeFk', params: { number: '2' }, text: 'Project Sort Code 2' },
					ProjectSortCode03Fk: { key: 'prjSortCodeFk', params: { number: '3' }, text: 'Project Sort Code 3' },
					ProjectSortCode04Fk: { key: 'prjSortCodeFk', params: { number: '4' }, text: 'Project Sort Code 4' },
					ProjectSortCode05Fk: { key: 'prjSortCodeFk', params: { number: '5' }, text: 'Project Sort Code 5' },
					ProjectSortCode06Fk: { key: 'prjSortCodeFk', params: { number: '6' }, text: 'Project Sort Code 6' },
					ProjectSortCode07Fk: { key: 'prjSortCodeFk', params: { number: '7' }, text: 'Project Sort Code 7' },
					ProjectSortCode08Fk: { key: 'prjSortCodeFk', params: { number: '8' }, text: 'Project Sort Code 8' },
					ProjectSortCode09Fk: { key: 'prjSortCodeFk', params: { number: '9' }, text: 'Project Sort Code 9' },
					ProjectSortCode10Fk: { key: 'prjSortCodeFk', params: { number: '10' }, text: 'Project Sort Code 10' },
				}),
				...prefixAllTranslationKeys('constructionsystem.master.', {
					IsDistinctInstances: { key: 'entityIsDistinctInstances', text: 'Is Distinct Instances' },
					CosTemplateFk: { key: 'entityTemplateFk', text: 'Template' },
				}),
				...prefixAllTranslationKeys('model.main.', {
					LocationFk: { key: 'entityLocation', text: 'Location' },
				}),
			},
			overloads: {
				Code: {
					maxLength: codeLength,
				},
				DescriptionInfo: {
					maxLength: 255,
				},
				IsDistinctInstances: {
					readonly: true,
				},
				MasterHeaderCode: {
					// navigator: { // todo navigator
					// 	moduleName: 'constructionsystem.master',
					// 	registerService: 'constructionSystemMasterHeaderService'
					// },
					readonly: true,
				},
				MasterHeaderDescription: {
					readonly: true,
				},
				Status: {
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ConstructionSystemMainStatusLookupService,
						imageSelector: {
							select(item: ICosInstanceStatusEntity): string {
								return item.IconCSS ? item.IconCSS : '';
							},
							getIconType() {
								return 'css';
							},
						},
					}),
				},
				IsChecked: {
					headerChkbox: true,
				},
				IsUserModified: {
					readonly: false,
					headerChkbox: true,
				},
				CosTemplateFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ConstructionSystemSharedTemplateLookupService,
						showClearButton: true,
						clientSideFilter: {
							execute(item, context): boolean {
								const current = context.entity as ICosInstanceEntity;
								if (current && current.Id) {
									return item.CosHeaderFk === current.HeaderFk;
								}
								return false;
							},
						},
					}),
				},
				ControllingUnitFk: await controllUniteLookupProvider.generateControllingUnitLookup(context, {
					projectGetter: () => this.getProjectId(),
					lookupOptions: {
						showClearButton: true,
						showDescription: true,
						descriptionMember: 'DescriptionInfo.Translated',
					},
				}),
				LocationFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProjectLocationLookupService,
						showDescription: true,
						descriptionMember: 'Code',
						showClearButton: true,
						serverSideFilter: {
							key: '',
							execute: () => {
								return {
									ProjectId: this.instanceService.getCurrentSelectedProjectId(),
								};
							},
						},
					}),
				},
				// ProjectSortCode01Fk:TODO: SortCode01Fk lookup
				// ProjectSortCode02Fk:TODO: SortCode02Fk lookup
				// ProjectSortCode03Fk:TODO: SortCode03Fk lookup
				// ProjectSortCode04Fk:TODO: SortCode04Fk lookup
				// ProjectSortCode05Fk:TODO: SortCode05Fk lookup
				// ProjectSortCode06Fk:TODO: SortCode06Fk lookup
				// ProjectSortCode07Fk:TODO: SortCode07Fk lookup
				// ProjectSortCode08Fk:TODO: SortCode08Fk lookup
				// ProjectSortCode09Fk:TODO: SortCode09Fk lookup
				// ProjectSortCode10Fk:TODO: SortCode10Fk lookup
				BoqItemFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ConstructionSystemMainBoqLookupService,
						showClearButton: true,
					}),
				},
			},
			transientFields: [
				{
					id: 'ChangeOption.IsCopyLineItems',
					readonly: false,
					model: 'ChangeOption.IsCopyLineItems',
					type: FieldType.Boolean,
					label: { key: 'constructionsystem.master.entityIsCopyLineItems', text: 'Is Copy Line Items' },
				},
				{
					id: 'ChangeOption.IsMergeLineItems',
					readonly: false,
					model: 'ChangeOption.IsMergeLineItems',
					type: FieldType.Boolean,
					label: { key: 'constructionsystem.master.entityIsMergeLineItems', text: 'Is Merge Line Items' },
				},
				{
					id: 'ChangeOption.IsChange',
					readonly: false,
					model: 'ChangeOption.IsChange',
					type: FieldType.Boolean,
					label: { key: 'constructionsystem.master.entityIsChange', text: 'Is Change' },
				},
			],
		};
	}
}

// headerCheckBoxEvents = [	{source: 'grid',name: 'onHeaderCheckboxChanged',fn: checkAll}];todo
