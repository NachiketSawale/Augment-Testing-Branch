/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import {
	BasicsSharedUserFormDataStatusLookupService,
	BasicsSharedUserFormLookupService,
	IUserFormDataStatusEntity,
	IUserFormEntity
} from '@libs/basics/shared';
import { PlatformTranslateService, prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { BelongingType, IPpsUserFormDataEntity } from '../../model/entities/pps-formdata-entity.interface';

/**
 * PPS Formdata layout service
 */
@Injectable({
	providedIn: 'root'
})
export class PpsCommonFormdataLayoutService {

	private translateService: PlatformTranslateService = inject(PlatformTranslateService);

	public generateLayout(): ILayoutConfiguration<IPpsUserFormDataEntity> {
		return <ILayoutConfiguration<IPpsUserFormDataEntity>>{
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['Belonging', 'FormFk', 'FormDataStatusFk'],
					additionalAttributes: ['FormDataIntersection.DescriptionInfo.Translated']
				},
			],
			overloads: {
				Belonging: {
					readonly: true,
					type: FieldType.ImageSelect,
					itemsSource: {
						items: [
							{
								id: BelongingType.parentUnit, // parentUnit
								iconCSS: 'control-icons ico-accordion-root',
								displayName: this.translateService.instant('productionplanning.item.formData.parentUnit').text,
							}, {
								id: BelongingType.currentUnit, // currentUnit
								iconCSS: 'control-icons ico-accordion-grp',
								displayName: this.translateService.instant('productionplanning.item.formData.currentUnit').text,
							}
						]
					}
				},
				FormFk: {
					type: FieldType.Lookup,
					width: 150,
					lookupOptions: createLookup<IPpsUserFormDataEntity, IUserFormEntity>({
						dataServiceToken: BasicsSharedUserFormLookupService
					})
				},
				FormDataStatusFk: {
					readonly: true,
					type: FieldType.Lookup,
					width: 150,
					lookupOptions: createLookup<IPpsUserFormDataEntity, IUserFormDataStatusEntity>({
						dataServiceToken: BasicsSharedUserFormDataStatusLookupService
					})
				},

			},
			additionalOverloads: {
				'FormDataIntersection.DescriptionInfo.Translated': {
					width: 180,
					type: FieldType.Description,
					searchable: true
				}
			},
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					FormFk: {
						key: 'entityUserForm'
					},
					FormDataStatusFk: {
						key: 'entityStatus'
					},
					'FormDataIntersection.DescriptionInfo.Translated': {
						key: 'entityDescription'
					},
				}),
				...prefixAllTranslationKeys('productionplanning.item.', {
					Belonging: {
						key: 'formData.belonging', text: '*Belonging'
					},
				})
			},
		};
	}
}