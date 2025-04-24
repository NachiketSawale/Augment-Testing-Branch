/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import { prefixAllTranslationKeys, ServiceLocator } from '@libs/platform/common';
import { IHsqCheckList2LocationEntity } from '@libs/hsqe/interfaces';
import { ProjectLocationLookupService } from '@libs/project/shared';
import { IProjectLocationEntity } from '@libs/project/interfaces';
import { HsqeChecklistDataService } from '../hsqe-checklist-data.service';

/**
 * The checklist location layout service
 */
@Injectable({
	providedIn: 'root',
})
export class HsqeChecklistLocationLayoutService {
	public async generateLayout(): Promise<ILayoutConfiguration<IHsqCheckList2LocationEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['PrjLocationFk'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('hsqe.checklist.', {
					PrjLocationFk: {
						key: 'location.entityLocation',
						text: 'Location',
					},
				}),
			},
			overloads: {
				PrjLocationFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProjectLocationLookupService, ///todo:project location lookup not working very well
						showClearButton: true,
						disableDataCaching: false,
						serverSideFilter: {
							key: '',
							execute(context: ILookupContext<IProjectLocationEntity, IHsqCheckList2LocationEntity>) {
								const checklistDataService = ServiceLocator.injector.get(HsqeChecklistDataService);
								const selectedChecklist = checklistDataService.getSelectedEntity();
								return {
									ProjectId: selectedChecklist?.PrjProjectFk ?? -1,
								};
							},
						},
					}),
					additionalFields: [
						{
							displayMember: 'DescriptionInfo.Translated',
							label: {
								text: 'Location-Description',
								key: 'productionplanning.common.prjLocationFkDescription',
							},
							column: true,
							singleRow: true,
						},
					],
				},
			},
		};
	}
}
