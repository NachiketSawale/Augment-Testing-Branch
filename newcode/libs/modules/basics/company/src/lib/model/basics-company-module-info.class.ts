/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo} from '@libs/ui/business-base';
import { BASICS_COMPANY_CATEGORY_ENTITY_INFO } from './basics-company-category-entity-info.model';
import { BASICS_COMPANY_CLERK_ENTITY_INFO } from './basics-company-clerk-entity-info.model';
import { BASICS_COMPANY2_BAS_CLERK_ENTITY_INFO } from './basics-company2-bas-clerk-entity-info.model';
import { BASICS_COMPANY_TEXT_MODULE_ENTITY_INFO } from './basics-company-text-module-entity-info.model';
import { BASICS_COMPANY_SURCHARGE_ENTITY_INFO } from './basics-company-surcharge-entity-info.model';
import { BASICS_COMPANY_YEAR_ENTITY_INFO } from './basics-company-year-entity-info.model';
import { BASICS_COMPANY_PERIODS_ENTITY_INFO } from './basics-company-periods-entity-info.model';
import { BASICS_COMPANY_URL_ENTITY_INFO } from './basics-company-url-entity-info.model';
import { BASICS_COMPANY_TRANSHEADER_ENTITY_INFO } from './basics-company-transheader-entity-info.model';
import { BASICS_COMPANY_DEFERALTYPE_ENTITY_INFO } from './basics-company-deferaltype-entity-info.model';
import { BASICS_COMPANY_CREATE_ROLE_ENTITY_INFO } from './basics-company-create-role-entity-info.model';
import { BASICS_COMPANY_CONTROLLING_GROUP_DETAIL_ENTITY_INFO } from './basics-company-controlling-group-detail-entity-info.model';
import { BASICS_COMPANY_TRS_CONFIG_ENTITY_INFO } from './basics-company-trs-config-entity-info.model';
import { BASICS_COMPANY_DEBTOR_ENTITY_INFO } from './basics-company-debtor-entity-info.model';
import { BASICS_COMPANY_TIMEKEEPING_GROUP_ENTITY_INFO } from './basics-company-timekeeping-group-entity-info.model';
import { BASICS_COMPANY_ICCU_ENTITY_INFO } from './basics-company-iccu-entity-info.model';
import { BASICS_COMPANY_ICPARTNER_CARD_ENTITY_INFO } from './basics-company-icpartner-card-entity-info.model';
import { BASICS_COMPANY_ICPARTNER_ACC_ENTITY_INFO } from './basics-company-icpartner-acc-entity-info.model';
import { BASICS_COMPANY_STOCK_EVALUATION_RULE_ENTITY_INFO } from './basics-company-stock-evaluation-rule-entity-info.model';
import { BASICS_COMPANY_TRANSACTION_ENTITY_INFO } from './basics-company-transaction-entity-info.model';
import { BASICS_COMPANY_MAIN_ENTITY_INFO } from './basics-company-main-entity-info.model';


/**
 * The module info object for the `basics.company` content module.
 */
export class BasicsCompanyModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: BasicsCompanyModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): BasicsCompanyModuleInfo {
		if (!this._instance) {
			this._instance = new BasicsCompanyModuleInfo();
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
		return 'basics.company';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ BASICS_COMPANY_MAIN_ENTITY_INFO, BASICS_COMPANY_CATEGORY_ENTITY_INFO, BASICS_COMPANY_CLERK_ENTITY_INFO, BASICS_COMPANY2_BAS_CLERK_ENTITY_INFO, BASICS_COMPANY_TEXT_MODULE_ENTITY_INFO, BASICS_COMPANY_SURCHARGE_ENTITY_INFO, BASICS_COMPANY_YEAR_ENTITY_INFO, BASICS_COMPANY_PERIODS_ENTITY_INFO, BASICS_COMPANY_URL_ENTITY_INFO, BASICS_COMPANY_TRANSHEADER_ENTITY_INFO, BASICS_COMPANY_DEFERALTYPE_ENTITY_INFO, BASICS_COMPANY_CREATE_ROLE_ENTITY_INFO, BASICS_COMPANY_CONTROLLING_GROUP_DETAIL_ENTITY_INFO, BASICS_COMPANY_TRS_CONFIG_ENTITY_INFO, BASICS_COMPANY_DEBTOR_ENTITY_INFO, BASICS_COMPANY_TIMEKEEPING_GROUP_ENTITY_INFO, BASICS_COMPANY_ICCU_ENTITY_INFO, BASICS_COMPANY_ICPARTNER_CARD_ENTITY_INFO, BASICS_COMPANY_STOCK_EVALUATION_RULE_ENTITY_INFO, BASICS_COMPANY_ICPARTNER_ACC_ENTITY_INFO, BASICS_COMPANY_TRANSACTION_ENTITY_INFO, ];
	}
}
