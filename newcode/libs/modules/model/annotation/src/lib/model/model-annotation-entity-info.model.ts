/*
 * Copyright(c) RIB Software GmbH
 */

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { ENTITY_DEFAULT_GROUP_ID, EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { PROJECT_LOOKUP_PROVIDER_TOKEN } from '@libs/project/interfaces';
import { MODEL_LOOKUP_PROVIDER_TOKEN } from '@libs/model/interfaces';
import { IModelAnnotationEntity } from './entities/model-annotation-entity.interface';
import { ModelAnnotationDataService } from '../services/model-annotation-data.service';

export const ANNOTATION_ENTITY_INFO = EntityInfo.create<IModelAnnotationEntity>({
	dtoSchemeId: {moduleSubModule: 'Model.Annotation', typeName: 'ModelAnnotationDto'},
	grid: {
		title: {key: 'model.annotation.modelAnnotationListTitle'}
	},
	form: {
		containerUuid: '67e8894374e74eb29664b1182253323c',
		title: {key: 'model.annotation.modelAnnotationDetailTitle'}
	},
	permissionUuid: '0a5454bc99c24a539dc1264262096b8c',
	dataService: ctx => ctx.injector.get(ModelAnnotationDataService),
	layoutConfiguration: async ctx => {
		const [
			pjLookupProvider,
			mdlLookupProvider
		] = await Promise.all([
			ctx.lazyInjector.inject(PROJECT_LOOKUP_PROVIDER_TOKEN),
			ctx.lazyInjector.inject(MODEL_LOOKUP_PROVIDER_TOKEN)
		]);

		return <ILayoutConfiguration<IModelAnnotationEntity>>{
			fid: 'model.annotation.modelAnnotationForm',
			groups: [{
				gid: 'contextGroup',
				attributes: ['Projectfk', 'Modelfk']
			}, {
				gid: ENTITY_DEFAULT_GROUP_ID,
				attributes: ['RawType', 'EffectiveCategoryFk', 'Uuid', 'DescriptionInfo', 'Sorting', 'DueDate', 'PriorityFk', 'StatusFk', 'Color']
			}, {
				gid: 'linkageGroup',
				attributes: ['DefectFk', 'InfoRequestFk', 'HsqChecklistFk', 'MeasurementFk'] //, 'viewpointfk'
			}, {
				gid: 'responsibilityGroup',
				attributes: ['ClerkFk', 'BusinessPartnerFk', 'SubsidiaryFk', 'BpdContactFk']
			}],
			overloads: {
				// TODO: RawType
				Color: {
					type: FieldType.Color
				},
				ProjectFk: {
					...pjLookupProvider.generateProjectLookup(),
					readonly: true
				},
				ModelFk: {
					...mdlLookupProvider.generateModelLookup(),
					readonly: true
				},
				// TODO: DefectFk waiting for lookup from DEV-19448
				// TODO: InfoRequestFk waiting for lookup from DEV-19453
				// TODO: HsqChecklistFk waiting for lookup from DEV-19477
				// TODO: ViewpointFk
				// TODO: MeasurementFk waiting for lookup from DEV-19478
				// TODO: EffectiveCategoryFk
				StatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideModelAnnotationStatusReadonlyLookupOverload(),
				PriorityFk: BasicsSharedCustomizeLookupOverloadProvider.providePriorityLookupOverload(false),
				ClerkFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
				// TODO: BusinessPartnerFk waiting for lookup from DEV-20039
				// TODO: BpdContactFk waiting for lookup from DEV-20040
				// TODO: SubsidiaryFk waiting for lookup from DEV-20041
			},
			labels: {
				...prefixAllTranslationKeys('model.annotation.', {
					contextGroup: 'contextGroup',
					linkageGroup: 'linkageGroup',
					responsibilityGroup: 'responsibilityGroup',
					RawType: 'type',
					EffectiveCategoryFk: 'category',
					Uuid: 'uuid',
					DueDate: 'dueDate',
					PriorityFk: 'priority',
					Color: 'color',
					DefectFk: 'defect',
					InfoRequestFk: 'rfi',
					HsqChecklistFk: 'hsqeChecklist',
					MeasurementFk: 'measurementValue'
				})
			}
		};
	}
});
