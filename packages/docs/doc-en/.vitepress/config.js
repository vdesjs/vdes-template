module.exports = {
    title: "vdes-template",
    base: '/vdes-template/doc-en/',
    description: "High performance javascript template engine",
    head: [["link", { rel: "icon", type: "image/svg+xml", href: "/logo.svg" }]],
    themeConfig: {
        repo: "vdesjs/vdes-template",
        logo: "/logo.svg",
        docsDir: "packages/docs/doc-en",
        docsBranch: "master",
        editLinks: true,
        editLinkText: "Suggest changes to this page",

        nav: [
            {text: 'Guide', link: '/guide/'},
            {text: 'Plugins', link: '/plugins/'},
            {text: 'Playground', link: 'https://vdesjs.github.io/vdes-template/playground/'},
            {text: 'Languages', items: [
                {
                    text: 'English',
                    link: 'https://vdesjs.github.io/vdes-template/doc-en/'
                },
                {
                    text: '中文',
                    link: 'https://vdesjs.github.io/vdes-template/doc-zh/'
                }
            ]}
        ],
        sidebar: {
            '/guide/': 'auto'
        }



    },
};
