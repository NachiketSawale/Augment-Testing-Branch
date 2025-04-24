/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedEngineeringTaskStatusLookupService } from '@libs/basics/shared';
import { IEntityContext } from '@libs/platform/common';
import { ProjectSharedLookupService } from '@libs/project/shared';
import * as entities from '@libs/basics/interfaces';
import { IEngHeaderEntity } from '../../model/entities/eng-header-entity.interface';

/**
 * Resource Equipment Plant Lookup Service
 */
@Injectable({
	providedIn: 'root',
})
export class PpsEngineeringHeaderDialogLookupService<TEntity extends object = object> extends UiCommonLookupTypeDataService<IEngHeaderEntity, TEntity> {
	public constructor() {
		super('EngHeader', {
			uuid: 'f8b13155772e4227b197eb1eeef3503e',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			showDescription: true,
			descriptionMember: 'Description',
			gridConfig: (context) => {
				return {
					columns: [
						{
							id: 'code',
							model: 'Code',
							type: FieldType.Code,
							label: { text: 'Code', key: 'cloud.common.entityCode' },
							sortable: true,
							visible: true,
							readonly: true,
						},
						{
							id: 'description',
							model: 'Description',
							type: FieldType.Description,
							label: { text: 'Description', key: 'cloud.common.entityDescription' },
							sortable: true,
							visible: true,
							readonly: true,
						},
						{
							id: 'projectNo',
							model: 'ProjectFk',
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: ProjectSharedLookupService,
								displayMember: 'ProjectNo',
							}),
							width: 120,
							label: { key: 'cloud.common.entityProjectNo' },
							sortable: true,
							readonly: true,
						},
						{
							id: 'projectName',
							model: 'ProjectFk',
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: ProjectSharedLookupService,
								displayMember: 'ProjectName',
							}),
							width: 120,
							label: { key: 'cloud.common.entityProjectName' },
							sortable: false,
							readonly: true,
						},
						{
							id: 'engTypeFk',
							label: { key: 'cloud.common.entityType', text: 'Type' },
							model: 'EngTypeFk',
							...BasicsSharedCustomizeLookupOverloadProvider.provideEngineeringTypeReadonlyLookupOverload(),
							sortable: true,
							visible: true,
						},
						{
							id: 'engStatusFk',
							label: { key: 'cloud.common.entityStatus', text: 'Status' },
							model: 'EngStatusFk',
							readonly: true,
							sortable: false,
							type: FieldType.Lookup,
							lookupOptions: createLookup<IEngHeaderEntity, entities.IBasicsCustomizeEngineeringTaskStatusEntity>({
								dataServiceToken: BasicsSharedEngineeringTaskStatusLookupService,
								showClearButton: false,
							}),
							visible: true,
						},
					],
				};
			},
			dialogSearchForm: (context) => {
				return {
					form: {
						config: {
							groups: [{ groupId: 'default' }],
							rows: [
								{
									id: 'projectNo',
									model: 'projectId',
									type: FieldType.Lookup,
									lookupOptions: createLookup({
										dataServiceToken: ProjectSharedLookupService,
										displayMember: 'ProjectNo',
										showClearButton: true,
									}),
									label: { key: 'cloud.common.entityProjectNo' },
									visible: true,
								},
								{
									id: 'engTypeFk',
									label: { key: 'cloud.common.entityType', text: 'Type' },
									model: 'engTypeId',
									...BasicsSharedCustomizeLookupOverloadProvider.provideEngineeringTypeLookupOverload(true),
									visible: true,
								},
							],
						},
					},
					visible: true,
				};
			},
			serverSideFilter: {
				key: 'productionplanning-engineering-header-filter',
				execute(entity: IEntityContext<object>): string | object {
					//TODO
					return {};
				},
			},
			dialogOptions: {
				headerText: {
					text: '*Assign Engineering Header',
					key: 'productionplanning.engineering.assignEngineeringHeader',
				},
			},
			showDialog: true,
		});
	}
}
