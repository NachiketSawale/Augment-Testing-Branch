import { BusinessModuleInfoBase, EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { FormworkTypeEntity } from './entities/formwork-type-entity.class';
import { FormworkTypeDataService } from '../services/formwork-type-data.service';
import { FormworkTypeGridBehavior } from '../behaviors/formwork-type-grid-behaviors.service';
import { FieldType } from '@libs/ui/common';
import { createFormDialogLookupProvider } from '@libs/basics/shared';
import { PpsProcessTemplateDialogLookupComponent } from '@libs/productionplanning/shared';

export class FormworkTypeModuleInfo extends BusinessModuleInfoBase {
	private readonly cloudCommonModuleName = 'cloud.common';
	private readonly formworkTypeEntityInfo = this.getFormworkTypeEntityInfo();

	public static readonly instance = new FormworkTypeModuleInfo();

	private constructor() {
		super();
	}

	public override get internalModuleName(): string {
		return 'productionplanning.formworktype';
	}

	public override get entities(): EntityInfo[] {
		return [this.formworkTypeEntityInfo];
	}

	/**
	 * Loads the translation file
	 */
	public override get preloadedTranslations(): string[] {
		return super.preloadedTranslations.concat([
			this.cloudCommonModuleName,
			'productionplanning.processconfiguration', // for translation of title(the relevant translation key is 'productionplanning.processconfiguration.processTemplateGridContainerTitle') of process template dialog lookup
		]);
	}

	private getFormworkTypeEntityInfo(): EntityInfo {
		const entityInfo: IEntityInfo<FormworkTypeEntity> = {
			permissionUuid: '1fe7157e2d6b494a9ca312d4e74b38d5',
			dataService: (ctx) => ctx.injector.get(FormworkTypeDataService),
			dtoSchemeId: { moduleSubModule: 'ProductionPlanning.FormworkType', typeName: 'FormworkTypeDto' },
			grid: {
				title: { text: 'Formwork Type', key: this.internalModuleName + '.listTitle' },
				behavior: ctx => ctx.injector.get(FormworkTypeGridBehavior),
			},
			form: {
				title: { text: 'Formwork Type Details', key: this.internalModuleName + '.detailTitle' },
				containerUuid: '2441a13936c84120bfeb0cca18f93d34',
			},
			layoutConfiguration: {
				groups: [
					{
						gid: 'default',
						attributes: ['ProcessTemplateFk'],
					}
				],
				overloads: {
					ProcessTemplateFk: {
						visible: true,
						type: FieldType.CustomComponent,
						componentType: PpsProcessTemplateDialogLookupComponent,
						providers: createFormDialogLookupProvider({
							objectKey: 'ProcessTemplate',
							showSearchButton: true,
						}),
					},

				}
			}
		};

		return EntityInfo.create(entityInfo);
	}
}