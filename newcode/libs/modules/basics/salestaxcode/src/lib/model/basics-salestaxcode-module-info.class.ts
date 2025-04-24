/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { BASICS_SALES_TAX_CODE_ENTITY_INFO } from '../sales-tax-code/basics-sales-tax-code-entity-info.model';
import { BASICS_SALES_TAX_CODE_MATRIX_ENTITY_INFO } from '../matrix/basics-sales-tax-code-matrix-entity-info.model';

/**
 * Basics Sales Tax Code Module Info
 */
export class BasicsSalestaxcodeModuleInfo extends BusinessModuleInfoBase {
	
	public static readonly instance = new BasicsSalestaxcodeModuleInfo();

	private constructor() {
		super();
	}

	public override get internalModuleName(): string {
		return 'basics.salestaxcode';
	}

	public override get internalPascalCasedModuleName(): string {
		return 'Basics.SalesTaxCode';
	}

	public override get entities(): EntityInfo[] {
		return [
			BASICS_SALES_TAX_CODE_ENTITY_INFO,
			BASICS_SALES_TAX_CODE_MATRIX_ENTITY_INFO
		];
	}

	/**
	 * Return the translation container UUID for the sales tax code module.
	 */
    protected override get translationContainer(): string | undefined {
        return 'ae242a42d7544b62b07256cd01bd33e3';
    }
}
