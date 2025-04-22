import { Injectable } from '@angular/core';
import { MODULE_INFO } from '../../model/entity-info/module-info.model';
import {ColumnDef, createLookup, FieldType} from '@libs/ui/common';
import {
	BasicsSharedClerkLookupService,
	BasicsSharedClerkRoleLookupService,
	IBasicsClerkEntity
} from '@libs/basics/shared';

@Injectable({
	providedIn: 'root',
})
export class EvaluationClerkLayoutService {
	public constructor() {}

	public get columns() {
		return [
			{
				id: 'clerkrolefk',
				model: 'ClerkRoleFk',
				label: {
					key: MODULE_INFO.cloudCommonModuleName + '.entityClerkRole',
					text: 'Clerk Role',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedClerkRoleLookupService,
					showDescription: true,
					descriptionMember: 'Description',
				}),
				visible: true,
			},
			{
				id: 'clerkfk',
				model: 'ClerkFk',
				label: {
					key: MODULE_INFO.cloudCommonModuleName + '.entityClerk',
					text: 'Clerk',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedClerkLookupService,
					showClearButton: false,
					showDescription: true,
					descriptionMember: 'Code'
				}),
				visible: true,
			},
			{
				id: 'validfrom',
				model: 'ValidFrom',
				label: {
					key: MODULE_INFO.businesspartnerMainModuleName + '.entityValidFrom',
					text: 'Valid From',
				},
				type: FieldType.Date,
				visible: true,
			},
			{
				id: 'validto',
				model: 'ValidTo',
				label: {
					key: MODULE_INFO.businesspartnerMainModuleName + '.entityValidTo',
					text: 'Valid To',
				},
				type: FieldType.Date,
				visible: true,
			},
			{
				id: 'commenttext',
				model: 'CommentText',
				label: {
					key: MODULE_INFO.basicsCommonModuleName + '.entityCommentText',
					text: 'Comment Text',
				},
				type: FieldType.Comment,
				visible: true,
			},
		] as ColumnDef<IBasicsClerkEntity>[];
	}
}
