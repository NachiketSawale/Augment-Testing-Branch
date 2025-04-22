/*
 * Copyright(c) RIB Software GmbH
 */

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import {
	ENTITY_DEFAULT_GROUP_ID,
	EntityInfo
} from '@libs/ui/business-base';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { PROPERTY_KEY_LOOKUP_PROVIDER_TOKEN, PROPERTY_KEY_TAG_HELPER_TOKEN } from '@libs/model/interfaces';
import { IModelImportPropertyKeyRuleEntity } from './entities/entities';
import { ModelAdministrationModelImportPropertyKeyRuleDataService } from '../services/model-import-property-key-rule-data.service';

export const MODEL_IMPORT_PROPERTY_KEY_RULE_ENTITY_INFO = EntityInfo.create<IModelImportPropertyKeyRuleEntity>({
	dtoSchemeId: {
		moduleSubModule: 'Model.Administration',
		typeName: 'ModelImportPropertyKeyRuleDto'
	},
	grid: {
		title: {key: 'model.administration.modelImport.importPkRuleListTitle'}
	},
	form: {
		title: {key: 'model.administration.modelImport.importPkRuleDetailTitle'},
		containerUuid: 'f21727ad8b4b4b5b9b22330d600fb3fb'
	},
	permissionUuid: 'd0bad362f2c34cec9a1bf934d064ff89',
	dataService: ctx => ctx.injector.get(ModelAdministrationModelImportPropertyKeyRuleDataService),
	layoutConfiguration: async ctx => {
		const pkLookupProvider = await ctx.lazyInjector.inject(PROPERTY_KEY_LOOKUP_PROVIDER_TOKEN);
		const pkTagHelper = await ctx.lazyInjector.inject(PROPERTY_KEY_TAG_HELPER_TOKEN);

		return <ILayoutConfiguration<IModelImportPropertyKeyRuleEntity>>{
			groups: [{
				gid: ENTITY_DEFAULT_GROUP_ID,
				attributes: ['DescriptionInfo', 'Sorting', 'StopProcessing']
			}, {
				gid: 'patternsGroup',
				attributes: ['PatternTypeFk', 'NamePattern', 'ValueTypePattern', 'ValuePattern']
			}, {
				gid: 'outputGroup',
				attributes: ['Suppress', 'NewName', 'NewValueType', 'PropertyKeyNewFk', 'ValueTypeNewFk', 'BaseValueTypeNewFk', 'PkTagIds', 'NewValue', 'UomFk']
			}],
			overload: {
				PatternTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideModelImportPatternTypeLookupOverload(false),
				PropertyKeyNewFk: (await pkLookupProvider).generatePropertyKeyLookup({
					showClearButton: true
				}),
				ValueTypeNewFk: BasicsSharedCustomizeLookupOverloadProvider.provideModelValueTypeLookupOverload(true),
				BaseValueTypeNewFk: BasicsSharedCustomizeLookupOverloadProvider.provideModelBaseValueTypeLookupOverload(true),
				PkTagIds: pkTagHelper.generateTagsFieldOverload(),
				UomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true)
			},
			labels: prefixAllTranslationKeys('model.administration.', {
				StopProcessing: 'stopProcessing',
				patternsGroup: 'patternsGroup',
				PatternTypeFk: 'patternType',
				NamePattern: 'namePattern',
				ValueTypePattern: 'vtPattern',
				ValuePattern: 'valuePattern',
				outputGroup: 'outputGroup',
				Suppress: 'suppress',
				NewName: 'newAttrName',
				NewValueType: 'newValueTypeName',
				PropertyKeyNewFk: 'newPropKey',
				ValueTypeNewFk: 'newValueType',
				BaseValueTypeNewFk: 'newBaseValueType',
				PkTagIds: 'rulePkTagIds',
				NewValue: 'newValue',
				UomFk: 'uomfk'
			})
		};
	}
});
