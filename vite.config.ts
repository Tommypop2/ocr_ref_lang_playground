import { defineConfig } from "vite";
import WindiCSS from "vite-plugin-windicss";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
	plugins: [solidPlugin(), WindiCSS()],
	server: {
		port: 3000,
	},
	build: {
		target: "esnext",
	},
});
