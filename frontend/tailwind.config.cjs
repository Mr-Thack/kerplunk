import { join } from 'path'
import forms from '@tailwindcss/forms'
import skeleton from '@skeletonlabs/skeleton/tailwind/skeleton.cjs'

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')],
	theme: {
		extend: {},
	},
	plugins: [forms,...skeleton(),
		function ({ addUtilities }) {
			const newUtilities = {
			  '.w-fill-available': {
				width: '-webkit-fill-available',
			  },
			  '.moz-available': {
				width: '-moz-available',
			  },
			  '.color-red': {
				color: 'var(--color-red)',
			  },
			  '.color-orange': {
				color: 'var(--color-orange)',
			  },
			  '.color-yellow': {
				color: 'var(--color-yellow)',
			  },
			  '.color-green': {
				color: 'var(--color-green)',
			  },
			  '.color-blue': {
				color: 'var(--color-blue)',
			  },
			  '.color-purple': {
				color: 'var(--color-purple)',
			  },
			}
			addUtilities(newUtilities)
		  }
		],
}
