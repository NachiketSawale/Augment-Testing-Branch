import {BusinessModuleInfoBase, EntityContainerInjectionTokens, EntityInfo} from '@libs/ui/business-base';
import {TEXT_MODULES_ENTITY_INFO} from './entity-info/text-modules-entity-info.model';
import {MODULE_INFO_TEXTMODULES} from './entity-info/module-info-textmodules.model';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import {SpecificationComponent} from '../components/specification/specification.component';
import {BasicsTextModulesTextDataService} from '../services/text-modules-text-data.service';
import {ITextModuleTextEntity} from './entities/textmoduletext-entity.interface';
import {TEXT_MODULES_HYPERLINK_INFO} from './entity-info/text-modules-hyperlink-entity-info.model';
import {PlainTextComponent} from '../components/plain-text/plain-text.component';
import {IPlainTextAccessor, PLAIN_TEXT_ACCESSOR} from '@libs/basics/shared';

export class BasicsTextModulesModuleInfoClass extends BusinessModuleInfoBase {
	public static get instance(): BasicsTextModulesModuleInfoClass {
		if (!this._instance) {
			this._instance = new BasicsTextModulesModuleInfoClass();
		}

		return this._instance;
	}

	private constructor() {
		super();
	}

	public get internalModuleName(): string {
		return 'basics.textmodules';
	}

	public override get internalPascalCasedModuleName(): string {
		return 'Basics.TextModules';
	}

	private static _instance?: BasicsTextModulesModuleInfoClass;

	public override get entities(): EntityInfo[] {
		return [
			TEXT_MODULES_ENTITY_INFO,TEXT_MODULES_HYPERLINK_INFO
		];
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([
			new ContainerDefinition({
				uuid: '9956e9691f12498faee16f94cce34e86',
				title: 'basics.textmodules.htmlText',
				containerType: SpecificationComponent,
				permission: 'd4c817e7940a4a6a86472934b94ed186',
				id: 'basics.textmodules.specification',
				providers:[
					{
						provide: new EntityContainerInjectionTokens<ITextModuleTextEntity>().dataServiceToken ,
						useExisting: BasicsTextModulesTextDataService
					}
				]
			}),
			new ContainerDefinition({
				uuid: '0d25e7c5b52b4d3cb324fdd2686086b4',
				title: 'basics.textmodules.plainText',
				containerType: PlainTextComponent,
				permission: 'd4c817e7940a4a6a86472934b94ed186',
				id: 'basics.textmodules.plaintext',
				providers: [
					{
						provide: new EntityContainerInjectionTokens<ITextModuleTextEntity>().dataServiceToken,
						useExisting: BasicsTextModulesTextDataService
					},{
						provide: PLAIN_TEXT_ACCESSOR,
						useValue: <IPlainTextAccessor<ITextModuleTextEntity>>{
							setText(entity: ITextModuleTextEntity, value?: string) {
								entity.TextClob!.Content = value;
							}
						}
					}
				]
			})
		]);
	}

	public override get preloadedTranslations(): string[] {
		return super.preloadedTranslations.concat([
			MODULE_INFO_TEXTMODULES.basicsCustomizeModuleName,
			MODULE_INFO_TEXTMODULES.companyModuleName,
			MODULE_INFO_TEXTMODULES.cloudCommonModuleName
		]);
	}
}
