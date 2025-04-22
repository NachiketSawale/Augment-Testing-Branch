/*
 * Copyright(c) RIB Software GmbH
 */

import { GenericWizardNamingParameterTypeEnum } from '../enum/generic-wizard-naming-parameter-type.enum';
import { GenericWizardNamingParameterType } from '../types/generic-wizard-naming-parameter-type.type';

export const GenericWizardNamingParameterTypeConstant: GenericWizardNamingParameterType = {
	[GenericWizardNamingParameterTypeEnum.mailSubject]: {
		id: 1,
		titleTr: { key: 'basics.config.genWizardNamingParameter.namingTypes.mailSubject' }
	},
	[GenericWizardNamingParameterTypeEnum.exportFile]: {
		id: 2,
		titleTr: { key: 'basics.config.genWizardNamingParameter.namingTypes.exportFile' }
	},
	[GenericWizardNamingParameterTypeEnum.exportReport]: {
		id: 3,
		titleTr: { key: 'basics.config.genWizardNamingParameter.namingTypes.exportReport' }
	}
};