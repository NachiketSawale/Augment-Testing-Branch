/*
 * Copyright(c) RIB Software GmbH
 */

export * from './lib/platform-common.module';

export * from './lib/model';

export * from './lib/services/platform-logon.service';
export * from './lib/services/platform-permission.service';
export * from './lib/services/platform-translate.service';
export * from './lib/services/platform-module-navigation.service';
export * from './lib/pipe/translate.pipe';
export * from './lib/model/translation/translatable.interface';
export * from './lib/model/translation/translation-context.interface';
export * from './lib/model/translation/translation-params-source.type';

export * from './lib/module-management/index';

export * from './lib/model/wizards/wizard.interface';

export * from './lib/utils/model/reference-format.enum';
export * from './lib/model/identification-data.interface';
export * from './lib/utils/model/reference-type.type';
export * from './lib/utils/model/async-factory-enabled.type';
export * from './lib/utils/model/async-ctx-factory-enabled.type';
export * from './lib/utils/model/optionally-async-resource.type';
export * from './lib/utils/model/value-or-type.type';

export * from './lib/services/desktop-group-list.service';
export * from './lib/model/ui-defs/tile.interface';
export * from './lib/model/ui-defs/tile-size.enum';
export * from './lib/model/ui-defs/tile-group.enum';

export * from './lib/helper/mixin-provider.class';

export * from './lib/services/locator.service';
export * from './lib/services/auth-context-interceptor.service';
export * from './lib/services/platform-configuration.service';
export * from './lib/services/context.service'; //TODO  It is not yet clear whether we should keep this service.
export * from './lib/services/platform-search-access.service'; //TODO  It is not yet clear whether we should keep this service.
export * from './lib/services/loading-phase-notifier.service';

export * from './lib/model/loading-notification.interface';

export * from './lib/utils/model/property-path.type';

export * from './lib/services/language.service';
export * from './lib/utils/model/property-accessor.interface';
export * from './lib/utils/model/read-only-property-accessor.interface';
export * from './lib/utils/model/file-select-control-result.interface';

export * from './lib/utils/model/color-format.enum';
export * from './lib/utils/model/sort-direction.enum';
export * from './lib/utils/model/rgb-color.class';

export * from './lib/utils/model/string-utils.model';

export * from './lib/utils/model/entity-context.interface';
export * from './lib/utils/model/orientation.enum';
export * from './lib/utils/model/keyboard-code.enum';

export { PlatformDateService } from './lib/services/platform-date.service';
export { PlatformHttpService } from './lib/services/platform-http.service';

export { ICollectionChange } from './lib/helper/collections/collection-change.interface';

export { ICompany } from './lib/model/company-role/company.interface';
export { IRole } from './lib/model/company-role/role.interface';
export { IGetCompanyRole } from './lib/model/company-role/get-company-role.interface';
export { IRolesLookup } from './lib/model/company-role/roles-lookup.interface';

export { IUiLanguage } from './lib/model/ui-data-languages/ui-language.interface';
export { IDataLanguage } from './lib/model/ui-data-languages/data-language.interface';
export { IDefaultLanguageInfo } from './lib/model/ui-data-languages/default-language-info.interface';
export { IGetUiDataLanguages } from './lib/model/ui-data-languages/get-ui-data-languages.interface';

export { IOidcUserData } from './lib/model/context/oidc-user-data.interface';
export { ISwitchContextData } from './lib/model/context/switch-context-data.interface';
export { IContextData } from './lib/model/context/context-init-data.interface';

export { ISearchAccess } from './lib/interfaces/search-access.interface';
export { ISearchPayload } from './lib/interfaces/search-payload.interface';
export { ISearchResult } from './lib/interfaces/search-result.interface';
export { IFilterResult } from './lib/interfaces/filter-result.interface';

export { PlatformCommonMainviewService } from './lib/services/mainview.service';

export { IDescriptionInfo } from './lib/model/interfaces/description-info.interface';
export { IOtherLanguageDescription } from './lib/model/interfaces/other-language-description.interface';
export { IIconBasisServiceInterface } from './lib/model/interfaces/icon-basis-service.interface';

export { CollectionHelper } from './lib/helper/collections/collection-helper.class';
export { IIdentifiableItem } from './lib/helper/collections/identifiable-item.interface';

export { IEntityIdentification } from './lib/interfaces/entity-identification.interface';

export { CompleteIdentification } from './lib/interfaces/complete-identification.class';

export { IDictionary } from './lib/interfaces/dictionary.interface';

export { Dictionary } from './lib/helper/collections/dictionary.class';

export * from './lib/exception-handling';

export * from './lib/scoped-access';

export * from './lib/feature-registry';

// TODO: remove this or declare differently?
export { desktopGroupList } from './lib/constant/desktopGroupList';

export * from './lib/lazy-injection/index';

export * from './lib/model/entity-base.interface';
export * from './lib/model/entity-base.class';

export * from './lib/model/enum/request-type.enum';
export * from './lib/model/identification-data-mutable.interface';


export * from './lib/reporting/index';

export * from './lib/model/module-navigation/navigation-info.interface';
export * from './lib/model/module-navigation/module-navigation.interface';
export * from './lib/model/http-option/http-options.type';
export * from './lib/interfaces/pinning-context.interface';

export * from './lib/model/sidebar/index';
export * from './lib/model/context/app-context.interface';
export * from './lib/services/pinning-context/platform-pinning-context.service';


// exports platform drag drop interfaces, services, and enum
export * from './lib/interfaces/dragged-data-info.interface';
export * from './lib/interfaces/drag-drop-data-base.interface';
export * from './lib/utils/model/drag-drop-action-type.enum';
export * from './lib/interfaces/drag-drop-target.interface';
export * from './lib/services/platform-drag-drop.service';
export * from './lib/interfaces/drag-drop-action.interface';
export * from './lib/interfaces/drag-drop-state-info.interface';
export * from './lib/model/drag-drop/drag-drop-connection.class';
export * from './lib/model/drag-drop/drag-drop-base.class';