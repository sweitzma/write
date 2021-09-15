# Markdown to HTML writing

Goal: simple setup that can take written markdown
and compile it to nicely styled HTML.

Okay I think this should act as a compliation interface rather than the site
itself in the future.

Potential CLI
```
spiff 
  --in-dir <markdown-dir> 
  --out-dir <html-dir>
  [--tw-style-file] <custom tailwindcss file>
  [--watch]
```

## Usage
First make `src` and `dist` directories via
```
$ mkdir src dist
```

You can write markdown in the `src` directory and it will compiled into HTML in
the `dist` directory which will be served by NGINX.

Quick list of commands
```
yarn run b          # build markdown -> html once
yarn run w          # watch markdown files and build on change
yarn run build-css  # build css once
yarn run watch-css  # watch css files and build on change

make build          # build nginx docker image
make start          # start nginx container
make stop           # stop nginx container
```
