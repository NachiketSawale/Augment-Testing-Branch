/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { BasicsBankEntity } from './basics-bank-entity.class';
import { prefixAllTranslationKeys } from '@libs/platform/common';

import { BasicsBankDataService } from '../services/basics-bank-data.service';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';


export class BasicsBankModuleInfo extends BusinessModuleInfoBase {

	public static readonly instance = new BasicsBankModuleInfo();

	private constructor(){
		super();
	}

	public override get internalModuleName(): string {
		return 'basics.bank';
	}

	public override get entities(): EntityInfo[] {
		return [this.basicsBankEntityInfo];
	}

	/**
	 * Loads the translation file used for workflow main
	 */
	public override get preloadedTranslations(): string[] {
		return [this.internalModuleName, 'cloud.common'];
	}

	private readonly basicsBankEntityInfo: EntityInfo = EntityInfo.create({
		grid: {
			title: {key:this.internalModuleName + '.listBankTitle'},
		},
		form: {
			title: {key:this.internalModuleName + '.detailBankTitle' },
			containerUuid:'31d65ad2dc274a26ae91281b8d71a009'
		},
		dataService: (ctx) => ctx.injector.get(BasicsBankDataService),
		dtoSchemeId: { moduleSubModule: this.internalPascalCasedModuleName, typeName: 'BankDto' },
		permissionUuid: 'c33e512fee614bda84485f33093472f7',
		layoutConfiguration: {
			groups: [
				{gid: 'bankData', attributes: ['BankName','BasCountryFk','Zipcode','Sortcode','City','Street','Bic'] },
			],
			overloads: {
				BasCountryFk: BasicsSharedLookupOverloadProvider.provideCountryLookupOverload(true)
			},
			labels: {
				...prefixAllTranslationKeys('basics.bank.', {
					bankData: { key: 'listBankTitle' },
					BasCountryFk: { key: 'BasCountryFk' },
					Sortcode: { key: 'Sortcode' },
					BankName: { key: 'BankName' },
					Street: { key: 'Street' },
					City: { key: 'City' },
					Bic: { key: 'Bic' },
					Zipcode: { key: 'Zipcode' }
				})
			},
		}
	} as IEntityInfo<BasicsBankEntity>);
}
