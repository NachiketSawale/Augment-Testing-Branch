/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { BASICS_PAYMENT_TERM_ENTITY_INFO } from '../payment-term/basics-payment-term-entity-info.model';

export class BasicsPaymentModuleInfo extends BusinessModuleInfoBase {
	public static readonly instance = new BasicsPaymentModuleInfo();

	/**
	 * Make module info class singleton
	 * @private
	 */
	private constructor() {
		super();
	}

	public override get internalModuleName(): string {
		return 'basics.payment';
	}

	public override get internalPascalCasedModuleName(): string {
		return 'Basics.Payment';
	}

	/**
	 * Loads the translation file used for workflow main
	 */
	public override get preloadedTranslations(): string[] {
		return [this.internalModuleName, 'cloud.common'];
	}

	public override get entities(): EntityInfo[] {
		return [BASICS_PAYMENT_TERM_ENTITY_INFO];
	}

	/**
	 * Returns the translation container uuid for basics payment module.
	 */
	protected override get translationContainer(): string | undefined {
		return '162414311ae94f1a9e0d92d9ff731ec1';
	}
}
