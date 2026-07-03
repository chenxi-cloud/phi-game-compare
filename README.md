# PH Game Compare

面向菲律宾市场的线上博彩平台对比静态网站。

## 技术栈

- [Astro 5](https://astro.build) — 静态站点生成，零 JS 默认输出，SEO 友好
- TypeScript — 类型安全的数据层
- 纯静态部署 — 可托管于 Vercel、Netlify、Cloudflare Pages 等

## 项目结构

```
src/
├── components/       # UI 组件
│   ├── SiteCard.astro      # 单个平台卡片
│   └── SiteSelector.astro  # 首页多选 + 跳转逻辑
├── data/
│   ├── sites.ts            # 平台列表数据
│   └── reports.ts          # 对比报告数据
├── layouts/
│   └── Layout.astro        # 全局布局
├── pages/
│   ├── index.astro         # 首页（选择平台 → 查看报告）
│   ├── 404.astro
│   └── reports/
│       ├── index.astro     # 报告列表
│       └── [slug].astro    # 静态对比报告页
├── styles/
│   └── global.css
├── types/
│   └── index.ts
└── utils/
    └── index.ts
public/
└── logos/                  # 平台 Logo
```

## 快速开始

```bash
npm install
npm run dev      # 开发服务器 http://localhost:4321
npm run build    # 构建静态文件到 dist/
npm run preview  # 预览构建结果
```

## 添加新平台

编辑 `src/data/sites.ts`，追加平台对象。

## 添加对比报告

编辑 `src/data/reports.ts`，追加报告对象。`slug` 需与 `sites` 数组排序后用 `-vs-` 连接一致，例如 `['bet88', 'okbet']` → `bet88-vs-okbet`。

构建时 `[slug].astro` 会通过 `getStaticPaths()` 自动生成对应静态页面。

## 部署

构建产物在 `dist/` 目录，直接上传至任意静态托管即可。部署前请修改 `astro.config.mjs` 中的 `site` 为实际域名。

新增统一开关 src/config/features.mjs 的 REPORTS_PUBLIC = false，整个对比报告体系"隐藏但保留"，将来改成 true 重新构建即可一键全量公开。
