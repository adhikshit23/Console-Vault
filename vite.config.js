import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" keeps asset URLs relative so the built app works from any folder/static host.
export default defineConfig({ base: "./", plugins: [react()] });
