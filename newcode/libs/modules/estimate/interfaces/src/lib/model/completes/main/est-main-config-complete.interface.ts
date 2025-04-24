/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IEstAllowanceAssignmentEntity } from '../../entities/main/est-allowance-assignment-entity.interface';
import { IEstConfigEntity } from '../../entities/main/est-config-entity.interface';
import { IEstConfigTypeEntity } from '../../entities/main/est-config-type-entity.interface';
import { IEstCostBudgetAssignEntity } from '../../entities/main/est-cost-budget-assign-entity.interface';
import { IEstCostBudgetConfigEntity } from '../../entities/main/est-cost-budget-config-entity.interface';
import { IEstCostcodeAssignDetailEntity } from '../../entities/main/est-costcode-assign-detail-entity.interface';
import { IEstRootAssignmentDetailEntity } from '../../entities/main/est-root-assignment-detail-entity.interface';
import { IEstRootAssignmentParamEntity } from '../../entities/main/est-root-assignment-param-entity.interface';
import {
  IBasicsCustomizeEstimateRoundingConfigurationTypeEntity,
  IBasicsCustomizeEstRootAssignmentTypeEntity,
  IBasicsCustomizeEstStructureTypeEntity,
  IBasicsCustomizeEstTotalsConfigTypeEntity, IBasicsCustomizeEstUppConfigTypeEntity
} from '@libs/basics/interfaces';
import { IEstRoundingConfigDetailEntity } from '../../entities/main/est-rounding-config-detail-entity.interface';
import { IEstStructureDetailEntity } from '../../entities/main/est-structure-detail-entity.interface';
import { IEstStructureConfigEntity } from '../../entities/main/est-structure-config-entity.interface';
import { IEstTotalDetail2CostTypeEntity } from '../../entities/main/est-total-detail-2cost-type-entity.interface';
import { IEstTotalDetail2ResourceFlagEntity } from '../../entities/main/est-total-detail-2resource-flag-entity.interface';
import { IEstTotalsConfigEntity } from '../../entities/main/est-totals-config-entity.interface';
import { IEstTotalsConfigDetailEntity } from '../../entities/main/est-totals-config-detail-entity.interface';
import { IEstUpp2CostcodeEntity } from '../../entities/main/est-upp-2costcode-entity.interface';
import { IEstUppConfigEntity } from '../../entities/main/est-upp-config-entity.interface';
import { IEstHeaderEntity } from '../../entities/main/est-header-base-entity.interface';
import { IEstColumnConfigComplete } from './est-column-config-complete.interface';
import { IEstColumnConfigTypeEntity } from '../../entities/main/est-column-config-type-entity.interface';

export interface IEstMainConfigComplete{

 /*
  * BoqHeaderId
  */
  BoqHeaderId?: number | null;

 /*
  * ContextFk
  */
  ContextFk?: number | null;

 /*
  * EstAllowanceAssignmentEntities
  */
  EstAllowanceAssignmentEntities?: IEstAllowanceAssignmentEntity[] | null;

 /*
  * EstAllowanceConfigFk
  */
  EstAllowanceConfigFk?: number | null;

 /*
  * EstAllowanceConfigTypeFk
  */
  EstAllowanceConfigTypeFk?: number | null;

 /*
  * EstColumnConfigComplete
  */
  EstColumnConfigComplete?: IEstColumnConfigComplete | null;

 /*
  * EstConfig
  */
  EstConfig?: IEstConfigEntity | null;

 /*
  * EstConfigType
  */
  EstConfigType?: IEstConfigTypeEntity | null;

 /*
  * EstCostBudgetAssignDetails
  */
  EstCostBudgetAssignDetails?: IEstCostBudgetAssignEntity[] | null;

 /*
  * EstCostBudgetAssignDetailsToDelete
  */
  EstCostBudgetAssignDetailsToDelete?: IEstCostBudgetAssignEntity[] | null;

 /*
  * EstCostBudgetAssignDetailsToSave
  */
  EstCostBudgetAssignDetailsToSave?: IEstCostBudgetAssignEntity[] | null;

 /*
  * EstCostBudgetConfig
  */
  EstCostBudgetConfig?: IEstCostBudgetConfigEntity | null;

 /*
  * EstCostBudgetType
  */
  //EstCostBudgetType?: IBasicsCustomizeCostBudgetTypeEntity | null;

 /*
  * EstCostcodeAssigDetails
  */
  EstCostcodeAssigDetails?: IEstCostcodeAssignDetailEntity[] | null;

 /*
  * EstCostcodeAssigDetailsToDelete
  */
  EstCostcodeAssigDetailsToDelete?: IEstCostcodeAssignDetailEntity[] | null;

 /*
  * EstCostcodeAssigDetailsToSave
  */
  EstCostcodeAssigDetailsToSave?: IEstCostcodeAssignDetailEntity[] | null;

 /*
  * EstHeader
  */
  EstHeader?: IEstHeaderEntity | null;

 /*
  * EstHeaderId
  */
  EstHeaderId?: number | null;

 /*
  * EstRootAssignmentDetails
  */
  EstRootAssignmentDetails?: IEstRootAssignmentDetailEntity[] | null;

 /*
  * EstRootAssignmentDetailsToDelete
  */
  EstRootAssignmentDetailsToDelete?: IEstRootAssignmentDetailEntity[] | null;

 /*
  * EstRootAssignmentDetailsToSave
  */
  EstRootAssignmentDetailsToSave?: IEstRootAssignmentDetailEntity[] | null;

 /*
  * EstRootAssignmentParams
  */
  EstRootAssignmentParams?: IEstRootAssignmentParamEntity[] | null;

 /*
  * EstRootAssignmentParamsToDelete
  */
  EstRootAssignmentParamsToDelete?: IEstRootAssignmentParamEntity[] | null;

 /*
  * EstRootAssignmentParamsToSave
  */
  EstRootAssignmentParamsToSave?: IEstRootAssignmentParamEntity[] | null;

 /*
  * EstRootAssignmentType
  */
  EstRootAssignmentType?: IBasicsCustomizeEstRootAssignmentTypeEntity | null;

 /*
  * EstRoundingConfig
  */
  EstRoundingConfig?: IBasicsCustomizeEstimateRoundingConfigurationTypeEntity | null;

 /*
  * EstRoundingConfigDetailToSave
  */
  EstRoundingConfigDetailToSave?: IEstRoundingConfigDetailEntity[] | null;

 /*
  * EstRoundingConfigDetails
  */
  EstRoundingConfigDetails?: IEstRoundingConfigDetailEntity[] | null;

 /*
  * EstRoundingConfigType
  */
  EstRoundingConfigType?: IBasicsCustomizeEstimateRoundingConfigurationTypeEntity | null;

 /*
  * EstStructDetailsToDelete
  */
  EstStructDetailsToDelete?: IEstStructureDetailEntity[] | null;

 /*
  * EstStructDetailsToSave
  */
  EstStructDetailsToSave?: IEstStructureDetailEntity[] | null;

 /*
  * EstStructureConfig
  */
  EstStructureConfig?: IEstStructureConfigEntity | null;

 /*
  * EstStructureDetails
  */
  EstStructureDetails?: IEstStructureDetailEntity[] | null;

 /*
  * EstStructureType
  */
  EstStructureType?: IBasicsCustomizeEstStructureTypeEntity | null;

 /*
  * EstTotal2CostTypeDetailsToSave
  */
  EstTotal2CostTypeDetailsToSave?: IEstTotalDetail2CostTypeEntity[] | null;

 /*
  * EstTotal2ResourceFlagDetailsToSave
  */
  EstTotal2ResourceFlagDetailsToSave?: IEstTotalDetail2ResourceFlagEntity[] | null;

 /*
  * EstTotalsConfig
  */
  EstTotalsConfig?: IEstTotalsConfigEntity | null;

 /*
  * EstTotalsConfigDetails
  */
  EstTotalsConfigDetails?: IEstTotalsConfigDetailEntity[] | null;

 /*
  * EstTotalsConfigDetailsToDelete
  */
  EstTotalsConfigDetailsToDelete?: IEstTotalsConfigDetailEntity[] | null;

 /*
  * EstTotalsConfigDetailsToSave
  */
  EstTotalsConfigDetailsToSave?: IEstTotalsConfigDetailEntity[] | null;

 /*
  * EstTotalsConfigType
  */
  EstTotalsConfigType?: IBasicsCustomizeEstTotalsConfigTypeEntity | null;

 /*
  * EstUpp2CostCodeDetails
  */
  EstUpp2CostCodeDetails?: IEstUpp2CostcodeEntity[] | null;

 /*
  * EstUpp2CostCodeDetailsToDelete
  */
  EstUpp2CostCodeDetailsToDelete?: IEstUpp2CostcodeEntity[] | null;

 /*
  * EstUpp2CostCodeDetailsToSave
  */
  EstUpp2CostCodeDetailsToSave?: IEstUpp2CostcodeEntity[] | null;

 /*
  * EstUpp2CostCodeDetailsToUpdate
  */
  EstUpp2CostCodeDetailsToUpdate?: IEstUpp2CostcodeEntity[] | null;

 /*
  * EstUppConfig
  */
  EstUppConfig?: IEstUppConfigEntity | null;

 /*
  * EstUppConfigType
  */
  EstUppConfigType?: IBasicsCustomizeEstUppConfigTypeEntity | null;

 /*
  * IsDefaultConfig
  */
  IsDefaultConfig?: boolean | null;

 /*
  * IsDefaultCostBudget
  */
  IsDefaultCostBudget?: boolean | null;

 /*
  * IsDefaultRoundingConfig
  */
  IsDefaultRoundingConfig?: boolean | null;

 /*
  * IsDefaultStructure
  */
  IsDefaultStructure?: boolean | null;

 /*
  * IsDefaultTotals
  */
  IsDefaultTotals?: boolean | null;

 /*
  * IsDefaultUpp
  */
  IsDefaultUpp?: boolean | null;

 /*
  * IsForCustomization
  */
  IsForCustomization?: boolean | null;

 /*
  * IsUpdCostBudget
  */
  IsUpdCostBudget?: boolean | null;

 /*
  * IsUpdEstConfig
  */
  IsUpdEstConfig?: boolean | null;

 /*
  * IsUpdRoundingConfig
  */
  IsUpdRoundingConfig?: boolean | null;

 /*
  * IsUpdStructure
  */
  IsUpdStructure?: boolean | null;

 /*
  * IsUpdTotals
  */
  IsUpdTotals?: boolean | null;

 /*
  * IsUpdUpp
  */
  IsUpdUpp?: boolean | null;

	/**
	 * columnConfigDesc
	 */
	columnConfigDesc?: string | null;

	/**
	 * EstColumnConfigTypeFk
	 */
	EstColumnConfigTypeFk?: number | null;

	/**
	 * IsUpdColumnConfig
	 */
	IsUpdColumnConfig?: boolean | null;

	/**
	 * isEditColConfigType
	 */
	isEditColConfigType?: boolean | null;

	/**
	 * estColumnConfigType
	 */
	estColumnConfigType?: IEstColumnConfigTypeEntity | null;
}
