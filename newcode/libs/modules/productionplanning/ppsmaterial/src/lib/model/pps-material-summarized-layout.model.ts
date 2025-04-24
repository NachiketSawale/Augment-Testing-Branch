/*
 * Copyright(c) RIB Software GmbH
 */

import { prefixAllTranslationKeys, ServiceLocator } from '@libs/platform/common';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { PpsMaterialLookupService } from '../services/pps-material-lookup.service';
import { IPpsMaterialLookupEntity } from './entities/pps-material-lookup-entity.interface';
import { IPpsSummarizedMatEntity } from './models';
import { PPS_MATERIAL_SUMMARIZEMODES_TOKEN } from './pps-material-summarize-modes';

export const PPS_MATERIAL_SUMMARIZED_LAYOUT: ILayoutConfiguration<IPpsSummarizedMatEntity> = {
	groups: [
		{
			gid: 'baseGroup',
			attributes: ['MaterialSumFk', 'SummarizeMode', 'Remark', 'UserFlag1', 'UserFlag2'],
		},
		{
			gid: 'userDefTextGroup',
			attributes: ['Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5']
		},
	],
	labels: {
		...prefixAllTranslationKeys('cloud.common.', {
			baseGroup: { key: 'entityProperties', text: '*Basic Data' },
			Remark: { key: 'entityRemark', text: '*Remark' },
			userDefTextGroup: { key: 'UserdefTexts' },
			Userdefined1: { key: 'entityUserDefined', params: { 'p_0': '1' } },
			Userdefined2: { key: 'entityUserDefined', params: { 'p_0': '2' } },
			Userdefined3: { key: 'entityUserDefined', params: { 'p_0': '3' } },
			Userdefined4: { key: 'entityUserDefined', params: { 'p_0': '4' } },
			Userdefined5: { key: 'entityUserDefined', params: { 'p_0': '5' } }
		}),
		...prefixAllTranslationKeys('productionplanning.ppsmaterial.', {
			MaterialSumFk: { key: 'summarized.materialSumFk', text: '*Summarized Material' },
			SummarizeMode: { key: 'summarized.summarizedMode', text: '*Summarized Mode' },
			UserFlag1: { key: 'ppsMaterialComp.userFlag1', text: '*User Flag 1' },
			UserFlag2: { key: 'ppsMaterialComp.userFlag2', text: '*User Flag 2' },
		}),

	},
	overloads: {
		MaterialSumFk: {
			type: FieldType.Lookup,
			lookupOptions: createLookup<IPpsSummarizedMatEntity, IPpsMaterialLookupEntity>({
				dataServiceToken: PpsMaterialLookupService,
			})
		},
		SummarizeMode: {
			type: FieldType.Select,
			itemsSource: {
				items: ServiceLocator.injector.get(PPS_MATERIAL_SUMMARIZEMODES_TOKEN)
			}
		},
	}

};
