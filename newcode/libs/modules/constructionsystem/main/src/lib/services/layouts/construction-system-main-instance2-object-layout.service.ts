/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import { IInitializationContext, prefixAllTranslationKeys, ServiceLocator } from '@libs/platform/common';
import { IInstanceHeaderParameterEntity } from '../../model/entities/instance-header-parameter-entity.interface';
import {
	ConstructionSystemSharedParameterLayoutHelperService,
	IInstance2ObjectEntity
} from '@libs/constructionsystem/shared';
import { ConstructionSystemMainInstanceDataService } from '../construction-system-main-instance-data.service';
import { ControllingSharedControllingUnitLookupService } from '@libs/controlling/shared';
import { IControllingUnitLookupEntity } from '@libs/controlling/interfaces';

/**
 * The Construction System Main Header parameter layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainInstance2ObjectLayoutService {
	private readonly constructionSystemSharedParameterLayoutHelperService = ServiceLocator.injector.get(ConstructionSystemSharedParameterLayoutHelperService<IInstanceHeaderParameterEntity>);
	private readonly instanceService = ServiceLocator.injector.get(ConstructionSystemMainInstanceDataService);

	public async generateLayout(ctx: IInitializationContext): Promise<ILayoutConfiguration<IInstance2ObjectEntity>> {
		// const mlp = await ctx.lazyInjector.inject(MODEL_LOOKUP_PROVIDER_TOKEN);
		// const projectId = this.instanceService.getCurrentSelectedProjectId();
		return {
			groups: [
				{
					gid: 'baseGroup',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['ModelFk', 'ObjectFk', 'ObjectSetFk', 'MeshId', 'CpiId', 'CadIdInt', 'IsNegative', 'IsComposite', 'IsParameterChanged', 'IsOldModel'],
				},
				{
					gid: 'referenceGroup',
					title: {
						key: 'model.main.referenceGroup',
						text: 'References', ///need to check
					},
					attributes: ['ControllingUnitFk'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('constructionsystem.main.', {
					PropertyName: { key: 'entityPropertyName', text: 'Property Name' },
					IsInherit: { key: 'entityIsInherit', text: 'Is Inherit' },
					IsOldModel: { key: 'entityIsOldModel', text: 'Is From Old Model' },
				}),
				...prefixAllTranslationKeys('model.main.', {
					MeshId: { key: 'objectMeshId', text: 'Geometrical ID' },
					CadIdInt: { key: 'objectCadIdInt', text: 'Numerical CAD-Id' },
					IsNegative: { key: 'objectIsNegative', text: 'Negative' },
					IsComposite: { key: 'objectIsComposite', text: 'Composite' },
					IsParameterChanged: { key: 'entityIsParameterChanged', text: 'Is Parameter Changed' },
					referenceGroup: { key: 'referenceGroup', text: 'References' },
					CpiId: { key: 'objectCpiId', text: 'CPI-Id' },
					ModelFk: { key: 'entityModel' },
					ObjectFk: { key: 'entityObject' },
					ObjectSetFk: { key: 'objectSet.entity' },
					ControllingUnitFk: { key: 'entityControllingUnit' },
				}),
			},
			overloads: {
				MeshId: { readonly: true },
				CpiId: { readonly: true },
				IsNegative: { readonly: true },
				IsComposite: { readonly: true },
				IsParameterChanged: { readonly: true },
				IsOldModel: { readonly: true },
				ModelFk: { readonly: true },
				ObjectFk: { readonly: true },
				ObjectSetFk: { readonly: true },
				// ModelFk: {
				// 	...mlp.generateModelLookup({ /// this lookup does not work well, I annotate it temporary
				// 		includeComposite: true,
				// 		restrictToProjectIds: projectId ? [projectId] : undefined,
				// 	}),
				// 	...{ readonly: true },
				// },
				// ObjectFk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({ TODO:lookup is not ready
				// 	dataServiceName: 'modelMainObjectLookupDataService',
				// 	enableCache: true,
				// 	filter: function (item) {
				// 		return item.ModelFk;
				// 	},
				// 	readonly: true
				// }),
				// objectsetfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({ TODO: lookup is not ready
				// 	dataServiceName: 'modelMainObjectSetLookupDataService',
				// 	enableCache: true,
				// 	filter: function () {
				// 		return getProjectId();
				// 	},
				// 	readonly: true
				// }),
				// controllingunitfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({ todo
				// 	dataServiceName: 'controllingStructureUnitLookupDataService',
				// 	filter: function () {
				// 		return getProjectId();
				// 	},
				// 	readonly: true
				// })
				ControllingUnitFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ControllingSharedControllingUnitLookupService,
						clientSideFilter: {
							execute(item:  IControllingUnitLookupEntity, context: ILookupContext< IControllingUnitLookupEntity, IInstance2ObjectEntity>): boolean {
								if(item.ControllingunitFk === undefined){
									item.ControllingunitFk = 0;
								}
								return true;
							},
						},
					}),
					readonly: true,
				},
			},
		};
	}
}
