/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityForeignKeys, FkToNavigationTarget, NavigationTarget } from '@libs/ui/common';
import { isArray } from 'lodash';

/**
 * Provides mapping of entity keys to navigatable modules.
 */
export class EntityKeyNavigationMapping {
	private mapping: FkToNavigationTarget = {
		'ProjectFk': {internalModuleName: 'project.main', translationKey: 'ui.business-base.navigator.project'},
		'PrjProjectFk': 'ProjectFk',
		'ClerkFk': {internalModuleName: 'basics.clerk', translationKey: 'ui.business-base.navigator.clerk'},
		'OwnerId': 'ClerkFk',
		'CompanyId': {internalModuleName: 'basics.company', translationKey: 'ui.business-base.navigator.company'},
		'ModelFk': [
			{internalModuleName: 'model.main', translationKey: 'ui.business-base.navigator.modelMain'},
			{internalModuleName: 'model.annotation', translationKey: 'ui.business-base.navigator.modelAnnotation'}],

		'Model_Fk': 'ModelFk', //Defines an alias for entity key.
		'BusinessPartnerFk': {internalModuleName: 'businesspartner.main', translationKey: 'ui.business-base.navigator.businessPartner'},
		'BpdBusinessPartnerFk': 'BusinessPartnerFk',
		'MaterialCatalogFk': {internalModuleName: 'basics.materialcatalog', translationKey: 'ui.business-base.navigator.materialCatalog'},
		'PackageFk': {internalModuleName: 'procurement.package', translationKey: 'ui.business-base.navigator.package'},
		'PrcPackageFk': 'PackageFk',
		'ReqHeaderFk': {internalModuleName: 'procurement.requisition', translationKey: 'ui.business-base.navigator.reqHeader'},
		'RfqHeaderFk': {internalModuleName: 'procurement.rfq', translationKey: 'ui.business-base.navigator.rfqHeader'},
		'QtnHeaderFk': {internalModuleName: 'procurement.quote', translationKey: 'ui.business-base.navigator.qtnHeader'},
		'ConHeaderFk': {internalModuleName: 'procurement.contract', translationKey: 'ui.business-base.navigator.conHeader'},
		'PesHeaderFk': {internalModuleName: 'procurement.pes', translationKey: 'ui.business-base.navigator.pesHeader'},
		'InvHeaderFk': {internalModuleName: 'procurement.invoice', translationKey: 'ui.business-base.navigator.invHeader'},
		'WipHeaderFk': {internalModuleName: 'sales.wip', translationKey: 'ui.business-base.navigator.wipHeader'},
		'BilHeaderFk': {internalModuleName: 'sales.billing', translationKey: 'ui.business-base.navigator.bilHeader'},
		'QtoHeaderFk': {internalModuleName: 'qto.main', translationKey: 'ui.business-base.navigator.qtoHeader'},
		'EstHeaderFk': {internalModuleName: 'estimate.main', translationKey: 'ui.business-base.navigator.estHeader'},
		'ControllingUnitFk': {internalModuleName: 'controlling.structure', translationKey: 'ui.business-base.navigator.controllingUnit'},
		'MdcControllingUnitFk': 'ControllingUnitFk',
		'MdcMaterialCatalogFk': 'MaterialCatalogFk',
		'PrcStructureFk': {internalModuleName: 'basics.procurementstructure', translationKey: 'ui.business-base.navigator.prcStructure'},
		'CertificateFk': {internalModuleName: 'businesspartner.certificate', translationKey: 'ui.business-base.navigator.certificate'},
		'BpdCertificateFk': 'CertificateFk',
		'ContactFk': {internalModuleName: 'businesspartner.contact', translationKey: 'ui.business-base.navigator.contact'},
		'BpdContactFk': 'ContactFk',
		'JobFk': {internalModuleName: 'logistic.job', translationKey: 'ui.business-base.navigator.job'},
		'LgmJobFk': 'JobFk',
		'DispatchHeaderFk': {internalModuleName: 'logistic.dispatching', translationKey: 'ui.business-base.navigator.dispatchHeader'},
		'LgmDispatchHeaderFk': 'DispatchHeaderFk',
		'ChangeFk': {internalModuleName: 'change.main', translationKey: 'ui.business-base.navigator.change'},
		'PrjChangeFk': 'ChangeFk',
		'SettlementFk': {internalModuleName: 'logistic.settlement', translationKey: 'ui.business-base.navigator.settlement'},
		'LgmSettlementFk': 'SettlementFk'
	};

	/**
	 * Returns navigation information for the entity key.
	 * @param key
	 * @returns Navigation information
	 */
	public getNavigationTarget(key: EntityForeignKeys): NavigationTarget | NavigationTarget[] {

		const mapEntry = this.mapping[key];
		if (!isNavigationTargetArr(mapEntry)) {
			return this.getNavigationTarget(mapEntry);
		}

		return mapEntry;
	}
}

/**
 * Typeguard function to check if an item is navigation target or an entity key.
 * @param item A navigation target object or an array of navigation target or an entity key.
 * @returns A boolean true if item is navigation target.
 */
function isNavigationTargetArr(item: NavigationTarget[] | NavigationTarget | EntityForeignKeys): item is NavigationTarget | NavigationTarget[] {
	if (isArray(item)) {
		return true;
	}

	return Object.keys(item).includes('internalModuleName');
}