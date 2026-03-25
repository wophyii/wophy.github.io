import {defineConfig} from 'vitepress'

// https://vitepress.vuejs.org/config/app-configs
export default defineConfig({})


export default {
    base: '/wophy.github.io/',
    title: "Wophy的博客",

    themeConfig: {
        // 👇 添加侧边栏配置
        sidebar: [
            {
                text: '首页',
                link: '/',
            },
            {
                text: '关于我',
                link: '/about.md', // 你可以创建这个文件
            },
            {
                text: '文章分类',
                items: [
                    {text: 'spring', link: '/posts/spring/'},
                    {
                        text: 'java',
                        items: [
                            {
                                text: 'validation', items: [
                                        {text: '自定义验证', link: '/posts/java/validation/customized'},
                                    ]
                            },
                        ]
                    },
                    {text: 'mysql', link: '/posts/mysql/'},
                    {text: 'redis', link: '/posts/redis/'},
                ],
            },
        ],

        // 可选：顶部导航栏
        nav: [
            {text: '首页', link: '/'},
            {text: '关于', link: '/about'},
            {text: 'GitHub', link: 'https://github.com/wophyii'},
        ],
    },

}