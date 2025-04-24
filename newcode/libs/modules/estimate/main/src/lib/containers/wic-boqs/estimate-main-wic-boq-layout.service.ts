/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IBoqItemSimpleEntity } from '@libs/boq/main';
import { Injectable } from '@angular/core';
@Injectable({
	providedIn: 'root',
})
export class EstimateMainWicBoqLayoutService {
	public generateLayout(): ILayoutConfiguration<IBoqItemSimpleEntity>{
		return {
			suppressHistoryGroup: true,
			groups: [
				{
					'gid': 'basicData',
					'title': {
						'key': 'estimate.main.wicGroupContainer',
						'text': 'estimate.main.wicGroupContainer'
					},
					'attributes': [
						'IsChecked','Reference', 'Reference2', 'BriefInfo', 'BoqDivisionTypeFk',  'BasUomFk', 'PrjCharacter', 'WorkContent', 'BoqItemFlagFk',
						'BoqLineTypeFk','Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5'
					],

				}
			],
			overloads: {
				Reference:{readonly:true},
				Reference2:{readonly:true},
				BriefInfo:{readonly:true},
				PrjCharacter:{readonly:true},
				WorkContent:{readonly:true},
				Userdefined1:{readonly:true},
				Userdefined2:{readonly:true},
				Userdefined3:{readonly:true},
				Userdefined4:{readonly:true},
				Userdefined5:{readonly:true},
				BasUomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
				//BoqDivisionTypeFk TODO Wait boqDivisionTypeLookupDataService lookup support -- Jun
				//BoqItemFlagFk TODO Wait boqMainItemFlagLookupDataService lookup support -- Jun
				//BoqLineTypeFk TODO Wait boqLineTypeLookupDataService lookup support -- Jun
			},
			labels: {
				...prefixAllTranslationKeys('boq.main.', {
					Reference: {key: 'Reference'},
					Reference2: {key: 'Reference2'},
					BriefInfo: {key: 'BriefInfo'},
					PrjCharacter: {key: 'PrjCharacter'},
					WorkContent: {key: 'WorkContent'},
					Userdefined1: {key: 'Userdefined1'},
					Userdefined2: {key: 'Userdefined2'},
					Userdefined3: {key: 'Userdefined3'},
					Userdefined4: {key: 'Userdefined4'},
					Userdefined5: {key: 'Userdefined5'},
					BasUomFk: {key: 'BasUomFk'},
					BoqDivisionTypeFk: {key: 'BoqDivisionTypeFk'},
					BoqItemFlagFk: {key: 'BoqItemFlagFk'},
					BoqLineTypeFk: {key: 'BoqLineTypeFk'},
				}),
				...prefixAllTranslationKeys('basics.material.', {
					IsChecked: {
						key: 'record.filter',
						text: 'filter',
					},
				}),
			},
			transientFields: [
				{
					id: 'IsChecked',
					readonly: false,
					model: 'IsChecked',
					type: FieldType.Radio,
					pinned: true,
				},
			],
		};
	}
}