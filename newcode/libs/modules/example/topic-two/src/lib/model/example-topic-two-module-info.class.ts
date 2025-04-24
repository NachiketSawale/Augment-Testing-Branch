import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { BContainerComponent } from '../components/b-container/b-container.component';
import { AContainerComponent } from '../components/a-container/a-container.component';

export class ExampleTopicTwoModuleInfoClass extends BusinessModuleInfoBase {

	public static readonly instance = new ExampleTopicTwoModuleInfoClass();

	private constructor() {
		super();
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		 return super.containers.concat([
			new ContainerDefinition(
				'3c3966045d574dcab3b8c53130b4c480',
				{
					text: 'Test A',
				},
				AContainerComponent
			),
			new ContainerDefinition(
				'3d5c91da4d144a4ab30777df6ed0806e',
				{
					text: 'Test B',
				},
				BContainerComponent
			)
		]);
	}

	public get internalModuleName(): string {
		return 'example.moduletwo';
	}

	public override get entities(): EntityInfo[] {
		return [/*EntityInfo.create({
			id: '',
			permissionUuid: '',
			schema: null,
			dataServiceToken: null
		})*/];
	}

	public override get preloadedTranslations(): string[] {
		return [
			'model.administration'
		];
	}

}