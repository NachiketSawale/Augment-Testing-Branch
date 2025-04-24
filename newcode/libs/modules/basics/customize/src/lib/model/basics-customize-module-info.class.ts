/*
 * Copyright(c) RIB Software GmbH
 */

import {BusinessModuleInfoBase, EntityInfo, IEntityInfo} from '@libs/ui/business-base';
import {IBasicsCustomizeTypeEntity} from './entities/basics-customize-type-entity.interface';
import {prefixAllTranslationKeys} from '@libs/platform/common';

import {BasicsCustomizeTypeDataService} from '../services/basics-customize-type-data.service';


export class BasicsCustomizeModuleInfo extends BusinessModuleInfoBase {

    public static readonly instance = new BasicsCustomizeModuleInfo();

    private constructor(){
		super();
	}

    public override get internalModuleName(): string {
        return 'basics.customize';
    }

    public override get entities(): EntityInfo[] {
        return [this.basicsCustomizeTypeEntityInfo];
    }

    private readonly basicsCustomizeTypeEntityInfo: EntityInfo = EntityInfo.create({
        grid: {
            title: {key: this.internalModuleName + '.entityTypeListTitle'},
        },
        dataService: (ctx) => ctx.injector.get(BasicsCustomizeTypeDataService),
        dtoSchemeId: {moduleSubModule: this.internalPascalCasedModuleName, typeName: 'EntityClassDescriptionDTO'},
        permissionUuid: 'f5e884c670df4f938e51787e7cc40bf7',
        layoutConfiguration: {
            groups: [{
                gid: 'baseGroup',
                attributes: ['Action', 'Name', 'Type', 'ModuleName', 'DBTableName']
            },
            ],
            overloads: {},
            labels: {
                ...prefixAllTranslationKeys('basics.customize.', {
                    Action: {key: 'listBankTitle'},
                    Name: {key: 'entityDataType'},
                    ModuleName: {key: 'entityModule'},
                    DBTableName: {key: 'dbtablename'}
                }),
                ...prefixAllTranslationKeys('cloud.common.', {
                    baseGroup: {key: 'entityProperties'},
                    Type: {key: 'entityType'}
                })
            },
        }
    } as IEntityInfo<IBasicsCustomizeTypeEntity>);
}
