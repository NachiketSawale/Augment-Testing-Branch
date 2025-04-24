/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { BasicsSharedLookupOverloadProvider, BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { IPrrHeaderEntity } from '../model/entities/prr-header-entity.interface';
import { ProjectSharedProjectLookupProviderService } from '@libs/project/shared';

/**
 * Controlling Revenue Recognition layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ControllingRevenueRecognitionLayoutService {
	private readonly projectLookupProvider = inject(ProjectSharedProjectLookupProviderService);

	/**
	 * Generate layout config
	 */

	public async generateLayout(context: IInitializationContext): Promise<ILayoutConfiguration<IPrrHeaderEntity>> {

		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties'
					},
					attributes: [
						'PrjProjectFk',
						'CompanyYearFk',
						'CompanyPeriodFk',
						'CompanyPeriodFkStartDate',
						'CompanyPeriodFkEndDate',
						'PrrStatusFk',
						'BasClerkResponsibleFk',
						'CommentText',
						'UserDefined1',
						'UserDefined2',
						'UserDefined3',
						'UserDefined4',
						'UserDefined5',
						'Remark',
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					'CommentText': {
						text: 'Comment',
						key: 'entityCommentText'
					},
					'Remark': {
						text: 'Remark',
						key: 'entityRemark'
					}
				}),
				...prefixAllTranslationKeys('controlling.revrecognition.', {
					'PrjProjectFk': {
						text: 'Project',
						key: 'entityProjectFk'
					},
					'CompanyYearFk': {
						text: 'Company Year Service',
						key: 'entityCompanyYearServiceFk'
					},
					'CompanyPeriodFk': {
						text: 'Reporting Period',
						key: 'entityCompanyPeriod'
					},
					'CompanyPeriodFkStartDate': {
						text: 'Start Date',
						key: 'entityCompanyStartDate'
					},
					'CompanyPeriodFkEndDate': {
						text: 'End Date',
						key: 'entityCompanyEndDate'
					},
					'PrrStatusFk': {
						text: 'Status',
						key: 'entityPrrStatusFk'
					},
					'BasClerkResponsibleFk': {
						text: 'Responsible',
						key: 'basClerkResponsibleFk'
					},
					'UserDefined1': {
						text: 'User Defined 1',
						key: 'userDefined1'
					},
					'UserDefined2': {
						text: 'User Defined 2',
						key: 'userDefined2'
					},
					'UserDefined3': {
						text: 'User Defined 3',
						key: 'userDefined3'
					},
					'UserDefined4': {
						text: 'User Defined 4',
						key: 'userDefined4'
					},
					'UserDefined5': {
						text: 'User Defined 5',
						key: 'userDefined5'
					},
					'HeaderDate': {
						text: 'Date',
						key: 'headerDate'
					},
					'Percentage': {
						text: 'Percentage',
						key: 'percentage'
					},
					'AmountTotal': {
						text: 'Total',
						key: 'amountTotal'
					}
				}),
			},
			overloads: {
				CompanyYearFk: BasicsSharedLookupOverloadProvider.provideCompanyYearLookupOverload(false),
				CompanyPeriodFk: BasicsSharedLookupOverloadProvider.provideCompanyPeriodLookupOverload(false),
				PrjProjectFk: this.projectLookupProvider.generateProjectLookup({
					lookupOptions: {
						showDescription: true,
						descriptionMember: 'ProjectNo'
					},
				}),
				CompanyPeriodFkStartDate: {
					readonly: true
				},
				CompanyPeriodFkEndDate: {
					readonly: true
				},
				//todo  framework issue, the provideRevenueRecognitionStatusLookupOverload lookupOptions should provide imageSelector option
				//PrrStatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideRevenueRecognitionStatusLookupOverload(false, context.injector.get(BasicsSharedStatusIconService<IBasicsCustomizeRevenueRecognitionStatusEntity, IPrrHeaderEntity>)),
				PrrStatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideRevenueRecognitionStatusReadonlyLookupOverload(),
				BasClerkResponsibleFk: BasicsSharedCustomizeLookupOverloadProvider.provideClerkRoleLookupOverload(true),
			}
		};
	}
}