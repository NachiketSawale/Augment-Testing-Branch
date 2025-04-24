/*
 * Copyright(c) RIB Software GmbH
 */

import { GenericWizardNamingParameter } from '../types/generic-wizard-naming-parameter.type';

/**
 * Used to format strings in the naming constant service, based on the name and pattern.
 */
export const GenericWizardNamingParameterConstant: GenericWizardNamingParameter[] = [
	{
		name: 'projectDescription',
		nameTr: { key: 'basics.config.genWizardNamingParameter.projectDescription' },
		id: 1,
		pattern: '{a+}'
	},
	{
		name: 'projectCode',
		nameTr: { key: 'basics.config.genWizardNamingParameter.projectCode' },
		id: 2,
		pattern: '{b+}'
	},
	{
		name: 'packageDescription',
		nameTr: { key: 'basics.config.genWizardNamingParameter.packageDescription' },
		id: 3,
		pattern: '{c+}'
	},
	{
		name: 'packageCode',
		nameTr: { key: 'basics.config.genWizardNamingParameter.packageCode' },
		id: 4,
		pattern: '{d+}'
	},
	{
		name: 'requisitionDescription',
		nameTr: { key: 'basics.config.genWizardNamingParameter.requisitionDescription' },
		id: 5,
		pattern: '{e+}'
	},
	{
		name: 'requisitionCode',
		nameTr: { key: 'basics.config.genWizardNamingParameter.requisitionCode' },
		id: 6,
		pattern: '{f+}'
	},
	{
		name: 'rfqDescription',
		nameTr: { key: 'basics.config.genWizardNamingParameter.rfqDescription' },
		id: 7,
		pattern: '{g+}'
	},
	{
		name: 'rfqCode',
		nameTr: { key: 'basics.config.genWizardNamingParameter.rfqCode' },
		id: 8,
		pattern: '{h+}'
	},
	{
		name: 'contractDescription',
		nameTr: { key: 'basics.config.genWizardNamingParameter.contractDescription' },
		id: 9,
		pattern: '{i+}'
	},
	{
		name: 'contractCode',
		nameTr: { key: 'basics.config.genWizardNamingParameter.contractCode' },
		id: 10,
		pattern: '{j+}'
	},
	{
		name: 'quoteCode',
		nameTr: { key: 'basics.config.genWizardNamingParameter.quoteCode' },
		id: 11,
		pattern: '{k+}'
	},
	{
		name: 'quoteExternalCode',
		nameTr: { key: 'basics.config.genWizardNamingParameter.quoteExternalCode' },
		id: 12,
		pattern: '{l+}'
	}
];