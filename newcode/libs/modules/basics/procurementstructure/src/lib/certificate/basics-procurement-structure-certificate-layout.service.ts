/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import { PlatformLazyInjectorService, prefixAllTranslationKeys } from '@libs/platform/common';
import {
	ILayoutConfiguration
} from '@libs/ui/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { IPrcConfiguration2CertEntity } from '../model/entities/prc-configuration-2-cert-entity.interface';
import { BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN } from '@libs/businesspartner/interfaces';

/**
 * Procurement structure certificate layout service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsProcurementStructureCertificateLayoutService {

	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	/**
	 * Generate layout config
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IPrcConfiguration2CertEntity>> {
		
		const bpRelatedLookupProvider = await this.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN);
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties'
					},
					attributes: [
						'PrcConfigHeaderFk',
						'BpdCertificateTypeFk',
						'IsRequired',
						'IsMandatory',
						'IsRequiredSubSub',
						'IsMandatorySubSub',
						'CommentText',
						'GuaranteeCost',
						'GuaranteeCostPercent',
						'Amount',
						'ValidFrom',
						'ValidTo'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					'BpdCertificateTypeFk': {
						text: 'Configuration Header',
						key: 'entityType'
					},
					'CommentText': {
						text: 'Comment',
						key: 'entityCommentText'
					},
					'Amount': {
						text: 'Amount',
						key: 'amount'
					},
					'ValidFrom': {
						text: 'Valid From',
						key: 'validFrom'
					},
					'ValidTo': {
						text: 'Valid To',
						key: 'validTo'
					}
				}),
				...prefixAllTranslationKeys('basics.procurementstructure.', {
					'PrcConfigHeaderFk': {
						text: 'Configuration Header',
						key: 'configuration'
					},
					'GuaranteeCost': {
						text: 'Guarantee Cost',
						key: 'guaranteeCost'
					},
					'GuaranteeCostPercent': {
						text: 'Guarantee Cost Percent',
						key: 'guaranteeCostPercent'
					},
					'IsRequired': {
						text: 'Is Required',
						key: 'isRequired'
					},
					'IsMandatory': {
						text: 'Is Mandatory',
						key: 'isMandatory'
					},
					'IsRequiredSubSub': {
						text: 'Is Required Sub Sub',
						key: 'isRequiredSubSub'
					},
					'IsMandatorySubSub': {
						text: 'Is Mandatory Sub Sub',
						key: 'isMandatorySubSub'
					}
				}),
			},
			overloads: {
				PrcConfigHeaderFk: BasicsSharedLookupOverloadProvider.provideProcurementConfigurationHeaderLookupOverload(false), 
				BpdCertificateTypeFk: bpRelatedLookupProvider.getBusinessPartnerEvaluationSchemaLookupOverload()
			}
		};
	}
}