import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { preprocessMeltUI } from '@melt-ui/pp';
import { markdoc } from 'svelte-markdoc-preprocess';
import sequence from 'svelte-sequential-preprocessor';
import nodeAdapter from '@sveltejs/adapter-node';

function absolute(path) {
    return join(dirname(fileURLToPath(import.meta.url)), path);
}

const isVercel = process.env.VERCEL === '1';

/** @type {import('@sveltejs/kit').Config}*/
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    preprocess: sequence([
        vitePreprocess(),
        markdoc({
            generateSchema: true,
            nodes: absolute('./src/markdoc/nodes/_Module.svelte'),
            tags: absolute('./src/markdoc/tags/_Module.svelte'),
            partials: absolute('./src/partials'),
            layouts: {
                default: absolute('./src/markdoc/layouts/Article.svelte'),
                article: absolute('./src/markdoc/layouts/Article.svelte'),
                tutorial: absolute('./src/markdoc/layouts/Tutorial.svelte'),
                post: absolute('./src/markdoc/layouts/Post.svelte'),
                author: absolute('./src/markdoc/layouts/Author.svelte'),
                category: absolute('./src/markdoc/layouts/Category.svelte'),
                policy: absolute('./src/markdoc/layouts/Policy.svelte'),
                changelog: absolute('./src/markdoc/layouts/Changelog.svelte')
            }
        }),
        preprocessMeltUI()
    ]),
    extensions: ['.markdoc', '.svelte', '.md'],
    kit: {
        adapter: nodeAdapter(),
        files: {
            hooks: {
                server: isVercel ? undefined : './src/hooks/server.ts'
            }
        },
        alias: {
            $routes: './src/routes',
            $scss: './src/scss',
            $icons: './src/icons',
            $appwrite: './node_modules/@appwrite.io/repo',
            $markdoc: './src/markdoc'
        },
        prerender: {
            concurrency: 32
        }
    }
};
export default config;