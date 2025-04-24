/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ESTIMATE_PROJECT_BEHAVIOR_TOKEN } from '../behaviors/estimate-project-behavior.service';
import { EstimateProjectDataService } from '../services/estimate-project-data.service';
import { EstimateProjectHeaderLayoutService } from '../services/estimate-project-header-layout.service';
import { EntityDomainType } from '@libs/platform/data-access';
import { IEstimateCompositeEntity } from '@libs/estimate/shared';


export const ESTIMATE_PROJECT_ENTITY_INFO: EntityInfo = EntityInfo.create<IEstimateCompositeEntity>({
	grid: {
		title: { key: 'project.main.estimate' },
		behavior: ESTIMATE_PROJECT_BEHAVIOR_TOKEN
	},
	dataService: ctx => ctx.injector.get(EstimateProjectDataService),
	entitySchema: {
		schema: 'IEstimateCompositeEntity', properties: {
			// TODO
			//	Version: {domain: EntityDomainType.Integer, mandatory: true},
			//	InsertedAt: {domain: EntityDomainType.Date, mandatory: true},
			//	InsertedBy: {domain: EntityDomainType.Integer, mandatory: true},
			//	UpdatedAt: {domain: EntityDomainType.Date, mandatory: true},
			//	UpdatedBy: {domain: EntityDomainType.Integer, mandatory: true}
		},
		additionalProperties: {
			'EstHeader.Code': { domain: EntityDomainType.Code, mandatory: true},
			'EstHeader.EstTypeFk': { domain: EntityDomainType.Integer, mandatory: false },
			'EstHeader.EstStatusFk': { domain: EntityDomainType.Integer, mandatory: true },
			'EstHeader.DescriptionInfo.Description': { domain: EntityDomainType.Description, mandatory: false },
			'EstHeader.RubricCategoryFk': { domain: EntityDomainType.Integer, mandatory: false },
			'EstHeader.LgmJobFk': { domain: EntityDomainType.Integer, mandatory: true },
			'EstHeader.IsActive': { domain: EntityDomainType.Boolean, mandatory: false },
			'EstHeader.IsControlling': { domain: EntityDomainType.Boolean, mandatory: true },
			'EstHeader.Currency1Fk': { domain: EntityDomainType.Integer, mandatory: false },
			'EstHeader.Currency2Fk': { domain: EntityDomainType.Integer, mandatory: false },
			'EstHeader.Hint': { domain: EntityDomainType.Description, mandatory: false },
			'EstHeader.LevelFk': { domain: EntityDomainType.Integer, mandatory: false },
			'EstHeader.PsdActivityFk': { domain: EntityDomainType.Integer, mandatory: false },
			'EstHeader.Duration': { domain: EntityDomainType.Integer, mandatory: false },
			'EstHeader.VersionNo': { domain: EntityDomainType.Integer, mandatory: true },
			'EstHeader.VersionDescription': { domain: EntityDomainType.Description, mandatory: true },
			'EstHeader.VersionComment': { domain: EntityDomainType.Description, mandatory: false }
		},
		mainModule: 'estimate.main'
	},
	layoutConfiguration: context => {
		return context.injector.get(EstimateProjectHeaderLayoutService).generateLayout();
	},
	permissionUuid: 'ce87d35899f34e809cad2930093d86b5',

});