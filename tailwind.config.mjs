/** @type {import('tailwindcss').Config} */

import defaultTheme from 'tailwindcss/defaultTheme'

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				default: "#FEFDFC",
			},
			fontFamily: {
				serif: ['"Lora"', ...defaultTheme.fontFamily.serif],
			},
			maxWidth: {
				"base": "1500px"
			}
		},
	},
	plugins: [],
}
