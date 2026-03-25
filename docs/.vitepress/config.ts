import { defineConfig } from 'vitepress'

export default defineConfig({
    base: '/wophy.github.io/',
    title: "Wophy 的博客",
    description: "基于 VitePress 构建的技术博客",
    lang: 'zh-CN',

    themeConfig: {
        // 顶部导航
        nav: [
            { text: '首页', link: '/' },
            { text: '关于', link: '/about' },
            { text: 'GitHub', link: 'https://github.com/wophyii' },
        ],

        // 侧边栏 - 严格结构
        sidebar: [
            {
                text: '指南',
                items: [
                    { text: '首页', link: '/' },
                    { text: '关于我', link: '/about' },
                ]
            },
            {
                text: '技术文章',
                items: [
                    {
                        text: 'Spring',
                        // link: '/posts/spring/',
                    },
                    {
                        text: 'Java',
                        // Java 作为一个分组，不直接链接，只展开
                        items: [
                            {
                                text: 'Validation',
                                items: [
                                    {
                                        text: '自定义验证',
                                        link: '/posts/java/validation/customized'
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        text: 'MySQL',
                        // link: '/posts/mysql/',
                    },
                    {
                        text: 'Redis',
                        // link: '/posts/redis/',
                    },
                ],
            },
        ],

        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2024-present Wophy',
        },
    },
})