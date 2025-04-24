/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { BASICS_TAX_CODE_ENTITY_INFO } from '../tax-code/basics-tax-code-entity-info.model';
import { BASICS_TAX_CODE_MATRIX_ENTITY_INFO } from '../matrix/basics-tax-code-matrix-entity-info.model';

/**
 * Basics Tax Code Module Info
 */
export class BasicsTaxCodeModuleInfo extends BusinessModuleInfoBase {
    
    public static readonly instance = new BasicsTaxCodeModuleInfo();

    private constructor(){
		super();
	}

	/**
     * Loads the translation file used for basics tax code module and basics costcodes module.
     */
    public override get preloadedTranslations(): string[] {
        return [
            ...super.preloadedTranslations,
            'basics.costcodes'
        ];
    }
    
    public override get internalModuleName(): string {
        return 'basics.taxcode';
    }

	/**
	 * Returns the module identifier in PascalCase.
	 */
	 public override get internalPascalCasedModuleName(): string {
		  return 'Basics.TaxCode';
	 }

    public override get entities(): EntityInfo[] {
        return [
					BASICS_TAX_CODE_ENTITY_INFO,
					BASICS_TAX_CODE_MATRIX_ENTITY_INFO
				];
    }

	/**
     * Returns the translation container uuid for the basics tax code module.
     */
    protected override get translationContainer(): string | undefined {
        return '8366ed5d81084a079789a5987c2ce3c4';
			
	}

}
