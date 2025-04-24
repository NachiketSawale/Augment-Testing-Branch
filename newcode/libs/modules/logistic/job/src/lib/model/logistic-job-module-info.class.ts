/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { LOGISTIC_JOB_DOCUMENT_ENTITY_INFO } from './logistic-job-document-entity-info.model';
import { LOGISTIC_JOB_EQUIPMENT_CAT_PRICE_ENTITY_INFO } from './logistic-job-equipment-cat-price-entity-info.model';
import { LOGISTIC_JOB_MATERIAL_CAT_PRICE_ENTITY_INFO } from './logistic-job-material-cat-price-entity-info.model';
import { LOGISTIC_JOB_PRJ2_MATERIAL_ENTITY_INFO } from './logistic-job-prj2-material-entity-info.model';
import { LOGISTIC_JOB_PRJ2_MATERIAL_PRICE_CONDITION_ENTITY_INFO } from './logistic-job-prj2-material-price-condition-entity-info.model';
import { LOGISTIC_JOB_MATERIAL_RATE_ENTITY_INFO } from './logistic-job-material-rate-entity-info.model';
import { LOGISTIC_JOB_COST_CODE_RATE_ENTITY_INFO } from './logistic-job-cost-code-rate-entity-info.model';
import { LOGISTIC_JOB_PLANT_PRICE_ENTITY_INFO } from './logistic-job-plant-price-entity-info.model';
import { LOGISTIC_JOB_SUNDRY_SERVICE_PRICE_ENTITY_INFO } from './logistic-job-sundry-service-price-entity-info.model';
import { LOGISTIC_JOB_PLANT_ALLOCATION_ENTITY_INFO } from './logistic-job-plant-allocation-entity-info.model';
import { LOGISTIC_JOB_TASK_ENTITY_INFO } from './logistic-job-task-entity-info.model';
import { LOGISTIC_JOB_FORM_DATA_ENTITY_INFO } from './logistic-job-form-data-entity-info.model';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { DrawingContainerDefinition } from '@libs/model/shared';
import { LOGISTIC_JOB_ENTITY_INFO } from './logistic-job-entity-info.model';

/**
 * The module info object for the `logistic.job` content module.
 */
export class LogisticJobModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: LogisticJobModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): LogisticJobModuleInfo {
		if (!this._instance) {
			this._instance = new LogisticJobModuleInfo();
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
		return 'logistic.job';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			LOGISTIC_JOB_ENTITY_INFO,
			LOGISTIC_JOB_DOCUMENT_ENTITY_INFO,
			LOGISTIC_JOB_EQUIPMENT_CAT_PRICE_ENTITY_INFO,
			LOGISTIC_JOB_MATERIAL_CAT_PRICE_ENTITY_INFO,
			LOGISTIC_JOB_PRJ2_MATERIAL_ENTITY_INFO,
			LOGISTIC_JOB_PRJ2_MATERIAL_PRICE_CONDITION_ENTITY_INFO,
			LOGISTIC_JOB_MATERIAL_RATE_ENTITY_INFO,
			LOGISTIC_JOB_COST_CODE_RATE_ENTITY_INFO,
			LOGISTIC_JOB_PLANT_PRICE_ENTITY_INFO,
			LOGISTIC_JOB_SUNDRY_SERVICE_PRICE_ENTITY_INFO,
			LOGISTIC_JOB_PLANT_ALLOCATION_ENTITY_INFO,
			LOGISTIC_JOB_TASK_ENTITY_INFO,
			LOGISTIC_JOB_FORM_DATA_ENTITY_INFO
			//TODO: logistic.job.comment - The common working standard is not available yet in other modules
			//TODO: logistic.job.remark - The container is not available and have to be generic for other modules to use
			//TODO: logistic.job.deliveryAddressRemark - The data services are not specifying which kind of that are (ex-Node,Leaf etc)
			//TODO: logistic.job.deliveryAddressBlob - The data services are not specifying which kind of that are (ex-Node,Leaf etc)
			//TODO: object.job.documents.project.document.detail - he data services are not specifying which kind of that are (ex-Node,Leaf etc)
			//TODO: logistic.job.plantLocationDetailTitle - resourceCommonPlantJobLocationFactory is not available
			//TODO: logistic.job.plantLocationListTitle - resourceCommonPlantJobLocationFactory is not available
		];
	}

	/**
	 * @brief Gets the container definitions, including the PDF Viewer container configuration.
	 * This method overrides the base class implementation to include a new container definition
	 * @return An array of ContainerDefinition objects including the PDF Viewer container configuration.
	 */
	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([
			DrawingContainerDefinition.createPDFViewer({
				uuid: 'a44b1be797934e3d9df187c0452efbaf',
			}),
		]);
	}
}
