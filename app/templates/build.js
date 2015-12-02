({
    baseUrl: "src/content/script",
    mainConfigFile: 'src/content/script/main.js',
    include: ['requireLib','main'],
    name: "main",
    out: "src/content/script/main-built.js",
    paths: {
        requireLib: "require"
    }
})
