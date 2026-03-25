import { defineConfig } from 'vitepress'

// https://vitepress.vuejs.org/config/app-configs
export default defineConfig({
    base: '/wophy.github.io/', // ⚠️ 重要：GitHub Pages 子目录必须加这个
    title: "Wophy 的博客",
    description: "基于 VitePress 构建的技术博客",

    themeConfig: {
        // 👇 侧边栏配置
        sidebar: [
            {
                text: '首页',
                link: '/',
            },
            {
                text: '关于我',
                link: '/about',
            },
            {
                text: '文章分类',
                items: [
                    {
                        text: 'Spring',
                        link: '/posts/spring/'
                    },
                    {
                        text: 'Java',
                        items: [
                            {
                                text: 'Validation',
                                items: [
                                    {
                                        text: '自定义验证',
                                        link: '/posts/java/validation/customized'
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        text: 'MySQL',
                        link: '/posts/mysql/'
                    },
                    {
                        text: 'Redis',
                        link: '/posts/redis/'
                    },
                ],
            },
        ],

        // 👇 顶部导航栏
        nav: [
            { text: '首页', link: '/' },
            { text: '关于', link: '/about' },
            { text: 'GitHub', link: 'https://github.com/wophyii' },
        ],

        // 👇 可选：页脚
        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2024-present Wophy'
        }
    },
})