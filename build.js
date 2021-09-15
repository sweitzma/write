import chokidar from 'chokidar';
import path from 'path';
import rehypeDocument from 'rehype-document';
import rehypeFormat from 'rehype-format';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { 
  readdirSync, 
  writeFileSync,
} from 'fs';
import { readSync, writeSync } from 'to-vfile';
import { reporter } from 'vfile-reporter';
import { unified } from 'unified';


const markdownToHtml = (inputFile, outputPath) => {
  const docOpts = {
    title: "JRNL",
    link: [{ rel: "stylesheet", href: "/style.css" }],
    script: [
      String(readSync("live.js")),
      String(readSync("collapse.js")),
    ]
  };
  const secOpts = {
    allowDangerousHtml: true
  };

  unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, secOpts)
    .use(rehypeDocument, docOpts)
    .use(rehypeFormat)
    .use(rehypeStringify, secOpts)
    .process(inputFile)
    .then((file) => {
      console.error(reporter(file))
      file.history.push(outputPath)
      writeSync(file)
    });
};

// create index file by scanning markdown in source directory
const indexFile = (srcDir, distDir) => {
  let indexMarkdown = "## Index"
  readdirSync(srcDir).forEach((file) => {
    const [baseName, ext] = file.split(".");
    if (ext === "md") {
      indexMarkdown += `\n- [${baseName}](/${baseName}.html)`
    }
  });
  markdownToHtml(indexMarkdown, `${distDir}index.html`);
};


let watch = false;
if (process.argv[2] === '-w') {
  watch = true;
}


indexFile('src/', 'dist/')

const srcFolder = 'src/';
readdirSync(srcFolder).forEach((file) => {
  const [baseName, ext] = file.split(".");
  if (ext === "md") {
    const f = readSync(`${srcFolder}${file}`);
    markdownToHtml(f, `dist/${baseName}.html`);
  }
});


// watch for changes to current files
if (watch) {
  console.log("now we're watching for changes")
  chokidar.watch('src/**/*.md').on('change', (p) => {
    const relPath = path.parse(path.relative('src/', p))
    const newPath = path.resolve('dist', relPath.dir, relPath.name + '.html')
    const f = readSync(p);
    markdownToHtml(f, newPath);
  });

  chokidar.watch('src/**/*.md').on('add', (p) => {
    const relPath = path.parse(path.relative('src/', p))
    const newPath = path.resolve('dist', relPath.dir, relPath.name + '.html')
    const f = readSync(p);
    markdownToHtml(f, newPath);
    indexFile('src/', 'dist/')
  });

  chokidar.watch('src/**/*.md').on('unlink', (p) => {
    indexFile('src/', 'dist/')
  });
}
