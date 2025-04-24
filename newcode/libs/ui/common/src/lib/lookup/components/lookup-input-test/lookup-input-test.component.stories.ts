/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { UiCommonModule } from '../../../ui-common.module';
import { UiCommonLookupInputTestComponent } from './lookup-input-test.component';

export default {
	title: 'Lookup/UiCommonLookupInputComponent',
	component: UiCommonLookupInputTestComponent,
	decorators: [
		moduleMetadata({
			imports: [UiCommonModule],
		})
	]
} as Meta<UiCommonLookupInputTestComponent>;

const Template: Story<UiCommonLookupInputTestComponent> = (args: UiCommonLookupInputTestComponent) => ({
	component: UiCommonLookupInputTestComponent,
	props: args,
});

export const LookupInput = Template.bind({});
LookupInput.args = {
	value: 1,
	readonly: false
};
