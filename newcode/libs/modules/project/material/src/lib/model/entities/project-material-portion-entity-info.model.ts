/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { ProjectMaterialPortionDataService } from '../../services/project-material-portion-data.service';
import { IProjectMaterialPortionEntity } from './prj-material-portion-entity.interface';
import { ProjectMaterialPortionLayoutService } from '../../services/project-material-portion-layout.service';
import { ProjectMaterialPortionBehavior } from '../../behaviors/project-material-portion-behavior.service';
import { ProjectMaterialPortionValidationService } from '../../services/project-material-portion-validation.service';
import { EntityDomainType } from '@libs/platform/data-access';

/**
 * Basics Material Portion Module Info
 */
export const PROJECT_MATERIAL_PORTION_ENTITY_INFO = EntityInfo.create<IProjectMaterialPortionEntity>({
	grid: {
		title: { text: 'Material Portion', key: 'basics.material.portion.title' },
	},
	form: {
		containerUuid: '4a1245ec24f94aa9a8005db8618bfe2d',
		title: { text: 'Material Portion Detail', key: 'basics.material.portion.detailTitle' },
	},
	dataService: (ctx) => ctx.injector.get(ProjectMaterialPortionDataService),
	containerBehavior: (ctx) => ctx.injector.get(ProjectMaterialPortionBehavior),
	entitySchema: {
		schema: 'ProjectMaterialPortionDto',
		properties: {
			Project2MdcCostCodeFk: { domain: EntityDomainType.Integer, mandatory: false },
			CostPerUnit: { domain: EntityDomainType.Decimal, mandatory: false },
			IsEstimatePrice: { domain: EntityDomainType.Boolean, mandatory: false },
			IsDayWorkRate: { domain: EntityDomainType.Boolean, mandatory: false },
			PriceExtra: { domain: EntityDomainType.Decimal, mandatory: false },
			Quantity: { domain: EntityDomainType.Factor, mandatory: false },
			PriceConditionFk: { domain: EntityDomainType.Integer, mandatory: false },
			MdcMaterialPortionTypeFk: { domain: EntityDomainType.Integer, mandatory: false },
			Code: { domain: EntityDomainType.Code, mandatory: false },
			Description: { domain: EntityDomainType.Text, mandatory: false },
			MdcCostPerUnit: { domain: EntityDomainType.Decimal, mandatory: false },
		},
	},
	permissionUuid: 'def9a05422154aeba42939052f280a1a',
	validationService: (ctx) => ctx.injector.get(ProjectMaterialPortionValidationService),
	layoutConfiguration: (context) => {
		return context.injector.get(ProjectMaterialPortionLayoutService).generateLayout();
	},
});
