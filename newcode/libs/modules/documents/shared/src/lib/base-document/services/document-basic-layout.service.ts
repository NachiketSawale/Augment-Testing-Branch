/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IDocumentBaseEntity } from '@libs/documents/interfaces';
import { merge } from 'lodash';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';

/**
 * document standard layout service
 */
@Injectable({
	providedIn: 'root',
})
export class DocumentBasicLayoutService {
	/**
	 * Generate layout config
	 * @param customizeConfig customized config.
	 * @return layout configuration
	 */
	public async generateLayout<T extends object & IDocumentBaseEntity>(customizeConfig?: object): Promise<ILayoutConfiguration<T>> {
		const commonLayout = {
			groups: [
				{
					gid: 'basicDocData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['OriginFileName', 'DocumentTypeFk', 'Description', 'DocumentDate'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('documents.project.', {
					OriginFileName: {
						key: 'entityFileArchiveDoc',
						text: 'Origin File Name',
					},
					DocumentDate: {
						key: 'entityDocumentDate',
						text: 'Document Date',
					},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					DocumentTypeFk: {
						key: 'entityDocumentType',
						text: 'File Type',
					},
					Description: {
						key: 'entityDescription',
						text: 'Description',
					},
				}),
			},
			overloads: {
				DocumentTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideDocumentTypeLookupOverload(false),
				OriginFileName: {
					readonly: true,
				},
			},
		};
		if (!customizeConfig) {
			return commonLayout as ILayoutConfiguration<T>;
		}
		const customizeLayout = customizeConfig as ILayoutConfiguration<T>;
		let standardAttrs: string[] = [];
		if (commonLayout.groups && commonLayout.groups.length > 0) {
			standardAttrs = commonLayout.groups[0].attributes.slice();
		}
		const mergedObject = merge(commonLayout, customizeLayout);
		if (mergedObject.groups && mergedObject.groups.length > 0 && customizeLayout.groups && customizeLayout.groups.length > 0) {
			const uniqueAttributes = [...new Set([...mergedObject.groups[0].attributes, ...standardAttrs])];
			mergedObject.groups[0].attributes = uniqueAttributes;
		}
		return mergedObject;
	}
}
