/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { ILogisticSundryServiceGroupEntity } from './logistic-sundry-service-group-entity.interface';
import { ILogisticSundryServiceGroupAccountEntity } from './logistic-sundry-service-group-account-entity.interface';
import { ILogisticSundryGroupTaxCodeEntity } from './logistic-sundry-service-group-tax-code-entity.interface';

export interface ILogisticSundryServiceGroupComplete extends CompleteIdentification<ILogisticSundryServiceGroupEntity> {
	SundryServiceGroupId: number;
	SundryServiceGroups: ILogisticSundryServiceGroupEntity[] | null;
	AccountsToSave: ILogisticSundryServiceGroupAccountEntity[] | null;
	AccountsToDelete: ILogisticSundryServiceGroupAccountEntity[] | null;
	TaxCodeToSave: ILogisticSundryGroupTaxCodeEntity[] | null;
	TaxCodeToDelete: ILogisticSundryGroupTaxCodeEntity[] | null;
}
