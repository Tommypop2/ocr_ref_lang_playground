import {
	createEffect,
	onMount,
} from "solid-js";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

interface EditorProps {
	isDarkTheme: boolean;
	onContentChange: (code: string) => void;
	newValue: string;
	language?: string;
}
export function Editor(props: EditorProps) {
	let container: HTMLDivElement | undefined;
	createEffect(() => {
		monaco.editor.setTheme(props.isDarkTheme ? "vs-dark" : "vs");
	});
	
	onMount(() => {
		self.MonacoEnvironment = {
			getWorker(_, label) {
				if (label === "typescript" || label === "javascript") {
					return new tsWorker();
				}
				return new editorWorker();
			},
		};
		const currentEditor = monaco.editor.create(container!, {
			value: props.newValue,
			language: props.language,
			automaticLayout: true,
		});
		createEffect(() => {
			currentEditor.setValue(props.newValue);
			currentEditor.getAction("editor.action.formatDocument")?.run();
		})
		currentEditor.onDidChangeModelContent(() => {
			const content = currentEditor.getValue();
			props.onContentChange(content);
		});
		currentEditor.addCommand(
			monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
			() => {
				currentEditor.getAction("editor.action.formatDocument")?.run();
			}
		);
	});
	return <div class="h-full w-auto" ref={container}></div>;
}
