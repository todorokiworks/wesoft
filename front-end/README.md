## Available Scripts

In the project directory, you can run:

``` shell
npm install
npm start
```

## コラム（microCMS）

`.env.example` を `.env.local` にコピーして API キーを設定すると microCMS から記事を取得します（未設定時は `public/data/column.json`）。

```
REACT_APP_MICROCMS_SERVICE_DOMAIN=your-service-id
REACT_APP_MICROCMS_API_KEY=your-api-key
REACT_APP_MICROCMS_ARTICLE_ENDPOINT=wesoft-column
```

`wesoft-column` API のフィールド: `title`, `content`（HTML）, `eyecatch`, `category`（参照）  
カテゴリは記事から自動生成されます。

### column.json → microCMS へインポート

`public/data/column.json` の内容を WRITE API で入稿します。

```bash
# .env.local に MICROCMS_WRITE_API_KEY（POST/PUT 権限）を設定
npm run import:column

# 実行内容の確認のみ
npm run import:column -- --dry-run
```

- カテゴリ API: `categories`（`name` フィールド）
- 記事 API: `wesoft-column`（`title`, `content`, `category`）
- 2 回目以降は `scripts/column-microcms-map.json` を参照して PUT 更新
- 本文内画像: `IMPORT_SITE_ORIGIN` を設定すると `<img>` を HTML に埋め込み

### プリレンダ（SEO）

`npm run build` 時に次を自動実行します。

1. **prebuild** … microCMS → `public/data/column.json` 同期  
2. **postbuild** … `/column`・`/column/categories`・各記事 URL を Puppeteer で HTML 化  

GitHub Actions ではリポジトリ Secrets に以下を登録してください。

- `REACT_APP_MICROCMS_SERVICE_DOMAIN`
- `REACT_APP_MICROCMS_API_KEY`

ローカルでプリレンダを省略する場合: `SKIP_COLUMN_PRERENDER=1 npm run build`