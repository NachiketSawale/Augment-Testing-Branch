/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { BasicsSharedDefect2ProjectChangeTypeLookupService } from '@libs/basics/shared';
import { IEntityContext } from '@libs/platform/common';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { IEngDrawingEntityGenerated } from '../../model/drawing/eng-drawing-entity-generated.interface';
import { IBasicsCustomizeDefect2ProjectChangeTypeEntity } from '@libs/basics/interfaces';

/**
 * Resource Equipment Plant Lookup Service
 */
@Injectable({
	providedIn: 'root',
})
export class PpsSharedDrawingDialogLookupService<TEntity extends object = object> extends UiCommonLookupTypeDataService<IEngDrawingEntityGenerated, TEntity> {
	public constructor() {
		super('EngDrawing', {
			uuid: '9c4f5b5fa8dd4614850297daef6ccd2b',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			showDescription: true,
			descriptionMember: 'Description',
			showClearButton: true,
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
						//TODO: Rest of the columns
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
								//TODO: Production Unit
								{
									id: 'engDrawingType',
									label: {
										text: '*DrawingType',
										key: 'productionplanning.drawing.engDrawingTypeFk',
									},
									type: FieldType.Lookup,
									model: 'drawingTypeId',
									lookupOptions: createLookup<IEngDrawingEntityGenerated, IBasicsCustomizeDefect2ProjectChangeTypeEntity>({
										dataServiceToken: BasicsSharedDefect2ProjectChangeTypeLookupService,
										showClearButton: true,
									}),
								},
							],
						},
					},
					visible: true,
				};
			},
			serverSideFilter: {
				key: 'productionplanning-drawing-filter',
				execute: (context: IEntityContext<IEngDrawingEntityGenerated>) => {
					return {
						PKey1: context.entity?.PrjProjectFk as number,
					};
				},
			},
			dialogOptions: {
				headerText: {
					text: '*Assign Drawing',
					key: 'productionplanning.drawing.assignDrawing',
				},
			},
			showDialog: true,
		});
	}
}
