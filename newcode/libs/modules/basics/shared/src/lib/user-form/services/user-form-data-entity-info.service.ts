/*
 * Copyright(c) RIB Software GmbH
 */

import { runInInjectionContext } from '@angular/core';
import { EntityInfo, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { CompleteIdentification, IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { IUserFormDataEntity } from '../model/entities/user-form-data-entity.interface';
import { BasicsSharedUserFormDataService } from '../model/user-form-data-service.class';
import { IUserFormDataEntityInfoBehaviorOptions, IUserFormDataEntityInfoOptions, IUserFormDataWizardConfig } from '../model/interfaces/user-form-data-entity-info-options.interface';
import { BasicsSharedUserFormDataGridBehavior } from '../behaviors/user-form-data-behavior.service';
import { EntityDomainType, IEntitySchema, IEntitySelection } from '@libs/platform/data-access';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { IUserFormDataStatusEntity } from '../model/entities/user-form-data-status-entity.interface';
import { BasicsSharedUserFormDataStatusLookupService } from './lookup-services/user-form-data-status-lookup.service';
import { BasicsSharedUserFormLookupService } from './lookup-services/user-form-lookup.service';
import { IUserFormEntity } from '../model/entities/user-form-entity.interface';
import { BasicsSharedUserFormDataValidationService } from '../model/user-form-data-validation-service.class';

/**
 * User form entity service to help to create entity info for module.
 */
export class BasicsSharedUserFormDataEntityInfoFactory {
	private static _defaultWizardUuid = '756badc830b74fdcbf6b6ddc3f92f7bd';
	private static _dataServiceCache = new Map<string, IEntitySelection<IUserFormDataEntity>>();
	private static _behaviorCache = new Map<string, IEntityContainerBehavior<IGridContainerLink<IUserFormDataEntity>, IUserFormDataEntity>>();
	private static _wizardConfigCache = new Map<string, IUserFormDataWizardConfig[]>();

	private static getDataServiceInternal<PT extends object, PU extends CompleteIdentification<PT>>(
		options: IUserFormDataEntityInfoOptions<PT, PU>,
		context: IInitializationContext,
	) {
		const uuid = options.containerUuid || options.permissionUuid;
		let instance = BasicsSharedUserFormDataEntityInfoFactory.getDataServiceFromCache(uuid);

		if (!instance) {
			if (options.dataServiceFn) {
				instance = options.dataServiceFn(context);
			} else {
				instance = runInInjectionContext(context.injector, () => new BasicsSharedUserFormDataService<PT, PU>({
					rubric: options.rubric,
					parentService: options.parentServiceFn(context),
					isParentReadonly: (parentService) => {
						return !!(options.isParentReadonly && options.isParentReadonly(parentService, context));
					}
				}));
			}
			BasicsSharedUserFormDataEntityInfoFactory._dataServiceCache.set(uuid, instance);
		}
		return instance as BasicsSharedUserFormDataService<PT, PU>;
	}

	private static getBehaviorInternal<PT extends object, PU extends CompleteIdentification<PT>>(
		options: IUserFormDataEntityInfoOptions<PT, PU>,
		context: IInitializationContext,
	) {
		const uuid = options.containerUuid || options.permissionUuid;
		let instance = BasicsSharedUserFormDataEntityInfoFactory.getBehaviorFromCache(uuid);

		if (!instance) {
			const dataService = BasicsSharedUserFormDataEntityInfoFactory.getDataServiceInternal<PT, PU>(options, context);
			const behaviorOptions: IUserFormDataEntityInfoBehaviorOptions<PT> = {
				permissionUuid: options.permissionUuid,
				dataService: dataService,
				parentService: options.parentServiceFn(context),
				isParentAndSelectedReadonly: () => {
					return dataService.isParentAndSelectedReadonly();
				},
				onCreate: options.onBehaviorCreate,
				onDestroy: options.onBehaviorDestroy,
				bulkEditorSupport: options.bulkEditorSupport
			};
			instance = runInInjectionContext(context.injector, () => new BasicsSharedUserFormDataGridBehavior<PT>(behaviorOptions));
			BasicsSharedUserFormDataEntityInfoFactory._behaviorCache.set(uuid, instance);
		}
		return instance;
	}

	private static cacheWizardConfig<PT extends object, PU extends CompleteIdentification<PT>>(
		options: IUserFormDataEntityInfoOptions<PT, PU>,
		context: IInitializationContext,
	) {
		if (!options.disabledChangeStatusViaWizard) {
			const wizardUuid = options.statusChangeWizardUuid as string || BasicsSharedUserFormDataEntityInfoFactory._defaultWizardUuid;
			const moduleName = context.moduleManager.activeModule?.internalModuleName as string;
			const uuid = options.containerUuid || options.permissionUuid;

			let conf = BasicsSharedUserFormDataEntityInfoFactory.getWizardConfigFromCache(wizardUuid);
			if (!conf) {
				conf = [];
			}

			conf.push({
				moduleName: moduleName,
				uuid: uuid
			});

			BasicsSharedUserFormDataEntityInfoFactory._wizardConfigCache.set(wizardUuid.toLowerCase(), conf);
		}
	}

	/**
	 * Retrieve the data service from cache according to the container uuid.
	 * @param uuid containerUuid
	 */
	public static getDataServiceFromCache(uuid: string) {
		return BasicsSharedUserFormDataEntityInfoFactory._dataServiceCache.get(uuid);
	}

	/**
	 * Retrieve the behavior service from cache according to the container uuid.
	 * @param uuid containerUuid
	 */
	public static getBehaviorFromCache(uuid: string) {
		return BasicsSharedUserFormDataEntityInfoFactory._behaviorCache.get(uuid);
	}

	/**
	 * Retrieve the wizard config from cache according to the wizard uuid.
	 * @param wizardUuid The wizard uuid
	 */
	public static getWizardConfigFromCache(wizardUuid: string) {
		return BasicsSharedUserFormDataEntityInfoFactory._wizardConfigCache.get(wizardUuid.toLowerCase());
	}

	private static getEntitySchema<PT extends object, PU extends CompleteIdentification<PT>>(options: IUserFormDataEntityInfoOptions<PT, PU>) {
		let schema: IEntitySchema<IUserFormDataEntity> = {
			schema: 'FormDataDto',
			properties: {
				Id: {
					domain: EntityDomainType.Integer,
					mandatory: true
				},
				FormFk: {
					domain: EntityDomainType.Integer,
					mandatory: true
				},
				RubricFk: {
					domain: EntityDomainType.Integer,
					mandatory: true
				},
				IsReadonly: {
					domain: EntityDomainType.Boolean,
					mandatory: true
				},
				InsertedAt: {
					mandatory: true,
					domain: EntityDomainType.Date
				},
				InsertedBy: {
					mandatory: true,
					domain: EntityDomainType.Integer
				},
				UpdatedAt: {
					domain: EntityDomainType.Date,
					mandatory: true
				},
				UpdatedBy: {
					domain: EntityDomainType.Integer,
					mandatory: false
				},
				Version: {
					mandatory: true,
					domain: EntityDomainType.Integer
				},
				FormDataStatusFk: {
					domain: EntityDomainType.Integer,
					mandatory: true
				}
			},
			additionalProperties: {
				'FormDataIntersection.DescriptionInfo.Translated': {
					domain: EntityDomainType.Description,
					mandatory: false
				}
			}
		};
		if (options.entitySchemaFn) {
			schema = options.entitySchemaFn(schema);
		}
		return schema;
	}

	private static getValidationService<PT extends object, PU extends CompleteIdentification<PT>>(options: IUserFormDataEntityInfoOptions<PT, PU>) {
		return (ctx: IInitializationContext) => {
			if (options.validationServiceFn) {
				return options.validationServiceFn(ctx);
			}
			return runInInjectionContext(ctx.injector, () => {
				return new BasicsSharedUserFormDataValidationService(BasicsSharedUserFormDataEntityInfoFactory.getDataServiceInternal<PT, PU>(options, ctx));
			});
		};
	}

	private static getDataService<PT extends object, PU extends CompleteIdentification<PT>>(options: IUserFormDataEntityInfoOptions<PT, PU>) {
		return (ctx: IInitializationContext) => {
			return BasicsSharedUserFormDataEntityInfoFactory.getDataServiceInternal<PT, PU>(options, ctx);
		};
	}

	private static getBehaviorService<PT extends object, PU extends CompleteIdentification<PT>>(options: IUserFormDataEntityInfoOptions<PT, PU>) {
		return (ctx: IInitializationContext) => {
			return BasicsSharedUserFormDataEntityInfoFactory.getBehaviorInternal<PT, PU>(options, ctx);
		};
	}

	private static getLayoutConfiguration<PT extends object, PU extends CompleteIdentification<PT>>(options: IUserFormDataEntityInfoOptions<PT, PU>) {
		return (ctx: IInitializationContext) => {
			const layout: ILayoutConfiguration<IUserFormDataEntity> = {
				groups: [{
					gid: 'basicData',
					attributes: ['FormFk', 'Description', 'FormDataStatusFk'],
					additionalAttributes: ['FormDataIntersection.DescriptionInfo.Translated']
				}],
				labels: {
					...prefixAllTranslationKeys('cloud.common.', {
						FormFk: {
							key: 'entityUserForm'
						},
						FormDataStatusFk: {
							key: 'entityStatus'
						},
						'FormDataIntersection.DescriptionInfo.Translated': {
							key: 'entityDescription'
						},
					})
				},
				overloads: {
					FormFk: {
						type: FieldType.Lookup,
						width: 150,
						lookupOptions: createLookup<IUserFormDataEntity, IUserFormEntity>({
							dataServiceToken: BasicsSharedUserFormLookupService
						})
					},
					FormDataStatusFk: {
						readonly: true,
						type: FieldType.Lookup,
						width: 150,
						lookupOptions: createLookup<IUserFormDataEntity, IUserFormDataStatusEntity>({
							dataServiceToken: BasicsSharedUserFormDataStatusLookupService
						})
					}
				},
				additionalOverloads: {
					'FormDataIntersection.DescriptionInfo.Translated': {
						width: 180,
						type: FieldType.Description,
						searchable: true
					}
				}
			};

			return options.layoutConfigurationFn ? options.layoutConfigurationFn(layout, ctx) : layout;
		};
	}

	/**
	 * Create user form data entity info.
	 * @param options
	 */
	public static create<PT extends object, PU extends CompleteIdentification<PT>>(options: IUserFormDataEntityInfoOptions<PT, PU>): EntityInfo {
		return EntityInfo.create<IUserFormDataEntity>({
			grid: {
				containerUuid: options.containerUuid,
				title: options.gridTitle || {
					text: 'Form Data',
					key: 'cloud.common.ContainerUserformDefaultTitle'
				},
				behavior: BasicsSharedUserFormDataEntityInfoFactory.getBehaviorService<PT, PU>(options)
			},
			form: !options.detailTitle || !options.detailUuid ? undefined : {
				title: options.detailTitle,
				containerUuid: options.detailUuid
			},
			dataService: BasicsSharedUserFormDataEntityInfoFactory.getDataService<PT, PU>(options),
			validationService: BasicsSharedUserFormDataEntityInfoFactory.getValidationService<PT, PU>(options),
			permissionUuid: options.permissionUuid,
			dtoSchemeId: {
				moduleSubModule: 'Basics.UserForm',
				typeName: 'FormDataDto'
			},
			entitySchema: BasicsSharedUserFormDataEntityInfoFactory.getEntitySchema<PT, PU>(options),
			layoutConfiguration: BasicsSharedUserFormDataEntityInfoFactory.getLayoutConfiguration<PT, PU>(options),
			prepareEntityContainer: async (ctx) => {
				await ctx.translateService.load('basics.userform');
				BasicsSharedUserFormDataEntityInfoFactory.cacheWizardConfig(options, ctx);
			}
		});
	}
}