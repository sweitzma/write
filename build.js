import {readSync, writeSync} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import {writeFileSync} from 'fs'

const file = readSync('src/example.md')

const docOpts = {
  title: "JRNL",
  link: [{ rel: "stylesheet", href: "/style.css" }]
}

unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeDocument, docOpts)
  .use(rehypeFormat)
  .use(rehypeStringify)
  .process(file)
  .then((file) => {
    console.error(reporter(file))
    file.history.push('dist/index.html')
    writeSync(file)
  })

