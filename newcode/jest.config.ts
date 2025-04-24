const { getJestProjects } = require('@nx/jest');

module.exports = {
	projects: getJestProjects(),
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
};
