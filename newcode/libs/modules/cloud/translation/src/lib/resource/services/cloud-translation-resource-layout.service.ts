/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IResourceEntity } from '../model/entities/resource-entity.interface';
import { CloudTranslationResourceLookupService } from './cloud-translation-resource-lookup.service';

/**
 * Cloud Translation Resource Layout Service
 */
@Injectable({
	providedIn: 'root',
})
export class CloudTranslationResourceLayoutService {
	/**
	 * Generate layout config
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IResourceEntity>> {
		const basicFields: (keyof IResourceEntity)[] = [
			'Id',
			'ResourceFk',
			'SourceFk',
			'Path',
			'ResourceKey',
			'ForeignId',
			'IsGlossary',
			'DisableAutoMatch',
			'ResourceTerm',
			'SubjectFk',
			'Remark',
			'Translatable',
			'GlossaryRemark',
			'MaxLength',
			'ParameterInfo',
			'IsApproved',
			'ApprovedBy',
			'Ischanged',
			'Category',
		];

		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: basicFields,
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.translation.', {
					Id: {
						text: 'Id',
					},
					ResourceFk: {
						key: 'resourceEntity',
						text: 'Resource',
					},
					SourceFk: {
						key: 'source',
						text: 'SourceFk',
					},
					Path: {
						key: 'path',
						text: 'Path',
					},
					ResourceKey: {
						key: 'resourcekey',
						text: 'Resource Key',
					},
					ForeignId: {
						key: 'foreignid',
						text: 'Foreign Id',
					},
					IsGlossary: {
						key: 'isglossary',
						text: 'IsGlossary',
					},
					DisableAutoMatch: {
						key: 'disableAutoMatch',
						text: 'Disable Auto Match',
					},
					ResourceTerm: {
						key: 'resourceterm',
						text: 'Term',
					},
					SubjectFk: {
						key: 'subjectfk',
						text: 'Subject',
					},
					Remark: {
						text: 'Remarks',
					},
					Translatable: {
						key: 'translatable',
						text: 'Translate',
					},
					GlossaryRemark: {
						key: 'glossaryremark',
						text: 'Glossary Remark',
					},
					MaxLength: {
						key: 'maxlength',
						text: 'Max Length',
					},
					ParameterInfo: {
						key: 'parameterinfo',
						text: 'Parameter Info',
					},
					IsApproved: {
						key: 'isapproved',
						text: 'Is Approved',
					},
					ApprovedBy: {
						key: 'approvedby',
						text: 'Approved By',
					},
					Ischanged: {
						text: 'Is Changed',
					},
					Category: {
						key: 'category',
						text: 'Category',
					},
				}),
			},
			overloads: {
				Id: { readonly: true },
				SourceFk: { readonly: true },
				ResourceFk: {
					////TODO lookup service loaded properly but data not bind to the grid and form control

					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: CloudTranslationResourceLookupService,
						showClearButton: true,
						showDescription: true,
						descriptionMember: 'ResourceTerm',
					}),
				},
				Path: { readonly: true },
				ResourceKey: { readonly: true },
				ForeignId: { readonly: true },
			},
		};
	}
}
