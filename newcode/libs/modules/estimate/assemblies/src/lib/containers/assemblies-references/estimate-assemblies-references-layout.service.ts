/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IAssemblyReferencesEntity } from '../../model/entities/assembly-references-entity.interface';

/**
 * Estimate Assemblies References Layout Service
 */
@Injectable({
	providedIn: 'root',
})
export class EstimateAssembliesReferencesLayoutService {
	public generateLayout(): ILayoutConfiguration<IAssemblyReferencesEntity> {
		return {
			suppressHistoryGroup: true,
			groups: [
				{
					'gid': 'basicData',
					'title': {
						'key': 'cloud.common.entityProperties',
						'text': 'Basic Data'
					},
					'attributes': [
						'Source'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('estimate.assemblies.', {
					'Source': {
						'key': 'source',
						'text': 'Source'
					}
				})
			},
			overloads: {
				Source: {
					readonly: true,
					width: 500
					// TODO - navigator
				},
			}
		};
	}
}