import {
	BasicsSharedPlainTextContainerComponent, IPlainTextAccessor, PLAIN_TEXT_ACCESSOR
} from '@libs/basics/shared';
import { runInInjectionContext } from '@angular/core';
import { ServiceLocator } from '@libs/platform/common';
import { IInstance2ObjectParamEntity } from '@libs/constructionsystem/shared';

export class ConstructionSystemMainObjectParameterQuantityQueryEditorContainerClass {
	private readonly editor = {
		uuid: 'f738d90e37934b1bad6ae6f76d0c870d',
		id: 'constructionsystem.main.objectParameterQuantityQueryEditor',
		title: {
			text: 'Object Parameter Quantity Query Editor',
			key: 'constructionsystem.main.objParameterQuantityQueryEditorContainerTitle',
		},
		containerType: BasicsSharedPlainTextContainerComponent,//todo need change to quantity query editor
		permission: 'f6733538a0334b299c76c460e12ce569',
		providers: [
			{
				provide: PLAIN_TEXT_ACCESSOR,
				useValue: <IPlainTextAccessor<IInstance2ObjectParamEntity>>{
					getText(entity: IInstance2ObjectParamEntity): string | undefined {
						return entity.QuantityQuery ?? '';
					},
					setText(entity: IInstance2ObjectParamEntity, value?: string) {
						if (value) {
							entity.QuantityQuery = value;
						}
					},
				},
			},
		],
	};

	public getEditor() {
		return this.editor;
	}
}

export const CONSTRUCTION_SYSTEM_MAIN_OBJECT_PARAMETER_QUANTITY_QUERY_EDITOR = runInInjectionContext(ServiceLocator.injector, () => new ConstructionSystemMainObjectParameterQuantityQueryEditorContainerClass().getEditor());