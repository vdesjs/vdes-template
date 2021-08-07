const ghpages = require('gh-pages');


ghpages.publish('packages/docs/doc-en/.vitepress/dist', {
    dest: 'doc-en',
    remove: "packages/*"
}, function(err) {
    console.log(err)
})