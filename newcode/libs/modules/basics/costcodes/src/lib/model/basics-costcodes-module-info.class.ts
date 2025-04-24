/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, DataTranslationGridComponent, EntityInfo } from '@libs/ui/business-base';
import { BASICS_COST_CODES_ENTITY_INFO } from './basics-cost-codes-entity-info.model';
import { BASICS_COST_CODES_PRICE_VERSION_ENTITY_INFO } from './basics-cost-codes-price-version-entity-info.model';
import { BASICS_COST_CODES_PRICE_VERSION_RECORD_ENTITY_INFO } from './basics-cost-codes-price-version-record-entity-info.model';
import { BASICS_COST_CODES_PRICE_VERSION_COMPANY_ENTITY_INFO } from './basics-cost-codes-price-version-company-entity-info.model';
import { BASICS_COST_CODES_COMPANY_ENTITY_INFO } from './basics-cost-codes-company-entity-info.model';
import { BASICS_COST_CODES_REFERENCES_ENTITY_INFO } from './basics-cost-codes-references-entity-info.model';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsCostCodesDataService } from '../services/data-service/basics-cost-codes-data.service';
import { ContainerDefinition, ContainerTypeRef, IContainerDefinition } from '@libs/ui/container-system';

import { BASICS_COST_CODES_RES_TYPE_ENTITY_INFO } from './basics-cost-codes-res-type-entity-info.model';


/**
 * The module info object for the `basics.costcodes` content module.
 */
export class BasicsCostcodesModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: BasicsCostcodesModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): BasicsCostcodesModuleInfo {
		if (!this._instance) {
			this._instance = new BasicsCostcodesModuleInfo();
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
		return 'basics.costcodes';
	}

    public override get internalPascalCasedModuleName(): string {
		return 'Basics.CostCodes';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [BASICS_COST_CODES_ENTITY_INFO, BASICS_COST_CODES_PRICE_VERSION_ENTITY_INFO, BASICS_COST_CODES_PRICE_VERSION_RECORD_ENTITY_INFO,BASICS_COST_CODES_PRICE_VERSION_COMPANY_ENTITY_INFO, BASICS_COST_CODES_REFERENCES_ENTITY_INFO,BASICS_COST_CODES_COMPANY_ENTITY_INFO,this.basicsCharacteristicDataEntityInfo, BASICS_COST_CODES_RES_TYPE_ENTITY_INFO];
	}

    /**
	 * @brief Creates and initializes the basics characteristic data entity information.
	 *
	 * This private readonly property holds the basics characteristic data entity information,
 	*/
	private readonly basicsCharacteristicDataEntityInfo: EntityInfo = BasicsSharedCharacteristicDataEntityInfoFactory.create({
        permissionUuid: 'dc72e4cf73694079a9856076bffe5731',
        sectionId:BasicsCharacteristicSection.CostCodes,
        parentServiceFn: (ctx) => {
            return ctx.injector.get(BasicsCostCodesDataService);
        },
    });

     /**
	 * Loads the translation file used for logistic sundryservice
	 */
	public override get preloadedTranslations(): string[] {
		return [
			this.internalModuleName, 'basics.characteristic'
		];
	}

	/**
 	* @brief Gets the container definitions, including the language container configuration.
	 * This method overrides the base class implementation to include a new container definition
 	* @return An array of ContainerDefinition objects including the language container configuration.
 	*/
	protected override get containers(): (ContainerDefinition | IContainerDefinition)[]{
		const languageConatinerConfiguration : IContainerDefinition = {
			uuid : '70d04bf9abd64349a824f0f452ce0ac4',
			title: { key: 'basics.costcodes.translation' },
			containerType: DataTranslationGridComponent as ContainerTypeRef
		};
		return [...super.containers, new ContainerDefinition(languageConatinerConfiguration)];
	}


}
