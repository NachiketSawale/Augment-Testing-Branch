import { Injectable } from '@angular/core';
import { IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { ICosMainObjectSetEntity } from '../../model/entities/cos-main-object-set-entity.interface';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { IProjectEntity } from '@libs/project/interfaces';
import { BasicsSharedClerkLookupService, BasicsSharedModelObjectSetTypeLookupService, BasicUserFormLookupService, IUserformEntity } from '@libs/basics/shared';
import { IBasicsClerkEntity, IBasicsCustomizeModelObjectSetTypeEntity } from '@libs/basics/interfaces';
import { BusinessPartnerLookupService } from '@libs/businesspartner/shared';
import { IBusinessPartnerSearchMainEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainObjectSetLayoutService {
	public generateLayout(context: IInitializationContext): ILayoutConfiguration<ICosMainObjectSetEntity> {
		return {
			groups: [
				{
					gid: 'baseGroup',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['ProjectFk', 'Name', 'DueDate', 'ObjectSetStatusFk', 'ObjectSetTypeFk', 'Remark', 'ClerkFk', 'BusinessPartnerFk', 'ReportFk', 'FormFk'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('model.project.', {
					ProjectFk: { key: 'entityProjectNo' },
				}),
				...prefixAllTranslationKeys('model.main.', {
					Name: { key: 'objectAttributeName' },
					DueDate: { key: 'objectSet.dueDate' },
					ObjectSetStatusFk: { key: 'objectSet.objectSetStatus' },
					ObjectSetTypeFk: { key: 'objectSet.objectSetType' },
					Remark: { key: 'objectSet.remark' },
					ClerkFk: { key: 'objectSet.clerk' },
					BusinessPartnerFk: { key: 'objectSet.businessPartner' },
					ReportFk: { key: 'objectSet.report' },
					FormFk: { key: 'objectSet.form' },
				}),
			},
			overloads: {
				ProjectFk: {
					type: FieldType.Lookup,
					label: { text: 'ProjectNo' },
					lookupOptions: createLookup<ICosMainObjectSetEntity, IProjectEntity>({
						dataServiceToken: ProjectSharedLookupService,
						showClearButton: true,
					}),
				},
				ClerkFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<ICosMainObjectSetEntity, IBasicsClerkEntity>({
						dataServiceToken: BasicsSharedClerkLookupService,
						showClearButton: true,
					}),
				},
				BusinessPartnerFk: {
					type: FieldType.Lookup,
					label: { text: 'BusinessPartnerName1' },
					lookupOptions: createLookup<ICosMainObjectSetEntity, IBusinessPartnerSearchMainEntity>({
						dataServiceToken: BusinessPartnerLookupService,
						showClearButton: true,
					}),
				},
				FormFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<ICosMainObjectSetEntity, IUserformEntity>({
						dataServiceToken: BasicUserFormLookupService,
						showClearButton: true,
						valueMember: 'Id',
						displayMember: 'DescriptionInfo.Description',
					}),
				},
				//todo ReportFk: {
				// 	type: FieldType.Lookup,
				// 	lookupOptions: createLookup({dataServiceToken: mainModelReportingLookupService})
				// }
				ObjectSetStatusFk: {
					readonly: true,
				},
				ObjectSetTypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<ICosMainObjectSetEntity, IBasicsCustomizeModelObjectSetTypeEntity>({ dataServiceToken: BasicsSharedModelObjectSetTypeLookupService }),
				},
			},
		};
	}
}