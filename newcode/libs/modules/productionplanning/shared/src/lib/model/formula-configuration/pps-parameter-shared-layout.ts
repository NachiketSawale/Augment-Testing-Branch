import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';

import { IPpsParameterEntityGenerated } from './pps-parameter-entity-generated.interface';

export const PpsParameterSharedLayout: ILayoutConfiguration<IPpsParameterEntityGenerated> = {
	groups: [
		{
			gid: 'baseGroup',
			attributes: ['DescriptionInfo', 'VariableName', 'PpsFormulaVersionFk', 'BasDisplayDomainFk', 'Value']
		},
	],
	overloads: {
		PpsFormulaVersionFk: {},
		BasDisplayDomainFk: {},
		Value: {}
	},
	labels: {
		...prefixAllTranslationKeys('productionplanning.formulaconfiguration.',{
			VariableName: {key: 'ppsParameter.variableName', text: '*Variable Name'},
			PpsFormulaVersionFk: { key: 'ppsParameter.ppsFormulaVersionFk', text: '*Formula Version' },
			BasDisplayDomainFk: {key: 'ppsParameter.basDisplayDomainFk', text: '*Display Domain'},
			Value: {key: 'ppsParameter.Value', text: '*Value'},
		})
	},
};