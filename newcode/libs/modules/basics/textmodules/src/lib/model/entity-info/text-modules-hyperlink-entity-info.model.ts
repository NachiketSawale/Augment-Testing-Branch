import {ITextModuleHyperlinkEntity} from '../entities/textmodulehyperlink-entity.interface';
import {EntityInfo} from '@libs/ui/business-base';
import {MODULE_INFO_TEXTMODULES} from './module-info-textmodules.model';
import {TextModulesHyperlinkBehaviorService} from '../../behaviors/text-module-hyperlinks-behavior.service';
import {BasicsTextModulesHyperlinksDataService} from '../../services/text-modules-hyperlinks-data.service';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import {createLookup, FieldType } from '@libs/ui/common';
import {BasicsSharedLanguageLookupService} from '@libs/basics/shared';
import { IBasicsCustomizeLanguageEntity } from '@libs/basics/interfaces';

export const TEXT_MODULES_HYPERLINK_INFO = EntityInfo.create<ITextModuleHyperlinkEntity>({
    grid: {
        title: {
            text: 'Hyperlink',
            key: MODULE_INFO_TEXTMODULES.textModulesModuleName + '.hyperlinkGridTitle'
        },
        containerUuid: '5379349e1e6b4c8cb083e06b0ba83057',
        behavior: ctx => ctx.injector.get(TextModulesHyperlinkBehaviorService)
    },
    form: {
        title: {
            text: 'Hyperlink Details',
            key: MODULE_INFO_TEXTMODULES.textModulesModuleName + '.hyperlinkDetailTitle'
        },
        containerUuid: 'fabddcc9a40d4390b232a0e6cbecec1f'
    },
    dataService: ctx => ctx.injector.get(BasicsTextModulesHyperlinksDataService),
    dtoSchemeId: {
        moduleSubModule: MODULE_INFO_TEXTMODULES.textModulesPascalCasedModuleName,
        typeName: 'TextModuleHyperlinkDto',
    },
    layoutConfiguration: {
        groups: [
            {
                gid: 'basicData',
                attributes: ['LanguageFk', 'DescriptionInfo', 'Url']
            }
        ],
        labels: {
            ...prefixAllTranslationKeys(MODULE_INFO_TEXTMODULES.cloudCommonModuleName + '.', {
                LanguageFk: { key: 'languageColHeader_Language'},
                DescriptionInfo: {key: 'entityDesc'},
            }),
            ...prefixAllTranslationKeys(MODULE_INFO_TEXTMODULES.basicsCustomizeModuleName + '.', {
                Url: { key: 'url'}
            }),
        },
        overloads: {
            LanguageFk:{ label: { text: 'Language', key: MODULE_INFO_TEXTMODULES.basicsCustomizeModuleName + '.language' },
                type: FieldType.Lookup,
                lookupOptions: createLookup<ITextModuleHyperlinkEntity,IBasicsCustomizeLanguageEntity>({
                    dataServiceToken: BasicsSharedLanguageLookupService,
                    showClearButton: true,
                })
            },
        }
    },
    permissionUuid: 'd4c817e7940a4a6a86472934b94ed186'
});
