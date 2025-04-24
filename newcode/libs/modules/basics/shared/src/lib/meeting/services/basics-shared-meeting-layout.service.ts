/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { PlatformLazyInjectorService, prefixAllTranslationKeys } from '@libs/platform/common';
import { IBasicsCustomizeMeetingStatusEntity, IMtgHeaderEntity } from '@libs/basics/interfaces';
import { BasicsSharedCustomizeLookupOverloadProvider } from '../../lookup-helper/basics-shared-customize-lookup-overload-provider.class';
import { BasicsSharedClerkLookupService } from '../../lookup-services/basics-clerk-lookup.service';
import { BasicsSharedMeetingStatusLookupService } from '../../lookup-services/customize';
import { PROJECT_LOOKUP_PROVIDER_TOKEN } from '@libs/project/interfaces';
import { DEFECT_LOOKUP_PROVIDER_TOKEN } from '@libs/defect/interfaces';
import { CHECKLIST_LOOKUP_PROVIDER_TOKEN } from '@libs/hsqe/interfaces';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedMeetingLayoutService {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	/**
	 * Generates layout for meeting container
	 * @returns
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IMtgHeaderEntity>> {
		const projectLookupProvider = await this.lazyInjector.inject(PROJECT_LOOKUP_PROVIDER_TOKEN);
		const defectLookupProvider = await this.lazyInjector.inject(DEFECT_LOOKUP_PROVIDER_TOKEN);
		const checklistLookupProvider = await this.lazyInjector.inject(CHECKLIST_LOOKUP_PROVIDER_TOKEN);

		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: [
						'Code',
						'MtgStatusFk',
						'Title',
						'MtgTypeFk',
						'IsHighImportance',
						'Recurrence',
						'DateReceived',
						'StartTime',
						'FinishTime',
						'Location',
						'ClerkRspFk',
						'ClerkOwnerFk',
						'MtgUrl',
						'ProjectFk',
						'RfqHeaderFk',
						'QtnHeaderFk',
						// 'PrjInfoRequestFk',
						'CheckListFk',
						'DefectFk',
						'BidHeaderFk',
					],
				},
				{
					gid: 'userDefTextGroup',
					title: {
						key: 'cloud.common.UserdefTexts',
						text: 'User-Defined Texts',
					},
					attributes: ['Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('basics.meeting.', {
					Recurrence: {
						key: 'recurrenceTitle',
						text: 'Recurrence',
					},
					Title: {
						key: 'title',
						text: 'Title',
					},
					IsHighImportance: {
						key: 'isHighImportance',
						text: 'Importance',
					},
					DateReceived: {
						key: 'dateReceived',
						text: 'Date Received',
					},
					StartTime: {
						key: 'startTime',
						text: 'Start Time',
					},
					FinishTime: {
						key: 'endTime',
						text: 'End Time',
					},
					ClerkRspFk: {
						key: 'entityMeetingResp',
						text: 'Responsible',
					},
					ClerkOwnerFk: {
						key: 'entityMeetingOwner',
						text: 'Meeting Owner',
					},
					MtgUrl: {
						key: 'meetingUrl',
						text: 'Meeting Url',
					},
					RfqHeaderFk: {
						key: 'entityRfqHeaderCode',
						text: 'RfQ',
					},
					QtnHeaderFk: {
						key: 'entityQtnHeader',
						text: 'Quote',
					},
					// PrjInfoRequestFk: {
					// 	key: 'entityRFIHeaderCode',
					// 	text: 'RFI'
					// },
					CheckListFk: {
						key: 'entityCheckList',
						text: 'Check List',
					},
					DefectFk: {
						key: 'entityDefectCode',
						text: 'Defect',
					},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					MtgStatusFk: {
						key: 'entityStatus',
						text: 'Status',
					},
					Code: {
						key: 'entityCode',
						text: 'Code',
					},
					MtgTypeFk: {
						key: 'entityType',
						text: 'Type',
					},
					Location: {
						key: 'AddressTokenDesc_Location',
						text: 'Location',
					},
					ProjectFk: {
						key: 'entityProject',
						text: 'Project',
					},
					Userdefined1: {
						key: 'entityUserDefText',
						params: { p_0: '1' },
					},
					Userdefined2: {
						key: 'entityUserDefText',
						params: { p_0: '2' },
					},
					Userdefined3: {
						key: 'entityUserDefText',
						params: { p_0: '3' },
					},
					Userdefined4: {
						key: 'entityUserDefText',
						params: { p_0: '4' },
					},
					Userdefined5: {
						key: 'entityUserDefText',
						params: { p_0: '5' },
					},
				}),
				...prefixAllTranslationKeys('documents.project.', {
					BidHeaderFk: {
						key: 'entityBidHeaderFk',
						text: 'Bid',
					},
				}),
			},
			overloads: {
				MtgStatusFk: {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedMeetingStatusLookupService,
						displayMember: 'DescriptionInfo',
						showClearButton: false,
						imageSelector: {
							select(item: IBasicsCustomizeMeetingStatusEntity): string {
								return item.Icon ? `status-icons ico-status${item.Icon.toString().padStart(2, '0')}` : '';
							},
							getIconType() {
								return 'css';
							},
						},
					}),
				},
				MtgTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideMeetingTypeLookupOverload(true),
				ClerkRspFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedClerkLookupService,
						showClearButton: true,
					}),
					additionalFields: [
						{
							displayMember: 'Description',
							label: {
								key: 'basics.meeting.entityMeetingRespDesc',
							},
							column: true,
							singleRow: true,
						},
					],
				},
				ClerkOwnerFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedClerkLookupService,
						showClearButton: true,
					}),
					additionalFields: [
						{
							displayMember: 'Description',
							label: {
								key: 'basics.meeting.entityMeetingOwnerDesc',
							},
							column: true,
							singleRow: true,
						},
					],
				},
				ProjectFk: {
					...projectLookupProvider.generateProjectLookup({
						lookupOptions: {
							showClearButton: true,
						},
					}),
					additionalFields: [
						{
							displayMember: 'ProjectName',
							label: {
								text: 'ProjectName',
								key: 'cloud.common.entityProjectName',
							},
							column: true,
							singleRow: true,
						},
					],
				},
				DefectFk: {
					...defectLookupProvider.generateDefectLookup({
						showClearButton: true,
						restrictToProjectId: (entity) => entity.ProjectFk,
					}),
					...{
						additionalFields: [
							{
								displayMember: 'Description',
								label: {
									text: 'Defect Description',
									key: 'basics.meeting.entityDefectDescription',
								},
								column: true,
								singleRow: true,
							},
						],
					},
				},
				CheckListFk: {
					...checklistLookupProvider.generateChecklistLookup({
						showClearButton: true,
						restrictToProjectIds: (entity) => entity.ProjectFk,
					}),
					...{
						additionalFields: [
							{
								displayMember: 'DescriptionInfo.Translated',
								label: {
									text: 'Check List Description',
									key: 'basics.meeting.entityCheckListDescription',
								},
								column: true,
								singleRow: true,
							},
						],
					},
				},
				RfqHeaderFk: {
					//todo: waiting Rfq LookupProvider
				},
				BidHeaderFk: {
					//todo: waiting BidHeader LookupProvider
				},
			},
		};
	}
}
