const path = require('path');

const nxPreset = require('@nx/jest/preset').default;
module.exports = {
	...nxPreset,
	/* TODO: Update to latest Jest snapshotFormat
	 * By default Nx has kept the older style of Jest Snapshot formats
	 * to prevent breaking of any existing tests with snapshots.
	 * It's recommend you update to the latest format.
	 * You can do this by removing snapshotFormat property
	 * and running tests with --update-snapshot flag.
	 * Example: "nx affected --targets=test --update-snapshot"
	 * More info: https://jestjs.io/docs/upgrading-to-jest29#snapshot-format
	 */
	snapshotFormat: { escapeString: true, printBasicPrototype: true },
	globals: {
		...nxPreset.globals,
		maxConcurrency: 32,
	},
		reporters: [
			'default',
			[
			  'jest-junit',
			  {
				outputDirectory: `${process.env.NX_WORKSPACE_ROOT}/.jest/test_results`,
				outputName: `${process.env['NX_TASK_TARGET_PROJECT']}.junit.xml`,
			  },
			],
		  ],
	coverageDirectory: './coverage',
	coverageReporters: ['lcov', 'text', 'cobertura'], // Include 'cobertura'
	setupFilesAfterEnv:[path.resolve(__dirname,'test-mock/mock-quill.ts')],
};