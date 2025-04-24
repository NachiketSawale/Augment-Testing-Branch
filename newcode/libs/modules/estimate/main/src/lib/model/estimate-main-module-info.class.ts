/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase,EntityInfo } from '@libs/ui/business-base';
import { ESTIMATE_MAIN_BOQ_ENTITY_INFO } from '../containers/boq/estimate-main-boq-entity-info.model';
import { ESTIMATE_MAIN_ASSEMBLY_STRUCTURE_ENTITY_INFO } from '../containers/assembly-structure/estimate-main-assembly-structure-entity-info.model';
import { ESTIMATE_MAIN_COST_GROUP_ASSIGNMENT_ENTITY_INFO } from '../containers/cost-group-assignment/estimate-main-cost-group-assignment-entity-info.class';
import { ESTIMATE_LOCATION_ENTITY_INFO } from '../containers/location/estimate-main-location-entity.class';
import { BasicsSharedCharacteristicDataEntityInfoFactory} from '@libs/basics/shared';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { ESTIMATE_LINE_ITEM_PARAMETER_INFO } from '../containers/line-item-parameters/estimate-line-item-parameters-entity-info.model';
import { ESTIMATE_MAIN_ROOT_ASSIGNMENT_ENTITY_INFO } from '../containers/root-assignment/estimate-main-root-assignment-entity-info.model';
import { ESTIMATE_LINE_ITEM_ENTITY_INFO } from '../containers/line-item/estimate-main-line-item-entity-info.class';
import { ESTIMATE_RESOURCE_ENTITY_INFO } from '../containers/resource/estimate-main-resource-entity-info.class';
import { ESTIMATE_MAIN_PRC_ITEM_ASSIGNMENT_ENTITY_INFO } from '../containers/prc-item-assignment/estimate-main-prc-item-assignment-entity-info.model';
import { EstimateMainService } from '../containers/line-item/estimate-main-line-item-data.service';
import { EstimateMainResourceService } from '../containers/resource/estimate-main-resource-data.service';
import { IEstResourceEntity} from '@libs/estimate/interfaces';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { ESTIMATE_MAIN_ACTIVITY_ENTITY_INFO } from '../containers/activity/estimate-main-activity-entity-info.model';
import { ESTIMATE_PRICE_ADJUSTMENT_ENTITY_INFO } from '../containers/price-adjustment/estimate-price-adjustment-entity-info.class';
import { ESTIMATE_MAIN_LINE_ITEM_QUANTITY_ENTITY_INFO } from '../containers/line-item-quantity/estimate-main-line-item-quantity-entity-info.model';
import { ESTIMATE_MAIN_CONTROLLING_CONTAINER_ENTITY_INFO } from '../containers/controlling-unit/estimate-main-controlling-container-entity-info.model';
import {ESTIMATE_MAIN_RULE_ENTITY_INFO} from '../containers/rule/est-main-rule-entity-info.model';
import { ESTIMATE_PRICE_ADJUSTMENT_TOTAL_ENTITY_INFO } from '../containers/price-adjustment-total/estimate-price-adjustment-total-entity-info.class';
import { ESTIMATE_MAIN_ALLOWANCE_AREA_ENTITY_INFO } from '../containers/allowance-area/estimate-main-allowance-area-entity-info.model';
import { ESTIMATE_MAIN_STANDARD_ALLOWANCES_ENTITY_INFO } from '../containers/allowance/estimate-main-standard-allowances-entity-info.model';
import { ESTIMATE_MAIN_TOTAL_ENTITY_INFO } from '../containers/total/estimate-main-total-entity-info.class';
import { ESTIMATE_MAIN_ASSEMBLY_RELATE_ENTITY_INFO } from '../containers/assembly-related/estimate-main-assembly-relate-entity-info.class';
import { ESTIMATE_MAIN_CONFIDENCE_CHECK_ENTITY_INFO } from '../containers/confidence-check/estimate-main-confidence-check-entity-info.model';
import { ESTIMATE_LINEITEM_SELECTION_STATEMENT_ENTITY_INFO } from '../containers/selection-statement/estimate-line-item-selection-statement-entity-info.class';
import {
	ESTIMATE_MAIN_STANDARD_ALLOWANCES_COST_CODE_DETAIL_ENTITY_INFO
} from '../containers/allowance-markup/estimate-main-standard-allowances-cost-code-detail-entity-info.model';
import {
	ESTIMATE_MAIN_COST_GROUP_ENTITY_INFO
} from '../containers/cost-group/estimate-main-cost-group-entity-info.model';
import { ESTIMATE_MAIN_WIC_BOQ_ENTITY_INFO } from '../containers/wic-boqs/estimate-main-wic-boq-entity-info';






/**
 * The module info object for the `estimate.main` content module.
 */
export class EstimateMainModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: EstimateMainModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): EstimateMainModuleInfo {
		if (!this._instance) {
			this._instance = new EstimateMainModuleInfo();
		}

		return this._instance;
	}

	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 *
	 * @return The internal module name.
	 */
	public override get internalModuleName(): string {
		return 'estimate.main';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			ESTIMATE_LINE_ITEM_ENTITY_INFO,
			ESTIMATE_MAIN_ACTIVITY_ENTITY_INFO,
			ESTIMATE_MAIN_ROOT_ASSIGNMENT_ENTITY_INFO,
			ESTIMATE_MAIN_ASSEMBLY_STRUCTURE_ENTITY_INFO,
			ESTIMATE_RESOURCE_ENTITY_INFO,
			ESTIMATE_MAIN_BOQ_ENTITY_INFO,
			ESTIMATE_MAIN_PRC_ITEM_ASSIGNMENT_ENTITY_INFO,
			ESTIMATE_MAIN_COST_GROUP_ASSIGNMENT_ENTITY_INFO,
			ESTIMATE_LOCATION_ENTITY_INFO,
			this.ESTIMATE_MAIN_CHAR1_DATA_ENTITY_INFO,
			this.ESTIMATE_MAIN_CHAR2_DATA_ENTITY_INFO,
			ESTIMATE_LINE_ITEM_PARAMETER_INFO,
			this.ESTIMATE_MAIN_RESOURCE_CHAR_DATA_ENTITY_INFO,
			ESTIMATE_PRICE_ADJUSTMENT_ENTITY_INFO,
            ESTIMATE_MAIN_LINE_ITEM_QUANTITY_ENTITY_INFO,
			ESTIMATE_MAIN_CONTROLLING_CONTAINER_ENTITY_INFO,
			ESTIMATE_MAIN_RULE_ENTITY_INFO,
			ESTIMATE_PRICE_ADJUSTMENT_TOTAL_ENTITY_INFO,
			ESTIMATE_MAIN_ALLOWANCE_AREA_ENTITY_INFO,
			ESTIMATE_MAIN_STANDARD_ALLOWANCES_ENTITY_INFO,
			ESTIMATE_MAIN_TOTAL_ENTITY_INFO,
			ESTIMATE_MAIN_ASSEMBLY_RELATE_ENTITY_INFO,
			ESTIMATE_MAIN_CONFIDENCE_CHECK_ENTITY_INFO,
			ESTIMATE_LINEITEM_SELECTION_STATEMENT_ENTITY_INFO,
			ESTIMATE_MAIN_STANDARD_ALLOWANCES_COST_CODE_DETAIL_ENTITY_INFO,
			ESTIMATE_MAIN_COST_GROUP_ENTITY_INFO,
			ESTIMATE_MAIN_WIC_BOQ_ENTITY_INFO,
		];
	}

	public override get preloadedTranslations(): string[] {
		return super.preloadedTranslations.concat(['boq.main', 'basics.characteristic','scheduling.main','estimate.parameter','estimate.rule','project.costcodes','project.main','cloud.common','project.material','basics.material','basics.costcodes','basics.clerk']);
	}

	private readonly ESTIMATE_MAIN_CHAR1_DATA_ENTITY_INFO: EntityInfo = BasicsSharedCharacteristicDataEntityInfoFactory.create<IEstLineItemEntity>({
		permissionUuid: '681223e37d524ce0b9bfa2294e18d650',
		containerUuid: 'e1b52e16cd0549f7b5707e3f0de534f4',
		sectionId: BasicsCharacteristicSection.Estimate1,
		parentServiceFn: (ctx) => {
			return ctx.injector.get(EstimateMainService);
		},
		pKey1Field: 'EstHeaderFk',
	});

	private readonly ESTIMATE_MAIN_CHAR2_DATA_ENTITY_INFO: EntityInfo = BasicsSharedCharacteristicDataEntityInfoFactory.create2<IEstLineItemEntity>({
		permissionUuid: '681223e37d524ce0b9bfa2294e18d650',
		containerUuid: 'e78e840150ce4a4b933d73772412e6eb',
		sectionId: BasicsCharacteristicSection.Estimate2,
		parentServiceFn: (ctx) => {
			return ctx.injector.get(EstimateMainService);
		},
		pKey1Field: 'EstHeaderFk',
	});

	private readonly ESTIMATE_MAIN_RESOURCE_CHAR_DATA_ENTITY_INFO: EntityInfo = BasicsSharedCharacteristicDataEntityInfoFactory.create<IEstResourceEntity>({
		permissionUuid: '9201bfe4297c4eb9bdf2bbca7d798148',
		sectionId: BasicsCharacteristicSection.EstimateResources,
		gridTitle: 'estimate.main.resourceCharacteristics',
		parentServiceFn: (ctx) => {
			return ctx.injector.get(EstimateMainResourceService);
		},
		pKey1Field: 'EstHeaderFk',
		pKey2Field: 'EstLineItemFk',
	});

	/**
	 * @brief Retrieves the container definitions including the BoqBlobSpecificationComponent.
	 *
	 * This method overrides the base class implementation to include an additional container definition,
	 * specifically the BoqBlobSpecificationComponent with its associated metadata and providers.
	 *
	 * @return An array of container definitions including the base and additional container definitions.
	 */
	// protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {   //  BoqBlobSpecificationComponent not ready
	// 	return super.containers.concat([
	// 		new ContainerDefinition({
	// 			containerType: BoqBlobSpecificationComponent,
	// 			title: 'estimate.main.boqSpecification',
	// 			uuid: '6248dfcf6a554714bf16eae61fea0c71',
	// 			permission: '681223e37d524ce0b9bfa2294e18d650', // TODO : Hide toolbar style editor
	// 			providers: [
	// 				{
	// 					provide: new EntityContainerInjectionTokens<IBlobStringEntity>().dataServiceToken,
	// 					useExisting: BoqBlobSpecificationDataService,
	// 				},
	// 			],
	// 		}),
	// 		ESTIMATE_MAIN_RULE_SCRIPT_OUTPUT_CONTAINER_DEFINITION,
	// 		ESTIMATE_MAIN_RULE_SCRIPT_CONTAINER_DEFINITION
	// 	]);
	// }
}
