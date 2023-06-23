import { join } from 'path'
import forms from '@tailwindcss/forms'
import skeleton from '@skeletonlabs/skeleton/tailwind/skeleton.cjs'

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')],
	theme: {
		extend: {
		    colors: {
			'red': 'var(--color-red)',
			'orange': 'var(--color-orange)',
			'yellow': 'var(--color-yellow)',
			'green': 'var(--color-green)',
			'blue': 'var(--color-blue)',
			'purple': 'var(--color-purple)',
		  },
		},
	},
	plugins: [forms,...skeleton(),
		function ({ addUtilities }) {
			const newUtilities = {
			  '.w-fill-available': {
				width: '-webkit-fill-available',
			  },
			  '.moz-available': {
				width: '-moz-available',
			  }
			}
			addUtilities(newUtilities)
		  }
		],
}