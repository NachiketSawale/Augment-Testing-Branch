/*
 * Copyright(c) RIB Software GmbH
 */

import { ProviderToken } from '@angular/core';
import { EntityInfo, IFormContainerSettings, IGridContainerSettings } from '@libs/ui/business-base';
import { ControllingSharedGroupSetLayoutService } from '../controlling-shared-group-set-layout.service';
import { ControllingUnitGroupSetCompleteIdentification, ControllingUnitGroupSetParentServiceFlatTypes, IControllingUnitdGroupSetEntity, IControllingUnitGroupSetEntityIdentification } from '@libs/controlling/interfaces';
import { DynamicControllingGroupSetFactoryService, IControllingSharedGroupSetServiceInterface } from '../controlling-shared-group-set-factory.service';
import { ControllingSharedGroupSetValidationFactoryService } from '../controlling-shared-group-set-validation-factory.service';
import { ControllingSharedGroupSetDataService } from '../controlling-shared-group-set-data.service';
import { ControllingSharedGroupSetValidationService } from '../controlling-shared-group-set-validation.service';

export class ControllingSharedGroupSetEntityInfo {
	public static create<PT extends IControllingUnitGroupSetEntityIdentification, PU extends ControllingUnitGroupSetCompleteIdentification<PT>>(config: {
		permissionUuid: string;
		formUuid?: string;
		dataService?: ControllingSharedGroupSetDataService<IControllingUnitdGroupSetEntity, PT, PU>;
		moduleSubModule?: string;
		typeName?: string;
		layout?: object;
		layoutServiceToken?: ProviderToken<ControllingSharedGroupSetLayoutService>;
		validationService?: ControllingSharedGroupSetValidationService<IControllingUnitdGroupSetEntity, PT, PU>;
		grid?: IGridContainerSettings<IControllingUnitdGroupSetEntity>;
		form?: IFormContainerSettings<IControllingUnitdGroupSetEntity>;
		parentService?: ProviderToken<ControllingUnitGroupSetParentServiceFlatTypes<PT, PU>>;
		getBasItemTypeId?: (parent: PT) => number | null | undefined;
	}) {

		let dataService: ControllingSharedGroupSetDataService<IControllingUnitdGroupSetEntity, PT, PU> | null = config.dataService ?? null;
		let validationService: ControllingSharedGroupSetValidationService<IControllingUnitdGroupSetEntity, PT, PU> | null = config.validationService ?? null;
		const getDataService = () => {
			if (!dataService && config.parentService) {
				const methods: Record<keyof IControllingSharedGroupSetServiceInterface<PT>, (parent: PT) => number | null | undefined> = {
					getBasItemTypeId: (parent: PT): number | null | undefined => {
						return config.getBasItemTypeId ? config.getBasItemTypeId(parent) : undefined;
					},
				};
				dataService = new DynamicControllingGroupSetFactoryService().createDynamicService(config.parentService, methods);
			}
			return dataService!;
		};

		const getValidationService = () => {
			if (!validationService) {
				validationService = new ControllingSharedGroupSetValidationFactoryService().create(getDataService());
			}
			return validationService;
		};


		return EntityInfo.create<IControllingUnitdGroupSetEntity>({
			grid: config.grid || {title: {text: 'Controlling Group Set', key: 'controlling.structure.grpsetdltGridTitle'}},
			form: config.form || {
				containerUuid: config.formUuid || '',
				title: {text: 'Controlling Group Set Details', key: 'controlling.structure.grpsetdltFormTitle'},
			},
			dataService: (ctx) => {
				return getDataService();
			},
			validationService: (ctx) => {
				return getValidationService();
			},
			dtoSchemeId: {moduleSubModule: config.moduleSubModule ?? 'Controlling.Structure', typeName: config.typeName ?? 'ControllingGrpSetDTLDto'},
			permissionUuid: config.permissionUuid,
			layoutConfiguration: (context) => {
				return context.injector.get(ControllingSharedGroupSetLayoutService).generateLayout();
			},
		});
	}
}
