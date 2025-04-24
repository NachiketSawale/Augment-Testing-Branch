/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { IMaterial2CertificateEntity } from '../model/entities/material-2-certificate-entity.interface';

/**
 * Basics Material Certificates layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialCertificatesLayoutService {
	/**
	 * Generate layout config
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IMaterial2CertificateEntity>> {

		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties'
					},
					attributes: [
						'MaterialFk',
						'PrcStructureFk',
						'BpdCertificateTypeFk',
						'IsRequired',
						'IsMandatory',
						'IsRequiredSub',
						'IsMandatorySub',
						'CommentText'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					'CommentText': { 'key': 'entityCommentText', 'text': 'Comment' }
				}),
				...prefixAllTranslationKeys('basics.material.', {
					'MaterialFk': {
						'key': 'record.material',
						'text': 'Material'
					},
					'PrcStructureFk': {
						key: 'materialSearchLookup.htmlTranslate.structure',
						text: 'Structure',
					},
					'BpdCertificateTypeFk': { 'key': 'certificate.type', 'text': 'Certificate Type' },
					'IsRequired': { 'key': 'certificate.isRequired', 'text': 'Is Required' },
					'IsMandatory': { 'key': 'certificate.isMandatory', 'text': 'Is Mandatory' },
					'IsRequiredSub': { 'key': 'certificate.isRequiredSubSub', 'text': 'Is Required Sub' },
					'IsMandatorySub': { 'key': 'certificate.isMandatorySubSub', 'text': 'Is Mandatory Sub' }
				})
			},
			overloads: {
				MaterialFk: BasicsSharedLookupOverloadProvider.provideMaterialLookupOverload(true),
				PrcStructureFk: BasicsSharedLookupOverloadProvider.provideProcurementStructureLookupOverload(true),
				BpdCertificateTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideCertificateTypeLookupOverload(false)
			}
		};
	}
}