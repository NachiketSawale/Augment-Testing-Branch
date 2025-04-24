/*
 * Copyright(c) RIB Software GmbH
 */

export * from './lib/platform-data-access.module';

export * from './lib/model/data-processor/entity-processor.interface';
export * from './lib/model/data-processor/entity-array-processor.class';
export * from './lib/model/data-processor/entity-base-processor.class';
export { NewEntityValidationProcessor } from './lib/model/data-processor/new-entity-validation-processor.class';
export { EntityDateProcessorFactory } from './lib/model/data-processor/entity-date-processor-factory.service';
export { EntityDateProcessor } from './lib/model/data-processor/entity-date-processor.class';


/*
 Six complete services classes provided (three for hierarchical still not ready)
 */
export { DataServiceFlatRoot } from './lib/model/data-service/data-service-flat-root.class';
export { DataServiceFlatNode } from './lib/model/data-service/data-service-flat-node.class';
export { DataServiceFlatLeaf } from './lib/model/data-service/data-service-flat-leaf.class';
export { DataServiceHierarchicalRoot } from './lib/model/data-service/data-service-hierarchical-root.class';
export { DataServiceHierarchicalNode } from './lib/model/data-service/data-service-hierarchical-node.class';
export { DataServiceHierarchicalLeaf } from './lib/model/data-service/data-service-hierarchical-leaf.class';

/*
 Options for data services
 */
export { IDataServiceOptions } from './lib/model/data-service/interface/options/data-service-options.interface';
export {
    IDataServiceChildRoleOptions
} from './lib/model/data-service/interface/options/data-service-child-role-options.interface';
export { IDataServiceEndPointOptions } from './lib/model/data-service/data-service-end-point-options.interface';
export { IDataServiceRoleOptions, ServiceRole } from './lib/model/data-service/interface/options/data-service-role-options.interface';

export * from './lib/model/runtime-data/index';

export { Validator } from './lib/model/validation/validator.type';
export { IValidationFunctions } from './lib/model/validation/validation-functions.interface';
export { IValidationService } from './lib/model/validation/validation-service.interface';
export { BaseValidationService } from './lib/model/validation/base-validation.service';
export { BaseRevalidationService } from './lib/model/revalidation/base-revalidation.service';
export { BaseGeneratorRevalidationService } from './lib/model/revalidation/base-generator-revalidation-service';
export { IRevalidator } from './lib/model/revalidation/revalidators.interface';
export { IRevalidationFunctions } from './lib/model/revalidation/revalidation-functions.interface';
export { RevalidationInfo } from './lib/model/revalidation/revalidation-info.class';
export { ValidationInfo } from './lib/model/validation/validation-info.class';
export {
	ValidationResult,
	isValidationResultPromise
} from './lib/model/validation/validation-result.class';
export { ValidationServiceFactory } from './lib/model/validation/validation-service-factory.class';


export * from './lib/model/entity-schema/entity-domain-type.enum';
export * from './lib/model/entity-schema/concrete-entity-schema-property.interface';
export * from './lib/model/entity-schema/entity-schema-property.interface';
export * from './lib/model/entity-schema/entity-schema-simple-property.interface';
export * from './lib/model/entity-schema/entity-schema-string-property.interface';
export * from './lib/model/entity-schema/entity-schema.interface';
export * from './lib/model/entity-schema/entity-schema-id.interface';
export * from './lib/model/entity-schema/platform-schema.service';
export * from './lib/model/entity-schema/entity-schema-evaluator.class';

export * from './lib/model/data-service/interface/entity-runtime-data-registry.interface';
export * from './lib/model/data-service/interface/readonly-entity-runtime-data-registry.interface';

export { IRootRole } from './lib/model/data-service/interface/root-role.interface';
export { IRootRoleBase } from './lib/model/data-service/interface/root-role-base.interface';
export { IParentRole } from './lib/model/data-service/interface/parent-role.interface';
export { IChildRoleBase } from './lib/model/data-service/interface/child-role-base.interface';
export { IEntityUpdateAccessor } from './lib/model/data-service/interface/entity-update-accessor.interface';
export { IChildModificationRegistration } from './lib/model/data-service/interface/child-modification-registration.interface';

export { IDataCacheProvider } from './lib/model/data-provider/data-cache-provider.interface';

export { IEntityList } from './lib/model/data-service/interface/entity-list.interface';
export { IEntityTree } from './lib/model/data-service/interface/entity-tree.interface';
export { IEntityTreeOperations } from './lib/model/data-service/interface/entity-tree-operations.interface';
export { IDataProvider } from './lib/model/data-provider/data-provider.interface';
export { IRootDataProvider } from './lib/model/data-provider/root-data-provider.interface';

export * from './lib/model/data-service/interface/entity-selection.interface';
export * from './lib/model/data-service/interface/entity-modification.interface';
export * from './lib/model/data-service/interface/entity-create.interface';
export * from './lib/model/data-service/interface/entity-create-child.interface';
export * from './lib/model/data-service/interface/entity-delete.interface';
export * from './lib/model/data-service/interface/entity-list.interface';

export { HttpDataProvider } from './lib/model/data-provider/http-data-provider.class';
export { HttpRootDataProvider } from './lib/model/data-provider/http-root-data-provider.class';

export * from './lib/model/runtime-data/entity-runtime-data.class';

export {SimpleIdIdentificationDataConverter} from './lib/model/data-service/integral-part/simple-id-identification-data.converter';

export { IDataTranslations } from './lib/model/data-translation/data-translations.interface';
export { DataTranslationEntity } from './lib/model/data-translation/data-translation-entity.model';
export { EntityDataTranslationService } from './lib/services/entity-data-translation.service';

export { PlatformModuleEntityCreationConfigService } from './lib/services/platform-module-entity-creation-config.service';
export * from './lib/model/data-service/interface/entity-create-dialog-setting.interface';
export * from './lib/model/data-service/interface/entity-dynamic-create-dialog-service.interface';
export * from './lib/model/data-service/interface/entity-data-configuration.interface';
export * from './lib/model/data-service/interface/entity-data-creation-context.interface';

export * from './lib/model/data-drag-drop/drag-drop-target.class';
export * from './lib/services/platform-data-access-list-utility.class';

export * from './lib/model/data-service/data-service-base.class';
export * from './lib/model/data-service/interface/entity-navigation.interface';