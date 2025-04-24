/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsConfigGenericWizardInstanceDataService } from '../services/basics-config-generic-wizard-instance-data.service';
import { IGenericWizardInstanceEntity } from './entities/generic-wizard-instance-entity.interface';
import { FieldType, createLookup } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';

export const BASICS_CONFIG_GENERIC_WIZARD_INSTANCE_ENTITY_INFO: EntityInfo = EntityInfo.create<IGenericWizardInstanceEntity>({
	grid: {
		title: { key: 'basics.config.genWizardInstanceListContainerTitle' },
	},
	form: {
		title: { key: 'basics.config.genWizardInstanceDetailContainerTitle' },
		containerUuid: '6120EEA99E1745F7A72430C2400336FF',
	},
	dataService: (ctx) => ctx.injector.get(BasicsConfigGenericWizardInstanceDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.Config', typeName: 'GenericWizardInstanceDto' },
	permissionUuid: '7C1DA2158B9443E483EACD6CB64AEA5E',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				title: {
					key: 'cloud.common.entityProperties',
					text: 'Basic Data',
				},
				attributes: ['CommentInfo', 'Remark', 'WizardConfiGuuid'],
			},
		],
		labels: {
			...prefixAllTranslationKeys('basics.config.', {
				WizardConfiGuuid: {
					key: 'wizardConfiGuuid',
				},
			}),
			
		},
		overloads: {
			WizardConfiGuuid: {
				grid: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						//dataServiceToken: BasicsConfigGenericWizardInstanceLookupService,
						//TODO Grid lookup without API call will be bound once such lookup service created.
						showClearButton: true,
						showDescription: true,
						descriptionMember: 'Description',
						showGrid: true,
					}),
				},
				form: {},
			},
		},
	},
});
