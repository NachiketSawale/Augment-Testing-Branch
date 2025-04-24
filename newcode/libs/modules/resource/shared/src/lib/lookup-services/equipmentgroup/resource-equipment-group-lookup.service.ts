/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, IGridConfiguration, ILookupTreeConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IEquipmentGroupEntity } from '@libs/resource/interfaces';
import {Injectable} from '@angular/core';

/**
 * Equipment Group Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class ResourceEquipmentGroupLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IEquipmentGroupEntity, TEntity> {
	public configuration!: IGridConfiguration<IEquipmentGroupEntity>;
	public constructor() {
		super({
			httpRead: { route: 'resource/equipmentgroup', endPointRead: 'lookuplist' },
			dataProcessors : [],
			tree: {
				parentProp: 'EquipmentGroupFk',
				childProp: 'SubGroups'
			}
		}, {
			uuid: '5ca9a82dfe714ea7a0105bcf4e58e570',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				uuid: 'a4cc03889298406495178b513a0b8ead',
				treeConfiguration: {
					parent: (entity) => {
						if (entity.EquipmentGroupFk) {
							return this.configuration?.items?.find((item) => item.Id === entity.EquipmentGroupFk) || null;
						}
						return null;
					},
					children: (entity) => entity.SubGroups?? [],
					collapsed: true
				},
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: {text: 'Code', key: 'cloud.common.entityCode'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Description',
						model: 'DescriptionInfo.Translated',
						type: FieldType.Description,
						label: {text: 'Description', key: 'cloud.common.entityDescription'},
						sortable: true,
						visible: true,
						readonly: true
					},
					// {
					// 	id: 'plantkind',
					// 	model: 'DefaultPlantKindFk',
					// 	type: FieldType.Lookup,
					// 	label: { text: 'Plant Kind', key: 'basics.customize.plantkind' },
					// 	lookupOptions: BasicsSharedCustomizeLookupOverloadProvider.providePlantKindLookupOverload(false), // TODO: change to new lookup
					// 	sortable: true,
					// 	visible: true,
					// 	readonly: true,
					// 	width: 150
					// },
					// {
					// 	id: 'planttype',
					// 	model: 'DefaultPlantTypeFk',
					// 	type: FieldType.Lookup,
					// 	label: { text: 'Plant Type', key: 'basics.customize.planttype' },
					// 	lookupOptions: BasicsSharedCustomizeLookupOverloadProvider.providePlantTypeLookupOverload(false), // TODO: change to new lookup
					// 	sortable: true,
					// 	visible: true,
					// 	readonly: true,
					// 	width: 150
					// },
					// {
					// 	id: 'prcstructure',
					// 	model: 'DefaultProcurementStructureFk',
					// 	type: FieldType.Lookup,
					// 	label: { text: 'Procurement Structure', key: 'resource.equipment.entityProcurementStructure' },
					// 	lookupOptions: BasicsSharedCustomizeLookupOverloadProvider.provideProcurementStructureLookupOverload(false), // TODO: change to new lookup
					// 	sortable: true,
					// 	visible: true,
					// 	readonly: true,
					// 	width: 150
					// },
					{
						id: 'CommentText',
						model: 'CommentText',
						type: FieldType.Comment,
						label: {text: 'Comment', key: 'cloud.common.entityCommentText'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Specification',
						model: 'Specification',
						type: FieldType.Remark,
						label: {text: 'Specification', key: 'cloud.common.EntitySpec'},
						sortable: true,
						visible: true,
						readonly: true
					},
				]
			},
			treeConfig: <ILookupTreeConfig<IEquipmentGroupEntity>>{
				parentMember: 'EquipmentGroupFk',
				childMember: 'SubGroups',
			},
		});
	}
}