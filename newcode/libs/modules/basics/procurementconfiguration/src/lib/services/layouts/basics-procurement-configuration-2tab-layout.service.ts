/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration, ILookupContext, LookupSimpleEntity, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { prefixAllTranslationKeys, ServiceLocator } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { BasicsProcurementConfigModuleDataService } from '../basics-procurement-config-module-data.service';
import { IPrcConfiguration2TabEntity } from '../../model/entities/prc-configuration-2-tab-entity.interface';

/**
 * ProcurementConfiguration 2Tab layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsProcurementConfiguration2TabLayoutService {
	private lookupFactory = inject(UiCommonLookupDataFactoryService);

	/**
	 * Generate layout config
	 */
	public generateLayout(): ILayoutConfiguration<IPrcConfiguration2TabEntity> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['ModuleTabFk', 'IsDisabled', 'Style'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('basics.procurementconfiguration.', {
					ModuleTabFk: {
						key: 'entityTabName',
						text: 'Tab Name',
					},
					IsDisabled: {
						key: 'entityIsDisabled',
						text: 'Is Disabled',
					},
					Style: {
						key: 'entityStyle',
						text: 'Style',
					},
				}),
			},
			overloads: {
				ModuleTabFk: BasicsSharedLookupOverloadProvider.provideTabNameLookupOverload({
					key: 'basics-procurement-configuration-module-tab-filter',
					execute(context: ILookupContext<LookupSimpleEntity, IPrcConfiguration2TabEntity>) {
						const moduleId = ServiceLocator.injector.get(BasicsProcurementConfigModuleDataService).getSelection()[0].Id;
						return 'ModuleFk = ' + moduleId;
					},
				},),
				Style: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataService: this.lookupFactory.fromSimpleItemClass(
							[
								{
									id: 1,
									desc: {
										key: 'basics.procurementconfiguration.lookupItem.normal',
									},
								},
								{
									id: 2,
									desc: {
										key: 'basics.procurementconfiguration.lookupItem.highlighted',
									},
								},
								{
									id: 3,
									desc: {
										key: 'basics.procurementconfiguration.lookupItem.grayout',
									},
								},
							],
							{
								uuid: '',
								valueMember: 'id',
								displayMember: 'desc',
								translateDisplayMember: true,
							},
						),
					}),
				},
			},
		};
	}
}
