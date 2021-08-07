const ghpages = require('gh-pages');


// ghpages.publish('packages/docs/doc-en/.vitepress/dist', {
//     dest: 'docs/doc-en',
// }, function(err) {
//     console.log(err)
// })

ghpages.publish('packages/playground/dist', {
    dest: 'docs/playground',
}, function(err) {
    console.log(err)
})