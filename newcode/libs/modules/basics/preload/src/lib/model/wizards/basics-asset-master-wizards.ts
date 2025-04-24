/*
 * Copyright(c) RIB Software GmbH
 */
import { IWizard } from '@libs/platform/common';
export const BASICS_ASSET_MASTER_WIZARDS: IWizard[] =
	[
		{
			uuid: '28ef5ac6d79a43449fa9f0a5b4d52379',
			name: 'Disable Record',
			execute: context => {
				return import('@libs/basics/assetmaster').then((m) => context.injector.get(m.BasicsAssetMasterDisableWizard).onStartDisableWizard());
			}
		},
		{
			uuid: '42c90587057c4decb67099b9b0acb911',
			name: 'Enable Record',
			execute: context => {
				return import('@libs/basics/assetmaster').then((m) => context.injector.get(m.BasicsAssetMasterEnableWizard).onStartEnableWizard());
			}
		},
    ];
