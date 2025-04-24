import { Injectable } from '@angular/core';
import { BoqCompositeConfigService } from '@libs/boq/main';
import { EntityDomainType } from '@libs/platform/data-access';
import { IInitializationContext, prefixAllTranslationKeys, Translatable } from '@libs/platform/common';
import { ContainerLayoutConfiguration } from '@libs/ui/business-base';
import { IPrcBoqExtendedEntity } from '@libs/procurement/interfaces';

@Injectable({providedIn: 'root'})
export class ProcurementCommonBoqConfigService extends BoqCompositeConfigService<IPrcBoqExtendedEntity> {
	protected properties = {
		...this.getBoqItemProperties(),
		...this.getBoqHeaderProperties(),
		...{
			'PrcBoq.PackageFk':            { domain: EntityDomainType.Integer, mandatory: false },
			'PrcBoq.MdcControllingunitFk': { domain: EntityDomainType.Integer, mandatory: false },
		}
	};

	protected override getLabels(): {[key: string]: Translatable} {
		return {
			...super.getLabels(),
			...prefixAllTranslationKeys('cloud.common.', {
				'PrcBoq.PackageFk':            'entityPackageCode',
				'PrcBoq.MdcControllingunitFk': 'entityControllingUnitCode'
			}),
		};
	}

	// TODO-BOQ: deactivated because of unexpected compile errors
	//protected override getOverloads(): {[key in AllKeys<IPrcBoqExtendedEntity>]?: FieldOverloadSpec<IPrcBoqExtendedEntity>} {
	//	return {
	//		//...super.getOverloads(),
	//		// Todo-BOQ:
	//		// 'PrcBoq.PackageFk':
	//		// 'PrcBoq.MdcControllingunitFk':
	//	} as {[key in AllKeys<IPrcBoqExtendedEntity>]?: FieldOverloadSpec<IPrcBoqExtendedEntity>};
	//}

	public getPrcBoqLayoutConfiguration(ctx: IInitializationContext): ContainerLayoutConfiguration<IPrcBoqExtendedEntity> {
		return {
			groups: this.getLayoutGroups(),
			labels: this.getLabels(),
			additionalOverloads: {
				...this.getOverloads(),
				// Todo-BOQ:
				// 'PrcBoq.PackageFk':
				// 'PrcBoq.MdcControllingunitFk':
			},
		};
	}
}