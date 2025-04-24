import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { UiMainFrameNotificationDisplayComponent } from './notification-display.component';

export default {
	title: 'UiCommonNotificationDisplayComponent',
	component: UiMainFrameNotificationDisplayComponent,
	decorators: [
		moduleMetadata({
			imports: [],
		}),
	],
	argTypes: {
		fontFamily: {
			control: {
				type: 'select',
				options: ['Georgia, serif', 'sans-serif', 'fantasy', 'monospace', 'cursive', 'Calibri', 'Verdana'],
			},
		},
	},
} as Meta<UiMainFrameNotificationDisplayComponent>;

const Template: Story<UiMainFrameNotificationDisplayComponent> = (args: UiMainFrameNotificationDisplayComponent) => ({
	component: UiMainFrameNotificationDisplayComponent,
	props: args,
});

export const SuccessMsg = Template.bind({});
SuccessMsg.args = {
	NotificationData: { message: 'Data enter Successfully', notification_class: 'success' },
	fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
	fontWeight: 500,
};

export const ErrorMsg = Template.bind({});
ErrorMsg.args = {
	NotificationData: { message: 'Please enter valid data', notification_class: 'error' },
	fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
	fontWeight: 500,
};
