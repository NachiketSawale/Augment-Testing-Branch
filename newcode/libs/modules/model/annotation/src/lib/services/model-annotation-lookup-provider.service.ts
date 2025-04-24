/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import {
	createLookup,
	FieldType,
	IGridConfiguration,
	ILookupDialogSearchForm,
	ILookupDialogSearchFormEntity,
	TypedConcreteFieldOverload
} from '@libs/ui/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { PROJECT_LOOKUP_PROVIDER_TOKEN } from '@libs/project/interfaces';
import {
	ANNOTATION_LOOKUP_PROVIDER_TOKEN,
	IAnnotationLookupOptions,
	IAnnotationLookupProvider,
	MODEL_LOOKUP_PROVIDER_TOKEN
} from '@libs/model/interfaces';
import { IModelAnnotationEntity } from '../model/entities/model-annotation-entity.interface';
import { ModelAnnotationLookupDataService } from './model-annotation-lookup-data.service';

/**
 * Provides model annotation lookups.
 */
@LazyInjectable({
	token: ANNOTATION_LOOKUP_PROVIDER_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})
export class ModelAnnotationLookupProviderService implements IAnnotationLookupProvider {

	/**
	 * Generates a lookup field overload definition to pick a model annotation.
	 *
	 * @typeParam T The entity type that contains the reference.
	 *
	 * @param options The options to apply to the lookup.
	 *
	 * @returns The lookup field overload.
	 */
	public generateAnnotationLookup<T extends object>(options?: IAnnotationLookupOptions): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IModelAnnotationEntity>({
				dataServiceToken: ModelAnnotationLookupDataService,
				showClearButton: options?.showClearButton,
				serverSideFilter: {
					key: 'model.annotationDefaultLookup',
					execute: () => {
						const result: { [key: string]: unknown } = {};

						if (Array.isArray(options?.restrictToProjectIds)) {
							result['projectIds'] = options.restrictToProjectIds;
						}

						if (Array.isArray(options?.restrictToModelIds)) {
							result['modelIds'] = options.restrictToModelIds;
						}

						if (typeof options?.includeSubModels === 'boolean') {
							result['includeSubModels'] = options.includeSubModels;
						}

						return result;
					}
				},
				showDialog: true,
				dialogOptions: {
					headerText: {key: 'model.annotation.lookupTitle'}
				},
				dialogSearchForm: async ctx => {
					const [
						pjLookupProvider,
						mdlLookupProvider
					] = await Promise.all([
						ctx.lazyInjector.inject(PROJECT_LOOKUP_PROVIDER_TOKEN),
						ctx.lazyInjector.inject(MODEL_LOOKUP_PROVIDER_TOKEN)
					]);

					const searchForm = <ILookupDialogSearchForm<T>>{
						form: {
							entity: () => {
								const result: ILookupDialogSearchFormEntity = {
									includeSubModels: options?.includeSubModels ?? true
								};

								return result;
							},
							config: {
								groups: [{groupId: 'default'}],
								rows: []
							}
						}
					};

					// TODO: rework once Project lookup is ready (DEV-20002)
					if (!Array.isArray(options?.restrictToProjectIds)) {
						searchForm.form!.config!.rows.push({
							id: 'projectId',
							groupId: 'default',
							type: FieldType.Lookup,
							...pjLookupProvider.generateProjectLookup(),
							model: 'projectId',
							label: {key: 'TODO'}
						});
					}

					if (!Array.isArray(options?.restrictToModelIds)) {
						searchForm.form!.config!.rows.push({
							id: 'modelId',
							groupId: 'default',
							...mdlLookupProvider.generateModelLookup(),
							model: 'modelId',
							label: {key: 'TODO'}
						});
					}

					searchForm.form!.config!.rows.push({
						id: 'includeSubModels',
						groupId: 'default',
						type: FieldType.Boolean,
						model: 'includeSubModels',
						readonly: options?.includeSubModels !== undefined,
						label: {key: 'TODO'}
					}, {
						id: 'clerk',
						groupId: 'default',
						...BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
						model: 'clerkId',
						label: {key: 'TODO'}
					}
					// TODO: business partner lookup (DEV-20039)
					/*, {
						id: 'bpd',
						groupId: 'default';
						...
					}*/);

					return searchForm;
				},
				gridConfig: async ctx => {
					const [
						pjLookupProvider,
						mdlLookupProvider
					] = await Promise.all([
						ctx.lazyInjector.inject(PROJECT_LOOKUP_PROVIDER_TOKEN),
						ctx.lazyInjector.inject(MODEL_LOOKUP_PROVIDER_TOKEN)
					]);

					return <IGridConfiguration<IModelAnnotationEntity>>{
						columns: [{
							id: 'description',
							type: FieldType.Translation,
							model: 'DescriptionInfo',
							label: {key: 'cloud.common.entityDescription'},
							width: 300,
							sortable: true
						}, {
							id: 'uuid',
							model: 'Uuid',
							type: FieldType.Code,
							label: {key: 'model.annotation.uuid'},
							width: 400,
							sortable: true
						}, {
							id: 'model',
							model: 'ModelFk',
							...mdlLookupProvider.generateModelLookup(),
							readonly: true,
							sortable: true,
							label: {key: 'TODO'},
							width: 120
						}, {
							id: 'project',
							model: 'ProjectFk',
							...pjLookupProvider.generateProjectLookup(),
							readonly: true,
							sortable: true,
							label: {key: 'TODO'},
							width: 120
						}]
					};
				}
			})
		};
	}
}
