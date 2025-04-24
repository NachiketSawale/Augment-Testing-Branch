/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ControllingControllingunittemplateUnitBehavior } from '../behaviors/controlling-controllingunittemplate-unit-behavior.service';
import { ControllingControllingunittemplateUnitDataService } from '../services/controlling-controllingunittemplate-unit-data.service';
import { IControltemplateUnitEntity } from './models';
import { prefixAllTranslationKeys } from '@libs/platform/common';


export const CONTROLLING_CONTROLLINGUNITTEMPLATE_UNIT_ENTITY_INFO: EntityInfo = EntityInfo.create<IControltemplateUnitEntity>({
	grid: {
		title: {key: 'controlling.controllingunittemplate' + '.controllingunitListTitle'},
		behavior: ctx => ctx.injector.get(ControllingControllingunittemplateUnitBehavior),
		containerUuid: '0f64dd41abe541a5ba4470f605373b2c',
	},
	dataService: ctx => ctx.injector.get(ControllingControllingunittemplateUnitDataService),
	dtoSchemeId: {moduleSubModule: 'Controlling.ControllingUnitTemplate', typeName: 'ControltemplateUnitDto'},
	permissionUuid: '201b468b575042a090e366d830c5a60d',
	layoutConfiguration: {
		groups: [
			{
				gid: 'Basic Data', attributes: ['Code', 'DescriptionInfo', 'UomFk', 'IsBillingElement', 'IsAccountingElement', 'IsAssetmanagement',
					'IsDefault', 'IsFixedBudget', 'IsIntercompany', 'IsLive', 'IsPlanningElement',
					'IsPlantmanagement', 'IsStockmanagement', 'IsTimekeepingElement', 'UserDefined1',
					'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5']
			},
		],
		overloads: {

			Code: {label: {text: 'Code', key: 'Code'}, visible: true},
			DescriptionInfo: {label: {text: 'Description', key: 'Description'}, visible: true},
			UomFk: {label: {text: 'UomFk', key: 'UoM'}, visible: true},
			IsBillingElement: {label: {text: 'Is Accounting', key: 'IsAccountingElement'}, readonly: true, visible: true},
			IsAccountingElement: {label: {text: 'Is Accounting', key: 'IsAccountingElement'}, readonly: true, visible: true},
			IsAssetmanagement: {label: {text: 'Is Assetmanagement', key: 'IsAssetmanagement'}, readonly: true, visible: true},
			IsDefault: {label: {text: 'Is Default', key: 'IsDefault'}, readonly: true, visible: true},
			IsFixedBudget: {label: {text: 'Is Fixed Budget', key: 'IsFixedBudget'}, readonly: true, visible: true},
			IsIntercompany: {label: {text: 'Is Intercompany', key: 'IsIntercompany'}, readonly: true, visible: true},
			IsLive: {label: {text: 'Is Live', key: 'IsLive'}, readonly: true, visible: true},
			IsPlanningElement: {label: {text: 'Is Planning', key: 'IsPlanningElement'}, readonly: true, visible: true},
			IsPlantmanagement: {label: {text: 'Is Plantmanagement', key: 'IsPlantmanagement'}, readonly: true, visible: true},
			IsStockmanagement: {label: {text: 'Is Stockmanagement', key: 'IsStockmanagement'}, readonly: true, visible: true},
			IsTimekeepingElement: {label: {text: 'Is Timekeeping', key: 'IsTimekeepingElement'}, readonly: true, visible: true},
			UserDefined1: {label: {text: 'User Defined 1', key: 'UserDefined1'}, visible: true},
			UserDefined2: {label: {text: 'User Defined 2', key: 'UserDefined2'}, visible: true},
			UserDefined3: {label: {text: 'User Defined 3', key: 'UserDefined3'}, visible: true},
			UserDefined4: {label: {text: 'User Defined 4', key: 'UserDefined4'}, visible: true},
			UserDefined5: {label: {text: 'User Defined 5', key: 'UserDefined5'}, visible: true},
		},
		labels: {
			...prefixAllTranslationKeys('controlling.controllingunittemplate.', {
				Code: {key: 'Code'},
				DescriptionInfo: {key: 'Description'},
				UomFk: {key: 'UomFk'},
				IsAccountingElement: {key: 'IsAccountingElement'},
				IsBillingElement: {key: 'IsBillingElement'},
				IsAssetmanagement: {key: 'IsAssetmanagement'},
				IsDefault: {key: 'IsDefault'},
				IsFixedBudget: {key: 'IsFixedBudget'},
				IsIntercompany: {key: 'IsIntercompany'},
				IsLive: {key: 'IsLive'},
				IsPlanningElement: {key: 'IsPlanningElement'},
				IsPlantmanagement: {key: 'IsPlantmanagement'},
				IsStockmanagement: {key: 'IsStockmanagement'},
				IsTimekeepingElement: {key: 'IsTimekeepingElement'},
				UserDefined1: {key: 'UserDefined1'},
				UserDefined2: {key: 'UserDefined2'},
				UserDefined3: {key: 'UserDefined3'},
				UserDefined4: {key: 'UserDefined4'},
				UserDefined5: {key: 'UserDefined5'},
			}),
		},

	}
});