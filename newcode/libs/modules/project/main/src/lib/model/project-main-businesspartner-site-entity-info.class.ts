/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { ProjectMainBusinessPartnerSiteDataService } from '../services/project-main-business-partner-site-data.service';
import { createLookup, FieldType, ILookupContext, ServerSideFilterValueType } from '@libs/ui/common';
import { BusinessPartnerLookupService, BusinesspartnerSharedSubsidiaryLookupService } from '@libs/businesspartner/shared';
import { ProjectMainDataService } from '@libs/project/shared';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { IProjectLocationEntity, IProjectMainBusinessPartnerSiteEntity } from '@libs/project/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ProjectMainBusinessPartnerSiteValidationService } from '../services/project-main-business-partner-site-validation.service';
import { ProjectMainBusinessPartnerSiteBehavior } from '../behaviors/project-main-business-partner-site-behavior.service';
import { ProjectLocationLookupService } from '@libs/project/shared';
import { ISubsidiaryLookupEntity } from '@libs/businesspartner/interfaces';


export const projectMainBusinessPartnerSiteEntityInfo: EntityInfo = EntityInfo.create({
	grid: {
		title: {key: 'project.main' + '.listBusinessPartnerSiteTitle'},
		behavior: ctx => ctx.injector.get(ProjectMainBusinessPartnerSiteBehavior),
	},
	form: {
		title: { key: 'project.main' + '.detailBusinessPartnerSiteTitle' },
		containerUuid: 'cc4f2574ded745f296fc516a6d1e0c62',
	},
	dataService: ctx => ctx.injector.get(ProjectMainBusinessPartnerSiteDataService),
	validationService: ctx => ctx.injector.get(ProjectMainBusinessPartnerSiteValidationService),
	dtoSchemeId: {moduleSubModule: 'Project.Main', typeName: 'ProjectBusinessPartnerSiteDto'},
	permissionUuid: 'fdedb62839b849ddb8cddf717d561e9d',
	layoutConfiguration: {
		groups: [
			{gid: 'baseGroup', attributes: ['BusinessPartnerFk', 'TelephoneNumberFk', 'Email', 'SubsidiaryFk', 'Remark', 'Comment', 'LocationFk' /*'AssetMasterFk']*/]},
		],
		overloads: {
			BusinessPartnerFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup( {
					dataServiceToken: BusinessPartnerLookupService,
					displayMember: 'BusinessPartnerName1',
				})
			},
			LocationFk:{
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ProjectLocationLookupService,
					showClearButton: true,
					serverSideFilter: {
						key: '',
						execute(context: ILookupContext<IProjectLocationEntity, IProjectMainBusinessPartnerSiteEntity>) {
							return {
								ProjectId: context.injector.get(ProjectMainDataService).getSelectedEntity()?.Id
							};
						}
					}
				})
			},
			TelephoneNumberFk: BasicsSharedLookupOverloadProvider.providerTelephoneDialogComponentOverload(true),
			// TODO: serverSideFilter needs to be rechecked
			SubsidiaryFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup<IProjectMainBusinessPartnerSiteEntity, ISubsidiaryLookupEntity>({
					dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService,
					serverSideFilter: {
						key: 'businesspartner-main-subsidiary-common-filter',
						execute(context: ILookupContext<ISubsidiaryLookupEntity, IProjectMainBusinessPartnerSiteEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
							return {
								BusinessPartnerFk: context.entity ? context.entity.BusinessPartnerFk : null,
							};
						}
					},
				})
			},
		},
		labels: {
			...prefixAllTranslationKeys('businesspartner.main.', {
				ContactFk: { key: 'synContact.contacts' },
			}),
			...prefixAllTranslationKeys('project.location.', {
				LocationFk: { key: 'location' },
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				Comment: { key: 'entityCommentText' },
				BusinessPartnerFk: { key: 'entityBusinessPartner' },
				SubsidiaryFk: { key: 'entitySubsidiary'},
				Remark: { key: 'entityRemark' },
				TelephoneNumberFk: { key: 'TelephoneDialogPhoneNumber' },
				Email: { key: 'email' },
			}),
		},
	}

} as IEntityInfo<IProjectMainBusinessPartnerSiteEntity>);