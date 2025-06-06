/*
 * Copyright(c) RIB Software GmbH
 * ----------------------------------------------------------------------
 * This is auto-generated code by ClientTypeScriptModuleInfoGenerator.
 * ----------------------------------------------------------------------
 * This code was generated by RIB Model Generator tool.
 *
 * Changes to this file may cause incorrect behavior and will be lost if
 * the code is regenerated.
 * ----------------------------------------------------------------------
 */

import { ResourceMasterPhotoDataService } from '../../services/data/resource-master-photo-data.service';
import { ResourceMasterPhotoValidationService } from '../../services/validation/resource-master-photo-validation.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IResourceMasterPhotoEntity } from '@libs/resource/interfaces';
import { IEntityInfo } from '@libs/ui/business-base';
import { ILayoutConfiguration } from '@libs/ui/common';

export const resourceMasterPhotoEntityInfoGenerated = <IEntityInfo<IResourceMasterPhotoEntity>>{
	dataService: (ctx) => ctx.injector.get(ResourceMasterPhotoDataService),
	validationService: (ctx) => ctx.injector.get(ResourceMasterPhotoValidationService),
	dtoSchemeId: {
		moduleSubModule: 'Resource.Master',
		typeName: 'PhotoDto'
	},
	permissionUuid: '3467f2642146437c94710b964f0c59cb',
	layoutConfiguration: async (ctx) => {
		return <ILayoutConfiguration<IResourceMasterPhotoEntity>>{
			groups: [
				{
					gid: 'default',
					attributes: [
						'ResourceFk',
						'BlobsFk',
						'PhotoDate',
						'CommentText',
					]
				},
			],
			overloads: {},
			labels: { 
				...prefixAllTranslationKeys('resource.master.', {
					ResourceFk: { key: 'entityResource' },
					BlobsFk: { key: 'entityBlobs' },
					PhotoDate: { key: 'entityPhotoDate' }
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					CommentText: { key: 'entityComment' }
				}),
			 }
		};
	}
};