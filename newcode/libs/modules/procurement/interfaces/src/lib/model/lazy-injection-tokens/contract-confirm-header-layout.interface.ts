/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectionToken } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { IConHeaderEntity } from '../entities/contract/con-header-entity.interface';

/**
 * To get the layout configuration for  contract confirm header wizard
 */
export interface IContractConfirmHeaderLayout {
	generateLayout(isContractApproval:boolean): Promise<ILayoutConfiguration<IConHeaderEntity>>
}

export const CONTRACT_CONFIRM_HEADER_LAYOUT_SERVICE = new LazyInjectionToken<IContractConfirmHeaderLayout>('con-confirm-header-layout');

